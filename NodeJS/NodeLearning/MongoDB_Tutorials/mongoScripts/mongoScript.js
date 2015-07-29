conn = new Mongo();
db = conn.getDB("demo");

var doc = db.things.findOne();

printjson(doc);