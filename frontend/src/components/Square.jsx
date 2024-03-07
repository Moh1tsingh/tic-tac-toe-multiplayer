import React from "react";
import { RxCross2 } from "react-icons/rx";
import { GoCircle } from "react-icons/go";

const Square = ({ squareClick, val }) => {
  return (
    <div
      onClick={squareClick}
      className=" h-24 w-24 bg-neutral-700 rounded-md flex justify-center items-center text-[50px] cursor-pointer active:bg-neutral-800	transition-all"
    >
      {val === "x" ? (
        <RxCross2 className="transition-all" />
      ) : val === "o" ? (
        <GoCircle className="transition-all" />
      ) : (
        ""
      )}
    </div>
  );
};

export default Square;
