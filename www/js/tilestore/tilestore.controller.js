(function(){
    'use strict';

    angular
        .module('starter')
        .controller('storeController', storeController)

    /** @ngInject */
    function storeController($cordovaFile, $timeout, $scope, $localStorage, $cordovaFileTransfer, $ionicPlatform, tileService, userService){


        console.log('descargados tiles mapa', $localStorage.tiles);
        var store = this;
        store.descargar = descargar;

        init();

        function init(){
            buscarTilesDisponibles();
        }

        function buscarTilesDisponibles(){
            tileService.getTileByZoneId(userService.getZone()).then(function(tiles){
                store.tilesDisponibles = syncLocalConTilesPublicados(tiles);
            });
        }

        function syncLocalConTilesPublicados(tilesOnCloud){
            console.log('sincronizar tiles locales y en nube');
            var userTiles = userService.getTileSaved();
            angular.forEach(userTiles, function(tile, index){
                angular.forEach(tilesOnCloud, function(cloudTile, index){
                    
                    if(tile.id === cloudTile.id){
                        cloudTile.isInDisk = true;
                        console.log(tile.id === cloudTile.id, cloudTile);
                    }
                        
                });
            });
            return tilesOnCloud;
        }

        function descargar(item){
            $cordovaFile.checkDir(cordova.file.dataDirectory, "mapas")
            .then(function(){
                downloadMapa(item);
            }, function(err){
                console.log('error checking dir', err);
                $cordovaFile.createDir(cordova.file.dataDirectory, "mapas", false)
                .then(function(success){
                    console.log('creando directorio', success);
                    downloadMapa(item);
                })
            })
        }

        function downloadMapa(item){
            $ionicPlatform.ready(function() {
                item.isDownloading = true;
                var url = item.download_url;
                var targetPath = cordova.file.dataDirectory + "mapas/" + item.file_name + ".mbtiles";
                var trustHosts = true;
                var options = {};

                console.log('datos para descarga', url, targetPath,options, trustHosts);
        
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function(result) {
                    console.log('descarga completa', result);
                    item.isInDisk = true;
                    item.localPath = targetPath;
                    userService.pushNewTile(item);
                    item.isDownloading = false;
                }, function(err) {
                    console.log('descarga error', err);
                }, function (progress) {
                    $timeout(function(){
                        store.downloadProgress = parseInt( (progress.loaded / progress.total) * 100 );
                    });
                });
            
            });
        }

    }

    angular.module('starter')
    .directive('downaloadBar', function(){

        function link(scope, element, attrs){
            
            scope.$watch('progress', function(){
                console.log('dentro de directiva', scope.progress);
                var barClass = {
                    "height": "5px",
                    "width": scope.progress+"%",
                    "background-color": "cadetblue",
                    "position": "absolute",
                    "bottom": "0",
                    "left": "0"
                }
                element.css(barClass);
            });
            
        }

        return {
            link:link,
            scope:{
                progress:'='
            }
        }


    })

}());