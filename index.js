const http = require("http");
const qstr = require("querystring");
const req = require("request");
const port = 3000;

// Create the function that will respond to a request
const requestHandler = function(request, response) {

  // We only care about POST requests
  if (request.method == "POST") {

    // Read the POST body payload
    let body = "";
    request.on("data", (data) => {
      body += data;
      if (body.length > 1e6) request.connection.destroy();
    });

    // When we're done reading the payload, respond
    request.on("end", () => {
      let post = qstr.parse(body);
      console.log(post);
      let text = post.text.substring(post.trigger_word.length + 1);

      // Send the query to Yahoo! Weather to get a forecast
      var query_str = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + text + '")';
      var endpoint = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query_str) + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
      req(endpoint, (error, resp, body) => {
        var obj = JSON.parse(body);
        var forecasts = obj.query.results.channel.item.forecast;
        var desc = '*Forecast for: ' + text + '*\n';
        for (i in forecasts) {
          var forecast = forecasts[i];
          desc += '> ' + forecast.day + ' - ' + forecast.date + ': High ' + forecast.high + ', Low ' + forecast.low + '\n';
        }
        response.end(JSON.stringify({
          'text': desc
        }));
      });
    });
  }
};

const server = http.createServer(requestHandler);

server.listen(port, function(err) {
  if (err) {
    return console.log("Something broke!", err);
  }
  console.log(`Listening on ${port}`);
});
