import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { IMasterDataModel } from "../../../IRequestModel/IMasterDataModel";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { ReferenceDocumentDialog } from "../../DataFechDialogComponents/ReferenceDocumentDialog/ReferenceDocumentDialog";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import "./ReferenceDocumentComponents.css";
type Props = {
  listRefTemplateProps: any;
  stateProps: any;
  setControlModelObj?: any;
};

export const ReferenceDocumentComponents = (props: Props) => {
  const [visibleRefenceDocumentDialog, setVisibleRefenceDocumentDialog] =
    useState<any>(false);
  const [isLoad, setIsLoad] = useState<any>(false);
  const [listRefTemplate, setListRefTemplateProps] = useState<any>({
    ...props.listRefTemplateProps,
  });

  useEffect(() => {
    setListRefTemplateProps({ ...props.listRefTemplateProps });
  }, [props.listRefTemplateProps]);

  async function ReferenceDocumentObj(data: any, key: any) {
    let _Object: any = listRefTemplate;
    _Object[key] = data;

    props.setControlModelObj((prevState: any) => ({
      ...prevState,
      ..._Object,
    }));
  }
  async function ReferenceDocumentActionObj(data: any, key: any) {
    let _Object: any = listRefTemplate;
    _Object.templateForm.RefTemplate = JSON.stringify(data);
    _Object[key] = data;
    if (
      _Object.templateForm.RefTemplate !== undefined &&
      _Object.templateForm.RefTemplate !== null &&
      (_Object.templateForm.RefTemplate.length === 0 ||
        _Object.templateForm.RefTemplate === "[]")
    ) {
      _Object.templateForm.RefDocDisplay = "";
      _Object.templateForm.RefDocColumn = "";
      _Object.templateForm.RefTemplate = "";
    }
    props.setControlModelObj((prevState: any) => ({
      ...prevState,
      ..._Object,
    }));
  }
  function onClickVisible() {
    setVisibleRefenceDocumentDialog(!visibleRefenceDocumentDialog);
  }

  const onClickAction = async (event: any) => {
    let _event: any = event;
    const dataFilter = listRefTemplate.listRefTemplate.filter(
      (item: any) => _event !== item
    );
    ReferenceDocumentActionObj(dataFilter, "listRefTemplate");
  };
  function actionBodyTemplate(rowData: any) {
    return (
      <>
        <ButtonComponents
          setIconProps="pi pi-trash"
          onClickProps={() => onClickAction(rowData)}
        />
      </>
    );
  }
  return (
    <>
      <Row className="">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            Reference Document
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <Row className="gutter-row">
        <Col xs={12} md={12} lg={12} xl={12}>
          <ButtonComponents
            setStyleProps={{
              width: "150px",
              borderRadius: "6px",
              boxShadow: "none",
              border: "1px solid #282f6a",
              fontSize: "13px",
              paddingLeft: "16px",
              marginTop: "15px",
            }}
            onClickProps={onClickVisible}
            setLabelProps={"Add Reference"}
            setIconProps={<FiPlus />}
            setClassNameProps={"p-button-text-position"}
            disabledProps={
              props?.listRefTemplateProps?.templateForm?.IsTextForm
            }
          />
        </Col>
      </Row>
      <Row className="gutter-row">
        <Col xs={12} md={12} lg={12} xl={12}>
          <DataTable
            value={listRefTemplate.listRefTemplate}
            responsiveLayout="scroll"
            className="referenceDocumentComponents-dataTable"
          >
            <Column
              field="DocumentCode"
              header={
                <TextHeaderComponents
                  textHeaderProps={"Document Code"}
                  textSubProps={"เลขที่แบบฟอร์ม"}
                />
              }
              style={{ textAlign: "start" }}
            ></Column>
            <Column
              field="TemplateName"
              style={{ textAlign: "start" }}
              header={
                <TextHeaderComponents
                  textHeaderProps={"Template Name"}
                  textSubProps={"ชื่อแบบฟอร์ม"}
                />
              }
            ></Column>
            <Column
              field="TemplateSubject"
              style={{ textAlign: "start" }}
              header={
                <TextHeaderComponents
                  textHeaderProps={"Memo Subject *"}
                  textSubProps={"หัวข้อแบบฟอร์ม"}
                />
              }
            ></Column>

            <Column
              header={
                <TextHeaderComponents
                  textHeaderProps={"Delete"}
                  textSubProps={"ลบ"}
                />
              }
              headerStyle={{ width: "5rem" }}
              body={actionBodyTemplate}
            ></Column>
          </DataTable>
        </Col>
      </Row>

      <ReferenceDocumentDialog
        visibleProps={visibleRefenceDocumentDialog}
        setVisibleProps={onClickVisible}
        referenceDocumentObjProps={ReferenceDocumentObj}
        keyProps={"listRefTemplate"}
        TableTemplateSelectedProps={props.listRefTemplateProps}
        stateProps={props.stateProps}
        isLoadProps={setIsLoad}
      />
    </>
  );
};
