import React, { useEffect } from "react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { Col, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { RangePickerProps } from "antd/lib/date-picker";
import { TableInputProps } from "../TableComponent/TableComponent";
import { getDateFormat } from "../../../Helper/FormatDateTime";
import { Form, Input } from "antd";
import { Store } from "antd/lib/form/interface";
import { IDateTemplate } from "../../../IRequestModel/ITemplateDescModel";

type InputDateProps = {
  ref?: any;
  template: IDateTemplate;
  value?: any;
  status?: any;
  onChange: (value: any) => void;
  canEditDoc: boolean;
  checkActionPage: string;
};

type IDateControlProps = {
  template: IDateTemplate;
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
};

const DateInputComponent: React.FC<InputDateProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  canEditDoc,
  checkActionPage,
  ...props
}) => {
  function formatDate(date: string) {
    let arrDate = date.split("/");

    const mm = Number(arrDate[1]);
    if (mm === 1) {
      arrDate[1] = "Jan";
    } else if (mm === 2) {
      arrDate[1] = "Feb";
    } else if (mm === 3) {
      arrDate[1] = "Mar";
    } else if (mm === 4) {
      arrDate[1] = "Apr";
    } else if (mm === 5) {
      arrDate[1] = "May";
    } else if (mm === 6) {
      arrDate[1] = "Jun";
    } else if (mm === 7) {
      arrDate[1] = "Jul";
    } else if (mm === 8) {
      arrDate[1] = "Aug";
    } else if (mm === 9) {
      arrDate[1] = "Sep";
    } else if (mm === 10) {
      arrDate[1] = "Oct";
    } else if (mm === 11) {
      arrDate[1] = "Nov";
    } else if (mm === 12) {
      arrDate[1] = "Dec";
    }
    return arrDate.join(
      template.attribute.date.symbol !== ""
        ? template.attribute.date.symbol
        : "/"
    );
  }
  const getDateValue = (dateValue: any) => {
    // let newDate: Date = new Date();
    let newDate = moment(
      moment(new Date(dateValue)).format("DD MMM YYYY"),
      "DD MMM YYYY"
    ).toDate();

    if (newDate.toString().toLowerCase() === "invalid date") {
      newDate = moment(formatDate(dateValue), "DD MMM YYYY").toDate();
    } else {
      newDate = moment(
        moment(formatDate(dateValue)).format("DD MMM YYYY"),
        "DD MMM YYYY"
      ).toDate();
      if (newDate.toString().toLowerCase() === "invalid date") {
        console.log("cal=>props.data.value", dateValue);
      }
    }
    // return newDate;
    return moment(
      new Date(newDate).toLocaleString("en-UK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      getDateFormat(template.attribute)
    );
  };
  return (
    <>
      <DatePicker
        disabled={!canEditDoc || template.attribute.readonly === "Y"}
        ref={ref}
        id={template.label}
        size={"large"}
        // onClick={() => console.log("Date",template)}
        value={value && getDateValue(value)}
        format={getDateFormat(template.attribute)}
        showTime={
          template.attribute.time.use === "Y"
            ? { defaultValue: moment("00:00:00", "HH:mm:ss") }
            : false
        }
        onChange={(value) => {
          console.log(
            "cal=>value",
            value?.format(getDateFormat(template.attribute))
          );

          onChange(
            value ? value?.format(getDateFormat(template.attribute)) : ""
          );
        }}
        status={status}
        inputReadOnly
      />
    </>
  );
};
// this one row col index 
export const DatePickerControlComponent: React.FC<IDateControlProps> = ({
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
              <DateInputComponent
                {...{ canEditDoc, checkActionPage }}
                template={template}
                value={value}
                status={
                  isSubmitted &&
                  errors?.items &&
                  errors?.items[rowIdx] &&
                  errors?.items[rowIdx].layout[colIdx] &&
                  "error"
                }
                onChange={onChange}
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

export const DatePickerTableComponent: React.FC<TableInputProps> = ({
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
  if (!isEditing) {
    return (
      <div onMouseOver={onEdit}>
        <DateInputComponent
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
        // normalize={(value: any, prevValue: any, allValues: Store) => {
        //   if (value !== "" && value !== undefined) {
        //     return moment(value, getDateFormat(template.attribute));
        //   } else {
        //     return null;
        //   }
        // }}
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
        <DateInputComponent
          {...{ canEditDoc, checkActionPage }}
          ref={inputRef}
          template={template}
          onChange={(e: any) => {
            saveFunc(template.type, template.type);
          }}
        />
      </Form.Item>
    </>
  );
};
