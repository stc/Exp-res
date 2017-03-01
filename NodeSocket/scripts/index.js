// ------------------------------------------- SERVER ------------------------------------------

var http = require('http');
var server = http.createServer(handleRequest);
server.listen(8080);

var io = require('socket.io').listen(server);

function handleRequest(req, res) {
  var pathname = req.url;
  if (pathname == '/') {
    pathname = '/index.html';
  }

  var ext = path.extname(pathname);
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  var contentType = typeExt[ext] || 'text/plain';
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

// ------------------------------------- TWITTER & SENTIMENT ANALYSIS -----------------------------
var twitter = require('ntwitter');
var sentiment = require('sentiment');

const config = require('./config.json')
var tweeter = new twitter({
	consumer_key: config.twitter.consumer_key,
	consumer_secret: config.twitter.consumer_secret,
	access_token_key: config.twitter.token_key,
	access_token_secret: config.twitter.token_secret
}); 

var stream;
var tCount = 0;
var searchPhrase;

io.sockets.on('connection',
  function (socket) {
    console.log("We have a new client: " + socket.id + " looking for " + socket.handshake.query.phrase);
    searchPhrase = socket.handshake.query.phrase;
		tweeter.verifyCredentials(function(error, data){
			if(error) {
				console.log('Error connecting to Twitter: ' + error);
			}
			
			stream = tweeter.stream('statuses/filter',{
				'track':searchPhrase
			}, function(stream) {
				stream.on('data', function(data) {
					
				if (data.lang === 'en') {
  	    	sentiment(data.text, function (err, result) {
  	       	const datas = {
  						tText: data.text,
  						tDate: data.created_at,
  						tMood: result.score
						}
						tCount++;
						console.log('found ' + tCount + ' tweets with ' + searchPhrase);
  				  socket.emit('tweet', datas);
  	      });
  	    }
			});		
		});
	});

	socket.on('disconnect', function() {
  	console.log("Client has disconnected");
  });
});

