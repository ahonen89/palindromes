# Palindromes demo app
Demo project for adding palindromes, retrieving them (with pagination). Unit and integration tests included.

**1. Problem to solve:**

Palindrome Database  

We want to build a web app that stores a number of palindromes. A palindrome is a word or phrase string that reads the same backwards as forwards, independent of spaces and punctuation.  
An example could be 'Dammit I'm Mad'.   
The service has a simple REST interface that presents two endpoints:  

- An endpoint that accepts a string parameter, that will return true if the string is palindrome (and false otherwise)  
- An endpoint that returns a list of the last 100 palindromes the system has received in the last 10 minutes (there is no need to persist the palindromes, it is OK to keep them in memory)  

This system should have an UI for the users to interact with these endpoints through a browser.   
We would like for it to be a single page web application and to have pagination for the second request.    

Technical constraints  

- Consider how the API and the interface should communicate errors
- Please think about how it could be extended in the future - although simple code always wins against over-engineered!
- Run instructions are always welcomed
- Think about proper testing

**2. Solving the problem:**

I have build a web app (REST API + angular UI).  
It can be reached by following the URL: http://localhost:8000  
The app was built in node.js, using express web framework.  

The app has no relational/non-relational database. Instead it consists of a file.  
The solution comes with corresponding unit and integration (api) tests.  

How the app could be extended in the future:
- add palindrome validation on the client side.
- improve UI: display errors based on error code (and errors.json file) from server side.
- improve UI: make the UI responsive.

**3. App structure**

The app was structured (organized):  
/  
/app_api (represents the API)  
/app_client (client application - angular)  
/app_server (server application - currently it just serves the index page)  
/test (folder containing unit and integration tests)  
/public (folder for static content and assets. Also includes bower_components which includes UI libraries).  
/bin/www.js (entry-point)  
app.js (express application)  
package.json (specifies app meta-data and dependencies)  

app_api, app_cliet, app_server are all organized to contain separate folders for different components  
of the application: controllers, routes, views, models, etc  

**4. Endpoints**

GET host:8000 / (index page)  
POST host:8000 /api/palindromes (add new palindrome)  
GET host:8000 /api/palindromes?offset=0&limit=5 (retrieve palindromes. Supports pagination params)  

**5.Deployment instructions**

Clone github repository or download zip file.  
"cd" into the folder and run "npm install" to install the app's dependencies.  

After the dependencies are installed:  
"npm start" for running the app.  
"npm test" for running the tests.  

While the app is running, you can hit the endpoints with a client (e.g. Postman)  