import React, { useEffect, useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import "./RadioComponent.css";
import { Col, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import ComponentLabel from "../ComponentLabel";
interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: boolean;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: boolean;
  name: string;
  control: any;
}
export default function RadioComponent(props: Props) {
  // const initialValues = {
  //   value: null,
  // };
  // const [selectedItems, setSelectedItems] = useState<any>({});
  // const [dataRequest, setDataRequest] = useState<any>(
  //   props.data.value == null || undefined ? initialValues : props.data
  // );

  // useEffect(() => {
  //   defaultValue();
  // }, [props.data]);

  // // useEffect(() => {
  // //   props.onChangeEditForm(dataRequest, props.rowIdx, props.colIdx);
  // // }, [dataRequest]);

  // function defaultValue() {
  //   var responseData: any = props.template.attribute.items;
  //   var defaultData = props.data.value;
  //   for (const index in responseData) {
  //     if (responseData[index].item === defaultData) {
  //       setDataRequest(props.template.attribute.items[index]);
  //     }
  //   }
  // }

  return (
    <Controller
      render={({
        field: { onChange, value, onBlur, name, ref },
        formState: { errors, isSubmitted },
      }) => (
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
            className={
              props.renderInTable === undefined ? "padding-controller" : ""
            }
          >
            <div
              className="set-column"
              style={{
                display: `${
                  props.template.attribute.multipleLine === "Y"
                    ? "flex"
                    : "initial"
                }`,
              }}
            >
              {props.template.attribute.items.map((items: any) => {
                return (
                  <div key={items.item} className="radio-color">
                    <RadioButton
                      className={`margin-text ${
                        isSubmitted &&
                        errors?.items &&
                        errors?.items[props.rowIdx] &&
                        errors?.items[props.rowIdx].layout[props.colIdx]
                          ? "invalid-r"
                          : ""
                      }`}
                      inputId={items.item}
                      name="items"
                      value={items}
                      onChange={(e) => {
                        onChange(e.value.item.toString());
                        // props.onChangeEditForm(
                        //   { value: e.value.item.toString() },
                        //   props.rowIdx,
                        //   props.colIdx
                        // );
                      }}
                      disabled={
                        props.template.attribute.readonly === "Y" ||
                        props.statusMemoDetail
                          ? true
                          : false
                      }
                      checked={props.data.value === items.item}
                    />
                    <label>{items.item}</label>
                  </div>
                );
              })}
            </div>
            <>
              {isSubmitted &&
              errors?.items &&
              errors?.items[props.rowIdx] &&
              errors?.items[props.rowIdx].layout[props.colIdx] ? (
                <small id="Name-help" className="p-error p-d-block">
                  {props.template.label} is required.
                </small>
              ) : (
                ""
              )}
            </>
          </Col>
        </>
      )}
      rules={{
        required: props.template.attribute.require === "Y" ? true : false,
      }}
      name={props.name}
      control={props.control}
      //   valueName={"value"}
    />
  );
}
