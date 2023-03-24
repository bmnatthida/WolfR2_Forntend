import React, { useEffect } from "react";
import { useLocation } from "react-router";
import useLoading from "../../hooks/useLoading";

interface Props {
  responeConfig: any;
}
const LoadComponent = (props: Props) => {
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
      <img src={props.responeConfig?.pathLoading} alt="loading..." />
    </div>
  );
};

export default LoadComponent;
