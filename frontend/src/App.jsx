import React from "react";
import { useState, useEffect } from "react";
import Square from "./components/Square";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
socket.on("connect", function () {
  console.log("Connected");
});

const App = () => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [RoomId, setRoomId] = useState("");
  const [myTurn, setmyTurn] = useState(false);
  const [isDraw, setisDraw] = useState(false);
  const [Winner, setWinner] = useState(null);
  const [players, setplayers] = useState([]);

  socket.on("your-turn", (myid, player) => {
    setplayers(myid);
    if (myid[0] == socket.id) {
      setmyTurn(true);
      setPlayer(player);
    }
  });

  socket.on("recieve-board", (boardRecieved, myId, player) => {
    if (myId[0] == socket.id) {
      console.log(myId[0] + " - is me");
      setBoard(boardRecieved);
      console.log(`The board recieved is ${boardRecieved}`);
      setPlayer(player);
      setmyTurn(true);
    }
  });

  socket.on("draw", function () {
    setisDraw(true);
  });

  socket.on("win", (winner) => {
    setGameFinished(true);
    setWinner(winner);
  });

  socket.on("restart-called", (p) => {
    console.log("Restart call recieved");
    console.log(p);
    if (p[0] == socket.id || p[1] == socket.id) {
      setGameFinished(false);
      setBoard(["", "", "", "", "", "", "", "", ""]);
      setWinner(null);
      setisDraw(false);
    }
  });

  const restartGame = () => {
    console.log("restart call to server");
    console.log("Restart sent to player - " + players);
    socket.emit("restart", players);
    setGameFinished(false);
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setWinner(null);
    setisDraw(false);
  };

  const squareClick = (square) => {
    if (gameFinished) return;
    let tboard = [];
    // console.log(player);
    myTurn &&
      (tboard = board.map((val, index) => {
        if (index == square && val == "") {
          return player;
        }

        return val;
      }));
    // console.log(tboard);
    myTurn && socket.emit("move-made", tboard, RoomId);
    console.log(`This board is sent ${tboard}`);
    setmyTurn(false);
    setBoard(tboard);
  };

  // useEffect(() => {
  //   checkPattern();
  // }, [board]);

  // useEffect(() => {
  //   if (myTurn) {
  //     socket.emit("move-made", board, RoomId);
  //     setmyTurn(false);
  //     console.log(board);
  //   }
  // }, [board]);

  // useEffect(() => {
  //   if (result.state == "none") {
  //     return;
  //   }
  //   console.log(`Winner is ${result.winner}`);
  //   setGameFinished(true);
  // }, [result]);

  const sendRoomId = () => {
    socket.emit("join-room", RoomId);
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-neutral-900 text-slate-100 flex-col">
      <div>
        <h1 className=" font-semibold text-6xl pb-8 -mt-6">Tic Tac Toe</h1>
        <input
          type="text"
          placeholder="Enter room id"
          className=" mb-6 mx-2 rounded-lg py-2 text-zinc-800"
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          value={RoomId}
        />
        <button
          className=" bg-orange-700 py-2 px-1 rounded-lg"
          onClick={() => {
            sendRoomId();
          }}
        >
          Submit
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Square
          squareClick={() => {
            squareClick(0);
          }}
          val={board[0]}
        />
        <Square
          squareClick={() => {
            squareClick(1);
          }}
          val={board[1]}
        />
        <Square
          squareClick={() => {
            squareClick(2);
          }}
          val={board[2]}
        />
        <Square
          squareClick={() => {
            squareClick(3);
          }}
          val={board[3]}
        />
        <Square
          squareClick={() => {
            squareClick(4);
          }}
          val={board[4]}
        />
        <Square
          squareClick={() => {
            squareClick(5);
          }}
          val={board[5]}
        />
        <Square
          squareClick={() => {
            squareClick(6);
          }}
          val={board[6]}
        />
        <Square
          squareClick={() => {
            squareClick(7);
          }}
          val={board[7]}
        />
        <Square
          squareClick={() => {
            squareClick(8);
          }}
          val={board[8]}
        />
      </div>
      {isDraw && (
        <h1 className=" text-3xl font-semibold mt-4 text-yellow-600">
          It was a Draw!
        </h1>
      )}
      {myTurn && !gameFinished && (
        <h1 className=" text-3xl font-semibold mt-4 text-yellow-600">
          Your Turn!
        </h1>
      )}
      {gameFinished && (
        <h1 className=" text-3xl font-semibold mt-4 text-green-600">
          {Winner.toUpperCase()} won the game.
        </h1>
      )}

      {((gameFinished ||
        isDraw) && (
          <button
            onClick={() => {
              restartGame();
            }}
            className=" px-4 py-1 bg-slate-200 text-neutral-800 mt-4 rounded-md text-3xl font-semibold"
          >
            Restart
          </button>
        ))}
    </div>
  );
};

export default App;
