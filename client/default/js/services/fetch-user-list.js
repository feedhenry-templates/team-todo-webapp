/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call fetch user list using fh.act service.
*/

define([
    // Includes all dependant libraries / files.
    ], function() {

        var createToDoResponse = {
            fetchUsers 	: fetchUsers                              // Method declaration.
        };
        // Fetch user list api call.
        function fetchUsers(callback) {
            var id = localStorage.getItem(sessionKey);  
            var params ={
                "request": {                                      // creating request parameters
                    "header":
                    {
                       "sessionId":id            
                    },
                    "payload":
                    {
                       
                    }
                }
            };
           
            // Calling Cloud Finction to Fetch Users List
            $fh.act({
                "act": "fetchUserListAction",                    // Fetch user action.
                "req": params,
                "timeout": 25000,
                secure:true
            }, function(res) {
                return callback(null,res.response);              // Returning success callback
            }, function(msg, err) {
                return callback(JSON.parse(err.error),null);     // Returning error callback
            });
        }
        return createToDoResponse;
    });
    