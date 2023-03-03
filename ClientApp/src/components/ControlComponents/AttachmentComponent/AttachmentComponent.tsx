import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Col, Row, Form } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import "./AttachmentComponent.css";
import { AnyRecord } from "dns";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { UploadFileAttachFiles } from "../../../Services/AttachFileService";
import { log } from "console";
import { Controller } from "react-hook-form";
import ComponentLabel from "../ComponentLabel";
interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: boolean;
  colText?: number;
  width?: any;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: any;
  name: string;
  control: any;
}
export default function AttachmentComponent(props: Props) {
  // const options = ["Attach file", "Attach link"];
  // const toast = useRef<any>(null);
  // const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  // const [visibleConfirmDialog, setVisibleConfirmDialog] =
  //   useState<boolean>(false);
  // const [value, setValue] = useState("");
  // const [selected, setSelected] = useState<any>();
  // const [checkHasValue, setCheckHasValue] = useState<boolean>(false);
  // const [link, setLink] = useState<any>();
  // const [nameFile, setNameFile] = useState<any>();
  // const userData = JSON.parse(window.localStorage.getItem("userData") || "");
  // const TinyUrl = window.localStorage.getItem("tinyUrl") || "";
  // const [fileType, setFileType] = useState<string>("");
  // useEffect(() => {
  //   deFaultValue();
  //   defaultFormat();
  // }, []);

  // useEffect(() => {
  //   if (props.data.value !== undefined) {
  //     console.log("response", props.data.value);

  //     deFaultValue();
  //   }
  // }, [props.data.value]);

  // useEffect(() => {
  //   if (checkHasValue) {
  //     if (value === "Attach file") {
  //       props.onChangeEditForm(
  //         {
  //           value: nameFile + "|" + link,
  //         },
  //         props.rowIdx,
  //         props.colIdx
  //       );
  //     } else if (value === "Attach link") {
  //       props.onChangeEditForm(
  //         { value: nameFile + "|" + link },
  //         props.rowIdx,
  //         props.colIdx
  //       );
  //     }
  //   }
  // }, [checkHasValue]);

  // const defaultFormat = () => {
  //   if (props.template.description) {
  //     const myArray = props.template.description.split("*");
  //     let mapData: any = [];
  //     for (let index = 1; index < myArray.length; index++) {
  //       myArray[index] = "." + myArray[index];
  //       mapData.push(myArray[index]);
  //     }
  //     setFileType(mapData.toString());
  //   }
  // };
  // const deFaultValue = () => {
  //   if (
  //     props.data.value === "" ||
  //     props.data.value === undefined ||
  //     props.data.value === null
  //   ) {
  //     setCheckHasValue(false);
  //   } else {
  //     const [nameFile, linkFile] = props.data.value.split("|");
  //     console.log(props.data.value, "props.data.value");
  //     const linkUrl = linkFile;
  //     setLink(linkUrl.replaceAll("https://", ""));
  //     setNameFile(nameFile);
  //     setCheckHasValue(true);
  //   }
  // };
  // const acceptUpload = async () => {
  //   if (value === "Attach file") {
  //     setCheckHasValue(true);
  //   } else if (value === "Attach link") {
  //     setCheckHasValue(true);
  //   } else {
  //     setCheckHasValue(false);
  //     setSelected(undefined);
  //     setLink(undefined);
  //     setNameFile(undefined);
  //     setValue("Attach file");
  //     // props.onChangeEditForm({ value: null }, props.rowIdx, props.colIdx);
  //     setVisibleDialog(false);
  //   }
  // };
  // const confirmUploadDialog = () => {
  //   return (
  //     <>
  //       <ConfirmDialog
  //         visible={visibleConfirmDialog}
  //         onHide={() => setVisibleConfirmDialog(false)}
  //         message="Are you sure you want to proceed?"
  //         header="Confirmation"
  //         icon="pi pi-exclamation-triangle"
  //         position="top"
  //         accept={acceptUpload}
  //         acceptClassName="p-button p-component p-button-raised p-button-success"
  //         rejectClassName="p-button p-component p-button-outlined p-button-danger"
  //         draggable={false}
  //       />
  //     </>
  //   );
  // };

  // const confirm1 = (msg: string) => {
  //   confirmDialog({
  //     message: msg,
  //     header: "Alert",
  //     icon: "pi pi-info-circle",
  //     rejectClassName: "hide-component",
  //   });
  // };

  // const uploadFile = async () => {
  //   if (value === "Attach file") {
  //     if (selected !== undefined) {
  //       const formData = new FormData();
  //       formData.append(`files`, selected);
  //       formData.append("Doclib", "TempAttachment");
  //       formData.append("docSet", generateQuickGuid());
  //       formData.append("fileDesc", "renderControl");
  //       formData.append("actorID", userData.employeeData.EmployeeId);
  //       const response = await UploadFileAttachFiles(formData);
  //       if (response?.data?.result === true) {
  //         console.log(response, "response");
  //         setNameFile(selected.name);
  //         if (userData.SharepointSiteURL) {
  //           setLink(userData.SharepointSiteURL + "/" + response?.data.pathUrl);
  //         } else {
  //           setLink(response?.data.pathUrl);
  //         }
  //         setVisibleConfirmDialog(true);
  //       } else {
  //         confirm1("Please select a file.");
  //       }
  //     } else if (value === "Attach link") {
  //       if (link !== undefined) {
  //         onChange(nameFile + "|" + link);
  //         setNameFile(nameFile);
  //         setLink(link);
  //         // setVisibleConfirmDialog(true);
  //       } else {
  //         confirm1("Please insert a link.");
  //       }
  //     }
  //   }
  // };
  // const footerDialog = (onChange: any) => {
  //   return (
  //     <div>
  //       <Button
  //         style={{ height: "38px" }}
  //         onClick={() => setVisibleDialog(false)}
  //         label="Close"
  //         className="close-set-color-button-active-request"
  //       />

  //       <Button
  //         onClick={() => uploadFile(onChange)}
  //         style={{ height: "38px" }}
  //         label="Save Changes"
  //         className="save-set-color-button-active-request"
  //       />
  //     </div>
  //   );
  // };
  // const onFileSelected = (e: any) => {
  //   console.log("e", e);

  //   const file = e.dataTransfer
  //     ? e.dataTransfer.files[0]
  //     : e.currentTarget.files[0];
  //   if (file === undefined) {
  //     return;
  //   }
  //   var hasInvalidFiles = false;
  //   let mapData: any = [];
  //   if (props.template.description) {
  //     const myArray = props.template.description.split("*");
  //     for (let index = 1; index < myArray.length; index++) {
  //       mapData.push(myArray[index]);
  //       if (file.name.endsWith(myArray[index])) {
  //         hasInvalidFiles = true;
  //         continue;
  //       }
  //     }
  //   }
  //   if (!hasInvalidFiles) {
  //     e.target.value = null;
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error Message",
  //       detail: `Unsupported file selected.`,
  //       life: 3000,
  //     });
  //     setSelected({});
  //     return;
  //   }

  //   var filesize = file.size / 1024 / 1024;
  //   if (parseInt(props.template.attribute.max) < filesize) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error Message",
  //       detail: `File size exceeds ${props.template.attribute.max} MB`,
  //       life: 3000,
  //     });
  //     e.target.value = null;
  //     setSelected({});
  //     return false;
  //   }
  //   console.log({ file });

  //   setSelected(file);
  // };

  // const fileUpload = () => {
  //   return (
  //     <div className="">
  //       <Toast ref={toast}></Toast>
  //       <div className="setmagin-at">
  //         {/* <Form.Group controlId="formFile" className="mb-3"> */}

  //         <Form.Control
  //           type="file"
  //           accept={fileType}
  //           onChange={onFileSelected}
  //         />

  //         {/* </Form.Group> */}
  //       </div>
  //     </div>
  //   );
  // };
  // const linkUpload = () => {
  //   return (
  //     <div>
  //       <div className="p-field" style={{ marginTop: "15px" }}>
  //         <label htmlFor="Name" className="p-d-block">
  //           Name
  //         </label>
  //         <InputText
  //           id="Name"
  //           aria-describedby="Name-help"
  //           className="p-invalid p-d-block"
  //           onChange={(e: any) => {
  //             setNameFile(e.target.value);
  //           }}
  //         />
  //         <small id="Name-help" className="p-error p-d-block">
  //           Name is not available.
  //         </small>
  //       </div>
  //       <div className="p-field">
  //         <label htmlFor="Link" className="p-d-block">
  //           Link
  //         </label>
  //         <InputText
  //           id="Link"
  //           aria-describedby="Link-help"
  //           className="p-invalid p-d-block"
  //           onChange={(e: any) => {
  //             setLink(e.target.value);
  //           }}
  //         />
  //         <small id="Link-help" className="p-error p-d-block">
  //           Link is not available.
  //         </small>
  //       </div>
  //     </div>
  //   );
  // };

  // function openWindow() {
  //   var pathArray = link.split("/");
  //   console.log(props.template);
  //   console.log(props.data);
  //   console.log(link);
  //   if (
  //     link.indexOf("www") == 0 ||
  //     link.indexOf(".com") == 0 ||
  //     link.indexOf(".tv") == 0 ||
  //     link.indexOf(".net") == 0 ||
  //     link.indexOf(".co.th") == 0
  //   ) {
  //     window.open(`https://${link}`, "_blank", "noreferrer");
  //   } else if (userData.TinyURL) {
  //     window.open(`https://${userData.TinyURL}${link}`, "_blank", "noreferrer");
  //   } else if (!userData.TinyURL) {
  //     window.open(`https://${link}`, "_blank", "noreferrer");
  //   }
  // }

  return <></>;
}
