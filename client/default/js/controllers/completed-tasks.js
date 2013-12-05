/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains : 
 *  - logic to render completed-task template.
 *  - logic to handle completed tasks and represent it to user.
 *  - Navigation logic
 */

define([
    // Include all required files here.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/completed-tasks.html',
    'models/sessions',
    'controllers/login',
    'services/completed-tasks',
    'controllers/completed-details'

], function($, _, Backbone, todoListTemp, sessionModel, LoginView, CompletedToDoService, completedDetailsView) {

    var todoListView = Backbone.View.extend({
        el: $('.container'),
        // Bind events to control elements.
        events: {
            'click #backbutton': 'showToDoDetails',
            'click #logout': 'logout',
            'click .list-group-item': 'showCompletedDetails'
        },
        // Initialize view        
        initialize: function() {
            var currentView = this;
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
        render: function() {
            var completedViewObj = this;                                             // Creating Object of current View

            CompletedToDoService.completedTodo(function(err, res) {
                completedViewObj.$el.empty();                                    // Clears pervious DOM element.
                var compiledTemplate = _.template(todoListTemp);                // Compile the login template using underscore
                completedViewObj.$el.append(compiledTemplate);                // Load the compiled HTML into the Backbone "el".
                selectedToDo = "";                                            //reinitialize GLOBAL variable
                if (res) {
                    var completedList = res.payload.fetchCompletedToDos.completedToDoList; // Varible to store Todo Response 

                    // Iterate response to generate to-do list.
                    for (var i = 1; i <= completedList.length; i++) {
                        var str = "";
                        var id = completedList[i-1].toDoId;
                        if (i % 2 === 0) {
                            str = "<a class='list-group-item even' id=" + id + ">";   
                        }else {
                            str = "<a class='list-group-item odd' id=" + id + ">";
                        }
                        // str = "<a class='list-group-item' id=" + completedList[i].toDoId + ">";
                        str += "<span class='username pull-left'>" + completedList[i-1].completedBy + "</span>";
                        str += "<span class='date pull-left'>" + completedList[i-1].completedOn + "</span>";
                        str += "<span class='description  pull-left'>" + completedList[i-1].title + "</span>";
                        // str += "<span class='arrow-icon'><i class='icon-chevron-right'></i></span></a> ";
                        $("ul.list-group").append(str);
                    }
                } else {
                    //Generate Error Message
                    $(".todo-container").empty();
                    if (err === "") {
                        $(".error-container").html("Todo's yet to be completed");
                    } else {
                        $(".error-container").html(JSON.parse(err).response.payload.error.description);
                    }
                }
                _hideMask();  // Hide Masking
            });
        },
        //Function to Show Todo List View    
        showToDoDetails: function() {
            _showMask(); // Show Masking
            var MyApp = new Backbone.Router(); // Redirecting to TodoList View
            MyApp.navigate("/#todoList");
        },
        showCompletedDetails: function(evnt) {                       // action defination when user click on any todo.this action will open todo details page
            var id = $(evnt.currentTarget).attr("id");
            _showMask(); // Show Masking
            Backbone.history.navigate('completeDetails', {
                trigger: false
            });
            var completedDetails = new completedDetailsView();
            completedDetails.render(id);
        },
        // Function to Logout User.
        logout: function(evnt) {
            _showMask(); // Show Masking on Screen

            //Clearing Session
            sessionModel.clear(sessionKey, function(res, err) {
            });
            return true;
        }
    });
    return todoListView;
});

