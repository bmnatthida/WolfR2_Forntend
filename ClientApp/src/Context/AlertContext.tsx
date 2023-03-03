import { createContext, ReactNode, useEffect, useState } from "react";
import React from "react";
import { useLocation } from "react-router";
import { notification } from "antd";
import "./AlertContext.css";
import { RiCloseCircleFill } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";

import { IconType } from "react-icons/lib";
interface AlertProviderProps {
  children: ReactNode;
}
declare const AlertType: ["success", "info", "warning", "error"];
interface IToggleAlertParams {
  type: typeof AlertType[number];
  message: string;
  description: string;
  duration?: number;
}
interface IAlertContextType {
  toggleAlert: (params: IToggleAlertParams) => void;
}
const AlertContext = createContext<IAlertContextType | null>(null);
const alertColors = {
  error: "#b34045",
  warning: "#fecf6d",
  info: "#4091d7",
  success: "#2d884d",
};
const AlertContextProvider: React.FC<AlertProviderProps> = (props) => {
  const [api, contextHolder] = notification.useNotification();
  const handleToggleAlert = (params: IToggleAlertParams) => {
    let icon: JSX.Element = <BsFillInfoCircleFill />;
    const iconSize = 28;
    if (params.type === "error") {
      icon = <RiCloseCircleFill color={alertColors.error} size={iconSize} />;
    } else if (params.type === "info") {
      icon = <BsFillInfoCircleFill color={alertColors.info} size={iconSize} />;
    } else if (params.type === "success") {
      icon = <FaCheckCircle color={alertColors.success} size={iconSize} />;
    } else if (params.type === "warning") {
      icon = <TiWarning color={alertColors.warning} size={iconSize} />;
    }
    api[params.type]({
      className: "alert-custom",
      message: params.message,
      description: params.description,
      placement: "topRight",
      duration: params.duration && params.duration,
      style: {
        borderRadius: 8,
        zIndex: 10000,
      },
      icon,
    });
  };
  return (
    <AlertContext.Provider value={{ toggleAlert: handleToggleAlert }}>
      {contextHolder}
      {props.children}
    </AlertContext.Provider>
  );
};

export { AlertContextProvider, AlertContext };
