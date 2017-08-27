const http = require("http");
const qstr = require('querystring');
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
      response.end(
        JSON.stringify({
          text: "You want to know about: " + JSON.stringify(text)
        })
      );
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
