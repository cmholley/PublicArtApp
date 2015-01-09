'use strict';

/* Controllers */
var appControllers = angular.module('controllerModule', []);

appControllers.controller('tourListCtrl', ['$rootScope','$scope','$http','tourInfo','Restangular','$ionicSlideBoxDelegate','$state','appStateStore','$ionicSideMenuDelegate',
    function($rootScope, $scope, $http, tourInfo, Restangular, $ionicSlideBoxDelegate,$state,appStateStore,$ionicSideMenuDelegate) {
        $scope.showAdd = false;
        
        //Uses local storage instead of http requests
        $scope.toursGet = tourInfo.getTours;
        
        $scope.artworkGet = tourInfo.getArtwork;
        
        $scope.toursOpen = appStateStore.getToursOpen;
        $scope.artworkOpen = appStateStore.getArtworkOpen;
        $scope.setToursOpen = appStateStore.setToursOpen;
        $scope.setArtworkOpen = appStateStore.setArtworkOpen;
        
        $scope.loadAR = function() {
            if($ionicSideMenuDelegate.isOpenLeft()) {
                $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
            }
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet());
        };
        
        $scope.selectedMarker = null;
        
        $scope.tourArt = [];
    }]);

appControllers.controller('collageCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout', '$ionicScrollDelegate','$ionicSideMenuDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,$ionicScrollDelegate,$ionicSideMenuDelegate) {
        $scope.tourID = $stateParams.tourID;
        $scope.tourGet = tourInfo.getTourByID;
        $scope.artworkGet = tourInfo.getArtworkByTourID;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.loadAR = function() {
            if($ionicSideMenuDelegate.isOpenLeft()) {
                $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
            }
            app.loadARchitectWorld(getSamplePath(0, 0), $scope.artworkGet($scope.tourID));
        };
        
        var markersArr = [];
        $scope.artworkGet($scope.tourID).forEach(function(obj) {
            var tempMarker = [];
            tempMarker.latLong = ""+obj.location_lat+", "+obj.location_long + "";
            tempMarker.markerData = obj;
            markersArr.push(tempMarker);
        });
        
        $scope.map = {
            sensor: true,
            size: '500x500',
            zoom: 15,
            center: '29.722000, -95.34350', //CENTER OF UH
            markers: markersArr,
            mapevents: {redirect: false, loadmap: true},
            listen: true
        };
        
        $scope.mapShow = false;
        $scope.toggleMap = function() {
            $ionicScrollDelegate.$getByHandle('sliderScroll').resize();
            $scope.mapShow = !$scope.mapShow;
            if($scope.mapShow) {
                $ionicScrollDelegate.$getByHandle('sliderScroll').scrollBottom(true);
            } else {
                $ionicScrollDelegate.$getByHandle('sliderScroll').scrollTop(true);
            }
        }
    }]);

appControllers.controller('mainCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$timeout','$ionicSideMenuDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$timeout,$ionicSideMenuDelegate) {

        $scope.artworkGet = tourInfo.getArtwork;
        
        $scope.loadAR = function() {
            if($ionicSideMenuDelegate.isOpenLeft()) {
                $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
            }
            app.loadARchitectWorld(getSamplePath(0, 0), tourInfo.getArtwork());
        };
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        };
        
    }]);

appControllers.controller('artDetailCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams','$ionicScrollDelegate','$ionicSideMenuDelegate',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,$ionicScrollDelegate,$ionicSideMenuDelegate) {
        $scope.ARModeActive = $stateParams.AR;
        if($scope.ARModeActive) {
            var onBackKeyDown = function() {
                $scope.returnToAR();
                document.removeEventListener("backbutton", onBackKeyDown, false);
            }
            document.addEventListener("backbutton", onBackKeyDown, false);
        }
        
        $scope.art_id = $stateParams.artID;
        $scope.detailArt = tourInfo.getArtworkByID($scope.art_id);
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        };
        
        $scope.resizeScroll = function(){
            $ionicScrollDelegate.$getByHandle('detailScroll').resize();
        }
        
        var markersArr = [];
        var tempMarker = [];
        tempMarker.latLong = $scope.detailArt.location_lat+", "+$scope.detailArt.location_long;
        tempMarker.markerData = $scope.detailArt;
        markersArr.push(tempMarker);
        
        $scope.map = {
            sensor: true,
            size: '500x500',
            zoom: 15,
            center: '29.722000, -95.34350', //CENTER OF UH
            markers: markersArr,
            mapevents: {redirect: false, loadmap: true},
            listen: true
        };
        
        $scope.mapShow = false;
        $scope.toggleMap = function() {
            $ionicScrollDelegate.$getByHandle('detailScroll').resize();
            $scope.mapShow = !$scope.mapShow;
            if($scope.mapShow) {
                $ionicScrollDelegate.$getByHandle('detailScroll').scrollBottom(true);
            }
        };
        
        $scope.goBack = function(){
            $ionicNavBarDelegate.back();
        };
        
        $scope.returnToAR = function() {
            if($ionicSideMenuDelegate.isOpenLeft()) {
                $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
            }            
            app.loadARchitectWorld(null, null);
        }
    }]);

appControllers.controller('favoriteCtrl', ['$scope','$rootScope','$window','tourInfo','$ionicSlideBoxDelegate','$stateParams', 'favoriteService',
    function($scope,$rootScope,$window,tourInfo,$ionicSlideBoxDelegate,$stateParams,favoriteService) {
        $scope.getArtByArtID = tourInfo.getArtworkByID;
        
        $scope.genImList = function(artOb){
            var outStr = "http://www.housuggest.org/images/ARtour/" + artOb.artwork_id +"/"+ artOb.image.split(",")[0];
            return outStr;
        }
        
        $scope.updateFavorites = function() {
            $scope.favorites = favoriteService.getFavorites();
            $scope.favoriteArt = [];
            angular.forEach($scope.favorites, function(val) {
                $scope.favoriteArt.push($scope.getArtByArtID(val));
            });
        }
        $scope.updateFavorites();
        
        $scope.isFavorite = favoriteService.isFavorite($scope.art_id);
        
        $scope.toggleFavorite = function() {
            favoriteService.setFavorite($scope.art_id, !favoriteService.isFavorite($scope.art_id));
            $scope.isFavorite = !$scope.isFavorite;
        }

        $scope.deleteFavorite = function(art_id) {
            favoriteService.setFavorite(art_id, false);
            $scope.updateFavorites();
        }
    }]);

appControllers.controller('menuCtrl', ['$scope','$rootScope','$window','$ionicSideMenuDelegate','tourInfo','$ionicSlideBoxDelegate','$stateParams', '$timeout', '$ionicScrollDelegate','appStateStore',
    function($scope,$rootScope,$window,$ionicSideMenuDelegate,tourInfo,$ionicSlideBoxDelegate,$stateParams, $timeout, $ionicScrollDelegate,appStateStore) {
        $rootScope.menuToggle = function(){
                $ionicSideMenuDelegate.$getByHandle('main-menu').toggleLeft();
                appStateStore.setMenuOpen(!$ionicSideMenuDelegate.isOpenLeft());
        };
        
        if(appStateStore.getMenuOpen()){
            $timeout(function(){
                $rootScope.menuToggle();
                appStateStore.setMenuOpen(true);
            }, 1000);
        }
        $scope.resizeScroll = function(){
            $ionicScrollDelegate.$getByHandle('menuScroll').resize();
        }
    }]);