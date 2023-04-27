import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Spin, Space, Input } from "antd";
import { Toast } from "primereact/toast";

import React, { useEffect, useState, FC } from "react";
import { IMemoPageModel } from "../../../IRequestModel/IMemoPageModel";
import { CoreControllerComponentTest } from "../CoreControllerComponent/CoreControllerComponentTest";
import { Col, Row } from "react-bootstrap";
import { Badge } from "primereact/badge";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import moment from "moment";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";
import { AutoComplete } from "primereact/autocomplete";
import { formatDateTime } from "../../../Helper/FormatDateTime";
import { useUserContext } from "../../../Context/UserContext";
import { Dropdown } from "primereact/dropdown";
import LeaveTypeComponents from "./LeaveTypeComponents/LeaveTypeComponents";
import TinyMceComponent from "../../TinyMceComponent/TinyMceComponent";
import TableReferenceComponent from "./RefTemplateComponent/TableRefTemplateComponent";
import DialogRefTemplateComponent from "./RefTemplateComponent/DialogRefTemplateComponent";
import TemplateVersionComponent from "./TemplateVersionComponent/TemplateVersionComponent";
import { INumberFormula } from "../../../IRequestModel/INumberFormula";
import { IAutoNumberAttibute } from "../../../IRequestModel/IAutoNumberFormat";
import { IRvsAttribute } from "../../../IRequestModel/IRvision";
import { ILogic } from "../../../IRequestModel/ILogicModel";
import { tableSelectOption } from "../../AntdControlComponent/TableComponent/TableComponent";
type Props = {
  t: any;
  memoDetail: any;
  setMemoDetail: any;
  masterCompanies: any;
  masterEmployee: any;
  canEditDoc: boolean;
  control: any;
  register: any;
  handleSubmit: any;
  onSubmit: any;
  setListInToAndPass: any;
  listInToAndPass: any;
  masterProjects: any;
  project: any;
  setProject: any;
  finFo: any;
  isBranchFromADTitle: boolean;
  checkedLeaveTemplate: boolean | undefined;
  leaveTypeTable: any;
  errors: any;
  isTextFromValue: boolean;
  setTextFromValue: any;
  textFromValue: any;
  refTempSelected: any;
  setRefTempSelected: any;
  setSearchRefDocData: any;
  searchRefDocData: any;
  refAttribute: any;
  refOptions: any[];
  templateListVersion: any;
  selectedTemplateVersion: any;
  setSelectedTemplateVersion: any;
  isTemplateVersion: boolean;
  dialogVisibleInRefTemplate: boolean;
  setDialogVisibleInRefTemplate: (value: boolean) => void;
  allLogic: any;
  reset: any;
  onControlChange: any;
  jsonConditions: any;
  setJsonConditions: any;
  numFormulas: INumberFormula[];
  lineApproval: any;
  setLineApproval: (value: any[]) => void;
  autoNumFormat: IAutoNumberAttibute;
  setValue: any;
  checkActionPage: string;
  buttonType: string;
  isControlLoading: boolean;
  setIsControlLoading: (valaue: boolean) => void;
  getLineApproveForAmount: (amount: number, jsonCondition: string) => void;
  previousView: any;
  tableSummaries: any;
  setTableSummaries: (value: any[]) => void;
  isFirstRun: any;
  listFormNames: any;
  setListRefDocDetails: (value: any[]) => void;
  isShowSum: boolean;
  canEditRefDoc: boolean;
  refLoading: boolean;
  previousRefTempSelected: any;
  setListFileAttachDetails: (value: any[]) => void;
  prepareInitialLogic: (logics: ILogic[], templateDesc: any) => void;
  onProcessLogicReference: (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    control: any
  ) => Promise<{
    loadTo: any[];
    data: any[];
    row: number;
    col: number;
  } | null>;
  tableOptions: tableSelectOption[];
  setTableOptions: (value: tableSelectOption[]) => void;
};

const InformationComponentFix: FC<Props> = ({
  t,
  onProcessLogicReference,
  isFirstRun,
  memoDetail,
  setMemoDetail,
  canEditDoc,
  masterCompanies,
  masterEmployee,
  control,
  register,
  previousRefTempSelected,
  isShowSum,
  refOptions,
  canEditRefDoc,
  handleSubmit,
  setListFileAttachDetails,
  onSubmit,
  setListInToAndPass,
  listInToAndPass,
  masterProjects,
  setProject,
  project,
  finFo,
  isBranchFromADTitle,
  checkedLeaveTemplate,
  leaveTypeTable,
  errors,
  isTextFromValue,
  setTextFromValue,
  textFromValue,
  refTempSelected,
  setRefTempSelected,
  setSearchRefDocData,
  searchRefDocData,
  refAttribute,
  templateListVersion,
  setSelectedTemplateVersion,
  selectedTemplateVersion,
  isTemplateVersion,
  dialogVisibleInRefTemplate,
  setDialogVisibleInRefTemplate,
  allLogic,
  reset,
  onControlChange,
  jsonConditions,
  setJsonConditions,
  numFormulas,
  setLineApproval,
  autoNumFormat,
  lineApproval,
  setValue,
  checkActionPage,
  buttonType,
  isControlLoading,
  setIsControlLoading,
  getLineApproveForAmount,
  previousView,
  tableSummaries,
  setTableSummaries,
  listFormNames,
  setListRefDocDetails,
  refLoading,
  prepareInitialLogic,
  tableOptions,
  setTableOptions,
}) => {
  const [dialogVisibleInCompany, setDialogVisibleInCompany] = useState(false);
  const [dialogVisibleInEmployee, setDialogVisibleInEmployee] = useState(false);
  const [userData, setUserData] = useUserContext();
  const [hideProject, setIsHideProject] = useState(false);
  const [hideBranch, setIsHideBranch] = useState(false);
  const [hideTo, setIsHideTo] = useState(false);
  const [hideCc, setIsHideCc] = useState(false);
  const [hideSubject, setIsHideSubject] = useState(false);
  const [typeEmployeeDialog, setTypeEmployeeDialog] = useState<string>("");
  const [filteredEmployee, setFilteredEmployee] = useState<any>([]);
  const [filterCompany, setFilterCompany] = useState<any>();

  useEffect(() => {
    checkHasFifoFunction();
  }, []);

  function checkHasFifoFunction() {
    var _finFo = finFo;
    if (_finFo) {
      if (_finFo.Value4?.toLowerCase() === "true") {
        if (_finFo.Value1 && _finFo.Value2) {
          const _display = _finFo.Value1.split("|");
          const _dataReplace = _finFo.Value2.split("|");
          for (let index = 0; index < _display.length; index++) {
            const element = _display[index];
            const element2 = _dataReplace[index];
            var documentElement: any = document.getElementById(
              element
            ) as HTMLDivElement | null;
            if (documentElement) {
              documentElement.innerHTML = element2;
            }
          }
        }
        if (_finFo.Value3) {
          setIsHideProject(true);
        }
        if(_finFo.Value5 !== "" && _finFo.Value5 !== null){
          const _showBranch = _finFo.Value5.split("|");
          if(_showBranch.length >= 1){
            if (_showBranch[0]=="true") {
              setIsHideBranch(true);
            }
          }
          if(_showBranch.length >= 2){
            if (_showBranch[1] ==="true") {
              setIsHideTo(true);
            }
          }
          if(_showBranch.length >= 3){
            if (_showBranch[2] ==="true") {
              setIsHideCc(true);
            }
          }
          if(_showBranch.length >= 4){
            if (_showBranch[3] ==="true") {
              setIsHideSubject(true);
            }
          }
        }  
      }
    }
  }

  function showModalCompany() {
    if (filterCompany != "") {
      setFilterCompany("");
    }
    setDialogVisibleInCompany(!dialogVisibleInCompany);
  }

  const onSelectedCompany = (event: any) => {
    let com_name = event.data.CompanyCode + " : ";
    if (userData.Lang === "EN") {
      com_name = com_name + event.data.NameEn;
    } else {
      com_name = com_name + event.data.NameTh;
    }
    setMemoDetail((prevState: any) => ({
      ...prevState,
      company_id: event.data.CompanyId,
      company_name: com_name,
      checkChangeComp: true
    }));
    setDialogVisibleInCompany(false);
  };

  const searchEmployeeToAndPass = (event: any) => {
    setTimeout(() => {
      let _filteredEmployee;
      if (!event.query.trim().length) {
        _filteredEmployee = [...masterEmployee];
      } else {
        _filteredEmployee = masterEmployee.filter((_dataEmployee: any) => {
          if (
            _dataEmployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return true;
          } else if (
            _dataEmployee.NameTh.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return true;
          } else if (
            _dataEmployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return true;
          } else if (
            _dataEmployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return true;
          }
        });
      }

      setFilteredEmployee(_filteredEmployee);
    }, 250);
  };

  function showModalInEmployeeToAndPass(type: string) {
    if (filteredEmployee) {
      setFilteredEmployee("");
    }
    setDialogVisibleInEmployee(!dialogVisibleInEmployee);
    console.log({ type });

    setTypeEmployeeDialog(type);
  }

  function insertDataByEnter(event: any, type: any) {
    console.log({ event, type });

    if (!event) {
      return;
    }
    if (type === "to") {
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        to: [...listInToAndPass.to, ...event],
      }));
    } else if (type === "pass") {
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        pass: [...listInToAndPass.pass, ...event],
      }));
    }
  }
  function onSelectedEmployeeToAndPass(event: any) {
    let checkValue: boolean = false;
    console.log({ event });

    const _value =
      userData.Lang === "EN" ? event.data.NameEn : event.data.NameTh;
    if (typeEmployeeDialog === "to") {
      let _components = listInToAndPass;
      _components.to.filter((_item: any) => {
        if (_value === _item) {
          checkValue = true;
        }
      });
      if (checkValue) {
        setDialogVisibleInEmployee(false);
        return;
      }
      _components.to.push(_value);
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        to: [..._components.to],
      }));
    } else if (typeEmployeeDialog === "pass") {
      let _components = listInToAndPass;
      _components.pass.filter((_item: any) => {
        if (_value === _item) {
          checkValue = true;
        }
      });
      if (checkValue) {
        setDialogVisibleInEmployee(false);
        return;
      }
      _components.pass.push(_value);
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        pass: [..._components.pass],
      }));
    }
    setDialogVisibleInEmployee(false);
  }
  function selecteOrTypeListInToAndPass(event: any, type: any) {
    const _value = event.value.map((item: any) => {
      if (!(typeof item === "string")) {
        return item.NameEn;
      } else {
        return item;
      }
    });
    if (type === "to") {
      let _components = listInToAndPass.to;
      _components = [..._value];
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        to: [..._components],
      }));
    } else if (type === "pass") {
      let _components = listInToAndPass.pass;
      _components = [..._value];
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        pass: [..._components],
      }));
    }
  }
  return (
    <div
      onClick={() => {
        console.log("info=>listInToAndPass", listInToAndPass);
      }}
    >
      <Row className="set-layout-in-row-respone">
        <Col sm={6} xs={12} style={{ alignItems: "center" }}>
          <div className="badge-display-justify-content">
            <div className="Col-text-header-Inform">{t("information")}</div>
          </div>
          <p
            style={{
              color: "#B4B4B4",
              fontSize: "13px",
            }}
          >
            {memoDetail.template_name}
            {/* memoDetail.template_code + ": " +  */}
          </p>
        </Col>
        <Col sm={6} xs={12} className="set-css-display-flex-status">
          <Badge
            value={t(memoDetail?.status)}
            className="set-css-status-new"
            style={{
              color: "#FFFFFF",
              background:
                memoDetail?.status === "Wait for Approve"
                  ? "#282f6a"
                  : memoDetail?.status === "Recall"
                  ? "#F8A51C"
                  : memoDetail?.status === "Draft"
                  ? "#B4B4B4"
                  : memoDetail?.status === "Completed"
                  ? "#28a745"
                  : memoDetail?.status === "New Request"
                  ? "#2769B2"
                  : memoDetail?.status === "Rework"
                  ? "#F8A51C"
                  : memoDetail?.status === "Cancelled"
                  ? "#dc3545"
                  : memoDetail?.status === "Rejected"
                  ? "#dc3545"
                  : memoDetail?.status === "Wait for Comment"
                  ? "#06BEE1"
                  : "",
            }}
          ></Badge>
          <p className="set-css-doc-code-respone">{memoDetail?.document_no}</p>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="Col-text-header"></p>
        </Col>
      </Row>
      <div className="Information-panding-card">
        <Row className=" ">
          <Col xs={4} sm={2} xl={2}>
            <tr>
              <th>
                <p
                  id="lbl_Info_RequestDate_EN"
                  className="information-text-header-p"
                >
                  Request Date
                </p>
                <p
                  id="lbl_Info_RequestDate_TH"
                  className="information-text-sub-p"
                >
                  วันที่ร้องขอเอกสาร
                </p>
              </th>
            </tr>
          </Col>

          <Col xs={8} sm={10} xl={6}>
            <div
              className="information-inputTexta-width"
              style={{ color: "#b4b4b4", fontSize: "13px" }}
            >
              {formatDateTime(memoDetail?.request_date)}
            </div>
          </Col>
        </Row>
        <Row className=" ">
          <Col xs={12} sm={12} xl={2}>
            <tr>
              <th>
                <div className="label-text-container">
                  <span
                    id="lbl_Info_Company_EN"
                    className="information-text-header-p"
                  >
                    Company
                  </span>
                  <span className="headtext-form set-text-information-require">
                    {" "}
                    *
                  </span>
                </div>
                <p id="lbl_Info_Company_TH" className="information-text-sub-p">
                  บริษัท
                </p>
              </th>
            </tr>
          </Col>

          <Col xs={12} sm={12} xl={4}>
            <div
              className="p-inputgroup"
              style={{
                height: "38px",
                width: "100% ",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <InputTextComponents
                setClassNameProps="information-inputTexta-width-inputText-company"
                setStyleDivProps={{ flex: "1" }}
                valueProps={memoDetail?.company_name}
                placeholderProps={"Select"}
                disabledProps={!canEditDoc}
                setStyleProps={{
                  height: "38px",
                  width: "100% ",
                  fontSize: "13px",
                }}
                onClickProps={showModalCompany}
                readOnlyProps={true}
              />
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={showModalCompany}
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: "38px",
                }}
                disabledProps={!canEditDoc}
              />
            </div>
          </Col>
          {!hideBranch && (
            <>
              <Col xs={12} sm={12} xl={2}>
                <tr>
                  <th>
                    <p
                      id="lbl_Info_Branch_EN"
                      className="information-text-header-p"
                    >
                      Branch
                    </p>
                    <p
                      id="lbl_Info_Branch_TH"
                      className="information-text-sub-p"
                    >
                      สาขา
                    </p>
                  </th>
                </tr>
              </Col>

              <Col xs={12} sm={12} xl={4}>
                <InputTextComponents
                  setStyleProps={{ height: 38 }}
                  setClassNameProps={"information-inputTexta-width"}
                  placeholderProps={""}
                  disabledProps={true}
                  valueProps={
                    isBranchFromADTitle && memoDetail?.requestor?.ADTitle
                      ? memoDetail?.requestor?.ADTitle
                      : ""
                  }
                />
              </Col>
            </>
          )}
        </Row>

        <Row className="">
          {!hideTo && (
            <>
          <Col xs={12} xl={2}>
            <tr>
              <th>
                <p id="lbl_Info_To_EN" className="information-text-header-p">
                  To
                </p>
                <p id="lbl_Info_To_TH" className="information-text-sub-p">
                  เรียน
                </p>
              </th>
            </tr>
          </Col>
          
          <Col xs={12} xl={10}>
            <div
              className="p-inputgroup "
              style={{
                height: `${listInToAndPass.to?.length > 0 ? "100%" : "38px"}`,
              }}
            >
              <AutoComplete
                value={listInToAndPass.to}
                suggestions={filteredEmployee}
                completeMethod={searchEmployeeToAndPass}
                field={"NameTh"}
                className="information-autoComplete"
                multiple
                panelClassName="information-autoComplete-panel"
                disabled={!canEditDoc}
                onKeyPress={(e: any) => {
                  if (e.code === "Enter") {
                    let auto = e.target.value.split(",");
                    insertDataByEnter(auto, "to");
                    e.target.value = "";
                  }
                }}
                onChange={(e) => selecteOrTypeListInToAndPass(e, "to")}
              />
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={() => showModalInEmployeeToAndPass("to")}
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: "100%",
                }}
                disabledProps={!canEditDoc}
              />
            </div>
          </Col>
          </>
          )}
        </Row>

        <Row className="">
          {!hideCc && (
            <>
          <Col xs={12} xl={2}>
            <tr>
              <th>
                <p id="lbl_Info_CC_EN" className="information-text-header-p">
                  Cc
                </p>
                <p id="lbl_Info_CC_TH" className="information-text-sub-p">
                  สำเนา
                </p>
              </th>
            </tr>
          </Col>
          <Col xs={12} xl={10}>
            <div
              className="p-inputgroup "
              style={{
                height: `${listInToAndPass.pass?.length > 0 ? "100%" : "38px"}`,
              }}
            >
              <AutoComplete
                value={listInToAndPass.pass}
                suggestions={filteredEmployee}
                completeMethod={searchEmployeeToAndPass}
                field={userData.Lang === "TH" ? "NameTh" : "NameEn"}
                className="information-autoComplete"
                multiple
                panelClassName="information-autoComplete-panel"
                disabled={!canEditDoc}
                onKeyPress={(e: any) => {
                  if (e.code === "Enter") {
                    let auto2 = e.target.value.split(",");
                    insertDataByEnter(auto2, "pass");
                    e.target.value = "";
                  }
                }}
                onChange={(e) => selecteOrTypeListInToAndPass(e, "pass")}
              />
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={() => showModalInEmployeeToAndPass("pass")}
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: "100%",
                }}
                disabledProps={!canEditDoc}
              />
            </div>
          </Col>
          </>
          )}
        </Row>
        {!hideProject && (
          <Row className=" ">
            <Col xs={12} sm={12} xl={2}>
              <tr>
                <th>
                  <p className="information-text-header-p">Project</p>
                  <p className="information-text-sub-p">โครงการ</p>
                </th>
              </tr>
            </Col>
            <Col xs={12} sm={12} xl={10}>
              <Dropdown
                options={masterProjects}
                value={project}
                onChange={(event: any) => {
                  setProject(event.value);
                }}
                filter
                virtualScrollerOptions={{
                  itemSize: 38,
                }}
                panelStyle={{ fontSize: "13px" }}
                optionLabel="ProjectNameWithCode"
                placeholder={"Select Project"}
                className="information-inputTexta-width-Button-Company"
                style={{
                  borderRadius: "6px",
                  height: 38,
                  fontSize: "13px",
                }}
                disabled={!canEditDoc}
              />
            </Col>
          </Row>
        )}
        <Row className=" ">
          {!hideSubject && (
            <>
          <Col xs={12} sm={12} xl={2}>
            <tr>
              <th>
                <div className="label-text-container">
                  <span
                    id="lbl_Info_Subject_EN"
                    className="information-text-header-p"
                  >
                    Subject
                  </span>
                  <span className="headtext-form set-text-information-require">
                    {" "}
                    *
                  </span>
                </div>
                <p id="lbl_Info_Subject_TH" className="information-text-sub-p">
                  เรื่อง
                </p>
              </th>
            </tr>
          </Col>
          <Col xs={12} sm={12} xl={10}>
            <InputTextComponents
              setClassNameProps="information-inputTexta-width"
              setStyleProps={{ height: 38 }}
              onChangeProps={(event: any) => {
                setMemoDetail((prevState: any) => ({
                  ...prevState,
                  subject: event,
                }));
              }}
              valueProps={memoDetail.subject}
              disabledProps={!canEditDoc}
            />
          </Col>
          </>
          )}
        </Row>
        {refAttribute?.mode && refAttribute?.position === "Top" && (
          <>
            {canEditRefDoc ? (
              <>
                <Row>
                  <Col xs={12} sm={12} xl={2}>
                    <tr>
                      <th>
                        <div className="label-text-container">
                          <p className="information-text-header-p">
                            Reference Template
                          </p>
                          {/* <span className="headtext-form text-Is-require">*</span> */}
                        </div>
                        <p className="information-text-sub-p">เอกสารอ้างอิง</p>
                      </th>
                    </tr>
                  </Col>
                  <Col xs={12} sm={12} xl={10}>
                    <ButtonComponents
                      setIconProps={"pi pi-plus"}
                      setClassNameProps={"p-button-text-position"}
                      onClickProps={() => {
                        setDialogVisibleInRefTemplate(true);
                      }}
                      setLabelProps={"Add"}
                      loading={refLoading}
                      setStyleProps={{
                        backgroundColor: "#282f6a",
                        border: "1px solid #282f6a",
                        borderTopRightRadius: "6px",
                        borderBottomRightRadius: "6px",
                        boxShadow: "none",
                        height: "38px",
                      }}
                      disabledProps={!canEditDoc}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} xl={2}></Col>
                  <Col xs={12} sm={12} xl={10}>
                    <TableReferenceComponent
                      canEditDoc={canEditDoc}
                      refLoading={refLoading}
                      refAttribute={refAttribute}
                      refTempSelected={refTempSelected}
                      setRefTempSelected={setRefTempSelected}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col xs={12} sm={12} xl={2}>
                    <tr>
                      <th>
                        <div className="label-text-container">
                          <p className="information-text-header-p">
                            Reference Template
                          </p>
                          {/* <span className="headtext-form text-Is-require">*</span> */}
                        </div>
                        <p className="information-text-sub-p">เอกสารอ้างอิง</p>
                      </th>
                    </tr>
                  </Col>
                  <Col xs={12} sm={12} xl={10}>
                    <TableReferenceComponent
                      canEditDoc={canEditDoc}
                      refLoading={refLoading}
                      refAttribute={refAttribute}
                      refTempSelected={refTempSelected}
                      setRefTempSelected={setRefTempSelected}
                    />
                  </Col>
                </Row>
              </>
            )}
          </>
        )}

        <Row>
          {checkedLeaveTemplate && (
            <LeaveTypeComponents leaveTypeTable={leaveTypeTable} />
          )}
        </Row>
        {isTemplateVersion && (
          <TemplateVersionComponent
            status={memoDetail?.status}
            setSelectedTemplateVersion={setSelectedTemplateVersion}
            selectedTemplateVersion={selectedTemplateVersion}
            templateListVersion={templateListVersion}
            canEditDoc={canEditDoc}
          />
        )}
        <Row></Row>
        <Row>
          {!isTextFromValue && (
            <CoreControllerComponentTest
              refTempSelected={refTempSelected}
              listFormNames={listFormNames}
              setListRefDocDetails={setListRefDocDetails}
              refAttribute={refAttribute}
              numFormulas={numFormulas}
              setLineApproval={setLineApproval}
              setListFileAttachDetails={setListFileAttachDetails}
              {...{
                tableOptions,
                setTableOptions,
                onProcessLogicReference,
                prepareInitialLogic,
                isFirstRun,
                previousView,
                previousRefTempSelected,
                buttonType,
                control,
                register,
                handleSubmit,
                onSubmit,
                errors,
                onControlChange,
                allLogic,
                reset,
                memoDetail,
                jsonConditions,
                setJsonConditions,
                setValue,
                canEditDoc,
                checkActionPage,
                isControlLoading,
                setIsControlLoading,
                tableSummaries,
                setTableSummaries,
              }}
              templateDesc={memoDetail?.template_desc}
              setMemoDetail={setMemoDetail}
              documentNo={memoDetail.document_no} // control={control}
              autoNumFormat={autoNumFormat}
              lineApproval={lineApproval}
              getLineApproveForAmount={getLineApproveForAmount}
            />
          )}
          {isTextFromValue && (
            <TinyMceComponent
              setTextFromValue={setTextFromValue}
              textFromValue={textFromValue}
            />
          )}
        </Row>
        {isShowSum && (
          <Row>
            <Col></Col>
            <Col>
              <Row>
                <Col
                  xl={8}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <p>All Total</p>
                </Col>
                <Col xl={4}>
                  <Input value={memoDetail.amount} readOnly id="AllTotal" />
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
      {refAttribute?.mode && refAttribute?.position === "Bottom" && (
        <>
          {canEditDoc ? (
            <>
              <Row>
                <Col xs={12} sm={12} xl={2}>
                  <tr>
                    <th>
                      <div className="label-text-container">
                        <p className="information-text-header-p">
                          Reference Template
                        </p>
                        {/* <span className="headtext-form text-Is-require">*</span> */}
                      </div>
                      <p className="information-text-sub-p">เอกสารอ้างอิง</p>
                    </th>
                  </tr>
                </Col>
                <Col xs={12} sm={12} xl={10}>
                  <ButtonComponents
                    setIconProps={"pi pi-plus"}
                    setClassNameProps={"p-button-text-position"}
                    onClickProps={() => {
                      setDialogVisibleInRefTemplate(true);
                    }}
                    loading={refLoading}
                    setLabelProps={"Add"}
                    setStyleProps={{
                      backgroundColor: "#282f6a",
                      border: "1px solid #282f6a",
                      borderTopRightRadius: "6px",
                      borderBottomRightRadius: "6px",
                      boxShadow: "none",
                      height: "38px",
                    }}
                    disabledProps={!canEditDoc}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} xl={2}></Col>
                <Col xs={12} sm={12} xl={10}>
                  <TableReferenceComponent
                    canEditDoc={canEditDoc}
                    refLoading={refLoading}
                    refAttribute={refAttribute}
                    refTempSelected={refTempSelected}
                    setRefTempSelected={setRefTempSelected}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <Col xs={12} sm={12} xl={2}>
                  <tr>
                    <th>
                      <div className="label-text-container">
                        <p className="information-text-header-p">
                          Reference Template
                        </p>
                        {/* <span className="headtext-form text-Is-require">*</span> */}
                      </div>
                      <p className="information-text-sub-p">เอกสารอ้างอิง</p>
                    </th>
                  </tr>
                </Col>
                <Col xs={12} sm={12} xl={10}>
                  <TableReferenceComponent
                    canEditDoc={canEditDoc}
                    refLoading={refLoading}
                    refAttribute={refAttribute}
                    refTempSelected={refTempSelected}
                    setRefTempSelected={setRefTempSelected}
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}
      <>
        <SelectDataDialog
          dialogKey={"masterCompanies"}
          dataList={masterCompanies}
          onSelectFunc={onSelectedCompany}
          columns={[
            {
              field: "CompanyCode",
              headerEn: "CompanyCode",
              headerTh: "รหัสบริษัท",
            },
            {
              field: "NameEn",
              headerEn: "Name",
              headerTh: "ชื่อ",
            },
            {
              field: "AddressEn",
              headerEn: "Address",
              headerTh: "ที่อยู่",
            },
          ]}
          dialogVisible={dialogVisibleInCompany}
          setDialogVisible={setDialogVisibleInCompany}
        />
        <SelectDataDialog
          dialogKey={"employeeData"}
          dataList={masterEmployee}
          onSelectFunc={onSelectedEmployeeToAndPass}
          columns={[
            {
              field: "EmployeeCode",
              headerEn: "EmployeeCode",
              headerTh: "รหัสพนักงาน",
            },
            {
              field: "NameEn",
              headerEn: "Name",
              headerTh: "ชื่อ",
            },
            {
              field: "PositionNameEn",
              headerEn: "Position",
              headerTh: "ตำแหน่ง",
            },
            {
              field: "DepartmentNameEn",
              headerEn: "Department",
              headerTh: "หน่วยงาน",
            },
          ]}
          dialogVisible={dialogVisibleInEmployee}
          setDialogVisible={setDialogVisibleInEmployee}
        />
        {refAttribute?.mode && (
          <DialogRefTemplateComponent
            refAttribute={refAttribute}
            dialogVisibleInRefTemplate={dialogVisibleInRefTemplate}
            setDialogVisibleInRefTemplate={setDialogVisibleInRefTemplate}
            refTempSelected={refTempSelected}
            refObtions={refOptions}
            setRefTempSelected={setRefTempSelected}
            setSearchRefDocData={setSearchRefDocData}
            searchRefDocData={searchRefDocData}
            previousRefTempSelected={previousRefTempSelected}
          />
        )}
      </>
    </div>
  );
};

export default InformationComponentFix;
