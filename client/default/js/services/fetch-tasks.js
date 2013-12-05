/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call to fetch todo list using fh.act service.
*/

define([
    ], function() {

        var todoDetails = {
            fetchToDo 	: fetchToDo                              // Method declaration.
        };

        // Fetch todo list api call
        function fetchToDo(sessionId,callback) {
            var sessionId = localStorage.getItem(sessionKey);
            var params ={
                "request": {                                    // creating request parameters
                    "header":
                    {
                         "sessionId":sessionId           
                    },
                    "payload":
                    {
                      
                    }
                }
            };
     
         // Calling Cloud Service to Fetch Todos
            $fh.act({
                "act": "fetchToDoAction",
                "req": params,
                "timeout": 25000,
                secure:true
            }, function(res) {
                return callback(null,res.response);             // Returning success callback
            }, function(msg, err) {
                return callback(err,null);                      // Returning error callback
            });
        }
        return todoDetails;
    });
