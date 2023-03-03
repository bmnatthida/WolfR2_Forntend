import React from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  key: any;
  col?: any;
  colText?: number;
  colAction?: number;
}

export const EmptyComponent = (props: Props) => {
  return (
    <>
      <Col
        sm={props.col === undefined ? 12 : undefined}
        md={props.col === undefined ? props.colText : undefined}
        xs={props.col === undefined ? 12 : undefined}
        xl={props.col === undefined ? props.colText : undefined}
        className="padding-controller"
      >
        <tr>
          <th>
            <div className="label-text-container">
              <span className="headtext-form"></span>
            </div>
            <p className="subtext-form"></p>
          </th>
        </tr>
      </Col>
      <Col
        sm={props.col === undefined ? 12 : 12}
        md={props.col === undefined ? props.colAction : 12}
        xs={props.col === undefined ? 12 : 12}
        xl={props.col === undefined ? props.colAction : 12}
        className="padding-controller"
      >
        <div className="" id={props.key}></div>
      </Col>
    </>
  );
};
