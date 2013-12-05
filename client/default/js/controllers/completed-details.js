/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains : 
 *  - logic to render completed-task details template.
 */

define([
    // Include all required files here.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/complete-details.html',
    'models/sessions',
    'services/delete-task'
], function($, _, Backbone, completeDetailsTemp, sessionModel, deleteTodoService) {
    var completedId;
    var completedDetailsView = Backbone.View.extend({
        el: $('.container'),
        // Bind events to control elements.
        events: {
            'click #backbutton': 'backToCompletedList', //back button function
            'click #delete': 'deleteToDo',              //delete button function
            'click #requiredLocation': 'showRequiredLocation', 
            'click #whereCompleted': 'showWhereCompleted',
            'click #logout': 'logout'
        },
        // Initialize view        
        initialize: function() {
            // Check for valid session.
            sessionModel.load(sessionKey, function(res, val) {
                if (!res) {
                    // If Session is not valid redirecting to Login page
                    var MyApp = new Backbone.Router();
                    MyApp.navigate("/#");
                }
            });
        },
        // Render View 
        render: function(toDoId) {
            localStorage.setItem(currentViewUrl, "completeDetails");
            _hideMask(); // hide Masking
            if (selectedToDo)
            {
                toDoId = selectedToDo.toDoId;
            }
            completedId = toDoId;
            if (!toDoId) {
                var MyApp = new Backbone.Router();
                MyApp.navigate("/#done");
            }
            this.$el.empty(); //clear pervious screen
            var compiledTemplate = _.template(completeDetailsTemp); //loading html template 
            this.$el.append(compiledTemplate); //rendering or appending html 
            if (HashedCompletedTodoList !== undefined && HashedCompletedTodoList !== null)
            {
                this.populateCompletedDetails();
            }
        },
        //render selected todo details        
        populateCompletedDetails: function()
        {
            var completedToDoData = HashedCompletedTodoList;  //assign completed todo details data to variable
            var toDoId = completedId;
            if (completedToDoData && toDoId)
            {
                //loop to find todo from completed todo list based on id received from completed todo list screen 
                for (var i = 0; i < completedToDoData.length; i++)
                {
                    if (completedToDoData[i].toDoId == toDoId)
                    {
                        selectedToDo = completedToDoData[i];    //assign value of selected to-do to GLOBAL variable
                        $('#title').val(completedToDoData[i].title);
                        $('#description').val(completedToDoData[i].description);
                        $('#deadline').val(completedToDoData[i].deadline);
                        $('#whoCompleted').val(completedToDoData[i].completedBy);
                        $('#whenCompleted').val(completedToDoData[i].completedOn);
                        $('#note').val(completedToDoData[i].note);
                        $("#photoThumbnail").append('<img src="data:image/png;base64,' + completedToDoData[i].photo + '" border="0" alt="an image base64 encoded inline" />');
                    }
                }
            }
            else {
                var MyApp = new Backbone.Router();
                MyApp.navigate("/#todoList");
            }
        },
       //Implementation of back button         
        backToCompletedList: function()
        {
            _showMask(); // Show Masking
            this.$el.off(); // Removing event bindngs from the Current View
            selectedToDo = ""; //reinitialize GLOBAL variable
            localStorage.removeItem("completedLocation");   //removing completedLocation flag
            localStorage.removeItem(MapLatLangDataObj);
            localStorage.removeItem(currentViewUrl);        //clearing currentViewUrl flag
            Backbone.history.navigate('done', {// Navigating to Show All Completed Todos
                trigger: true
            });
        },
        //delete selected todo        
        deleteToDo: function()
        {
            _showMask(); // Show Masking 
            var sessionId = localStorage.getItem(sessionKey), // Getting Session Id from Local Storage
                    todoId = completedId; // Todo Id from hidden Variable

            //Calling Delete Todo Service to Delete the Todo 
            deleteTodoService.deleteToDoByAct(sessionId, todoId, function(err, res) {
                //If the Todo Deleted Successfully Refresh the cloud todo Var
                if (res) {
                    //Deleting the Entry from Hash Map
                    delete HashedCompletedTodoList[todoId];
                    var MyApp = new Backbone.Router();
                    MyApp.navigate("/#done");
                }
                else {
                    var MyApp = new Backbone.Router();
                    MyApp.navigate("/#done");
                }
            });
        },
        //Function to display assigned to-do location         
        showRequiredLocation: function()
        {
            localStorage.setItem("completedLocation", true); //setting in localstorage to decide if the map is editable or not
            //Setting the Localstorage for Latitude and Longitude 
            var MapLatLongObj = {};
            MapLatLongObj = {
                "latitude": selectedToDo.requiredLocation.latitude,
                "longitude": selectedToDo.requiredLocation.longitude
            };
            var geoLocationString = JSON.stringify(MapLatLongObj);                          // Stringify the Location Details
            localStorage.setItem(MapLatLangDataObj, geoLocationString);                      // Storing the Stringified Variable in LocalStorage

            this.$el.off();                                                                 // Removing event bindngs from the Current View
            this.$el.empty();                                                               // clear the screen

            Backbone.history.navigate('selectLocation', // redirecting to ToDo List view
                    {trigger: true});
        },
        //Function to display completed to-do location         
        showWhereCompleted: function()
        {
            localStorage.setItem("completedLocation", true); //setting in localstorage to decide if the map is editable or not
            //Setting the Localstorage for Latitude and Longitude 
            var MapLatLongObj = {};
            MapLatLongObj = {
                "latitude": selectedToDo.whereCompleted.latitude,
                "longitude": selectedToDo.whereCompleted.longitude
            };

            var geoLocationString = JSON.stringify(MapLatLongObj);                          // Stringify the Location Details
            localStorage.setItem(MapLatLangDataObj, geoLocationString);                      // Storing the Stringified Variable in LocalStorage

            this.$el.off();                                                                 // Removing event bindngs from the Current View
            this.$el.empty();                                                               // clear the screen

            Backbone.history.navigate('selectLocation', // redirecting to ToDo List view
                    {trigger: true});
        },
        // Function to Logout User.
        logout: function(evnt) {
            _showMask(); // Show Masking on Screen

            //Clearing Session
            sessionModel.clear(sessionKey, function(res, err) {                             //clearing localstorage            
            });
            return true;
        }

    });
    return completedDetailsView;
});

