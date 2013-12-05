/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call logout action using fh.act service.
*/

define([
    // Includes all dependant libraries / files.
    ], function() {
        var logoutUserHandle = {
            logoutUser  : logoutUser             // Method declaration.
        };
    
      // Function to Logout the User
      function logoutUser(sessionId,callback) {
          var params ={
              "request": {                     //creating request parameters
                  "header":
                  {
                      "sessionId": sessionId          
                  },
                  "payload":
                  {
                      
                  }
              }
          };
          //Cloud call to Logout user 
         $fh.act({
             "act": "logoutAction",
             "req": params,
             "timeout": 25000,
             secure:true
         }, function(res) {
             return callback(null,res.response);              //Returning success callback
         }, function(msg, err) {
             return callback(JSON.parse(err.error),null);      //Returning error callback
         });
      }
      return logoutUserHandle;
    });