import React, { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Col, Row } from "react-bootstrap";
import "./NumberComponent.css";
import { confirmDialog } from "primereact/confirmdialog";
interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  summaryFunc?: any;
  renderInTable?: string;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: boolean;
  resultRow?: any[];
  setResultRow?: any;
  readonly?: boolean;
}
export default function NumberComponent(props: Props) {
  const [value, setValue] = useState<any>();
  const [digits, setDigits] = useState<any>();
  var maxValue = Number(props.template.attribute.max);
  var minValue = Number(props.template.attribute.min);

  useEffect(() => {
    defaultValue();
  }, []);

  useEffect(() => {
    defaultValue();
  }, [props.data.value]);

  function callSumFunc(e: any) {
    if (e !== undefined) {
      try {
        let val: number = e.toFixed(digits);

        if (val !== props.data.value) {
          props.onChangeEditForm(
            {
              value: val,
            },
            props.rowIdx,
            props.colIdx
          );
        }

        if (props.template.attribute.summary != "Y") {
          if (props.summaryFunc != undefined) {
            props.summaryFunc(props.rowIdx, props.colIdx);
          }
        } else {
          if (props.resultRow != undefined) {
            let rows = props.resultRow;
            if (!rows.includes(props.rowIdx)) {
              rows.push(props.rowIdx);
            }
            if (props.setResultRow != undefined) {
              props.setResultRow([...rows]);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function defaultValue() {
    try {
      let defaultData: any;
      let defaultDigit: any;
      if (
        props.data.value !== undefined &&
        props.data.value !== null &&
        props.data.value !== "0" &&
        props.data.value !== 0
      ) {
        defaultData = parseFloat(
          props.data.value?.toString().replace(/,/g, "")
        );

        defaultDigit = parseInt(props.template.attribute.decimal);
      } else {
        defaultData = parseFloat(
          props.template.attribute.default.replace(/,/g, "")
        );
        defaultDigit = parseInt(props.template.attribute.decimal);
      }

      if (defaultData != 0 || defaultData != undefined) {
        setValue(defaultData);
      } else {
        setValue(0);
      }
      if (isNaN(defaultData)) {
        setValue(0);
      }

      if (isNaN(defaultDigit)) {
        setDigits(0);
      } else {
        setDigits(defaultDigit);
      }
    } catch (error) {}
  }

  function checkValue(e: any) {
    if (e !== props.data.value) {
      let val = Number(e.replaceAll(",", ""));

      if (minValue !== 0) {
        if (val < minValue) {
          callSumFunc(0);
          confirmDialog({
            message: "value must not be greater than " + minValue + ".",
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            rejectClassName: "hide",
            closable: false,
            draggable: false,
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {
              callSumFunc(0);
            },
          });
        } else {
          callSumFunc(val);
        }
      }
      if (maxValue !== 0) {
        if (val > maxValue) {
          confirmDialog({
            message: "value must not be less than " + maxValue + ".",
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            rejectClassName: "hide",
            closable: false,
            draggable: false,
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {
              callSumFunc(0);
            },
          });
        } else {
          callSumFunc(val);
        }
      } else {
        callSumFunc(val);
      }
    }
  }

  return (
    <>
      <Col
        sm={props.col === undefined ? 12 : undefined}
        md={props.col === undefined ? props.colText : undefined}
        xs={props.col === undefined ? 12 : undefined}
        xl={props.col === undefined ? props.colText : undefined}
        className={
          props.renderInTable === undefined
            ? "padding-controller"
            : "" + props.errorValid !== undefined && !value
            ? "set-layout-required"
            : ""
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
        <div className={`p-inputgroup numberInput`}>
          {props.template.attribute.symbolPosition == "B" && (
            <span className="p-inputgroup-addon">
              <p className="addonText">{props.template.attribute.symbol}</p>
            </span>
          )}

          <InputNumber
            className={`${
              props.errorValid !== undefined && !value ? "invalid" : ""
            }`}
            style={{
              borderRadius: props.template.attribute.symbol !== "" ? "" : "6px",
            }}
            value={value}
            onFocus={(e: any) => e?.target?.select()}
            tabIndex={2}
            onKeyDown={(e: any) => {
              if (e.keyCode === 13) {
                e.target.blur();
              }
            }}
            onBlur={(e: any) => {
              checkValue(e.target.value);
            }}
            mode="decimal"
            inputStyle={{
              textAlign: `${
                props.template.attribute.align === "r" ? "right" : "left"
              }`,
              borderRadius: `${
                props.template.attribute.symbol.trim().length !== 0 ? "" : "6px"
              }`,
              height: "38px",
            }}
            required={props.template.attribute.require === "Y" ? true : false}
            minFractionDigits={digits}
            maxFractionDigits={digits}
            useGrouping={
              props.template.attribute.useComma === "Y" ? true : false
            }
            disabled={
              props.template.attribute.readonly === "Y" ||
              props.statusMemoDetail ||
              props.readonly
                ? true
                : false
            }
          />
          {props.template.attribute.symbolPosition == "E" && (
            <span
              className={`${
                props.template.attribute.symbol === ""
                  ? ""
                  : "p-inputgroup-addon"
              }`}
            >
              <p className="addonText">{props.template.attribute.symbol}</p>
            </span>
          )}
        </div>
        {props.errorValid !== undefined && !value ? (
          <small id="Name-help" className="p-error p-d-block">
            {props.template.label} is required.
          </small>
        ) : (
          ""
        )}
      </Col>
    </>
  );
}
