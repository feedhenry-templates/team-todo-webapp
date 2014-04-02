/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains :
 *  - provision for selecting location.
 *  - logic to render select-location view.
 *  - Handles all events.
 *  - Navigation logic.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'controllers/create-task',
    'text!templates/select-location.html',
    'models/load-map',
    'controllers/edit-task'
], function($, _, Backbone, createToDoView, selectLocationTemp, loadMapModel, editTodoView) {
    var todoDetail = {}, viewKey
    marker = {},
            locationView = Backbone.View.extend({
        el: $('.container'),
        events: {
            'click #confirmLocation': 'setLocation'                                         // binds action with element.
        },
        // Initialize Function
        initialize: function() {

        },
        //Function to Render the Location View
        render: function() {
            viewKey = localStorage.getItem("completedLocation")                        //if the value is true then user come from complete todo screen,map will not editable
            var setLocationViewObj = this;                                  // Creating Instance of the View to refer inside the Fucntion
            this.$el.empty();                                           // Clears pervious DOM element.
            var compiledTemplate = _.template(selectLocationTemp);      // Decalres the scope of this
            this.$el.append(compiledTemplate);                          // Storing the Current View's Url in Local Storage to keep track of page.
            var loadMapMdl = new loadMapModel();
            //Calling Location Model to render the Map
            loadMapMdl.show(function(err, locDetails) {
                if (locDetails)
                {
                    self.map = locDetails.res.map;
                    // Map is being shown, lets populate it with data points
                    // Create the marker, then add it to the map
                    var pos = new google.maps.LatLng(locDetails.map.lat, locDetails.map.lon);
                    todoDetail.lat = locDetails.map.lat;
                    todoDetail.lng = locDetails.map.lon;
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: self.map,
                        title: "Current Location"
                    });

                    setLocationViewObj.storeLocation(todoDetail);                          // Storing Current Location in Local Storage
                    if (viewKey != "true") { //checking in user come from completed todo details screen,if not then allow user to select location
                        google.maps.event.addListener(self.map, 'click', function(event) {  // Function to Listen the Click event
                            todoDetail.lat = event.latLng.lat();
                            todoDetail.lng = event.latLng.lng();

                            var MapLatLongObj = {};
                            MapLatLongObj = {
                                "latitude": todoDetail.lat,
                                "longitude": todoDetail.lng
                            };
                            localStorage.setItem(MapLatLangDataObj, JSON.stringify(MapLatLongObj)); // Storing the Location to Local Storage
                            placeMarker(event.latLng);  // Function to Mark the Point on Map

                        });
                    }
                    ;
                    setLocationViewObj.storeLocation(todoDetail);

                    //Function to Point the Marker on Map
                    function placeMarker(location) {
                        if (marker == undefined) {
                            marker = new google.maps.Marker({// Creating a Point on the Map
                                position: location,
                                map: map
                            });
                        }
                        else {
                            marker.setPosition(location);                                           // Setting the postion on the Map
                        }
                    }
                }
            });
            //checkng if user come from completed todo details  
            if (viewKey == "true")
            {
                $('#confirmLocation').attr('value', 'Back');
            }
        },
        // Redirecting to the View from where the Location View was called
        setLocation: function() {
            var redirectUrl = localStorage.getItem(currentViewUrl);
            this.$el.empty();                                                   // Clears pervious DOM element.
            Backbone.history.navigate(redirectUrl, {// redirecting to Parent view.
                trigger: true
            });
        },
        //Storing the Location in local storage.
        storeLocation: function(todoDetail) {
            var MapLatLongObj = {};
            MapLatLongObj = {
                "latitude": todoDetail.lat,
                "longitude": todoDetail.lng
            };
            localStorage.setItem(MapLatLangDataObj, JSON.stringify(MapLatLongObj));
        }
    });
    return locationView;
});

