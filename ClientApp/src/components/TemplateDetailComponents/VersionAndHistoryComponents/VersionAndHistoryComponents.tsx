import { Toast } from "primereact/toast";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { VersionAndHistoryTable } from "./VersionAndHistoryTable/VersionAndHistoryTable";

type Props = {
  setAdvanceForm: any;
  advanceForm: any;
  controlModel: any;
  setControlModel: any;
  actionProps?: any;
  setVersionCheckProps?: any;
  VersionCheckProps?: any;
  VersionDataProps?: any;
  SetVersionDataProps: any;
  VersionTempVCProps?: any;
  version?: any;
  templateListVersionHistoryProps?: any;
  ObjectDataAuthorizationProps?: any;
};

const VersionAndHistoryComponents = (props: Props) => {
  useEffect(() => {
    console.log(
      "props.templateListVersionHistoryPropsprops.templateListVersionHistoryProps",
      props.templateListVersionHistoryProps,
      props.VersionTempVCProps
    );

    for (let i = 0; i < props.templateListVersionHistoryProps.length; i++) {
      console.log(
        "props.templateListVersionHistoryProps[i]",
        props.templateListVersionHistoryProps[i],
        props.ObjectDataAuthorizationProps
      );

      let _dataFilter = props.ObjectDataAuthorizationProps.filter(
        (item: any) =>
          Number(props.templateListVersionHistoryProps[i].ModifiedBy) ===
          item.EmployeeId
      );
      if (_dataFilter.length !== 0) {
        props.templateListVersionHistoryProps[i].ModifiedByName =
          _dataFilter[0].NameEn;
        console.log("_dataFilter_dataFilter_dataFilter", _dataFilter);
      } else {
        console.log("_dataFilter_dataFilter_dataFilter0", _dataFilter);
      }
    }
  }, [
    props.ObjectDataAuthorizationProps,
    props.templateListVersionHistoryProps,
  ]);
  //   useEffect(() => {
  //     console.log("props.VersionDataProps.value2", props.VersionDataProps.value2);
  //   }, [props.VersionDataProps.value2]);
  useEffect(() => {
    console.log("controlModelVersionDataProps", props.VersionDataProps);
    console.log("controlModelVersionTempVCProps", props.VersionTempVCProps);
    console.log("controlModelversion", props.version);
    if (
      props.VersionDataProps.masterId !== undefined &&
      props.VersionDataProps.masterId !== null &&
      props.VersionDataProps.masterId.length !== 0
    ) {
      if (
        props.VersionDataProps.value2 !== undefined &&
        props.VersionDataProps.value2 !== null &&
        props.VersionDataProps.value2.length !== 0 &&
        Boolean(props.VersionDataProps.value2)
      ) {
        // props.SetVersionDataProps((prevState: any) => ({
        //   ...prevState,
        //   ...props.VersionDataProps,
        // }));
      }
    } else {
      if (
        props.VersionDataProps.value2 !== undefined &&
        props.VersionDataProps.value2 !== null &&
        props.VersionDataProps.value2.length !== 0 &&
        Boolean(props.VersionDataProps.value2)
      ) {
        let value2 = props.version.value2.split("|");

        if (
          props.VersionDataProps.value2 === undefined ||
          props.VersionDataProps.value2 === null ||
          props.VersionDataProps.value2.length === 0 ||
          props.VersionDataProps.value3 === undefined ||
          props.VersionDataProps.value3 === null ||
          props.VersionDataProps.value3.length === 0 ||
          props.VersionDataProps.value5 === undefined ||
          props.VersionDataProps.value5 === null ||
          props.VersionDataProps.value5.length === 0
        ) {
          props.SetVersionDataProps((prevState: any) => ({
            ...prevState,

            ...props.VersionDataProps,
            value3: "Editing",
            value5:
              props.VersionDataProps.value5 !== undefined &&
              props.VersionDataProps.value5 !== null &&
              props.VersionDataProps.value5.length !== 0
                ? props.VersionDataProps.value5
                : value2[1],
          }));
        }
      }
    }
  }, [props.VersionDataProps]);
  async function _CheckboxCpmponents(data: any, key: any) {
    props.setVersionCheckProps(data);
    props.SetVersionDataProps((prevState: any) => ({
      ...prevState,

      ...props.VersionDataProps,
      [key]: data.toString(),
    }));
  }
  return (
    <>
      <Row className="sub-header">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            Version and History
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div
        className="Information-panding-card"
        style={{
          paddingLeft: "37px",
          marginTop: "50px",
          paddingRight: "37px",
        }}
      >
        <Row className="gutter-row">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"Active :"}
              textSubProps={"เปิด :"}
            />
          </Col>
          <Col
            xs={12}
            sm={1}
            xl={1}
            style={{ marginTop: "-2px" }}
            className="informationComponents-media-FormCategory"
          >
            <div>
              <CheckboxCpmponents
                checkedProps={props.VersionCheckProps}
                onChangeProps={_CheckboxCpmponents}
                keyProps={"value2"}
              />
            </div>
          </Col>
        </Row>
        <Row className="gutter-row">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <TextHeaderComponents
              textHeaderProps={"Status :"}
              textSubProps={"สถานะ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={2}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <InputTextComponents
              setStyleProps={{
                height: 38,
              }}
              setClassNameProps={"information-inputTexta-width"}
              placeholderProps={
                props.VersionCheckProps !== undefined &&
                props.VersionCheckProps !== null &&
                props.VersionCheckProps.length !== 0 &&
                props.VersionCheckProps
                  ? props.VersionDataProps.value3
                  : ""
              }
              // valueProps={
              //   props.InformationDataProps.templateForm?.GroupTemplateName
              // }
              // onChangeProps={_InputText}
              disabledProps={true}
              keyProps={"GroupTemplateName"}
            />
          </Col>
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <TextHeaderComponents
              textHeaderProps={"Publish Version : "}
              textSubProps={"เวอร์ชั่นประกาศใช้ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={2}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <InputTextComponents
              setStyleProps={{
                height: 38,
              }}
              setClassNameProps={"information-inputTexta-width"}
              placeholderProps={
                props.VersionCheckProps !== undefined &&
                props.VersionCheckProps !== null &&
                props.VersionCheckProps.length !== 0 &&
                props.VersionCheckProps
                  ? props.VersionDataProps.masterId !== undefined &&
                    props.VersionDataProps.masterId !== null &&
                    props.VersionDataProps.masterId.length !== 0
                    ? props.VersionDataProps.value3 !== "Editing"
                      ? props.VersionDataProps.value4
                      : "0"
                    : ""
                  : ""
              }
              // valueProps={
              //   props.InformationDataProps.templateForm?.GroupTemplateName
              // }
              // onChangeProps={_InputText}
              disabledProps={true}
              keyProps={"GroupTemplateName"}
            />
          </Col>

          <Col
            xs={12}
            sm={2}
            xl={2}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <TextHeaderComponents
              textHeaderProps={"Editing Version :"}
              textSubProps={"กำลังแก้ไขเป็นเวอร์ชั่น :"}
            />
          </Col>

          <Col
            xs={12}
            sm={10}
            xl={2}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <InputTextComponents
              setStyleProps={{
                height: 38,
              }}
              setClassNameProps={"information-inputTexta-width"}
              placeholderProps={
                props.VersionCheckProps !== undefined &&
                props.VersionCheckProps !== null &&
                props.VersionCheckProps.length !== 0 &&
                props.VersionCheckProps
                  ? props.VersionDataProps.value5
                  : ""
              }
              // valueProps={
              //   props.InformationDataProps.templateForm?.GroupTemplateName
              // }
              // onChangeProps={_InputText}
              disabledProps={true}
              keyProps={"GroupTemplateName"}
            />
          </Col>
        </Row>
        {props.VersionCheckProps && props.VersionDataProps.masterId !== "" && (
          <Row className="gutter-row">
            <Col
              xs={12}
              sm={12}
              xl={12}
              className="referenceDocumentDialog-dialog-media-padding"
            >
              <VersionAndHistoryTable
                dataProps={props.templateListVersionHistoryProps}
                versionCheckProps={
                  props.VersionCheckProps !== undefined &&
                  props.VersionCheckProps !== null &&
                  props.VersionCheckProps.length !== 0 &&
                  props.VersionCheckProps
                    ? props.VersionDataProps.value5
                    : ""
                }
              />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default VersionAndHistoryComponents;
