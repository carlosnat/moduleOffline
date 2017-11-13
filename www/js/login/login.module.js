(function(){
    'use strict';

    angular
        .module('login', [])
        .config(function($stateProvider, $urlRouterProvider){
            $stateProvider.state('login',{
                url:'/login',
                templateUrl:'js/login/login.html',
                controller:'loginController',
                controllerAs: 'login'
            });

            $urlRouterProvider.otherwise('/login');
        })

}());