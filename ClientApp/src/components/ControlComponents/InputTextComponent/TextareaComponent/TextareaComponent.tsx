import React, { useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Col, Row } from "react-bootstrap";
import "./TextareaComponent.css";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";
import { Controller } from "react-hook-form";
import ComponentLabel from "../../ComponentLabel";
interface Props {
  name: any;
  id?: any;
  template: any;
  data: { value: string };
  col?: any;
  rowIdx: number;
  colIdx: number;
  renderInTable?: boolean;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: boolean;
  control: any;
}

export default function TextareaComponent(props: Props) {
  const initialValues = {
    value: null,
  };

  const [text, setText] = useState<any>(
    props.data.value == null || undefined ? initialValues : props.data
  );

  useEffect(() => {
    defaultValue();
  }, [props.data]);

  function defaultValue() {
    if (props.data?.value) {
      setText((prevState: any) => ({
        ...prevState,
        value: props.data.value,
      }));
    } else if (props.template.attribute?.default) {
      setText((prevState: any) => ({
        ...prevState,
        value: props.template.attribute?.default,
      }));
    } else if (props.data?.value === "" || !props.data.value) {
      setText((prevState: any) => ({
        ...prevState,
        value: initialValues.value,
      }));
    }
  }

  return (
    <Controller
      render={({
        field: { onChange, onBlur, value, name, ref },
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
              <InputTextarea
                className={`${
                  isSubmitted &&
                  errors?.items &&
                  errors?.items[props.rowIdx] &&
                  errors?.items[props.rowIdx].layout[props.colIdx]
                    ? "invalid"
                    : ""
                }`}
                style={{ borderRadius: "6px", height: "38px" }}
                id={props.id}
                rows={1}
                cols={30}
                value={props.data.value}
                onChange={(e: any) => onChange(e.target.value)}
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
                autoResize
              />
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
            </div>
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
