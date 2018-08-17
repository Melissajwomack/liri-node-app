require("dotenv").config();

var keys = requre("keys.js");

var spotify = new Spotify(keys.spotify);

var omdbKey = "trilogy";

var bandsintownUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

var action = process.argv[2];

if (action ===  "concert-this") {

}

else if(action === "spotify-this-song") {

}

else if(action === "movie-this") {
    
}

else if(action === "do-what-it-says") {
    
}