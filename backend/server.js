import Patterns from "./Patterns.js";
import { Server } from "socket.io";

const io = new Server(3000, {
  cors: ["https://localhost:5173"],
});

const players = [];
let player = "x";
let boardS = [];
let winner;
let roomIdLocal;

const checkDraw = () => {
  let filled = true;
  boardS.forEach((val) => {
    if (val == "") filled = false;
  });

  if (filled) {
    return true;
  }
  return false;
};

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
      socket.to(roomId).emit("your-turn", players, player);
      console.log(players[0] + " your turn!");
      player = "o";
    }
  });

  socket.on("move-made", (board, roomId) => {
    roomIdLocal = roomId;
    const checkPattern = () => {
      Patterns.forEach((currentPattern) => {
        const firstPlayer = boardS[currentPattern[0]];
        if (firstPlayer == "") return;
        let foundWin = true;
        currentPattern.forEach((idx) => {
          if (boardS[idx] != firstPlayer) {
            foundWin = false;
          }
        });
        if (foundWin) {
          winner = firstPlayer;
          io.sockets.in(roomId).emit("win", winner);
        }
      });
    };

    console.log(`${socket.id} made the move`);
    boardS = board;
    console.log(boardS);
    if (roomId == "") {
      console.log("No room is available"); //can so socket.broadcast.emit() to give this message to users
    } else {
      const curr_player = players.filter((player) => {
        return player != socket.id;
      });
      if (checkDraw()) {
        socket.to(roomId).emit("draw");
      }
      checkPattern();
      socket.to(roomId).emit("recieve-board", board, curr_player, player);
      player = player == "x" ? "o" : "x";
      console.log(`Turn of ${curr_player}`);
    }
  });
  socket.on("restart", () => {
    socket.to(roomIdLocal).emit("restart-called", players);
    console.log("Restart called");
    console.log(players);

    socket.to(roomIdLocal).emit("your-turn", players, "x");
    console.log(players[0] + " your turn!");
    player = "o";
  });
});
