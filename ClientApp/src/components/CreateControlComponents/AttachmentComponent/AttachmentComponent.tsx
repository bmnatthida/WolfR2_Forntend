import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { render } from "react-dom";
import { Controller } from "react-hook-form";
import { UploadFileRenderControl } from "../../../Services/UploadFileService";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { RiDeleteBack2Line } from "react-icons/ri";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { IoMdAlert } from "react-icons/io";
interface Props {
  control: any;
  errors: any;
  template: any;
  userData: any;
  uploadFileState: any;
  setUploadFileState: any;
  fromRender?: string;
}

export default function AttachmentComponent(props: Props) {
  const ref = useRef<any>();
  const toast = useRef<any>(null);
  const [linkFile, setLinkFile] = useState<any>();
  const [nameFile, setNameFile] = useState<any>();
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    description: props.template.description || "",
    maxFile: parseInt(props.template.attribute?.max) || 50,
    require: props.template.attribute?.require === "Y" || "" ? true : false,
    readonly: props.template.attribute?.readonly === "Y" || "" ? true : false,
    widthInTable: parseInt(props.template.attribute?.widthInTable) || 0,
    hideInPdf: props.template.attribute?.hideInPdf === "Y" || "" ? true : false,
  };
  useEffect(() => {
    if (props.uploadFileState) {
      const [nameFile, linkFile] = props.uploadFileState.split("|");
      setNameFile(nameFile);
      setLinkFile(linkFile);
    }
  }, []);

  const onFileSelect = async (e: any) => {
    if (e.target.files[0] !== null) {
      const files = e.target.files[0];
      const formData = new FormData();
      var guid = "imageControl" + generateQuickGuid();
      formData.append("files", files);
      formData.append("docSet", guid);
      formData.append("actorID", props.userData.employeeData.EmployeeId);
      var response = await UploadFileRenderControl(formData);
      props.setUploadFileState(
        response?.data?.fileName + "|" + response?.data?.pathUrl
      );
      setNameFile(response?.data?.fileName);
      setLinkFile(response?.data?.pathUrl);
      ref.current.value = null;
    }
  };
  const footer = (
    <div>
      <Button
        label="OK"
        onClick={() => {
          setVisibleDialog(false);
        }}
      />
    </div>
  );

  function renderDialog() {
    return (
      <>
        <Dialog
          style={{ width: "29vw", fontSize: "15px" }}
          header="Information"
          visible={visibleDialog}
          modal
          footer={footer}
          draggable={false}
          position={"top"}
          onHide={() => {
            setVisibleDialog(false);
          }}
        >
          <label className="set-css-content-attachment">
            {`1. File upload limit 20 MB (20,971,520 bytes) per file.\r\n2. Types of files that cannot be added to a list or library\r\n.aspx (ASP.NET Active server paged)\r\n`}
            {`.asmx (ASP.NET web services source file)\r\n.ascx (ASP.NET wep user control file)\r\n.master (ASP.NET master web page)\r\n.xap (Windows phone installation)\r\n`}
            {`.swf (ShockWave Flash)\r\n.jar (Java archive)\r\n.xsf (Office InfoPath form definition file)\r\n.htc (HTML Component file)\r\n`}
          </label>
        </Dialog>
      </>
    );
  }
  function openLink() {
    const _link = linkFile
      ? linkFile.charAt(0) !== "/" && !props.userData.SharepointSiteURL
        ? "/" + linkFile
        : linkFile
      : "";
    const protocol = window.location.protocol;
    console.log(props.userData.SharepointSiteURL, "1235");

    if (props.userData.SharepointSiteURL) {
      window.open(
        `${props.userData.SharepointSiteURL}/${_link}`,
        "_blank",
        "noreferrer"
      );
    } else if (props.userData.TinyURL) {
      if (
        _link.includes("www") ||
        _link.includes(".com") ||
        _link.includes(".tv") ||
        _link.includes(".net") ||
        _link.includes("https") ||
        _link.includes("http") ||
        _link.includes(".com") ||
        _link.includes(".co.th")
      ) {
        if (_link.includes("https")) {
          window.open(
            `https://${_link.replaceAll("https://", "")}`,
            "_blank",
            "noreferrer"
          );
        } else if (_link.includes("http")) {
          window.open(
            `http://${_link.replaceAll("http://", "")}`,
            "_blank",
            "noreferrer"
          );
        } else {
          window.open(`https://${_link}`, "_blank", "noreferrer");
        }
      } else {
        window.open(
          `${protocol}//${props.userData.TinyURL}${_link}`,
          "_blank",
          "noreferrer"
        );
      }
    } else if (!props.userData.TinyURL) {
      window.open(`${_link}`, "_blank", "noreferrer");
    }
  }
  return (
    <div
      className="container"
      onClick={() => {
        console.log(linkFile, "5555555555555555555");
      }}
    >
      {renderDialog()}
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
          <p className="headtext-form-requestor">File Type</p>
          <span style={{ color: "red" }}>*</span>
          <span className="headtext-form-requestor"> :</span>
        </div>
        <div className="col-md-10">
          <Controller
            name="fileTypeFile"
            control={props.control}
            rules={{ required: "fileType is required." }}
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

          <p className="set-font-size">File Type Format : *pdf*xlsx</p>
        </div>
        {/* <div className="col-md-1">
          <IoMdAlert
            onClick={() => {
              setVisibleDialog(true);
            }}
            className="set-css-icon-alert-in-upload-file"
          />
        </div> */}
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
                className={`set-input-component-css form-control ${classNames({
                  "p-invalid": fieldState.invalid,
                })}`}
              />
            )}
          />
        </div>
      </div>
      {props.uploadFileState && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2"></div>
          <div className="col-md-10">
            <div className="" style={{ display: "flex" }}>
              <div
                className="set-pointer-css-attachment"
                onClick={() => {
                  openLink();
                  // window.open(
                  //   `https://${props.userData.TinyURL}${linkFile}`,
                  //   "_blank",
                  //   "noreferrer"
                  // );
                }}
                style={{ color: "#2769b2" }}
              >
                {nameFile}
              </div>
              <div className="attach-delete-button ">
                <RiDeleteBack2Line
                  className="set-pointer-icon-image"
                  onClick={() => {
                    props.setUploadFileState(null);
                    setNameFile(null);
                    setLinkFile(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
