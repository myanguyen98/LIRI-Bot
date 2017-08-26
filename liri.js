var request = require("request");
var inquirer = require("inquirer");

	var nodeArgs = process.argv;
	var search = "";
	for (var i = 2; i < nodeArgs.length; i++) {
		search = search + " " + nodeArgs[i];
	}

	inquirer.prompt([
	{
		type:"input",
		name:"movie",
		message:"Welcome to my OMDB LIRI-Bot. Please enter the name of a movie and watch the command line display information for that film."
	}])

	.then(function(inquirerResponse){
		search = inquirerResponse.movie;
		display();
	})




function display(){
request("http://www.omdbapi.com/?t="+search+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {

  
  if (!error && response.statusCode === 200) {

    console.log("Here is some information for "+search+":");
    console.log("\nRelease Year: "+JSON.parse(body).Year+
    	"\nIMDB Rating: "+JSON.parse(body).imdbRating+" out of 10 stars"+
    	"\nRotten Tomatoes Score: "+JSON.parse(body).Ratings[1].Value+
    	"\nProduction Country: "+JSON.parse(body).Country+
    	"\nLanguage: "+JSON.parse(body).Language+
    	"\nCast: "+JSON.parse(body).Actors+
    	"\nBrief Summary: "+JSON.parse(body).Plot);
  }
});
};