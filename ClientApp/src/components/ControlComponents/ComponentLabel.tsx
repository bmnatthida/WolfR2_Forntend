import React from "react";
import { Col } from "react-bootstrap";
import "./ComponentLabel.css";
type Props = {
  renderInTable?: boolean;
  col?: any;
  errors?: any;
  colText?: number;
  rowIdx: number;
  colIdx: number;
  template: any;
  isSubmitted?: any;
};

const ComponentLabel = (props: Props) => {
  return (
    <>
      {!props.renderInTable && (
        <Col
          sm={props.col === undefined ? 12 : undefined}
          md={props.col === undefined ? props.colText : undefined}
          xs={props.col === undefined ? 12 : undefined}
          xl={props.col === undefined ? props.colText : undefined}
          style={{ paddingTop: props.rowIdx === 0 ? 16 : 0 }}
          className={`${
            props.renderInTable === undefined
              ? "padding-controller"
              : "" + props?.isSubmitted &&
                props?.errors?.items &&
                props?.errors?.items[props.rowIdx] &&
                props?.errors?.items[props.rowIdx].layout[props.colIdx]
              ? "set-layout-required"
              : ""
          }`}
        >
          <tr>
            <th>
              <div className="label-text-container">
                <span className="headtext-form">{props.template.label} </span>
                {props.template.attribute.require === "Y" && (
                  <span className="headtext-form text-Is-require">*</span>
                )}
              </div>
              <p className="subtext-form">
                {props.template &&
                  props.template?.alter &&
                  props.template?.alter?.replaceAll("|", "")}
              </p>
            </th>
          </tr>
        </Col>
      )}
    </>
  );
};

export default ComponentLabel;
