angular.module('whiskyApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'pages/login.html',
        controller: 'loginController'
      })
      .when('/add-whisky', {
        templateUrl: 'pages/add-whisky.html',
        controller: 'addWhiskyController'
      })
      .when('/whisky-detail', {
        templateUrl: 'pages/whisky-detail.html',
        controller: 'whiskyDetailController'
      })
      .when('/whisky-list', {
        templateUrl: 'pages/whisky-list.html',
        controller: 'whiskyListController'
      });
  })
  .controller('mainController', function($scope) {

  })
  .controller('loginController', function($scope) {

  })
  .controller('addWhiskyController', function($scope) {

  })
  .controller('whiskyDetailController', function($scope) {

  })
  .controller('whiskyListController', function($scope) {

  });
