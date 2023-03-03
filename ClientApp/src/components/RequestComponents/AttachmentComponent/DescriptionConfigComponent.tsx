import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import "./AttachmentComponent.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import { BiCommentEdit } from "react-icons/bi";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import moment from "moment";

interface Props {
  visibleStatus: boolean;
  setVisibleStatus: any;
  Index: number;
  description?: string;
  listFileAttachDetails: any;
  setListFileAttachDetails: any;
}

export default function DescriptionConfigComponent(props: Props) {
  const [description, setDescription] = useState<string>(
    props.description == undefined ? "" : props.description
  );
  const toast = useRef<any>();
  const Header = () => {
    return (
      <div className="des-header">
        <BiCommentEdit /> <p className="headtext-des">Edit Description</p>
      </div>
    );
  };
  const Footer = () => {
    return (
      <div className="Button-line-des">
        <button
          className="Cancel-Button-des"
          onClick={() => {
            props.setVisibleStatus(false);
            setDescription("");
          }}
        >
          Cancel
        </button>
        <button className="Confirm-Button-des" onClick={saveChange}>
          Confirm
        </button>
      </div>
    );
  };
  function onChangeDescription(e: any) {
    setDescription(e.target.value);
  }
  function saveChange() {
    let _listAttach = props.listFileAttachDetails;
    _listAttach[props.Index].description = description;
    _listAttach[props.Index].modified_date = moment(new Date()).format(
      "DD/MM/YYYY HH:mm:ss"
    );
    props.setListFileAttachDetails([..._listAttach]);
    props.setVisibleStatus(false);
    setDescription("");
  }
  return (
    <div>
      <Dialog
        header={Header}
        visible={props.visibleStatus}
        style={{ width: "80vw", borderRadius: "16px" }}
        dismissableMask
        draggable={false}
        resizable={false}
        closable={false}
        onHide={() => props.setVisibleStatus(false)}
        footer={Footer}
      >
        <Toast ref={toast} />
        <div className="main-box-des p-inputgroup">
          <InputTextarea
            id="description"
            autoFocus={true}
            rows={5}
            cols={15}
            value={description}
            onChange={onChangeDescription}
            placeholder={"กรุณาระบุคำอธิบาย..."}
            autoResize
          />
        </div>
      </Dialog>
    </div>
  );
}
