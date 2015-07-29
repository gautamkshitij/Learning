var mongojs = require('mongojs');
//var db = mongojs('demo', ['sourceData']);
var fs = require('fs');
var dummyjson = require('dummy-json');
var mongoDB = require('mongodb');
var helpers = {
    gender: function() {
        return "" + Math.random() > 0.5 ? 'male' : 'female';
    },
    dob: function() {
        var start = new Date(1900, 0, 1),
            end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },
    hobbies: function() {
        var hobbysList = [];
        hobbysList[0] = [];
        hobbysList[0][0] = ["Acrobatics", "Meditation", "Music"];
        hobbysList[0][1] = ["Acrobatics", "Photography", "Papier-Mache"];
        hobbysList[0][2] = ["Papier-Mache"];
        return hobbysList[0][Math.floor(Math.random() * hobbysList[0].length)];
    }
};

var mongoClient = mongoDB.MongoClient;
var mongoServer = mongoDB.Server;

console.log("Begin Parsing >>");

var template = fs.readFileSync('schema.hbs', {
    encoding: 'utf8'
});
var result = dummyjson.parse(template, {
    helpers: helpers
});

console.log(result.length);

console.log("Begin Database Insert >>");

mongoClient.connect('mongodb://localhost:27017/mapReduceDB', function(err, db) {
    if (err)
        throw err;
    //    db.collection('sourceData').findOne({}, function(err, doc) {
    //
    //
    //        if (err) throw err;
    //        console.dir(doc);
    //        db.close();
    //
    //    });
    var i = 0;
    db.collection('sourceData').insert(result, {
            continueOnError: true,
            safe: true
        },

        function(err, doc) {
            if (err && err.code != "11000") {
                throw err;
            }
            console.log(++i);
        });


});