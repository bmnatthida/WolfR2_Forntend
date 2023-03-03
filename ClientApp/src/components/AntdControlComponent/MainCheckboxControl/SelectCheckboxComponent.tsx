import { Form, Input, Select } from "antd";
import React from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { TableInputProps } from "../TableComponent/TableComponent";

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

type SelectCheckboxProps = {
  ref?: any;
  template: any;
  value?: any;
  status?: any;
  onChange: (value: any, type: any) => void;
  canEditDoc: boolean;
  checkActionPage: string;
};
const SelectCheckboxInTableComponent: React.FC<SelectCheckboxProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
}) => {
  const { Option } = Select;

  const onSelectChange = (value: string[]) => {
    let items = template.attribute.items;
    let test: any[] = [];
    const res = items.map((item: any, idx: number) => {
      let check = "N";

      for (let i = 0; i < value.length; i++) {
        const _value = value[i];

        if (_value === item.item) {
          check = "Y";
          test.push(item.item);
        }
      }
      return check;
    });

    onChange(test.toString(), "cb");
  };

  const formatValue = (value: any) => {
    let items = template.attribute.items;

    let _res: any[] = [];
    if (value && value.length > 0) {
      const _values = value.split(",");
      for (let i = 0; i < items.length; i++) {
        const item: any = items[i];
        if (value[i] === "Y") {
          _res.push(item.item);
        }
      }
      return _values;
    }
    return [];
  };
  return (
    <>
      <Select
        // ref={ref}
        size={"large"}
        showSearch
        value={formatValue(value)}
        placeholder={template.attribute.description}
        optionFilterProp="children"
        onChange={onSelectChange}
        filterOption={(input, option) => {
          console.log({ option });
          return (option!.children! as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase());
        }}
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
        status={status}
        mode="tags"
      >
        {template.attribute.items.map((option: any) => (
          <Option value={option.item}>{option.item}</Option>
        ))}
      </Select>
    </>
  );
};
const SelectCheckboxComponent: React.FC<SelectCheckboxProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
}) => {
  const { Option } = Select;

  const onSelectChange = (value: string[]) => {
    let items = template.attribute.items;
    let test: any[] = [];
    const res = items.map((item: any, idx: number) => {
      let check = "N";

      for (let i = 0; i < value.length; i++) {
        const _value = value[i];

        if (_value === item.item) {
          check = "Y";
          test.push(item.item);
        }
      }
      return check;
    });

    // for (let i = 0; i < res.length; i++) {
    //   const _res = res[i];
    //   if (_res === "Y") {
    //     _value.push(i);
    //   }
    // }
    onChange(
      {
        item: res,
        value: test.toString(),
      },
      "cb"
    );
  };

  const formatValue = (value: any) => {
    let items = template.attribute.items;
    let _res: any[] = [];
    const mock = [
      {
        value: null,
        item: ["Y", "N", "Y", "Y", "Y", "N"],
      },
    ];

    if (value && value.item) {
      for (let i = 0; i < items.length; i++) {
        const item: any = items[i];

        if (value?.item[i] === "Y") {
          _res.push(item.item);
        } else {
        }
      }

      return _res;
    }

    return [];
  };
  return (
    <>
      <Select
        // ref={ref}
        size={"large"}
        showSearch
        value={formatValue(value)}
        placeholder={template.attribute.description}
        optionFilterProp="children"
        onChange={onSelectChange}
        filterOption={(input, option) => {
          console.log({ option });
          return (option!.children! as unknown as string)
            .toLowerCase()
            .includes(input.toLowerCase());
        }}
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
        status={status}
        mode="tags"
      >
        {template.attribute.items.map((option: any) => (
          <Option value={option.item}>{option.item}</Option>
        ))}
      </Select>
    </>
  );
};

export const SelectCheckboxControlComponent: React.FC<InputProps> = ({
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
              <SelectCheckboxComponent
                {...{ canEditDoc, checkActionPage }}
                template={template}
                onChange={onChange}
                value={value}
                status={
                  isSubmitted &&
                  ((errors?.items &&
                    errors?.items[rowIdx] &&
                    errors?.items[rowIdx].layout[colIdx]) ||
                    (value?.item?.every((_value: string) => _value === "N") &&
                      template.attribute.require === "Y" &&
                      buttonType !== "draft")) &&
                  "error"
                }
              />

              {isSubmitted &&
                ((errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx]) ||
                  (value?.item?.every((_value: string) => _value === "N") &&
                    template.attribute.require === "Y" &&
                    buttonType !== "draft")) && (
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

export const SelectCheckboxTableComponent: React.FC<TableInputProps> = ({
  name,
  template,
  saveFunc,
  inputRef,
  isEditing,
  onEdit,
  children,
  canEditDoc,
  checkActionPage,
  ...props
}) => {
  if (!isEditing) {
    return (
      <div style={{ paddingRight: 24 }} onMouseOver={onEdit}>
        <SelectCheckboxInTableComponent
          {...{ canEditDoc, checkActionPage }}
          ref={inputRef}
          value={children[1]}
          template={template}
          onChange={saveFunc}
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
              template.attribute.require === "Y" && checkActionPage === "edit"
                ? true
                : false,
            message: `${template.label} is required.`,
          },
        ]}
      >
        <SelectCheckboxInTableComponent
          {...{ canEditDoc, checkActionPage }}
          ref={inputRef}
          template={template}
          onChange={saveFunc}
        />
      </Form.Item>
    </>
  );
};
