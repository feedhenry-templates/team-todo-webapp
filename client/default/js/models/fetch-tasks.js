/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Contain calls to fetch new todo's.
 *  - Validate and maintain data for todo's.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'services/fetch-tasks'
    ], function($,_, Backbone,fetchToDoService){
           var todoList = Backbone.Model.extend({
               initialize :function(){
                   
               },
               // sync api call to get fetch todo list
               getToDo :function(datasetId,callback){
                $fh.sync.doList(datasetId, function(res) {        // Success Sync function to get todo
                   
                    todoDetailsResponse = "";                     //Intialize the Global Variable
                    todoDetailsResponse = res;
                    var todoListArray = todoDetailsResponse;
                    HashedTodoList = [];
                    
                    //Looping over the reponse to Store it into the Hash Variable
                    for(var i in todoDetailsResponse){
                        HashedTodoList[i] = todoDetailsResponse[i].data;
                    }
                    
                    return callback(null,res);

                // Function called if Error from fh sync service.
                }, function(code, msg) {
                    console.log('An error occured while READING data : (' + code + ') ' + msg);
                    return callback(code,null); 
                });
            }
           });
           return todoList;
    });
