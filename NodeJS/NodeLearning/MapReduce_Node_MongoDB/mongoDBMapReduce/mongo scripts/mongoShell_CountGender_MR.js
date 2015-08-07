mapper = function () {
	emit(this.gender, 1);
};
 
reducer = function(gender, count){
 	return Array.sum(count);
};
 
db.sourceData.mapReduce(
	mapper,
	reducer,
	{
		out : "countGenderResults"
	}
 );
 
 db.example1_results.find()