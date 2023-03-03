import { Button, Spin, Modal, Popover } from "antd";
import { ConfirmDialog } from "primereact/confirmdialog";
import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { IoArrowBackSharp, IoCloseOutline, IoMenu } from "react-icons/io5";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import { DropdownComponents } from "../../components/DropdownComponents/DropdownComponents";
import { EmailTemplateDetail } from "../../components/SettingsSpecComponents/EmailTemplateDetail/EmailTemplateDetail";
import { TextHeaderComponents } from "../../components/TextHeaderComponents/TextHeaderComponents";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { IEmailTemplateModel } from "../../IRequestModel/IEmailTemplateModel";

import {
  AddEmailTemplate,
  getEmailTemplateById,
  updateEmailTemplate,
} from "../../Services/EmailTemplateService";
import {
  GetTemplate,
  GetTemplateById,
  GetTemplateeBindFormNameDDL,
  GetTemplateTemplateListVersion,
} from "../../Services/TemplateService";
import "./EmailTemplateDetailScreen.css";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
import { Toast } from "primereact/toast";
import withPerMission from "../../components/HOC/withPermission";
type Props = {};
const createEmailTemplate: IEmailTemplateModel = {
  EmailTemplateId: 0,
  TemplateId: 0,
  TemplateName: "",
  TemplateDocumentCode: "",
  FormState: "",
  EmailTo: "",
  EmailCC: "",
  EmailSubject: "",
  EmailBody: "",
  CreatedByName: "",
  IsActive: true,
  ModifiedByName: "",
  CreatedBy: "",
  ModifiedDate: "",
  ModifiedBy: "",
  CreatedDate: "",
};
const EmailTemplateDetailScreen = (props: Props) => {
  const [sidebarState, setSidebarState] = useState(true);
  const [dataTreeSelectProps, setDataTreeSelectProps] = useState<any>({});
  const [template, setTemplate] = useState<any>({});
  const [formSelect, setFormSelect] = useState<any>({});
  const [clickSelect, setClickSelect] = useState<any>("");
  const [formSelectLabel, setFormSelectLabel] = useState<any>([]);
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState<boolean>();
  const [emailTemplateObj, setEmailTemplateObj] =
    useState<any>(createEmailTemplate);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  let history = useHistory();
  const toast = useRef<any>();
  const [action, setAction] = useState("");
  const query = new URLSearchParams(useLocation().search);
  useEffect(() => {
    let _emailTemplateId: string = query.get("EmailTemplateId") || "";
    if (_emailTemplateId) {
      setAction("edit");
      fetchEmailTemplateById(Number(_emailTemplateId));
    } else {
      setAction("add");
    }
  }, []);

  useEffect(() => {
    fetchTemplate();
  }, []);
  useEffect(() => {
    console.log("emailTemplateObj", emailTemplateObj);
  }, [emailTemplateObj]);
  function toggleSideBar() {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setSidebarState(true);
    }
  }
  async function onSave() {
    let _emailTemplateObj = emailTemplateObj;

    if (action === "add") {
      _emailTemplateObj.CreatedByName = userData.employeeData.NameEn;
      _emailTemplateObj.CreatedBy = userData.employeeData.EmployeeId.toString();
      _emailTemplateObj.ModifiedBy =
        userData.employeeData.EmployeeId.toString();
      _emailTemplateObj.ModifiedByName = userData.employeeData.NameEn;
      _emailTemplateObj.TemplateId =
        _emailTemplateObj.TemplateId === 0
          ? null
          : _emailTemplateObj.TemplateId;
      const res = await AddEmailTemplate(_emailTemplateObj);
      if (res) {
        history.push("/EmailTemplateList", {
          responeAddTemplate: res,
          typeTemplate: action,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "Server Error Please try again",
          life: 7000,
        });
      }
      console.log("res0", res);
    } else {
      _emailTemplateObj.TemplateId =
        _emailTemplateObj.TemplateId === 0
          ? null
          : _emailTemplateObj.TemplateId;

      console.log("_emailTemplateObjeeeeeee", _emailTemplateObj);

      const res = await updateEmailTemplate(_emailTemplateObj);
      if (res) {
        history.push("/EmailTemplateList", {
          responeAddTemplate: res,
          typeTemplate: action,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "Server Error Please try again",
          life: 7000,
        });
      }
    }
  }
  function onClickSelect(data: any) {
    setClickSelect(data);
  }

  async function dataEdit(data: any) {
    const dataJson = {
      TemplateId: data,
    };
    let _responeData = await GetTemplateById(dataJson);
    if (_responeData !== null) {
      _templateDropdown(_responeData);
    }
  }
  async function fetchTemplate() {
    const empData = JSON.parse(window.localStorage.getItem("userData"));
    const empid = empData.employeeData.EmployeeId;
    const DepartmentId = empData.employeeData.DepartmentId;
    // const dataJson = {
    //   CreatedBy: empid.toString(),
    //   DepartmentId: DepartmentId,
    // };
    // const dataJsonn = {
    //   CreatedBy: empid.toString(),
    //   DepartmentId: DepartmentId,
    //   Username: empData.employeeData.Username,
    //   Email: empData.employeeData.Email,
    // };
    const dataJson = {
      CreatedBy: empid.toString(),
    };

    let _dataTemplatee = await GetTemplateTemplateListVersion(dataJson);
    // let _dataTemplatee = await GetTemplateeBindFormNameDDL(dataJsonn);
    // let _dataTemplate = await GetTemplateTemplateListVersion(dataJson);

    setTemplate(_dataTemplatee);
  }
  async function fetchEmailTemplateById(data: any) {
    const dataJson = {
      EmailTemplateId: Number(data),
    };
    let _dataTemplate = await getEmailTemplateById(dataJson);

    setEmailTemplateObj((prevState: any) => ({
      ...prevState,
      ..._dataTemplate,
    }));
    dataEdit(_dataTemplate.TemplateId);
  }
  function _templateDropdown(data: any) {
    if (data !== undefined && data !== null) {
      let _dataAdvanceForm =
        data === undefined || data === null
          ? []
          : data?.AdvanceForm.length === 0
          ? []
          : JSON.parse(data?.AdvanceForm);
      let layout: any = [];
      let layoutLabel: any = [];
      _dataAdvanceForm.items.map((_data: any) => {
        layout.push(_data.layout);
      });
      layout.map((_data: any) => {
        if (_data.length > 1) {
          _data.map((data: any) => {
            if (data.template.label.length !== 0) {
              layoutLabel.push(data.template.label);
            }
          });
        } else {
          if (_data[0].template.label.length !== 0) {
            layoutLabel.push(_data[0].template.label);
          }
        }
      });
      setFormSelect(data);
      setEmailTemplateObj((prevState: any) => ({
        ...prevState,
        TemplateId: data.TemplateId,
        TemplateDocumentCode: data.TemplateNameWithCode,
        TemplateName: data.TemplateName,
      }));
      setFormSelectLabel(layoutLabel);
    }
  }
  const confirmDialogButton = () => {
    return (
      <>
        <Toast ref={toast}></Toast>
        <ConfirmDialog
          visible={visibleConfirmDialog}
          onHide={() => setVisibleConfirmDialog(false)}
          message="Are you sure you want to proceed?"
          header="Confirmation"
          icon="pi pi-exclamation-triangle"
          accept={onSave}
          reject={() => {
            setVisibleConfirmDialog(false);
          }}
          blockScroll
          draggable={false}
          resizable={false}
        />
      </>
    );
  };
  return (
    <>
      {confirmDialogButton()}
      <div className="request-main-container">
        <div className="request-container">
          <div className="header-request set-z-index">
            <div className="button-container">
              <Button
                type="text"
                icon={<IoMenu size={28} />}
                size="large"
                onClick={toggleSideBar}
                style={{ background: "transparent " }}
              />
              <TreeSelectNewRequest
                setDataTemplateTreeProps={setDataTreeSelectProps}
              />
            </div>

            <div className="confirm-container-Create-Email">
              <p className="p-Create-Email-Template">Create Email Template</p>
              <div className="button-container-Create-Email-Template">
                <ButtonComponents
                  setLabelProps="Back"
                  setIconProps={
                    <IoArrowBackSharp
                      size={"16px"}
                      style={{ marginRight: "3px" }}
                    />
                  }
                  onClickProps={() => onSave()}
                  setStyleProps={{
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid #F2F2F2",
                    fontSize: "13px",
                    background: "#F2F2F2",
                    color: "#282F6A",
                    width: "120px",
                  }}
                />
                <ButtonComponents
                  setLabelProps="Save"
                  setIconProps={
                    <BiSave size={"16px"} style={{ marginRight: "3px" }} />
                  }
                  onClickProps={() => setVisibleConfirmDialog(true)}
                  setStyleProps={{
                    borderRadius: "6px",
                    border: "1px solid rgb(40, 47, 106)",
                    fontSize: "13px",
                    width: "120px",
                    height: "32px",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="inner-content">
            <div className="worklist-items-container">
              {sidebarState ? (
                <div className="inner-content show-tablet-navbar-request-max-1024">
                  <div className="filter-container">
                    <Row>
                      <Col xs={12} md={12} lg={12} xl={12}>
                        <TextHeaderComponents
                          textHeaderProps={"Form Select"}
                          textSubProps={"เลือกแบบฟอร์มที่ต้องการ"}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                      <Col xs={12} md={12} lg={12} xl={12}>
                        <DropdownComponents
                          placeholderProps={
                            formSelect === undefined || formSelect == null
                              ? "-- Please Select --"
                              : Object.keys(formSelect).length !== 0
                              ? formSelect.TemplateNameWithCode.length !== 0
                                ? formSelect.TemplateNameWithCode
                                : "-- Please Select --"
                              : "-- Please Select --"
                          }
                          styleProps={{
                            width: "240px",
                            borderRadius: "6px 6px 6px 6px",
                          }}
                          optionLabelProps="TemplateNameWithCode"
                          optionsProps={template}
                          onChangeProps={_templateDropdown}
                          valueProps={formSelect}
                          keyProps={"FormSelect"}
                          filterProps={true}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={12} lg={12} xl={12}>
                        {formSelectLabel.length !== 0 ? (
                          <>
                            {formSelectLabel.map((data: any) => {
                              return (
                                <>
                                  <ButtonComponents
                                    setLabelProps={data}
                                    onClickProps={() => onClickSelect(data)}
                                    setStyleProps={{
                                      borderRadius: "6px",
                                      border: "1px solid  #F1F1F1 ",
                                      fontSize: "13px",
                                      width: "100%",
                                      height: "38px",
                                      marginBottom: "10px",
                                      background: "#F1F1F1",
                                      color: "#262A2D",
                                    }}
                                  />
                                </>
                              );
                            })}
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="request-container-item">
                <EmailTemplateDetail
                  clickSelectProps={clickSelect}
                  dataProps={emailTemplateObj}
                  setDataProps={setEmailTemplateObj}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withPerMission(EmailTemplateDetailScreen);
