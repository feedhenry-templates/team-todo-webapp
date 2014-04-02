/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call implementation to fetchCompletedToDoAction using fh.act service.
 */

define([
    // Includes all dependant libraries / files.
], function() {
    var completedToDoResponse = {
        completedTodo: completedTodo
    };

    //Function to Call the fh act to get Completed Todo task
    function completedTodo(callback) {
        var sessionId = localStorage.getItem(sessionKey);                       // Getting session id
        var params = {
            "request": {// create request parameters
                "header":
                        {
                            "sessionId": sessionId
                        },
                "payload":
                        {
                        }
            }
        };

        //Calling fh act to get completed Task
        $fh.act({
            "act": "fetchCompletedToDoAction",
            "req": params,
            "timeout": 95000,
            secure: true
        }, function(res) {                                      // Success Function 
            HashedCompletedTodoList = [];        //Store completed to-do details in GLOBAL variable
            var completedToDos = res.response.payload.fetchCompletedToDos.completedToDoList;
            //Looping over the reponse to Store it into the Hash Variable
            for (var i = 0; i < completedToDos.length; i++) {
                HashedCompletedTodoList[i] = completedToDos[i];
            }
            return callback(null, res.response);                 // Returning success callback

        }, function(msg, err) {
            return callback(err.error, null);                    // Returning error callback
        });
    }
    return completedToDoResponse;
});
    