import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { ButtonComponents } from "../../../ButtonComponents/ButtonComponents";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";
import { _TableSelectField } from "../TableTemplateComponents/TableTemplateComponents";

interface Props {
  visibleProps?: any;
  setVisibleProps?: any;
  keyProps?: any;
  dataProps?: any;
  valueProps?: any;
  referenceFormProps?: any;
  referenceDocumentDialogObjectProps?: any;
}

export const TableTemplateDialogComponents = (props: Props) => {
  const [referenceDocumentDialogObject, setReferenceDocumentDialogObject] =
    useState<any>({});
  async function _ReferenceDocumentDialog(data: any, key: any) {
    setReferenceDocumentDialogObject(data);
  }
  useEffect(() => {
    console.log("props.dataProps", props.dataProps);
  }, [props.dataProps]);

  const onSave = () => {
    let _data = { ...props.dataProps };
    let arraPushTable: any =
      props.referenceDocumentDialogObjectProps.SaveDataTable !== undefined &&
      props.referenceDocumentDialogObjectProps.SaveDataTable !== null
        ? props.referenceDocumentDialogObjectProps.SaveDataTable
        : [];

    _data.objTable =
      Object.keys(referenceDocumentDialogObject).length === 0
        ? _data.objTable
        : referenceDocumentDialogObject;
    let _dataFilter = arraPushTable.filter(
      (item: any) => item.Key === _data.Key
    );
    if (_dataFilter.length !== 0) {
      for (let i = 0; i < arraPushTable.length; i++) {
        const element = arraPushTable[i];
        if (element.Key === _dataFilter[0].Key) {
          arraPushTable[i] = _data;
        }
      }
    } else {
      arraPushTable.push(_data);
    }

    console.log(
      " _dataeeeeeeeeeeeeeeeeeeeeeeeeee",
      _data,
      referenceDocumentDialogObject,
      arraPushTable
    );

    props.setVisibleProps(arraPushTable, "SaveDataTable");
    props.setVisibleProps(false, props.keyProps);
  };
  const onHide = () => {
    props.setVisibleProps(false, props.keyProps);
  };
  const renderFooter = (name: any) => {
    return (
      <div className="referenceDocumentDialog-renderFooter-display">
        <ButtonComponents
          setLabelProps="Cancel"
          setIconProps={
            <IoCloseOutline size={"16px"} style={{ marginRight: "3px" }} />
          }
          onClickProps={() => onHide()}
          setClassNameProps="p-button-text referenceDocumentDialog-button"
          setStyleProps={{
            height: "38px",
            border: "0.5px solid #FF2626",
            background: "#FFFFFF",
            color: "#FF2626",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />
        <ButtonComponents
          setLabelProps="Save"
          setIconProps={<BiSave size={"16px"} style={{ marginRight: "3px" }} />}
          onClickProps={() => onSave()}
          setStyleProps={{
            height: "38px",
            borderRadius: "6px",
            border: "1px solid rgb(40, 47, 106)",
            fontSize: "13px",
          }}
        />
      </div>
    );
  };
  return (
    <div>
      <Dialog
        header={props.dataProps.Key}
        visible={props.visibleProps}
        position={"top"}
        modal
        style={{ width: "70vw" }}
        footer={renderFooter}
        onHide={() => onHide()}
        draggable={false}
        resizable={false}
      >
        <Row className="gutter-row">
          <Col xs={12} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Select Field"}
              textSubProps={"เลือกข้อมูล"}
            />
          </Col>
          <Col xs={12} sm={10} xl={10}>
            <_TableSelectField
              valueProps={props.valueProps}
              referenceFormProps={props.referenceFormProps}
              dataProps={props.dataProps}
              setValueProps={_ReferenceDocumentDialog}
              referenceDocumentDialogObjectProps={
                props.referenceDocumentDialogObjectProps
              }
            />
          </Col>
        </Row>
      </Dialog>
    </div>
  );
};
