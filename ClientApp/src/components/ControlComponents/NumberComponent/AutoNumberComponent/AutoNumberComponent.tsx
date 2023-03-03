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
  colText?: number;
  colAction?: number;
  controls: any;
  errorValid?: any;
  statusMemoDetail?: boolean;
  name: string;
  control: any;
}

export default function AutoNumberComponent(props: Props) {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    defValue();
  }, [props.template]);

  function defValue() {
    let value = "";
    if (props.data.value !== null && props.data.value !== "") {
      value = props.data.value;
    }
    setValue(value);
  }

  useEffect(() => {
    // props.onChangeEditForm({ value: value }, props.rowIdx, props.colIdx);
  }, [value]);

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
        {props.renderInTable != "renderInTable" && (
          <tr>
            <th>
              <div className="label-text-container">
                <span className="headtext-form">{props.template.label} </span>
                {props.template.attribute.require === "Y" && (
                  <span className="headtext-form text-Is-require">*</span>
                )}
              </div>
              <p className="subtext-form">{props.template.alter}</p>
            </th>
          </tr>
        )}
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
        <div className="p-inputgroup" style={{ height: "40px" }}>
          <InputText value={value} placeholder="Auto Number" readOnly />
        </div>
      </Col>
    </>
  );
}
