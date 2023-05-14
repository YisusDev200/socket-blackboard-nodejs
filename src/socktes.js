module.exports = (io) => {
  var line_history = [];

  io.on("connection", (socket) => {
    console.log("new user connected");

    socket.on("update_color", (data) => {
      const lineColor = data;
      io.emit("color_updated", lineColor);
    });

    //history
    for (let i in line_history) {
      socket.emit("draw_line", { line: line_history[i] });
    }

    socket.on("draw_line", (data) => {
      line_history.push(data.line);
      console.log(line_history);
      io.emit("draw_line", data);
    });
    socket.on("delete", (deletehistory) => {
      line_history = deletehistory;
      io.emit("delete");
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
