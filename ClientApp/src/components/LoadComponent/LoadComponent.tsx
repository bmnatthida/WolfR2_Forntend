import React, { useEffect } from "react";
import { useLocation } from "react-router";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import useLoading from "../../hooks/useLoading";

const LoadComponent = () => {
  const { isLoad, setLoad } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setLoad(false);
  }, [location]);

  if (!isLoad) {
    return <></>;
  }

  return (
    <div className="logo-loading cursor-loading">
      <img src={LogoLoading} alt="loading..." />
    </div>
  );
};

export default LoadComponent;
