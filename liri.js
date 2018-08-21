//**** Variables ****//

//fs
var fs = require("fs");

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

//Variables for user input
var action = process.argv[2];
var value = process.argv[3];
for (i = 4; i < process.argv.length; i++) {
    value += (" " + process.argv[i])
};

//**** Switch for different commands ****//
switch (action) {
    case "concert-this":
        bandsintown();
        break;
    case "spotify-this-song":
        spotifyFunc();
        break;
    case "movie-this":
        omdbFunc();
        break;
    case "do-what-it-says":
        doIt();
        break;
};


//**** Functions ****//

//Bandintown request:
function bandsintown() {

    //Convert user input to format for url
    var valueC = value.trim().replace(/ /g, "+");

    var bandsintownUrl = "https://rest.bandsintown.com/artists/" + valueC + "/events?app_id=codingbootcamp";
    request(bandsintownUrl, function (err, response, body) {
        if (err) {
            return log("Error occured: " + err);
        };
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            log(chalk.cyan("Upcoming shows for " + chalk.yellow.underline(value) + ":"));
            for (i = 0; i < 2; i++) {
                log(chalk.yellow("---------"));
                log(chalk.cyan("Loction: ") + data[i].venue.name);
                log(chalk.cyan("City: ") + data[i].venue.city);
                log(chalk.cyan("Region: ") + data[i].venue.region);
                log(chalk.cyan("Country: ") + data[i].venue.country);
                log(chalk.cyan("Date and Time: ") + moment(data[i].datetime).format("MM/DD/YYYY"));
                log(chalk.yellow("---------"));
            };

            //Log data in log.txt
            var logData =
                "----------------" + "\n" +
                "Command: " + action + "\n" +
                "Search: " + value + "\n" +
                "Loction: " + data[i].venue.name + "\n" +
                "City: " + data[i].venue.city + "\n" +
                "Region: " + data[i].venue.region + "\n" +
                "Country: " + data[i].venue.country + "\n" +
                "Date and Time: " + moment(data[i].datetime).format("MM/DD/YYYY") + "\n" +
                "----------------" + "\n"
            logIt(logData);
        };
    });
};

//Spotify request:
function spotifyFunc() {
    //If no song choice
    if (!value) { value = 'The Sign Ace of Base' };

    spotify.search({ type: 'track', query: value, limit: 3 }, function (err, data) {
        if (err) {
            return log('Error occurred: ' + err);
        };
        for (i = 0; i < data.tracks.items.length; i++) {
            log(chalk.yellow("---------"));
            log(chalk.cyan("Song: ") + (data.tracks.items[i].name));
            log(chalk.cyan("Artist: ") + (data.tracks.items[i].artists[0].name));
            log(chalk.cyan("Album: ") + (data.tracks.items[i].album.name));
            log(chalk.cyan("Song Preview: ") + (data.tracks.items[i].preview_url));
            log(chalk.yellow("---------"));
        };

        //Log data in log.txt
        for (i = 0; i < data.tracks.items.length; i++) {
            var logData =
                "----------------" + "\n" +
                "Command: " + action + "\n" +
                "Search: " + value + "\n" +
                "Song: " + data.tracks.items[i].name + "\n" +
                "Artist: " + data.tracks.items[i].artists[0].name + "\n" +
                "Album: " + data.tracks.items[i].album.name + "\n" +
                "Song Preview: " + data.tracks.items[i].preview_url + "\n" +
                "----------------" + "\n"
            logIt(logData);
        };
    });
};

//omdb Request
function omdbFunc() {
    //If no movie choice
    if (!value) { value = 'Mr. Nobody' }

    //Convert user input to format for url
    var valueC = value.trim().replace(/ /g, "+");

    var omdbUrl = "http://www.omdbapi.com/?t=" + valueC + "&type=movie&y=&plot=short&r=json&apikey=trilogy";
    request(omdbUrl, function (err, response, body) {
        if (err) {
            return log("Error occured: " + err);
        };
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            log(chalk.yellow("---------"));
            log(chalk.cyan("Movie Title: ") + data.Title);
            log(chalk.cyan("Release Year: ") + data.Released);
            log(chalk.cyan("IMDB Rating: ") + data.imdbRating);
            for (i = 0; i < data.Ratings.length; i++) {
                if (data.Ratings[i].Source === 'Rotten Tomatoes') {
                    var rottenRating = data.Ratings[i].Value;
                    log(chalk.cyan("Rotten Tomatoes Rating: ") + data.Ratings[i].Value);
                };
            };
            log(chalk.cyan("Country: ") + data.Country);
            log(chalk.cyan("Language: ") + data.Language);
            log(chalk.cyan("Plot: ") + data.Plot);
            log(chalk.cyan("Actors: ") + data.Actors);
            log(chalk.yellow("---------"));

            //Log data in log.txt
            var logData =
                "----------------" + "\n" +
                "Command: " + action + "\n" +
                "Search: " + value + "\n" +
                "Movie Title: " + data.Title + "\n" +
                "Release Year: " + data.Release + "\n" +
                "IMDB Rating: " + data.imdbRating + "\n" +
                "Rotten Tomatoes Rating: " + rottenRating + "\n" +
                "Country: " + data.Country + "\n" +
                "Language: " + data.Language + "\n" +
                "Plot: " + data.Plot + "\n" +
                "Actors: " + data.Actors + "\n" +
                "----------------" + "\n"
            logIt(logData);
        };
    });
};

function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return log("Error occured: " + err);
        }
        var dataArr = data.split(",");
        action = dataArr[0];
        value = dataArr[1];
        switch (action) {
            case "concert-this":
                bandsintown();
                break;
            case "spotify-this-song":
                spotifyFunc();
                break;
            case "movie-this":
                omdbFunc();
                break;
            case "do-what-it-says":
                doIt();
                break;
        };
    });
};

function logIt(appendedInfo) {
    fs.appendFile("log.txt", appendedInfo, function (err) {
        if (err) {
            return log("Error occured: " + err);
        };
    });
};


