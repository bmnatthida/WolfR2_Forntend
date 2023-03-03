import { AutoComplete } from "antd";
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useUserContext } from "../../../Context/UserContext";
import { GetDepartment } from "../../../Services/DepartmentService";
import { GetAllEmployee } from "../../../Services/EmployeeService";
import AutoCompleteComponents from "../../AutoCompleteComponents/AutoCompleteComponents";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import EmployeeDialog from "../../DataFechDialogComponents/EmployeeDialog/EmployeeDialog";
import { DropdownComponents } from "../../DropdownComponents/DropdownComponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { RadioButtonComponents } from "../../RadioButtonComponents/RadioButtonComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";

import "../TemplateDetailComponents.css";
interface Props {
  InformationDataProps: any;
  setControlModelObj?: any;
  state?: string;
  checkValidation?: any;
  isLoadProps: any;
  groupDataTemplate: any;
  setGroupDataTemplate: any;
}

export const InformationComponents = (props: Props) => {
  const [departmentList, setDepartmentList] = useState<any>({});
  const [informationDataProps, setInformationDataPropst] = useState<any>({
    ...props.InformationDataProps,
  });
  const [filteredAutoComplete, setFilteredAutoComplete] = useState<any>();
  const [key, setKey] = useState<any>();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [employee, setEmployee] = useState<any>({});
  const [departmentSelect, setDepartmentSelect] = useState<any>({});
  const [toSelect, setToSelect] = useState<any>([]);
  const [ccSelect, setCcSelect] = useState<any>([]);
  const [userData, setUserData] = useUserContext();
  const [categoryFilter, setCategoryFilter] = useState<any>(
    props.groupDataTemplate
  );
  useEffect(() => {
    if (
      Object.keys(departmentList).length === 0 &&
      Object.keys(employee).length === 0
    ) {
      _fechDepartment();
      _fechEmployee();
      dataToAndCC(employee);
    }
  }, [departmentList, employee]);

  useEffect(() => {
    if (
      Object.keys(departmentList).length !== 0 &&
      Object.keys(employee).length !== 0
    ) {
      dataToAndCC(employee);
    }
  }, [props.InformationDataProps]);

  async function dataToAndCC(employeeData: any) {
    try {
      let _to =
        props.InformationDataProps.templateForm.ToId.length === 0
          ? []
          : props.InformationDataProps.templateForm.ToId.split(",");

      let _cc =
        props.InformationDataProps.templateForm.CcId.length === 0
          ? []
          : props.InformationDataProps.templateForm.CcId.split(",");
      let _employeeData =
        Object.keys(employeeData).length === 0 ? [] : employeeData;
      if (_employeeData.length === 0) return;
      let _toArray: any = [];
      let _ccArray: any = [];
      if (_to.length !== 0) {
        for (let i = 0; i < _employeeData.length; i++) {
          for (let j = 0; j < _to.length; j++) {
            if (_employeeData[i].NameEn === _to[j]) {
              if (_toArray.length != 0) {
                let _dataFilter = _toArray.filter(
                  (item: any) => item.NameEn === _employeeData[i].NameEn
                );
                if (_dataFilter.length === 0) {
                  _toArray.push(_employeeData[i]);
                }
              } else {
                _toArray.push(employee[i]);
              }
            }
          }
        }

        if (_to.length !== _toArray.length) {
          let _dataFilter = _to.filter((data: any) => {
            let _data = _toArray.filter((_data: any) => _data.NameEn === data);
            if (_data.length === 0) {
              let _event = {
                AccountCode: "",
                AccountName:
                  "                                                                                                                                                                                                                                             ",
                CreatedBy: null,
                CreatedDate: "",
                DefaultLang: "EN",
                DepartmentId: null,
                DepartmentNameEn: "",
                DepartmentNameTh: "",
                Email: "",
                EmployeeCode: "",
                EmployeeId: null,
                ExpiredDate: "",
                IsActive: true,
                Lang: "EN",
                ModifiedBy: "",
                ModifiedDate: "",
                NameEn: data,
                NameTh: data,
                PositionId: null,
                PositionNameEn: "",
                PositionNameTh: "",
                RegisteredDate: "",
                ReportToEmpCode: "",
                SignPicPath: null,
                Username: "",
              };
              _toArray.push(_event);
            }
          });
        }

        setToSelect(_toArray);
      }
      if (_cc.length !== 0) {
        for (let i = 0; i < _employeeData.length; i++) {
          for (let j = 0; j < _to.length; j++) {
            if (_employeeData[i].NameEn === _to[j]) {
              if (_ccArray.length != 0) {
                let _dataFilter = _ccArray.filter(
                  (item: any) => item.NameEn === _employeeData[i].NameEn
                );
                if (_dataFilter.length === 0) {
                  _ccArray.push(_employeeData[i]);
                }
              } else {
                _ccArray.push(employee[i]);
              }
            }
          }
        }
        _employeeData.filter((_data: any) => {
          let _dataCc = _cc.filter(
            (dataCc: any) => _data.NameTh === dataCc || _data.NameEn === dataCc
          );
          if (_dataCc.length !== 0) {
            _ccArray.push(_data);
          }
        });
        if (_cc.length !== _ccArray.length) {
          let _dataFilter = _cc.filter((data: any) => {
            let _data = _ccArray.filter((_data: any) => _data.NameEn === data);
            if (_data.length === 0) {
              let _event = {
                AccountCode: "",
                AccountName:
                  "                                                                                                                                                                                                                                             ",
                CreatedBy: null,
                CreatedDate: "",
                DefaultLang: "EN",
                DepartmentId: null,
                DepartmentNameEn: "",
                DepartmentNameTh: "",
                Email: "",
                EmployeeCode: "",
                EmployeeId: null,
                ExpiredDate: "",
                IsActive: true,
                Lang: "EN",
                ModifiedBy: "",
                ModifiedDate: "",
                NameEn: data,
                NameTh: data,
                PositionId: null,
                PositionNameEn: "",
                PositionNameTh: "",
                RegisteredDate: "",
                ReportToEmpCode: "",
                SignPicPath: null,
                Username: "",
              };
              _ccArray.push(_event);
            }
          });
        }

        setCcSelect(_ccArray);
      }
    } catch (error) {}
  }

  async function showModal(key: any) {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    setDialogVisible(!isDialogVisible);
    setKey(key);
    _fechEmployee();
    setIsloading(true);
  }

  async function _fechEmployee() {
    const _employee = await GetAllEmployee();
    dataToAndCC(_employee);
    setEmployee(_employee);
    setSearchData(_employee);
    setIsloading(true);
  }

  async function _fechDepartment() {
    const _Department = await GetDepartment();
    let _dataFilter = _Department.filter(
      (_department: any) => _department.NameEn !== null
    );
    if (props.InformationDataProps.templateForm?.DepartmentId !== 0) {
      let _dataFilterDepartmentId = _dataFilter.filter(
        (_department: any) =>
          _department.DepartmentId ===
          props.InformationDataProps.templateForm?.DepartmentId
      );
      setDepartmentSelect(_dataFilterDepartmentId[0]);
    }
    setDepartmentList(_dataFilter);
  }
  async function _DropdownDepartment(data: any, key: any) {
    if (data === undefined || data === null) {
    } else {
      props.setControlModelObj((prevState: any) => ({
        ...prevState,
        templateForm: {
          ...props.InformationDataProps.templateForm,
          DepartmentId: data.DepartmentId,
        },
      }));

      setDepartmentSelect(data);
    }
  }
  async function _RadioButtonFormType(data: any, key: any) {
    if (data) {
      setDepartmentSelect({});
    }
    props.setControlModelObj((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...props.InformationDataProps.templateForm,
        isPublic: data,
        DepartmentId:
          data === false
            ? props.InformationDataProps.templateForm.DepartmentId
            : 0,
      },
    }));
  }
  async function _CheckboxCpmponents(data: any, key: any) {
    props.setControlModelObj((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...props.InformationDataProps.templateForm,
        [key]: data,
      },
    }));
  }
  async function _InputText(data: any, key: any) {
    props.setControlModelObj((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...props.InformationDataProps.templateForm,
        [key]: data,
      },
    }));
  }
  async function _AutoComplete(data: any, key: any) {
    let _ToArray: any = [];
    let _CcArray: any = [];

    if (key === "ToId") {
      let _To = data;
      _To.map((data: any) => {
        if (userData.Lang === "TH") {
          _ToArray.push(data.NameTh);
        } else {
          _ToArray.push(data.NameEn);
        }
      });
      setToSelect(data);
    } else if (key === "CcId") {
      let _Cc = data;
      _Cc.map((data: any) => {
        if (userData.Lang === "TH") {
          _CcArray.push(data.NameTh);
        } else {
          _CcArray.push(data.NameEn);
        }
      });
      setCcSelect(data);
    }
    props.setControlModelObj((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...props.InformationDataProps.templateForm,
        [key]: key === "CcId" ? _CcArray.toString() : _ToArray.toString(),
      },
    }));
  }

  const searchAutoComplete = async (event: any) => {
    const _employee = employee;

    setTimeout(() => {
      let _filteredEmployee;
      if (!event.query.trim().length) {
        _filteredEmployee = [..._employee];
      } else {
        _filteredEmployee = _employee.filter((dataemployee: any) => {
          if (
            dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
        });
      }

      setFilteredAutoComplete(_filteredEmployee);
    }, 250);
  };
  const searchEmployeeEnter = (event: any, key: any) => {
    let dataSelectEmployee: any[] =
      key === "ToId" ? [...toSelect] : [...ccSelect];
    if (event.length !== 0) {
      let _event = {
        AccountCode: "",
        AccountName:
          "                                                                                                                                                                                                                                             ",
        CreatedBy: null,
        CreatedDate: "",
        DefaultLang: "EN",
        DepartmentId: null,
        DepartmentNameEn: "",
        DepartmentNameTh: "",
        Email: "",
        EmployeeCode: "",
        EmployeeId: null,
        ExpiredDate: "",
        IsActive: true,
        Lang: "EN",
        ModifiedBy: "",
        ModifiedDate: "",
        NameEn: event,
        NameTh: event,
        PositionId: null,
        PositionNameEn: "",
        PositionNameTh: "",
        RegisteredDate: "",
        ReportToEmpCode: "",
        SignPicPath: null,
        Username: "",
      };
      dataSelectEmployee.push(_event);
      _AutoComplete(dataSelectEmployee, key === "ToId" ? key : "CcId");
    }
  };
  return (
    <>
      <Row className="0">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p className="Col-text-header-Inform">Information</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: "1.25rem" }}
      >
        <Row className="">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"Form Category:"}
              textSubProps={"ประเภทแบบฟอร์ม:"}
              isRequir={true}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={4}
            style={{ marginTop: "-2px" }}
            className={"informationComponents-media-FormCategory"}
          >
            <AutoComplete
              className={`info-autocomplete set-text-placeholder ${
                props.checkValidation?.GroupTemplateName &&
                props.InformationDataProps?.templateForm?.GroupTemplateName
                  .length === 0
                  ? "set-inter-css"
                  : ""
              }`}
              options={props?.groupDataTemplate}
              value={
                props?.InformationDataProps?.templateForm?.GroupTemplateName
              }
              placeholder={
                props.InformationDataProps.templateForm?.GroupTemplateName !==
                undefined
                  ? props.InformationDataProps.templateForm
                      .GroupTemplateName !== null
                    ? props.InformationDataProps.templateForm.GroupTemplateName
                        .length === 0
                      ? "Form Category"
                      : ""
                    : ""
                  : ""
              }
              filterOption={(inputValue, option) =>
                option?.value
                  ?.toString()
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              onChange={(e: any) => {
                try {
                  let _filtered;
                  let value = e;
                  if (value === "") {
                    _filtered = props.groupDataTemplate;
                  } else {
                    _filtered = props.groupDataTemplate.filter((e: any) => {
                      return e.value
                        ?.toLowerCase()
                        .startsWith(value.toLowerCase());
                    });
                  }

                  setCategoryFilter([..._filtered]);
                  props.setControlModelObj((prevState: any) => ({
                    ...prevState,
                    templateForm: {
                      ...props.InformationDataProps.templateForm,
                      GroupTemplateName: value,
                    },
                  }));
                } catch (error) {
                  console.log("table=>onFilter=>error", error);
                }
              }}
              onSelect={(e: any) => {
                try {
                  setCategoryFilter([...props.groupDataTemplate]);
                  props.setControlModelObj((prevState: any) => ({
                    ...prevState,
                    templateForm: {
                      ...props.InformationDataProps.templateForm,
                      GroupTemplateName: e,
                    },
                  }));
                } catch (error) {
                  console.log("table=>onFilter=>error", error);
                }
              }}
              allowClear
              onClear={() => {
                setCategoryFilter([...props.groupDataTemplate]);
                props.setControlModelObj((prevState: any) => ({
                  ...prevState,
                  templateForm: {
                    ...props.InformationDataProps.templateForm,
                    GroupTemplateName: "",
                  },
                }));
              }}
            />
            {props.checkValidation.GroupTemplateName &&
              props.InformationDataProps.templateForm.GroupTemplateName
                .length === 0 && (
                <small className="p-error">Form Category is required</small>
              )}
          </Col>
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-department"
          >
            <TextHeaderComponents
              textHeaderProps={"Form Name:"}
              textSubProps={"ชื่อแบบฟอร์ม:"}
              isRequir={true}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={4}
            className="informationComponents-media-department"
          >
            <InputTextComponents
              setStyleProps={{
                height: 38,
                borderColor:
                  props.checkValidation.TemplateName === true
                    ? props.InformationDataProps.templateForm.TemplateName
                        .length === 0
                      ? "red"
                      : undefined
                    : undefined,
              }}
              setClassNameProps={"information-inputTexta-width"}
              placeholderProps={
                props.InformationDataProps.templateForm?.TemplateName.length ===
                0
                  ? "Form Name"
                  : null
              }
              valueProps={props.InformationDataProps.templateForm?.TemplateName}
              onChangeProps={_InputText}
              keyProps={"TemplateName"}
            />
            {props.checkValidation.TemplateName &&
              props.InformationDataProps.templateForm.TemplateName.length ===
                0 && <small className="p-error">Form Name is required</small>}
          </Col>
        </Row>

        <Row className="">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"DocType Code:"}
              textSubProps={"รหัสประเภทเอกสาร:"}
              isRequir={true}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={4}
            style={{ marginTop: "-2px" }}
            className="informationComponents-media-FormCategory"
          >
            <div style={{ paddingBottom: "3px" }}>
              <InputTextComponents
                setStyleProps={{
                  height: 38,
                  borderColor:
                    props.checkValidation.DocumentCode === true
                      ? props.InformationDataProps.templateForm.DocumentCode
                          .length === 0
                        ? "red"
                        : undefined
                      : undefined,
                }}
                setClassNameProps={"information-inputTexta-width"}
                placeholderProps={
                  props.InformationDataProps.templateForm?.DocumentCode
                    .length === 0
                    ? "DocType Code"
                    : null
                }
                valueProps={
                  props.InformationDataProps.templateForm?.DocumentCode
                }
                onChangeProps={_InputText}
                disabledProps={props.state === "edit" ? true : false}
                keyProps={"DocumentCode"}
              />
              {props.checkValidation.DocumentCode &&
                props.InformationDataProps.templateForm.DocumentCode.length ===
                  0 && <small className="p-error">DocType is required</small>}
            </div>
          </Col>
        </Row>
        <Row className="">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"To:"}
              textSubProps={"เรียน:"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={10}
            style={{ marginTop: "-2px" }}
            className="informationComponents-media-FormCategory"
          >
            <div className="p-inputgroup">
              <div style={{ paddingBottom: "3px", width: "100%" }}>
                <AutoCompleteComponents
                  completeMethodProps={searchAutoComplete}
                  suggestionsProps={filteredAutoComplete}
                  fieldProps={userData.Lang === "TH" ? "NameTh" : "NameEn"}
                  onChangeProps={_AutoComplete}
                  valueProps={toSelect}
                  keyProps={"ToId"}
                  styleProps={{
                    height: toSelect.length === 0 ? "38px" : "100%",
                    width: "100%",
                  }}
                  onKeyPress={searchEmployeeEnter}
                />
              </div>
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={(data: any) => showModal("ToId")}
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: toSelect.length === 0 ? "38px" : "100%",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row className="">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"Cc:"}
              textSubProps={"สำเนา:"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={10}
            style={{ marginTop: "-2px" }}
            className="informationComponents-media-FormCategory"
          >
            <div className="p-inputgroup">
              <div style={{ paddingBottom: "3px", width: "100%" }}>
                <AutoCompleteComponents
                  completeMethodProps={searchAutoComplete}
                  suggestionsProps={filteredAutoComplete}
                  fieldProps={userData.Lang === "TH" ? "NameTh" : "NameEn"}
                  onChangeProps={_AutoComplete}
                  valueProps={ccSelect}
                  keyProps={"CcId"}
                  styleProps={{
                    width: "100%",
                    height: ccSelect.length === 0 ? "38px" : "100%",
                  }}
                  onKeyPress={searchEmployeeEnter}
                />
              </div>
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={(data: any) => showModal("CcId")}
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: ccSelect.length === 0 ? "38px" : "100%",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row className="">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"Subject:"}
              textSubProps={"เรื่อง:"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            xl={10}
            className="informationComponents-media-FormCategory"
          >
            <div style={{ paddingBottom: "3px" }}>
              <InputTextComponents
                setStyleProps={{ height: 38 }}
                setClassNameProps={"information-inputTexta-width"}
                placeholderProps={
                  props.InformationDataProps.templateForm?.TemplateSubject
                    .length === 0
                    ? "Subject"
                    : null
                }
                valueProps={
                  props.InformationDataProps.templateForm?.TemplateSubject
                }
                onChangeProps={_InputText}
                keyProps={"TemplateSubject"}
              />
            </div>
          </Col>
        </Row>

        <Row className="">
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"PDF Show Info:"}
              textSubProps={"แสดงหัวเอกสาร:"}
            />
          </Col>
          <Col
            xs={12}
            sm={1}
            xl={1}
            className="informationComponents-media-FormCategory"
          >
            <div>
              <CheckboxCpmponents
                checkedProps={
                  props.InformationDataProps.templateForm?.isPDFShowInfo
                }
                onChangeProps={_CheckboxCpmponents}
                keyProps={"isPDFShowInfo"}
              />
            </div>
          </Col>
          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"Can Edit Approver"}
              textSubProps={"สามารถแก้ไขผู้อนุมัติได้:"}
            />
          </Col>
          <Col
            xs={12}
            sm={1}
            xl={1}
            className="informationComponents-media-FormCategory1024px"
          >
            <div>
              <CheckboxCpmponents
                checkedProps={
                  props.InformationDataProps.templateForm
                    ?.isRequesterEditApproval
                }
                onChangeProps={_CheckboxCpmponents}
                keyProps={"isRequesterEditApproval"}
              />
            </div>
          </Col>

          <Col
            xs={12}
            sm={2}
            xl={2}
            className="informationComponents-media-FormCategory-425px"
          >
            <TextHeaderComponents
              textHeaderProps={"Registered Form:"}
              textSubProps={"ฟอร์มสำหรับขึ้นทะเบียน:"}
            />
          </Col>

          <Col
            xs={12}
            sm={1}
            xl={1}
            className="informationComponents-media-FormCategory1024px"
          >
            <div>
              <CheckboxCpmponents
                checkedProps={
                  props.InformationDataProps.templateForm?.isFormControl
                }
                onChangeProps={_CheckboxCpmponents}
                keyProps={"isFormControl"}
              />
            </div>
          </Col>
        </Row>

        <EmployeeDialog
          isDialogVisibleProps={isDialogVisible}
          dataProps={employee}
          setDataProps={setSearchData}
          setisDialogVisibleProps={setDialogVisible}
          showModalProps={showModal}
          keyProps={key}
          onRowSelectProps={_AutoComplete}
          searchDataProps={searchData}
          valueProps={key === "CcId" ? ccSelect : toSelect}
        />
      </div>
    </>
  );
};
