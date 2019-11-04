// require(".env").config();
var axios = require("axios");
// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

var command = process.argv[2]

switch(command) {
    case 'concert-this':
        // some stuff happens
        var artist = process.argv[3];
        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(function(response) {

            // If the request with axios is successful
            // console.log(response);
            for (key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    console.log(key + "->" + response.data[key])
                }
            }

            // console.log(response.data)
            
            // Then log the Release Year for the movie
            // console.log("Release year: " + response.data.Year)
            })
        // some stuff happens
        break;
    case 'spotify-this-song':
        // some stuff happens
        // some stuff happens
        break;
    case 'movie-this':
            var movie = process.argv[3];
            var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
            axios.get(queryUrl).then(function(response) {
                // If the request with axios is successful
                // console.log(response.data);
                console.log("Movie title: " + response.data.Title);
                console.log("Year released: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0]["Value"]);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1]["Value"]);
                console.log("Country of Production: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                })
        break;
    case 'do-what-it-says':
        // some stuff happens
        // some stuff happens
        break;
    

}