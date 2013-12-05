/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains :
 *  - logic to render tasks-to-do view with data.
 *  - Handles all events.
 *  - Navigation logic.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tasks-to-do.html',
    'models/sessions',
    'controllers/login',
    'models/fetch-tasks',
    'controllers/edit-task',
    'models/fetch-user-list',
    'controllers/completed-tasks',
    'controllers/create-task',
    'models/fetch-user-list'

],function($, _, Backbone,todoListTemp,sessionModel,LoginView,fetchToDoModel,editTodoView,fetchUsersModel,completedTodoView, createNewTodoView, fetchUsersModel){
    var datasetId = "toDo",
        self,
        todoListView = Backbone.View.extend({
            el: $('.container'),
            events :{
            'click .list-group-item' : 'showToDoDetails',
            'click #addnew' : 'addNew',
            'click #logout' : 'logout',
            'click #completedtodo' : 'completedtodo'
            },

            // Function to Initialize The Sync
            initialize : function(){
                self = this;
                var sessionId = localStorage.getItem(sessionKey);       // Getting Session Key
                var params ={
                    "request": {                                        // Creating request parameters
                        "header":
                        {
                             "sessionId":sessionId           
                        },
                        "payload":
                        {
                          
                        }
                    }
                };
                   
                // Initialize the Sync Service.
                $fh.sync.init({
                    "sync_frequency": 10,
                    // "do_console_log" : true,    
                    "notify_sync_started" : true,
                    "local_update_applied":true,
                    "notify_delta_received":true
                });

                // Provide handler function for receiving notifications from sync service - e.g. data changed
                $fh.sync.notify(self.handleSyncNotifications);

                // Set data_set_id to manage under sync service.
                $fh.sync.manage(datasetId,null,params);
                   
            },

            // Handler function for sync.
            handleSyncNotifications : function(notification){
                    if( 'sync_started' == notification.code ) {
                        // Sync Service Started 
                    }
                    else if( 'delta_received' == notification.code ) {
                       // Function to Fetch list and re-render the view
                        self.render();
                    }
                    else if( 'remote_update_failed' === notification.code ) {
                        //Populating Errors If Any Issues Occured in the Syncing service
                        var errorMsg = notification.message ? notification.message.msg ? notification.message.msg : undefined : undefined;
                        var action = notification.message ? notification.message.action ? notification.message.action : 'action' : 'action';
                        var errorStr = 'The following error was returned from the data store: ' + errorMsg;
                    }
            },

            //Function to Get Todo list From Model.
            syncTodoList : function(callback){
                var self = this;
                
                fetchObj = new fetchToDoModel();
                fetchObj.getToDo(datasetId, function(err, res) {        // Getting ToDo's from GetTodo Model         
                    return callback(null,res);
                });

            },

             // Function to Render the View 
            render: function(){
                var todoListView = this;   
                fetchUsersObj = new fetchUsersModel();
                // self.getUsersList();            

                fetchUsersObj.fecthUsersList(function(err,res) {             // Model Function call to fetch User List
                    if (res) {

                         self.syncTodoList(function() {                      // Call to sync list method
                            if("todoList" == Backbone.history.fragment) {    // If the Current View is TodoList refresh the View with new data                            
                                if (res) {
                                    todoListView.$el.empty(); 
                                    var compiledTemplate = _.template(todoListTemp);    // loading html template 
                                    todoListView.$el.append( compiledTemplate ); 

                                    todoListView.populateTodoList();
                                    _hideMask();                                   // Hidding the Masking
                                }else{
                                    $("#error").html(err);                          // Show error
                                    _hideMask();                                    // Hidding the Masking
                                }   
                            }
                        });
                    }
               });
            },
            getUsersList: function () {
                // Call to fetchUserModel to get users list.
                fetchUsersObj = new fetchUsersModel();

                fetchUsersObj.fecthUsersList(function(err,res) {
                    if(res) {

                    }
                });
            },

            //Function to Show Todo Details 
            showToDoDetails : function(evnt){

                var editId = $(evnt.currentTarget).attr("id");                      // Getting Todo Id
                this.$el.off();                                                     // Removing event bindngs from the Current View            
                this.$el.empty();                                                   // Clears pervious DOM element.
                Backbone.history.navigate('todoEdit', {                             // Redirecting to Edit View
                    trigger: false
                });

                // Stores the data to be edited in local storage.
                localStorage.setItem('nguiEditIdObj',JSON.stringify(HashedTodoList[editId]));
                var editTodoViewObj = new editTodoView();
                editTodoViewObj.render(editId);
            },

            // Navigate view to add new todo.
            addNew : function(evnt){
                _showMask();
                this.$el.off();                                                      // Removing event bindngs from the Current View
                Backbone.history.navigate('addNew', {                                
                    trigger: true
                });
            },


            // Function to Logout User
            logout : function(evnt){
                _showMask();
                this.$el.off();                                                     // Removing event bindngs from the Current View
           
                sessionModel.clear(sessionKey, function(er,res){                    // Clearing session Data
                });
                return true;
            },

            // Function to Populate Data 
            populateTodoList : function(){

                // Looping over hash Variable to get all the Details regarding the todo
                var counter = 0;
                for(var key in HashedTodoList) {
                    var str ="";                                    
                    if (HashedTodoList[key].title !== undefined) {
                        if (counter % 2 === 0) {
                            str = "<a id='"+HashedTodoList[key].toDoId+"' class='list-group-item odd'>";
                        }else {
                            str = "<a id='"+HashedTodoList[key].toDoId+"' class='list-group-item even'>";
                        }
                        str +="<span class='username pull-left'>"+HashedTodoList[key].assignedTo.userName+"</span>";
                        str += "<span class='date pull-left'>"+HashedTodoList[key].deadline+"</span>";
                        str += "<span class='description  pull-left'>"+HashedTodoList[key].title+"</span></a>";                        
                        $("ul.list-group").append(str);
                    }
                    counter++;
                }

            },

            //function to Complete Todo
            completedtodo : function(){
                _showMask();                                // Show Masking
                this.$el.off();                             // Removing event bindngs from the Current View
                Backbone.history.navigate('done', {         // Navigating to Show All Completed Todos
                    trigger: false
                });
                var completedTodoObj = new completedTodoView();
                completedTodoObj.render();
            }

        });
    return todoListView;
});

