import { useState } from "react";
import Moment from "moment";
import React from "react";
import "./list.css";
interface Props {
  toggleDetail: Boolean;
  setToggle: any;
}
export const Lists: React.FC<Props> = (Prop) => {
  const [employeeList, setEmployeeList] = useState([]);
  Moment.locale("en");

  function currencyFormat(num: number) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const val = [
    {
      code: "0001",
      date: "05 July 2021",
      aaaaaa: "aaaaaaaaa",
      p: "2",
      h: 2,
      l: "nnnnnnn",
      i: "bbbbbbb",
      request_by: "ggggg",
      Waiting_for: "qqqqqq",
    },
  ];

  return (
    <div className="App">
      {val.map((n) => (
        <div>
          <br />
        </div>
      ))}
    </div>
  );
};
