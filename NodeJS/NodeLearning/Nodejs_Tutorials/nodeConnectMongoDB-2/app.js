/*
Handling GET, POST, Middleware, templating in this file.

*/


/*
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var consolidate = require('consolidate');
var mongoDB = require('mongodb');

var http = require('http');
var path = require('path');

var app = express();
var MongoClient = mongoDB.MongoClient;
var Server = mongoDB.Server;

// all environments

app.set('port', process.env.PORT || 3000);


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());;
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
/*
For post request, it can work without including this middleware
*/
app.use(express.bodyParser());
app.use(app.router);

/*
In express you can specifically register functions to handler errors. Specifiy a function with 4 arguments (err,req,res,next)
*/
function errorHandler(error, request, response, next) {

    console.error(error.message);
    console.error(error.stack);
    response.status(500);
    response.render("error_template", {
        error1: error
    });
};
app.use(errorHandler);


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
/*
https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html

1. Accessing MongoClient from mongoDB library.
2. Opening the connection to server from the mongoDB connection string which only driver understands.
    2.1. It means get mongodb server at port 27017. 
    2.2 /test: connect to test database.
    2.3 We are not checking return value, and adding a callback function. Whenever it's connected function will be called.
    2.4. Callback function has error and output parameter (as db)
3.  db.collection('things').findOne({}
    3.1 whichever database is connected (test in this case), will hold a reference to inside db variable. 
    3.2 we are looking for "things" collection and run the function findOne(), 1st parameter is "no query selector".

*/
/*
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    if (err)
        throw err;
    db.collection('things').findOne({}, function(err, doc) {

        console.dir("Inside Call Back function of db.collections");
        if (err) throw err;
        console.dir(doc);
        db.close();
    });

    console.dir("connection callback function called :D");

});
*/

var mongoclient = new MongoClient(new Server("localhost", 27017, {
    "native_parse": true
}));

var db = mongoclient.db("demo");

app.get('/', function(requsest, response) {

    db.collection("swig").findOne({}, function(err, doc) {
        //response.send(doc);

        response.render("hello", doc);
        /*
our templating engine is looking for a name field, and our doc consists of a name: kshitij gautam. 
*/
    });



});

app.get('/variables/:name', function(request, response, next) {


    var name = request.params.name;
    var email = request.query.email;
    var age = request.query.age;
    var message = request.query.message;


    response.render('getVariables', {
        name: name,
        age: age,
        email: email,
        message: message
    });


});

/*

Handling favourite laptop using post request
*/
app.get("/getLaptops", function(request, response, next) {

    response.render("laptopPicker", {
        "laptops": ["Apple", "Asus", "Dell"]
    });

});

/*
The next object here means: is actually a function passed in by Express with request and response objects.

We can actually use it to handle errors.
*/
app.post("/favourite_laptop", function(request, response, next) {

    var favourite = request.body.laptop;

    if (typeof favourite === "undefined") {

        /*
        Passing an Error object to Express, and express looks for errorHandler middleware by (app.use(errorHandler);)
        */
        next(Error("Please Choose a laptop"));


    } else {
        response.send("Your Favourite laptop is: " + favourite);
    }


});
/*
Finished Post request.

*/
app.get('*', function(request, response) {

    response.send(404, "Page Not Found");

});

mongoclient.open(function(err, mongoclient) {

    if (err) throw err;

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });

});