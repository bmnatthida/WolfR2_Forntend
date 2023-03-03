import { Space } from "antd";
import { Radio } from "antd";
import React from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { Form } from "antd";
import { TableInputProps } from "../TableComponent/TableComponent";
import { Store } from "antd/lib/form/interface";

type InputProps = {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  col?: any;
  colText?: number;
  colAction?: number;
  onControlChange: (
    controlTemplate: any,
    controlValue: any,
    isInTable: any
  ) => any;
  // statusMemoDetail?: boolean;
  name: string;
  control: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
};

type InputRadioProps = {
  ref?: any;
  template: any;
  value?: any;
  status?: any;
  onChange?: (value: any) => void;
  canEditDoc: boolean;
  checkActionPage: string;
};

export const RadioComponent: React.FC<InputRadioProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
}) => {
  return (
    <>
      <Radio.Group
        onChange={onChange}
        value={value}
        size={"large"}
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
      >
        <Space
          direction={
            template.attribute.multipleLine === "Y" ? "horizontal" : "vertical"
          }
        >
          {template.attribute.items.map((choice: any) => (
            <Radio
              className={`${status ? "checkbox-invalid" : ""}`}
              value={choice.item}
            >
              {choice.item}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </>
  );
};

export const RadioControlComponent: React.FC<InputProps> = ({
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
  onControlChange,
  buttonType,
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
      render={({
        field: { onChange, value, onBlur, name, ref },
        formState: { errors, isSubmitted },
      }) => (
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
              <RadioComponent
                {...{ canEditDoc, checkActionPage }}
                template={template}
                value={value}
                onChange={(value) => {
                  console.log({ value });
                  onChange(value);
                  onControlChange(template, value.target.value, false);
                }}
                status={
                  isSubmitted &&
                  errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx]
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
      )}
    />
  );
};

export const RadioTableComponent: React.FC<TableInputProps> = ({
  name,
  template,
  saveFunc,
  inputRef,
  isEditing,
  onEdit,
  value,
  children,
  canEditDoc,
  checkActionPage,
  buttonType,
  ...props
}) => {
  if (!isEditing) {
    return (
      <div onMouseOver={onEdit}>
        <RadioComponent
          {...{ canEditDoc, checkActionPage }}
          template={template}
          value={children[1]}
        />
      </div>
    );
  }

  return (
    <>
      <Form.Item
        style={{ margin: 0 }}
        name={name}
        normalize={(value: any) => value}
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
        <RadioComponent
          {...{ canEditDoc, checkActionPage }}
          template={template}
          onChange={(e: any) => {
            saveFunc(template.type);
          }}
        />
      </Form.Item>
    </>
  );
};
