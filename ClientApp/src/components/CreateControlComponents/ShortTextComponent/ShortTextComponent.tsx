import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { InputNumber } from "primereact/inputnumber";
interface Props {
  control: any;
  errors: any;
  template: any;
  fromRender?: any;
}

export default function ShortTextComponent(props: Props) {
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    description: props.template.attribute?.description || "",
    default: props.template.attribute?.default || "",
    length: parseInt(props.template.attribute?.length) || 0,
    require: props.template.attribute?.require === "Y" || "" ? true : false,
    readonly: props.template.attribute?.readonly === "Y" || "" ? true : false,
    widthInTable: parseInt(props.template.attribute?.widthInTable) || 0,
    hideInPdf: props.template.attribute?.hideInPdf === "Y" || "" ? true : false,
  };

  return (
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
          <p className="headtext-form-requestor">Alt Label: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="alter"
            control={props.control}
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
          <p className="headtext-form-requestor">Description: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="description"
            control={props.control}
            defaultValue={dataRequest.description}
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
          <p className="headtext-form-requestor">Default Value: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="default"
            defaultValue={dataRequest.default}
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
      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Max Length: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="length"
            control={props.control}
            defaultValue={dataRequest.length}
            render={({ field, fieldState }) => (
              <InputNumber
                inputId="minmax"
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                mode="decimal"
                min={0}
                max={5000}
                className={`set-input-component-css ${classNames({
                  "p-invalid": fieldState.invalid,
                })}`}
              />
            )}
          />
        </div>
      </div>
      {props.fromRender === "table" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Width: </p>
          </div>
          <div className="col-md-10">
            <div className="p-inputgroup set-height-input">
              <Controller
                name="widthInTable"
                control={props.control}
                defaultValue={dataRequest.widthInTable}
                render={({ field, fieldState }) => (
                  <InputNumber
                    inputId="minmax"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="decimal"
                    min={0}
                    max={100}
                    className={`set-input-component-css ${classNames({
                      "p-invalid": fieldState.invalid,
                    })}`}
                  />
                )}
              />
              <span className="p-inputgroup-addon set-font-pixel">%</span>
            </div>
          </div>
        </div>
      )}
      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Required: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="require"
            control={props.control}
            defaultValue={dataRequest.require}
            render={({ field, fieldState }) => (
              <div className={"set-layout-check-box-create-control"}>
                <>
                  <Checkbox
                    className="set-css-checkbox-in-create-control"
                    inputId={field.name}
                    onChange={(e) => {
                      field.onChange(e.checked);
                    }}
                    checked={field.value}
                  />
                  <span className="set-text-check-box-create-control">Yes</span>
                </>
              </div>
            )}
          />
        </div>
      </div>
      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Readonly: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="readonly"
            control={props.control}
            defaultValue={dataRequest.readonly}
            render={({ field, fieldState }) => (
              <div className={"set-layout-check-box-create-control"}>
                <>
                  <Checkbox
                    className="set-css-checkbox-in-create-control"
                    inputId={field.name}
                    onChange={(e) => {
                      field.onChange(e.checked);
                    }}
                    checked={field.value}
                  />
                  <span className="set-text-check-box-create-control">Yes</span>
                </>
              </div>
            )}
          />
        </div>
      </div>
      {props.fromRender === "table" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">HideInPdf: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="hideInPdf"
              control={props.control}
              defaultValue={dataRequest.hideInPdf}
              render={({ field, fieldState }) => (
                <div className={"set-layout-check-box-create-control"}>
                  <>
                    <Checkbox
                      className="set-css-checkbox-in-create-control"
                      inputId={field.name}
                      onChange={(e) => {
                        field.onChange(e.checked);
                      }}
                      checked={field.value}
                    />
                    <span className="set-text-check-box-create-control">
                      Yes
                    </span>
                  </>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
