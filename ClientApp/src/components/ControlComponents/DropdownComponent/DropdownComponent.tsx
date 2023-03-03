import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Col, Row } from "react-bootstrap";
import "./DropdownComponent.css";
import { Controller } from "react-hook-form";
interface Props {
  template: any;
  name: string;
  control: any;
  data: any;
  ss?: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: boolean;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: any;
}
export default function DropdownComponent(props: Props) {
  const [selectedItems, setSelectedItems] = useState<any>();
  const [dataRequest, setDataRequest] = useState<any>();
  const [items, setItems] = useState<any>();
  // useEffect(() => {
  //   defaultValue();
  //   console.log();

  // }, []);
  useEffect(() => {
    defaultValue();
  }, [props.data.value]);
  useEffect(() => {
    // var responseData: any = props.template.attribute.items;
    // if (props.data.value !== "" || props.data.value !== undefined) {
    //   var defaultData = props.data.value;
    //   // let check = false;
    //   for (const index in responseData) {
    //     if (responseData[index]?.item === defaultData) {
    //       // check = true;
    //       setSelectedItems(props.template.attribute.items[index]);
    //       setDataRequest(props.template.attribute.items[index]);
    //     }
    //   }
    //   // if (check === false) {
    //   //   setSelectedItems(defaultData);
    //   // }
    // }
  }, [props.template.attribute.items]);
  useEffect(() => {
    if (selectedItems !== undefined) {
      // props.onChangeEditForm(
      //   { value: selectedItems?.item },
      //   props.rowIdx,
      //   props.colIdx
      // );
    }
  }, [selectedItems]);
  useEffect(() => {
    if (props.ss !== undefined) {
      if (props.ss.length > 0) {
        setItems([...props.ss]);
      }
    }
  }, [props.ss]);
  function defaultValue() {
    var responseData: any = props.template.attribute.items;
    if (!props.data.value) {
      setSelectedItems(props.template.attribute.items[0]);
      setDataRequest(props.template.attribute.items[0]);
    } else {
      var defaultData = props.data.value;
      // let check = false;
      for (const index in responseData) {
        if (responseData[index]?.item === defaultData) {
          // check = true;
          setSelectedItems(props.template.attribute.items[index]);
          setDataRequest(props.template.attribute.items[index]);
        }
      }
      // if (check === false) {
      //   setSelectedItems(defaultData);
      // }
    }
  }

  function setSelectedValue(e: any) {
    setSelectedItems(e.value);
  }

  return (
    <Controller
      render={({
        field: { onChange, onBlur, value, name, ref },
        formState: { errors, isSubmitted },
      }) => (
        <>
          {!props.renderInTable && (
            <Col
              sm={props.col === undefined ? 12 : undefined}
              md={props.col === undefined ? props.colText : undefined}
              xs={props.col === undefined ? 12 : undefined}
              className={
                props.renderInTable === undefined ? "padding-controller" : ""
              }
            >
              <tr>
                <th>
                  <div className="label-text-container">
                    <span className="headtext-form">
                      {props.template.label}
                    </span>
                    {props.template.attribute.require === "Y" && (
                      <span className="headtext-form text-Is-require">*</span>
                    )}
                  </div>
                  <p className="subtext-form">{props.template.alter}</p>
                </th>
              </tr>
            </Col>
          )}

          <Col
            sm={props.col === undefined ? 12 : 12}
            md={props.col === undefined ? props.colAction : 12}
            xs={props.col === undefined ? 12 : 12}
            className={
              props.renderInTable === undefined ? "padding-controller" : ""
            }
          >
            <>
              <Dropdown
                id={`${props.template.label}`}
                className={`set-width-input-dd setdropdown-control ${
                  isSubmitted &&
                  errors?.items &&
                  errors?.items[props.rowIdx] &&
                  errors?.items[props.rowIdx].layout[props.colIdx]
                    ? "set-layout-required-dropdown"
                    : ""
                }`}
                placeholder={"--select--"}
                value={{
                  item: props.data.value,
                  checked: "N",
                }}
                options={props.template.attribute.items}
                disabled={
                  props.template.readonly === "Y" || props.statusMemoDetail
                    ? true
                    : false
                }
                onChange={(e) => onChange(e.value.item)}
                style={{ height: "38px" }}
                optionLabel="item"
                filter
                filterBy="item"
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
            </>
          </Col>
        </>
      )}
      name={props.name}
      control={props.control}
      rules={{
        required: props.template.attribute.require === "Y" ? true : false,
      }}
    />
  );
}
