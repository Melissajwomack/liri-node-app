//chalk npm
const chalk = require('chalk');
const log = console.log;

//dotenv npm
require('dotenv').config();

//request npm
var request = require('request');

//moment npm
var moment = require('moment');


//spotify keys
var keys = require('./keys.js');

var spotifyKey = keys.spotify;

//spotify npm:
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: spotifyKey.id,
    secret: spotifyKey.secret
});

//omdb keys
var omdbKey = "trilogy";

//Variables for user input
var action = process.argv[2];
var value = process.argv[3];
for (i = 4; i < process.argv.length; i++) {
    value += (" " + process.argv[i])
};

//Switch for different commands
switch (action) {
    case "concert-this":
        bandsintown();
        break;
    case "spotify-this-song":
        spotifyFunc();
        break;
    case "movie-this":
        omdbKey();
        break;
    case "do-what-it-says":
        doIt();
        break;
}

//Bandintown request:
function bandsintown() {

    //Convert user input to format for url
    var valueC = value.trim().replace(/ /g, "+");

    //Bandsintown Url
    var bandsintownUrl = "https://rest.bandsintown.com/artists/" + valueC + "/events?app_id=codingbootcamp";

    request(bandsintownUrl, function (error, response, body) {
        if (error) return log("Error occured: " + error);

        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            log(chalk.cyan("\nUpcoming shows for " + chalk.yellow.underline(value) + ":\n"));
            for (i = 0; i < 2; i++) {
                log(chalk.yellow("---------"));
                log(chalk.cyan("Loction: ") + data[i].venue.name);
                log(chalk.cyan("City: ") + data[i].venue.city);
                log(chalk.cyan("Region: ") + data[i].venue.region);
                log(chalk.cyan("Country: ") + data[i].venue.country);
                log(chalk.cyan("Date and Time: ") + moment(data[i].datetime).format("MM/DD/YYYY"));
                log(chalk.yellow("---------"));
            }
        }
    });
};

//Spotify request:
function spotifyFunc() {
    //If no song choice
    if (!value) {
        spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: 1 }, function (err, data) {
            if (err) {
                return log('Error occurred: ' + err);
            }
            log(chalk.yellow("---------"));
            log(chalk.cyan("Song: ") + (data.tracks.items[0].name));
            log(chalk.cyan("Artist: ") + (data.tracks.items[0].artists[0].name));
            log(chalk.cyan("Album: ") + (data.tracks.items[0].album.name));
            log(chalk.cyan("Song Preview: ") + (data.tracks.items[0].preview_url));
            log(chalk.yellow("---------"));

        });
    }
    else {
        spotify.search({ type: 'track', query: value }, function (err, data) {
            if (err) {
                return log('Error occurred: ' + err);
            }
            for (i = 0; i < 4; i++) {
                log(chalk.yellow("---------"));
                log(chalk.cyan("Song: ") + (data.tracks.items[i].name));
                log(chalk.cyan("Artist: ") + (data.tracks.items[i].artists[0].name));
                log(chalk.cyan("Album: ") + (data.tracks.items[i].album.name));
                log(chalk.cyan("Song Preview: ") + (data.tracks.items[i].preview_url));
                log(chalk.yellow("---------"));
            }
        });
    }

}



