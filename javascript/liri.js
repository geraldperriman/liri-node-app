//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
var selection = process.argv[3];
//movie or song
var selection = "";
//attaches multiple word arguments
for (var i=3; i<selection.length; i++){
  if(i>3 && i<selection.length){
    x = x + "+" + selection[i];
  } else{
    x = x + selection[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(selection){
      spotifySong(selection);
    } else{
      spotifySong("Happy");
    }
  break;

  case "movie-this":
    if(selection){
      omdbData(selection)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name:'gerald_perriman'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@gerald_perriman: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to random.txt file
        fs.appendFile('random.txt', "@gerald_perriman: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFile('random.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        fs.appendFile('random.txt', songData.artists[0].name);
        fs.appendFile('random.txt', songData.name);
        fs.appendFile('random.txt', songData.preview_url);
        fs.appendFile('random.txt', songData.album.name);
        fs.appendFile('random.txt', "-----------------------");
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(selection){
  var omdbURL = 'http://www.omdbapi.com/?t='+selection+'&y=&plot=short&r=json&tomatoes=true';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

      //adds text to random.txt
      fs.appendFile('random.txt', "Title: " + body.Title);
      fs.appendFile('random.txt', "Release Year: " + body.Year);
      fs.appendFile('random.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('random.txt', "Country: " + body.Country);
      fs.appendFile('random.txt', "Language: " + body.Language);
      fs.appendFile('random.txt', "Plot: " + body.Plot);
      fs.appendFile('random.txt', "Actors: " + body.Actors);
      fs.appendFile('random.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
      fs.appendFile('random.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

    } else{
      console.log('Error occurred.')
    }
    if(selection === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('random.txt', "-----------------------");
      fs.appendFile('random.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('random.txt', "It's on Netflix!");
    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}