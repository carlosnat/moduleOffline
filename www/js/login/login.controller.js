(function(){
    'use strict';

    angular
        .module('login')
        .controller('loginController', loginController)

    /** @ngInject */
    function loginController($state, userService, User, $localStorage){
        var login = this;

        login.ir_a_mapa = ir_a_mapa;
        
        init();

        function init(){
        }

        function ir_a_mapa(type){

            var loginData = {
                v:'3.0.0',
                realm: 'handheld'
            }

            if(type === 'ventas'){
                loginData.email = 'ventastest@correo.com';
                loginData.password = '1234567';
            }else{
                loginData.email = 'comprastest@correo.com';
                loginData.password = '1234567';
            }

            User.login(loginData).$promise.then(function(userData){
                userService.setData(userData);
                $state.go('main.mapa');
            });
            
        }

        login.reset_local = reset_local;

        function reset_local(){
            $localStorage.$reset();
        }

    }

}());