(function(){
    'use strict';

    angular
        .module('starter')
        .controller('myCtrl', myCtrl)

        myCtrl.$inject = ['$localStorage', '$ionicPlatform', 'Place', 'User', '$scope', 'tileService', '$timeout', '$ionicLoading'];
    /** @ngInject */
    function myCtrl($localStorage, $ionicPlatform, Place, User, $scope, tileService, $timeout, $ionicLoading){

        var myController = this;
        var map, mb, userTiles, zonaSelected;

        init();

        function init(){
            crearMapa();
            var layersDelUsuario = buscarLayersDelUsuario();
            $ionicLoading.show({template: 'Configurando mapa'});
            dibujarLayersMapaDelUsuario(layersDelUsuario).then(function(){
                $ionicLoading.hide();
            })
        }

        function crearMapa(){
            map = L.map('map', {
                center: new L.LatLng(-0.21596,-78.45692),
                zoom: 14,
                minZoom: 14,
                maxZoom: 16,
                zoomControl:false
            });
        }

        function buscarLayersDelUsuario(){
            var urlTiles = [];
            angular.forEach($localStorage.tiles, function(item){
                console.log('localPath', item.localPath);
                urlTiles.push(item.localPath);
            });
            console.log('urlTiles', urlTiles);
            return urlTiles;
        }

        var personalLayers = [];
        function dibujarLayersMapaDelUsuario(userTiles){
            if(angular.isUndefined(personalLayers))
                personalLayers = [];
            var allMbTiles = [];
            for (var index = 0; index < userTiles.length; index++) {
                var element = userTiles[index];
                var promise = new Promise(function(resolve, reject){
                    var mb = L.tileLayer.mbTiles(element).addTo(map);
                    personalLayers.push(mb);
                    mb.on('databaseloaded', function(ev) {
                        resolve();
                    });
                });
                allMbTiles.push(promise);
            }
            return Promise.all(allMbTiles);
        }

        myController.setNetwork = setNetwork;
        var mainLayer = null;
        var osmLayer;
        myController.isOffline = false;
        function setNetwork(network){
            var osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
            if(network === 'on'){
                angular.forEach(personalLayers, function(layer){
                    map.removeLayer(layer);
                });
                osmLayer = L.tileLayer(osmUrl, { minZoom:1, maxZoom:16 });
                osmLayer.addTo(map);
                myController.isOffline = false;
            }else{
                if(angular.isUndefined(osmLayer) !== true)
                    map.removeLayer(osmLayer);
                angular.forEach(personalLayers, function(layer){
                    layer.addTo(map);
                });
                myController.isOffline = true;
            }
        }

        /*function buscarTilesParaElUsuario(userSector){
            return tileService.getTileByZoneId(userSector).then(function(tileSelected){
                userTiles = tileSelected;
            });
        }*/

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
        }*/
      
        /*var mostrandoMapaGeneral;
        function iniciarMapa(){
          map = L.map('map', {
            center:null,
            zoom:null
          });
          mostrandoMapaGeneral = true;
          setEventosDelMap();
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

        function setearMapa(zoneId, center, zoom, dibujar){
            console.log('dibujar mapa');
            dibujarLayer();
            /*$ionicLoading.show({template: 'Configurando mapa'});
            buscarTilesParaElUsuario(zoneId).then(function(){
                dibujarLayer().then(function(){
                    setCenter(center);
                    $timeout(function(){
                        setZoomsDelMapa(zoom);
                        $ionicLoading.hide();
                        if(dibujar)
                            dibujarLugares();
                    }, 500);*/
                //});
            //});
        //}

        /*function onMapClick(e){
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

        function setZoomsDelMapa(zoom){
            console.log('set this zoom', zoom);
            map.setZoom(zoom);
            map.setMaxZoom(userTiles.maxZoom);
            map.setMinZoom(userTiles.minZoom);
        }*/
            
        /*function setViewDelMapa(type){
            if(type === 'ventas'){
                zonaSelected = $scope.userDataVentas.user.profile.favoritesSectors[0];
            }else{
                zonaSelected = $scope.userDataCompras.user.profile.favoritesSectors[0];
            }
            setearMapa(zonaSelected);
        }*/

    }
}());