/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Contain calls to create new todo.
 *  - Validate and maintain data for create new todo.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'services/create-task'
    ], function($,_, Backbone,createNewToDoService){
        
           var createToDo = Backbone.Model.extend({
                // Function to Validate Todo 
                validateToDo :function(todoDetails,callback){
                    // Get Data in variable to insert
                    var createNewTodoModObj = this;
                    var todoTitle = todoDetails.title;
                    var todoDescription = todoDetails.description;
                    var todoDeadline = todoDetails.deadline;
                    var assignedTo = todoDetails.assignedTo;
                    var latitude = todoDetails.latitude;
                    var longitude = todoDetails.longitude;
                    
                    // Check for all null and empty conditions.
                    if(todoTitle=="" || todoTitle == null) {
                      var err = {
                        'value' : 'Please enter todo title',
                        'status': 401
                      };
                      return callback(err,null); 
                    }
                    else if(todoDescription =="" || todoDescription ==null) {
                      var err = {
                        'value' : 'Please enter todo description',
                        'status': 401
                      };
                    
                      return callback(err,null);  
                    }
                    else if(todoDeadline =="" || todoDeadline==null) {
                      var err = {
                        'value' : 'Please enter todo deadline',
                        'status': 401
                      };
                      return callback(err,null);
                    }
                    else if((latitude =="" || latitude==null) && (longitude =="" || longitude==null)) {
                      var err = {
                        'value' : 'Please select a location',
                        'status': 401
                      };
                      return callback(err,null);                      
                    }
                    else if(assignedTo =="" || assignedTo==null) {
                      var err = {
                        'value' : 'Please select user',
                        'status': 401
                      };
                      return callback(err,null);                      
                    }
                    else {  
                      //Function to Insert The New Todo
                      createNewToDoService.insertToDo(todoDetails,function(err,res){
                        if(res) {
                          return callback (null,res);
                        }else{
                             return callback(err,null);
                          }
                       });
                      
                   }
                    
               }
           });
           return createToDo;
    });