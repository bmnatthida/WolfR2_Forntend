import { Button } from "primereact/button";
import "./DepartmentDialog.css";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { confirmDialog } from "primereact/confirmdialog";
import "../Dialog.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { GetAllEmployee } from "../../../Services/EmployeeService";
import { GetAllPosition } from "../../../Services/PositionService";
import {
  GetDepartment,
  UpdateDepartment,
} from "../../../Services/DepartmentService";
import { FiSave } from "react-icons/fi";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { isEmptyObject } from "jquery";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { Toast } from "primereact/toast";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { Dropdown } from "primereact/dropdown";
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

export const DepartmentDialog = (props: Props) => {
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const { toggleAlert } = useAlert();
  const [messageConfirmDialog, setMessageConfirmDialog] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [subDialogVisible, setSubDialogVisible] = useState<boolean>(false);
  const [subDialogVisible2, setSubDialogVisible2] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [masterCompany, setMasterCompany] = useState<any>();
  const [comCode, setSelectComCode] = useState<any>();
  const toast = useRef<any>(null);

  useEffect(() => {
    if (!isEmptyObject(props.formData)) {
      setAction("edit");

      setLoading(false);
    } else {
      setAction("add");
    }
  }, []);

  useEffect(() => {
    setMessageConfirmDialog("Do you want to " + action + " this record?");
  }, [action]);

  useEffect(() => {
    if (props.mainDialogVisible) {
      fecthCompany();
      setLoading(false);
    }
  }, [props.mainDialogVisible]);

  const fecthCompany = async () => {
    if (!masterCompany) {
      const company = await GetAllDynamic("MasterCompany/GetAll", undefined);
      if (company) {
        setSelectComCode(
          company?.find((e: any) => {
            if (e.CompanyCode === props.formData.CompanyCode) {
              return e;
            }
          })
        );
        control._formValues["CompanyCode"] = company.find(
          (e: any) => e.CompanyCode === props.formData.CompanyCode
        );
        setValue("CompanyCode", control._formValues["CompanyCode"]);
        setMasterCompany([...company]);
      }
    }
  };

  const updateChanges = (data: any) => {
    if (!subDialogVisible && !subDialogVisible2 && props.mainDialogVisible) {
      confirmDialog({
        message: messageConfirmDialog,
        header:
          action === "add" ? "Add" + " Confirmation" : "Edit" + " Confirmation",
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
  };

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};
      console.log("table=>data", data);

      if (action === "add") {
        formData.DepartmentId = 0;
        formData.DepartmentCode = data.DepartmentCode;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.CompanyCode = data?.CompanyCode?.CompanyCode;
        formData.IsActive = data.IsActive;
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
        formData.DepartmentCode = data.DepartmentCode;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.CompanyCode = data?.CompanyCode?.CompanyCode;
        formData.IsActive = data.IsActive;
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
      let result = await UpdateDepartment(formData);
      console.log("table=>formData", formData);

      if (result === "success") {
        props.toggleMainDialog(false, "save");
      } else {
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
        toggleAlert({
          description: `${result.errorMessage}`,
          message: `Error`,
          type: "error",
        });
        // toast.current?.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: result.errorMessage,
        //   life: 3000,
        // });
      }
    } catch (error) {
      if (props.setMainLoading !== undefined) {
        props.setMainLoading(false);
      }
      console.log("table=>error", error);
      toggleAlert({
        description: `${error}`,
        message: `Error`,
        type: "error",
      });
      // toast.current?.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: error,
      //   life: 3000,
      // });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      {!loading && (
        <Dialog
          visible={props.mainDialogVisible}
          breakpoints={{}}
          style={{ width: "70vw", borderRadius: "16px" }}
          header={props.dialogHeader}
          modal
          className="p-fluid"
          onHide={() => {
            reset();
            props.toggleMainDialog(false, "close");
          }}
          draggable={false}
          closable={false}
          blockScroll
        >
          <form onSubmit={handleSubmit(updateChanges)} className="p-fluid">
            <Row style={{ paddingBottom: "10px" }}>
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Department Code"}
                  textSubProps={"รหัสแผนก"}
                  isRequir
                />
              </Col>
              <Col xs={4} sm={4} xl={4}>
                <Controller
                  name="DepartmentCode"
                  control={control}
                  defaultValue={props.formData.DepartmentCode}
                  rules={{ required: "Department Code is required." }}
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
                {getFormErrorMessage("DepartmentCode")}
              </Col>
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Company Code"}
                  textSubProps={"รหัสบริษัท"}
                />
              </Col>
              <Col xs={4} sm={4} xl={4}>
                <Controller
                  name="CompanyCode"
                  control={control}
                  // defaultValue={masterCompany?.find(
                  //   (e: any) => e.CompanyCode === props.formData.CompanyCode
                  // )}
                  render={({ field }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      // value={comCode}
                      options={masterCompany}
                      optionLabel={"CompanyCode"}
                      filter
                      showClear
                      filterBy={"CompanyCode"}
                      placeholder="Select a Company Code"
                      // onChange={(e: any) => setSelectComCode(e.value)}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row style={{ paddingBottom: "10px" }}>
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Name TH"}
                  textSubProps={"ชื่อภาษาไทย"}
                  isRequir
                />
              </Col>
              <Col xs={4} sm={4} xl={4}>
                <Controller
                  name="NameTh"
                  control={control}
                  defaultValue={props.formData.NameTh}
                  rules={{ required: "NameTh is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("NameTh")}
              </Col>
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Name EN"}
                  textSubProps={"ชื่อภาษาอังกฤษ"}
                  isRequir
                />
              </Col>
              <Col xs={4} sm={4} xl={4}>
                <Controller
                  name="NameEn"
                  control={control}
                  defaultValue={props.formData.NameEn}
                  rules={{ required: "NameEn is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("NameEn")}
              </Col>
            </Row>
            <Row style={{ paddingBottom: "10px" }}>
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Active Status"}
                  textSubProps={"สถานะ"}
                />
              </Col>
              <Col xs={4} sm={4} xl={4}>
                <Controller
                  name="IsActive"
                  defaultValue={
                    props.formData.IsActive === undefined ||
                    props.formData.IsActive === "true"
                      ? true
                      : false
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
              </Col>
            </Row>

            <div className="footer-dialog">
              <button
                onClick={() => {
                  reset();
                  props.toggleMainDialog(false, "close");
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
    </div>
  );
};
