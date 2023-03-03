import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { ButtonComponents } from "../../../ButtonComponents/ButtonComponents";
import { CheckboxCpmponents } from "../../../CheckboxCpmponents/CheckboxCpmponents";
import { DropdownComponents } from "../../../DropdownComponents/DropdownComponents";
import { InputTextComponents } from "../../../InputTextComponents/InputTextComponents";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";
import { AuthorizationTableDepartment } from "../AuthorizationTable/AuthorizationTable";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "primereact/dropdown";
interface PropsDepartment {
  visibleProps?: any;
  setVisibleProps?: any;
  setControlModel?: any;
  departmentListProps?: any;
  keyProps?: any;
  departmentRequestProp?: any;
  departmentManageProp?: any;
}
interface PropsPermission {
  visibleProps?: any;
  setVisibleProps?: any;
  keyAutoComplete?: any;
  roleData?: any;
  setDataTable?: any;
  companyData?: any;
  departmentListProps?: any;
  controlModel?: any;
  advanceFormProps?: any;
  actionProps?: any;
  setDataAuthorization_view?: any;
  setDataAuthorization_viewEdit?: any;

  editTablePermissionProps?: any;
}
interface PropsPermissionEdit {
  visibleProps?: any;
  setVisibleProps?: any;
  keyAutoComplete?: any;
  // roleData?: any;
  // setDataTable?: any;
  // companyData?: any;
  // departmentListProps?: any;
  // controlModel?: any;
  // advanceFormProps?: any;
  // actionProps?: any;
  // setDataAuthorization_view?: any;
  // editTablePermissionProps?: any;
}

export const AuthorizationDepartmentModel = (props: PropsDepartment) => {
  const [filters, setFilters] = useState<any>();
  const [departmentList, setDepartmentList] = useState<any>();
  const [departmentSelectManage, setDepartmentSelectManage] = useState<any>();
  const [departmentSelectRequest, setDepartmentSelectRequest] = useState<any>(
    []
  );
  useEffect(() => {
    setDepartmentSelectManage(props.departmentManageProp);
    setDepartmentSelectRequest(props.departmentRequestProp);
  }, [props.departmentManageProp, props.departmentRequestProp]);

  useEffect(() => {
    if (
      props.departmentManageProp === undefined ||
      props.departmentManageProp === null
    ) {
    } else {
      setDepartmentSelectManage(props.departmentManageProp);
    }
    if (
      props.departmentManageProp === undefined ||
      props.departmentManageProp === null
    ) {
    } else {
      setDepartmentSelectRequest(props.departmentRequestProp);
    }

    setDepartmentList(props.departmentListProps);
    setFilters(props.departmentListProps);
  }, [
    props.departmentListProps,
    props.departmentManageProp,
    props.departmentManageProp,
  ]);

  const renderFooter = () => {
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
  const onSave = () => {
    props.setControlModel((prevState: any) => ({
      ...prevState,
      [props.keyProps]:
        props.keyProps == "Authorization_request_department" ||
        props.keyProps === "Authorization_request_department"
          ? departmentSelectRequest
          : departmentSelectManage,
    }));
    props.setVisibleProps();
  };
  const onHide = () => {
    setDepartmentSelectManage(props.departmentManageProp);
    setDepartmentSelectRequest(props.departmentRequestProp);
    props.setVisibleProps();
  };

  const AuthorizationTableData = (data: any, key: any) => {
    if (
      key == "Authorization_request_department" ||
      props.keyProps === "Authorization_request_department"
    ) {
      let _data: any = [...departmentSelectRequest];
      let _dataFilter = _data.filter((item: any) => item.depID === data.depID);
      if (_dataFilter.length === 0) {
        _data.push(data);
      } else {
        _data.map((_dataMap: any) => {
          if (_dataMap.depID === data.depID) {
            _dataMap.depaction = data.depaction;
          }
        });
      }
      setDepartmentSelectRequest(_data);
    } else {
      let _data: any = [...departmentSelectManage];
      // _data.push(data);
      let _dataFilter = _data.filter((item: any) => item.depID === data.depID);

      if (_dataFilter.length === 0) {
        _data.push(data);
      } else {
        _data.map((_dataMap: any) => {
          if (_dataMap.depID === data.depID) {
            _dataMap.depaction = data.depaction;
          }
        });
      } // _data.map((_dataDepart: any) => {
      //   console.log("_dataDepart", _dataDepart);
      // });

      setDepartmentSelectManage(_data);
    }

    // _ReferenceDocumentDialog(
    //   props.TableTemplateSelectedProps.listRefTemplate,
    //   "listRefTemplate"
    // );
    // _ReferenceDocumentDialog(
    //   props.TableTemplateSelectedProps.templateForm,
    //   "templateForm"
    // );
    // props.setVisibleProps();
  };

  const onGlobalFilterTemplate = (data: any, inx: any) => {
    const value = data;
    const _Arrayfilters: any = [];
    let _filters = { ...filters };
    for (const [key, value] of Object.entries(_filters)) {
      _Arrayfilters.push(value);
    }
    const _dataFilter = _Arrayfilters.filter((data: any) => {
      if (
        data.NameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.NameTh.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.DepartmentCode.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ) {
        return true;
      }
    });
    if (data.length === 0) {
      setDepartmentList(props.departmentListProps);
    } else {
      setDepartmentList(_dataFilter);
    }
  };
  const [globalFilterValueTemplate, setGlobalFilterValueTemplate] = useState();
  return (
    <>
      <Dialog
        visible={props.visibleProps}
        onHide={() => onHide()}
        className="referenceDocumentDialog-dialog"
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "70vw" }}
        footer={renderFooter()}
      >
        <div style={{ padding: "4px 3.5rem 1rem 1.5rem" }}>
          <Row>
            <Col xs={12} sm={12} xl={12}>
              <p className="referenceDocumentDialog-dialog-p-textheader">
                Search Department
              </p>
            </Col>
          </Row>
        </div>
        <p style={{ borderBottom: "1px solid #cfcfcf" }}></p>
        <div style={{ padding: "20px 3.5rem 0rem 2.5rem" }}>
          <Row className="gutter-row">
            <Col xs={12} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Search"}
                textSubProps={"ค้นหา"}
              />
            </Col>
            <Col xs={12} sm={10} xl={10}>
              <div className="p-inputgroup">
                <div style={{ paddingBottom: "3px", width: "100%" }}>
                  <InputTextComponents
                    setStyleProps={{
                      width: "100%",
                      height: "38px",
                      borderRadius: "6px 0px 0px 6px",
                    }}
                    onChangeProps={onGlobalFilterTemplate}
                    // onBlurProps={onGlobalFilterTemplate}
                    keyProps={"Search"}
                    valueProps={globalFilterValueTemplate}
                  />
                </div>
                <ButtonComponents
                  setIconProps={"pi pi-search"}
                  setClassNameProps={"p-button-text-position"}
                  setStyleProps={{
                    backgroundColor: "#282f6a",
                    border: "1px solid #282f6a",
                    borderTopRightRadius: "6px",
                    borderBottomRightRadius: "6px",
                    boxShadow: "none",
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row className="gutter-row">
            <Col xs={12} sm={12} xl={12}>
              <AuthorizationTableDepartment
                //   valueProps={
                //     Object.keys(template).length === 0 ? [] : template
                //   }
                setValueProps={AuthorizationTableData}
                //   keyProps={"listRefTemplate"}
                //   selectedTableTemplate={
                //     referenceDocumentDialogObject.listRefTemplate
                //   }
                //   filtersProps={filters}
                keyProps={props.keyProps}
                departmentManageProp={departmentSelectManage}
                departmentRequestProp={departmentSelectRequest}
                departmentListProps={departmentList}
              />
            </Col>
          </Row>
        </div>
      </Dialog>
    </>
  );
};

export const AuthorizationPermissionModel = (props: PropsPermission) => {
  const [permissionType, setPermissionType] = useState<any>([]);
  const [role, setRole] = useState<any>([]);
  const [roleName, setRoleName] = useState<any>([]);
  const [advanceFormLabalSelect, setAdvanceFormLabalSelect] = useState<any>([]);
  const [valueType, setValueType] = useState<any>({
    ValueType: "Information",
  });
  const [informition, setInformition] = useState<any>({
    Informition: "Employee Code",
  });

  const [company, setCompany] = useState<any>([]);
  const [department, setDepartment] = useState<any>([]);
  const [departmentName, setDepartmentName] = useState<any>([]);
  const [companyAction, setCompanyAction] = useState<any>([]);
  const [companyActionEdit, setCompanyActionEdit] = useState<any>("");
  const [advanceFormLabal, setAdvanceFormLabal] = useState<any>([]);
  const [validation, setValidation] = useState<any>({
    RoleValidation: false,
    DepartmentValidation: false,
    CompanyValidation: false,
  });
  // const [advanceFormLabal, setValueType] = useState<any>([]);

  useEffect(() => {
    if (props.editTablePermissionProps !== undefined) {
      if (props.editTablePermissionProps.length !== 0) {
        if (props.editTablePermissionProps.permissiontype === "Role") {
          let arrayRole: any = [];
          props.editTablePermissionProps.ids.map((data: any) => {
            let dataRole = props.roleData.filter(
              (item: any) => data.id === item.RoleId.toString()
            );

            if (dataRole.length !== 0) {
              arrayRole.push(dataRole[0]);
            }
          });
          setRole(arrayRole);
        }
        if (props.editTablePermissionProps.permissiontype === "Department") {
          let arrayRole: any = [];
          let arrayDepartment: any = [];
          // let arrayRole: any = [];
          props.editTablePermissionProps.company.map((data: any) => {
            let dataRole = props.companyData.filter(
              (item: any) => data.id === item.CompanyId.toString()
            );

            if (dataRole.length !== 0) {
              arrayRole.push(dataRole[0]);
            }
          });
          props.editTablePermissionProps.ids.map((data: any) => {
            let dataRole = props.departmentListProps.filter(
              (item: any) => data.id === item.DepartmentId.toString()
            );
            if (dataRole.length !== 0) {
              arrayDepartment.push(dataRole[0]);
            }
            setCompanyActionEdit(data.action);
          });

          setDepartment(arrayDepartment);
          setCompany(arrayRole);
        }
        if (props.editTablePermissionProps.permissiontype === "FormControl") {
          let arrayRole: any = [];
          let arrayDepartment: any = [];
          console.log(
            "props.editTablePermissionPropseeeeeeeeeeeeee",
            props.editTablePermissionProps,
            advanceFormLabalSelect,
            props.actionProps
          );
          let _arrayAdvanceFormLabal: any = [];
          let _advanceFormJson =
            props.controlModel.templateForm.AdvanceForm === undefined ||
            props.controlModel.templateForm.AdvanceForm === null ||
            props.controlModel.templateForm.AdvanceForm.length === 0
              ? []
              : props.controlModel.templateForm.IsTextForm &&
                props.controlModel.templateForm.AdvanceForm[
                  props.controlModel.templateForm.AdvanceForm.length - 3
                ] === ","
              ? JSON.parse(
                  remove_character(
                    props.controlModel.templateForm.AdvanceForm,
                    props.controlModel.templateForm.AdvanceForm.length - 3
                  )
                )
              : JSON.parse(props.controlModel.templateForm.AdvanceForm);
          _advanceFormJson.items.map((_data: any) => {
            _data.layout.map((__data: any) => {
              if (
                __data.template.type === "t" ||
                __data.template.type === "ta" ||
                __data.template.type === "d" ||
                __data.template.type === "tb" ||
                __data.template.type === "c"
              ) {
                if (__data.template.type !== "tb") {
                  _arrayAdvanceFormLabal.push({
                    label: __data.template.label,
                    type: __data.template.type,
                  });
                } else if (
                  __data.template.type === "tb" &&
                  __data.template.label.length !== 0
                ) {
                  let _arrayColumn: any = [];

                  __data.template.attribute.column.map((data: any) => {
                    _arrayColumn.push({ label: data.label });
                  });

                  _arrayAdvanceFormLabal.push({
                    label: __data.template.label,
                    type: __data.template.type,
                    column: _arrayColumn,
                  });
                }
              }
            });
          });
          // props.editTablePermissionProps.company.map((data: any) => {
          //   let dataRole = props.companyData.filter(
          //     (item: any) => data.id === item.CompanyId.toString()
          //   );

          //   if (dataRole.length !== 0) {
          //     arrayRole.push(dataRole[0]);
          //   }
          // });
          // props.editTablePermissionProps.ids.map((data: any) => {
          //   let dataRole = props.departmentListProps.filter(
          //     (item: any) => data.id === item.DepartmentId.toString()
          //   );
          //   if (dataRole.length !== 0) {
          //     arrayDepartment.push(dataRole[0]);
          //   }
          //   setCompanyActionEdit(data.action);
          // });

          // setDepartment(arrayDepartment);
          // setCompany(arrayRole);
          let _Informition: any = informition;
          if (
            props.editTablePermissionProps.formcontrol.labelInformition ===
            "EmployeeCode"
          ) {
            _Informition.Information = "Employee Code";
          } else if (
            props.editTablePermissionProps.formcontrol.labelInformition ===
            "EmployeeName"
          ) {
            _Informition.Information = "Employee Name";
          } else if (
            props.editTablePermissionProps.formcontrol.labelInformition ===
            "EmployeePosition"
          ) {
            _Informition.Information = "Employee Position";
          } else if (
            props.editTablePermissionProps.formcontrol.labelInformition ===
            "EmployeeDivision"
          ) {
            _Informition.Information = "Employee Division";
          } else if (
            props.editTablePermissionProps.formcontrol.labelInformition ===
            "EmployeeDepartment"
          ) {
            _Informition.Informition = "Employee Department";
          }

          setInformition({ ..._Informition });
          // if(props.editTablePermissionProps.formcontrol.labeltype==="Table")
          //          { setAdvanceFormLabalSelect((prevState: any) => ({
          //             ...prevState,
          //             label: props.editTablePermissionProps.formcontrol.label,
          //             type: props.editTablePermissionProps.formcontrol.labeltype,
          //             column: _arrayAdvanceFormLabal,
          //           }));}else{
          //             setAdvanceFormLabalSelect((prevState: any) => ({
          //               ...prevState,
          //               label: props.editTablePermissionProps.formcontrol.label,
          //               type: props.editTablePermissionProps.formcontrol.labeltype,
          //               column: _arrayAdvanceFormLabal,
          //             }));
          //           }
          console.log(
            "props.editTablePermissionProps0,props.editTablePermissionProps",
            props.editTablePermissionProps,
            props.actionProps,
            advanceFormLabalSelect,
            _arrayAdvanceFormLabal
          );
        }

        setPermissionType(props.editTablePermissionProps);
      }
    }
  }, [props.editTablePermissionProps]);

  useEffect(() => {
    if (props.editTablePermissionProps.length === 0) {
      setPermissionType([]);
      setRole([]);
      setRoleName([]);
      setCompany([]);
      setDepartment([]);
      setDepartmentName([]);
      setCompanyAction([]);
    }

    if (props.actionProps === "edit") {
      console.log(
        "props.controlModel.templateForm",
        props.controlModel.templateForm.IsTextForm
      );

      console.log(
        "props.controlModel.templateForm",
        props.controlModel.templateForm.AdvanceForm[
          props.controlModel.templateForm.AdvanceForm.length - 3
        ]
      );

      let _advanceFormJson =
        props.controlModel.templateForm.AdvanceForm === undefined ||
        props.controlModel.templateForm.AdvanceForm === null ||
        props.controlModel.templateForm.AdvanceForm.length === 0
          ? []
          : props.controlModel.templateForm.IsTextForm &&
            props.controlModel.templateForm.AdvanceForm[
              props.controlModel.templateForm.AdvanceForm.length - 3
            ] === ","
          ? JSON.parse(
              remove_character(
                props.controlModel.templateForm.AdvanceForm,
                props.controlModel.templateForm.AdvanceForm.length - 3
              )
            )
          : JSON.parse(props.controlModel.templateForm.AdvanceForm);
      if (_advanceFormJson.length !== 0) {
        _advanceForm(_advanceFormJson);
      }
    } else {
      if (props.advanceFormProps.items.length !== 0) {
        _advanceForm(props.advanceFormProps);
      }
    }
  }, [props.visibleProps]);

  useEffect(() => {
    console.log("per=>PermissionType", permissionType);
  }, [permissionType]);

  function remove_character(str: any, char_pos: any) {
    let part1 = str.substring(0, char_pos);
    let part2 = str.substring(char_pos + 1, str.length);
    return part1 + part2;
  }
  const labelStyle: any = {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "13px",
    lineHeight: "19px",
    marginLeft: "5px",
    color: "#000000",
  };
  function _advanceForm(data: any) {
    try {
      let _arrayAdvanceFormLabal: any = [];
      data.items.map((_data: any) => {
        // dataitems.template.type === "dd"
        // ? "Dropdown"
        // : dataitems.template.type === "tb"
        // ? "Table"
        // : dataitems.template.type === "t"
        // ? "ShortText"
        // : dataitems.template.type === "d"
        // ? "Calendar"
        // : dataitems.template.type === "at"
        // ? "Attachmen"
        // : dataitems.template.type === "ta"
        // ? "MultiLine"
        // : dataitems.template.type === "c"
        // ? "Decimal"
        // : dataitems.template.type === "r"
        // ? "Choice"
        // : dataitems.template.type === "cb"
        // ? "MultiChoice"
        // : dataitems.template.type === "n"
        // ? "Number"
        // : dataitems.template.type === "an"
        // ? "AutoNumber"
        // : dataitems.template.type === "ed"
        _data.layout.map((__data: any) => {
          if (
            __data.template.type === "t" ||
            __data.template.type === "ta" ||
            __data.template.type === "tb" ||
            __data.template.type === "c" ||
            __data.template.type === "dd" ||
            __data.template.type === "d" ||
            __data.template.type === "at" ||
            __data.template.type === "r" ||
            __data.template.type === "cb" ||
            __data.template.type === "n" ||
            __data.template.type === "an" ||
            __data.template.type === "ed"
          ) {
            if (__data.template.type !== "tb") {
              _arrayAdvanceFormLabal.push({
                label: __data.template.label,
                type: __data.template.type,
              });
            } else if (
              __data.template.type === "tb" &&
              __data.template.label.length !== 0
            ) {
              let _arrayColumn: any = [];

              __data.template.attribute.column.map((data: any) => {
                _arrayColumn.push({ label: data.label });
              });

              _arrayAdvanceFormLabal.push({
                label: __data.template.label,
                type: __data.template.type,
                column: _arrayColumn,
              });
            }
          }
        });
      });
      // console.log("_arrayAdvanceFormLabal", _arrayAdvanceFormLabal);
      console.log("_arrayAdvanceFormLabal", _arrayAdvanceFormLabal);
      if (props.editTablePermissionProps.permissiontype === "FormControl") {
        let tableFilter = _arrayAdvanceFormLabal.filter(
          (item: any) =>
            item.label === props.editTablePermissionProps.formcontrol.label
        );
        if (tableFilter.length !== 0) {
          setAdvanceFormLabalSelect(tableFilter[0]);
        }
      }
      setAdvanceFormLabal(_arrayAdvanceFormLabal);
    } catch (error) {}
  }

  const renderFooter = () => {
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
  const onSave = () => {
    if (props.editTablePermissionProps.length === 0) {
      let _arrayRolePermission: any = [];
      if (
        permissionType !== undefined &&
        permissionType !== null &&
        Object.keys(permissionType).length !== 0
      ) {
        if (permissionType.Permission.View === "T") {
          _arrayRolePermission.push("View");
        }
        if (permissionType.Permission.Print === "T") {
          _arrayRolePermission.push("Print");
        }
        if (permissionType.permissiontype === "Public") {
          let _objTable = {
            Type: permissionType.permissiontype,
            Description: "",
            Permission:
              _arrayRolePermission.length === 0
                ? ""
                : _arrayRolePermission.toString(),
          };
          props.setDataTable(_objTable);
          props.setDataAuthorization_view(
            permissionType,
            props.keyAutoComplete
          );
          props.setVisibleProps(props.keyAutoComplete);
        }
        if (permissionType.permissiontype === "Role") {
          console.log("permissionType", permissionType);
          if (
            permissionType.ids !== undefined &&
            permissionType.ids !== null &&
            permissionType.ids.length !== 0
          ) {
            let _objTable = {
              Type: permissionType.permissiontype,
              Description: roleName.length === 0 ? "" : roleName.toString(),
              Permission:
                _arrayRolePermission.length === 0
                  ? ""
                  : _arrayRolePermission.toString(),
            };
            props.setDataTable(_objTable);
            props.setDataAuthorization_view(
              permissionType,
              props.keyAutoComplete
            );
            props.setVisibleProps(props.keyAutoComplete);
          } else {
            setValidation((prevState: any) => ({
              ...prevState,
              RoleValidation: true,
            }));
            // setValidation({
            //   RoleValidation:false,
            //   DepartmentValidation:false,
            //   CompanyValidation:false
            // })
          }
        }
        if (permissionType.permissiontype === "Department") {
          console.log("permissionType", permissionType);
          if (
            permissionType.company !== undefined &&
            permissionType.company !== null &&
            permissionType.company.length !== 0 &&
            permissionType.ids !== undefined &&
            permissionType.ids !== null &&
            permissionType.ids.length !== 0
          ) {
            let _objTable = {
              Type: permissionType.permissiontype,
              Description:
                departmentName.length === 0 ? "" : departmentName.toString(),
              Permission:
                _arrayRolePermission.length === 0
                  ? ""
                  : _arrayRolePermission.toString(),
            };
            props.setDataTable(_objTable);
            props.setVisibleProps(props.keyAutoComplete);
            props.setDataAuthorization_view(
              permissionType,
              props.keyAutoComplete
            );
          } else {
            setValidation({
              DepartmentValidation:
                permissionType.ids === undefined ||
                permissionType.ids === null ||
                permissionType.ids.length === 0
                  ? true
                  : false,
              CompanyValidation:
                permissionType.company === undefined ||
                permissionType.company === null ||
                permissionType.company.length === 0
                  ? true
                  : false,
            });
            // setValidation({
            //   RoleValidation:false,
            //   DepartmentValidation:false,
            //   CompanyValidation:false
            // })
          }
        }
        if (permissionType.permissiontype === "FormControl") {
          let _objTable;
          if (permissionType.formcontrol.labeltype === "Table") {
            _objTable = {
              Type: permissionType.permissiontype,
              Description:
                "label:" +
                permissionType.formcontrol.label +
                " columnname: " +
                permissionType.formcontrol.labelcolumnname +
                " type:" +
                permissionType.formcontrol.labeltype +
                " valuetype:" +
                permissionType.formcontrol.labelvaluetype +
                " informition:" +
                permissionType.formcontrol.labelInformition,
              Permission:
                _arrayRolePermission.length === 0
                  ? ""
                  : _arrayRolePermission.toString(),
            };
          } else {
            _objTable = {
              Type: permissionType.permissiontype,
              Description:
                "label:" +
                permissionType.formcontrol.label +
                " type:" +
                permissionType.formcontrol.labeltype +
                " valuetype:" +
                permissionType.formcontrol.labelvaluetype +
                " informition:" +
                permissionType.formcontrol.labelInformition,
              Permission:
                _arrayRolePermission.length === 0
                  ? ""
                  : _arrayRolePermission.toString(),
            };
          }
          props.setDataAuthorization_view(
            permissionType,
            props.keyAutoComplete
          );
          console.log("_objTable", { _objTable, permissionType });

          props.setDataTable(_objTable);
          props.setVisibleProps(props.keyAutoComplete);
        }
      }
    } else {
      let dataFile = props.controlModel;
      if (permissionType.permissiontype === "Role") {
        dataFile.Authorization_view.map((data: any, inx: any) => {
          if (data.id === props.editTablePermissionProps.id) {
            dataFile.Authorization_view[inx] = permissionType;
          }
        });
      }
      if (permissionType.permissiontype === "Department") {
        dataFile.Authorization_view.map((data: any, inx: any) => {
          if (data.id === props.editTablePermissionProps.id) {
            dataFile.Authorization_view[inx] = permissionType;
          }
        });
      }
      if (permissionType.permissiontype === "FormControl") {
        dataFile.Authorization_view.map((data: any, inx: any) => {
          if (data.id === props.editTablePermissionProps.id) {
            dataFile.Authorization_view[inx] = permissionType;
          }
        });
      }
      if (permissionType.permissiontype === "Public") {
        dataFile.Authorization_view.map((data: any, inx: any) => {
          if (data.id === props.editTablePermissionProps.id) {
            dataFile.Authorization_view[inx] = permissionType;
          }
        });
      }

      props.setVisibleProps(props.keyAutoComplete);
      props.setDataAuthorization_viewEdit(dataFile, "Authorization_view");
    }
  };
  const onHide = () => {
    props.setVisibleProps(props.keyAutoComplete);
    setPermissionType([]);
    setRole([]);
    setRoleName([]);
    setCompany([]);
    setDepartment([]);
    setDepartmentName([]);
    setCompanyAction([]);
    setAdvanceFormLabalSelect({});
  };

  function onChangeDropdow(data: any, key: any) {
    let _uuid = uuidv4().replace(/-/g, "");

    if (data !== null && data !== undefined) {
      data.id = _uuid.toString();
      setPermissionType(data);
    }
  }
  function onChangeDropdowLable(data: any, key: any) {
    console.log("dataaaaaaaaaaaaaaaa", data);
    if (data !== undefined && data !== null) {
      console.log("dataaaaaaaaaaaaaaaa", data);

      setAdvanceFormLabalSelect(data);

      setPermissionType((prevState: any) => ({
        ...prevState,
        formcontrol: {
          ...permissionType.formcontrol,
          label: data.label,
          labeltype:
            data.type === "dd"
              ? "Dropdown"
              : data.type === "tb"
              ? "Table"
              : data.type === "t"
              ? "ShortText"
              : data.type === "d"
              ? "Calendar"
              : data.type === "at"
              ? "Attachmen"
              : data.typee === "r"
              ? "Radio"
              : data.type === "c"
              ? "Decimal"
              : "",

          labelcolumnname: "",
        },
      }));
    }
  }
  function onChangeDropdowColumnname(data: any, key: any) {
    if (data !== undefined && data !== null) {
      setPermissionType((prevState: any) => ({
        ...prevState,
        formcontrol: {
          ...permissionType.formcontrol,
          labelcolumnname: data.label,
        },
      }));
    }
  }
  function onChangeDropdowValueType(data: any, key: any) {
    if (data !== null && data !== undefined) {
      setValueType(data);
    }
    // setValueType(data);
  }
  function onChangeDropdowInformition(data: any, key: any) {
    if (data !== null && data !== undefined) {
      setInformition({ ...data });
      setPermissionType((prevState: any) => ({
        ...prevState,
        formcontrol: {
          ...permissionType.formcontrol,
          labelInformition: data.Informition.replaceAll(" ", ""),
        },
      }));
    }
  }
  function _Role(data: any, key: any) {
    if (key === "RoleID") {
      let _arrayRole: any = [];
      let _arrayRoleName: any = [];
      let _arrayRolePermission: any = [];
      data.map((_dataRole: any) => {
        _arrayRole.push({
          id: _dataRole.RoleId.toString(),
          name: _dataRole.NameEn,
        });
        _arrayRoleName.push(_dataRole.NameEn);
      });
      setRoleName(_arrayRoleName);
      setPermissionType((prevState: any) => ({
        ...prevState,
        ids: _arrayRole,
      }));
      setRole(data);
      setValidation((prevState: any) => ({
        ...prevState,
        RoleValidation: false,
      }));
    }
  }
  function _Company(data: any, key: any) {
    let _arrayCompany: any = [];
    data.map((_dataCompany: any) => {
      _arrayCompany.push({
        id: _dataCompany.CompanyId.toString(),
        name: _dataCompany.NameEn,
      });
    });
    setCompany(data);
    setPermissionType((prevState: any) => ({
      ...prevState,
      company: _arrayCompany,
    }));
  }
  function _department(data: any, key: any) {
    let _arrayDepartment: any = [];
    let _arrayDepartmentName: any = [];
    console.log("per=>data", data);

    data.map((_department: any) => {
      _arrayDepartment.push({
        id: _department.DepartmentId.toString(),
        name: _department.NameEn,
        action: "",
      });
      _arrayDepartmentName.push(_department.NameEn);
    });
    setValidation({
      CompanyValidation: false,
    });
    setPermissionType((prevState: any) => ({
      ...prevState,
      ids: _arrayDepartment,
    }));
    setDepartmentName(_arrayDepartmentName);
    setDepartment(data);

    // setCompany(data);
  }

  function getPermissionTypeOptions(data: any, key: any) {
    let _arrayDepartment: any = [];
    let _arrayDepartmentName: any = [];
    props.departmentListProps.map((_department: any) => {
      _arrayDepartment.push({
        id: _department.DepartmentId.toString(),
        name: _department.NameEn,
        action: "",
      });
      _arrayDepartmentName.push(_department.NameEn);
    });

    setPermissionType((prevState: any) => ({
      ...prevState,
      ids: _arrayDepartment,
    }));
  }

  function _Action(data: any, key: any) {
    let _arrayDepartment: any = [];
    let _arrayDepartmentName: any = [];
    console.log("per=>data", data);
    console.log("per=>permissionType", permissionType);

    setCompanyAction(data);
    department.map((_department: any) => {
      _arrayDepartment.push({
        id: _department.DepartmentId.toString(),
        name:
          data === undefined || data === null
            ? _department.NameEn
            : _department.NameEn,
        action: data === undefined || data === null ? "" : data.Position,
      });
      _arrayDepartmentName.push(
        data === undefined || data === null
          ? _department.NameEn
          : _department.NameEn + " | " + data.Position
      );
    });

    setDepartmentName(_arrayDepartmentName);
    setPermissionType((prevState: any) => ({
      ...prevState,
      ids: _arrayDepartment,
    }));
  }
  async function _CheckboxCpmponents(data: any, key: any) {
    setPermissionType((prevState: any) => ({
      ...prevState,
      Permission: {
        ...permissionType.Permission,
        [key]: data === true ? "T" : "F",
      },
    }));
  }
  return (
    <>
      <Dialog
        visible={props.visibleProps}
        onHide={() => {
          // onHide()
        }}
        onClick={() => console.log("informition", informition)}
        className="referenceDocumentDialog-dialog"
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "70vw" }}
        footer={renderFooter()}
      >
        <div
          style={{ padding: "4px 3.5rem 1rem 1.5rem" }}
          onClick={() => {
            console.log("per=>", { informition });
          }}
        >
          <Row>
            <Col xs={12} sm={12} xl={12}>
              <p className="referenceDocumentDialog-dialog-p-textheader">
                Add Permission
              </p>
            </Col>
          </Row>
        </div>
        <p style={{ borderBottom: "1px solid #cfcfcf" }}></p>
        <div style={{ padding: "20px 3.5rem 0rem 2.5rem" }}>
          <Row className="gutter-row-Reference">
            <Col xs={12} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Permission Type"}
                textSubProps={"ประเภทสิทธิ์"}
              />
            </Col>
            <Col xs={12} sm={10}>
              <DropdownComponents
                placeholderProps={
                  permissionType !== undefined && permissionType !== null
                    ? permissionType.length !== 0
                      ? permissionType.permissiontype.length !== 0
                        ? permissionType.permissiontype
                        : "-- Please Select Permission Type --"
                      : "-- Please Select Permission Type --"
                    : "-- Please Select Permission Type --"
                }
                onChangeProps={onChangeDropdow}
                optionLabelProps="permissiontype"
                optionsProps={[
                  {
                    id: null,
                    permissiontype: "Public",

                    Permission: {
                      View: "T",
                      Print: "T",
                      Download: "F",
                    },
                  },
                  {
                    id: null,
                    permissiontype: "Role",
                    ids: [],
                    Permission: {
                      View: "T",
                      Print: "T",
                      Download: "F",
                    },
                  },
                  {
                    id: null,
                    permissiontype: "Department",
                    company: null,
                    ids: [],
                    Permission: {
                      View: "T",
                      Print: "T",
                      Download: "F",
                    },
                  },
                  {
                    id: null,
                    permissiontype: "FormControl",
                    formcontrol: {
                      label:
                        advanceFormLabalSelect !== undefined &&
                        advanceFormLabalSelect !== null
                          ? Object.keys(advanceFormLabalSelect).length !== 0
                            ? advanceFormLabalSelect.label
                            : ""
                          : "",
                      labeltype:
                        advanceFormLabalSelect !== undefined &&
                        advanceFormLabalSelect !== null
                          ? Object.keys(advanceFormLabalSelect).length !== 0
                            ? advanceFormLabalSelect.type === "dd"
                              ? "Dropdown"
                              : advanceFormLabalSelect.type === "tb"
                              ? "Table"
                              : advanceFormLabalSelect.type === "t"
                              ? "ShortText"
                              : advanceFormLabalSelect.type === "d"
                              ? "Calendar"
                              : advanceFormLabalSelect.type === "at"
                              ? "Attachmen"
                              : advanceFormLabalSelect.type === "r"
                              ? "Radio"
                              : advanceFormLabalSelect.type === "c"
                              ? "Decimal"
                              : ""
                            : ""
                          : "",
                      labelcolumnname: "",
                      labelvaluetype:
                        valueType !== undefined && valueType !== null
                          ? Object.keys(valueType).length !== 0
                            ? valueType.ValueType
                            : ""
                          : "",
                      labelInformition:
                        informition !== undefined && informition !== null
                          ? Object.keys(informition).length !== 0
                            ? informition.Informition
                            : ""
                          : "",
                      labelvalue: "",
                      labelaction: "",
                    },
                    Permission: {
                      View: "T",
                      Print: "T",
                      Download: "F",
                    },
                  },
                ]}
                valueProps={permissionType}
                keyProps={"permissiontype"}
              />
            </Col>
          </Row>
          {permissionType?.permissiontype === "Role" && (
            <>
              <Row className="gutter-row-Reference">
                <Col xs={12} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Role"}
                    textSubProps={"กลุ่มคนที่ต้องการให้สิทธิ์ :"}
                  />
                </Col>
                <Col xs={12} sm={10}>
                  <MultiSelect
                    value={role}
                    options={props.roleData}
                    onChange={(e: any) => {
                      _Role(e.value, "RoleID");
                    }}
                    optionLabel="NameEn"
                    placeholder="-- Please Select Role --"
                    display="chip"
                    style={{
                      width: "100% ",
                      fontSize: "13px",
                      borderColor: validation.RoleValidation ? "red" : "",
                    }}
                  />
                </Col>
              </Row>
            </>
          )}
          {permissionType?.permissiontype === "FormControl" && (
            <>
              <Row className="gutter-row-Reference">
                <Col xs={12} sm={2} xl={2}>
                  <TextHeaderComponents textHeaderProps={"Label"} />
                </Col>
                <Col xs={12} sm={10}>
                  <DropdownComponents
                    placeholderProps={
                      props.actionProps === "edit"
                        ? permissionType.formcontrol.label !== undefined &&
                          permissionType.formcontrol.label !== null &&
                          permissionType.formcontrol.label !== ""
                          ? permissionType.formcontrol.label
                          : "-- Please Select --"
                        : advanceFormLabal !== undefined &&
                          advanceFormLabal !== null &&
                          advanceFormLabal !== 0
                        ? advanceFormLabal[0].label
                        : "-- Please Select --"
                    }
                    valueProps={advanceFormLabalSelect}
                    optionLabelProps={"label"}
                    optionsProps={advanceFormLabal}
                    styleProps={{
                      width: "100%",
                      borderRadius: "6px 6px 6px 6px",
                    }}
                    onChangeProps={onChangeDropdowLable}
                    keyProps={"Label"}
                  />
                </Col>
              </Row>
              {advanceFormLabalSelect !== undefined &&
              advanceFormLabalSelect !== null ? (
                Object.keys(advanceFormLabalSelect).length !== 0 ? (
                  advanceFormLabalSelect.column !== undefined &&
                  advanceFormLabalSelect.column !== null ? (
                    advanceFormLabalSelect.column.length !== 0 ? (
                      <>
                        <Row className="gutter-row-Reference">
                          <Col xs={12} sm={2} xl={2}>
                            <TextHeaderComponents textHeaderProps={"Columne"} />
                          </Col>
                          <Col xs={12} sm={10}>
                            <DropdownComponents
                              placeholderProps={
                                permissionType.formcontrol.labelcolumnname !==
                                ""
                                  ? permissionType.formcontrol.labelcolumnname
                                  : "-- Please Select --"
                                // valueType !== undefined && valueType !== null
                                //   ? Object.keys(valueType).length !== 0
                                //     ? valueType.ValueType
                                //   : "-- Please Select --"
                                // : "-- Please Select --"
                              }
                              valueProps={valueType}
                              optionLabelProps={"label"}
                              optionsProps={advanceFormLabalSelect.column}
                              styleProps={{
                                width: "100%",
                                borderRadius: "6px 6px 6px 6px",
                              }}
                              onChangeProps={onChangeDropdowColumnname}
                              keyProps={"column"}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              <Row className="gutter-row-Reference">
                <Col xs={12} sm={2} xl={2}>
                  <TextHeaderComponents textHeaderProps={"Value Type"} />
                </Col>
                <Col xs={12} sm={10}>
                  <DropdownComponents
                    placeholderProps={
                      valueType !== undefined && valueType !== null
                        ? Object.keys(valueType).length !== 0
                          ? valueType.ValueType
                          : "-- Please Select --"
                        : "-- Please Select --"
                    }
                    valueProps={valueType}
                    optionLabelProps={"ValueType"}
                    optionsProps={[{ ValueType: "Information" }]}
                    styleProps={{
                      width: "100%",
                      borderRadius: "6px 6px 6px 6px",
                    }}
                    onChangeProps={onChangeDropdowValueType}
                    keyProps={"ValueType"}
                  />
                </Col>
              </Row>
              <Row className="gutter-row-Reference">
                <Col xs={12} sm={2} xl={2}>
                  <TextHeaderComponents textHeaderProps={"Information"} />
                </Col>

                <Col xs={12} sm={10}>
                  {/* <Dropdown
                    placeholder={"-- Please Select --"}
                    onChange={(data: any) => {
                      console.log("per=>data", data);
                      console.log("per=>informition", informition);
                    }}
                    style={{
                      width: "100%",
                      borderRadius: "6px 6px 6px 6px",
                    }}
                    options={[
                      "Employee Code",
                      "Employee Name",
                      "Employee Position",
                      "Employee Division",
                      "Employee Department",
                    ]}
                    value={
                      informition && informition. !== ""
                        ? permissionType?.formcontrol?.labelaction
                        : null
                    }
                    key={"Informition"}
                  /> */}
                  <DropdownComponents
                    placeholderProps={"-- Please Select --"}
                    valueProps={informition}
                    optionLabelProps={"Informition"}
                    optionsProps={[
                      { Informition: "Employee Code" },
                      { Informition: "Employee Name" },
                      { Informition: "Employee Position" },
                      { Informition: "Employee Division" },
                      { Informition: "Employee Department" },
                    ]}
                    styleProps={{
                      width: "100%",
                      borderRadius: "6px 6px 6px 6px",
                    }}
                    onChangeProps={onChangeDropdowInformition}
                    keyProps={"Informition"}
                  />
                </Col>
              </Row>
            </>
          )}
          {permissionType?.permissiontype === "Department" && (
            <>
              <Row className="gutter-row-Reference">
                <Col xs={12} sm={2} xl={2}>
                  <TextHeaderComponents textHeaderProps={"Company"} />
                </Col>
                <Col xs={12} sm={10}>
                  <MultiSelect
                    value={company}
                    options={props.companyData}
                    onChange={(e: any) => {
                      _Company(e.value, "Company");
                    }}
                    optionLabel="NameEn"
                    placeholder="-- Please Select Company --"
                    display="chip"
                    style={{
                      width: "100% ",
                      fontSize: "13px",
                      borderColor: validation.CompanyValidation ? "red" : "",
                    }}
                  />
                </Col>
              </Row>
              <Row className="gutter-row-Reference">
                <Col xs={12} sm={2} xl={2}>
                  <TextHeaderComponents textHeaderProps={"Department"} />
                </Col>
                <Col xs={12} sm={10}>
                  <MultiSelect
                    value={department}
                    options={props.departmentListProps}
                    onChange={(e: any) => {
                      _department(e.value, "RoleID");
                    }}
                    optionLabel="NameEn"
                    placeholder="-- Please Select Role --"
                    display="chip"
                    style={{
                      width: "100% ",
                      fontSize: "13px",
                      borderColor: validation.DepartmentValidation ? "red" : "",
                    }}
                  />
                </Col>
              </Row>
              {permissionType.ids.length !== 0 && (
                <>
                  <Row className="gutter-row-Reference">
                    <Col xs={12} sm={2} xl={2}>
                      <TextHeaderComponents textHeaderProps={"Action"} />
                    </Col>
                    <Col xs={12} sm={10}>
                      <DropdownComponents
                        placeholderProps={
                          companyActionEdit !== undefined &&
                          companyActionEdit !== null
                            ? companyActionEdit.length !== 0
                              ? companyActionEdit
                              : "-- Please Select --"
                            : "-- Please Select --"
                        }
                        onChangeProps={_Action}
                        optionLabelProps="Position"
                        optionsProps={[
                          { Position: "Above" },
                          { Position: "Below" },
                        ]}
                        valueProps={companyAction}
                        keyProps={"Department"}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
          {permissionType?.permissiontype === "FormControl" && (
            <>
              {(informition.Informition === "Employee Department" ||
                informition.Informition === "Employee Division") && (
                <>
                  <Row className="gutter-row-Reference">
                    <Col xs={12} sm={2} xl={2}>
                      <TextHeaderComponents textHeaderProps={"Action"} />
                    </Col>
                    <Col xs={12} sm={10}>
                      <Dropdown
                        placeholder={"-- Please Select --"}
                        onChange={(data: any) => {
                          let _newData = permissionType;
                          _newData.formcontrol.labelaction = data.value;
                          setPermissionType({ ..._newData });
                        }}
                        style={{
                          width: "100%",
                          borderRadius: "6px 6px 6px 6px",
                        }}
                        options={["Above", "Below"]}
                        value={
                          permissionType?.formcontrol?.labelaction !== ""
                            ? permissionType?.formcontrol?.labelaction
                            : null
                        }
                        key={"Position"}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
          {permissionType !== undefined &&
            permissionType !== null &&
            permissionType.length !== 0 && (
              <>
                <Row className="gutter-row-Reference">
                  <Col xs={12} sm={1} xl={1}>
                    <TextHeaderComponents
                      textHeaderProps={"View"}
                      textSubProps={""}
                    />
                  </Col>

                  <Col xs={1} sm={1} xl={1}>
                    <CheckboxCpmponents
                      checkedProps={
                        permissionType?.Permission?.View === "T" ? true : false
                      }
                      onChangeProps={_CheckboxCpmponents}
                      keyProps={"View"}
                      readOnlyProps
                      notLable={true}
                    />
                  </Col>
                  <Col xs={12} sm={1} xl={1}>
                    <TextHeaderComponents textHeaderProps={"Print"} />
                  </Col>

                  <Col xs={1} sm={1} xl={1}>
                    <CheckboxCpmponents
                      checkedProps={
                        permissionType?.Permission?.Print === "T" ? true : false
                      }
                      onChangeProps={_CheckboxCpmponents}
                      keyProps={"Print"}
                      notLable={true}
                    />
                  </Col>
                </Row>
              </>
            )}
        </div>
      </Dialog>
    </>
  );
};
