import { Form, Input } from "antd";
import React from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { TableInputProps } from "../TableComponent/TableComponent";
import TextArea from "antd/lib/input/TextArea";
import { replaceSpecialChar } from "../../../Helper/ReplaceSpecialChar";

type InputProps = {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  col?: any;
  colText?: number;
  colAction?: number;
  // statusMemoDetail?: boolean;
  name: string;
  control: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
};

type InputTextAreaProps = {
  id?: string;
  ref?: any;
  colIdx: number;
  rowIdx: number;
  col?: any;
  colText?: number;
  template: any;
  value?: any;
  status?: any;
  onChange: (value: any) => void;
  canEditDoc: boolean;
  checkActionPage: string;
};

export const InputTextAreaComponent: React.FC<InputTextAreaProps> = ({
  id,
  ref,
  colIdx,
  rowIdx,
  col,
  colText,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
}) => {
  const { TextArea } = Input;

  return (
    <>
      <TextArea
        id={replaceSpecialChar(id ?? "")}
        ref={ref}
        autoSize={{ minRows: 3 }}
        className="input-component"
        value={value}
        defaultValue={template.attribute.default}
        placeholder={template.attribute.description}
        maxLength={
          parseInt(template.attribute.length) === 0
            ? undefined
            : parseInt(template.attribute.length)
        }
        size={"large"}
        onBlur={(e: any) => onChange(e.target.value)}
        disabled={canEditDoc && template.attribute.readonly === "Y"}
        readOnly={canEditDoc && template.attribute.readonly === "Y"}
        status={status}
      />
    </>
  );
};

export const InputTextAreaControlComponent: React.FC<InputProps> = ({
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
  ...props
}) => {
  const { TextArea } = Input;
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
        console.log({
          errorserrorserrorserrors: errors,
          buttonType,
          template,
          field,
        });

        return (
          <>
            <ComponentLabel
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
                <TextArea
                  {...field}
                  id={template.label.replaceAll(" ", "_")}
                  value={field.value ? field.value : undefined}
                  autoSize={{ minRows: 3 }}
                  className="input-component"
                  placeholder={template.attribute.description}
                  maxLength={
                    parseInt(template.attribute.length) === 0
                      ? undefined
                      : parseInt(template.attribute.length)
                  }
                  disabled={!canEditDoc || template.attribute.readonly === "Y"}
                  defaultValue={template.attribute.default}
                  status={
                    isSubmitted &&
                    errors?.items &&
                    errors?.items[rowIdx] &&
                    errors?.items[rowIdx].layout[colIdx] &&
                    "error"
                  }
                  rows={5}
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

export const InputTextAreaTableComponent: React.FC<TableInputProps> = ({
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

  ...props
}) => {
  // const row = rowIdx?.toString();
  // const col = colIdx?.toString();
  // console.log(typeof row);
  if (!isEditing) {
    return (
      <div style={{ paddingRight: 24 }} onClick={onEdit}>
        <TextArea
          // id text area
          id={rowIdx + "_" + colIdx + "_" + template.label}
          ref={inputRef}
          autoSize={{ minRows: 3 }}
          className="input-component"
          value={children[1]}
          defaultValue={template.attribute.default}
          placeholder={template.attribute.description}
          disabled={!canEditDoc || template.attribute.readonly === "Y"}
          maxLength={
            parseInt(template.attribute.length) === 0
              ? undefined
              : parseInt(template.attribute.length)
          }
          style={{ height: 38 }}
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
              template.attribute.require === "Y" && buttonType !== "edit"
                ? true
                : false,
            message: `${template.label} is required.`,
          },
        ]}
      >
        <TextArea
          id={rowIdx + "_" + colIdx + "_" + template.label}
          ref={inputRef}
          autoSize={{ minRows: 3 }}
          disabled={!canEditDoc || template.attribute.readonly === "Y"}
          className="input-component"
          placeholder={template.attribute.description}
          defaultValue={template.attribute.default}
          onClick={() => console.log("tex", template.attribute)}
          maxLength={
            parseInt(template.attribute.length) === 0
              ? undefined
              : parseInt(template.attribute.length)
          }
          style={{ height: 38 }}
          onBlur={saveFunc}
        />
      </Form.Item>
    </>
  );
};
