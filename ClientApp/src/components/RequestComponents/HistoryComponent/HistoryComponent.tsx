import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Divider, Row, Col } from "antd";
import "./HistoryComponent.css";
import moment from "moment";
import { AiFillAndroid, AiFillApple } from "react-icons/ai";
import { FaLine } from "react-icons/fa";
import { IoDesktopOutline } from "react-icons/io5";
import { useUserContext } from "../../../Context/UserContext";
import { Last } from "react-bootstrap/esm/PageItem";
import { Dialog } from "primereact/dialog";
interface Props {
  listHistoryDetails?: any;
  t: any;
}
export const HistoryComponent = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [dataDialog, setDataDialog] = useState<any>();
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [userData, setUserData] = useUserContext();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const responeWorkList = props.listHistoryDetails;
    const sortDate = responeWorkList?.sort((a: any, b: any) => {
      const aa = moment(a.action_date, "DD/MM/YYYY HH:mm:ss");
      const bb = moment(b.action_date, "DD/MM/YYYY HH:mm:ss");
      return moment(aa).diff(bb);
    });
    setData(sortDate);
  };
  const formatDateTime = (value: string) => {
    if (value == null) {
      return "";
    } else {
      let momentObj = moment(value, "DD/MM/YYYY HH:mm:ss");
      return moment(momentObj).format("DD MMM yyyy , h:mm:ss");
    }
  };
  const convertDate = (data: any) => {
    return formatDateTime(data);
  };
  const formatAction = (value: string) => {
    if (value == null) {
      return "";
    } else {
      if (value === "submit") {
        return props.t("Submitted");
      } else if (value === "recall") {
        return props.t("Recalled");
      } else if (value === "rework") {
        return props.t("Reworked");
      } else if (value === "reject") {
        return props.t("Rejected");
      } else if (value === "approve") {
        return props.t("Approved");
      } else if (value === "draft") {
        return props.t("Draft");
      } else if (value === "return") {
        return props.t("Return");
      } else if (value === "assign") {
        return props.t("Assign");
      } else if (value === "request comment") {
        return props.t("Request Comment");
      } else if (value === "reply") {
        return props.t("Reply");
      } else {
        return value;
      }
    }
  };
  const convertAction = (data: any) => {
    return formatAction(data);
  };
  const formatPlatform = (value: string) => {
    if (value === "web") {
      return (
        <p className="text-send-from">
          <IoDesktopOutline /> เว็ปไซต์ WOLF Approve | Web
        </p>
      );
    }
    if (value === "ios") {
      return (
        <p className="text-send-from">
          <AiFillApple /> แอพพลิเคชั่น WOLF Approve | IOS
        </p>
      );
    }
    if (value === "android") {
      return (
        <p className="text-send-from">
          <AiFillAndroid /> แอพพลิเคชั่น WOLF Approve | Andriod
        </p>
      );
    }
    if (value === "line") {
      return (
        <p className="text-send-from">
          <FaLine /> แอพพลิเคชั่น WOLF Approve | Line
        </p>
      );
    }
  };
  const convertPlatform = (data: any) => {
    return formatPlatform(data);
  };
  const bgcolor = (data: any) => {
    return formatPlatform(data);
  };

  function convertHtml(_comment: any, _textAbstract?: boolean) {
    let response: string = "";
    if (_textAbstract) {
      response = textAbstract(_comment, 200);
    } else {
      response = _comment;
    }
    return <div dangerouslySetInnerHTML={{ __html: response }} />;
  }
  function textAbstract(text: any, length: any) {
    if (text == null) {
      return "";
    }
    if (text.length <= length) {
      return text;
    }
    text = text.substring(0, length);
    var last = text.lastIndexOf(" ");
    console.log(text, "last");
    text = text.substring(0, last);
    return text + "<span>...</span>";
  }
  function dialogDetailText() {
    return (
      <Dialog
        visible={visibleDialog}
        style={{ width: "50vw" }}
        onHide={() => setVisibleDialog(false)}
        dismissableMask
        draggable={false}
      >
        <p>
          <div className="HistoryCard">
            <div className="HistoryDetail">
              <div className="content-left-side" style={{ width: "100%" }}>
                <p
                  className="content-text-name"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {props.t("Name")} :{" "}
                  {userData.Lang === "EN"
                    ? dataDialog.actor_name_en
                    : dataDialog.actor_name_th}
                  <div className="content-right-side">
                    {dataDialog.action == "draft" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#b4b4b4" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "approve" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#282f6a" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "recall" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#f8a51c" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "rework" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#f8a51c" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "request comment" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#282f6a" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "submit" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#28A745" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "cancel" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#dc3545" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "assign" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#282f6a" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "reject" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#dc3545" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "reply" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#f8a51c" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "return" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#f8a51c" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                    {dataDialog.action == "discard" && (
                      <div className="action-badge">
                        <span style={{ backgroundColor: "#e93445" }}>
                          {convertAction(dataDialog.action)}
                        </span>
                      </div>
                    )}
                  </div>
                </p>
                <p className="content-text-role">
                  Position :{" "}
                  {userData.Lang === "EN"
                    ? dataDialog.actor_position_name_en
                    : dataDialog.actor_position_name_th}
                </p>
                <p className="content-text-status">
                  {props.t("From Status")} : {dataDialog.status}
                </p>
                <p className="content-text-date">
                  {props.t("Action Date")} :{" "}
                  {convertDate(dataDialog.action_date)}
                </p>
                <p
                  className="content-text-detail"
                  style={{ overflowWrap: "break-word" }}
                >
                  {convertHtml(dataDialog.comment)}
                </p>
              </div>
            </div>
            <div className="send-from">
              {convertPlatform(dataDialog.platform)}
            </div>
          </div>
        </p>
      </Dialog>
    );
  }
  return (
    <div>
      {dataDialog && dialogDetailText()}
      <p className="Col-text-header">{props.t("history")}</p>

      <div className="Histwo overflow-auto">
        {data.length > 0 &&
          data.map((data, idx) => (
            <div className="HistoryCard">
              <div className="HistoryDetail">
                <div className="content-left-side" style={{ width: "100%" }}>
                  <p
                    className="content-text-name"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {props.t("Name")} :{" "}
                    {userData.Lang === "EN"
                      ? data.actor_name_en
                      : data.actor_name_th}
                    <div className="content-right-side">
                      {data.action == "draft" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#b4b4b4" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "approve" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#282f6a" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "recall" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#f8a51c" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "rework" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#f8a51c" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "request comment" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#282f6a" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "submit" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#28A745" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "cancel" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#dc3545" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "assign" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#282f6a" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "reject" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#dc3545" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "reply" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#f8a51c" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "return" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#f8a51c" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                      {data.action == "discard" && (
                        <div className="action-badge">
                          <span style={{ backgroundColor: "#e93445" }}>
                            {convertAction(data.action)}
                          </span>
                        </div>
                      )}
                    </div>
                  </p>
                  <p className="content-text-role">
                    {props.t("Position")} :{" "}
                    {userData.Lang === "EN"
                      ? data.actor_position_name_en
                      : data.actor_position_name_th}
                  </p>
                  <p className="content-text-status">
                    {props.t("From Status")} : {data.status}
                  </p>
                  <p className="content-text-date">
                    {props.t("Action Date")}: {convertDate(data.action_date)}
                  </p>
                  <p
                    className="content-text-detail"
                    style={{ overflowWrap: "break-word" }}
                  >
                    {convertHtml(data.comment, true)}
                  </p>
                  {data?.comment && data?.comment?.length >= 200 && (
                    <p className="text-layout-detail">
                      <p
                        className="text-pointer"
                        onClick={() => {
                          setVisibleDialog(true);
                          console.log(idx, "idx");
                          setDataDialog(data);
                        }}
                      >
                        {props.t("More")}
                      </p>
                    </p>
                  )}
                </div>
              </div>
              <div className="send-from">{convertPlatform(data.platform)}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
