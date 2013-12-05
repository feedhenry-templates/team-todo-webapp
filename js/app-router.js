/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains all routing configuration.
 */

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'controllers/login',
    'controllers/tasks-to-do',
    'controllers/edit-task',
    'controllers/create-task',
    'controllers/completed-tasks',
    'controllers/select-location',
    'controllers/completed-details'
], function($, _, Backbone, loginView, todoListView, editTodoView, newTodoView, completeTodoView, selectLocationView, completedDetailsView) {
    // Define Router.
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define URL routes
            '': 'login',
            'todoList': 'todoList',
            'todoEdit': 'todoEdit',
            'addNew': 'addNew',
            'done': 'done',
            'selectLocation': 'selectLocation',
            'completeDetails': 'completeDetails'
        }
    });

    // Initialize all router actions.
    var initialize = function() {

        var app_router = new AppRouter;                     // Initiate the router

        app_router.on('route:login', function() {            // Route to login
            var loginViews = new loginView();
            loginViews.render();
        });

        app_router.on('route:todoList', function() {         // Route to Todo list.
            var todoListViews = new todoListView();
            todoListViews.render();
        });

        app_router.on('route:todoEdit', function() {         // Route to Todo Edit.
            var editTodoViews = new editTodoView();
            editTodoViews.render();
        });

        app_router.on('route:addNew', function() {            // Route to create new todo screen.
            var newTodoViews = new newTodoView();
            newTodoViews.render();
        });

        app_router.on('route:done', function() {             // Route Completed Todo
            var completeTodo = new completeTodoView();
            completeTodo.render();
        });

        app_router.on('route:selectLocation', function() {   // Route to select location.
            var selectLocationViews = new selectLocationView();
            selectLocationViews.render();
        });

        app_router.on('route:completeDetails', function() {   // Route to select location.
            var completedDetailsViews = new completedDetailsView();
            completedDetailsViews.render();
        });

        Backbone.history.start();        // Start Backbone history a necessary step for bookmarkable URL's
    };
    return {
        initialize: initialize
    };
});