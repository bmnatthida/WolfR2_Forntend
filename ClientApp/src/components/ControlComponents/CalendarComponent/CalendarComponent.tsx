import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import "./calendar_Custom.css";

import { Col } from "react-bootstrap";


interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: boolean;
  layoutLength?: number;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: boolean;
  genAutoNum?: () => void;
  name: string;
  control: any;
}

export default function CalendarComponent(props: Props) {
  let yy = new Date().getFullYear();
  let yearMin = yy - 20;
  let yearMax = yy + 20;


  function formatNewDate(date: Date) {
    return moment(date).format(
      "DD" +
        (props.template.attribute.date.symbol !== ""
          ? props.template.attribute.date.symbol
          : "/") +
        "MMM" +
        (props.template.attribute.date.symbol !== ""
          ? props.template.attribute.date.symbol
          : "/") +
        "YYYY"
    );
  }


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
      props.template.attribute.date.symbol !== ""
        ? props.template.attribute.date.symbol
        : "/"
    );
  }


  const getDate = () => {
    try {
      let newDate: Date = new Date();
      console.log(props.template);

      if (props.data.value !== "") {
        if (
          props.data.value !== null &&
          props.data.value.toLowerCase() !== "invalid date"
        ) {
          newDate = moment(
            moment(new Date(props.data.value)).format("DD MMM YYYY"),
            "DD MMM YYYY"
          ).toDate();

          if (newDate.toString().toLowerCase() === "invalid date") {
            newDate = moment(
              formatDate(props.data.value),
              "DD MMM YYYY"
            ).toDate();
          } else {
            newDate = moment(
              moment(formatDate(props.data.value)).format("DD MMM YYYY"),
              "DD MMM YYYY"
            ).toDate();
            if (newDate.toString().toLowerCase() === "invalid date") {
              console.log("cal=>props.data.value", props.data.value);
            }
          }
        } else {
          props.onChangeEditForm(
            { value: formatNewDate(newDate) },
            props.rowIdx,
            props.colIdx
          );

        }
        return newDate;
      } else {
        return undefined;
      }

    } catch (error) {
      console.log("cal=>error " + props.template.label, error);
    }
  };

  const onDateChance = (e: any) => {
    if (!props.statusMemoDetail) {
      props.onChangeEditForm(
        { value: formatNewDate(e.value) },
        props.rowIdx,
        props.colIdx
      );
    }
  };


  const monthNavigatorTemplate = (e: any) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={(event: any) => e.onChange(event.originalEvent, event.value)}
        style={{ lineHeight: 1 }}
      />
    );
  };

  const yearNavigatorTemplate = (e: any) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={(event: any) => e.onChange(event.originalEvent, event.value)}
        className="p-ml-2"
        style={{ lineHeight: 1 }}
      />
    );
  };

  return (

    <>
      <Col
        sm={props.col === undefined ? 12 : undefined}
        md={props.col === undefined ? props.colText : undefined}
        xs={props.col === undefined ? 12 : undefined}
        xl={props.col === undefined ? props.colText : undefined}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        {props.renderInTable != "renderInTable" && (
          <tr>
            <th>
              <p className="row headtext-form-requestor">
                {props.template.label}
              </p>
              <p className="row subtext-form-requestor">
                {props.template.alter}
              </p>
            </th>
          </tr>
        )}
      </Col>
      <Col
        sm={props.col === undefined ? 12 : 12}
        md={props.col === undefined ? props.colAction : 12}
        xs={props.col === undefined ? 12 : 12}
        xl={props.col === undefined ? props.colAction : 12}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        <Calendar
          value={getDate()}
          onChange={onDateChance}
          dateFormat={
            "dd" +
            (props.template.attribute.date.symbol !== ""
              ? props.template.attribute.date.symbol
              : "/") +
            "M" +
            (props.template.attribute.date.symbol !== ""
              ? props.template.attribute.date.symbol
              : "/") +
            "yy"
          }
          className="calendar-border-radius"
          style={{ width: "100%", height: "38px" }}
          panelStyle={{ borderRadius: "6px" }}
          todayButtonClassName="background-calendar"
          keepInvalid
          showIcon={true}
          monthNavigator
          yearNavigator
          yearRange={yearMin + ":" + yearMax}
          monthNavigatorTemplate={monthNavigatorTemplate}
          yearNavigatorTemplate={yearNavigatorTemplate}
          required={props.template.attribute.require === "Y"}
          readOnlyInput
          hideOnDateTimeSelect
          showButtonBar
          onClearButtonClick={() => {
            props.onChangeEditForm({ value: "" }, props.rowIdx, props.colIdx);
          }}
          disabled={
            props.statusMemoDetail || props.template.attribute.readonly === "Y"
          }
        />
      </Col>
    </>

  );
}
