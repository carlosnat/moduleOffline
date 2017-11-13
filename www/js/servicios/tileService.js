(function(){
    'use strict';

    angular
        .module('starter')
        .factory('tileService', tileService)

        tileService.$inject = ['$http', '$localStorage'];
    /** @ngInject */
    function tileService($http, $localStorage){

        var tilesList;

        return {
            getTileByZoneId: getTileByZoneId,
            userHaveLocalTiles: userHaveLocalTiles
        }

        function getTileByZoneId(zoneId){
            console.log('buscar tiles disponibles para', zoneId);
            var promise = new Promise(function(resolve, rejected){
                console.log('buscar lista en json', angular.isUndefined(tilesList));
                if(angular.isUndefined(tilesList) || tilesList.length === 0){
                    cargarTiles().then(function(){
                        var tiles = buscarTilesPorZona(zoneId);
                        resolve(tiles);
                    });
                }else{
                    var tiles = buscarTilesPorZona(zoneId);
                    resolve(tiles);
                }
            });
            return promise;
        }

        function cargarTiles(){
            return $http.get('js/tilesOnCloud.json').then(function(tiles){
                
                tilesList = tiles.data;
                console.log('respuesta del json', tilesList);
            });
        }

        function buscarTilesPorZona(zoneId){
            var tileSelected = [];
            angular.forEach(tilesList, function(tile, index){
                console.log('seleccionar tile', tile.zone_id, zoneId, tile.zone_id === zoneId);
                if(tile.zone_id === zoneId){
                    tileSelected.push(tile);
                }
            });
            return tileSelected;
        }

        function userHaveLocalTiles(){
            if(angular.isUndefined($localStorage.tiles) || $localStorage.tiles.length === 0)
                return false
            return true;
        }
    }

}());