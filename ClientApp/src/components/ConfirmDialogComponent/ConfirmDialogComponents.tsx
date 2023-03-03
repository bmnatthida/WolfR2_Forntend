import { ConfirmDialog } from "primereact/confirmdialog";
import React from "react";
import "./ConfirmDialogComponents.css";
interface Props {
  messageConfirmDialog: string;
  accept: () => void;
  visible: boolean;
  setVisible: any;
}

export const ConfirmDialogComponents = (props: Props) => {
  return (
    <ConfirmDialog
      visible={props.visible}
      onHide={() => {
        props.setVisible(false);
      }}
      message={props.messageConfirmDialog}
      header="Confirmation"
      icon="pi pi-info-circle"
      className="z-index-confirm"
      acceptClassName="p-button p-component p-button-raised p-button-success"
      rejectClassName="p-button p-component p-button-outlined p-button-danger"
      position="top"
      accept={props.accept}
      draggable={false}
    />
  );
};
