Portal
=======
Contains the source code for application targeting the desktop Browsers and tablets. We mainly used the backbone.js and bootstrap frameworks for developing the Todo Application.
 
Main idea of application here is to:
It will be used by admin to create to-do for different users.
Admin can update as well as delete to-do.
Admin able to see to-do completed by users.

## Following is the directory structure under portal. ##
### i) css: 
Contains the css files. Which is playing important role in designing the UI (e.g style.css).
	
### ii) images: ###
 This folder contain images required throughout application (e.g. logo, icons etc.).

### iii) js: ###
 It contains mainly all necessary files and folders to build and run application on targeted devices:
		
#### controllers:
  Directory contains js files which load and control different screens. It also contains logic to render HTML templates.
		
#### lib:
Lib contain global.js file which has all global variables declaration, so that variables will be available through out app.

#### Models:  ####
Models mainly contains the logic to hold the data and its manipulations. Todo app. contains the following model files to hold data:
		
create-task.js:  Holds the data necessary and data validation logic for creating the new Todo.

fetch-task.js:  Contains call to fetch new to do.

fetch-user-list.js: Contains call to fetch user list as well as handle success, error response.
	
load-map.js : It mainly contains logic to render map and show the location using $fh.geo and $fh.map API's. 

login.js : Contains call to login authentication service, on success response save session key to localstorage.

session.js-   Holds the session data and respective manipulations (like holds session Id when user Logs In and clears when user Logs Out of application).
		
Update-task.js- This model handle data operation related to update todo task and its form fields validation.

	
#### Services: ####
Its a service layer which mainly contains methods to call the Cloud end point to fetch, read, update and create Todo's.
	
completed-task.js :	This service contain service call cloud fetchCompletedToDoAction end point using $fh.act service to submit the todo for completion. 

create-task.js:  This service having cloud call to create new todo using $fh.sync service as well as this service handles success / error response.
	
delete-task:  This file having service call handle to delete todo's using $fh.sync if user wants to delete using sync and service as well as $fh.act is user wants to make regular act call.

fetch-task:   This service file having service call to fetch todo list using $fh.act service.

fetch-user-list:  Service call to fetch user list using $fh.act service.
	
update-task:   Service call to update todo using $fh.sync service.

login.js  and logout.js:  Perform login and logout service call using $fh.act service.

template:   This folder contain HTML divs(snippet HTML),this divs represt different 		screens.
		
#### app-router.js :
This file define all route mappings throughout application.

#### app.js:
 Start/triggering point for application which includes all dependencies as well as include any common stuff need to be handled throught application, initializes Router.
		
### iv) index.html  
 Its the main template file which renders all the other templates under its div tag.
 Includes all necessary dependent js files.
 Include the app.js file here.
