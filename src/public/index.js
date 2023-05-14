function init() {
  //variables
  let mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    pos_prev: false,
  };

  const colorPicker = document.getElementById("colorPicker");
  let currentColor = colorPicker.value;
  colorPicker.addEventListener("change", (e) => {
    currentColor = e.target.value;
  });
  const lineWidthRange = document.getElementById("lineWidthRange");
  let currentLineWidth = lineWidthRange.value;
  lineWidthRange.addEventListener("input", (e) => {
    currentLineWidth = e.target.value;
  });

  //canvas
  const canvas = document.getElementById("drawing");
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  //socket

  const socket = io();

  //--------------------------------------------------
  //EVENTS

  //
  canvas.addEventListener("mousedown", (e) => {
    mouse.click = true;
  });
  //
  canvas.addEventListener("mouseup", (e) => {
    mouse.click = false;
  });

  //
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    mouse.pos.x = offsetX / width;
    mouse.pos.y = offsetY / height;
    mouse.move = true;
  });

  //socket on line
  socket.on("draw_line", (data) => {
    const line = data.line;
    context.beginPath();
    context.lineWidth = data.currentLineWidth;
    context.strokeStyle = data.currentColor;
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });

  //delete
  const buttonDelete = document.getElementById("delete_history");

  buttonDelete.addEventListener("click", deleteHistory);

  function deleteHistory() {
    const deletehistory = [];
    socket.emit("delete", deletehistory);
  }
  socket.on("delete", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  //
  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit("draw_line", {
        line: [mouse.pos, mouse.pos_prev],
        currentColor,
        currentLineWidth,
      });
      mouse.move = false;
    }
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25);
  }

  mainLoop();
}
document.addEventListener("DOMContentLoaded", init);
