import { Form, InputNumber } from "antd";
import React, { useEffect } from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col, Row } from "react-bootstrap";
import { Controller, useWatch } from "react-hook-form";
import { TableInputProps } from "../TableComponent/TableComponent";
import { replaceSpecialChar } from "../../../Helper/ReplaceSpecialChar";

type InputProps = {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  col?: any;
  colText?: number;
  colAction?: number;
  name: string;
  control: any;
  onControlChange: (
    controlTemplate: any,
    controlValue: any,
    controlUpdate: any
  ) => any;
  controlUpdate: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
};

type InputNumberProps = {
  ref?: any;
  id?: string;
  template: any;
  value?: any;
  status?: any;
  onChange: (value: any) => void;
  isEditing?: any;
  canEditDoc: boolean;
  toggleEdit?: any;
  checkActionPage: string;
};

export const InputNumberComponent: React.FC<InputNumberProps> = ({
  id,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  isEditing,
  toggleEdit,
}) => {
  return (
    <>
      <InputNumber
        id={replaceSpecialChar(id ?? "")}
        autoFocus={isEditing}
        size={"large"}
        className={`input-component ${
          template.attribute.align === "r" ? "text-right" : "text-left"
        } ${
          template.attribute.symbol !== ""
            ? template.attribute.symbolPosition == "E" && "symbol-after"
            : template.attribute.symbolPosition == "B" && "symbol-before"
        }`}
        placeholder={template.attribute.description}
        addonAfter={
          template.attribute.symbolPosition == "E" && template.attribute.symbol
        }
        addonBefore={
          template.attribute.symbolPosition == "B" && template.attribute.symbol
        }
        controls={false}
        formatter={(value) => {
          if (isNaN(Number(value.replaceAll(",", "")))) {
            return "";
          } else {
            if (template.attribute.useComma === "Y") {
              return Number(value.replaceAll(",", "")).toLocaleString("en-US", {
                minimumFractionDigits: Number(template.attribute.decimal),
              });
            } else {
              return Number(value.replaceAll(",", "")).toFixed(
                Number(template.attribute.decimal)
              );
            }
          }
        }}
        style={{
          width: "100%",
        }}
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
        // readOnly={!canEditDoc || template.attribute.readonly === "Y"}
        value={value && value !== "" ? value : "0"}
        defaultValue={template.attribute.default}
        onFocus={(e) => {
          if (toggleEdit) {
            toggleEdit();
          }
          e.target.select();
        }}
        onBlur={(e) => {
          let _value = "";
          if (isNaN(Number(e.target.value.replaceAll(",", "")))) {
            _value = "0";
          } else {
            _value = Number(e.target.value.replaceAll(",", "")).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: Number(template.attribute.decimal),
                maximumFractionDigits: Number(template.attribute.decimal),
              }
            );
          }
          onChange(_value.replaceAll(",", ""));
        }}
        onPressEnter={(e: any) => {
          e.target.blur();
        }}
        status={status}
      />
    </>
  );
};

export const InputNumberControlComponent: React.FC<InputProps> = ({
  colIdx,
  rowIdx,
  control,
  name,
  data,
  template,
  col,
  colAction,
  colText,
  onControlChange,
  canEditDoc,
  checkActionPage,
  controlUpdate,
  buttonType,
}) => {
  // console.log(colIdx, rowIdx, colAction, colText, col);
  const watchControlInput = useWatch({
    control,
    name: name,
  });

  // useEffect(() => {
  //   // console.log({ watchControlInput });
  //   // console.log({ watchControlSelect });
  //   onControlChange(template, watchControlInput, controlUpdate);
  // }, [watchControlInput]);
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
        min:
          template.attribute.min !== "0"
            ? template.attribute.min !== ""
              ? template.attribute.min
              : undefined
            : undefined,
        max:
          template.attribute.max !== "0"
            ? template.attribute.max !== ""
              ? template.attribute.max
              : undefined
            : undefined,
      }}
      render={({
        field: { onChange, value },
        formState: { errors, isSubmitted },
      }) => {
        // console.log({ errorserrorserrorserrors: errors });

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
                <InputNumberComponent
                  {...{ canEditDoc, checkActionPage }}
                  id={template.label.replaceAll(" ", "_")}
                  template={template}
                  onChange={(value) => {
                    onChange(value);
                    onControlChange(template, value, false);
                  }}
                  value={value}
                  status={
                    errors?.items &&
                    errors?.items[rowIdx] &&
                    errors?.items[rowIdx].layout[colIdx] &&
                    //  ||
                    // value?.every((_value: string) => _value === "N")) &&
                    "error"
                  }
                />
                {errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx] &&
                  errors?.items[rowIdx].layout[colIdx]?.data?.value?.type ===
                    "required" && (
                    <small id="Name-help" className="p-error p-d-block">
                      {template.label} is required.
                    </small>
                  )}
                {errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx] &&
                  (errors?.items[rowIdx]?.layout[colIdx]?.data?.value?.type! ===
                    "min" ||
                    errors?.items[rowIdx]?.layout[colIdx]?.data?.value
                      ?.type! === "max") && (
                    <small id="Name-help" className="p-error p-d-block">
                      {template.label} must be between {template.attribute.min}{" "}
                      to {template.attribute.max}.
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

export const InputNumberTableComponent: React.FC<TableInputProps> = ({
  rowIdx,
  colIdx,
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
}) => {
  if (!isEditing) {
    return (
      <div style={{ width: "100%" }}>
        <InputNumberComponent
          id={rowIdx + "_" + colIdx + "_" + template.label}
          {...{ canEditDoc, checkActionPage, buttonType }}
          value={children[1]}
          template={template}
          onChange={saveFunc}
          toggleEdit={onEdit}
        />
      </div>
    );
  }
  return (
    <>
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
          {
            validator: (_, value) => {
              let correct = true;
              let msg = "";
              if (value) {
                const formatValue = Number(value);
                const formatMaxValue = Number(template.attribute.max);
                const formatMinValue = Number(template.attribute.min);
                if (formatMinValue !== 0 && formatMaxValue !== 0) {
                  if (
                    formatValue >= formatMinValue &&
                    formatValue <= formatMaxValue
                  ) {
                    correct = true;
                  } else {
                    correct = false;
                    msg = `${template.label} length must be between ${template.attribute.min} to ${template.attribute.max} value`;
                  }
                } else {
                  if (formatMinValue != 0) {
                    if (formatValue >= formatMinValue) {
                      correct = true;
                    } else {
                      correct = false;
                      msg = `${template.label} length must be greater than ${template.attribute.min}`;
                    }
                  }
                  if (formatMaxValue != 0) {
                    if (formatValue <= formatMaxValue) {
                      correct = true;
                    } else {
                      correct = false;
                      msg = `${template.label} length must be less than ${template.attribute.max}`;
                    }
                  }
                }
              } else if (!value && template.attribute.require === "Y") {
                correct = false;
              }
              return correct
                ? Promise.resolve()
                : Promise.reject(new Error(msg));
            },
          },
        ]}
      >
        <InputNumberComponent
          id={rowIdx + "_" + colIdx + "_" + template.label}
          {...{ canEditDoc, checkActionPage }}
          template={template}
          isEditing={isEditing}
          ref={inputRef}
          onChange={() => {
            saveFunc(template.type, template.type);
          }}
        />
      </Form.Item>
    </>
  );
};
