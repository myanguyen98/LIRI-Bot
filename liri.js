var request = require("request");
var inquirer = require("inquirer");
var keys = require("./keys.js")
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Main inquirer function to start the whole app
//----------------------------------------------------------------------------------------------------
inquirer.prompt([
		{
			type:"list",
			name:"master",
			message:"Welcome to my Node LIRI-Bot. Please choose a subject to get started.",
			choices:["Twitter","Spotify","Movies"]
		}])

		.then(function(inquirerResponse){
			if (inquirerResponse.master === "Twitter") {
				twitterPrompt();
			} else if(inquirerResponse.master === "Spotify"){
				spotifyPrompt();
			} else if(inquirerResponse.master === "Movies"){
				moviePrompt();
			};
		})
//Spotify commands
//-------------------------------------------------------------------------------------------------
function spotifyPrompt(){
	var spotifyArgs = process.argv;
		var spotifySearch = "";
		for (var i = 2; i < spotifyArgs.length; i++) {
			spotifySearch = spotifySearch + " " + spotifyArgs[i];
		}

	 inquirer.prompt([
		{
			type:"input",
			name:"spotify",
			message:"Please enter the name of a song and watch the command line display information for that track."
		}])

		.then(function(inquirerResponse){
			spotifySearch = inquirerResponse.spotify;
			displaySpotify();
		})

	function displaySpotify(){ 
		
	 
				var spotify = new Spotify(keys.Spotify);
				 
				spotify.search({ type: 'track', query: spotifySearch }, function(err, data) {
				  if (err) {
				    return console.log('Error occurred: ' + err);
				  }
				  var song = data.tracks.items[0]
				  console.log("\n--------------------------------------------------------"+
				  	"\nSong Name: "+song.name+
				  	"\n--------------------------------------------------------"+
				  	"\nArtist: "+song.artists[0].name+
				  	"\n--------------------------------------------------------"+
				  	"\nLink to song on Spotify: "+song.external_urls.spotify+
				  	"\n--------------------------------------------------------"+
				  	"\nOriginating Album: "+song.album.name+
				  	"\n--------------------------------------------------------")
					
				});

	};
};
//Twitter commands
//------------------------------------------------------------------------------------



function twitterPrompt(){
	var twitterSearch = "";
	inquirer.prompt([
		{
			type:"input",
			name:"twitter",
			message:"Please enter a twitter username (no spaces) and watch the command line display the user's latest tweets."
		}])

		.then(function(inquirerResponse){
			twitterSearch = inquirerResponse.twitter;
			displayTweets();
		})

	function displayTweets(){

		var client = new Twitter(keys.twitterKeys
		);
		 
		var params = {screen_name: twitterSearch };
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {

		    for (var i = 0; i < tweets.length; i++) {
		    	console.log("Tweet Posting Date: "+tweets[i].created_at+
		    		"\nTweet Contents: "+tweets[i].text+"\n--------------------------------------------------------");
		    }
		  }
		});
	};
};

//Movie commands
//-------------------------------------------------------------------------------------------------
	
function moviePrompt(){
		var nodeArgs = process.argv;
		var search = "";
		for (var i = 2; i < nodeArgs.length; i++) {
			search = search + " " + nodeArgs[i];
		}

		inquirer.prompt([
		{
			type:"input",
			name:"movie",
			message:"Please enter the name of a movie and watch the command line display information for that film."
		}])

		.then(function(inquirerResponse){
			search = inquirerResponse.movie;
			displayMovies();
		})




	function displayMovies(){
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
};
