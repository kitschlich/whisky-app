global.DATABASE_URL = 'mongodb://localhost/whisky-app-dev';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var User = require('../models/user');


var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Whisky App', function() {
  before(function(done) {
    server.runServer(function() {
      done();
    });
  });
  it('should use "public" folder', function(done) {
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
        .send({'username': 'test_user1', 'password': '1234'})
        .end(function(err, res) {
            //console.log(res);
            res.should.have.status(200);
            // res.should.be.json;
            // res.body.should.be.a('object');
            // res.body.should.have.property('message');
            // //res.body.message.should.equal('Luke... I am your father');
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
  // it('should show an authenticated user the protected endpoint', function(done) {
  //   chai.request(app)
  //       .get('/whiskies')
  //       .end(function(err, res) {
  //         console.log(res.body);
  //         done();
  //       });
  // });
  after(function(done) {
    User.remove(function() {
      done();
    });
  });
});
