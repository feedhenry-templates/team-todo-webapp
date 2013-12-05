/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Contain calls to update todo's.
 *  - Validate and maintain todo data to be updated.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'services/update-task'

    ], function($,_, Backbone,updateToDoService){
            var dataSetId = "toDo";                                     // Set data_set_id for sync service.
            var createToDo = Backbone.Model.extend({

           //Function to Validate  the Edit Todo Object Details
           validateToDo :function(todoDetails,callback){ 
                var todoTitle = todoDetails.title;
                var todoDescription = todoDetails.description;
                var todoDeadline = todoDetails.deadline;
                var assignedTo = todoDetails.assignedTo;

                // Handle all validations, null check, empty field check.
                if(todoTitle=="" || todoTitle == null) {
                  var err = {
                    'value' : 'Please enter ToDo Title',
                    'status': 401
                  };
                  return callback(err,null);                                                      // Error callback.
                }
                else if(todoDescription =="" || todoDescription ==null) {
                  var err = {
                    'value' : 'Please enter ToDo description',
                    'status': 401
                  };
                  return callback(err,null);  
                }
                else if(assignedTo =="" || assignedTo==null || assignedTo== 0) {
                  var err = {
                    'value' : 'Please select user',
                    'status': 401
                  };
                  return callback(err,null); 
                }
                else {  
                  var uid = todoDetails.toDoId;
                  var sessionId = localStorage.getItem(sessionKey); 
                  updateToDoService.update(sessionId,todoDetails,function(err,res){               //Calling the Update Todo Service
                    if(res) {
                      return callback (null,res);
                    }else {
                      return callback (err,null);
                    }
                       
                  });
                  
               }
                
           }
       });
    return createToDo;
});