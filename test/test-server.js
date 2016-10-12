global.DATABASE_URL = 'mongodb://localhost/whisky-app-dev';

var chai = require('chai');
var chaiHttp = require('chai-http');
var bCrypt = require('bcrypt-nodejs');

var server = require('../server.js');
var User = require('../models/user');
var Whisky = require('../models/whisky');


var should = chai.should();
var app = server.app;

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

chai.use(chaiHttp);

describe('Whisky App', function() {
  before(function(done) {
    server.runServer(function() {
      User.create({
        username: "test_user1",
        password: createHash("1234")
      });
      Whisky.create({
        author: "test_user1",
        attributes: {
          name: "Henry McKenna 10 Single Barrel",
          style: "bourbon",
          proof: 100,
          age: 10,
          price: 35,
          bottle_size: "750",
          pour_size: null,
          nose: ["caramel", "banana", "oak", "vanilla", "honey", "cinnamon"],
          flavor: ["honey", "baking spice", "oak"],
          finish: ["oak", "rye"],
          score: 87,
          establishment: null,
          date: "2015-03-25"
        }
      }, function() {
        done();
      });
    });
  });
  it('should use "public" folder to serve assets', function(done) {
    chai.request(app)
        .get('/')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });
  it('should register a new user when provided with a unique username/pass', function(done){
    chai.request(app)
        .post('/register')
        .send({'username': 'test_user2', 'password': '1234'})
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
  });
  it('should prevent a user from registering with an in-use username', function(done) {
    chai.request(app)
      .post('/register')
      .send({'username': 'test_user1', 'password': '1234'})
      .end(function(err, res) {
        res.should.have.status(500);
        done();
      });
  });
  it('should log in a user with the correct credentials', function(done) {
    chai.request(app)
        .post('/login')
        .send({'username': 'test_user1', 'password': '1234'})
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
  });
  it('should prevent a user from logging in with an unregistered username', function(done) {
    chai.request(app)
        .post('/login')
        .send({'username': 'wrong_user', 'password': '1234'})
        .end(function(err, res) {
          res.should.not.have.status(200);
          done();
        });
  });
  it('should prevent a user from logging in with an incorrect password', function(done) {
    chai.request(app)
        .post('/login')
        .send({'username': 'test_user1', 'password': 'wrongpass'})
        .end(function(err, res) {
          res.should.not.have.status(200);
          done();
        });
  });
  it('should provide a list of whisky entries for a given user', function(done) {
    chai.request(app)
        .get('/api/user/whiskies?username=test_user1')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(1);
          res.body[0].should.be.an('object');
          res.body[0].should.have.property('_id');
          res.body[0]._id.should.be.a('string');
          res.body[0].should.have.property('author');
          res.body[0].author.should.be.a('string');
          res.body[0].should.have.property('attributes');
          res.body[0].attributes.should.be.an('object');
          res.body[0].attributes.should.have.property('name');
          res.body[0].attributes.name.should.be.a('string');
          res.body[0].attributes.name.should.equal('Henry McKenna 10 Single Barrel');
          done();
        });
  });
  it("should edit the content of a given whisky in the user's list", function(done) {
    var whiskyId;
    chai.request(app)
        .get('/api/user/whiskies?username=test_user1')
        .end(function(err, res) {
          whiskyId = res.body[0]._id;
          chai.request(app)
              .put('/api/user/whiskies/' + whiskyId)
              .send({
                name: "Henry McKenna 10 Single Barrel Edited",
                style: "bourbon",
                proof: 100,
                age: 10,
                price: 35,
                bottle_size: "750",
                pour_size: null,
                nose: ["caramel", "banana", "oak", "vanilla", "honey", "cinnamon"],
                flavor: ["honey", "baking spice", "oak"],
                finish: ["oak", "rye"],
                score: 87,
                establishment: null,
                date: "2015-03-25"
              })
              .end(function(err, res) {
                res.should.have.status(200);
                chai.request(app)
                .get("/api/user/whiskies?username=test_user1")
                .end(function(err, res) {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('array');
                  res.body.should.have.length(1);
                  res.body[0].should.be.an('object');
                  res.body[0].should.have.property('_id');
                  res.body[0]._id.should.be.a('string');
                  res.body[0].should.have.property('author');
                  res.body[0].author.should.be.a('string');
                  res.body[0].should.have.property('attributes');
                  res.body[0].attributes.should.be.an('object');
                  res.body[0].attributes.should.have.property('name');
                  res.body[0].attributes.name.should.be.a('string');
                  res.body[0].attributes.name.should.equal('Henry McKenna 10 Single Barrel Edited');
                  done();
                });
              });
        });
  });
  it("should delete a given whisky in the user's list", function(done) {
    var whiskyId;
    chai.request(app)
        .get('/api/user/whiskies?username=test_user1')
        .end(function(err, res) {
          whiskyId = res.body[0]._id;
          chai.request(app)
              .delete('/api/user/whiskies/' + whiskyId)
              .end(function(err, res) {
                res.should.have.status(200);
                chai.request(app)
                .get("/api/user/whiskies?username=test_user1")
                .end(function(err, res) {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('array');
                  res.body.should.have.length(0);
                  done();
                });
              });
        });
  });
  after(function(done) {
    User.remove({}, function() {});
    Whisky.remove({}, function() {
      done();
    });
  });
});
