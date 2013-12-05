/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Render map with required data.
 *  - Fetch dat if the location changes and return back to create / update to call.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'controllers/select-location'

], function($, _, Backbone, selectLocationView) {

    var map = Backbone.Model.extend({
        initilize: function() {

        },
        // Show the map on screen
        show: function(callback) {

            $fh.geo({
                interval: 0
            }, function(map) {
                if(localStorage.getItem(MapLatLangDataObj) != null){                // if Location Data is Available get the data from it
                    var geoCoordinateObj = localStorage.getItem(MapLatLangDataObj);
                    map.lat = JSON.parse(geoCoordinateObj).latitude;
                    map.lon = JSON.parse(geoCoordinateObj).longitude;
                }
                $fh.map({
                    target: document.getElementById('maps_div'),                    // Target Html Element to Populate the Map
                    lat: map.lat,
                    lon: map.lon,
                    zoom: 15
                }, function(res) {
                    var locDetails = {};
                    locDetails ={
                        "map":map,
                        "res":res        
                    };
                var MapLatLongObj  = {} ;
                MapLatLongObj = {
                    "latitude": map.lat,
                    "longitude": map.lon
                 }
                localStorage.setItem(MapLatLangDataObj,JSON.stringify(MapLatLongObj));       //Storing in Local Variable        
                    return callback(null,locDetails);
                }, function(error) {
                    // something seriously wrong here. Show error
                    alert(error);
                });
            });
        }

    });
    return map;
});
