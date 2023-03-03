import React, { useEffect, useState } from "react";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { sorterFunc } from "../../Helper/SortingFunction";

type Props = {
  onClick: (type: "dec" | "asc") => void;
  sortType?: "dec" | "asc" | null;
};

const SortingButton = ({ sortType, onClick }: Props) => {
  const callSortFunc = () => {
    if (sortType === "dec") {
      sortType = "dec";
    } else {
      sortType = "asc";
    }
    onClick(sortType);
  };

  return (
    <div className="sort-icon" onClick={callSortFunc}>
      {sortType === "dec" ? (
        <AiOutlineSortAscending width={"100%"} fontSize={20} />
      ) : (
        <AiOutlineSortDescending width={"100%"} fontSize={20} />
      )}
    </div>
  );
};

export default SortingButton;
