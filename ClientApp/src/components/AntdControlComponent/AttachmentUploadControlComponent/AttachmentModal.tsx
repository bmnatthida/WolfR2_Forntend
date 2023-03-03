import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { Form } from "react-bootstrap";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { UploadFileAttachFiles } from "../../../Services/AttachFileService";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useUserContext } from "../../../Context/UserContext";
import "../mainCssControl.css";
import useAlert from "../../../hooks/useAlert";
import { replaceSpecialChar } from "../../../Helper/ReplaceSpecialChar";
type AttachmentModalProp = {
  visibleDialog: boolean;
  setVisibleDialog: (value: boolean) => void;
  setCheckHasValue: (value: boolean) => void;
  toast: any;
  template: any;
  onChange: (value: string) => void;
  nameFile: string;
  setNameFile: (value: string) => void;
  value: string;
  setValue: (value: string) => void;
  link: string;
  setLink: (value: string) => void;
  SharepointSiteURL: string;
  TinyURL: string;
  visibleConfirmDialog: boolean;
  setVisibleConfirmDialog: (value: boolean) => void;
  selected: any;
  setSelected: any;
};

export const AttachmentModal: React.FC<AttachmentModalProp> = ({
  visibleDialog,
  setVisibleDialog,
  setCheckHasValue,
  toast,
  template,
  onChange,
  nameFile,
  setNameFile,
  link,
  setLink,
  SharepointSiteURL,
  TinyURL,
  visibleConfirmDialog,
  setVisibleConfirmDialog,
  selected,
  setSelected,
  value,
  setValue,
  ...props
}: AttachmentModalProp) => {
  const [fileType, setFileType] = useState<string>("Attach file");
  const { toggleAlert } = useAlert();
  const [userData] = useUserContext();
  const options = ["Attach file", "Attach link"];

  const onFileSelected = (e: any) => {
    let mapData: any = [];
    var hasInvalidFiles = false;

    const file = e.dataTransfer
      ? e.dataTransfer.files[0]
      : e.currentTarget.files[0];
    if (file === undefined) {
      return false;
    }
    console.log({ filefilefile: file });
    if (template.description) {
      const myArray = template.description.split("*");
      for (let index = 1; index < myArray.length; index++) {
        mapData.push(myArray[index]);
        if (file.name.endsWith(myArray[index])) {
          hasInvalidFiles = true;
          continue;
        }
      }
    }
    if (!hasInvalidFiles) {
      e.target.value = null;
      toggleAlert({
        description: `Unsupported file selected.`,
        message: `File type warning.`,
        type: "warning",
      });
      setSelected(undefined);
      return;
    }
    var filesize = file.size / 1024 / 1024;
    if (parseInt(template.attribute.max) < filesize) {
      toggleAlert({
        description: `File size exceeds ${template.attribute.max} MB`,
        message: `File size warning.`,
        type: "warning",
      });

      e.target.value = null;
      setSelected(undefined);
      return false;
    }
    setSelected(file);
  };
  const fileUpload = () => {
    return (
      <div className="">
        <div className="setmagin-at">
          <Form.Group
            controlId="formFile"
            className="mb-3 file-input-container"
          >
            <Form.Control
              type="file"
              accept={fileType}
              onChange={onFileSelected}
            />
            <span style={{ alignSelf: "flex-end" }}>
              File Formats Accepted {template.description}
            </span>
          </Form.Group>
        </div>
      </div>
    );
  };
  const linkUpload = () => {
    return (
      <div>
        <div className="p-field" style={{ marginTop: "15px" }}>
          <label htmlFor="Name" className="p-d-block">
            Name
          </label>
          <InputText
            id="Name"
            aria-describedby="Name-help"
            // className="p-invalid p-d-block"
            onChange={(e: any) => {
              setNameFile(e.target.value?.replaceAll(" ", "_"));
            }}
          />
        </div>
        <div className="p-field">
          <label htmlFor="Link" className="p-d-block">
            Link
          </label>
          <InputText
            id="Link"
            aria-describedby="Link-help"
            // className="p-invalid p-d-block"
            onChange={(e: any) => {
              setLink(e.target.value?.replaceAll(" ", "_"));
            }}
          />
        </div>
      </div>
    );
  };
  const footerDialog = (onChange: any) => {
    return (
      <div>
        <Button
          style={{ height: "38px" }}
          onClick={() => setVisibleDialog(false)}
          label="Close"
          id="CloseButton"
          className="close-set-color-button-active-request"
        />
        <Button
          onClick={() => uploadFile(onChange)}
          style={{ height: "38px" }}
          label="Save Changes"
          id="SaveChangesButton"
          className="save-set-color-button-active-request"
        />
      </div>
    );
  };
  const uploadFile = async (onChange: any) => {
    try {
      if (value === "Attach file") {
        if (selected) {
          const formData = new FormData();
          formData.append(`files`, selected);
          formData.append("Doclib", "TempAttachment");
          formData.append("docSet", generateQuickGuid());
          formData.append("fileDesc", "renderControl");
          formData.append("actorID", userData.EmployeeId.toString());
          const response = await UploadFileAttachFiles(formData);
          console.log(response, "response");

          if (response?.data?.result) {
            onChange(
              replaceSpecialChar(selected.name) +
                "|" +
                replaceSpecialChar(response.data.pathUrl)
            );
            setNameFile(replaceSpecialChar(selected.name));
            // if (SharepointSiteURL) {
            //   setLink(SharepointSiteURL + "" + response?.data.pathUrl);
            // } else {
            setLink(response?.data.pathUrl?.replaceAll(" ", "_"));
            // }
          }
          setVisibleConfirmDialog(true);
        } else {
          confirm1("Please select a file.");
        }
      } else if (value === "Attach link") {
        console.log("at+>", link);
        if (link !== undefined) {
          onChange(nameFile?.replaceAll(" ", "_") + "|" + link);
          setNameFile(nameFile?.replaceAll(" ", "_"));
          setLink(link);
          setVisibleConfirmDialog(true);
        } else {
          confirm1("Please insert a link.");
        }
      }
    } catch (error) {
      console.log("At=>error", error);
    }
  };
  const confirm1 = (msg: string) => {
    confirmDialog({
      message: msg,
      header: "Alert",
      icon: "pi pi-info-circle",
      rejectClassName: "hide-component",
    });
  };
  return (
    <>
      <Dialog
        blockScroll
        visible={visibleDialog}
        breakpoints={{}}
        style={{ width: "70vw", borderRadius: "16px" }}
        header="Add Attachment"
        modal
        position="top"
        className="p-fluid"
        onHide={() => setVisibleDialog(false)}
        draggable={false}
        footer={footerDialog(onChange)}
      >
        <SelectButton
          
          value={value}
          options={options}
          
          onChange={(e) => setValue(e.value)}
        ></SelectButton>

        {value === "Attach file" && fileUpload()}
        {value === "Attach link" && linkUpload()}
      </Dialog>
    </>
  );
};
