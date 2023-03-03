import React from "react";
import "./WorklistScreenComponent.css";
import moment from "moment";
import {
  BsFileEarmarkPdfFill,
  BsFileEarmarkExcelFill,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";
import { FaFilePowerpoint, FaFileWord } from "react-icons/fa";
interface Props {
  data: any;
}

export const AttachmentCardComponent = (props: Props) => {
  const formatDate = () => {
    let momentObj = moment(props.data.attach_date, "DD/MM/yyyy HH:mm:ss");

    return moment(momentObj).format("DD MMM yyyy , h:mm");
  };
  const _userData = JSON.parse(window.localStorage.getItem("userData") || "");

  const _sharepointSiteURL = _userData.SharepointSiteURL;

  const showFile = () => {
    let component;
    const attachPath = props.data.attach_path;
    var pathArray = attachPath.split("/");
    let comploteLink = "";
    const _link = attachPath
      ? attachPath.charAt(0) !== "/" && !_sharepointSiteURL
        ? "/" + attachPath
        : attachPath
      : "";
    const protocol = window.location.protocol;
    console.log({ location: window.location, eieie: props.data });
    if (_sharepointSiteURL) {
      comploteLink = _link;
      // window.open(`${_link}`, "_blank", "noreferrer");
      console.log("666666666666666666666666666666660", _link);
    } else if (_userData.TinyURL) {
      if (
        _link.includes("www") ||
        _link.includes(".com") ||
        _link.includes(".tv") ||
        _link.includes(".net") ||
        _link.includes("https") ||
        _link.includes("http") ||
        _link.includes(".com") ||
        _link.includes(".co.th")
      ) {
        console.log("666666666666666666666666666666661");

        if (_link.includes("https")) {
          comploteLink = `https://${_link.replaceAll("https://", "")}`;
          // window.open(
          //   `https://${_link.replaceAll("https://", "")}`,
          //   "_blank",
          //   "noreferrer"
          // );
        } else if (_link.includes("http")) {
          comploteLink = `http://${_link.replaceAll("http://", "")}`;
          // window.open(
          //   `http://${_link.replaceAll("http://", "")}`,
          //   "_blank",
          //   "noreferrer"
          // );
        } else {
          comploteLink = `https://${_link}`;
          // window.open(`https://${_link}`, "_blank", "noreferrer");
        }
      } else {
        console.log("666666666666666666666666666666662");
        comploteLink = `${protocol}//${_userData.TinyURL}${_link}`;
        // window.open(
        //   `${protocol}//${_userData.TinyURL}${_link}`,
        //   "_blank",
        //   "noreferrer"
        // );
      }
    } else if (!_userData.TinyURL) {
      console.log("666666666666666666666666666666663");
      comploteLink = `${_link}`;
      // window.open(`${_link}`, "_blank", "noreferrer");
    }
    if (attachPath.endsWith("pdf")) {
      component = <BsFileEarmarkPdfFill fontSize={32} />;
    } else if (
      attachPath.endsWith("png") ||
      attachPath.endsWith("jpg") ||
      attachPath.endsWith("jpeg")
    ) {
      component = <img src={comploteLink} alt="flow-img" />;
    } else if (attachPath.endsWith("doc") || attachPath.endsWith("docx")) {
      component = <FaFileWord fontSize={32} />;
    } else if (
      attachPath.endsWith("csv") ||
      attachPath.endsWith("xls") ||
      attachPath.endsWith("xlsx")
    ) {
      component = <BsFileEarmarkExcelFill fontSize={32} />;
    } else if (attachPath.endsWith("pptx") || attachPath.endsWith("ppt")) {
      component = <FaFilePowerpoint fontSize={32} />;
    } else if (attachPath.endsWith("txt")) {
      component = <BsFillFileEarmarkTextFill fontSize={32} />;
    }
    console.log({ comploteLink });

    return (
      <div
        className="card-attachment-container"
        onClick={() => window.open(comploteLink, "_blank", "noreferrer")}
      >
        <div className="show-img-container">{component}</div>
        <div className="detail-container">
          <p className="text-header">{props.data.attach_file}</p>
          <p className="text-file-size">15.54 MB</p>
          <p className="owner-file-name">{props.data.actor.NameEn}</p>
          <p className="text-detail">{props.data.description}</p>
        </div>
        <p className="date-upload">{formatDate()}</p>
      </div>
    );
  };
  // const tinyURL = window.localStorage.getItem("tinyUrl");
  return <>{props.data ? showFile() : <></>}</>;
};
