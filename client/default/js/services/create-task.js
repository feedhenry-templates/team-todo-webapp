/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call to create new todo using fh.sync service.
*/

define([
    // Includes all dependant libraries / files.
    ], function() {
        var createToDoResponse = {
            insertToDo 	: insertToDo                            // Method declaration.
        };
        
        // Function to Call Sync function to insert new todo
        function insertToDo(todoDetails,callback) {
            var dataSetId = "toDo",
                id = localStorage.getItem(sessionKey);  
            var params ={
                "request": {                                    // creates request parameters
                    "header":
                    {
                       "sessionId":id            
                    },
                    "payload":
                    {
                        "createToDo":
                        {
                            "title":todoDetails.title,
                            "description":todoDetails.description,
                            "deadline":todoDetails.deadline,
                            "assignedTo": todoDetails.assignedTo,
                            "latitude":todoDetails.latitude,
                            "longitude":todoDetails.longitude
                        }
                    }
                }
            };
            
            // Calling fh Sync to create new Todo 
            $fh.sync.doCreate(dataSetId, params,function success(response){         // Return success callback.
                return callback(null,response);
            },function failure(code,message) {                                      // Return failure callback. 
                return callback(code,null);
            });
        }
        return createToDoResponse;
    });
    