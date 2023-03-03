import React from "react";
import { useHistory } from "react-router-dom";
import "../../components/ErrorPageComponent/ErrorPageComponent.css";
type Props = {};

const UnAurthorization = (props: Props) => {
  const history = useHistory();
  return (
    <div className="error-page-container">
      <div className="all-text-container">
        <div className="error-text-container">
          {/* <p className="text-404">404</p> */}
          <p className="error-text">Access denied!</p>
          <p className="not-found-text">
            You do not have permission to perform access this resource. Please
            check your profile with system admin again.
          </p>
        </div>
        <button
          className="go-back-button"
          onClick={() => history.push("/Default")}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default UnAurthorization;
