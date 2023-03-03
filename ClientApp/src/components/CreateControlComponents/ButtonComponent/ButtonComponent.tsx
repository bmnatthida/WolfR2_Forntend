import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { AddQueryComponent } from "./AddQueryComponent";

interface Props {
  control: any;
  errors: any;
  template: any;
  advanceForm: any;
  setAdvanceForm: any;
  attributeButton: any;
  setAttributeButton: any;
}

export default function ButtonComponent(props: Props) {
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    url: props.template.URL,
  };
  const [viewModal, setViewModal] = useState<boolean>(false);
  function deleteAttributeButton(idx: any) {
    let _items = props.attributeButton.items;
    _items.splice(idx, 1);
    props.setAttributeButton((prevState: any) => ({
      ...prevState,
      items: [..._items],
    }));
  }

  return (
    <>
      <div className="container">
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Label</p>
            <span style={{ color: "red" }}>*</span>
            <span className="headtext-form-requestor"> :</span>
          </div>
          <div className="col-md-10">
            <Controller
              name="label"
              control={props.control}
              defaultValue={dataRequest.label}
              rules={{ required: "label is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  autoFocus
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Text Button</p>
            <span style={{ color: "red" }}>*</span>
            <span className="headtext-form-requestor"> :</span>
          </div>
          <div className="col-md-10">
            <Controller
              name="textButton"
              control={props.control}
              rules={{ required: "textButton is required." }}
              defaultValue={dataRequest.alter}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">URL</p>
            <span style={{ color: "red" }}>*</span>
            <span className="headtext-form-requestor"> :</span>
          </div>
          <div className="col-md-10">
            <Controller
              name="url"
              control={props.control}
              defaultValue={dataRequest.url}
              rules={{ required: "url is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">QueryString : </p>
          </div>
          <div className="col-md-10">
            <button
              onClick={() => {
                setViewModal(true);
              }}
              type="button"
              className="set-color-css-button-add-column hover-color-css-282f6a"
            >
              <HiPlus /> Add Query
            </button>
          </div>
        </div>
        <div>
          <table className="table-layout-create-control">
            <thead className="thead-light">
              <tr className="set-bg-color-table-create-control">
                <th style={{ width: "45%" }}>
                  <p className="row headtext">Parameter</p>
                  <p className="row subtext">ตัวแปร</p>
                </th>
                <th style={{ width: "45%" }}>
                  <p className="row headtext">Control</p>
                  <p className="row subtext">คอนโทรล</p>
                </th>
                <th style={{ width: "10%" }}>
                  <p className="row headtext">Delete</p>
                  <p className="row subtext">ลบ</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.attributeButton.items.map((_data: any, idx: any) => {
                return (
                  <>
                    {_data.layout.map((_data2: any, idx2: any) => {
                      return (
                        <>
                          <tr>
                            <td>{_data.layout[idx2]?.paramiter?.value}</td>
                            <td>{_data.layout[idx2]?.control?.label}</td>
                            <td>
                              <BsTrash
                                className="set-css-pointer-css-atn"
                                onClick={() => {
                                  deleteAttributeButton(idx);
                                }}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {viewModal && (
        <AddQueryComponent
          viewModal={viewModal}
          setViewModal={setViewModal}
          setAttributeButton={props.setAttributeButton}
          attributeButton={props.attributeButton}
        />
      )}
    </>
  );
}
