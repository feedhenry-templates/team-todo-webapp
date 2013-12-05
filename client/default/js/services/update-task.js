/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Service call update todo using fh.sync service.
*/

define([
    ], function() {
        var updateOperation = {
            update 	: update 
        };

        // api call to update todo's.
        function update(sessionID,todoData,callback) {
                var dataSetId = "toDo";                 // data_set_id declaration.          
                var params = {
                    "request":
                    {
                      "header":
                      {
                        "sessionId": sessionID 
                      },
                      "payload":
                      {
                        "changeToDo": todoData
                      }
                    }
                };
                var uid = todoData.toDoId;

                //Fh sync to read todo 
                $fh.sync.doRead(dataSetId, uid, function success(res){                  //Calling Success method 
                   var updatedataObj = res.data ;
                    updatedataObj.title = todoData.title;
                    updatedataObj.description = todoData.description;
                    updatedataObj.deadline = todoData.deadline;
                    updatedataObj.assignedTo.userId = todoData.assignedTo;
                    updatedataObj.assignedTo.userName = todoData.username;
                    updatedataObj.location.latitude = todoData.latitude;
                    updatedataObj.location.longitude = todoData.longitude;
                    res.data = updatedataObj;
                          //In success Method Calling the Update Todo Function
                          //fh sync to update ToDo
                         $fh.sync.doUpdate(dataSetId, uid, updatedataObj,function success(response){
                               return callback(null,response);
                          },function failure(code,message){
                                return callback(code,null);
                          });  

                       },function failure(code,msg){
                          return callback(code,null);
                       });   
        }
        return updateOperation;
    });
    
    
    
    
    