import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Col, Row } from "react-bootstrap";
import "./ShortTextComponent.css";
import { Controller } from "react-hook-form";
import ComponentLabel from "../../ComponentLabel";
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
  errorValid?: string;
  statusMemoDetail?: boolean;
  // name: string;
  control: any;
  controlRef: any;
  controlRegister: any;
}

export default function ShortTextComponent(props: Props) {
  const [text, setText] = useState<any>();

  useEffect(() => {
    setText(props.data);
  }, [props.data]);

  function setOnChangeValue(e: any) {
    if (props.data.value != e.target.value) {
      if (props.onChangeEditForm !== undefined) {
        props.onChangeEditForm(
          { value: e.target.value },
          props.rowIdx,
          props.colIdx
        );
      }
    }
  }

  return (
    <>
      <ComponentLabel
        renderInTable={props.renderInTable}
        col={props.col}
        colText={props.colText}
        rowIdx={props.rowIdx}
        colIdx={props.rowIdx}
        template={props.template}
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
        <div>
          <InputText
            ref={(el: any) => props?.controlRef?.current?.push(el)}
            style={{ borderRadius: "6px", height: "38px", width: "100%" }}
            value={text}
            // defaultValue={value}
            onChange={(e: any) => setText(e.value)}
            onBlur={(e: any) => setOnChangeValue(e)}
            placeholder={props.template.attribute.description}
            maxLength={
              parseInt(props.template.attribute.length) === 0
                ? undefined
                : parseInt(props.template.attribute.length)
            }
            disabled={
              props.template.attribute.readonly === "Y" ||
              props.statusMemoDetail
                ? true
                : false
            }
          />
        </div>
      </Col>
    </>
  );
}

export function ShortTextFormComponent(props: Props) {
  const initialValues = {
    value: null,
  };
  const [text, setText] = useState<any>(props.data.value);
  // useEffect(() => {
  //   defaultValue();
  // }, []);
  useEffect(() => {
    // defaultValue();
    console.log(props.data.value);
    setText(props.data.value);
  }, [props.data.value]);

  function defaultValue() {
    if (props.data.value == null || undefined) {
      setText((prevState: any) => ({
        ...prevState,
        value: props.template.attribute?.default,
      }));
    } else {
      setText((prevState: any) => ({
        ...prevState,
        value: props.data.value,
      }));
    }
  }
  function setOnChangeValue(e: any) {
    console.log({ e });

    setText(e.target.value);
    // if (props.data.value != e.target.value) {
    //   if (props.onChangeEditForm !== undefined) {
    //     props.onChangeEditForm(
    //       { value: e.target.value },
    //       props.rowIdx,
    //       props.colIdx
    //     );
    //   }
    // }
  }
  return (
    <Controller
      render={({
        field: { onChange, value, onBlur, name, ref },
        formState: { errors, isSubmitted },
      }) => {
        // console.log({ ddddd: errors });
        const _text = value;
        // console.log(_text);
        // setText(_text);
        // if (errors && isSubmitted) {
        //   // console.log({ errors });
        //   // props.controlRef.current[0].focus();
        // }
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
              <div
                className={`p-inputgroup ${
                  isSubmitted &&
                  errors?.items &&
                  errors?.items[props.rowIdx] &&
                  errors?.items[props.rowIdx].layout[props.colIdx]
                    ? "set-layout-required"
                    : ""
                }`}
              >
                <InputText
                  ref={(el: any) => props?.controlRef?.current?.push(el)}
                  className={`${
                    isSubmitted &&
                    errors?.items &&
                    errors?.items[props.rowIdx] &&
                    errors?.items[props.rowIdx].layout[props.colIdx]
                      ? "invalid"
                      : ""
                  } `}
                  style={{ borderRadius: "6px", height: "38px" }}
                  value={text}
                  // defaultValue={value}
                  onChange={(e: any) => setOnChangeValue(e)}
                  onBlur={(e: any) => onChange(text)}
                  placeholder={props.template.attribute.description}
                  maxLength={
                    parseInt(props.template.attribute.length) === 0
                      ? undefined
                      : parseInt(props.template.attribute.length)
                  }
                  // required={props.template.attribute.require === "Y" ? true : false}
                  disabled={
                    props.template.attribute.readonly === "Y" ||
                    props.statusMemoDetail
                      ? true
                      : false
                  }
                />
                <button onClick={() => onChange("1234")}>clickkkkkkk</button>
                {isSubmitted &&
                  errors?.items &&
                  errors?.items[props.rowIdx] &&
                  errors?.items[props.rowIdx].layout[props.colIdx] && (
                    <small id="Name-help" className="p-error p-d-block">
                      {props.template.label} is required.
                    </small>
                  )}
              </div>
            </Col>
          </>
        );
      }}
      rules={{
        required: props.template.attribute.require === "Y" ? true : false,
      }}
      name={props.name}
      control={props.control}
      //   valueName={"value"}
    />
  );
}
