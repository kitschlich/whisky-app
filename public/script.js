var angular = require('angular');
var ngRoute = require('angular-route');

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
      })
      .when('/edit-whisky/:id', {
        templateUrl: 'pages/edit-whisky.html',
        controller: 'EditWhiskyController'
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
    }

    function getUserData() {
      return userData;
    }
  })
  .controller('MainController', function($scope) {

  })
  .controller('WelcomeController', function($scope, $location, $http) {
    $scope.showWelcome = false;
    $http.get('/user_data')
    .then(function(data, status, headers, config) {
      if (data.data.username) {
        $location.path('/whisky-list');
      } else {
        $scope.showWelcome = true;
      }
    });
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
        alert('Singup failed. ' + data.data.message);
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
        $location.path('/whisky-list');
      },
      function(data, status, headers, config) {
        alert('Login failed. ' + data.data.message);
      });
    };
  })
  .controller('AddWhiskyController', function($scope, $location, $routeParams, $http) {
    $scope.submit = function() {
      console.log("nose: ", $scope.newWhisky.nose);
      if ($scope.newWhisky.nose) $scope.newWhisky.nose = $scope.newWhisky.nose.split(', ');
      if ($scope.newWhisky.flavor) $scope.newWhisky.flavor = $scope.newWhisky.flavor.split(', ');
      if ($scope.newWhisky.finish) $scope.newWhisky.finish = $scope.newWhisky.finish.split(', ');
      console.log("nose after split:", $scope.newWhisky.nose);

      $http.post('/api/user/whiskies', $scope.newWhisky)
      .then(function(data, status, headers, config) {
        $location.path('/whisky-list');
      });
    };
    $scope.goToWhiskyList = function() {
      $location.path('/whisky-list');
    };
  })
  .controller('WhiskyDetailController', function($scope, $routeParams, $location, UserDataService, $http) {
    $scope.whiskyId = $routeParams.id;

    $scope.whiskies = UserDataService.getUserData();

    for (var i = 0; i < $scope.whiskies.data.length; i++) {
      if ($scope.whiskies.data[i]._id == $routeParams.id) {
        $scope.whiskyDetail = $scope.whiskies.data[i].attributes;
        console.log("nose:",$scope.whiskyDetail.nose);
        $scope.whiskyDetail.date = new Date($scope.whiskyDetail.date);
        break;
      }
    }
    $scope.goToWhiskyList = function() {
      $location.path('/whisky-list');
    };
    $scope.editWhisky = function() {
      $location.path('/edit-whisky/' + $scope.whiskyId);
    };
    $scope.deleteWhisky = function() {
      alert('Are you sure you want to delete this whisky?');
      $http.delete('/api/user/whiskies/' + $scope.whiskyId)
      .then(function(data, status, headers, config) {
        $location.path('/whisky-list');
      });
    };
  })
  .controller('EditWhiskyController', function($scope, $routeParams, $location, $http, UserDataService) {
    $scope.whiskyId = $routeParams.id;

    $scope.whiskies = UserDataService.getUserData();

    for (var i = 0; i < $scope.whiskies.data.length; i++) {
      if ($scope.whiskies.data[i]._id == $routeParams.id) {
        $scope.whiskyDetail = $scope.whiskies.data[i].attributes;
        break;
      }
    }
    $scope.whiskyDetail.date = new Date($scope.whiskyDetail.date);
    if ($scope.newWhisky.nose) $scope.whiskyDetail.nose = $scope.whiskyDetail.nose.join(', ');
    if ($scope.newWhisky.flavor) $scope.whiskyDetail.flavor = $scope.whiskyDetail.flavor.join(', ');
    if ($scope.newWhisky.finish) $scope.whiskyDetail.finish = $scope.whiskyDetail.finish.join(', ');

    $scope.saveEdits = function() {
      if ($scope.newWhisky.nose) $scope.newWhisky.nose = $scope.newWhisky.nose.split(', ');
      if ($scope.newWhisky.flavor) $scope.newWhisky.flavor = $scope.newWhisky.flavor.split(', ');
      if ($scope.newWhisky.finish) $scope.newWhisky.finish = $scope.newWhisky.finish.split(', ');

      $http.put('/api/user/whiskies/' + $scope.whiskyId, $scope.whiskyDetail)
      .then(function(data, status, headers, config) {
        $location.path('/whisky-list');
      });
    };
  })
  .controller('WhiskyListController', function($scope, $routeParams, $location, $http, UserDataService) {
    $scope.goToAddWhisky = function() {
      $location.path('/add-whisky/');
    };

    $scope.goToWhiskyDetail = function(whiskyId) {
      $location.path('/whisky-detail/' + whiskyId);
    };

    $scope.logout = function() {
      $http.get('/logout')
      .then(function(data, status, headers, config) {
        $location.path('/login');
      },
      function(data, status, headers, config) {
        alert('Error logging out');
      });
    };

    $http.get('/api/user/whiskies')
    .then(function(data, status, headers, config) {
      $scope.whiskies = data.data;
      UserDataService.setUserData(data);
    },
    function(data, status, headers, config) {
    });

    $http.get('/user_data')
    .then(function(data, status, headers, config) {
      $scope.username = data.data.username;
    });
  });
