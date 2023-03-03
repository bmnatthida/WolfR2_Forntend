import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./RequestActionMemo.css";
import correct from "./../../assets/correct.png";
type Props = {
  PathLogo: any;
};

function RequestActionMemo(props: Props) {
  const history = useHistory();
  return (
    <div className="set-request-action-memo">
      <div className="layout-request-screen">
        <img src={props.PathLogo} width={400} alt="img" />
        <img src={correct} width={250} alt="img" />
        <button
          className="button-request-action-memo"
          type="button"
          onClick={() => history.push("/Default")}
        >
          go to worklist
        </button>
      </div>
    </div>
  );
}

export default RequestActionMemo;
