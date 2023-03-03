import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { useUserContext } from "../../../Context/UserContext";
import {
  GetTemplateByDocTypeCode,
  GetTemplateTemplateListVersion,
} from "../../../Services/TemplateService";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import "./ReferenceDocumentComponents.css";
import ReferenceDocumentDialogFix from "./ReferenceDocumentDialogFix";
type Props = {
  listRefTemplateProps: any;
  stateProps: any;
  controlModelObj: any;
  setControlModelObj: any;
  advanceForm: any;
};

export const ReferenceDocumentComponentsFix = (props: Props) => {
  const [visibleRefenceDocumentDialog, setVisibleRefenceDocumentDialog] =
    useState<any>(false);
  const [isLoadTemplate, setIsLoadTemplate] = useState<any>(false);
  const [userData, setUserData] = useUserContext();
  const [mstTemplateList, setMstTemplateList] = useState<any[]>([]);

  useEffect(() => {
    setIsLoadTemplate(true);
    fetchTemplate();
    fecthRefTemplate();
  }, []);

  async function fetchTemplate() {
    const empid = userData.EmployeeId;

    const dataJson = {
      CreatedBy: empid.toString(),
    };

    let _dataTemplatee = await GetTemplateTemplateListVersion(dataJson);
    let arrayTemplate: any = [];
    _dataTemplatee.map((data: any) => {
      if (data.IsTextForm !== true) arrayTemplate.push(data);
    });
    // templateAddCode([...arrayTemplate]);
    setMstTemplateList([...arrayTemplate]);
    // setFilters([...arrayTemplate]);
    setIsLoadTemplate(false);
  }

  const fecthRefTemplate = () => {
    if (props.listRefTemplateProps.listRefTemplate.length > 0) {
      let newRef: any[] = [];
      let _listRefTemp = props.listRefTemplateProps;
      _listRefTemp.listRefTemplate.map(async (e: any) => {
        const ref = await GetTemplateByDocTypeCode({
          DocumentCode: e.DocumentCode,
        });
        if (ref) {
          ref.IsDefaultLineApprove = e.IsDefaultLineApprove;
          console.log("ref=> ref", ref);

          newRef.push(ref);
        }
        props.listRefTemplateProps.listRefTemplate = newRef;
        props.setControlModelObj({ ...props.listRefTemplateProps });
      });
    }
  };

  // async function ReferenceDocumentObj(data: any, key: any) {
  //   let _Object: any = listRefTemplate;
  //   _Object[key] = data;

  //   props.setControlModelObj((prevState: any) => ({
  //     ...prevState,
  //     ..._Object,
  //   }));
  // }
  // async function ReferenceDocumentActionObj(data: any, key: any) {
  //   let _Object: any = listRefTemplate;
  //   _Object.templateForm.RefTemplate = JSON.stringify(data);
  //   _Object[key] = data;
  //   if (
  //     _Object.templateForm.RefTemplate !== undefined &&
  //     _Object.templateForm.RefTemplate !== null &&
  //     (_Object.templateForm.RefTemplate.length === 0 ||
  //       _Object.templateForm.RefTemplate === "[]")
  //   ) {
  //     _Object.templateForm.RefDocDisplay = "";
  //     _Object.templateForm.RefDocColumn = "";
  //     _Object.templateForm.RefTemplate = "";
  //   }
  //   props.setControlModelObj((prevState: any) => ({
  //     ...prevState,
  //     ..._Object,
  //   }));
  // }
  function onClickVisible() {
    setVisibleRefenceDocumentDialog(!visibleRefenceDocumentDialog);
  }

  const onClickAction = async (event: any) => {
    let _event: any = event;
    const dataFilter = props.listRefTemplateProps.listRefTemplate.filter(
      (item: any) => _event !== item
    );
    props.listRefTemplateProps.listRefTemplate = dataFilter;
    props.listRefTemplateProps.templateForm.RefTemplate =
      JSON.stringify(dataFilter);
    props.setControlModelObj({ ...props.listRefTemplateProps });
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
            loading={isLoadTemplate}
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
            value={props.listRefTemplateProps.listRefTemplate}
            responsiveLayout="scroll"
            loading={isLoadTemplate}
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

      <ReferenceDocumentDialogFix
        listRefTemplateProps={props.listRefTemplateProps.listRefTemplate}
        templateList={mstTemplateList}
        visibleRefenceDocumentDialog={visibleRefenceDocumentDialog}
        setVisibleRefenceDocumentDialog={setVisibleRefenceDocumentDialog}
        advanceForm={props.advanceForm}
        controlModel={props.controlModelObj}
        setControlModelObj={props.setControlModelObj}
      />
    </>
  );
};
