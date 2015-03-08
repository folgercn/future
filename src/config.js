


'use strict';

/* Controllers */
// var future = angular.module('future', ["ngClipboard"]);


future.config(function($routeProvider){
    $routeProvider.
        when('/', {
            templateUrl: '/templates/frugment/index.html',
            title: 'future '
        })
});



future
  .config(function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  })
  .run(function($rootScope, $route, $location, $routeParams,ngProgress,navlist) {
    // gettextCatalog.currentLanguage = defaultLanguage;
    // amMoment.changeLocale(defaultLanguage);
    $rootScope.$on('$routeChangeStart', function() {
      ngProgress.start();
      // console.log($progress)
      // if(window.userinfos == undefined) location.href="/step00";
    });

    $rootScope.$on('$routeChangeSuccess', function() {
      ngProgress.complete();
      
      //Change page title, based on Route information
      $rootScope.titleDetail = '';
      $rootScope.title = $route.current.title;
      $rootScope.isCollapsed = true;
      $rootScope.currentAddr = null;
      navlist();
      // $location.hash($routeParams.scrollTo);
      // $anchorScroll();
    });
  });
