/**
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
var mongoClient = mongoDB.MongoClient;
var mongoServer = mongoDB.Server;

// all environments

app.set('port', process.env.PORT || 3000);


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
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
mongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
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

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/', function(requsest, response) {
    response.render('hello', {
        'name': 'Welcome to Swig, Consolidate'
    });
    //render(filename, jsonObject with template engine variable names)
});
app.get('*', function(request, response) {

    response.send(404, "Page Not Found");

});
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});