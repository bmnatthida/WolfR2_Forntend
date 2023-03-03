import { Progress, Spin } from "antd";
import React, { useEffect, useState } from "react";
import WolfLogo from "../../assets/wolfLogo.png";
import { SyncOutlined } from "@ant-design/icons";
import "./LoadPackageComponent.css";
import TweenOne from "rc-tween-one";
import Animate from "rc-animate";

interface Props {
  isLoadPackage: boolean;
  setIsLoadPackage: any;
}
const LoadPackageComponent = (props: Props) => {
  const [packagesInstall, setPackagesInstall] = useState<any>({
    name: "Department",
    state: "",
  });

  useEffect(() => {
    console.log(props.isLoadPackage);
  }, [props.isLoadPackage]);

  const duration = 1000;

  const onClickStart = () => {
    props.setIsLoadPackage(false);
  };
  return (
    <Animate component="" transitionName="slide">
      {props.isLoadPackage ? (
        <div className="package-loading">
          <div className="loading-container">
            <img src={WolfLogo} alt="wolf-logo" className="wolf-logo" />
            <div className="progressbar-instaling">
              <p className="text-show">Package installing (2/3)</p>
              {/* <Spin size="large" /> */}
              <SyncOutlined spin style={{ fontSize: 24, color: "white" }} />
              <button onClick={onClickStart}>Click</button>
            </div>
          </div>
        </div>
      ) : null}
    </Animate>
  );
};

export default LoadPackageComponent;
