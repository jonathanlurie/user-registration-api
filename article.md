
# JWT Authentication & Authorization in NodeJs/Express & MongoDB REST APIs(2019)



In this simple tutorial, we shall create a simple REST API that will enable us to create a user, log in the registered user, get the user profile, log out a user from a single device, and log out a user from multiple devices. We will be using Node.js/Express and MongoDB. We shall use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), a cloud database service that hosts MongoDB databases to store our data. You can always set up a local MongoDB database however, I will not be talking about installing and configuring a MongoDB database locally in this tutorial.

If you’re mostly interested in the code. Find the repo [here](https://github.com/fatukunda/user-registration-api).

**Learning prerequisites**

* Be familiar with JavaScript ES6

* Basic knowledge about REST APIs

* Willingness to learn

**Outline**

Below is an outline of the steps we will take to accomplish this task. At the end of this tutorial, you should be able to easily include basic authentication and authorization in your Node.js projects.

* Create a MongoDB database on MongoDB Atlas.

* Setup a file structure for the project.

* Install all the required npm packages.

* Define the environment variables.

* Create an express server.

* Connect to the database.

* Create the User Model.

* Create the necessary routes.

* Create the auth middleware and more routes.

* Conclusion

**Step 1: Create a MongoDB database on MongoDB Atlas**

Head over to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and click on Start free to create an account. After creating an account, you will be welcomed with a modal like the one in figure 1 below.

![Figure 1: A welcome modal](https://cdn-images-1.medium.com/max/4244/1*AYlqX_p7CFyu6s-LL2hn4A.png)*Figure 1: A welcome modal*

Click on the Build my first cluster button and then you will be asked to choose the cloud provider and the region nearest to you. It’s important to note that behind the scene, MongoDB Atlas uses Amazon Web Services, Google Cloud Platform or Azure. For the cloud provider, we shall maintain the default option AWS and for the region, we shall select the nearest free tier. For my case, I will choose Frankfurt(eu-central-1) tier because it’s the closet region to me. Leave the other settings as they are and click theCreate Cluster button at the very bottom-right of the page.

![Figure 2: Choose a cloud provider and nearest region.](https://cdn-images-1.medium.com/max/4244/1*zCgmVssiG7i-lN1P-W3FhA.png)*Figure 2: Choose a cloud provider and nearest region.*

The cluster creation will take between 7–10 minutes to complete. You will notice a pop-up window in the left-bottom that shows a list of tasks to accomplish. Minimize the pop-up window and let’s continue.

After the cluster has been created, click on theCONNECT button to create a database connection. A pop-up window like the one below will be displayed.

![Figure 3: Configure the database](https://cdn-images-1.medium.com/max/4244/1*WsPQfHBtTAdErqjEILCoMQ.png)*Figure 3: Configure the database*

Click on the Add a Different IP Address button and in the IP Address text field enter the following IP 0.0.0.0/0 which will whitelist all IPs and allow access of your database from anywhere, then click the Add IP Address button. Still, on the same page, enter a username and password. Make sure you keep a note of those credentials because we shall need them to connect to that database. Click on theCreate MongoDB User button and then click the choose a connection method button. Finally, choose the Connect Your Application option. Ensure that in the driver drop-down, Node.js is selected. Copy the connection string at the bottom and paste it somewhere for now. We shall use it in our application to connect to the database.

![Figure 4: The connection string](https://cdn-images-1.medium.com/max/4244/1*F0FaqrfLXw-jjin8wqqbUQ.png)*Figure 4: The connection string*

Finally, our database set up is done and it’s time to set up our project structure.

**Step 2: Setup a file structure for the project**

Now that our database is well set up, we can go ahead and create our project. Create a folder anywhere on your computer and name it. I’ve named mine user-registration-api . You can decide to name yours differently. Go ahead and set up a file structure like the one below.

![Figure 4: Project file structure](https://cdn-images-1.medium.com/max/2000/1*aAO32M6t44hUT7kDvUqLzQ.png)*Figure 4: Project file structure*

From the above file structure, you will realize that we have a root folder called src and inside it, we have an app.js file. This is where we shall define our express server. We also have 4 folders inside src whose names are descriptive of the files we are creating in there. The models folder will contain all the models and for this project, it will just be the User model. The db folder shall contain our database connection, the routers folder shall contain our user routes, and finally, the middleware folder shall contain all our middleware. For this project, we shall be creating one middleware called auth which will help us to set up protected endpoints.

Let's start by opening our project in a text editor. I will be using [VS-Code](https://code.visualstudio.com/) for this project but you can use your own favorite text editor if you have one. Before we start, make sure you have Node.js installed on your computer. If not, navigate to [nodejs.org](https://nodejs.org/en/), download and install the latest version of node. After it’s been installed, open your terminal and type the command node -v and hit enter. This should print out the version of Node you have installed on your computer.

Once installed, Node.js comes with its package manager npm. Still on the terminal. Type npm -v to confirm that you have npm installed. This command should print the version of npm installed. NPM is used to install and manage all the packages in a node project but there are other Package managers that you can use and one of the popular ones is [yarn](https://www.npmjs.com/package/yarn) which I personally find easier to use and will be using in this project.

To install yarn on windows, just head over to your terminal and type npm install yarn -g. For Mac and Linux users, type sudo npm install yarn -g . This will prompt you for your computer password. Provide it and hit enter.

Once that’s done, still, on your terminal, navigate to your project root folder and type yarn init to initialize our node project. This will provide you with a series of questions that you can navigate through by just hitting enter to accept the default options. This process will create a package.json file which will list all the packages our project depends on.

**Step 3: Install all the required NPM packages**

Our project will need a number of npm packages and below is the list of those packages and a brief explanation of what each of those packages will help us achieve.

* [Express.js](https://expressjs.com/) — A node.js framework that makes it easy to build web applications.

* [mongodb](https://www.npmjs.com/package/mongodb) — Official MongoDB driver for Node.js

* [mongoose](https://www.npmjs.com/package/mongoose) — An object modeling tool designed to work in an asynchronous environment. We shall use mongoose to define database schemas and interact with the database.

* [bcrypt.js ](https://www.npmjs.com/package/bcryptjs)— This will help us hash user passwords before storing them into the database.

* [validator](https://www.npmjs.com/package/validator) — We shall use this package to validate and sanitize user input, for example, we need to ensure that a user gives us an email in the right format.

* [Jsonwebtoken ](https://www.npmjs.com/package/jsonwebtoken)— JSON Web Token(JWT) will be used for authentication and authorization. This package will help to set up protected routes that only logged in users can access.

* [env-cmd](https://www.npmjs.com/package/env-cmd) — This will enable us to create and manage environment variables in our project.

* nodemon — Nodemon will re-run the express server every time we make changes to our code.

Now that we know what each of those packages will do, let's go ahead and install them. In your terminal, make sure that you’re still in the root directory of your project, type the following command yarn add express mongodb mongoose bcryptjs validator jsonwebtoken . This command will install all those packages and add them among our dependencies in the package.js file. Let’s also add nodemon, and env-cmd as development dependencies by running the command yarn add env-cmd nodemon --dev.

Before we go to the next step, let’s first include an environment file where we shall define our environment variables. In the root folder, on the same level with the src folder, create a .env file.

Open package.json and add the following script just after the main:index.js line. "scripts":{"start" : "env-cmd -f ./.env nodemon src/app.js"} . This means that every time we run the command yarn start , we’ll use nodemon to serve our server that’s defined in src/app.js and we will use our environment variables defined in the .env file.

**Step 4: Define the environment variables**

Open the .env file and add the following environment variables.

<iframe src="https://medium.com/media/ad6a3e6b641f726cb3266782fa7cb2bb" frameborder=0></iframe>

The MONGODB_URL variable holds the connection string that we got after configuring our MongoDB on MongoDB Atlas. Remember the string I asked you to copy and paste somewhere. You will notice that my connection string has a database username that I provided — fatukunda . This should be different from yours. The <password> portion should be replaced with the password you chose when you created the database user. Also, let's replace the database name test to user-registration-db

The JWT_KEY variable will hold our JWT token key that we shall use to create the user authentication token and the PORT variable contains a port number where our app will be running.

**Step 5: Create an express server**

Head over to app.js and type the following code.

<iframe src="https://medium.com/media/489ebf84c76785efede3d194e6ffa4d3" frameborder=0></iframe>

In the above code snippet, we load express into our file, we then require the user router that we shall create later, and we set our port number to be the number in the PORT environment variable and we then require the db.js file that has our database connection which we shall create shortly. We then create an express() instance and assign it to app . Since we are going to be building an API, we are going to expect our requests to parse the data that we send and receive from the server to be in json format. If you’re not familiar with JSON , please learn more [here](https://www.w3schools.com/whatis/whatis_json.asp). The express instance gives us methods like get, post, delete, patch that we use to send HTTP requests to the server.

Go to your terminal and type the command yarn start . You should be seeingServer running on port 3000 on your terminal. That means we’ve successfully set up our express server.

**Step 6: Connect to the database**

Go to db/db.js file and type the code below.

<iframe src="https://medium.com/media/503282938f39ea2fd76685169781e91f" frameborder=0></iframe>

In the code above, we are requiring mongoose into our file and using the mongoose connect method which takes in the database URL as one of its parameters and an object of options as the second parameter. We should understand that mongoose uses the MongoDB driver behind the scenes and there are several deprecations in the MongoDB driver that mongoose users should be aware of and cater for in order to avoid deprecation warnings from popping up into their console. We, therefore, supply the useNewUrlParser and useCreateIndex to avoid such deprecation warnings. A full list of deprecation warnings in MongoDB driver that you should be aware of when using mongoose can be found [here](https://mongoosejs.com/docs/deprecations.html). That’s all we will need to create our connection to the database.

**Step 7: Create the User Model**

Now it’s time to define our user model. Head over to /models/User.js file and type the following code.

<iframe src="https://medium.com/media/6a71ac19845e76fe1edaac6ff37910a4" frameborder=0></iframe>

From line 1 to line 4, we load in the required packages and on line 6 , we create our mongoose schema which takes in an object. This object defines the different properties of the user schema. Mongoose will convert our user schema into a document in the database and those properties will be converted into fields in our document. As you might have noticed, when we define the properties, we also define their characteristics for example whether they are required or not, their types, whether they are unique or not and whether they should be lowercase or not. Mongoose provides us with all these options that you can easily define on your properties. We, for example, want the emails to be unique and to be in lowercase . The validate function helps us make some more validations on our schemas. We are using the validator package to easily define validations that would have taken us many lines of code to write. The validator package provides a number of functions like isEmail which validates if a given string is a valid email and many more. Learn more about validator from [here](https://www.npmjs.com/package/validator).

We shall also store a list of tokens in our database. Every time a user registers or logs in, we shall create a token and append it to the existing list of tokens. Having a list of tokens enables a user to be logged in on different devices and once they log out of one device, we still want to make sure that they are still logged in on another device that they had logged in.

From line 36 to 43, we define a pre-save function that the mongoose schema provides us. This enables us to do something before we save the created object. As you can see, we are trying to hash the password before saving the object. Ideally, you shouldn’t be saving passwords in a raw format. They should be properly hashed. We are using bcrypt to hash the password. We want to make sure that we only hash the password if it’s modified and that’s why we have to first check if the password was modified.

Mongoose also enables us to define both instance and model methods. Model methods are methods defined on the model and can be created by using the schema statics whereas instance methods just like their name suggests are defined on the document/instance. From, line 45 to 52 , we define an instance method called generateAuthToken . This method uses the JWT to sign method to create a token. The sign method expects the data that will be used to sign the token and a JWT key which can be a random string. For our case, we defined one in the .env file and named it JWT_KEY . Once the token is created, we add it to the user’s list of tokens, save, and return the token.

From, line 54 to 65, we define a model method called findByCredentials which expects two parameters, the user email, and password. on, line 66 we search for a user with the given email using the mongoose find method. If the user is not available, we throw an error to let the user know that the credentials they provided are invalid. If the email exists, we then compare the received password with the stored hashed password and if they match, we return that user. We shall use this function to log users into the application.

Finally, on, line 67 , we create a model called User and pass it our created user schema and we then export the module so that it can be re-used in other files.

**Section 8: Create the necessary routes**

It’s finally time to create our different routes. Below is the list of endpoints we shall be creating.

* HTTP POST /users — Register users.

* HTTP POST /users/login — Allow users to login.

* HTTP GET / users/me — Get user profile.

* HTTP POST /users/logout —Logout the user

* HTTP post /users/logoutall — Logout from all devices.

Let’s start with creating users router. Head over to /routers/user.js and write the following code.

<iframe src="https://medium.com/media/498636ccf70bc8cdc23d1d69ff29dc13" frameborder=0></iframe>

In the code snippet above, we are creating two routers. The POST /users router to create a new user and the POST /users/login router to log in a registered user.

The user registration router creates a new user along with the given user information that we access from the req.body. After saving the user, we generate an authentication token and return it as a response alongside the user data. In order to test if our router works as expected, we are going to install [postman](https://www.getpostman.com/downloads/) — An API development environment. Once postman is installed. Boot it up and go ahead to write your first request.

![Figure 5: A postman POST /users request](https://cdn-images-1.medium.com/max/4500/1*B-yA2R1T1vMCWTB-kf1rqA.png)*Figure 5: A postman POST /users request*

Make sure that the type of request being sent is a POST request and ensure that the URL is localhost:3000/users . Select the raw radio button and the JSON(application/json) on the type of data. Provide the required fields which are name, email and password like we defined them in our user model. Before you hit the Send button, make sure that your server is running. If not, type the command yarn start on your terminal. Hit send on Postman and if everything went well, you should have an output similar to the one I have in figure 5 above.

Test the POST /users/login route by changing the URL and body options. This time provide the email and password . Hit send and if all went well, you should receive a response similar to the one in figure 6 below.

![Figure 6: A postman POST /users/login request](https://cdn-images-1.medium.com/max/4500/1*dC2jvQOAVm45HmfHHlRtrw.png)*Figure 6: A postman POST /users/login request*

**Section 9: Create the auth middleware**

Middleware is a software/ piece of code that acts as a bridge between the database and the application, especially on a network. For the case of this project, we want to ensure that when a request is sent to the server, some code(middleware) is run before the request hits the server and returns a response. We want to check if a person who is trying to access a specific resource is authorized to access it.

Head over to /middleware/auth.js and write the following code.

<iframe src="https://medium.com/media/aa9545b3a52400f987fd32efe6f4e9a0" frameborder=0></iframe>

An express middleware is simply a function with three parameters, the request, response and next . On, line 5, we get the token from the request header and since the token comes in a format of, Bearer[space]token we are replacing Bearer[space] with nothing('') so that we can have access to our token. Once we have the token, we use the JWT verify method to check if the token received is valid or was created using our JWT_KEY . The JWT verify method returns the payload that was used to create the token. Now since we have the payload from the token, we can now find a user with that id and also if the token is in the user’s tokens array. Once we find that user, we attach the user on our request (req.user = user) and then do the same for the token then call next() to go to the next middleware. If next() is not called, the application will freeze at that point and won’t proceed to run the rest of the code.

Now to use our auth middleware, we are going to go back to /routers/user.js, import our auth middleware by requiring it at the top of the file just after requiring the user model. The following line of code should do it. const auth = require(../middleware/auth) , then create another router to get the user profile. Add the following code right after the login endpoint.

<iframe src="https://medium.com/media/fb95785c5fd75eee761b11914066e7c2" frameborder=0></iframe>

Just 2 lines of code and you get the user profile. On, line 1, I make a get request to the /users/me endpoint and then I pass in my auth middleware just before the method. This will ensure that the middleware is run before executing the rest of my function. On, line 3, I simply get the user profile from the request(Remember I added the user to the request in my middleware and since my middleware will have already run at this point, I will have access to the user in my request) and send it back as my response. Let’s test it out using Postman. Go to postman and head over to GET/users/me, provide an authentication token and send out the request. You should have a response similar to the one below if all went well.

![Figure 7: GET /users/me](https://cdn-images-1.medium.com/max/4500/1*4lche_iL1JLRu_Ngiln5Yw.png)*Figure 7: GET /users/me*

Notice the Authorization tab is selected and in there, Bearer Token is chosen from the drop-down and on the right, a token is provided. You can use the token that you receive after login.

**Section 10: Logout/Logout all**

In this last section, we shall write two routes for log out and log out all. Logout all will log out the user from all the devices they are signed in.

Now, let’s go back to /routers/user.js and create 2 other routes. Just after the user profile route. Type the following code.

<iframe src="https://medium.com/media/d7581823fab638ba8d47c75bba4c8186" frameborder=0></iframe>

In the code above, the first route /users/me/logout , we filter the user’s tokens array and return true if any of the tokens is not equal to the token that was used by the user to login. The array filter method creates a new array with all elements that pass the test implemented. In our case above, the filter method will return a new array that contains any other tokens apart from the one that was used to log in. If we, therefore, try to get the user profile, we should be denied access since we are no longer logged in. Read more about the filter method from [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

Head over to postman, first, login, get the token from the response, then head over to /users/me/logout and use that token as the Bearer Token. Hit send. A 200 response code should be returned. Now go to /users/me and try to access your profile using the same token that you used to log out. An error response should be returned like the one in figure 8 below.

![Figure 8: Accessing a protected resource after logging out will result in an authentication error](https://cdn-images-1.medium.com/max/4500/1*oiu72Xkm5ZtusYcVIMQ4IQ.png)*Figure 8: Accessing a protected resource after logging out will result in an authentication error*

In the 2nd route, /users/me/logoutall, we use the splice array method to remove tokens from the user’s tokens array. We then save the user document. To test this endpoint, let’s head over to Postman visit the /users/login endpoint. Let’s login 3 times. After that, head over to /users/me view the user profile. You will notice that you now have 3 tokens in the tokens array. Now go to /users/me/logoutall . This will clear the tokens array which means if you now navigate to /users/me again, you shouldn’t be able to view the user profile. Read more about the splice array method from [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

**Step 11: Conclusion**

We’ve come a long way but I hope you’ve been able to learn something from this tutorial. Feel free to reach out with any questions regarding this tutorial. You can also find the entire project repo on GitHub. Here is the [link](https://github.com/fatukunda/user-registration-api) to the repo.

Cheers!!
