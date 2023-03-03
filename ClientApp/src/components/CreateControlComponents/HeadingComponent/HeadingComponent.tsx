import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { Controller } from "react-hook-form";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import ".././CreateControlComponents.css";
interface Props {
  requestData: (templates: any, itemIdx: number, layoutIdx: number) => void;
  control: any;
  errors: any;
  template: any;
  selected: any;
  setCheckBoxHeading: any;
  checkBoxHeading: any;
  displayCheckBox: any;
}
export default function HeadingComponent(props: Props) {
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    istext: props.template.istext === "Y" || "" ? true : false,
    textvalue: props.template.textvalue || "",
  };

  return (
    <div className="container">
      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Display: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="display"
            defaultValue={props.checkBoxHeading}
            control={props.control}
            render={({ field, fieldState }) => (
              <div className={"set-layout-check-box-create-control"}>
                <>
                  {props.displayCheckBox.map((items: any, idex: number) => {
                    return (
                      <>
                        <RadioButton
                          value={items}
                          style={{ width: "1.1rem" }}
                          name="name"
                          onChange={(e: any) => {
                            props.setCheckBoxHeading(e.value);
                            field.onChange(e.value);
                            console.log(e.value, "sss");
                          }}
                          checked={props.checkBoxHeading.name === items.name}
                        />
                        <label
                          className="set-text-check-box-create-control"
                          htmlFor={items.name}
                        >
                          {items.name}
                        </label>
                      </>
                    );
                  })}
                </>
              </div>
            )}
          />
        </div>
      </div>
      {/* <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Label :</p>
        </div>
        <div className="col-md-10">
          <Controller
            name="labelHeading"
            control={props.control}
            defaultValue={dataRequest.label}
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
      </div> */}
      {props.checkBoxHeading.code === "N" && (
        <>
          <div className="row set-margin-in-row-add-control">
            <div className="col-md-2 set-layout-text-input">
              <p className="headtext-form-requestor">Label :</p>
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className="col-md-10">
              <Controller
                name="labelHeading"
                control={props.control}
                defaultValue={dataRequest.label}
                rules={{ required: "label is required." }}
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
              <p className="headtext-form-requestor">Alt Label: </p>
            </div>
            <div className="col-md-10">
              <Controller
                name="alter"
                defaultValue={dataRequest.alter}
                control={props.control}
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
        </>
      )}
      {props.checkBoxHeading.code === "Y" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input-2-input">
            <p className="headtext-form-requestor">Text Value </p>
            <span style={{ color: "red" }}>*</span>
            <span className="headtext-form-requestor"> :</span>
          </div>
          <div className="col-md-10">
            <Controller
              name="textvalue"
              defaultValue={dataRequest.textvalue}
              control={props.control}
              rules={{ required: "Text Value is required." }}
              render={({ field, fieldState }) => (
                <InputTextarea
                  rows={6}
                  cols={30}
                  id={field.name}
                  {...field}
                  className={`set-width-in-add-control ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
