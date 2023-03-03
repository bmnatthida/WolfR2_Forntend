import React, { useEffect, useState } from "react";
import SaveSvg from "../../assets/saveSvg.svg";
import CancleSvg from "../../assets/cancleSvg.svg";
import "./ButtonForm.css";
type Props = {
  type?: string;
  label?: string;
  icon?: any;
  onClick?: (e: any) => void;
  classNameStyle?: string;
};

const ButtonForm = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`button-form-container ${
        props.type === undefined ? "default" : ""
      }  ${
        props.type !== undefined && props.type === "cancle" ? "cancle" : ""
      } ${props.classNameStyle === undefined ? "" : "set-size.layout"}  ${
        props.type !== undefined && props.type === "unActive" ? "unActive" : ""
      }`}
    >
      {props.icon === undefined && props.type === undefined && (
        <img src={SaveSvg} alt="logo" />
      )}
      {props.icon !== undefined && <img src={props.icon} alt="logo" />}
      {props.type === "cancle" && <img src={CancleSvg} alt="logo" />}
      {props.icon !== undefined && <img src={props.icon} alt="logo" />}
      {props.type === undefined && "Save"}
      {props.type === "cancle" && "Cancle"}
      {props.label !== undefined && props.label}
    </button>
  );
};

export default ButtonForm;
