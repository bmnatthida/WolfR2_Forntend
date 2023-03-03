import React from "react";
import "./ErrorPageComponent.css";
import blackguardPage from "../../assets/blackguardPage.jpg";
import { useHistory } from "react-router-dom";
interface Props {}

export const ErrorPageComponent = (props: Props) => {
  const history = useHistory();
  return (
    <div className="error-page-container">
      <div className="all-text-container">
        <div className="error-text-container">
          <p className="text-404">404</p>
          <p className="error-text">ERROR</p>
          <p className="not-found-text">PAGE NOT FOUND</p>
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
