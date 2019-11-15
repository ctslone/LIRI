require("dotenv").config();
var axios = require("axios");
var inquirer = require("inquirer");
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
// prompting the user in the command line
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
    // if there is a response, log a s status message to let the user know it is working
    if (response) {
      console.log("\nSearching for " + response.userSearch + "..." + "\n---------------");
      var command = response.command.toString();

      // FUNCTIONS
      function concertThis(artist) {
        // var artist = response.userSearch
        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(function (bandsResponse) {
          // If the request returns no results, do this
          if (bandsResponse.data.length === 0) {
            return console.log('Error occurred: No events found. Please check back later!');
          }
          // writing the results to the txt file
          else {
            fs.appendFile("liri.txt", "\n\nSearching for " + response.userSearch + " concerts...", function (err) {
              if (err) throw err;
            });

            for (x = 0; x < bandsResponse.data.length; x++) {
              fs.appendFile("liri.txt", "\n\nVenue: " + bandsResponse.data[x].venue.name + "\nLocation: " + bandsResponse.data[x].venue.city + ", " + bandsResponse.data[x].venue.country + "\nDate: " + moment(bandsResponse.data[x].datetime).format('L, HH:mm') + "\n---------------", function (err) {
                if (err) throw err;
              });
              // logging the results to the console/user
              console.log("Venue: " + bandsResponse.data[x].venue.name + "\nLocation: " + bandsResponse.data[x].venue.city + ", " + bandsResponse.data[x].venue.country + "\nDate: " + moment(bandsResponse.data[x].datetime).format('L, HH:mm') + "\n---------------");
            }
          }
        })
          // log any errors if they are caught
          .catch(function (err) {
            console.log("There was an error: " + err);
          });
      }

      function spotifyThis(search) {
        // var search = response.userSearch;
        // console.log(search)
        spotify.search({ type: 'track', query: search }, function (err, spotifyData) {
          // if an error occurs, log it
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          // if the user doesnt provide an input, show this as default
          else if (spotifyData.tracks.items.length < 1) {
            console.log("Artist: Ace of Base" + "\nTrack: The Sign" + "\nAlbum: The Sign (US Album) [Remastered]" + "\nURL: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE" + "\n---------------")
          }
          else {
            // appending the results to the txt file
            fs.appendFile("liri.txt", "\n\nSearching for song: " + response.userSearch, function (err) {
              if (err) throw err;
            });
            for (i = 0; i < spotifyData.tracks.items.length; i++) {

              fs.appendFile("liri.txt", "\n\nArtist: " + JSON.stringify(spotifyData.tracks.items[i].artists[0].name) + "\nTrack: " + JSON.stringify(spotifyData.tracks.items[i].name) + "\nAlbum: " + JSON.stringify(spotifyData.tracks.items[i].album.name) + "\nURL: " + JSON.stringify(spotifyData.tracks.items[i].external_urls.spotify) + "\n---------------", function (err) {
                if (err) throw err;
              });
              // logging the reults to the console and user
              console.log("Artist: " + JSON.stringify(spotifyData.tracks.items[i].artists[0].name) + "\nTrack: " + JSON.stringify(spotifyData.tracks.items[i].name) + "\nAlbum: " + JSON.stringify(spotifyData.tracks.items[i].album.name) + "\nURL: " + JSON.stringify(spotifyData.tracks.items[i].external_urls.spotify) + "\n---------------");
            }
          }
        });
      }

      function movieThis(movie) {
        var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(function (movieResponse) {
          // If the request with axios is successful
          // console.log(movieResponse.data);
          // if no input, show Mr. Nobody
          if (movie.length === 0) {
            console.log("You must enter a movie! You got an error!");
            //  var nobody = "Mr. Nobody";
            function noResponse(nobody) {
              var nobodyUrl = "http://www.omdbapi.com/?t=" + nobody + "&y=&plot=short&apikey=trilogy";
              axios.get(nobodyUrl).then(function (nobody) {
                // console.log(nobody)
                console.log("\n\nMovie title: " + nobody.data.Title
                  + "\nYear released: " + nobody.data.Year
                  + "\nIMDB Rating: " + nobody.data.Ratings[0]["Value"]
                  + "\nRotten Tomatoes Rating: " + nobody.data.Ratings[1]["Value"]
                  + "\nCountry of Production: " + nobody.data.Country
                  + "\nLanguage: " + nobody.data.Language
                  + "\nPlot: " + nobody.data.Plot
                  + "\nActors: " + nobody.data.Actors)
              }
              )
            }
            noResponse("Mr. Nobody");
          };
          // appending actual search results to the txt file
          fs.appendFile("liri.txt", "\n\nSearching for the movie: " + response.userSearch + "\n\nMovie title: " + movieResponse.data.Title
            + "\nYear released: " + movieResponse.data.Year
            + "\nIMDB Rating: " + movieResponse.data.Ratings[0]["Value"]
            + "\nRotten Tomatoes Rating: " + movieResponse.data.Ratings[1]["Value"]
            + "\nCountry of Production: " + movieResponse.data.Country
            + "\nLanguage: " + movieResponse.data.Language
            + "\nPlot: " + movieResponse.data.Plot
            + "\nActors: " + movieResponse.data.Actors
            + "\n---------------", function (err) {
              if (err) throw err;
            });
          // logging the results to the console and user
          console.log("Movie title: " + movieResponse.data.Title
            + "\nYear released: " + movieResponse.data.Year
            + "\nIMDB Rating: " + movieResponse.data.Ratings[0]["Value"]
            + "\nRotten Tomatoes Rating: " + movieResponse.data.Ratings[1]["Value"]
            + "\nCountry of Production: " + movieResponse.data.Country
            + "\nLanguage: " + movieResponse.data.Language
            + "\nPlot: " + movieResponse.data.Plot
            + "\nActors: " + movieResponse.data.Actors
            + "\n---------------");
        })
          // if an error, log it
          .catch(function (err) {
            console.log("There was an error: " + err);
          });
      }
      // passing the user commands into the switch function and then running the appropriate function with the users input
      switch (command) {
        case 'concert-this':
          concertThis(response.userSearch);

          break;
        case 'spotify-this-song':
          spotifyThis(response.userSearch)

          break;
        case 'movie-this':
          movieThis(response.userSearch)

          break;
        case 'do-what-it-says':
          // reading the txt file for any commands and input values
          fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
              return console.log(error);
            };
            // console.log(data);
            // assigning the txt data to a variable
            var dataArr = data.split(",");
            // console.log(dataArr);
            // separating the command and value from the txt file and placing them in their respective variable (array)
            var textCommand = []
            var textInput = [];
            textCommand.push(dataArr[0]);
            textInput.push(dataArr[1]);
            // checking to see if each varible contains correct data
            // console.log(textCommand.toString());
            // console.log(textInput.toString());

            // passing the txt data through a switch and running the appropriate function (just as above) with the txt file command and value.
            // appending the command to the txt file before running the command
            switch (textCommand.toString()) {
              case 'concert-this':
                fs.appendFile("liri.txt", "\n\nSearching for concerts for: " + textInput, function (err) {
                  if (err) throw err;
                });
                concertThis(textInput.toString().trim());
                break;
              case 'spotify-this-song':
                fs.appendFile("liri.txt", "\n\nSearching for song: " + textInput, function (err) {
                  if (err) throw err;
                });
                spotifyThis(textInput.toString().trim())
                break;
              case 'movie-this':
                fs.appendFile("liri.txt", "\n\nSearching for movie: " + textInput, function (err) {
                  if (err) throw err;
                });
                movieThis(textInput.toString().trim())
                break;
            }
          })
          break;
      }
    }
    // if no response from user, log this
    else {
      console.log("no response");
    }
  });