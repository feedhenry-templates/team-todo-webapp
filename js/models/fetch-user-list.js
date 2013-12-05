/*
 *  Copyright (c) 2012, 2013, FeedHenry Ltd. All Rights Reserved.
 * 
 *  - Contain calls to fetch user's list.
 *  - Validate and maintain data related to user list.
*/

define([
  // Includes all dependant libraries / files.
  'jquery',
  'underscore',
  'backbone',
  'services/fetch-user-list'

  ], function($,_, Backbone,fetchUsersListService){
      
      var fecthUsers = Backbone.Model.extend({
              
        initialize :function(){
           
        },
        //Function to fetch the User List
        fecthUsersList :function(callback) { 
          fetchUsersListService.fetchUsers(function(err,res) {                //Service call to fetch Users List
            if(res) {
              var todoUserList =res;
              var todoUsersArray = todoUserList.payload.fetchUsers.userList;
              
              //Looping over the reponse to Store it into the Hash Variable
              for(var i=0;i<todoUsersArray.length;i++){
                HashedUserList[todoUsersArray[i].userId] = todoUsersArray[i];                
              }
              localStorage.setItem("HashUserList", JSON.stringify(HashedUserList));
              return callback(null,res);                                          // Success callback.
            }
            return callback(err,null);                                          // Failure callback.
          });
        }
    });
  return fecthUsers;
});