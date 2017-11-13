(function(){
    'use strict';

    angular
        .module('mapa')
        .controller('mapaController', mapaController)

        mapaController.$inject = ['$state', '$ionicPopup', '$cordovaNetwork', '$localStorage', '$ionicPlatform', 'Place', 'User', '$scope', 'tileService', '$timeout', '$ionicLoading'];
    /** @ngInject */
    function mapaController($state, $ionicPopup, $cordovaNetwork, $localStorage, $ionicPlatform, Place, User, $scope, tileService, $timeout, $ionicLoading){

        var mapa = this;
        var map;
        var layerActive = [];

        mapa.setNetwork = setNetwork;
        mapa.isUserOnline = true;

        init();

        function init(){
            checkUserTiles();
            crearMapa().then(function(){
                dibujarBaseMapLayer();
            });
        }

        function checkUserTiles(){
            mapa.userHaveTiles = tileService.userHaveLocalTiles();
        }

        mapa.showOptionsLayer = showOptionsLayer;
        function showOptionsLayer(){
            checkUserTiles();
            mapa.showMapOptions = !mapa.showMapOptions
        }

        function crearMapa(){
            var promise = new Promise(function(resolve, reject){
                var mapConfig = obtenerConfiguracionDelMapa();
                setTimeout(function(){
                    map = L.map('mainMapa', mapConfig);
                    resolve(true); 
                },500);
            });
            return promise;
        }

        function obtenerConfiguracionDelMapa(){
            var mapConfig = {
                center: new L.LatLng(-0.21596,-78.45692),
                zoom: 14,
                minZoom: 14,
                maxZoom: 16,
                zoomControl:true
            };
            return mapConfig;
        }

        function setZoomsDelMapa(zooms){
            map.setMaxZoom(zooms.max);
            map.setMinZoom(zooms.min);
            $timeout(function(){
                map.setZoom(zooms.max);
            },500);
        }

        function setNetwork(network){
            if(!mapa.userHaveTiles){
                showAlertForDownloadTiles();
                return;
            }else{
                if(network === 'on'){
                    mapa.isUserOnline = true;
                }else{
                    mapa.isUserOnline = false;
                }
                dibujarBaseMapLayer();
            }
        }

        function showAlertForDownloadTiles(){
            var confirmPopup = $ionicPopup.confirm({
                title: 'Faltan Tiles',
                template: 'Para usar la opción offline necesitas descargar los mapas a tu celular. <br>Quieres ir a la sección de descargas?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    mapa.showMapOptions = false;
                    $state.go('main.tilestore');
                }
            });
        }
        
        function dibujarBaseMapLayer(){
            mapa.isConfigNewLayer = true;
            cleanLayersFromMap(layerActive);
            if(mapa.isUserOnline){
                setBaseMapLayerOnline();
            }else{
                setBaseMapLayerOffline();
            }
            mapa.isConfigNewLayer = false;
        }

        function cleanLayersFromMap(layers){
            if(angular.isUndefined(layers) !== true && layers.length > 0){
                angular.forEach(layers, function(layer){
                    map.removeLayer(layer);
                });
            }
            layers = [];
        }

        function setBaseMapLayerOnline(){
            var osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
            var osmLayer = L.tileLayer(osmUrl);
            osmLayer.addTo(map);
            setZoomsDelMapa({max:16, min:1});
            layerActive.push(osmLayer);  
        }

        function setBaseMapLayerOffline(){
            var mbTilesDelUsuario = buscarMbTilesDelUsuario();
            dibujarMbtilesDelUsuario(mbTilesDelUsuario);
            setZoomsDelMapa({max:16, min:14}); 
        }

        function buscarMbTilesDelUsuario(){
            var offlineMbtiles = [];
            angular.forEach($localStorage.tiles, function(item){
                offlineMbtiles.push(item.localPath);
            });
            return offlineMbtiles;
        }

        function dibujarMbtilesDelUsuario(userTiles){
            var allMbTiles = [];
            for (var index = 0; index < userTiles.length; index++) {
                var element = userTiles[index];
                var promise = new Promise(function(resolve, reject){
                    var mb = L.tileLayer.mbTiles(element).addTo(map);
                    layerActive.push(mb);
                    mb.on('databaseloaded', function(ev){
                        resolve();
                    });
                });
                allMbTiles.push(promise);
            }
            return Promise.all(allMbTiles);
        }

        



        /*function dibujarLugares(){
            $ionicLoading.show({template: 'Dibujando lugares'});
            buscarLugaresPorZonaId("5938708f1e7e7b059287543f").then(function(lugaresPorZona){
                console.log('lugaresZonas', lugaresPorZona);
                crearGrupoYagregarMarcadores(lugaresPorZona);
                $ionicLoading.hide();
            });
        }

        function crearGrupoYagregarMarcadores(lugares){
            var markers = L.markerClusterGroup({disableClusteringAtZoom:9});

            var markerList = [];
            angular.forEach(lugares, function(lugar, index){
                var marker = L.marker(L.latLng(lugar.coord.lat, lugar.coord.lng), { title: lugar.name });
			    marker.bindPopup(lugar.name);
                markerList.push(marker);
            })

            markers.addLayers(markerList);
            map.addLayer(markers);
        }*/

        /*function buscarLugaresPorZonaId(zoneId){
            var filtro = {filter:{ include:['categories'], fields:['id', 'categories', 'statusId','description', 'userAddress', 'name', 'coord', 'principalUrl', 'client', 'url', 'zone'] } };
            return Place.find(filtro).$promise
                .then(function(places){
                    var lugaresByZone = [];
                    angular.forEach(places, function(place, index){
                        if(place.zone === zoneId){
                            lugaresByZone.push(place);
                        }
                    });
                    return lugaresByZone;
                });
        }
      


        function setEventosDelMap(){
            map.on('click', onMapClick);

            map.on('moveend', function(e){
                console.log('bounds en el evento', map.getBounds());
            });

            map.on('zoomend', function(e){
                console.log('evento zoom start', e.target._zoom);

                console.log('bounds map', map.getBounds());
     
                if(e.target._zoom === 14 && mostrandoMapaGeneral){
                    mostrandoMapaGeneral = false;
                    setearMapa('597a524549842fb2294fb036', map.getCenter(), map.getZoom(), false);
                }

                if(e.target._zoom === 13 && !mostrandoMapaGeneral){
                    mostrandoMapaGeneral = true;
                    setearMapa('5938708f1e7e7b059287543d', map.getCenter(), map.getZoom(), false);
                }

            })
        }

        function onMapClick(e){
            console.log("You clicked the map at " + e.latlng.toString())
        }
      
        function setCenter(center){
            console.log('set this center', center);
            var latlngCenter = L.latLng(userTiles.center.lat, userTiles.center.lng);
            if(angular.isUndefined(center)){
                map.setView(latlngCenter);
            }else{
                map.setView(center);
            }
        }
            
        function setViewDelMapa(type){
            if(type === 'ventas'){
                zonaSelected = $scope.userDataVentas.user.profile.favoritesSectors[0];
            }else{
                zonaSelected = $scope.userDataCompras.user.profile.favoritesSectors[0];
            }
            setearMapa(zonaSelected);
        }*/

    }
}());