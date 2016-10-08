var angular = require('angular');
var ngRoute = require('angular-route');

var MOCK_WHISKY_DATA = {
  "data": [{
    "id": 1,
    "attributes": {
      "name": "Henry McKenna 10 Single Barrel",
      "type": "bourbon",
      "proof": 100,
      "age": 10,
      "price": 35,
      "bottle size": "750",
      "pour size": null,
      "nose": ["caramel", "banana", "oak", "vanilla", "honey", "cinnamon"],
      "flavor": ["honey", "baking spice", "oak"],
      "finish": ["oak", "rye"],
      "score": 87,
      "establishment": null,
      "date": "2015-03-25"
    }
  }, {
    "id": 2,
    "attributes": {
      "name": "Blantons",
      "type": "bourbon",
      "proof": 93,
      "age": null,
      "price": null,
      "pour size": null,
      "bottle size": null,
      "nose": ["sweet orange", "caramel"],
      "flavor": ["light", "sweet"],
      "finish": ["light burn", "hint of rye", "citrus", "vanilla", "brown sugar"],
      "score": 86,
      "establishment": null,
      "date": "2016-07-13"
    }
  }, {
    "id": 3,
    "attributes": {
      "name": "Eagle Rare 10",
      "type": "bourbon",
      "proof": 90,
      "age": 10,
      "price": 30,
      "pour size": null,
      "bottle size": "750",
      "nose": ["caramel", "oak", "rye", "light spice", "banana"],
      "flavor": ["sweet", "light vanilla", "oak", "black pepper"],
      "finish": ["short", "smooth", "black pepper", "rye"],
      "score": 86,
      "establishment": null,
      "date": "2016-02-03"
    }
  }]
};

angular.module('whiskyApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'pages/welcome.html',
        controller: 'WelcomeController'
      })
      .when('/signup', {
        templateUrl: 'pages/register.html',
        controller: 'RegistrationController'
      })
      .when('/login', {
        templateUrl: 'pages/login.html',
        controller: 'LoginController'
      })
      .when('/add-whisky/', {
        templateUrl: 'pages/add-whisky.html',
        controller: 'AddWhiskyController'
      })
      .when('/whisky-detail/:id', {
        templateUrl: 'pages/whisky-detail.html',
        controller: 'WhiskyDetailController'
      })
      .when('/whisky-list/', {
        templateUrl: 'pages/whisky-list.html',
        controller: 'WhiskyListController'
      });
  })
  .factory('UserDataService', function() {
    var userData;

    return {
      setUserData: setUserData,
      getUserData: getUserData
    };

    function setUserData(data) {
      userData = data;
      console.log(userData);
    }

    function getUserData() {
      return userData;
    }
  })
  .controller('MainController', function($scope) {

  })
  .controller('WelcomeController', function($scope) {

  })
  .controller('RegistrationController', function($scope, $location, $http) {
    $scope.signup = function() {
      $http({
        method: 'POST',
        url: '/register',
        data: 'username=' + $scope.username + '&password=' + $scope.password,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(function(data, status, headers, config) {
        alert('Signup successful! Please log in...');
        $location.path('/login');
      },
      function(data, status, headers, config) {
        alert('Singup failed');
      });
    };
  })
  .controller('LoginController', function($scope, $location, $http) {
    $scope.login = function() {
      $http({
        method: 'POST',
        url: '/login',
        data: 'username=' + $scope.username + '&password=' + $scope.password,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(function(data, status, headers, config) {
        localStorage.setItem("username", $scope.username);
        $location.path('/whisky-list');
      },
      function(data, status, headers, config) {
        alert('Login failed');
      });
    };
  })
  .controller('AddWhiskyController', function($scope, $location, $routeParams, $http) {
    $scope.submit = function() {
      $scope.newWhisky.author = localStorage.getItem("username");
      $scope.newWhisky.nose = $scope.newWhisky.nose.split(', ');
      $scope.newWhisky.flavor = $scope.newWhisky.flavor.split(', ');
      $scope.newWhisky.finish = $scope.newWhisky.finish.split(', ');

      $http.post('/api/user/whiskies', $scope.newWhisky)
      .then(function(data, status, headers, config) {
        $location.path('/whisky-list/');
      });
    };
    $scope.goToWhiskyList = function() {
      $location.path('/whisky-list/');
    };
  })
  .controller('WhiskyDetailController', function($scope, $routeParams, $location, UserDataService) {
    $scope.whiskyId = $routeParams.id;

    $scope.whiskies = UserDataService.getUserData();

    console.log($scope.whiskies);

    for (var i = 0; i < $scope.whiskies.data.length; i++) {
      if ($scope.whiskies.data[i]._id == $routeParams.id) {
        $scope.whiskyDetail = $scope.whiskies.data[i].attributes;
        break;
      }
    }
    $scope.goToWhiskyList = function() {
      $location.path('/whisky-list/');
    };
    $scope.editWhisky = function() {
      // API update
    };
    $scope.deleteWhisky = function() {
      // API delete
    };
  })
  .controller('WhiskyListController', function($scope, $routeParams, $location, $http, UserDataService) {
    $scope.user = localStorage.getItem("username");
    //$scope.whiskies = MOCK_WHISKY_DATA.data;
    $scope.goToAddWhisky = function() {
      $location.path('/add-whisky/');
    };
    $scope.goToWhiskyDetail = function(whiskyId) {
      $location.path('/whisky-detail/' + whiskyId);
    };
    $http.get('/api/user/whiskies', {
      params: {username: $scope.user}
    })
    .then(function(data, status, headers, config) {
      console.log('got /user/whiskies');
      console.log(data);
      $scope.whiskies = data.data;
      UserDataService.setUserData(data);
    },
    function(data, status, headers, config) {
      console.log('get /user/whiskies failed');
    });
  });
