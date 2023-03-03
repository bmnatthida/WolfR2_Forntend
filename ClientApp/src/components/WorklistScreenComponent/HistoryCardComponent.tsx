import React from "react";
import "./WorklistScreenComponent.css";
import moment from "moment";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { IoDesktopOutline } from "react-icons/io5";
interface Props {
  data: any;
}

export const HistoryCardComponent = (props: Props) => {
  const formatDate = () => {
    let momentObj = moment(props.data.action_date, "DD/MM/yyyy HH:mm:ss");
    return moment(momentObj).format("DD MMM yyyy , h:mm");
  };
  const formatPlatform = () => {
    let _platform = props.data.platform;
    if (_platform === "web") {
      return (
        <p className="text-send-from">
          <IoDesktopOutline /> เว็ปไซต์ WOLF Approve | Web
        </p>
      );
    }
    if (_platform === "ios") {
      return (
        <p className="text-send-from">
          <AiFillApple /> แอพพลิเคชั่น WOLF Approve | IOS
        </p>
      );
    }
    if (_platform === "android") {
      return (
        <p className="text-send-from">
          <AiFillAndroid /> แอพพลิเคชั่น WOLF Approve | Android
        </p>
      );
    }
  };
  const formatStatus = () => {
    if (props.data.status === "Draft") {
      return (
        <div className="status-badge">
          <span style={{ backgroundColor: "#B4B4B4" }}>
            {props.data.status}
          </span>
        </div>
      );
    }
    if (props.data.status === "Recall") {
      return (
        <div className="status-badge">
          <span style={{ backgroundColor: "#FCA71B" }}>
            {props.data.status}
          </span>
        </div>
      );
    }
    if (props.data.status === "Wait for Approve") {
      return (
        <div className="status-badge">
          <span style={{ backgroundColor: "#282f6a" }}>
            {props.data.status}
          </span>
        </div>
      );
    }
    if (props.data.status === "Rework") {
      return (
        <div className="status-badge">
          <span style={{ backgroundColor: "#FCA71B" }}>
            {props.data.status}
          </span>
        </div>
      );
    }
    if (props.data.status === "Wait for Comment") {
      return (
        <div className="status-badge">
          <span style={{ backgroundColor: "#06BEE1" }}>
            {props.data.status}
          </span>
        </div>
      );
    }
  };
  return (
    <div className="history-card-container">
      <div className="history-detail-container">
        <div className="left-container" style={{ width: "100%" }}>
          <p
            className="text-name"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {props.data.actor.NameEn} {formatStatus()}
          </p>
          <p className="text-role">{props.data.actor.PositionNameEn}</p>
          <p className="text-date">{formatDate()}</p>
          <p
            className="text-detail"
            style={{ maxWidth: "40vw", wordWrap: "break-word" }}
          >
            {props.data.comment}
          </p>
        </div>
      </div>
      <div className="send-from-container">{formatPlatform()}</div>
    </div>
  );
};
