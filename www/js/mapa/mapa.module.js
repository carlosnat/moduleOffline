(function(){
    'use strict';

    angular
        .module('mapa', [])
        .config(function($stateProvider){

            $stateProvider
            .state('main', {
                url: '/main',
                abstract:true,
                templateUrl: 'js/sidemenu/sidemenu.html',
                controller: 'sideMenuController',
                controllerAs: 'sidemenu'
                }
            )
            .state('main.mapa',{ 
                url: '/mapa',
                views:{
                'mainContent' : {
                    templateUrl: 'js/mapa/mapa.html',
                    controller: 'mapaController',
                    controllerAs: 'mapa'
                }
             }
            })
            .state('main.tilestore',{ 
                url: '/tilestore',
                views:{
                'mainContent' : {
                    templateUrl: 'js/tilestore/tilestore.html',
                    controller: 'storeController',
                    controllerAs: 'store'
                }
             }
            })

        })
}());