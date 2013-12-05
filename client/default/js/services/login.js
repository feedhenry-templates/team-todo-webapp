/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call implementation to login end point (authenticateAction) using fh.act service.
*/

define([
    ], function() {
        // Method declaration.
        var authentication = {
            authUser 	: authUser
        };

        //Function to authenticate the user.
        function authUser(id,password,callback) {
            var params ={
                "request": {                     //creating request parameters
                    "header":
                    {
                      "appType" : "Portal"           
                    },
                    "payload":
                    {
                      "login":
                      {
                          "userName": id,
                          "password": password
                      }
                    }
                }
            };

          // FeedHenry Cloud authentication service. 
           $fh.act({
               "act": "authenticateAction",
               "req": params,
               "timeout": 25000,
               secure:true
           }, function(res) {
               return callback(null,res.response);          // Returning success callback
           }, function(msg, err) {
               return callback(JSON.parse(err.error), null);      // Returning error callback
           });
        }

        return authentication;
    });
    
    
    
    
    