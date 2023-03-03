import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import ".././CreateControlComponents.css";
import TemplateModal from "./TemplateModal";
interface Props {
  control: any;
  errors: any;
  template: any;

  data: any;
  setRichText: any;
}

export default function EditorComponent(props: Props) {
  useEffect(() => {
    console.log(props.template, "props.template.attribute?.height");
  }, []);

  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    description: props.template?.description,
    height: parseInt(props.template?.height) || 400,
    require: props.template.attribute?.require === "Y" ? true : false,
    readonly: props.template.attribute?.readonly === "Y" ? true : false,
  };
  const [viewModal, setViewModal] = useState<boolean>(false);
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
            <p className="headtext-form-requestor">Height: </p>
          </div>
          <div className="col-md-10">
            <div className="p-inputgroup set-height-input">
              <Controller
                name="height"
                control={props.control}
                defaultValue={dataRequest.height}
                render={({ field, fieldState }) => (
                  <InputNumber
                    id={field.name}
                    value={field.value}
                    min={0}
                    onValueChange={(e) => field.onChange(e.value)}
                    className={`set-input-component-css ${classNames({
                      "p-invalid": fieldState.invalid,
                    })}`}
                  />
                )}
              />
              <span className="p-inputgroup-addon set-font-pixel">Pixel</span>
            </div>
          </div>
        </div>

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
                    <span className="set-text-check-box-create-control">
                      Yes
                    </span>
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
                    <span className="set-text-check-box-create-control">
                      Yes
                    </span>
                  </>
                </div>
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-4 set-letout-buton-template">
            <button
              onClick={() => {
                setViewModal(true);
              }}
              type="button"
              className="set-color-css-button-template hover-color-css-282f6a"
            >
              <IoDocumentTextOutline /> Template
            </button>
          </div>
          <div className="col-md-8"></div>
        </div>
      </div>
      <TemplateModal
        setViewModal={setViewModal}
        viewModal={viewModal}
        data={props.data}
        setRichText={props.setRichText}
      ></TemplateModal>
    </>
  );
}
