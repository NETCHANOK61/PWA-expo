import React, { useState, useEffect, useRef } from "react";
import { Platform, BackHandler, Alert } from "react-native";
import { WebView } from "react-native-webview";
import useDidMount from "../../../utils/useDidMount";
import * as Location from "expo-location";

export default function Map(props) {
  const didMount = useDidMount();
  const webview = useRef(null);

  const [location, setLocation] = useState({
    location: "",
    latitude: "",
    longitude: "",
  });

  const [cusLocation, setCusLocation] = useState({
    latitude: props.latitude == "" ? "" : props.latitude,
    longitude: props.longitude == "" ? "" : props.longitude,
  });

  const [gpsLocat, setGpsLocat] = useState({ lat: "", lng: "" });

  const init = async () => {
    await getLocation();
    handleSurveyLoaction();
  };

  useEffect(() => {
    if (didMount) {
      init();
    }
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleSurveyLoaction = () => {
    if (props.lngSurvey != "" && props.latSurvey != "") {
      setCusLocation((current) => ({
        ...current,
        latitude: props.latSurvey,
        longitude: props.lngSurvey,
      }));
    }
  };

  const getLocation = async () => {
    // await RNGeolocation.getCurrentPosition(
    //   (position) => {
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;

    //     setLocation(_state => ({
    //       ..._state,
    //       location: position,
    //       latitude: latitude,
    //       longitude: longitude,
    //     }));

    //     setGpsLocat(_state => ({
    //       ..._state,
    //       lat: latitude,
    //       lng: longitude,
    //     }));

    //     if (props.latSurvey == '' && props.lngSurvey == '') {
    //       if (
    //         props.caseLoacation.caseLat == '' &&
    //         props.caseLoacation.castLng == ''
    //       ) {
    //         setCusLocation(_state => ({
    //           ..._state,
    //           latitude: latitude,
    //           longitude: longitude,
    //         }));
    //         onWebViewLoad(latitude, longitude);
    //       } else {
    //         setCusLocation(_state => ({
    //           ..._state,
    //           latitude: props.caseLoacation.caseLat,
    //           longitude: props.caseLoacation.castLng,
    //         }));
    //         onWebViewLoad(
    //           props.caseLoacation.caseLat,
    //           props.caseLoacation.castLng,
    //         );
    //       }
    //     } else {
    //       setCusLocation(_state => ({
    //         ..._state,
    //         latitude: props.latSurvey,
    //         longitude: props.lngSurvey,
    //       }));
    //       onWebViewLoad(props.latSurvey, props.lngSurvey);

    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     Alert.alert(
    //       'Warning message!',
    //       'Unable to check route Due to not finding a job position.',
    //       [
    //         {
    //           text: 'ตกลง',
    //           onPress: () => { },
    //         },
    //       ],
    //     );
    //   },
    //   //{ enableHighAccuracy: false },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
    // Get current location
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      timeout: 15000,
      maximumAge: 10000,
    });

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Update state
    setLocation((_state) => ({
      ..._state,
      location: position,
      latitude: latitude,
      longitude: longitude,
    }));

    setGpsLocat((_state) => ({
      ..._state,
      lat: latitude,
      lng: longitude,
    }));

    // Check conditions for props.latSurvey and props.caseLoacation
    if (props.latSurvey === "" && props.lngSurvey === "") {
      if (
        props.caseLoacation.caseLat === "" &&
        props.caseLoacation.castLng === ""
      ) {
        setCusLocation((_state) => ({
          ..._state,
          latitude: latitude,
          longitude: longitude,
        }));
        onWebViewLoad(latitude, longitude);
      } else {
        setCusLocation((_state) => ({
          ..._state,
          latitude: props.caseLoacation.caseLat,
          longitude: props.caseLoacation.castLng,
        }));
        onWebViewLoad(props.caseLoacation.caseLat, props.caseLoacation.castLng);
      }
    } else {
      setCusLocation((_state) => ({
        ..._state,
        latitude: props.latSurvey,
        longitude: props.lngSurvey,
      }));
      onWebViewLoad(props.latSurvey, props.lngSurvey);
    }
  };

  const toFixed = (num, pre) => {
    num *= Math.pow(10, pre);
    num =
      (Math.round(num, pre) + (num - Math.round(num, pre) >= 0.5 ? 1 : 0)) /
      Math.pow(10, pre);
    return num.toFixed(pre);
  };

  const onWebViewLoad = (latitude, longitude) => {
    props.onClickSave(true, latitude, longitude);
  };

  const onWebViewMessage = (event) => {
    let objMsg = JSON.parse(event.nativeEvent.data);
    // console.log(objMsg);
    let latitude = objMsg.lat;
    let longitude = objMsg.lng;
    props.onClickSave(true, "", "", "");
    setTimeout(() => {
      props.onClickSave(true, latitude, longitude);
    }, 500);
  };

  if (props.latitude != "" && props.longitude != "") {
    // console.log(props.latitude + ',' + props.longitude);
    if (props.searchClick == true) {
      webview.current.injectJavaScript(
        ` mymap.setView([${props.latitude},${props.longitude}], 12);
          if(markerJob != null)
          { mymap.removeLayer(markerJob); }
          DrawMarker2(${props.latitude},${props.longitude});
        `
      );
      props.callbackSearchClick();
    } else {
      webview.current.injectJavaScript(
        `mymap.setView([${props.latitude},${props.longitude}], 12);
        if(markerJob != null)
        { mymap.removeLayer(markerJob); }
        DrawMarker2(${props.latitude},${props.longitude});
        `
      );
    }
  }
  // console.log(props.ww_code);
  return (
    <WebView
      onLoad={() => getLocation()}
      originWhitelist={["*"]}
      ref={webview}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      scalesPageToFit
      scrollEnabled={false}
      mixedContentMode={"always"}
      useWebKit={Platform.OS == "ios"}
      allowUniversalAccessFromFileURLs={true}
      source={{
        html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Simple Leaflet Map</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"/>
            <link rel="stylesheet" href="https://smart1662.pwa.co.th/smapilab/Scripts/L.Icon.Pulse.2.css"/>
            <link rel="stylesheet" href="https://smart1662.pwa.co.th/smapilab/Scripts/bootstrap.min.css">
            <link rel="stylesheet" href="https://smart1662.pwa.co.th/smapilab/Scripts/leaflet.awesome-markers.css">
            <link rel="stylesheet" href="https://smart1662.pwa.co.th/smapilab/Scripts/font-awesome.min.css">

            <style>
            body {
                padding: 0;
                margin: 0;
            }
            html, body, #map {
                height: 100%;
                width: 100vw;
            }
        
            /* css to customize Leaflet default styles  */
            .custom .leaflet-popup-tip,
            .custom .leaflet-popup-content-wrapper {
                background: #FFF;
                color: #000;
            }
            h5 {
                margin-top: 0;
                color: #666;
                font-family: "Trebuchet MS", Tahoma, Arial, sans-serif;
            }
            textarea {
                font-size: 14px;
                border: 0px;
                font-family: "Trebuchet MS", Tahoma, Arial, sans-serif;
            }
               
            </style>
        
            <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
            <script src="https://smart1662.pwa.co.th/smapilab/Scripts/jquery-3.4.1.min.js"></script>
            <script src="https://smart1662.pwa.co.th/smapilab/Scripts/leaflet.groupedlayercontrol.js"></script>
            <script src="https://smart1662.pwa.co.th/smapilab/Scripts/L.TileLayer.BetterWMS.js"></script>
            <script src="https://smart1662.pwa.co.th/smapilab/Scripts/L.Icon.Pulse.2.js"></script>
            <script src="https://smart1662.pwa.co.th/smapilab/Scripts/leaflet.awesome-markers.js"></script>
        
        
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">
            <script>
        
            $(document).ready(function() {
                onLoad();
              
            });
        
            var mymap;
            var markerJob;
            var polygonJob;
            function onLoad(){
        
                //var url_ows = "http://sitdev.dyndns.org:3000/geoserver/IIMS/ows";
                //var url_wms = "http://sitdev.dyndns.org:3000/geoserver/IIMS/wms?";

                var url_wms = "https://gisweb1.pwa.co.th/geoserver/PG_WEBGIS/wms?&CQL_FILTER=pwa_code=${
                  props.ww_code
                }"; //5511000
                var url_local = "https://gisweb1.pwa.co.th/geoserver/PWA_GIS/wms?";
                // var url_wms = "https://gisweb1.pwa.co.th/geoserver/PG_WEBGIS/wms?&CQL_FILTER=pwa_code=5542017";
        
                var popup = L.popup();
                var marker;
        
                //Open streetmap
                var openstreetmapURL = 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}';

                 var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
                    maxZoom: 30,
                    maxNativeZoom:22,
                    subdomains:['mt0','mt1','mt2','mt3']
                });

                 var googleRoad =  L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
                    maxZoom: 30,
                    maxNativeZoom:22,
                    subdomains:['mt0','mt1','mt2','mt3']
                });
        
                //World imagery
                var worldimageryURL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
                var worldimageryAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        
                var wmsLayer_gis_area= L.tileLayer.betterWms(url_local, {
                    layers: "PWA_GIS:ZONE",
                    format: "image/png",
                    transparent: true,
                    singleTile: false,
                    matrixSet: 'EPSG:4326',
                    maxZoom: 30,
                    maxNativeZoom:22
                });
        
                var wmsLayer_gis_pipe= L.tileLayer.betterWms(url_wms, {
                    layers: "PG_WEBGIS:pipeall",
                    format: "image/png",
                    transparent: true,
                    singleTile: false,
                    matrixSet: 'EPSG:4326',
                    maxZoom: 30,
                    maxNativeZoom:22
                });

                var wmsLayer_gis_house= L.tileLayer.betterWms(url_wms, {
                    layers: "PG_WEBGIS:bldgall",
                    format: "image/png",
                    transparent: true,
                    singleTile: false,
                    matrixSet: 'EPSG:4326',
                    maxZoom: 30,
                    maxNativeZoom:22
                });
        
                var opsMap = L.tileLayer(openstreetmapURL,{
                    attribution: 'GISTNU MAP',
                    id: 'mapbox.streets',
                    maxZoom: 30,
                    maxNativeZoom:22
                });
        
                var worldimagery = L.tileLayer(worldimageryURL, {
                  attribution: worldimageryAttrib,
                  maxZoom: 30,
                  maxNativeZoom:22
                });
        
                ////Codeding MAP
                mymap = L.map('map',{
                    layers: [wmsLayer_gis_pipe, wmsLayer_gis_house, googleHybrid]
                }).setView([${location.latitude},${location.longitude}], 12);
        
                mymap.options.minZoom = 10;
                // mymap.options.maxZoom = 22;

                //Overlay layers are grouped
                var groupedOverlays = {
                    "ข้อมูลอ้างอิง": {
                        // "Area(DMA)" : wmsLayer_gis_area,
                        "ท่อประปา" :wmsLayer_gis_pipe,
                        "อาคารบ้านเรือน" :wmsLayer_gis_house,
                    }
                };
        
                //Base layers definition and addition
                var baseLayers = {
                    "แผนที่ดาวเทียม": googleHybrid,
                    "แผนที่ Google" : googleRoad,
                };
        
                L.control
                .groupedLayers(baseLayers, groupedOverlays, {
                    position: "topright",
                    collapsed: true
                })
                .addTo(mymap);
        
                // poi current location

                var stateChangingButton = L.easyButton({position: "topright",
                    states: [    {
                            icon:'fa-dot-circle-o ',
                            onClick: function(btn, map) {
                                mymap.setView([${location.latitude},${
          location.longitude
        }],12);
                            }
                    }]
                });
                
                stateChangingButton.addTo(mymap);
  
                // create custom icon  
                var pulsingIcon = L.icon.pulse({iconSize:[16,16],color:'blue'});
        
                marker  = L.marker([${gpsLocat.lat},${
          gpsLocat.lng
        }],{ icon: pulsingIcon }).addTo(mymap);
              
                if(${cusLocation.latitude} != '' && ${
          cusLocation.longitude
        } != '' ){
                    DrawMarker();
                }else{
                mymap.on('click', onAddMarker);
                }
                
                centerLeafletMapOnMarker(mymap, markerJob);
                //mymap.on('click', onAddMarker); // 1/12/2021
            }
        
            function onAddMarker(e) {
                if(markerJob != null)
                {
                    mymap.removeLayer(markerJob);
                }
                markerJob  = L.marker(e.latlng,{draggable: true, autoPan: true, icon: ColorMarker(1)}).addTo(mymap);
                markerJob.bindPopup('จุดซ่อม '+ e.latlng).addTo(mymap);
                var group = new L.featureGroup([markerJob]);
                // mymap.fitBounds(group.getBounds());
                mymap.fitBounds(group.getBounds(), { maxZoom: 14 });
        
                markerJob.on("dragend", function(e) {
                    var markerXY = e.target;
                    var position = markerXY.getLatLng();
                    var msg = JSON.stringify(position);
                    // markerJob.bindPopup('จุดซ่อม ' + markerXY.getLatLng()).addTo(mymap);
                    window.ReactNativeWebView.postMessage(msg);
                });
        
                var position = markerJob.getLatLng();
                var msg = JSON.stringify(position);
                window.ReactNativeWebView.postMessage(msg);
            }
        
            function centerLeafletMapOnMarker(map, marker) {
                var latLngs = [ marker.getLatLng() ];
                var markerBounds = L.latLngBounds(latLngs);
                // map.fitBounds(markerBounds);
                map.fitBounds(markerBounds, { maxZoom: 14 });
            }
            
            function toFixed (num, pre) {
              num *= Math.pow(10, pre);
              num =
                (Math.round(num, pre) + (num - Math.round(num, pre) >= 0.5 ? 1 : 0)) /
                Math.pow(10, pre);
              return num.toFixed(pre);
            };

            function DrawMarker(){
                markerJob = L.marker([${cusLocation.latitude},${
          cusLocation.longitude
        }],{
                    draggable: true,
                    autoPan: true,
                    icon: ColorMarker(1)
                }).addTo(mymap);
                      
                markerJob.on("dragend", function(e) {
                    var markerXY = e.target;
                    var position = markerXY.getLatLng();
                    var msg = JSON.stringify(position);
                    //markerJob.bindPopup("<b>จุดซ่อม (" + toFixed(position.lat,6) +  "," + toFixed(position.lng,6) +  ")</b>");
                    window.ReactNativeWebView.postMessage(msg)
                });

                markerJob.bindPopup("<b>จุดซ่อม (" + [${toFixed(
                  cusLocation.latitude,
                  6
                )},${toFixed(cusLocation.longitude, 6)}] + ")</b>");
                markerJob.openPopup();
            }

            function DrawMarker2(lat,lng){
                markerJob = L.marker([lat,lng],{
                    draggable: true,
                    autoPan: true,
                    icon: ColorMarker(1)
                }).addTo(mymap);
                
                markerJob.on("dragend", function(e) {
                    var markerXY = e.target;
                    var position = markerXY.getLatLng();
                    var msg = JSON.stringify(position);
                    //markerJob.bindPopup("<b>จุดซ่อม " + position +  "</b>");
                    window.ReactNativeWebView.postMessage(msg)
                });

                markerJob.bindPopup("<b>จุดซ่อม (" + toFixed(lat,6) +  "," + toFixed(lng,6) +  ")</b>");
                markerJob.openPopup();
            }

            // create popup polygon
            function customPopupPolygon(jobcode, jobtype, team, jobdetail, latitude, longitude ){
                var html = '';
                html += '<center><b>' + jobcode + '</b></center><br>';
                html += '<b>Job Type:</b> ' + jobtype + '<br>';
                html += '<b>Team:</b> ' + team + '<br>';
                html += '<b>Job Detail:</b> ' + jobdetail + '<br>';
                html += '<br>';
                html += '<td><button type="button" class="btn btn-primary btn-block" onclick="onClickLocationJob( ' + latitude + ',' + longitude + ')"> Check route </button></td>';
                return html;
            }
        
            function onClickLocationJob(latitude, longitude){
                var msgObj = { lat : latitude, long: longitude};
                var msg = JSON.stringify(msgObj);
                window.ReactNativeWebView.postMessage(msg)
            };
        
            function ColorMarker(type){
                var markerIcon;
                switch(type) {
                case 2:
                    return markerIcon = new L.Icon({
                    iconUrl: 'https://smart1662.pwa.co.th/smapilab/Scripts/imgmarker/marker-icon-2x-green.png',
                    shadowUrl: 'https://smart1662.pwa.co.th/smapilab/Scripts/imgmarker/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                    });
                case 1:
                    return markerIcon = new L.Icon({
                    iconUrl: 'https://smart1662.pwa.co.th/smapilab/Scripts/imgmarker/marker-icon-2x-blue.png',
                    shadowUrl: 'https://smart1662.pwa.co.th/smapilab/Scripts/imgmarker/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                    });
                default :
                    return null;
                }
            }
        
        </script>
        
        <body>
            <div id="map"></div>    
        </body>
        </html>
        <script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script> `,
        baseUrl: "",
      }}
      onMessage={onWebViewMessage}
    />
  );
}
