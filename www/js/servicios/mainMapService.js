(function(){
    'use strict';

    angular
        .module('starter')
        .factory('mainMapService', mainMapService)

    /** @ngInject */
    function mainMapService(){

        var mainMap;

        return {
            iniciar_mapa: iniciar_mapa,
            set_view:set_view
        }

        function iniciar_mapa(){
            if(angular.isUndefined(mainMap)){
                mainMap = L.map('map', {
                    center:null,
                    zoom:null
                  });
                return mainMap;
            }else{
                return mainMap;
            }
        }

        function set_view(){
            
        }
    }

}());