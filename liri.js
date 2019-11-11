require("dotenv").config();
var axios = require("axios");
var inquirer = require("inquirer")
var moment = require('moment')
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

inquirer.prompt([
  {
    type: "checkbox",
    name: "command",
    message: "What would you like me to do?",
    choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
  },
  {
    type: "input",
    name: "userSearch",
    message: "What would you like to search?",
  },
])
  .then(function (response) {

    if (response) {
      console.log("\nSearching for " + response.userSearch + "...");
      var command = response.command.toString();

      switch (command) {
        case 'concert-this':
          var artist = response.userSearch
          var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
          axios.get(queryUrl).then(function (bandsResponse, err) {
            // If the request with axios is successful
            if (bandsResponse.data.length <= 0) {
              return console.log('Error occurred: ' + err);
            }
            // else if (artist === '...') {
            //   console.log("NOOOOO")
            // }
            else {
              for (x = 0; x < bandsResponse.data.length; x++) {
                console.log("Venue: " + bandsResponse.data[x].venue.name + "\nLocation: " + bandsResponse.data[x].venue.city + ", " + bandsResponse.data[x].venue.country + "\nDate: " + moment(bandsResponse.data[x].datetime).format('L, HH:mm') + "\n---------------");
              }
            }
          })
          // some stuff happens
          break;
        case 'spotify-this-song':
          var search = response.userSearch;
          // console.log(search)
          spotify.search({ type: 'track', query: search }, function (err, spotifyData) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            else if (spotifyData.tracks.items.length<1) {
              console.log("Artist: Ace of Base" + "\nTrack: The Sign" + "\nAlbum: The Sign (US Album) [Remastered]" + "\nURL: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE" + "\n-----------------")
            }
            else {

              for (i = 0; i < spotifyData.tracks.items.length; i++) {

                console.log("Artist: " + JSON.stringify(spotifyData.tracks.items[i].artists[0].name) + "\nTrack: " + JSON.stringify(spotifyData.tracks.items[i].name) + "\nAlbum: " + JSON.stringify(spotifyData.tracks.items[i].album.name) + "\nURL: " + JSON.stringify(spotifyData.tracks.items[i].external_urls.spotify) + "\n-----------------");
              }
            }
          });
          break;
        case 'movie-this':
          var movie = response.userSearch
          var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
          axios.get(queryUrl).then(function (movieResponse) {
            // If the request with axios is successful
            // console.log(movieResponse.data);
            console.log("Movie title: " + movieResponse.data.Title);
            console.log("Year released: " + movieResponse.data.Year);
            console.log("IMDB Rating: " + movieResponse.data.Ratings[0]["Value"]);
            console.log("Rotten Tomatoes Rating: " + movieResponse.data.Ratings[1]["Value"]);
            console.log("Country of Production: " + movieResponse.data.Country);
            console.log("Language: " + movieResponse.data.Language);
            console.log("Plot: " + movieResponse.data.Plot);
            console.log("Actors: " + movieResponse.data.Actors);
          })
          break;
        case 'do-what-it-says':
          // some stuff happens
          // some stuff happens
          break;
      }

    }
    else {
      console.log("no response");
    }

  });