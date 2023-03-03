import { Form, Input, Tooltip } from "antd";
import React, { useEffect } from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col, Row } from "react-bootstrap";
import { Controller, useWatch } from "react-hook-form";
import { TableInputProps } from "../TableComponent/TableComponent";

type InputFormProps = {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  col?: any;
  colText?: number;
  colAction?: number;
  name: string;
  control: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
  onControlChange: (controlTemplate: any, controlValue: any) => any;
};

export const InputControlComponent: React.FC<InputFormProps> = ({
  colIdx,
  rowIdx,
  control,
  name,
  data,
  template,
  col,
  colAction,
  colText,
  canEditDoc,
  checkActionPage,
  buttonType,
  onControlChange,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required:
          template.attribute.require !== "" &&
          template.attribute.require === "Y" &&
          buttonType !== "draft" &&
          buttonType !== "cancel"
            ? true
            : false,
      }}
      render={({ field, formState: { errors, isSubmitted } }) => {
        // console.log("rvs=>" + template.label, field.value);
        console.log({ canEditDoc });

        // if (!field.value || field.value === "") {
        //   field.value = template.attribute.default;
        // }
        return (
          <>
            <ComponentLabel
              // renderInTable={props.renderInTable}
              col={col}
              colText={colText}
              rowIdx={rowIdx}
              colIdx={rowIdx}
              template={template}
            />
            <Col
              sm={col === undefined ? 12 : 12}
              md={col === undefined ? colAction : 12}
              xs={col === undefined ? 12 : 12}
              xl={col === undefined ? colAction : 12}
              className={"padding-controller"}
            >
              <div
                className={`input-component-container  ${
                  isSubmitted &&
                  errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx]
                    ? "set-layout-required"
                    : ""
                }`}
              >
                <Input
                  {...field}
                  onBlur={(e) => {
                    field.onChange(e);
                    onControlChange(template, e.target.value);
                  }}
                  id={template.label.replaceAll(" ", "_")}
                  value={field.value ? field.value : undefined}
                  readOnly={!canEditDoc || template.attribute.readonly === "Y"}
                  size={"large"}
                  className="input-component"
                  placeholder={
                    template.type !== "an"
                      ? template.attribute.description
                      : "Auto Number"
                  }
                  maxLength={
                    parseInt(template.attribute.length) === 0
                      ? undefined
                      : parseInt(template.attribute.length)
                  }
                  // defaultValue={template.attribute.default}
                  disabled={
                    !canEditDoc ||
                    template.attribute.readonly === "Y" ||
                    template.type === "an"
                  }
                  // onBlur={(e) => onChange(e.target.value)}
                  status={
                    isSubmitted &&
                    errors?.items &&
                    errors?.items[rowIdx] &&
                    errors?.items[rowIdx].layout[colIdx] &&
                    "error"
                  }
                />
                {isSubmitted &&
                  errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx] && (
                    <small id="Name-help" className="p-error p-d-block">
                      {template.label} is required.
                    </small>
                  )}
              </div>
            </Col>
          </>
        );
      }}
    />
  );
};
// export default InputControlComponent;

export const InputTableComponent: React.FC<TableInputProps> = ({
  name,
  template,
  saveFunc,
  inputRef,
  isEditing,
  onEdit,
  children,
  canEditDoc,
  checkActionPage,
  buttonType,
  rowIdx,
  colIdx,
  ...props
}) => {
  if (!isEditing) {
    return (
      <div style={{ width: "100%" }} onClick={onEdit}>
        <Input
          id={rowIdx + "" + colIdx}
          size="large"
          ref={inputRef}
          className="input-component"
          value={children[1]}
          placeholder={template.attribute.description}
          readOnly={!canEditDoc || template.attribute.readonly === "Y"}
          disabled={!canEditDoc || template.attribute.readonly === "Y"}
          maxLength={
            parseInt(template.attribute.length) === 0
              ? undefined
              : parseInt(template.attribute.length)
          }
        />
      </div>
    );
  }
  return (
    <>
      <Tooltip title={children[1]} placement="topLeft">
        <Form.Item
          style={{ margin: 0 }}
          name={name}
          rules={[
            {
              required:
                template.attribute.require === "Y" &&
                buttonType !== "draft" &&
                buttonType !== "cancel"
                  ? true
                  : false,
              message: `${template.label} is required.`,
            },
          ]}
        >
          <Input
            size="large"
            id={rowIdx + "" + colIdx}
            ref={inputRef}
            className="input-component"
            readOnly={!canEditDoc || template.attribute.readonly === "Y"}
            disabled={!canEditDoc || template.attribute.readonly === "Y"}
            placeholder={template.attribute.description}
            maxLength={
              parseInt(template.attribute.length) === 0
                ? undefined
                : parseInt(template.attribute.length)
            }
            onPressEnter={saveFunc}
            onBlur={saveFunc}
          />
        </Form.Item>
      </Tooltip>
    </>
  );
};
// export default InputTableControlComponent;
