import React, { useEffect, useState, FC } from "react";
import { Col, Row } from "react-bootstrap";
import { ButtonComponents } from "../../../ButtonComponents/ButtonComponents";

import { Dropdown } from "primereact/dropdown";
import { MdPreview } from "react-icons/md";

type Props = {
  setSelectedTemplateVersion: any;
  selectedTemplateVersion: any;
  templateListVersion: any;
  canEditDoc: any;
  status: any;
};
const TemplateVersionComponent = (props: Props) => {
  async function previewTemplate() {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host;
    window.open(
      `${baseUrl}/Request?MemoID=0&template=${props.selectedTemplateVersion.TemplateId}`,
      "_blank"
    );
  }
  useEffect(() => {
    console.log(props.status, "statusstatus");
  }, []);

  return (
    <>
      <Row className="gutter-row-bottom">
        <Col xs={12} sm={12} xl={2}>
          <tr>
            <th>
              <div className="label-text-container">
                <p className="information-text-header-p">
                  Select Form Template
                </p>
              </div>
              <p className="information-text-sub-p">
                เลือกฟอร์มที่ต้องการขออนุมัติ
              </p>
            </th>
          </tr>
        </Col>

        <Col xs={12} sm={12} xl={10}>
          <div
            style={{ display: "flex", flexDirection: "row", columnGap: "10px" }}
          >
            <Dropdown
              options={props.templateListVersion}
              value={props.selectedTemplateVersion}
              onChange={(e) => props.setSelectedTemplateVersion(e.value)}
              filter
              virtualScrollerOptions={{
                itemSize: 38,
              }}
              panelStyle={{
                fontSize: "13px",
                justifyContent: "start",
              }}
              optionLabel="TemplateNameWithCode"
              placeholder={
                props.selectedTemplateVersion
                  ? props.selectedTemplateVersion.TemplateNameWithCode
                  : "Select Form Template"
              }
              className="information-inputTexta-width-Button-Company"
              style={{
                borderRadius: "6px",
                height: 38,
                fontSize: "13px",
                width: "300px",
              }}
              disabled={!props.canEditDoc}
            />
            {props.selectedTemplateVersion && (
              <div>
                <ButtonComponents
                  setLabelProps="Preview"
                  setIconProps={
                    <MdPreview size={"16px"} style={{ marginRight: "3px" }} />
                  }
                  onClickProps={previewTemplate}
                  setStyleProps={{
                    borderRadius: "6px",
                    border: "1px solid rgb(40, 47, 106)",
                    fontSize: "13px",
                    width: "120px",
                  }}
                  // disabledProps={!props.canEditDoc}
                />
              </div>
            )}
            {props.status === "Draft" ||
            props.status === "Recall" ||
            props.status === "Rework" ? (
              <ButtonComponents
                setIconProps={"pi pi-times"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={() => {
                  console.log(props.status, "statusstatus");
                  props.setSelectedTemplateVersion(null);
                }}
                setStyleProps={{
                  backgroundColor: "red",
                  border: "1px solid red",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: "38px",
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default TemplateVersionComponent;
