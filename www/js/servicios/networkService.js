(function(){
    'use strict';

    angular
        .module('network', [])
        .factory('networkService', networkService);

        networkService.$inject = ['$window'];
        /** @ngInject */
        function networkService($window){

            return {
                isOnline: isOnline,
                getConectionType: getConectionType
            }

            function isOnline(){
                return $window.navigator.onLine;
            }
        }

}());