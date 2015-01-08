'use strict';

/* App Module */

var publicArtApp = angular.module('publicArtApp', [
    'ionic',
    'controllerModule',
    'ngSanitize',
    'restangular',
    'databaseServicesModule',
    'utilModule',
    'adaptive.googlemaps',
    'ngNotify'
]);


publicArtApp.config(['$stateProvider','$urlRouterProvider', '$compileProvider',
    function($stateProvider,$urlRouterProvider,$compileProvider) {
        $urlRouterProvider.otherwise("/tour");
        $stateProvider
            .state('tour',{
                url:"/tour",
                views: {
                    "menu": {
                        templateUrl:"partials/menu.html",
                        controller:"tourListCtrl"
                    },
                    "content": {
                        templateUrl:"partials/main.html",
                        controller:"mainCtrl"
                    }
                }
            })
            .state('tour.collage', {
                url:"/collage/:tourID",
                views:{
                    "content@": {
                        templateUrl:"partials/collageView.html",
                        controller:"collageCtrl"
                    }
            }
            })
            .state('tour.artDetail',{
                url:"/artDetail/:artID",
                views:{
                    "content@": {
                        templateUrl:"partials/artworkDetail.html",
                        controller:"artDetailCtrl"
                    }
                }
            })
            .state('tour.favorites',{
                url:"/favorites",
                views:{
                    "content@":{
                        templateUrl:"partials/favorites.html",
                        controller:"favoriteCtrl"
                    }
                }
            })
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo|maps):/);
    }]);

publicArtApp.run(['$rootScope', '$http', 'Restangular', 'Auth', 'tourInfo', '$ionicSideMenuDelegate','appStateStore','ngNotify',
    function($rootScope, $http, Restangular, Auth, tourInfo, $ionicSideMenuDelegate,appStateStore,ngNotify){
        Restangular.setBaseUrl("http://www.housuggest.org:8080/ArtApp/");

        Auth.setCredentials("Admin", "a91646d0a63e7511327e40cd2e31b297e8094e4f22e9c0a866549e4621bff8c190c71c7e9e9a9f40700209583130828f638247d6c080a67b865869ce902bb285");

        var loginResultPromise = Restangular.all("users").getList();

        loginResultPromise.then(function(result) {
            Auth.confirmCredentials();
            // Load artwork and tours after credentials confirmed
            tourInfo.loadData();
        },function(error){
            Auth.confirmCredentials();
            //Nothing needs to be done here.
            tourInfo.loadData();
            ngNotify.set("Internet or Server Unavailable; Limited Functionality", {type: "error", sticky: true});
        });
        
        appStateStore.loadData();
        
    }]);