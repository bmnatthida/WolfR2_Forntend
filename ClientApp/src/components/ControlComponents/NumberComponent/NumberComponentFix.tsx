import React, { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Col, Row } from "react-bootstrap";
import "./NumberComponent.css";
import { confirmDialog } from "primereact/confirmdialog";
import { Controller } from "react-hook-form";
import ComponentLabel from "../ComponentLabel";
// import { InputNumber } from "antd";
type Props = {
  name: any;
  // ref: any;
  control: any;
  template: any;
  data: { value: string };
  col?: any;
  rowIdx: number;
  colIdx: number;
  // onChangeEditForm: (value: any) => void;
  summaryFunc?: any;
  renderInTable?: boolean;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: boolean;
  resultRow?: any[];
  setResultRow?: any;
  readonly?: boolean;
};

const NumberComponentFix = (props: Props) => {
  useEffect(() => {
    // console.log("props.name", props.data);
  }, [props.data]);

  return (
    <Controller
      render={({
        field: { onChange, onBlur, value, name, ref },
        formState: { errors, isSubmitted },
      }) => {
        // console.log({ row: props.rowIdx, col: props.colIdx });

        return (
          <>
            <ComponentLabel
              renderInTable={props.renderInTable}
              col={props.col}
              errors={errors}
              colText={props.colText}
              rowIdx={props.rowIdx}
              colIdx={props.rowIdx}
              template={props.template}
              isSubmitted={isSubmitted}
            />

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
                    <p className="addonText">
                      {props.template.attribute.symbol}
                    </p>
                  </span>
                )}

                <InputNumber
                  ref={ref}
                  // name={props.name}
                  className={``}
                  style={{
                    borderRadius:
                      props.template.attribute.symbol !== "" ? "" : "6px",
                  }}
                  // onChange={(e: any) => props.onChangeEditForm(e.value)}
                  value={
                    props.data.value
                      ? Number(props.data.value.replaceAll(",", ""))
                      : 0
                  }
                  // onFocus={(e: any) => e?.target?.select()}
                  // tabIndex={2}
                  // onKeyDown={(e: any) => {
                  //   if (e.keyCode === 13) {
                  //     e.target.blur();
                  //   }
                  // }}
                  onBlur={(e: any) => {
                    onChange(e.target.value);
                  }}
                  mode="decimal"
                  inputStyle={{
                    textAlign: `${
                      props.template.attribute.align === "r" ? "right" : "left"
                    }`,
                    borderRadius: `${
                      props.template.attribute.symbol.trim().length !== 0
                        ? ""
                        : "6px"
                    }`,

                    height: "38px",
                    borderColor: `${
                      isSubmitted &&
                      errors?.items &&
                      errors?.items[props.rowIdx] &&
                      errors?.items[props.rowIdx].layout[props.colIdx] &&
                      !props.data.value
                        ? "#f44336"
                        : ""
                    }`,
                  }}
                  // required={
                  //   props.template.attribute.require === "Y" ? true : false
                  // }
                  // minFractionDigits={digits}
                  // maxFractionDigits={digits}
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
                    <p className="addonText">
                      {props.template.attribute.symbol}
                    </p>
                  </span>
                )}
              </div>
              {isSubmitted &&
                errors?.items &&
                errors?.items[props.rowIdx] &&
                errors?.items[props.rowIdx].layout[props.colIdx] && (
                  <small id="Name-help" className="p-error p-d-block">
                    {props.template.label} is required.
                  </small>
                )}
            </Col>
          </>
        );
      }}
      name={props.name}
      control={props.control}
      rules={{
        required: props.template.attribute.require === "Y" ? true : false,
      }}
      //   valueName={"value"}
    />
  );
};

export default NumberComponentFix;
