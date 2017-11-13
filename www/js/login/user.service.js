(function(){
    'use strict';

    angular
        .module('starter')
        .factory('userService', userService)

    /** @ngInject */
    function userService($localStorage){

        var dataUsuario;

        return {
            setData: setData,
            getData: getData,
            getZone: getZone,
            getTileSaved: getTileSaved,
            pushNewTile: pushNewTile
        }

        function setData(userData){
            dataUsuario = userData;
            console.log('data user', dataUsuario);
        }

        function getData(){
            return dataUsuario;
        }

        function getZone(){
            return dataUsuario.user.profile.favoritesSectors[0];
        }

        function getTileSaved(){
            return $localStorage.tiles;
        }

        function pushNewTile(dataTile){
            if(angular.isUndefined($localStorage.tiles))
                $localStorage.tiles = [];
            $localStorage.tiles.push(dataTile);
            console.log('localStorage', $localStorage.tiles);
        }
    }

}());