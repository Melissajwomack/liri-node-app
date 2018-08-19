//chalk npm
const chalk = require('chalk');
const log = console.log;

//dotenv npm
require("dotenv").config();

//request npm
var request = require("request");

//moment npm
var moment = require('moment');

//spotify keys
var keys = require("./keys.js");
var spotifyKey = keys.spotify;

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
        spotify();
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
    var band = value.trim().replace(/ /g, "+");

    //Bandsintown Url
    var bandsintownUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";

    request(bandsintownUrl, function (error, response, body) {
        if (error) return log(error);

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




