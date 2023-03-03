import { Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col, Row } from "react-bootstrap";
import { Controller, useWatch } from "react-hook-form";
import {
  TableInputProps,
  tableSelectOption,
} from "../TableComponent/TableComponent";

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
  onControlChange: (controlTemplate: any, controlValue: any) => any;
  controlUpdate: any;
  canEditDoc: boolean;
  buttonType: string;
  checkActionPage: string;
};

type SelectDropdownProps = {
  ref?: any;
  template: any;
  value?: any;
  status?: any;
  onChange: (value: any, type: string) => void;
  canEditDoc: boolean;
  checkActionPage: string;
  tableOptions?: any[];
};

const { Option } = Select;

export const SelectWithTableDropdownComponent: React.FC<SelectDropdownProps> = ({ ref, template, value, status, canEditDoc, onChange, tableOptions }) => {
  return (
    <>
      <Select
        showSearch
        value={
          value !== "" && value !== null
            ? value
            : template.attribute.items && template.attribute.items.length > 0
            ? template.attribute.items[0].item
            : "--select--"
        }
        placeholder={template.attribute.description}
        optionFilterProp="children"
        onChange={(value) => onChange(value, "dd")}
        disabled={
          !canEditDoc ||
          template.attribute.readonly === "Y" ||
          template.readonly === "Y"
        }
        filterOption={(input, option) =>
          (option!.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        style={{
          textAlign: template.attribute.align === "r" ? "right" : "left",
          height: 38,
        }}
        size={"large"}
        status={status && "error"}
      >
        {tableOptions
          ? tableOptions?.map((option: any, idx: number) => (
              <Option value={option.item}>{option.item}</Option>
            ))
          : template.attribute?.items?.map((option: any, idx: number) => (
              <Option value={option.item}>{option.item}</Option>
            ))}
      </Select>
    </>
  );
};
export const SelectDropdownComponent: React.FC<SelectDropdownProps> = ({
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
      <Select
        showSearch
        disabled={
          !canEditDoc ||
          template.attribute.readonly === "Y" ||
          template.readonly === "Y"
        }
        // disabled={!canEditDoc || template.attribute.readonly === "Y"}
        value={value && value !== "" && value}
        placeholder={template.attribute.description}
        optionFilterProp="children"
        onChange={(value: any) => onChange(value, "dd")}
        filterOption={(input, option) =>
          (option!.children as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        style={{
          textAlign: template.attribute.align === "r" ? "right" : "left",
        }}
        size={"large"}
        status={status && "error"}
      >
        {template.attribute?.items?.map((option: any, idx: number) => (
          <Option value={option.item}>{option.item}</Option>
        ))}
      </Select>
    </>
  );
};
export const SelectDropdownControlComponent: React.FC<InputProps> = ({
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
  controlUpdate,
  canEditDoc,
  checkActionPage,
  buttonType,
  ...props
}) => {
  const { Option } = Select;
  const watchControlSelect = useWatch({
    control,
    name: name,
  });

  const formatValue = (value: string[]) => {
    let items = template.attribute.items;
    let _res: any[] = [];
    if (value) {
      for (let i = 0; i < items.length; i++) {
        const item: any = items[i];
        if (value[i] === "Y") {
          _res.push(item.item);
        }
      }
      return _res;
    }
    return [];
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (value.data.value) {
            if (
              value.data.value !== "---Select---" &&
              value.data.value !== "-- Please Select --" &&
              value.data.value !== "--Please Select--" &&
              value.data.value !== "--select--"
            ) {
              return true;
            } else if (
              template.attribute.require === "" ||
              template.attribute.require === "N" ||
              buttonType === "draft" ||
              buttonType === "cancel"
            ) {
              return true;
            } else {
              return false;
            }
          } else if (!value.data.value) {
            if (
              !template.attribute.require ||
              template.attribute.require === "" ||
              template.attribute.require === "N" ||
              buttonType === "draft" ||
              buttonType === "cancel"
            ) {
              return true;
            } else {
              return false;
            }
          }
        },
      }}
      render={({
        field: { onChange, value, onBlur, name, ref },
        formState: { errors, isSubmitted },
      }) => {
        const _value = value;
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
                <SelectDropdownComponent
                  {...{ canEditDoc, checkActionPage }}
                  value={_value.data.value}
                  template={_value.template}
                  onChange={(value) => {
                    onChange({
                      ..._value,
                      data: {
                        value,
                      },
                    });
                    onControlChange(template, value);
                  }}
                  status={
                    isSubmitted &&
                    ((errors?.items &&
                      errors?.items[rowIdx] &&
                      errors?.items[rowIdx].layout[colIdx]) ||
                      _value === "--select--")
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

export const SelectDropdownTableComponent: React.FC<TableInputProps> = ({
  name,
  template,
  saveFunc,
  inputRef,
  isEditing,
  onEdit,
  children,
  canEditDoc,
  checkActionPage,
  record,
  tableOptions,
  rowIdx,
  colIdx,
  ...props
}) => {
  const [customOptions, setCustomOptions] = useState<any[]>();
  useEffect(() => {
    if (tableOptions) {
      const options = tableOptions.find((e) => {
        if (e.targetCol.rowIdx === rowIdx) {
          if (e.targetCol.colIdx === colIdx) {
            console.log("logic=>e", e);
            return e;
          }
        }
      });
      if (options) {
        console.log(
          "logic=>options" + template.label,
          options.targetCol.options
        );
        setCustomOptions(options.targetCol.options);
      }
    }
  }, [tableOptions]);

  if (!isEditing) {
    return (
      <div onMouseOver={onEdit}>
        <SelectWithTableDropdownComponent
          ref={inputRef}
          {...{ canEditDoc, checkActionPage }}
          value={children[1]}
          template={template}
          onChange={saveFunc}
          tableOptions={customOptions}
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
            validator: (_, value) => {
              let res = true;

              if (value) {
                if (value !== "--select--" && value !== "--Please Select--") {
                  res = true;
                } else if (template.attribute.require === "N") {
                  res = true;
                } else {
                  res = false;
                }
              } else {
                if (template.attribute.require === "N") {
                  res = true;
                } else {
                  res = false;
                }
              }

              return res
                ? Promise.resolve()
                : Promise.reject(`${template.label} is required.`);
            },
          },
        ]}
      >
        <SelectWithTableDropdownComponent
          ref={inputRef}
          {...{ canEditDoc, checkActionPage }}
          template={template}
          onChange={saveFunc}
          tableOptions={customOptions}
        />
      </Form.Item>
    </>
  );
};
