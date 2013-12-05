/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call handle to delete todo's using fh.sync service.
 */

define([
    // Includes all dependant libraries / files.
], function() {
    var deletedTodoObj = {
        deleteTodo: deleteTodo, // Method declaration.                         
        deleteToDoByAct: deleteToDoByAct
    };
    //Function to delete Todo 
    function deleteTodo(sessionId, todoId, callback) {
        var dataSetId = "toDo";                             // Declare data_set_id for sync service.
        var params = {
            "request": {// creating request parameters.
                "header":
                        {
                            "sessionId": sessionId
                        },
                "payload":
                        {
                            "deleteToDo":
                                    {
                                        "toDoId": todoId
                                    }
                        }
            }
        };

        // Function to delete Todo for Id
        $fh.sync.doDelete(dataSetId, todoId, function success(response) {             // Success callback 
            return callback(null, response);
        }, function failure(code, error) {                                             // Failure callback
            return callback(code, null);
        });
    }
    function deleteToDoByAct(sessionId, todoId, callback) {
        var params = {
            "request": {// creating request parameters.
                "header":
                        {
                            "sessionId": sessionId
                        },
                "payload":
                        {
                            "deleteToDo":
                                    {
                                        "toDoId": todoId
                                    }
                        }
            }
        };

        //Calling fh act to delete completed Task
        $fh.act({
            "act": "deleteToDoAction",
            "req": params,
            "timeout": 5000,
            secure: true
        }, function(res) {                                      // Success Function 
            return callback(null, res);
        }, function(msg, err) {
            return callback(err, null);                    // Returning error callback
        });
    }
    return deletedTodoObj;
});
