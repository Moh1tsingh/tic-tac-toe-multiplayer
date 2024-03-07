const io = require("socket.io")(3000, {
  cors: ["https://localhost:5173"],
});

const players = [];

io.on("connection", (socket) => {
  console.log(`Connection established with ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    players.push(socket.id);
    console.log(
      `request to join room recieved from ${socket.id} with room id - ${roomId}`
    );
    console.log(`The players in the room are ${players}`);
    if (players.length == 2) {
      socket.to(roomId).emit("your-turn", players[0]);
      console.log(players[0] + " your turn!");
    }
  });

  socket.on("move-made", (board, roomId) => {
    console.log(board);
    console.log(`${socket.id} made the move`);
    if (roomId == "") {
      console.log("No room is available"); //can so socket.broadcast.emit() to give this message to users
    } else {
      const curr_player = players.filter((player) => {
        return player != socket.id;
      });
      socket.to(roomId).emit("recieve-board", board, curr_player);
      console.log(`Turn of ${curr_player}`);
    }
  });
});
