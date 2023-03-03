import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import "./Button.css";
import { replaceSpecialChar } from "../../Helper/ReplaceSpecialChar";
interface Props {
  title?: string;
  icon: any;
  onSelectView: (text: string) => void;
  page: number;
  curPage: any;
  checkTypeIcon?: string;
}

export const Button = (props: Props) => {
  return (
    <button
      id={replaceSpecialChar(props.title ?? "")}
      className={`BTN${props.page == props.curPage ? " BTNActive" : ""}`}
      onClick={() => {
        props.onSelectView(props.page.toString());
      }}
    >
      <Col>
        {props.checkTypeIcon != undefined ? (
          <img src={props.icon} alt="" className="icon-svg" />
        ) : (
          props.icon
        )}
      </Col>
      <Col flex="left" offset={1}>
        {props.title}
      </Col>
    </button>
  );
};
