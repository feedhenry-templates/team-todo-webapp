/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Maintains all local storage manipulations.
 *  - Stores and retrieve data.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'feedhenry',
    'services/logout'

    ], function($, _, Backbone, $fh,logoutService) {
        // interface----------------------------------
        var store = {
            save	: _save, 	  // save a model to local storage
            load	: _load,	  // load a model from local storage
            clear	: _clear, 	  // clear a model from local storage
            clearAll: _clearAll   // wipe local storage
        };
        //Function to save in Local Storage Object
        function _save(modelName, model, callback){
            var model = model || {};

            localStorage.setItem(modelName, model);
            return callback(null,"true");
        };

        //Function to Load from Local Storage Object
        function _load(modelName, callback){

            var res = localStorage.getItem(modelName);      // Retrieve data from local storage.
            if(res) {
                return callback(true,res);    
            }
            return callback(false ,null);            
        };

        //Function to clear Local Storage Object
        function _clear(modelName, callback){
            logoutService.logoutUser(localStorage.getItem(modelName),function(err,res){
                localStorage.removeItem(modelName);
                Backbone.history.navigate('', {
                    trigger: true
                });
                return callback(null,true);
            });
           
            return callback(true);
        };

        // Clears whole local storage data.
        function _clearAll(callback){
           localStorage.clear();
            return true;
        };

        return store;

    });