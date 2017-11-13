(function(){
    'use strict';

    angular
        .module('starter')
        .controller('sideMenuController', sideMenuController)

    /** @ngInject */
    function sideMenuController(User, $state){
        var sidemenu = this;
        sidemenu.log_out = log_out;
        
        init();

        function init(){
        }

        function log_out(){
            console.log('cerrar sesion');
            User.logout().$promise.then(function(){
                $state.go('login');
            });
        }

    }

}());