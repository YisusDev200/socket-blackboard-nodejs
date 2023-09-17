const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http"); //Socket recibe un servidor http

//start
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//socket
require("./socktes")(io);

//settings
app.set("port", process.env.PORT || 3000);

//middlewares

//static files
app.use(express.static(path.join(__dirname, "public")));

//start
server.listen(app.get("port"), () =>
  console.log("server on port", app.get("port"))
);
