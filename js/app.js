/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Entry point for application. 
 *    - Includes all dependacies
 *    - Initializes Router.
 *    - May include any common stuff need to be handled throught application.
*/

// Loads application level dependant libraries.
require.config({
    paths: {
        feedhenry: 'lib/feedhenry',
        jquery: 'lib/jquery-1.10.2',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone'
  },
  // Configure the dependencies, exports, and custom initialization for older, traditional "browser globals" scripts 
  // that do not use define() to declare the dependencies and set a module value.
  shim:{
      'backbone': {
          deps: ["underscore", "jquery"],
          exports: "Backbone"                 // Attaches "Backbone" to the window object.
     }
  }
});

// Start the main app logic.
require([
  // Load application's router module 
 'app-router', // Request router.js

], function(Router){
   Router.initialize(); // Initialize Router. Gives call to initialize method of appRouter.js
});