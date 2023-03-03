import { Checkbox, Form } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import React from "react";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { TableInputProps } from "../TableComponent/TableComponent";

type InputProps = {
  template: any;
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

type CheckboxProps = {
  ref?: any;
  template: any;
  value?: any;
  status?: any;
  onChange: (value: any) => void;
  canEditDoc: boolean;
  checkActionPage: string;
};
export const CheckboxInTableComponent: React.FC<CheckboxProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
}) => {
  const onSelectChange = (
    checkedValues: CheckboxValueType[],
    _onChange: any
  ) => {
    let items = template.attribute.items;
    let test: any[] = [];
    const res = items.map((item: any, idx: number) => {
      let check = "N";

      for (let i = 0; i < checkedValues.length; i++) {
        const _value = checkedValues[i];

        if (_value === item.item) {
          check = "Y";
          test.push(item.item);
        }
      }
      return check;
    });

    // console.log({ resresres: res });
    // for (let i = 0; i < res.length; i++) {
    //   const _res = res[i];
    //   if (_res === "Y") {
    //     _value.push(i);
    //   }
    // }
    // console.log({
    //   resresres: {
    //     item: res,
    //     value: _value.toString(),
    //   },
    // });

    _onChange(test.toString(), "cb");
    // _onChange(res);
  };

  const formatOptions = (options: { item: string; chcked: string }[]) => {
    const _options = options.map(
      (option: { item: string; chcked: string }) => option.item
    );

    return _options;
  };
  const formatValue = (value: any) => {
    let items = template.attribute.items;
    let _res: any[] = [];
    // console.log({ value, _res, template });

    if (value && value.length > 0) {
      const _values = value.split(",");
      for (let i = 0; i < items.length; i++) {
        const item: any = items[i];
        for (let j = 0; j < _values.length; j++) {
          const _value = _values[j];
          if (_value === item.item) {
          }
        }
        // if (_value[i] === "Y") {
        //   _res.push(item.item);
        // } else {
        // }
      }

      return _values;
    }

    return [];
  };
  return (
    <>
      <Checkbox.Group
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
        className={`${status ? "checkbox-invalid" : ""} ${
          template.attribute.multipleLine === "N"
            ? "checkbox-group-container"
            : ""
        }`}
        options={formatOptions(template.attribute.items)}
        onChange={(checkValue) => onSelectChange(checkValue, onChange)}
        value={formatValue(value)}
      />
    </>
  );
};
export const CheckboxComponent: React.FC<CheckboxProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
}) => {
  const onSelectChange = (
    checkedValues: CheckboxValueType[],
    _onChange: any
  ) => {
    let items = template.attribute.items;
    let _values: any[] = [];
    const res = items.map((item: any, idx: number) => {
      let check = "N";

      for (let i = 0; i < checkedValues.length; i++) {
        const _value = checkedValues[i];

        if (_value === item.item) {
          check = "Y";
          _values.push(item.item);
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

    _onChange(
      {
        item: res,
        value: _values.toString(),
      },
      "cb"
    );
    // _onChange(res);
  };

  const formatOptions = (options: { item: string; chcked: string }[]) => {
    const _options = options.map(
      (option: { item: string; chcked: string }) => option.item
    );

    return _options;
  };
  const formatValue = (value: any) => {
    let items = template.attribute.items;
    let _res: any[] = [];

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
      <Checkbox.Group
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
        className={`${status ? "checkbox-invalid" : ""} ${
          template.attribute.multipleLine === "N"
            ? "checkbox-group-container"
            : ""
        }`}
        options={formatOptions(template.attribute.items)}
        onChange={(checkValue) => onSelectChange(checkValue, onChange)}
        value={formatValue(value)}
      />
    </>
  );
};

export const CheckboxControlComponent: React.FC<InputProps> = ({
  colIdx,
  rowIdx,
  control,
  name,
  template,
  col,
  colAction,
  colText,
  canEditDoc,
  buttonType,
  checkActionPage,
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
                ((errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx]) ||
                  (value?.item?.every((_value: string) => _value === "N") &&
                    template.attribute.require === "Y" &&
                    buttonType !== "draft"))
                  ? "set-layout-required"
                  : ""
              }`}
            >
              {/* <Checkbox.Group
                className={
                  isSubmitted &&
                  ((errors?.items &&
                    errors?.items[rowIdx] &&
                    errors?.items[rowIdx].layout[colIdx]) ||
                    value?.every((_value: string) => _value === "N"))
                    ? "checkbox-invalid"
                    : ""
                }
                options={formatOptions(template.attribute.items)}
                onChange={(checkValue) => onSelectChange(checkValue, onChange)}
                value={formatValue(value)}
              /> */}
              <CheckboxComponent
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
                      buttonType !== "draft"))
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

export const CheckboxTableComponent: React.FC<TableInputProps> = ({
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
    // console.log({ children });

    return (
      <div style={{ paddingRight: 24 }} onMouseOver={onEdit}>
        <CheckboxInTableComponent
          {...{ canEditDoc, checkActionPage }}
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
        <CheckboxInTableComponent
          template={template}
          onChange={saveFunc}
          {...{ canEditDoc, checkActionPage }}
        />
      </Form.Item>
    </>
  );
};
