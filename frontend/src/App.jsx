import React from "react";
import { useState, useEffect } from "react";
import Square from "./components/Square";
import Patterns from "./Patterns";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
socket.on("connect", function () {
  console.log("Connected");
});

const App = () => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("x");
  const [result, setResult] = useState({ winner: "none", state: "none" });
  const [gameFinished, setGameFinished] = useState(false);
  const [RoomId, setRoomId] = useState("");
  const [myTurn, setmyTurn] = useState(false);

  socket.on("your-turn", (myid) => {
    if (myid == socket.id) {
      setmyTurn(true);
    }
  });

  socket.on("recieve-board", (boardRecieved, myId) => {
    if (myId[0] == socket.id) {
      console.log(myId[0], socket.id);
      setBoard(boardRecieved);
      console.log(`The board recieved is ${boardRecieved}`);
      setmyTurn(true);
    }
  });

  const squareClick = (square) => {
    if (gameFinished) return;

    myTurn &&
      setBoard(
        board.map((val, index) => {
          if (index == square && val == "") return player;
          return val;
        })
      );
    myTurn && setPlayer(player === "x" ? "o" : "x");
    myTurn && socket.emit("move-made", board, RoomId);
    console.log(`This board is sent ${board}`);
    // setmyTurn(false);
  };

  const checkPattern = () => {
    Patterns.forEach((currentPattern) => {
      const firstPlayer = board[currentPattern[0]];
      if (firstPlayer == "") return;
      let foundWin = true;
      currentPattern.forEach((idx) => {
        if (board[idx] != firstPlayer) {
          foundWin = false;
        }
      });
      if (foundWin) {
        setResult({ winner: firstPlayer, state: "won" });
      }
    });
  };
  const checkDraw = () => {
    let filled = true;
    board.forEach((val) => {
      if (val == "") filled = false;
    });

    if (filled) {
      return true;
    }
    return false;
  };

  const restartGame = () => {
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setPlayer("x");
    setResult({ winner: "none", state: "none" });
    setGameFinished(false);
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
      {checkDraw() && (
        <h1 className=" text-3xl font-semibold mt-4 text-yellow-600">
          It was a Draw!
        </h1>
      )}

      {result.state != "none" && (
        <h1 className=" text-3xl font-semibold mt-4 text-green-600">
          {result.winner.toUpperCase()} won the game.
        </h1>
      )}

      {gameFinished && (
        <button
          onClick={() => {
            restartGame();
          }}
          className=" px-4 py-1 bg-slate-200 text-neutral-800 mt-4 rounded-md text-3xl font-semibold"
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default App;
