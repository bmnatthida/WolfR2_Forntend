import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { UploadFileRenderControl } from "../../../Services/UploadFileService";
import { Image } from "antd";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { RiDeleteBack2Line, RiDeleteBin2Line } from "react-icons/ri";
import "./ImageComponents.css";
import { CgCloseR } from "react-icons/cg";
interface Props {
  control: any;
  errors: any;
  template: any;
  userData: any;
  uploadFileState: any;
  setUploadFileState: any;
}
export default function ImageComponents(props: Props) {
  const [widthControl, setWidthControl] = useState<any>();
  const [heightControl, setHeightControl] = useState<any>();
  const ref = useRef<any>();
  const toast = useRef<any>(null);
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    fileTypeImage: props.template.fileType || "*jpg*jpeg*png*bmp",
    maxFile: parseInt(props.template.attribute?.maxFile) || 50,
    width: parseInt(props.template.attribute?.width) || 310,
    height: parseInt(props.template.attribute?.height) || 190,
    require: props.template.attribute?.require === "Y" || "" ? true : false,
    readonly: props.template.attribute?.readonly === "Y" || "" ? true : false,
  };
  const onFileSelect = async (e: any) => {
    if (e.target.files[0] !== null) {
      const files = e.target.files[0];
      const formData = new FormData();
      var guid = "imageControl" + generateQuickGuid();
      formData.append("files", files);
      formData.append("docSet", guid);
      formData.append("actorID", props.userData.employeeData.EmployeeId);
      var response = await UploadFileRenderControl(formData);
      props.setUploadFileState(response.data.pathUrl);
      ref.current.value = null;
    }
  };
  useEffect(() => {
    setWidthControl(dataRequest.width);
    setHeightControl(dataRequest.height);
  }, []);

  return (
    <>
      <Toast ref={toast}></Toast>
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
          <div className="col-md-2 set-layout-text-input-2-input">
            <p className="headtext-form-requestor">File Type: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="fileTypeImage"
              control={props.control}
              defaultValue={dataRequest.fileTypeImage}
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
            <p className="set-font-size">File Type Format : *png*jpeg</p>
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Max File Size: </p>
          </div>
          <div className="col-md-10">
            <div className="p-inputgroup set-height-input">
              <Controller
                name="maxFile"
                control={props.control}
                defaultValue={dataRequest.maxFile}
                render={({ field, fieldState }) => (
                  <InputNumber
                    inputId="minmax"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    min={0}
                    max={100}
                    className={`set-input-component-css ${classNames({
                      "p-invalid": fieldState.invalid,
                    })}`}
                  />
                )}
              />
              <span className="p-inputgroup-addon set-font-pixel">MB</span>
            </div>
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input-2-input">
            <p className="headtext-form-requestor">Width: </p>
          </div>
          <div className="col-md-4">
            <div className="p-inputgroup set-height-input">
              <Controller
                name="width"
                control={props.control}
                defaultValue={dataRequest.width}
                render={({ field, fieldState }) => (
                  <InputNumber
                    inputId="width"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    onChange={(e: any) => {
                      setWidthControl(e.value);
                      if (e.value >= 300) {
                        setWidthControl(300);
                      }
                    }}
                    min={0}
                    max={400}
                    className={`set-input-component-css ${classNames({
                      "p-invalid": fieldState.invalid,
                    })}`}
                  />
                )}
              />
            </div>
            <p className="set-font-size">Maximum of 400</p>
          </div>
          <div className="col-md-2 set-layout-text-input-2-input">
            <p className="headtext-form-requestor">Height: </p>
          </div>
          <div className="col-md-4">
            <div className="p-inputgroup set-height-input">
              <Controller
                name="height"
                control={props.control}
                defaultValue={dataRequest.height}
                render={({ field, fieldState }) => (
                  <InputNumber
                    inputId="height"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    onChange={(e: any) => {
                      setHeightControl(e.value);
                      if (e.value >= 300) {
                        setHeightControl(300);
                      }
                    }}
                    min={0}
                    max={400}
                    className={`set-input-component-css ${classNames({
                      "p-invalid": fieldState.invalid,
                    })}`}
                  />
                )}
              />
            </div>
            <p className="set-font-size">Maximum of 400</p>
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
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Default Value: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="defaultValueImage"
              control={props.control}
              defaultValue={dataRequest.alter}
              render={({ field, fieldState }) => (
                <Form.Control
                  type="file"
                  ref={ref}
                  onChange={(e: any) => {
                    onFileSelect(e);
                  }}
                  accept=".jpg, .jpeg, .png,"
                  className={`set-input-component-css form-control ${classNames(
                    {
                      "p-invalid": fieldState.invalid,
                    }
                  )}`}
                />
              )}
            />
          </div>
        </div>
        {props.uploadFileState && (
          <div className="row set-margin-in-row-add-control">
            <div className="col-md-2"></div>
            <div
              className="col-md-10"
              style={{ display: "flex", position: "relative" }}
            >
              <div style={{ position: "relative" }}>
                <div>
                  <Image
                    src={
                      props.userData.SharepointSiteURL
                        ? `${props.userData.SharepointSiteURL}${props.uploadFileState}`
                        : `https://${props.userData.TinyURL}${props.uploadFileState}`
                    }
                    alt="Image"
                    width={widthControl}
                    height={heightControl}
                    preview
                  />
                </div>
                <div className="set-layout-icon-css ">
                  <CgCloseR
                    style={{ fontSize: "23px" }}
                    className="set-pointer-icon-image"
                    onClick={() => {
                      props.setUploadFileState(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
