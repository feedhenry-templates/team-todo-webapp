/*
 * Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Contains : 
 *  - login view rendering logic.
*/

define([
    // Includes all dependant libraries / files.
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html',
    'models/login',
    'models/sessions',
    'models/fetch-user-list'
    ], function($, _, Backbone,loginTemp,loginModel,SessionModel,fetchUsersModel){
        var loginView = Backbone.View.extend({
            el: $('.container'),
            events : {
                'click #loginBtn' : 'login'
            },
            // Method gets called when Initializes the login view
            initialize : function(){
                // Clearing Local Storage  
                 localStorage.clear();
             }, 

            // Renders View
            render: function(param){
                this.$el.empty();                                // Clears pervious DOM element.
                var compiledTemplate = _.template(loginTemp);    // Compile the login template using underscore
                this.$el.append( compiledTemplate );             // Load the compiled HTML into the Backbone "el"
                _hideMask();
            },

            // Gets called on login button click event. Authenticate user and decide further navigation.
            login : function() {
                _showMask();                    // Show masking.                

                var id = $.trim($("#email").val()),
                    pass = $("#password").val(),
                    loginMdl = new loginModel(),
                    currentView = this;

                this.applyCSS(id, pass);
                
                // Empty field condition check.
                if("" == id && "" == pass) {                    
                    $("#error").html("Please enter username and password");
                     _hideMask();
                }
                else if(""==id) {                    
                    $("#error").html("Please enter username");
                     _hideMask();
                }
                else if(""==pass) {                    
                    $("#error").html("Please enter password");
                     _hideMask();
                }
                else {
                    // Call to Login Model function for authentication.
                    loginMdl.validate(id,pass , function(err,res){
                        if(res) {                            
                            // On success redirect to TodoList
                            Backbone.history.navigate('todoList', {     
                                trigger: true
                            });                            
                        }
                        else {                            
                            // On Error Populate the Error
                            $("#error").html(err);           
                             _hideMask();
                        }
                    });
                }                   
            },
            applyCSS: function (username, password) {
                // Handling Client Side Validations of the User                                
                $("#loginError").css("display","none");                
                if (username === "") {
                    $("#email").css( "border", "none" );
                    // Apply css to error fields 
                    $("#email").css( "border", "1px solid red" );
                };
                if (password === "") {
                    $("#password").css( "border", "none" );
                    // Apply css to error fields
                    $("#password").css( "border", "1px solid red" );
                };
            }
        });
        return loginView;
    });
