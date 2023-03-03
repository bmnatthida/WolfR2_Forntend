import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";

interface Props {
  control: any;
  errors: any;
  template: any;
  fromRender?: string;
  setValue: any;
}

export default function NumberComponent(props: Props) {
  const [decimal, setDecimal] = useState<any>(
    parseInt(props.template.attribute?.decimal) || 0
  );
  const [readonly, setReadonly] = useState<boolean>(
    props.template.attribute?.readonly === "Y" ? true : false
  );
  const [summary, setSummary] = useState<boolean>(
    props.template.attribute?.summary === "Y" ? true : false
  );
  const [min, setMin] = useState<any>();
  const dataRequest = {
    label: props.template.label,
    alter: props.template.alter,
    require: props.template.attribute?.require === "Y" ? true : false,
    formula: props.template.attribute?.formula || "",
    description: props.template.attribute?.description || "",
    decimal: parseInt(props.template.attribute?.decimal) || 0,
    default: props.template.attribute?.default || "",
    align: props.template.attribute?.align === "l" ? true : false,
    min: parseInt(props.template.attribute?.min) || 0,
    max: parseInt(props.template.attribute?.max) || 0,
    useComma: props.template.attribute?.useComma === "Y" ? true : false,
    symbol: props.template.attribute?.symbol || "",
    symbolPosition:
      props.template.attribute?.symbolPosition === "B" ? true : false,
    summary: props.template.attribute?.summary === "Y" ? true : false,
    readonly: props.template.attribute?.readonly === "Y" ? true : false,
    widthInTable: parseInt(props.template.attribute?.widthInTable) || 0,
    hideInPdf: props.template.attribute?.hideInPdf === "Y" || "" ? true : false,
    isSummary: props.template.attribute?.isSummary === "Y" || "" ? true : false,
  };

  const getFormErrorMessage = (name: any) => {
    return (
      props.errors[name] && (
        <small className="p-error">{props.errors[name].message}</small>
      )
    );
  };
  return (
    <div className="container">
      <div className="row set-margin-in-row-add-control">
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Label</p>
          <span style={{ color: "red" }}>*</span>
          <span className="headtext-form-requestor"> :</span>
        </div>
        <div className="col-sm-10">
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Alt Label: </p>
        </div>
        <div className="col-sm-10">
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Description: </p>
        </div>
        <div className="col-sm-10">
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Default Value: </p>
        </div>
        <div className="col-sm-4">
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Decimal: </p>
        </div>
        <div className="col-sm-4">
          <Controller
            name="decimal"
            control={props.control}
            defaultValue={dataRequest.decimal}
            render={({ field, fieldState }) => (
              <InputNumber
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e.value);
                  setDecimal(e.value);
                }}
                min={0}
                max={10}
                className={`set-input-component-css ${classNames({
                  "p-invalid": fieldState.invalid,
                })}`}
              />
            )}
          />
        </div>
      </div>
      {props.fromRender !== "table" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-sm-2 set-layout-text-input-2-input">
            <p className="headtext-form-requestor">Formula: </p>
          </div>
          <div className="col-sm-10">
            <Controller
              name="formula"
              defaultValue={dataRequest.formula}
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
            <p className="set-font-size">
              Operators for use : Addition (+), Subtraction (-), Multiplication
              (*), Division (/), Function sum() Ex. : Column Label 1*Column
              Label 2, sum(Table Label;Column Label) *sum() Function can only
              put 1 column label.
            </p>
          </div>
        </div>
      )}

      <div className="row set-margin-in-row-add-control">
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Min: </p>
        </div>
        <div className="col-sm-4">
          <Controller
            name="min"
            control={props.control}
            defaultValue={dataRequest.min}
            render={({ field, fieldState }) => (
              <InputNumber
                inputId="min"
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e.value);
                  setMin(e.value);
                }}
                mode="decimal"
                minFractionDigits={decimal === undefined ? 2 : decimal}
                className={`set-input-component-css ${classNames({
                  "p-invalid": fieldState.invalid,
                })}`}
              />
            )}
          />
        </div>
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Max: </p>
        </div>
        <div className="col-sm-4">
          <Controller
            name="max"
            control={props.control}
            defaultValue={dataRequest.max}
            render={({ field, fieldState }) => (
              <InputNumber
                inputId="max"
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                mode="decimal"
                min={min}
                minFractionDigits={decimal === undefined ? 2 : decimal}
                className={`set-input-component-css ${classNames({
                  "p-invalid": fieldState.invalid,
                })}`}
              />
            )}
          />
        </div>
      </div>

      <div className="row set-margin-in-row-add-control">
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Value Align Left : </p>
        </div>
        <div className="col-sm-10">
          <Controller
            name="align"
            control={props.control}
            defaultValue={dataRequest.align}
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Symbol: </p>
        </div>
        <div className="col-sm-4">
          <Controller
            name="symbolNumber"
            defaultValue={dataRequest.symbol}
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Symbol Left: </p>
        </div>
        <div className="col-sm-4 set-layout-css-sm">
          <Controller
            name="symbolPosition"
            control={props.control}
            defaultValue={dataRequest.symbolPosition}
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Summary: </p>
        </div>
        <div className="col-sm-10">
          <Controller
            name="summary"
            control={props.control}
            defaultValue={dataRequest.summary}
            render={({ field, fieldState }) => (
              <div className={"set-layout-check-box-create-control"}>
                <>
                  <Checkbox
                    className="set-css-checkbox-in-create-control"
                    inputId={field.name}
                    onChange={(e) => {
                      field.onChange(e.checked);
                      setSummary(e.checked);
                      // if (field) {
                      // setReadonly(true);
                      // props.setValue("readonly", true);
                      // }
                    }}
                    checked={summary}
                  />
                  <span className="set-text-check-box-create-control">Yes</span>
                </>
              </div>
            )}
          />
        </div>
      </div>
      <div className="row set-margin-in-row-add-control">
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Comma: </p>
        </div>
        <div className="col-sm-10">
          <Controller
            name="useComma"
            control={props.control}
            defaultValue={dataRequest.useComma}
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Required: </p>
        </div>
        <div className="col-sm-10">
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
        <div className="col-sm-2 set-layout-text-input">
          <p className="headtext-form-requestor">Readonly: </p>
        </div>
        <div className="col-sm-10">
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
                      // if (!summary) {}
                      field.onChange(e.checked);

                      setReadonly(e.checked);
                    }}
                    checked={readonly}
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
      {props.fromRender === "table" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">ShowTotal In Table: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="isSummary"
              control={props.control}
              defaultValue={dataRequest.isSummary}
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
