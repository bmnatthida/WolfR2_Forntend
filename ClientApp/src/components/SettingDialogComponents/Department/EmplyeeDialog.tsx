import { Button } from "primereact/button";
import "./EmployeeDialog.css";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import "../Dialog.css";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  GetAllEmployee,
  UpdateEmployee,
  UpdateSignature,
} from "../../../Services/EmployeeService";
import { GetAllPosition } from "../../../Services/PositionService";
import { GetDepartment } from "../../../Services/DepartmentService";
import { FiSave } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import moment from "moment";
import { isEmptyObject } from "jquery";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { Toast } from "primereact/toast";
import useAlert from "../../../hooks/useAlert";

interface Props {
  dialogHeader: string;
  formData: any;
  tableData?: any;
  setTableData?: (items: any) => void;
  tableComfirmDialog?: boolean;
  setTableComfirmDialog?: (bool: boolean) => void;
  mainDialogVisible?: boolean;
  toggleMainDialog: (state: boolean, action: string) => void;
  setMainLoading?: (bool: boolean) => void;
}

export const EmployeeDialog = (props: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const { toggleAlert } = useAlert();
  const [messageConfirmDialog, setMessageConfirmDialog] = useState("");
  const [formSelectedPosition, setFormSelectedPosition] = useState<any>([]);
  const [formSelectedDepartment, setFormSelectedDepartment] = useState<any>([]);
  const [formSelectedDivision, setFormSelectedDivision] = useState<any>([]);
  const [positionList, setPositionList] = useState<any>([]);
  const [deptList, setDeptList] = useState<any>([]);
  const [divList, setDivtList] = useState<any>([]);
  const [dataEmployeeList, setDataEmployeeList] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [report_To, setReport_To] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadFile, setUploadFile] = useState<any>();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [subDialogVisible, setSubDialogVisible] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const toast = useRef<any>(null);

  useEffect(() => {
    fetchPosition();
    fetchDataEmployee();
    fetchDivision();
    fetchDepartment();
    if (!isEmptyObject(props.formData)) {
      const rowDataPosition = {
        PositionId: props.formData.PositionId,
        NameTh: props.formData.PositionNameTh,
        NameEn: props.formData.PositionNameEn,
      };
      const rowDataDept = {
        DepartmentId: props.formData.DepartmentId,
        NameTh: props.formData.DepartmentNameTh,
        NameEn: props.formData.DepartmentNameEn,
      };
      setFormSelectedPosition(rowDataPosition);
      setFormSelectedDepartment(rowDataDept);
      setAction("edit");
    } else {
      setAction("add");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setMessageConfirmDialog("Do you want to " + action + " this record?");
  }, [action]);

  useEffect(() => {
    if (props.mainDialogVisible) {
      const rowDataPosition = {
        PositionId: props.formData.PositionId,
        NameTh: props.formData.PositionNameTh,
        NameEn: props.formData.PositionNameEn,
      };
      const rowDataDept = {
        DepartmentId: props.formData.DepartmentId,
        NameTh: props.formData.DepartmentNameTh,
        NameEn: props.formData.DepartmentNameEn,
      };
      setFormSelectedPosition(rowDataPosition);
      setFormSelectedDepartment(rowDataDept);
      fetchPosition();
      fetchDataEmployee();

      fetchDepartment();
      fetchDivision();
      setLoading(false);
    } else {
      setFormSelectedPosition(null);
      setFormSelectedDepartment(null);
      setUploadFile(undefined);
    }
  }, [props.mainDialogVisible]);

  async function fetchDataEmployee() {
    let _dataEmployee = await GetAllEmployee();
    let selectedEmp = {
      EmployeeId: Number,
      NameTh: String,
      Report_ToNameEn: String,
    };

    _dataEmployee.map((e: any) => {
      if (e.EmployeeId === Number(props.formData.ReportToEmpCode)) {
        selectedEmp.EmployeeId = e.EmployeeId;
        selectedEmp.NameTh = e.NameTh;
        selectedEmp.Report_ToNameEn = e.NameEn;
        setReport_To(selectedEmp);
      }
    });

    setDataEmployeeList(_dataEmployee);
    setSearchData(_dataEmployee);
  }

  async function fetchPosition() {
    let _dataPosition = await GetAllPosition();

    let newList: any = [];

    for (let i = 0; i < _dataPosition.length; i++) {
      let positionList = {
        PositionId: Number,
        NameTh: String,
        NameEn: String,
      };

      positionList.PositionId = _dataPosition[i].PositionId;
      positionList.NameTh = _dataPosition[i].NameTh;
      positionList.NameEn = _dataPosition[i].NameEn;

      if (positionList.PositionId === props.formData.PositionId) {
        setFormSelectedPosition(positionList);
      }

      newList.push(positionList);
    }

    setPositionList(newList);
  }

  async function fetchDepartment() {
    let _dataOrgranize = await GetDepartment();

    let newList: any = [];

    for (let i = 0; i < _dataOrgranize.length; i++) {
      let deptList = {
        DepartmentId: Number,
        NameTh: String,
        NameEn: String,
      };

      deptList.DepartmentId = _dataOrgranize[i].DepartmentId;
      deptList.NameTh = _dataOrgranize[i].NameTh;
      deptList.NameEn = _dataOrgranize[i].NameEn;
      if (deptList.DepartmentId === props.formData.DepartmentId) {
        setFormSelectedDepartment(deptList);
      }
      newList.push(deptList);
    }

    setDeptList(newList);
  }

  async function fetchDivision() {
    let _dataDivision = await GetAllDynamic("Division/GetAll", undefined);

    let newList: any = [];

    for (let i = 0; i < _dataDivision.length; i++) {
      let divtList = {
        DivisionId: Number,
        NameTh: String,
        NameEn: String,
      };

      divtList.DivisionId = _dataDivision[i].DivisionId;
      divtList.NameTh = _dataDivision[i].NameTh;
      divtList.NameEn = _dataDivision[i].NameEn;
      if (divtList.DivisionId === props.formData.DivisionId) {
        setFormSelectedDepartment(divtList);
      }
      newList.push(divtList);
    }

    setDivtList(newList);
  }

  const updateChanges = (data: any) => {
    if (!subDialogVisible && props.mainDialogVisible) {
      if (
        data.Position.PositionId !== undefined &&
        data.Department.DepartmentId !== undefined
      ) {
        confirmDialog({
          message: messageConfirmDialog,
          header:
            action === "add"
              ? "Add" + " Confirmation"
              : "Edit" + " Confirmation",
          icon: "p-confirm-dialog-icon pi pi-info-circle",
          acceptClassName:
            "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
          accept: () => {
            if (props.setMainLoading !== undefined) {
              props.setMainLoading(true);
            }
            acceptSave(data);
          },
        });
      }
    }
  };

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const acceptSave = async (data: any) => {
    let formData: any = {};
    const tableData = props.tableData;
    const dup = tableData.filter(
      (e: any) =>
        e.EmployeeCode === data.EmployeeCode &&
        e.EmployeeId !== props.formData.EmployeeId
    );

    if (dup.length === 0) {
      if (action === "add") {
        formData.EmployeeId = 0;
        formData.Username = data.Username;
        formData.EmployeeCode = data.EmployeeCode;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.Email = data.Email;
        formData.IsActive = data.IsActive;
        formData.PositionId = data.Position.PositionId;
        formData.PositionNameTh = data.Position.NameTh;
        formData.PositionNameEn = data.Position.NameEn;
        formData.DepartmentId = data.Department.DepartmentId;
        formData.DepartmentNameTh = data.Department.NameTh;
        formData.DepartmentNameEn = data.Department.NameEn;
        formData.DivisionId = data.Division.DivisionId;
        formData.DivisionNameTh = data.Division.NameTh;
        formData.DivisionNameEn = data.Division.NameEn;
        formData.Lang = data.Lang;
        formData.ReportToEmpCode = report_To?.EmployeeId?.toString();
        formData.ModifiedDate = new Date().toLocaleString("en-UK", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        formData.ModifiedBy = userData.employeeData.EmployeeId.toString();
        formData.CreatedDate = new Date().toLocaleString("en-UK", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        formData.CreatedBy = userData.employeeData.EmployeeId.toString();
      } else {
        formData = props.formData;
        formData.Username = data.Username;
        formData.EmployeeCode = data.EmployeeCode;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.Email = data.Email;
        formData.IsActive = data.IsActive;
        formData.PositionId = data.Position.PositionId;
        formData.PositionNameTh = data.Position.NameTh;
        formData.PositionNameEn = data.Position.NameEn;
        formData.DepartmentId = data.Department.DepartmentId;
        formData.DepartmentNameTh = data.Department.NameTh;
        formData.DepartmentNameEn = data.Department.NameEn;
        formData.DivisionId = data.Division.DivisionId;
        formData.DivisionNameTh = data.Division.NameTh;
        formData.DivisionNameEn = data.Division.NameEn;
        formData.Lang = data.Lang;
        formData.ReportToEmpCode = report_To?.EmployeeId?.toString();
        formData.ModifiedDate = new Date().toLocaleString("en-UK", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        formData.ModifiedBy = userData.employeeData.EmployeeId.toString();
      }
      let result = await UpdateEmployee(formData);
      if (uploadFile !== undefined) {
        formData.SignPicPath = uploadFile;
        result = await UpdateSignature(formData);
      }
      if (result.result === "success") {
        props.setMainDialogVisible(false);
        let newData: any[] = await GetAllDynamic("Employee/GetAll", undefined);
        if (newData.length > 0) {
          props.setTableData(newData);
        }
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
      } else {
        // toast.current?.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: result.errorMessage,
        //   life: 3000,
        // });
        toggleAlert({
          description: `${result.errorMessage}`,
          message: `Error`,
          type: "error",
        });
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
      }
    } else {
      if (props.setMainLoading !== undefined) {
        props.setMainLoading(false);
      }
      toggleAlert({
        description: `This EmployeeCode ${dup[0].EmployeeCode} is duplicate with ${dup[0].NameEn}`,
        message: `Error`,
        type: "error",
      });
      // toast.current?.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail:
      //     "This EmployeeCode " +
      //     dup[0].EmployeeCode +
      //     " is duplicate with " +
      //     dup[0].NameEn,
      //   life: 5000,
      // });
    }

    // props.setMainDialogVisible(false);
    // if (props.setMainLoading !== undefined) {
    //   props.setMainLoading(false);
    // }
  };

  const onRowSelect = (event: any) => {
    setReport_To(event.data);
    setSubDialogVisible(false);
    setLoading(false);
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const dataEmp = dataEmployeeList;
    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      if (
        data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.NameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.PositionNameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.DepartmentNameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ) {
        return true;
      }
    });
    setSearchData([...data]);
  };

  const onFileSelect = (e: any) => {
    getBase64(e.target.files[0]);
  };

  function getBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setUploadFile(reader.result);
    };
    reader.onerror = function (error) {
      // console.log("Error: ", error);
    };
  }

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <span className="p-input-icon-left set-span-search-dialog ">
          <i className="pi pi-search" />
          <InputText
            className="set-input-search-dialog"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      {!loading && (
        <Dialog
          visible={props.mainDialogVisible}
          breakpoints={{}}
          style={{ width: "60vw", borderRadius: "16px" }}
          header={props.dialogHeader}
          modal
          className="p-fluid"
          onHide={() => {
            reset();
            props.setMainDialogVisible(false);
          }}
          draggable={false}
          blockScroll
        >
          <form onSubmit={handleSubmit(updateChanges)} className="p-fluid">
            {" "}
            <div className="row set-layout-form-edit-table ">
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Employee Code"}
                  textSubProps={"รหัสพนักงาน"}
                  isRequir
                />
              </div>
              <div className="col-xl-4 ">
                <Controller
                  name="EmployeeCode"
                  control={control}
                  defaultValue={props.formData.EmployeeCode}
                  rules={{ required: "Employee Code is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      maxLength={10}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("EmployeeCode")}
              </div>

              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Username"}
                  textSubProps={"ชื่อผู้ใช้"}
                  isRequir
                />
              </div>
              <div className="col-xl-4 ">
                <Controller
                  name="Username"
                  control={control}
                  defaultValue={props.formData.Username}
                  rules={{ required: "Username is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("Username")}
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Name TH"}
                  textSubProps={"ชื่อพนักงานภาษาไทย"}
                  isRequir
                />
              </div>
              <div className="col-xl-4 ">
                <Controller
                  name="NameTh"
                  control={control}
                  defaultValue={props.formData.NameTh}
                  rules={{ required: "NameTH is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("NameTh")}
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Name EN"}
                  textSubProps={"ชื่อพนักงานภาษาอังกฤษ"}
                  isRequir
                />
              </div>
              <div className="col-xl-4 ">
                <Controller
                  name="NameEn"
                  control={control}
                  defaultValue={props.formData.NameEn}
                  rules={{ required: "NameEN is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("NameEn")}
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Email"}
                  textSubProps={"อีเมล"}
                  isRequir
                />
              </div>
              <div className="col-xl-4 ">
                <Controller
                  name="Email"
                  control={control}
                  defaultValue={props.formData.Email}
                  rules={{ required: "Email is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("Email")}
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Language"}
                  textSubProps={"ภาษา"}
                />
              </div>
              <div className="col-xl-4 ">
                <Controller
                  name="Lang"
                  control={control}
                  defaultValue={props.formData.Lang}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </div>
              {props.dialogHeader !== "Edit Profile" && (
                <>
                  {" "}
                  <div className="col-xl-2 font-size-edit-header-input-request">
                    <TextHeaderComponents
                      textHeaderProps={"Active Status"}
                      textSubProps={"สถานะ"}
                    />
                  </div>
                  <div className="col-xl-10">
                    <Controller
                      name="IsActive"
                      defaultValue={
                        props.formData.IsActive &&
                        props.formData.IsActive === "true"
                      }
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputSwitch
                          inputId={field.name}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
                        />
                      )}
                    />
                  </div>{" "}
                </>
              )}

              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Position"}
                  textSubProps={"ตำแหน่ง"}
                  isRequir
                />
              </div>
              <div className="col-xl-10">
                <Controller
                  name="Position"
                  control={control}
                  rules={{ required: "Position is required." }}
                  defaultValue={formSelectedPosition}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      // value={formSelectedPosition}
                      id={field.name}
                      {...field}
                      options={positionList}
                      optionLabel="NameEn"
                      placeholder="Select a Position"
                      className={classNames({
                        "p-invalid": field?.value?.PositionId === undefined,
                      })}
                      // onChange={(e: any) => setFormSelectedPosition(e.value)}
                    />
                  )}
                />
                {getFormErrorMessage("Position")}
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Department"}
                  textSubProps={"หน่วยงาน"}
                  isRequir
                />
              </div>
              <div className="col-xl-10">
                <Controller
                  name="Department"
                  control={control}
                  rules={{ required: "Department is required." }}
                  defaultValue={formSelectedDepartment}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      options={deptList}
                      optionLabel="NameEn"
                      className={classNames({
                        "p-invalid": field?.value?.DepartmentId === undefined,
                      })}
                      placeholder="Select a Department"
                      // onChange={(e: any) => setFormSelectedDepartment(e.value)}
                    />
                  )}
                />
                {getFormErrorMessage("Department")}
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Division"}
                  textSubProps={"ฝ่ายง่าย"}
                />
              </div>
              <div className="col-xl-10">
                <Controller
                  name="Division"
                  control={control}
                  defaultValue={formSelectedDivision}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      options={divList}
                      optionLabel="NameEn"
                      placeholder="Select a Division"
                      // onChange={(e: any) => setFormSelectedDivision(e.value)}
                    />
                  )}
                />
              </div>
              <div className="col-xl-2 font-size-edit-header-input-request">
                <TextHeaderComponents
                  textHeaderProps={"Report to"}
                  textSubProps={"รายงานไปที่"}
                />
              </div>
              <div className="col-xl-10">
                <Controller
                  name="ReportToEmpCode"
                  control={control}
                  defaultValue={report_To}
                  render={({ field, fieldState }) => (
                    <div className="p-inputgroup">
                      <InputText
                        id={field.name}
                        value={report_To.NameTh}
                        autoFocus
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                        style={{ borderRadius: "6px 0 0 6px", height: "38px" }}
                        readOnly
                      />
                      <Button
                        icon="pi pi-search"
                        className="p-button-text-position p-button-text-position-hover "
                        style={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "38px",
                        }}
                        onClick={() => {
                          setSubDialogVisible(true);
                        }}
                      />
                    </div>
                  )}
                />
                {getFormErrorMessage("ReportToEmpCode")}
              </div>
              {action !== "add" && (
                <>
                  <div className="col-xl-2 font-size-edit-header-input-request">
                    <TextHeaderComponents
                      textHeaderProps={"Signature"}
                      textSubProps={"ลายเซ็น"}
                    />
                  </div>
                  <div className="col-xl-10">
                    <div>
                      <Controller
                        name="uploadFile"
                        control={control}
                        defaultValue={uploadFile}
                        render={({ field, fieldState }) => (
                          <div className="p-inputgroup">
                            <InputText
                              type="file"
                              accept="image/*"
                              id="formFile"
                              onChange={onFileSelect}
                              style={{
                                borderRadius: "6px 0 0 6px",
                                height: "38px",
                              }}
                            />
                            <Button
                              type="reset"
                              icon="pi pi-times"
                              className="p-button-danger p-button-danger-hover"
                              onClick={() => {
                                setUploadFile("");
                              }}
                              style={{
                                height: "38px",
                                borderRadius: "0 6px 6px 0",
                              }}
                            />
                          </div>
                        )}
                      ></Controller>
                      {uploadFile !== undefined ? (
                        <div className="image-box">
                          <img className="table-img" src={uploadFile} />
                        </div>
                      ) : (
                        <div className="image-box">
                          <img
                            className="table-img"
                            src={props.formData.SignPicPath}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="footer-dialog">
              <button
                onClick={() => {
                  reset();
                  props.setMainDialogVisible(false);
                }}
                className="button-cancle"
              >
                Close
              </button>

              <button className="button-save" type="submit">
                <FiSave />
                Save
              </button>
            </div>
          </form>
        </Dialog>
      )}

      <Dialog
        header={renderHeader}
        visible={subDialogVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={() => setSubDialogVisible(false)}
        className="requestor-dialog"
        draggable={false}
        resizable={false}
        closable={true}
      >
        <DataTable
          paginator
          rows={5}
          value={searchData}
          selectionMode="single"
          tableStyle={{ border: "1px solid #e6e6e6", outlineColor: "#e6e6e6" }}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={onRowSelect}
        >
          <Column
            field="EmployeeCode"
            header={
              <tr>
                <th>
                  <p className="row headtext">EmployeeCode</p>
                  <p className="row subtext">รหัสพนักงาน</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="NameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Name</p>
                  <p className="row subtext">ชื่อ</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="PositionNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Position</p>
                  <p className="row subtext">ตำแหน่ง</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="DepartmentNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Department</p>
                  <p className="row subtext">หน่วยงาน</p>
                </th>
              </tr>
            }
          ></Column>
        </DataTable>
      </Dialog>
    </div>
  );
};
