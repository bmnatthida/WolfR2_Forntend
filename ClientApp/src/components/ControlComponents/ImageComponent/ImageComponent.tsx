import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./ImageComponent.css";
import { Image } from "antd";
import { UploadFileRenderControl } from "../../../Services/UploadFileService";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { RiDeleteBack2Line } from "react-icons/ri";
import { CgCloseR } from "react-icons/cg";

import { Toast } from "primereact/toast";

import { Controller } from "react-hook-form";
import useAlert from "../../../hooks/useAlert";
import { replaceSpecialChar } from "../../../Helper/ReplaceSpecialChar";

interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: string;
  colText?: number;
  colAction?: number;
  errorValid?: string;
  statusMemoDetail?: boolean;
  name: string;
  control: any;
  buttonType: string;
  canEditDoc: boolean;
}

export default function ImageComponent(props: Props) {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const userData = JSON.parse(window.localStorage.getItem("userData") || "");
  const _sharepointSiteURL = userData.SharepointSiteURL;
  const initialValues = {
    value: null,
  };
  const [valueState, setValueState] = useState<any>(
    props.data.value == null || undefined ? initialValues : props.data
  );
  const [fileType, setFileType] = useState<string>("");
  useEffect(() => {
    deFaultValue();
  }, []);

  const deFaultValue = () => {
    if (props.template.fileType) {
      const myArray = props.template.fileType.split("*");
      let mapData: any = [];
      for (let index = 1; index < myArray.length; index++) {
        myArray[index] = "." + myArray[index];
        mapData.push(myArray[index]);
      }
      setFileType(mapData.toString());
    }
  };
  async function onFileSelect(e: any, onChange: any) {
    if (e.target.files[0] !== null) {
      const files = e.target.files[0];
      var hasInvalidFiles = false;
      if (props.template?.fileType) {
        const myArray = props.template?.fileType.split("*");
        for (let index = 1; index < myArray.length; index++) {
          if (files.name.endsWith(myArray[index])) {
            hasInvalidFiles = true;
            continue;
          }
        }
      }

      if (!hasInvalidFiles) {
        toggleAlert({
          description: `Unsupported file selected.`,
          message: `File type warning.`,
          type: "warning",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: `Unsupported file selected.`,
        //   life: 3000,
        // });
        setValueState((prevState: any) => ({
          ...prevState,
          value: null,
        }));
        e.target.value = null;
        return;
      }
      const formData = new FormData();
      var guid = "imageControl" + generateQuickGuid();
      formData.append("files", files);
      formData.append("docSet", guid);
      formData.append("actorID", userData.employeeData.EmployeeId);
      var response = await UploadFileRenderControl(formData);
      console.log("im=>response", { response });

      // setValueState((prevState: any) => ({
      //   ...prevState,
      //   value: response.data.pathUrl,
      // }));
      console.log("im=>", replaceSpecialChar(response.data.pathUrl));
      onChange(replaceSpecialChar(response.data.pathUrl));
      // props.onChangeEditForm(
      //   {
      //     value: response.data.pathUrl,
      //   },
      //   props.rowIdx,
      //   props.colIdx
      // );
    }
  }
  return (
    <>
      <Toast ref={toast}></Toast>
      <Controller
        render={({
          field: { onChange, value, onBlur, name, ref },
          formState: { errors, isSubmitted },
        }) => {
          console.log({ value });

          return (
            <>
              <Col
                onClick={() => {
                  console.log(
                    `${_sharepointSiteURL}${value}`,
                    "ffffffffffffffff"
                  );
                  console.log(
                    `https://${userData.TinyURL}${value}`,
                    "ffffffffffffffff2"
                  );
                }}
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
                      <div className="label-text-container">
                        <span className="headtext-form">
                          {props.template.label}
                        </span>
                        {props.template.attribute.require === "Y" && (
                          <span className="headtext-form text-Is-require">
                            *
                          </span>
                        )}
                      </div>
                      <p className="subtext-form">{props.template.alter}</p>
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
                <div
                  className={`p-inputgroup ${
                    isSubmitted &&
                    errors?.items &&
                    errors?.items[props.rowIdx] &&
                    errors?.items[props.rowIdx].layout[props.colIdx]
                      ? "set-layout-required"
                      : ""
                  }`}
                  style={{ display: `${!value ? "contents" : ""} ` }}
                >
                  {value ? (
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        pointerEvents:
                          !props.canEditDoc ||
                          props.template.attribute.readonly === "Y"
                            ? "none"
                            : "auto",
                      }}
                    >
                      <div>
                        <Image
                          src={
                            _sharepointSiteURL
                              ? `${_sharepointSiteURL}${value}`
                              : `https://${userData.TinyURL}${value}`
                          }
                          alt="Image"
                          width={parseInt(props.template.attribute.width)}
                          height={parseInt(props.template.attribute.height)}
                        />
                      </div>
                      {props.template.attribute?.readonly === "N" && (
                        <div className="set-layout-icon-css ">
                          <CgCloseR
                            style={{ fontSize: "23px" }}
                            className="set-pointer-icon-image"
                            onClick={() => {
                              setValueState((prevState: any) => ({
                                ...prevState,
                                value: null,
                              }));
                              onChange(null);
                              // props.onChangeEditForm(
                              //   {
                              //     value: null,
                              //   },
                              //   props.rowIdx,
                              //   props.colIdx
                              // );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {props.template.attribute?.readonly === "N" && (
                        <Form.Control
                          onClick={() => {
                            console.log(fileType, "fileType");
                          }}
                          disabled={
                            !props.canEditDoc ||
                            props.template.attribute.readonly === "Y"
                          }
                          type="file"
                          onChange={(e: any) => {
                            onFileSelect(e, onChange);
                          }}
                          // accept={fileType}
                          className={`set-input-component-css form-control`}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
                        File Formats Accepted {props.template?.fileType}
                      </div>
                    </>
                  )}

                  {isSubmitted &&
                    errors?.items &&
                    errors?.items[props.rowIdx] &&
                    errors?.items[props.rowIdx].layout[props.colIdx] && (
                      <small id="Name-help" className="p-error p-d-block">
                        {props.template.label} is required.
                      </small>
                    )}
                </div>
              </Col>
            </>
          );
        }}
        rules={{
          required:
            props.template.attribute.require === "Y" &&
            props.buttonType !== "draft" &&
            props.buttonType !== "cancel"
              ? true
              : false,
        }}
        name={props.name}
        control={props.control}
        //   valueName={"value"}
      />
    </>
  );
}
