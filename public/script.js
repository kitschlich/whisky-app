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
        templateUrl: 'pages/login.html',
        controller: 'LoginController'
      })
      .when('/add-whisky', {
        templateUrl: 'pages/add-whisky.html',
        controller: 'AddWhiskyController'
      })
      .when('/whisky-detail/:id', {
        templateUrl: 'pages/whisky-detail.html',
        controller: 'WhiskyDetailController'
      })
      .when('/whisky-list', {
        templateUrl: 'pages/whisky-list.html',
        controller: 'WhiskyListController'
      });
  })
  .controller('MainController', function($scope) {

  })
  .controller('LoginController', function($scope, $controller) {
    $controller("MainController",{$scope: $scope});
  })
  .controller('AddWhiskyController', function($scope, $location) {
    $scope.submit = function() {
      console.log($scope.newWhisky);
      $scope.newWhisky.nose = $scope.newWhisky.nose.split(', ');
      $scope.newWhisky.flavor = $scope.newWhisky.flavor.split(', ');
      $scope.newWhisky.finish = $scope.newWhisky.finish.split(', ');
      MOCK_WHISKY_DATA.data.push({'id': (MOCK_WHISKY_DATA.data.length + 1), "attributes": $scope.newWhisky});
      // this will need to happen after response from the database
      $location.path('/whisky-list');
    };
    $scope.goToWhiskyList = function() {
      $location.path('/whisky-list');
    };
  })
  .controller('WhiskyDetailController', function($scope, $routeParams, $location) {
    $scope.whiskyId = $routeParams.id;

    for (var i = 0; i < MOCK_WHISKY_DATA.data.length; i++) {
      if (MOCK_WHISKY_DATA.data[i].id == $routeParams.id) {
        $scope.whiskyDetail = MOCK_WHISKY_DATA.data[i].attributes;
        break;
      }
    }
    $scope.goToWhiskyList = function() {
      $location.path('/whisky-list');
    };
    $scope.editWhisky = function() {
      // API update
    };
    $scope.deleteWhisky = function() {
      // API delete
    };
  })
  .controller('WhiskyListController', function($scope) {
    $scope.whiskies = MOCK_WHISKY_DATA.data;
  });
