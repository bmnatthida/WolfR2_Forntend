import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import React, { useEffect, useState, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { RiFileCopy2Line } from "react-icons/ri";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import editIcon from "../../../assets/edit-icon.png";
import binIcon from "../../../assets/bin-icon.png";
import { Dialog } from "primereact/dialog";
import "./AuthorizationComponent.css";
import { DropdownComponents } from "../../DropdownComponents/DropdownComponents";
import { MultiSelect } from "primereact/multiselect";
import EmployeeDialog from "../../DataFechDialogComponents/EmployeeDialog/EmployeeDialog";
import { IoCloseOutline } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import { Checkbox } from "primereact/checkbox";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { dataCompany } from "../../../Services/CompanyService";
import { GetDepartment } from "../../../Services/DepartmentService";
import AutoCompleteComponents from "../../AutoCompleteComponents/AutoCompleteComponents";
import {
  AuthorizationDepartmentModel,
  AuthorizationPermissionModel,
} from "./AuthorizationModel/AuthorizationModel";
import { GetAllEmployee } from "../../../Services/EmployeeService";
type Props = {
  setAdvanceForm: any;
  advanceForm: any;
  controlModel: any;
  setControlModel: any;
  actionProps?: any;
  objectDataAuthorizationProps: any;
  setIsLoad?: any;
};

const AuthorizationComponent = (props: Props) => {
  const toast = useRef(null);
  // const [roleData, setRoleData] = useState<any[]>([]);
  // const [companyData, setCompanyData] = useState<any[]>([]);
  // const [departmentData, setDepartmentData] = useState<any>([]);:
  const [visibleModel, setVisibleModel] = useState<any>(false);
  const [visiblePermissionModel, setVisiblePermissionModel] =
    useState<any>(false);
  const [departmentList, setDepartmentList] = useState<any>({});
  const [roleManage, setRoleManage] = useState<any>();
  const [companyManage, setCompanyManage] = useState<any>();
  const [companyRequest, setCompanyRequest] = useState<any>();
  const [roleManageId, setRoleManageId] = useState<any>();
  const [roleRequest, setRoleRequest] = useState<any>();
  const [roleRequestId, setRoleRequestId] = useState<any>();
  const [departmentManage, setDepartmentManage] = useState<any>([]);
  const [departmentCompanyManage, setDepartmentCompanyManage] = useState<any>(
    []
  );
  const [departmentCompanyRequest, setDepartmentCompanyRequest] = useState<any>(
    []
  );
  const [employeeRequest, setEmployeeRequest] = useState<any>([]);
  const [departmentRequest, setDepartmentRequest] = useState<any>([]);
  const [keyAutoComplete, setKeyAutoComplete] = useState<any>();
  const [employee, setEmployee] = useState<any>([]);
  const [searchData, setSearchData] = useState<any[]>(
    props.objectDataAuthorizationProps.Employee
  );
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [employeeSelect, setEmployeeSelect] = useState<any>([]);
  const [permissionTable, setPermissionTable] = useState<any>([]);
  const [Authorization_view, setAuthorization_view] = useState<any>([]);
  const [keyAuthorization_view, setKeyAuthorization_view] = useState<any>("");
  const [manageCompanyJSON, setManageCompanyJSON] = useState<any>([]);
  const [editTablePermission, setEditTablePermission] = useState<any>([]);
  const empData = JSON.parse(window.localStorage.getItem("userData") || "");
  useEffect(() => {
    console.log("permissionTable", permissionTable);
  }, [permissionTable]);

  useEffect(() => {
    if (props.controlModel !== undefined) {
      _DepartmentGetJson(props.controlModel);
    }
    if (props.controlModel === undefined || props.controlModel === null) {
    } else {
      if (props.actionProps === "edit") {
        let _dataJson =
          props.controlModel.Authorization_view === undefined ||
          props.controlModel.Authorization_view === null
            ? []
            : props.controlModel.Authorization_view.length === 0 ||
              Object.keys(props.controlModel.Authorization_view).length === 0
            ? []
            : props.controlModel.Authorization_view;

        setKeyAuthorization_view("Authorization_view");
        if (_dataJson.length !== 0) {
          let _arrayRoleTable: any = [];
          _dataJson.map((data: any) => {
            let _arrayRolePermission: any = [];
            if (Object.keys(data).length !== 0) {
              if (data.Permission.View === "T") {
                _arrayRolePermission.push("View");
              }
              if (data.Permission.Print === "T") {
                _arrayRolePermission.push("Print");
              }
              if (data.permissiontype === "Role") {
                let _arrayRoleName: any = [];
                data.ids.map((_dataRole: any) => {
                  _arrayRoleName.push(_dataRole.name);
                });

                let _objTable = {
                  Type: data.permissiontype,
                  Description:
                    _arrayRoleName.length === 0
                      ? ""
                      : _arrayRoleName.toString(),
                  Permission:
                    _arrayRolePermission.length === 0
                      ? ""
                      : _arrayRolePermission.toString(),
                };
                _arrayRoleTable.push(_objTable);
              }
              if (data.permissiontype === "Department") {
                let _arrayDepartmentName: any = [];

                data.ids.map((_department: any) => {
                  _arrayDepartmentName.push(
                    data === undefined || data === null
                      ? _department.name
                      : _department.name + " | " + _department.action
                  );
                });

                let _objTable = {
                  Type: data.permissiontype,
                  Description:
                    _arrayDepartmentName.length === 0
                      ? ""
                      : _arrayDepartmentName.toString(),
                  Permission:
                    _arrayRolePermission.length === 0
                      ? ""
                      : _arrayRolePermission.toString(),
                };
                _arrayRoleTable.push(_objTable);
              }

              if (data.permissiontype === "FormControl") {
                let _objTable;
                console.log(
                  "data.formcontroldata.formcontrol",
                  data.formcontrol
                );

                if (data.formcontrol.labeltype === "Table") {
                  _objTable = {
                    Type: data.permissiontype,
                    Description:
                      "label:" +
                      data.formcontrol.label +
                      " columnname:" +
                      data.formcontrol.labelcolumnname +
                      " type:" +
                      data.formcontrol.labeltype +
                      " valuetype:" +
                      data.formcontrol.labelvaluetype +
                      " informition:" +
                      data.formcontrol.labelInformition,
                    Permission:
                      _arrayRolePermission.length === 0
                        ? ""
                        : _arrayRolePermission.toString(),
                  };
                } else {
                  _objTable = {
                    Type: data.permissiontype,
                    Description:
                      "label:" +
                      data.formcontrol.label +
                      " type:" +
                      data.formcontrol.labeltype +
                      " valuetype:" +
                      data.formcontrol.labelvaluetype +
                      " informition:" +
                      data.formcontrol.labelInformition,
                    Permission:
                      _arrayRolePermission.length === 0
                        ? ""
                        : _arrayRolePermission.toString(),
                  };
                }
                _arrayRoleTable.push(_objTable);

                // props.setDataAuthorization_view(permissionType, props.keyAutoComplete);
                // props.setDataTable(_objTable);
                // props.setVisibleProps(props.keyAutoComplete);
                // console.log("_objTable", _objTable);
              }
              if (data.permissiontype === "Public") {
                let _objTable;
                _objTable = {
                  Type: data.permissiontype,
                  Description: "",
                  Permission:
                    _arrayRolePermission.length === 0
                      ? ""
                      : _arrayRolePermission.toString(),
                };
                _arrayRoleTable.push(_objTable);
              }
            }
          });
          console.log("_arrayRoleTable_arrayRoleTable", _arrayRoleTable);

          setPermissionTable(_arrayRoleTable);
          setAuthorization_view(_dataJson);
        }
      } else {
        let _dataJson =
          props.controlModel.Authorization_view === undefined ||
          props.controlModel.Authorization_view === null
            ? []
            : props.controlModel.Authorization_view.length === 0
            ? []
            : props.controlModel.Authorization_view;

        setKeyAuthorization_view("Authorization_view");
        setAuthorization_view(_dataJson);
      }
    }
  }, [props.controlModel, props.objectDataAuthorizationProps]);

  const labelStyle: any = {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "13px",
    lineHeight: "19px",
    marginLeft: "5px",
    color: "#000000",
  };
  async function _fechDepartment() {
    const _Department = await GetDepartment();

    let _dataFilter = _Department.filter(
      (_department: any) => _department.NameEn !== null
    );
    console.log("_dataFilter", _dataFilter);

    setDepartmentList(_dataFilter);
  }
  async function _dataTable(data: any) {
    if (editTablePermission.length === 0) {
      let _array: any = permissionTable;
      _array.push(data);
      console.log("dataaaaaaaaaaaaaaaaaa", data, _array);
      setPermissionTable(_array);
    }
  }

  async function _dataAuthorization_view(data: any, key: any) {
    let _array: any = Authorization_view;
    console.log("setDataAuthorization_view=>_array", { _array });

    console.log("setDataAuthorization_view", { data, key });
    _array.push(data);
    setAuthorization_view(_array);
    props.setControlModel((prevState: any) => ({
      ...prevState,
      [key]: _array,
    }));
  }
  async function _dataAuthorization_viewEdit(data: any, key: any) {
    console.log("setDataAuthorization_view", data);

    props.setControlModel((prevState: any) => ({
      ...prevState,
      ...data,
    }));
  }

  // const fetchRole = async () => {
  //   const roles = await GetAllDynamic("Roles/GetAll", undefined);
  //   setRoleData([...roles]);
  // };
  // const fetchCompany = async () => {
  //   const companies = await dataCompany();
  //   setCompanyData([...companies]);
  // };
  // const fetchDepartment = async () => {
  //   const departments = await GetDepartment();
  //   setDepartmentData([...departments]);
  // };
  function _VisibleModel(data: any) {
    setKeyAutoComplete(data);

    if (data === "Authorization_view" || data === "Authorization_view") {
      setEditTablePermission([]);
      setVisiblePermissionModel(!visiblePermissionModel);
    } else {
      setVisibleModel(!visibleModel);
    }
  }
  function _VisibleEditModel(key: any, data: any, inx: any) {
    setKeyAutoComplete(key);

    setEditTablePermission(props.controlModel.Authorization_view[inx.rowIndex]);
    setVisiblePermissionModel(!visiblePermissionModel);

    // setKeyAutoComplete(data);
    // if (data === "Authorization_view" || data === "Authorization_view") {
    //   setVisiblePermissionModel(!visiblePermissionModel);
    // } else {
    //   setVisibleModel(!visibleModel);
    // }
  }

  async function showModal(key: any) {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    setDialogVisible(!isDialogVisible);
    setKeyAutoComplete(key);
  }
  async function onDeleteRow(dataRow: any, option: any) {
    let _arrayPush: any = [];
    let _arrayPushPermissionTable: any = [];
    Authorization_view.map((data: any, inx: any) => {
      if (option !== inx) {
        _arrayPush.push(data);
      }
    });
    permissionTable.map((data: any, inx: any) => {
      if (option !== inx) {
        _arrayPushPermissionTable.push(data);
      }
    });
    setAuthorization_view(_arrayPush);
    setPermissionTable(_arrayPushPermissionTable);
    if (
      keyAuthorization_view === undefined ||
      keyAuthorization_view === null ||
      keyAuthorization_view.length === 0
    ) {
    } else {
      props.setControlModel((prevState: any) => ({
        ...prevState,
        [keyAuthorization_view]: _arrayPush,
      }));
    }
  }
  function _GameRoleID(data: any, key: any) {
    var _dataRole = data.split(",");
    let _arrayRole: any = [];
    _dataRole.map((dataRole: any) => {
      let roleDataFilter = props.objectDataAuthorizationProps.Role.filter(
        (_dataFilter: any) => _dataFilter.RoleId.toString() === dataRole
      );

      if (roleDataFilter.length !== 0) {
        _arrayRole.push(roleDataFilter[0]);
      }
    });
    if (key === "RoleID") {
      setRoleManage(_arrayRole);
    } else {
      setRoleRequest(_arrayRole);
    }
  }
  function _DepartmentGetJson(data: any) {
    console.log("data", data);

    if (props.actionProps === "add") {
      let _SpecificEmployeeId =
        data.templateForm.SpecificEmployeeId.length === 0
          ? []
          : data.templateForm.SpecificEmployeeId.split(",");
      let _specificArray: any = [];
      if (_SpecificEmployeeId.length !== 0) {
        let _employeeData =
          Object.keys(props.objectDataAuthorizationProps.Employee).length === 0
            ? []
            : props.objectDataAuthorizationProps.Employee;

        _employeeData.filter((_data: any) => {
          let _dataTo = _SpecificEmployeeId.filter(
            (dataTo: any) => _data.EmployeeId.toString() === dataTo
          );
          if (_dataTo.length !== 0) {
            _specificArray.push(_data);
          }
        });

        setEmployeeRequest(_specificArray);
      }
      if (
        data.templateForm.RoleID !== null &&
        data.templateForm.RoleID.length !== 0
      ) {
        _GameRoleID(data.templateForm.RoleID, "RoleID");
      }
      if (
        data.templateForm.SpecificRoleID !== null &&
        data.templateForm.SpecificRoleID.length !== 0
      ) {
        _GameRoleID(data.templateForm.SpecificRoleID, "SpecificRoleID");
      }

      if (data.Authorization_manage_department !== null) {
        if (data.Authorization_manage_department.length !== 0) {
          let _DepartmentData = data.Authorization_manage_department;

          setDepartmentManage(_DepartmentData);
        } else {
          setDepartmentManage([]);
        }
      }
      if (
        data.Authorization_request_company !== null &&
        data.Authorization_request_company.length !== 0
      ) {
        if (data.Authorization_request_company.length !== 0) {
          let _arrayManageCompanyDepartment: any = [];
          let _ManageCompany =
            data.Authorization_request_company === undefined ||
            data.Authorization_request_company === null ||
            data.Authorization_request_company.length === 0
              ? null
              : data.Authorization_request_company;
          if (_ManageCompany === null) {
          } else {
            let _arrayManageCompany: any = [];
            _ManageCompany.map((data: any) => {
              let companyDataFilter =
                props.objectDataAuthorizationProps.Company.filter(
                  (_data: any) => data.CompanyId === _data.CompanyId.toString()
                );
              if (companyDataFilter.length !== 0) {
                _arrayManageCompany.push(companyDataFilter[0]);
                let _dataFilterCompany =
                  props.objectDataAuthorizationProps.Department.filter(
                    (item: any) =>
                      item.CompanyCode === companyDataFilter[0].CompanyCode
                  );
                if (_arrayManageCompanyDepartment.length !== 0) {
                  // props.setIsLoad(true);
                  _arrayManageCompanyDepartment = [
                    ..._arrayManageCompanyDepartment,
                    ..._dataFilterCompany,
                  ];
                  // let _arrayData: any = [];
                  // for (
                  //   let k = 0;
                  //   k < _arrayManageCompanyDepartment.length;
                  //   k++
                  // ) {
                  //   // const element = array[index];
                  //   for (let l = 0; l < _dataFilterCompany.length; l++) {
                  //     // const element = _dataFilterCompany[l];
                  //     if (
                  //       _arrayManageCompanyDepartment[k].NameEn ===
                  //         _dataFilterCompany[l].NameEn ||
                  //       _arrayManageCompanyDepartment[k].NameTh ===
                  //         _dataFilterCompany[l].NameTh
                  //     ) {
                  //       _arrayData.push(_arrayManageCompanyDepartment[k]);
                  //       console.log(
                  //         "_arrayData_arrayData_arrayData_arrayData",
                  //         _arrayData
                  //       );
                  //     }
                  //     // {_arrayData.push()
                  //   }
                  //   // props.setIsLoad(false);
                  // }
                  // _arrayManageCompanyDepartment = _arrayData;
                }
                // else if (
                //   _arrayManageCompanyDepartment.length === 0 &&
                //   _arrayManageCompany.length === 1
                // ) {
                //   _arrayManageCompanyDepartment = [
                //     ..._arrayManageCompanyDepartment,
                //     ..._dataFilterCompany,
                //   ];
                // }
              }
            });
            if (_arrayManageCompany.length !== 0) {
              setDepartmentCompanyRequest([..._arrayManageCompanyDepartment]);
              setCompanyRequest(_arrayManageCompany);
            } else {
              setDepartmentCompanyRequest([]);
            }
          }
        }
      } else {
        setDepartmentCompanyRequest([]);
      }
      if (
        data.Authorization_manage_company !== null &&
        data.Authorization_manage_company.length !== 0
      ) {
        if (data.Authorization_manage_company.length !== 0) {
          let _ManageCompany =
            data.Authorization_manage_company === undefined ||
            data.Authorization_manage_company === null ||
            data.Authorization_manage_company.length === 0
              ? null
              : data.Authorization_manage_company;
          if (_ManageCompany === null) {
          } else {
            let _arrayManageCompany: any = [];
            let _arrayManageCompanyDepartment: any = [];
            _ManageCompany.map((data: any) => {
              let companyDataFilter =
                props.objectDataAuthorizationProps.Company.filter(
                  (_data: any) => data.CompanyId === _data.CompanyId.toString()
                );

              if (companyDataFilter.length !== 0) {
                _arrayManageCompany.push(companyDataFilter[0]);

                let _dataFilterCompany =
                  props.objectDataAuthorizationProps.Department.filter(
                    (item: any) =>
                      item.CompanyCode === companyDataFilter[0].CompanyCode
                  );
                if (_dataFilterCompany.length !== 0) {
                  // _arrayManageCompanyDepartment.push(_dataFilterCompany);
                  _arrayManageCompanyDepartment = [
                    ..._arrayManageCompanyDepartment,
                    ..._dataFilterCompany,
                  ];
                  // if (_arrayManageCompanyDepartment.length !== 0) {
                  //   // props.setIsLoad(true);
                  //   let _arrayData: any = [];
                  //   for (
                  //     let k = 0;
                  //     k < _arrayManageCompanyDepartment.length;
                  //     k++
                  //   ) {
                  //     // const element = array[index];
                  //     for (let l = 0; l < _dataFilterCompany.length; l++) {
                  //       // const element = _dataFilterCompany[l];
                  //       if (
                  //         _arrayManageCompanyDepartment[k].NameEn ===
                  //           _dataFilterCompany[l].NameEn ||
                  //         _arrayManageCompanyDepartment[k].NameTh ===
                  //           _dataFilterCompany[l].NameTh
                  //       ) {
                  //         _arrayData.push(_arrayManageCompanyDepartment[k]);
                  //         console.log(
                  //           "_arrayData_arrayData_arrayData_arrayData",
                  //           _arrayData
                  //         );
                  //       }
                  //       // {_arrayData.push()
                  //     }
                  //     // props.setIsLoad(false);
                  //   }
                  //   _arrayManageCompanyDepartment = _arrayData;
                  // } else if (
                  //   _arrayManageCompanyDepartment.length === 0 &&
                  //   _arrayManageCompany.length === 1
                  // ) {
                  //   _arrayManageCompanyDepartment = [
                  //     ..._arrayManageCompanyDepartment,
                  //     ..._dataFilterCompany,
                  //   ];
                  // }
                }
              }
            });

            if (_arrayManageCompany.length !== 0) {
              setDepartmentCompanyManage([..._arrayManageCompanyDepartment]);

              setCompanyManage(_arrayManageCompany);
            } else {
              setDepartmentCompanyManage([]);
            }
          }
        } else {
          console.log("aaaaaaaaaaaaaaa");

          setDepartmentCompanyManage([]);
        }
      } else {
        setDepartmentCompanyManage([]);
      }
      if (
        data.Authorization_request_company !== null &&
        data.Authorization_request_company.length !== 0
      ) {
        if (data.Authorization_request_company.length !== 0) {
          let _ManageCompany =
            data.Authorization_request_company === undefined ||
            data.Authorization_request_company === null ||
            data.Authorization_request_company.length === 0
              ? null
              : data.Authorization_request_company;
          if (_ManageCompany === null) {
          } else {
            let _arrayManageCompany: any = [];
            _ManageCompany.map((data: any) => {
              let companyDataFilter =
                props.objectDataAuthorizationProps.Company.filter(
                  (_data: any) => data.CompanyId === _data.CompanyId.toString()
                );
              if (companyDataFilter.length !== 0) {
                _arrayManageCompany.push(companyDataFilter[0]);
              }
            });
            if (_arrayManageCompany.length !== 0) {
              setCompanyRequest(_arrayManageCompany);
            }
          }
        }
      }
    } else {
      if (
        data.templateForm.SpecificRoleID !== null &&
        data.templateForm.SpecificRoleID.length !== 0
      ) {
        _GameRoleID(data.templateForm.SpecificRoleID, "SpecificRoleID");
      }

      if (
        data.templateForm.RoleID !== null &&
        data.templateForm.RoleID.length !== 0
      ) {
        _GameRoleID(data.templateForm.RoleID, "RoleID");
      }

      if (
        data.Authorization_manage_company !== null &&
        data.Authorization_manage_company.length !== 0
      ) {
        if (data.Authorization_manage_company.length !== 0) {
          let _ManageCompany =
            data.Authorization_manage_company === undefined ||
            data.Authorization_manage_company === null ||
            data.Authorization_manage_company.length === 0
              ? null
              : data.Authorization_manage_company;
          if (_ManageCompany === null) {
          } else {
            let _arrayManageCompany: any = [];
            let _arrayManageCompanyDepartment: any = [];
            _ManageCompany.map((data: any) => {
              let companyDataFilter =
                props.objectDataAuthorizationProps.Company.filter(
                  (_data: any) => data.CompanyId === _data.CompanyId.toString()
                );
              console.log("datadatadatadatadata", data, companyDataFilter);

              if (companyDataFilter.length !== 0) {
                _arrayManageCompany.push(companyDataFilter[0]);

                let _dataFilterCompany =
                  props.objectDataAuthorizationProps.Department.filter(
                    (item: any) =>
                      item.CompanyCode === companyDataFilter[0].CompanyCode
                  );
                if (_dataFilterCompany.length !== 0) {
                  console.log("_dataFilterCompany[0]", _dataFilterCompany);
                  // _arrayManageCompanyDepartment.push(_dataFilterCompany);
                  _arrayManageCompanyDepartment = [
                    ..._arrayManageCompanyDepartment,
                    ..._dataFilterCompany,
                  ];
                  // if (_arrayManageCompanyDepartment.length !== 0) {
                  //   // props.setIsLoad(true);
                  //   let _arrayData: any = [];
                  //   for (
                  //     let k = 0;
                  //     k < _arrayManageCompanyDepartment.length;
                  //     k++
                  //   ) {
                  //     // const element = array[index];
                  //     for (let l = 0; l < _dataFilterCompany.length; l++) {
                  //       // const element = _dataFilterCompany[l];
                  //       if (
                  //         _arrayManageCompanyDepartment[k].NameEn ===
                  //           _dataFilterCompany[l].NameEn ||
                  //         _arrayManageCompanyDepartment[k].NameTh ===
                  //           _dataFilterCompany[l].NameTh
                  //       ) {
                  //         _arrayData.push(_arrayManageCompanyDepartment[k]);
                  //         console.log(
                  //           "_arrayData_arrayData_arrayData_arrayData",
                  //           _arrayData
                  //         );
                  //       }
                  //       // {_arrayData.push()
                  //     }
                  //     // props.setIsLoad(false);
                  //   }
                  //   _arrayManageCompanyDepartment = _arrayData;
                  // } else if (
                  //   _arrayManageCompanyDepartment.length === 0 &&
                  //   _arrayManageCompany.length === 1
                  // ) {
                  //   _arrayManageCompanyDepartment = [
                  //     ..._arrayManageCompanyDepartment,
                  //     ..._dataFilterCompany,
                  //   ];
                  // }
                }
              }
            });
            console.log(
              "_arrayManageCompanyDepartment111111111111111jjjjjjjjj",
              _arrayManageCompanyDepartment,
              _arrayManageCompany
            );
            if (_arrayManageCompany.length !== 0) {
              console.log(
                "_arrayManageCompanyDepartment111111111111111",
                _arrayManageCompanyDepartment
              );
              setDepartmentCompanyManage([..._arrayManageCompanyDepartment]);
              setCompanyManage(_arrayManageCompany);
            } else {
              console.log(
                "_arrayManageCompanyDepartment111111111111111",
                _arrayManageCompanyDepartment
              );
              setDepartmentCompanyManage([]);
            }
          }
        } else {
          console.log("aaaaaaaaaaaaaaa");

          setDepartmentCompanyManage([]);
        }
      } else {
        console.log("aaaaaaaaaaaaaaa");

        setDepartmentCompanyManage([]);
      }
      if (
        data.Authorization_request_company !== null &&
        data.Authorization_request_company.length !== 0
      ) {
        if (data.Authorization_request_company.length !== 0) {
          let _arrayManageCompanyDepartment: any = [];
          let _ManageCompany =
            data.Authorization_request_company === undefined ||
            data.Authorization_request_company === null ||
            data.Authorization_request_company.length === 0
              ? null
              : data.Authorization_request_company;
          if (_ManageCompany === null) {
          } else {
            let _arrayManageCompany: any = [];
            _ManageCompany.map((data: any) => {
              let companyDataFilter =
                props.objectDataAuthorizationProps.Company.filter(
                  (_data: any) => data.CompanyId === _data.CompanyId.toString()
                );
              if (companyDataFilter.length !== 0) {
                _arrayManageCompany.push(companyDataFilter[0]);
                let _dataFilterCompany =
                  props.objectDataAuthorizationProps.Department.filter(
                    (item: any) =>
                      item.CompanyCode === companyDataFilter[0].CompanyCode
                  );
                if (_dataFilterCompany.length !== 0) {
                  // props.setIsLoad(true);
                  _arrayManageCompanyDepartment = [
                    ..._arrayManageCompanyDepartment,
                    ..._dataFilterCompany,
                  ];
                  // let _arrayData: any = [];
                  // for (
                  //   let k = 0;
                  //   k < _arrayManageCompanyDepartment.length;
                  //   k++
                  // ) {
                  //   // const element = array[index];
                  //   for (let l = 0; l < _dataFilterCompany.length; l++) {
                  //     // const element = _dataFilterCompany[l];
                  //     if (
                  //       _arrayManageCompanyDepartment[k].NameEn ===
                  //         _dataFilterCompany[l].NameEn ||
                  //       _arrayManageCompanyDepartment[k].NameTh ===
                  //         _dataFilterCompany[l].NameTh
                  //     ) {
                  //       _arrayData.push(_arrayManageCompanyDepartment[k]);
                  //       console.log(
                  //         "_arrayData_arrayData_arrayData_arrayData",
                  //         _arrayData
                  //       );
                  //     }
                  //     // {_arrayData.push()
                  //   }
                  //   // props.setIsLoad(false);
                  // }
                  // _arrayManageCompanyDepartment = _arrayData;
                }
              }
            });
            if (_arrayManageCompany.length !== 0) {
              setDepartmentCompanyRequest([..._arrayManageCompanyDepartment]);
              setCompanyRequest(_arrayManageCompany);
            } else {
              setDepartmentCompanyRequest([]);
            }
          }
        }
      } else {
        setDepartmentCompanyRequest([]);
      }
      if (
        data.Authorization_manage_department !== null &&
        data.Authorization_manage_department.length !== 0
      ) {
        if (data.Authorization_manage_department.length !== 0) {
          let _ManageCompany =
            data.Authorization_manage_department === undefined ||
            data.Authorization_manage_department === null ||
            data.Authorization_manage_department.length === 0
              ? null
              : data.Authorization_manage_department;
          if (_ManageCompany === null) {
          } else {
            setDepartmentManage(_ManageCompany);
          }
        }
      } else {
        setDepartmentManage([]);
      }
      if (
        data.Authorization_request_department !== null &&
        data.Authorization_request_department.length !== 0
      ) {
        if (data.Authorization_request_department.length !== 0) {
          let _ManageCompany =
            data.Authorization_request_department === undefined ||
            data.Authorization_request_department === null ||
            data.Authorization_request_department.length === 0
              ? null
              : data.Authorization_request_department;
          if (_ManageCompany === null) {
          } else {
            setDepartmentRequest(_ManageCompany);
          }
        }
      } else {
        setDepartmentRequest([]);
      }
    }
    // console.log("data.templateForm", data.templateForm);

    let _SpecificEmployeeId =
      data.templateForm.SpecificEmployeeId === undefined ||
      data.templateForm.SpecificEmployeeId === null ||
      data.templateForm.SpecificEmployeeId.length === 0
        ? []
        : data.templateForm.SpecificEmployeeId.split(",");
    let _specificArray: any = [];
    if (_SpecificEmployeeId.length !== 0) {
      let _employeeData =
        Object.keys(props.objectDataAuthorizationProps.Employee).length === 0
          ? []
          : props.objectDataAuthorizationProps.Employee;

      _employeeData.filter((_data: any) => {
        let _dataTo = _SpecificEmployeeId.filter(
          (dataTo: any) => _data.EmployeeId.toString() === dataTo
        );
        if (_dataTo.length !== 0) {
          _specificArray.push(_data);
        }
      });

      setEmployeeRequest(_specificArray);
    }
  }
  function _AutoComplete(data: any, key: any) {
    let _specificEmployeeId: any = [];
    // let _employeeRequest=employeeRequest

    if (key !== "SpecificEmployeeId") {
      props.setControlModel((prevState: any) => ({
        ...prevState,
        [key]: data,
      }));
    } else {
      let specificEmployeeId = data;
      specificEmployeeId.map((data: any) => {
        _specificEmployeeId.push(data.EmployeeId);
      });
      setEmployeeRequest(data);

      props.setControlModel((prevState: any) => ({
        ...prevState,
        templateForm: {
          ...props.controlModel.templateForm,
          [key]:
            _specificEmployeeId.length === 0
              ? ""
              : _specificEmployeeId.toString(),
        },
      }));
    }
  }
  function _Role(data: any, key: any) {
    let _RoleIdManage: any = [];
    let _RoleIdRequest: any = [];
    if (key === "RoleID") {
      let _roleIdManage = data;
      _roleIdManage.map((data: any) => {
        _RoleIdManage.push(data.RoleId);
      });

      setRoleManage(data);
    }
    if (key === "SpecificRoleID") {
      let _roleIdRequest = data;
      _roleIdRequest.map((data: any) => {
        _RoleIdRequest.push(data.RoleId);
      });
      setRoleRequest(data);
    }
    props.setControlModel((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...props.controlModel.templateForm,
        [key]:
          key === "RoleID"
            ? _RoleIdManage.toString()
            : _RoleIdRequest.toString(),
      },
    }));
  }
  function _Company(data: any, key: any) {
    let _CompanyManage: any = [];
    let _CompanyRequest: any = [];
    if (
      key === "Authorization_manage_company" ||
      key === "Authorization_manage_company"
    ) {
      let _companyManage = data;
      _companyManage.map((data: any) => {
        _CompanyManage.push({
          CompanyId: data.CompanyId.toString(),
          Name: data.NameEn,
        });
      });

      setCompanyManage(data);
      // for (let i = 0; i < _companyManage.length; i++) {

      //   // props.objectDataAuthorizationProps.Department
      //   let _dataFilterDepartment= props.objectDataAuthorizationProps.Department.filter((item:any)=> item.CompanyCode ===_companyManage[i].CompanyCode)
      //   if(_dataFilterDepartment.length!==0){

      //   }
      // }
      // console.log("_companyManage", _companyManage);

      // setCompanyManageDepartment(data);
    }
    if (
      key === "Authorization_request_company" ||
      key === "Authorization_request_company"
    ) {
      let _companyRequest = data;
      _companyRequest.map((data: any) => {
        _CompanyRequest.push({
          CompanyId: data.CompanyId.toString(),
          Name: data.NameEn,
        });
      });
      setCompanyRequest(data);
      // setCompanyRequestDepartment(data);
    }

    props.setControlModel((prevState: any) => ({
      ...prevState,
      [key]:
        key === "Authorization_manage_company" ||
        key === "Authorization_manage_company"
          ? _CompanyManage
          : _CompanyRequest,
    }));
  }

  return (
    <>
      <Toast ref={toast} />

      <Row className="sub-header">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            Authorization for Manage
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div className="row-formgroup">
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Role (s) :"}
              textSubProps={"กลุ่มคนที่ต้องการให้สิทธิ์ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <MultiSelect
              value={roleManage}
              options={props.objectDataAuthorizationProps.Role}
              onChange={(e: any) => {
                _Role(e.value, "RoleID");
              }}
              optionLabel={
                empData.employeeData.Lang == "EN" ? "NameEn" : "NameTh"
              }
              placeholder="-- Please Select Role --"
              display="chip"
              style={{ width: "100% ", fontSize: "13px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Company :"}
              textSubProps={"บริษัทที่ต้องการให้สิทธิ์ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <MultiSelect
              value={companyManage}
              options={props.objectDataAuthorizationProps.Company}
              onChange={(e: any) => {
                _Company(
                  e.value,
                  props.actionProps !== "add"
                    ? "Authorization_manage_company"
                    : "Authorization_manage_company"
                );
              }}
              optionLabel={
                empData.employeeData.Lang === "EN" ? "NameEn" : "NameTh"
              }
              placeholder="-- Please Select Company --"
              display="chip"
              style={{ width: "100% ", fontSize: "13px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Department :"}
              textSubProps={"แผนกที่ต้องการให้สิทธิ์ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <div className="p-inputgroup" style={{ height: "100%" }}>
              <div style={{ paddingBottom: "3px", width: "100%" }}>
                <AutoCompleteComponents
                  fieldProps="depname"
                  valueProps={departmentManage}
                  styleProps={{
                    width: "100%",
                    height:
                      departmentManage === undefined ||
                      departmentManage === null
                        ? "38px"
                        : departmentManage.length === 0
                        ? "38px"
                        : "100%",
                  }}
                  readOnlyprops={true}
                  // disabledProps={true}
                  onChangeProps={_AutoComplete}
                  keyProps={
                    props.actionProps !== "add"
                      ? "Authorization_manage_department"
                      : "Authorization_manage_department"
                  }
                />
              </div>
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={() =>
                  _VisibleModel(
                    props.actionProps !== "add"
                      ? "Authorization_manage_department"
                      : "Authorization_manage_department"
                  )
                }
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: departmentManage.length === 0 ? "38px" : "100%",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Row className="sub-header">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            Authorization for Request
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div className="row-formgroup">
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Employee (s) :"}
              textSubProps={"คนที่ให้สิทธิ์ในการขอเฉพาะ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <div className="p-inputgroup">
              <div style={{ paddingBottom: "3px", width: "100%" }}>
                <AutoCompleteComponents
                  fieldProps="NameEn"
                  valueProps={employeeRequest}
                  styleProps={{
                    width: "100%",
                    height:
                      employeeRequest === undefined || employeeRequest === null
                        ? "38px"
                        : employeeRequest.length !== 0
                        ? "100%"
                        : "38px",
                  }}
                  readOnlyprops={true}
                  onChangeProps={_AutoComplete}
                  keyProps={"SpecificEmployeeId"}
                />
              </div>
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={() => showModal("SpecificEmployeeId")}
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height:
                    employeeRequest === undefined || employeeRequest === null
                      ? "38px"
                      : employeeRequest.length !== 0
                      ? "100%"
                      : "38px",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Role (s) :"}
              textSubProps={"กลุ่มที่ให้สิทธิ์ในการขอเฉพาะ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <MultiSelect
              value={roleRequest}
              options={props.objectDataAuthorizationProps.Role}
              onChange={(e: any) => {
                _Role(e.value, "SpecificRoleID");
              }}
              optionLabel={
                empData.employeeData.Lang == "EN" ? "NameEn" : "NameTh"
              }
              placeholder="-- Please Select Role --"
              display="chip"
              style={{ width: "100% ", fontSize: "13px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Company :"}
              textSubProps={"บริษัทที่ต้องการให้สิทธิ์ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <MultiSelect
              value={companyRequest}
              options={props.objectDataAuthorizationProps.Company}
              onChange={(e: any) => {
                _Company(
                  e.value,
                  props.actionProps !== "add"
                    ? "Authorization_request_company"
                    : "Authorization_request_company"
                );
              }}
              optionLabel={
                empData.employeeData.Lang === "EN" ? "NameEn" : "NameTh"
              }
              placeholder="-- Please Select Company --"
              display="chip"
              style={{ width: "100% ", fontSize: "13px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Department :"}
              textSubProps={"แผนกที่ต้องการให้สิทธิ์ :"}
            />
          </Col>
          <Col
            xs={12}
            sm={10}
            className="referenceDocumentDialog-dialog-media-padding"
          >
            <div className="p-inputgroup" style={{ height: "100%" }}>
              <div style={{ paddingBottom: "3px", width: "100%" }}>
                <AutoCompleteComponents
                  fieldProps="depname"
                  valueProps={departmentRequest}
                  styleProps={{
                    width: "100%",
                    height:
                      departmentRequest === undefined ||
                      departmentRequest === null
                        ? "38px"
                        : departmentRequest.length === 0
                        ? "38px"
                        : "100%",
                  }}
                  readOnlyprops={true}
                  onChangeProps={_AutoComplete}
                  keyProps={
                    props.actionProps !== "add"
                      ? "Authorization_request_department"
                      : "Authorization_request_department"
                  }
                />
              </div>
              <ButtonComponents
                setIconProps={"pi pi-search"}
                setClassNameProps={"p-button-text-position"}
                onClickProps={() =>
                  _VisibleModel(
                    props.actionProps !== "add"
                      ? "Authorization_request_department"
                      : "Authorization_request_department"
                  )
                }
                setStyleProps={{
                  backgroundColor: "#282f6a",
                  border: "1px solid #282f6a",
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  boxShadow: "none",
                  height: departmentRequest.length === 0 ? "38px" : "100%",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Row className="sub-header">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            Authorization for View
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div className="row-formgroup">
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Row>
              <Col xs={12} md={12} lg={12} xl={12}>
                <div
                  className="row-formgroup"
                  onClick={() =>
                    console.log(
                      "Authorization for View,Authorization for View",
                      permissionTable
                    )
                  }
                >
                  <ButtonComponents
                    setStyleProps={{
                      width: "150px",
                      borderRadius: "6px",
                      boxShadow: "none",
                      border: "1px solid #282f6a",
                      fontSize: "13px",
                      paddingLeft: "16px",
                    }}
                    onClickProps={() =>
                      _VisibleModel(
                        props.actionProps !== "add"
                          ? "Authorization_view"
                          : "Authorization_view"
                      )
                    }
                    setLabelProps={"Add Permission"}
                    setIconProps={<FiPlus />}
                    setClassNameProps={"p-button-text-position"}
                  />
                  <DataTable
                    id="all_Approvals"
                    value={permissionTable}
                    onRowReorder={(e: any) => {}}
                    // selection={selectedApprovals}
                    onSelectionChange={(e) => {
                      // setSelectedApprovals(e.value);
                    }}
                    responsiveLayout="scroll"
                  >
                    <Column
                      field="Type"
                      // bodyClassName="approveMatrix-table"
                      header={<TextHeaderComponents textHeaderProps={"Type"} />}
                    ></Column>

                    <Column
                      field="Description"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents textHeaderProps={"Description"} />
                      }
                    ></Column>
                    <Column
                      field="Permission"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents textHeaderProps={"Permission"} />
                      }
                    ></Column>

                    <Column
                      bodyClassName="approveMatrix-table"
                      header={<TextHeaderComponents textHeaderProps={"Edit"} />}
                      body={(rowData: any, inx: any) => (
                        <button
                          className="table-button"
                          onClick={() => {
                            _VisibleEditModel(
                              props.actionProps !== "add"
                                ? "Authorization_view"
                                : "Authorization_view",
                              rowData,
                              inx
                            );
                          }}
                        >
                          <img src={editIcon} alt="logo" />
                        </button>
                      )}
                    ></Column>

                    <Column
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents textHeaderProps={"Delete"} />
                      }
                      body={(rowData: any, options: any) => {
                        return (
                          <button
                            className="table-button"
                            onClick={() => {
                              onDeleteRow(rowData, options.rowIndex);
                            }}
                          >
                            <img src={binIcon} alt="logo" />
                          </button>
                        );
                      }}
                    ></Column>
                  </DataTable>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <AuthorizationDepartmentModel
        visibleProps={visibleModel}
        departmentListProps={
          keyAutoComplete === "Authorization_manage_department"
            ? props.controlModel?.Authorization_manage_company?.length > 1 ||
              departmentCompanyManage.length !== 0
              ? departmentCompanyManage
              : props.objectDataAuthorizationProps.Department
            : keyAutoComplete === "Authorization_request_department"
            ? props.controlModel?.Authorization_request_company?.length > 1 ||
              departmentCompanyRequest.length !== 0
              ? departmentCompanyRequest
              : props.objectDataAuthorizationProps.Department
            : props.objectDataAuthorizationProps.Department
        }
        setVisibleProps={_VisibleModel}
        setControlModel={props.setControlModel}
        keyProps={keyAutoComplete}
        departmentRequestProp={departmentRequest}
        departmentManageProp={departmentManage}
      />
      <AuthorizationPermissionModel
        visibleProps={visiblePermissionModel}
        setVisibleProps={_VisibleModel}
        keyAutoComplete={keyAutoComplete}
        roleData={props.objectDataAuthorizationProps.Role}
        setDataTable={_dataTable}
        companyData={props.objectDataAuthorizationProps.Company}
        departmentListProps={props.objectDataAuthorizationProps.Department}
        controlModel={props.controlModel}
        advanceFormProps={props.advanceForm}
        actionProps={props.actionProps}
        setDataAuthorization_view={_dataAuthorization_view}
        editTablePermissionProps={editTablePermission}
        setDataAuthorization_viewEdit={_dataAuthorization_viewEdit}
      />
      {/* <EmployeeDialog
          isDialogVisibleProps={isDialogVisible}
          dataProps={employee}
          setDataProps={setSearchData}
          setisDialogVisibleProps={setDialogVisible}
          showModalProps={showModal}
          keyProps={key}
          onRowSelectProps={_AutoComplete}
          searchDataProps={searchData}
          valueProps={key === "CcId" ? ccSelect : toSelect}
        /> */}
      <EmployeeDialog
        isDialogVisibleProps={isDialogVisible}
        dataProps={props.objectDataAuthorizationProps.Employee}
        setDataProps={setSearchData}
        setisDialogVisibleProps={setDialogVisible}
        showModalProps={showModal}
        keyProps={keyAutoComplete}
        onRowSelectProps={_AutoComplete}
        searchDataProps={searchData}
        valueProps={employeeRequest}
      />
    </>
  );
};

export default AuthorizationComponent;
