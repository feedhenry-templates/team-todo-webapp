/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains : 
 *  - logic to render create-task view.
 *  - Handles all events.
 *  - Navigation logic.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/edit-task.html',
    'models/sessions',
    'models/update-task',
    'services/delete-task',
    'models/fetch-tasks',
    'controllers/tasks-to-do',
    'controllers/select-location',
    'models/fetch-user-list'    
],function($, _, Backbone,editToDo,sessionModel,updateTodoModel,deleteTodoService,fetchToDoMdl,todoListView,selectLocationView,fetchUsersModel){
    var todoListView = Backbone.View.extend({
        el: $('.container'),
        // Define Events
        events :{
        'click .todolist' : 'showToDoDetails',
        'click #logout' : 'logout',
        'click #update' : 'update',
        'click #delete' : 'delete',
        'click #location': 'selectLocation',
        'click #back': 'backToList'
        },

        // Initialize view        
        initialize : function() {
            // Check for valid session.
            sessionModel.load(sessionKey,function(res,val){
                // If Session is not valid redirecting to Login page
                if(!res){
                    var MyApp = new Backbone.Router();
                    MyApp.navigate("/#");
 
                }
            });
           
        },

        // Render View 
        render: function(){            
                var editTodViewObj = this;                                                      // Decalres the scope of this
                localStorage.setItem(currentViewUrl,"todoEdit");                                // Storing the Current View's Url in Local Storage to keep track of page.
                HashedUserList = JSON.parse(localStorage.getItem("HashUserList"));              // Get data from localstorage.                

                var compiledTemplate = _.template(editToDo);                // Creating Object of current View
                editTodViewObj.$el.append( compiledTemplate );            // Compile the login template using underscore
                editTodViewObj.pouplateData();                            // Load the compiled HTML into the Backbone "el".  
         },

        // Show list on view
        showToDoDetails : function(evnt){
            _showMask(); // Show Masking
            Backbone.history.navigate('todoDetails', { 
                trigger: true
            });
        },

        // Populate data.
        pouplateData: function(){
            var editObject = JSON.parse(localStorage.getItem('nguiEditIdObj'));             // Retrieve data to be edited from local storage.

            // Render populated data on screen.
            $("#todoId").val(editObject.toDoId);
            $("#title").val(editObject.title);
            $("#description").val(editObject.description);
            $("#deadline").val(editObject.deadline);

            // Check for null condition
            if(JSON.parse(localStorage.getItem(MapLatLangDataObj)) != null){
                var latitude = new Number(JSON.parse(localStorage.getItem(MapLatLangDataObj)).latitude);
                var longitude = new Number(JSON.parse(localStorage.getItem(MapLatLangDataObj)).longitude);
                $("#location").val(latitude.toPrecision(5)+","+longitude.toPrecision(5));
                $("#locationAbsVal").val(latitude+","+longitude);    
            }else{
                var latitude = new Number(editObject.location.latitude);
                var longitude = new Number(editObject.location.longitude);
                $("#location").val(latitude.toPrecision(5)+","+longitude.toPrecision(5));    
                 $("#locationAbsVal").val(latitude+","+longitude);    
            }
            
            // Iterating the hashmap of Userlist to render it on View.
            for (key in HashedUserList) {                
                if(editObject.assignedTo.userId == HashedUserList[key].userId){
                   $('#user').append("<option value='"+key+"' selected>"+HashedUserList[key].userName+"</option>"); 
               }else{
                    $('#user').append("<option value='"+key+"'>"+HashedUserList[key].userName+"</option>"); 
               }
            }

            // Populate the date time picker.
            $('.datepicker').datetimepicker({
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                autoclose: 1,
                startDate: new Date(),
                pickerPosition: 'bottom-left'
            });    

        },

        // Logout.
        logout : function(evnt){
            _showMask();                                                                    // Show Masking on Screen

            //Clearing Session
            sessionModel.clear(sessionKey, function(res,err){ 
            });
            return true;
        },
        
        // Update todo information.
        update : function(evnt){
            _showMask();                                                                    // Show Mask
            var createTodoViewObj = this,                                                   // Creating Object of the Current View
                todoDetails = {},
                title = $("#title").val(),
                toDoId = $("#todoId").val(),
                description = $("#description").val(),
                deadline = $("#deadline").val(),
                user = $("#user").val(),
                username = $("#user option:selected").text(),
                locationData = $("#locationAbsVal").val().split(","),
                latitude = locationData[0],
                longitude = locationData[1];
            
            todoDetails = {
                "toDoId" : toDoId,
                "title": title,
                "description": description,
                "deadline": deadline,
                "assignedTo": user,
                "username" : username,
                "latitude": latitude,
                "longitude": longitude
            };

            var updateToDoMdl = new updateTodoModel();
            updateToDoMdl.validateToDo(todoDetails, function(err, res) {                    // Model Function for validating Todo Details
                if (res) {
                    createTodoViewObj.clearLocalStorage();                                  // Function to clear local storage data
                    Backbone.history.navigate('todoList', {
                        trigger: true
                    });
                }else {
                    if(err.value) {                                                      //Error from Validation
                        $("#error").html(err.value);
                    }else if(err) {
                      //Displaying Error from server Side
                       $("#error").html(JSON.parse(err).response.payload.error.category);
                    }else {
                        $("#error").html("Server Error");
                    } 
                    _hideMask(); // Hide masking
                }
                
            });
            
        },

        //Function to Delete Todo
        delete : function(evnt){
            _showMask();                                                                    // Show Masking 
            var editTodoViewObj = this,                                                     // Creating Object of Current Vie
                sessionId = localStorage.getItem(sessionKey),                               // Getting Session Id from Local Storage
                todoId = $("#todoId").val(),                                                // Todo Id from hidden Variable
                todoDatafetched = false;                                                    // Flag to check whether data is refreshed

            //Calling Delete Todo Service to Delete the Todo 
            deleteTodoService.deleteTodo(sessionId,todoId,function(err,res){
                //If the Todo Deleted Successfully Refresh the cloud todo Var
                if(res) {
                    //Deleting the Entry from Hash Map
                    delete HashedTodoList[todoId];
                    editTodoViewObj.clearLocalStorage();
                }
                if(!todoDatafetched){
                    // Error hadnling
                    // Show Custom message
                    _hideMask();
                }
                //return callback(null,res);
            });
            var MyApp = new Backbone.Router(); 
            MyApp.navigate("/#todoList");                                               // Redirecting to TodoList on Deletion of Todo

        },

        //Function to redreict to Map View.
        selectLocation: function() {
            // Getting data from Html Elements and Storing in Variables
            var toDoId = $("#todoId").val();
            var title = $("#title").val();
            var description = $("#description").val();
            var deadline = $("#deadline").val();
            var user = $("#user").val();
            if($.trim($("#locationAbsVal").val()) != ""){
                var locationData = $("#locationAbsVal").val().split(",");
                var latitude = locationData[0];
                var longitude = locationData[1];    
            }else{
                var latitude = null;
                var longitude = null;    
            }
            //Object to Store the Todo Details
            todoDetailsObj = {
                "toDoId" : toDoId,
                "title": title,
                "description": description,
                "deadline": deadline,
                "assignedTo": 
                    {
                        "userId" : user
                    },
                "latitude": latitude,
                "longitude": longitude,
                "currentPage" : "createNewTodo"
            };
            //Setting the Localstorage for Latitude and Longitude 
            var MapLatLongObj  = {} ;
            MapLatLongObj = {
                "latitude": latitude,
                "longitude": longitude
            }
 
            var geoLocationString = JSON.stringify(MapLatLongObj);                          // Stringify the Location Details
            localStorage.setItem(MapLatLangDataObj,geoLocationString);                      // Storing the Stringified Variable in LocalStorage
            var todoDetailStr = JSON.stringify(todoDetailsObj);                             // Stringify the Todo Details
            localStorage.setItem('nguiEditIdObj',todoDetailStr);                            // Storing the Stringified Variable in LocalStorage
            
            this.$el.off();                                                                 // Removing event bindngs from the Current View
            this.$el.empty();                                                               // clear the screen
            
            Backbone.history.navigate('selectLocation',                                     // redirecting to ToDo List view
                {trigger: true});
        },

         //Function to Clear Local Storage Regarding Edit Todo.
        clearLocalStorage : function(){
            //removing LocalStorage
            localStorage.removeItem('nguiEditIdObj');
            localStorage.removeItem(todoDetails);
            localStorage.removeItem(MapLatLangDataObj);
            localStorage.removeItem(currentViewUrl);

        },
        backToList:function(){
             Backbone.history.navigate('todoList',                                     // redirecting to ToDo List view
                {trigger: true});
        }        


    });
    return todoListView;
}); 
