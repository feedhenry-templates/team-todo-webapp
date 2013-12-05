/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Contain calls to login authentication service.
 *  - Validate and maintain authentication related data.
*/
define([
	// Includes all dependant libraries / files.
	'jquery',
	'underscore',
	'backbone',
	'models/sessions',
	'services/login'
	], function($,_, Backbone,sessionModel,loginServices){
		
	  var login = Backbone.Model.extend({
			   
	  initilize :function(){
				   
	  },

	  //Function to Validate the User Credentials
	  validate :function(emailId,password,callback) {	
		loginServices.authUser(emailId,password,function(err,res) {        // Login Service Called to Authenticate User
		  // if user is authenticated
		  if(res) {
			if(typeof (res.header.sessionId) != 'undefined' && $.trim(res.payload.login.status.code) == "SUCCESS_200"){ // Checking if the Session Id is Present and the User is Valid
			  sessionModel.save(sessionKey,res.header.sessionId,function(error,resp){ // Saving the Session in Local Storage
				if(resp == true){
				  return callback (null,"true");      
				} else {
				  // Navigate to Login Page if unsuccess  
				  var err = { "value":"Invalid User",'status': 401 };
				  return callback (err.value,"true");
				}
			  });
								   
			}else {
				var err = { "value":"Error",'status': 401 };
				return callback (err.value,"true");
			}
		  }else{
			var errorMSg = err.response.payload.error.description; // Error Message.
			return callback (errorMSg,null);
		  }
		});      
	  }
			   
  });
  return login;
});
