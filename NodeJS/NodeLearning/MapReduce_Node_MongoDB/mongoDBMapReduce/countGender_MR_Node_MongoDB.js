// run node index.js in the terminal below
// complete tutorial can be found : http://thejackalofjavascript.com/mapreduce-in-mongodb
//http://benl.com/post/19927781665/mapreduce-with-mongodb-nodejs

//http://stackoverflow.com/questions/14526141/annoying-message-when-use-mongodb


//var mongojs = require('mongojs');
//var db = mongojs('mongodb://localhost:27017/MapReduce', ['sourceData', 'example1_results']);
//var example1 = {};
//example1.execute = function() {
//    var mapper = function() {
//        emit(this.gender, 1);
//
//    };
//
//    var reducer = function(gender, count) {
//        return Array.sum(count);
//    };
//
//    db.sourceData.mapReduce(
//        mapper,
//        reducer, {
//            out: "example1_results"
//        }
//    );
//
//    db.example1_results.find(function(err, docs) {
//        if (err) console.log(err);
//        console.log("\n", docs);
//    });
//};

var mongodb = require('mongodb'),
    server = new mongodb.Server("localhost", 27017, {}),
    sys = require('util'),
    db = new mongodb.Db('test', server, {
        w: 'majority'
    });

db.open(function(error, client) {
    if (error) throw error;
    var mapFn = function() {

        emit(this.gender, 1);
    };
    var reduceFn = function(gender, count) {
        return Array.sum(count);
    };

    var MR = {
        mapreduce: "sourceData", //collectionName
        out: "newData", //outputed to new Collection "newData"
        //        {
        //            inline: 1 //to get results back to javascript
        //        }

        map: mapFn.toString(),
        reduce: reduceFn.toString()
    }

    db.executeDbCommand(MR, function(err, dbres) {
        console.log(dbres);
        var results = dbres.documents[0].results
        console.log("executing map reduce, results:")
        console.log(JSON.stringify(results))
        process.exit(1)
    })
})


//module.exports = example1;