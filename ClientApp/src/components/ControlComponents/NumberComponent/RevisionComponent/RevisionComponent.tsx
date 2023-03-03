import React, { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Col, Row } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: string;
  errorValid?: any;
  colText?: any;
  colAction?: any;
}
export default function RevisionNumberComponent(props: Props) {
  const [value, setValue] = useState(Number);
  useEffect(() => {
    setValue(props.data.value);
  }, [props.data]);

  return (
    <>
      <Col
        sm={props.col === undefined ? 12 : undefined}
        md={props.col === undefined ? props.colText : undefined}
        xs={props.col === undefined ? 12 : undefined}
        xl={props.col === undefined ? props.colText : undefined}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        <tr>
          <th>
            <p className="headtext-form">{props.template.label}</p>
            <p className="subtext-form">{props.template.alter}</p>
          </th>
        </tr>
      </Col>
      <Col
        sm={props.col === undefined ? 12 : 12}
        md={props.col === undefined ? props.colAction : 12}
        xs={props.col === undefined ? 12 : 12}
        xl={props.col === undefined ? props.colAction : 12}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        <div className="p-inputgroup">
          <InputText
            value={value}
            mode="decimal"
            disabled={props.template.attribute.readonly === "Y" ? true : false}
          />
        </div>
      </Col>
    </>
  );
}
