const http = require("http");
const qstr = require('querystring');
const port = 3000;

const requestHandler = (request, response) => {
  if (request.method == "POST") {
    let body = "";
    request.on("data", (data) => {
      body += data;
      if (body.length > 1e6) request.connection.destroy();
    });
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

server.listen(port, err => {
  if (err) {
    return console.log("Something broke!", err);
  }
  console.log(`Listening on ${port}`);
});
