import { Col, Row } from "antd";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useState, FC, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { useUserContext } from "../../../Context/UserContext";
import { ProgressBar } from "primereact/progressbar";
import { GetDepartment } from "../../../Services/DepartmentService";
import { GetAllDynamic } from "../../../Services/DynamicService";
import {
  GetAllEmployee,
  UpdateEmployee,
  UpdateSignature,
} from "../../../Services/EmployeeService";
import { GetAllPosition } from "../../../Services/PositionService";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { IUserModel } from "../../../IRequestModel/IUserModel";
import { CheckCanEditProfile } from "../../../Services/AppSettingService";
import useAlert from "../../../hooks/useAlert";
import { useTranslation } from "react-i18next";

type Props = {
  rowData: any;
  dialogHeader: string;
  mainDialogVisible?: boolean;
  toggleMainDialog: (state: boolean, action: string) => void;
  tableData?: any;
  setMainLoading?: (bool: boolean) => void;
  setTableData?: (items: any) => void;
  canEditOnlySignature?: boolean;
  isEditProfile?: boolean;
};

interface IEmployeeForm {
  EmployeeId: number;
  EmployeeCode: string;
  Username: string;
  NameTh: string;
  NameEn: string;
  Email: string;
  IsActive: boolean;
  PositionId: number;
  PositionNameTh: string;
  PositionNameEn: string;
  DepartmentId: number;
  DepartmentNameTh: string;
  DepartmentNameEn: string;
  DivisionId: number;
  DivisionNameTh: string;
  DivisionNameEn: string;
  ReportToEmpCode: string;
  SignPicPath: string;
  Lang: string;
  AccountCode: string;
  AccountName: string;
  DefaultLang: string;
  CreatedDate: string;
  CreatedBy: string;
  ModifiedDate: string;
  ModifiedBy: string;
  ADTitle: string;
}

const EmployeeDialogFix: FC<Props> = ({
  rowData,
  dialogHeader,
  mainDialogVisible,
  toggleMainDialog,
  tableData,
  setTableData,
  setMainLoading,
  canEditOnlySignature,
  isEditProfile,
}) => {
  const [positionList, setPositionList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [divList, setDivtList] = useState<any[]>([]);
  const [dataEmployeeList, setDataEmployeeList] = useState<any[]>([]);
  const [subDialogVisible, setSubDialogVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [action, setAction] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<any>();
  const [userData, setUserData] = useUserContext();
  const [messageConfirmDialog, setMessageConfirmDialog] = useState("");
  const [editProfileSetting, setEditProfileSetting] = useState<any>();
  const toast = useRef<any>(null);
  const { i18n } = useTranslation(["translation"]);
  const { toggleAlert } = useAlert();

  let defaultValues: IEmployeeForm = {
    EmployeeId: 0,
    EmployeeCode: "",
    Username: "",
    NameTh: "",
    NameEn: "",
    Email: "",
    IsActive: true,
    PositionId: 0,
    PositionNameTh: "",
    PositionNameEn: "",
    DepartmentId: 0,
    DepartmentNameTh: "",
    DepartmentNameEn: "",
    DivisionId: 0,
    DivisionNameTh: "",
    DivisionNameEn: "",
    ReportToEmpCode: "",
    SignPicPath: "",
    Lang: "",
    AccountCode: "",
    AccountName: "",
    DefaultLang: "",
    CreatedDate: "",
    CreatedBy: "",
    ModifiedDate: "",
    ModifiedBy: "",
    ADTitle: "",
  };

  const {
    control,
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IEmployeeForm>({
    defaultValues,
  });

  useEffect(() => {
    if (mainDialogVisible) {
      if (dialogHeader === "Edit Profile") {
        setAction("edit");
      } else if (dialogHeader === "Employee") {
        setAction("edit");
      } else {
        setAction("add");
      }
    } else {
      setUploadFile(undefined);
    }
  }, [mainDialogVisible]);

  useEffect(() => {
    setMessageConfirmDialog("Do you want to " + action + " this record?");
  }, [action]);

  const acceptSave = async (data: IEmployeeForm) => {
    if (data.Lang === "EN") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("th");
    }
    localStorage.setItem("lang", data.Lang);
    let formData: any = {};
    let isCodeDup = false;
    let isEmailDup = false;
    let empDup: any;
    dataEmployeeList.forEach((e: any) => {
      if (e.EmployeeId !== rowData.EmployeeId) {
        if (e.EmployeeCode === data.EmployeeCode) {
          isCodeDup = true;
          empDup = e;
          return;
        } else if (e.Email === data.Email) {
          isEmailDup = true;
          empDup = e;
          return;
        }
      }
    });

    const selectedPosition = positionList.find(
      (pos: any) => pos.PositionId === data.PositionId
    );
    const selectedDept = departmentList.find(
      (dept: any) => dept.DepartmentId === data.DepartmentId
    );
    const selectedDiv = divList.find(
      (div: any) => div.DivisionId === data.DivisionId
    );
    const selectedEmp = dataEmployeeList.find(
      (emp: any) => emp.EmployeeId == data.ReportToEmpCode
    );

    // if (!isCodeDup && !isEmailDup) {
    if (action === "add") {
      formData.EmployeeId = 0;
      formData.Username = data.Username;
      formData.EmployeeCode = data.EmployeeCode;
      formData.NameTh = data.NameTh;
      formData.NameEn = data.NameEn;
      formData.Email = data.Email;
      formData.IsActive = data.IsActive;
      formData.PositionId = selectedPosition?.PositionId;
      formData.PositionNameTh = selectedPosition?.NameTh;
      formData.PositionNameEn = selectedPosition?.NameEn;
      formData.DepartmentId = selectedDept?.DepartmentId;
      formData.DepartmentNameTh = selectedDept?.NameTh;
      formData.DepartmentNameEn = selectedDept?.NameEn;
      formData.DivisionId = selectedDiv?.DivisionId;
      formData.DivisionNameTh = selectedDiv?.NameTh;
      formData.DivisionNameEn = selectedDiv?.NameEn;
      formData.Lang = data.Lang;
      formData.ReportToEmpCode = selectedEmp?.EmployeeId?.toString();
      formData.ModifiedDate = new Date().toLocaleString("en-UK", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      formData.ModifiedBy = userData.EmployeeId.toString();
      formData.CreatedDate = new Date().toLocaleString("en-UK", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      formData.CreatedBy = userData.EmployeeId.toString();
    } else {
      formData = rowData;
      formData.Username = data.Username;
      formData.EmployeeCode = data.EmployeeCode;
      formData.NameTh = data.NameTh;
      formData.NameEn = data.NameEn;
      formData.Email = data.Email;
      dialogHeader !== "Edit Profile"
        ? data.IsActive !== undefined && data.IsActive.toString() !== ""
          ? (formData.IsActive = data.IsActive)
          : (formData.IsActive = false)
        : (formData.IsActive = true);
      formData.PositionId = selectedPosition?.PositionId;
      formData.PositionNameTh = selectedPosition?.NameTh;
      formData.PositionNameEn = selectedPosition?.NameEn;
      formData.DepartmentId = selectedDept?.DepartmentId;
      formData.DepartmentNameTh = selectedDept?.NameTh;
      formData.DepartmentNameEn = selectedDept?.NameEn;
      formData.DivisionId = selectedDiv?.DivisionId;
      formData.DivisionNameTh = selectedDiv?.NameTh;
      formData.DivisionNameEn = selectedDiv?.NameEn;
      formData.Lang = data.Lang;
      formData.ReportToEmpCode = selectedEmp?.EmployeeId?.toString();
      formData.ModifiedDate = new Date().toLocaleString("en-UK", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      formData.ModifiedBy = userData.EmployeeId.toString();
    }

    let result = await UpdateEmployee(formData);
    if (uploadFile !== undefined) {
      formData.SignPicPath = uploadFile;
      result = await UpdateSignature(formData);
    }

    if (result.result === "success") {
      if (dialogHeader === "Edit Profile") {
        let newUser: IUserModel = formData;
        setUserData({
          ...newUser,
        });
      } else {
        if (setTableData !== undefined) {
          let newData: any[] = await GetAllDynamic(
            "Employee/GetAll",
            undefined
          );
          if (newData.length > 0) {
            setTableData(newData);
          }
          // if (props.setMainLoading !== undefined) {
          //   setMainLoading(false);
          // }
          setLoading(false);
        }
      }

      toggleMainDialog(false, "save");
    } else {
      // if (props.setMainLoading !== undefined) {
      //   setMainLoading(false);
      // }
      toggleAlert({
        description: `${result.errorMessage || result.title}`,
        message: `Error`,
        type: "error",
      });
      // toast.current?.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: result.errorMessage || result.title,
      //   life: 5000,
      // });
      setLoading(false);
    }
    // } else {
    //   if (isCodeDup) {
    //     toggleAlert({
    //       description: `This EmployeeCode ${empDup.EmployeeCode} is duplicate with ${empDup.NameEn}`,
    //       message: `Dupplicate field warning.`,
    //       type: "warning",
    //     });
    //   }
    //   if (isEmailDup) {
    //     toggleAlert({
    //       description: `This EmployeeCode ${empDup.Email} is duplicate with ${empDup.NameEn}`,
    //       message: `Dupplicate field warning.`,
    //       type: "warning",
    //     });
    //   }
    //   setLoading(false);
    // }
  };

  const onSubmit = (data: IEmployeeForm) => {
    confirmDialog({
      message: messageConfirmDialog,
      header:
        action === "add" ? "Add" + " Confirmation" : "Edit" + " Confirmation",
      icon: "p-confirm-dialog-icon pi pi-info-circle",
      acceptClassName:
        "p-button p-component p-confirm-dialog-accept table-accept p-button-success table-control-confirm-button p-button-accept-cancel",
      accept: () => {
        // if (dialogHeader !== "Edit Profile") {
        //   toggleMainLoading();
        // } else {
        setLoading(true);
        // }
        acceptSave(data);
      },
    });
  };

  useEffect(() => {
    setLoading(true);

    fetchDepartment();
    fetchDivision();
    fetchDataEmployee();
    getSetting();
    fetchPosition();
  }, []);

  const getSetting = async () => {
    const canEditProfile = await CheckCanEditProfile();

    setEditProfileSetting(canEditProfile);
  };

  async function fetchPosition() {
    let _dataPosition = await GetAllDynamic("Position/GetAll", undefined);
    if (_dataPosition) {
      _dataPosition.map((e: any) => {
        if (!e.CompanyCode) {
          e.NameEn = e.NameEn;
          e.NameTh = e.NameTh;
          return e;
        }
        e.NameEn = e.CompanyCode + " : " + e.NameEn;
        e.NameTh = e.CompanyCode + " : " + e.NameTh;
        return e;
      });
    }

    setPositionList(_dataPosition?.filter((e: any) => e.IsActive));
  }
  async function fetchDataEmployee() {
    let _dataEmployee = await GetAllDynamic("Employee/GetAll", undefined);

    if (_dataEmployee) {
      const user = _dataEmployee.find(
        (e: any) => e.EmployeeId === rowData.EmployeeId
      );
      if (user) {
        reset(user);
      }

      setDataEmployeeList(_dataEmployee?.filter((e: any) => e.IsActive));
    }
    setLoading(false);
  }
  async function fetchDepartment() {
    let _dataOrgranize = await GetDepartment();
    _dataOrgranize.map((e: any) => {
      if (!e.CompanyCode) {
        e.NameEn = e.NameEn;
        e.NameTh = e.NameTh;
        return e;
      }
      e.NameEn = e.CompanyCode + " : " + e.NameEn;
      e.NameTh = e.CompanyCode + " : " + e.NameTh;
      return e;
    });

    setDepartmentList(_dataOrgranize?.filter((e: any) => e.IsActive));
  }
  async function fetchDivision() {
    try {
      let _dataDivision: any[] = await GetAllDynamic(
        "Division/GetAll",
        undefined
      );
      setDivtList([..._dataDivision?.filter((e: any) => e.IsActive)]);
    } catch (error) {}
  }

  const getReportTo = (currentCode: any) => {
    let val = "";
    if (currentCode) {
      const emp = dataEmployeeList.find(
        (e: any) => e.EmployeeId == currentCode
      );
      if (emp) {
        if (userData?.Lang === "EN") {
          val = emp.NameEn;
        } else {
          val = emp.NameTh;
        }
      }
    }
    return val;
  };

  const onFileSelect = (e: any) => {
    if (e.target.files[0].size <= Number(editProfileSetting?.limitFileSize)) {
      getBase64(e.target.files[0]);
    } else {
      toggleAlert({
        description: `File upload limit 20 MB (20,971,520 bytes) per file.`,
        message: `File size warning.`,
        type: "warning",
      });
      // toast.current?.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "File upload limit 20 MB (20,971,520 bytes) per file.",
      //   life: 5000,
      // });
    }
  };

  const getFormErrorMessage = (name: string) => {
    const errs: any = control._formState.errors;
    if (errs[name]) {
      if (errs[name].type === "required") {
        return <small className="p-error">{errs[name].message}</small>;
      } else {
        return (
          <small className="p-error">
            {"This " + name + " is not the correct pattern"}
          </small>
        );
      }
    }
  };

  function getBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setUploadFile(reader.result);
    };
    reader.onerror = function (error) {};
  }

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={mainDialogVisible}
        header={dialogHeader}
        breakpoints={{}}
        style={{ width: "55vw", borderRadius: "16px" }}
        baseZIndex={99999}
        modal
        className="p-fluid"
        onHide={() => {
          if (toggleMainDialog) {
            toggleMainDialog(false, "close");
          }
        }}
        draggable={false}
        blockScroll
      >
        <>
          {loading ? (
            <ProgressBar
              mode="indeterminate"
              style={{ height: "6px" }}
            ></ProgressBar>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Employee Code"}
                        textSubProps={"รหัสพนักงาน"}
                        isRequir
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="EmployeeCode"
                        control={control}
                        rules={{ required: "Employee Code is required." }}
                        render={({
                          field,
                          fieldState,
                          formState: { errors, isSubmitted },
                        }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            maxLength={editProfileSetting?.EmployeeCodeSize}
                            autoFocus
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("EmployeeCode")}
                    </Col>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Username"}
                        textSubProps={"ชื่อผู้ใช้"}
                        isRequir
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="Username"
                        control={control}
                        rules={{ required: "Username is required." }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("Username")}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Name TH"}
                        textSubProps={"ชื่อภาษาไทย"}
                        isRequir
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="NameTh"
                        control={control}
                        rules={{ required: "NameTH is required." }}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("NameTh")}
                    </Col>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Name EN"}
                        textSubProps={"ชื่อภาษาอังกฤษ"}
                        isRequir
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="NameEn"
                        control={control}
                        rules={{ required: "NameEN is required." }}
                        render={({
                          field,
                          fieldState,
                          formState: { errors, isSubmitted },
                        }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("NameEn")}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Email"}
                        textSubProps={"อีเมล"}
                        isRequir
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="Email"
                        control={control}
                        rules={{
                          required: "Email is required.",
                          pattern:
                            /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/g,
                        }}
                        render={({
                          field,
                          fieldState,
                          formState: { errors },
                        }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("Email")}
                    </Col>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Language"}
                        textSubProps={"ภาษา"}
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="Lang"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            id={field.name}
                            {...field}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            options={["TH", "EN"]}
                            placeholder="Select a Lang"
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Active Status"}
                        textSubProps={"สถานะ"}
                      />
                    </Col>
                    <Col span={8}>
                      <Controller
                        name="IsActive"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputSwitch
                            id={field.name}
                            checked={field.value}
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            onChange={(e: any) => {
                              field.onChange(e.value);
                            }}
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Position"}
                        textSubProps={"ตำแหน่ง"}
                        isRequir
                      />
                    </Col>
                    <Col span={20}>
                      <Controller
                        name="PositionId"
                        control={control}
                        rules={{ required: "Position is required." }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            // value={formSelectedPosition}
                            options={positionList}
                            optionLabel={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            filter
                            showClear
                            filterBy={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            id={field.name}
                            value={positionList.find(
                              (pos: any) => pos.PositionId === field.value
                            )}
                            onChange={(e: any) => {
                              if (e.value) {
                                field.onChange(e.value.PositionId);
                              } else {
                                field.onChange(null);
                              }
                            }}
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("PositionId")}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Department"}
                        textSubProps={"หน่วยงาน"}
                        isRequir
                      />
                    </Col>
                    <Col span={20}>
                      <Controller
                        name="DepartmentId"
                        control={control}
                        rules={{ required: "Department is required." }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            // value={formSelectedPosition}
                            options={departmentList}
                            optionLabel={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            filter
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            showClear
                            filterBy={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            id={field.name}
                            value={departmentList.find(
                              (dept: any) => dept.DepartmentId === field.value
                            )}
                            onChange={(e: any) => {
                              if (e.value) {
                                field.onChange(e.value.DepartmentId);
                              } else {
                                field.onChange(null);
                              }
                            }}
                            className={classNames({
                              "p-invalid": !control._getWatch(field.name),
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage("DepartmentId")}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Division"}
                        textSubProps={"ฝ่ายงาน"}
                      />
                    </Col>
                    <Col span={20}>
                      <Controller
                        name="DivisionId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            // value={formSelectedPosition}
                            options={divList}
                            optionLabel={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            filter
                            showClear
                            disabled={
                              canEditOnlySignature
                                ? canEditOnlySignature
                                : undefined
                            }
                            filterBy={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            id={field.name}
                            value={divList?.find(
                              (div: any) => div.DivisionId === field.value
                            )}
                            onChange={(e: any) => {
                              if (e.value) {
                                field.onChange(e.value.DivisionId);
                              } else {
                                field.onChange(null);
                              }
                            }}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Report to"}
                        textSubProps={"รายงานไปที่"}
                      />
                    </Col>
                    <Col span={20}>
                      <Controller
                        name="ReportToEmpCode"
                        control={control}
                        render={({ field, fieldState }) => (
                          <div className="p-inputgroup">
                            <InputText
                              id={field.name}
                              value={getReportTo(field.value)}
                              className={classNames({
                                "p-invalid": fieldState.invalid,
                              })}
                              disabled={
                                canEditOnlySignature
                                  ? canEditOnlySignature
                                  : undefined
                              }
                              style={{
                                borderRadius: "6px 0 0 6px",
                                height: "38px",
                              }}
                              readOnly
                            />
                            {control._getWatch(field.name) && (
                              <Button
                                type="button"
                                icon="pi pi-times"
                                className="p-button-danger p-button-danger-hover"
                                onClick={() => {
                                  setValue("ReportToEmpCode", "");
                                }}
                                disabled={
                                  canEditOnlySignature
                                    ? canEditOnlySignature
                                    : undefined
                                }
                                style={{
                                  height: "38px",
                                }}
                              />
                            )}
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
                              disabled={
                                canEditOnlySignature
                                  ? canEditOnlySignature
                                  : undefined
                              }
                              type={"button"}
                              onClick={() => {
                                setSubDialogVisible(true);
                              }}
                            />
                          </div>
                        )}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}>
                      <TextHeaderComponents
                        textHeaderProps={"Signature"}
                        textSubProps={"ลายเซ็น"}
                      />
                    </Col>
                    <Col span={20}>
                      <Controller
                        name="SignPicPath"
                        control={control}
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
                                setValue("SignPicPath", "");
                              }}
                              style={{
                                height: "38px",
                                borderRadius: "0 6px 6px 0",
                              }}
                            />
                          </div>
                        )}
                      />
                      {uploadFile && uploadFile !== "" ? (
                        <div className="image-box">
                          <img className="table-img" src={uploadFile} />
                        </div>
                      ) : (
                        <div className="image-box">
                          <img
                            className="table-img"
                            src={control._getWatch("SignPicPath")}
                          />
                        </div>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={4}></Col>
                    <Col span={20}>
                      <p
                        className="content-text-detail"
                        style={{ overflowWrap: "break-word" }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: editProfileSetting?.limitFileInfo,
                          }}
                        />
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="footer-dialog">
                <button
                  onClick={() => {
                    confirmDialog({
                      message: "If you accept, your record will be delete.",
                      header: "Cancel Confirmation",
                      icon: "p-confirm-dialog-icon pi pi-info-circle",
                      acceptClassName:
                        "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
                      accept: () => {
                        reset();
                        toggleMainDialog(false, "close");
                      },
                    });
                  }}
                  type={"button"}
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
          )}
        </>
      </Dialog>
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={dataEmployeeList}
        onSelectFunc={(e: any) => {
          setValue("ReportToEmpCode", e.data.EmployeeId.toString());
          setSubDialogVisible(false);
        }}
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
        dialogVisible={subDialogVisible}
        setDialogVisible={setSubDialogVisible}
      />
    </div>
  );
};

export default EmployeeDialogFix;
