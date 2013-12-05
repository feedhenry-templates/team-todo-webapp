/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains : 
 *  - logic to render create-task view.
 *  - Handles the all events.
 *  - Navigation logic.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/create-task.html',
    'models/sessions',
    'models/create-task',
    'models/fetch-user-list',
    'controllers/select-location',
    'controllers/tasks-to-do'
],function($, _, Backbone,newTodoView,sessionModel,createNewTodoMdl,fetchUsersModel,selectLocationView,todoListView){
    var createNewTodoObj = Backbone.View.extend({
        el: $('.container'),

        // bind events
        events :{
        'click #logout' : 'logout',
        'click #backbutton' : 'back',
        'click #complete' : 'complete',
        'click #location': 'selectLocation'
        },

        // Initialize view.        
        initialize : function(){
            // Check for valid session.
            sessionModel.load(sessionKey,function(res,val){
                // If Session is not valid redirecting to Login page
                if(!res){
                    var MyApp = new Backbone.Router(); 
                    MyApp.navigate("/#");
 
                }

            });
        },

        // Function to Render the View 
        render: function(){
            localStorage.setItem(currentViewUrl,"addNew");          // Storing the Current View's Url in Local Storage to keep track of page.
            this.$el.empty();                                       // clear pervious screen
            var compiledTemplate = _.template(newTodoView);         // loading html template 
            this.$el.append( compiledTemplate );                    // rendering or appending html 
            
            $('#user').empty();
            $('#user').append("<option value=''>Select from List</option>"); 

            // Iterate and populate User List.
            for (key in HashedUserList) {
                // Check for selected user.
                if(localStorage.getItem(todoDetails) != null && JSON.parse(localStorage.getItem(todoDetails)).assignedTo == key){
                    $('#user').append("<option value='"+key+"' selected='selected' >"+HashedUserList[key].userName+"</option>");       
                   
                }else{
                    $('#user').append("<option value='"+key+"'>"+HashedUserList[key].userName+"</option>"); 
                }
                
            }

            _hideMask(); //hide Masking

            // try catch Block to re-populate the Create - New Todo View
            try 
            {
                // Getting Todo Details if stored during redirections to Map    
                var todoDetailsObj = JSON.parse(localStorage.getItem(todoDetails));
                
                // populate and render data from local storage on view.
                $("#title").val(todoDetailsObj.title);
                $("#description").val(todoDetailsObj.description);
                $("#deadline").val(todoDetailsObj.deadline);
                
                var geoLocationCoord = localStorage.getItem(MapLatLangDataObj),
                    latitude = new Number(JSON.parse(geoLocationCoord).latitude),
                    longitude = new Number(JSON.parse(geoLocationCoord).longitude);
                $("#location").val(latitude.toPrecision(5)+","+longitude.toPrecision(5)); 
                $("#locationAbsVal").val(latitude+","+longitude);    
            } catch(e){
                //Not stored in Local Show Empty Feilds
            }
            
            // Populate date picker.
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

        // Function to Logout User
        logout : function(evnt){
            _showMask();  // Show Masking on Screen
            //Clear Session
            sessionModel.clear(sessionKey, function(res,err){ 
            });
        },

        // Function to Redirect Back to tasks-to-do page
        back : function(evnt){
            _showMask();                // Show Masking on Screen
            this.clearLocalStorage();   // Clear Local Storage

            //Redirect to tasks-to-do view.
            Backbone.history.navigate('todoList', {
                trigger: true
            });
        },

        // Function to Submit Completed ToDo Data
        complete : function(evnt){
            _showMask();                                                // Show Masking
            var createTodoObj = this,
                todoDetails = {},                                       // Creating Object to Store the Todo Deitals
                title = $("#title").val(),
                description = $("#description").val(),
                deadline = $("#deadline").val(),
                user = $("#user").val(),
                username = $("#user option:selected").text(),
                locationData = $("#location").val().split(","),
                latitude = locationData[0],
                longitude = locationData[1];
            
            // Populating Todo Details Object
            todoDetails = {
                "title": title,
                "description": description,
                "deadline": deadline,
                "assignedTo": user,
                "username" : username,
                "latitude": latitude,
                "longitude": longitude
            };

            var createToDoMdl = new createNewTodoMdl();
            createToDoMdl.validateToDo(todoDetails, function(err, res) {    // Model Function for validating Todo Details
                if (res) {
                    createTodoObj.clearLocalStorage();                  // Function to clear storage data
                    $("#error").css("display", "none");
                    Backbone.history.navigate('todoList', {             // Redirecting to Todo List view
                        trigger: true
                    });
                }else {
                    $("#error").html(err.value);                            // Showing Error
                    _hideMask();                                            // Hide Masking
                }
            });
        },

        //Function to redirect to Map View.
        selectLocation: function() {
            var todoDetailsObj = {};                                        // Creating Object to Store the Todo Deitals

            localStorage.removeItem(MapLatLangDataObj);
            // Get values.
            var title = $("#title").val();
                description = $("#description").val(),
                deadline = $("#deadline").val(),
                user = $("#user").val();

            if($("#location").val() != ""){
                var locationData = $("#location").val().split(","),
                    latitude = locationData[0],
                    longitude = locationData[1];    
            }else{
                var latitude = null,
                    longitude = null;    
            }
            
            // Populating the Todo Details Object
            todoDetailsObj = {
                "title": title,
                "description": description,
                "deadline": deadline,
                "assignedTo": user,
                "latitude": latitude,
                "longitude": longitude,
                "currentPage" : "createNewTodo"
            };

            var todoDetailStr = JSON.stringify(todoDetailsObj);             // Converting the Object to String 
            localStorage.setItem(todoDetails,todoDetailStr);                // Storing the Stringified Object in LocalStorage.
            
            this.$el.off();                                                 // Removing event bindngs from the Current View
            this.$el.empty();                                               // clear the screen
           
            Backbone.history.navigate('selectLocation',                     // redirecting to ToDo List view
                {trigger: true});
        },

        //Function to Clear Local Storage Regarding Create Todo.
        clearLocalStorage : function(){
            // clear LocalStorage
            localStorage.removeItem(todoDetails);
            localStorage.removeItem(MapLatLangDataObj);
            localStorage.removeItem(currentViewUrl);
        }   

    });
    return createNewTodoObj;
});

