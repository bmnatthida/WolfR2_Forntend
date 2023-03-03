import { isEmptyObject } from "jquery";
import moment from "moment";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import useAlert from "../../../hooks/useAlert";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";

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

export const DivisionDialog = (props: Props) => {
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
  const [messageConfirmDialog, setMessageConfirmDialog] = useState<string>("");
  const [formSelectedRole, setFormSelectedRole] = useState<any>([]);
  const [rolesList, setRolesList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [action, setAction] = useState<string>("");
  const toast = useRef<any>(null);

  useEffect(() => {
    fecthRoles();
    if (!isEmptyObject(props.formData)) {
      setAction("edit");
    } else {
      setAction("add");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setMessageConfirmDialog("Do you want to " + action + " this record?");
  }, [action]);

  async function fecthRoles() {
    try {
      let roles: any[] = await GetAllDynamic("Roles/GetAll", undefined);
      if (props.formData.RolesId !== undefined) {
        roles?.map((e: any) => {
          if (e.RolesId === props.formData.RolesId) {
            setFormSelectedRole(e);
          }
        });
      }

      setRolesList([...roles]);
    } catch (error) {}
  }

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const updateChanges = (data: any) => {
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
  };

  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};
      if (action === "add") {
        formData.DivisionId = 0;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.IsActive = data.IsActive;
        formData.DivisionCode = "";
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
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
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
      let res = await updateDynamic("Division", formData);

      if (res.result === "success") {
        props.toggleMainDialog(false, "save");
      } else {
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
        toggleAlert({
          description: `${res.errorMessage}`,
          message: `Error`,
          type: "error",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: res.errorMessage,
        //   life: 3000,
        // });
      }
    } catch (error) {
      if (props.setMainLoading !== undefined) {
        props.setMainLoading(false);
      }
      toggleAlert({
        description: `${error}`,
        message: `Error`,
        type: "error",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: error,
      //   life: 3000,
      // });
    }
  };

  return (
    <div>
      <Toast ref={toast}></Toast>
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
            props.toggleMainDialog(false, "close");
          }}
          draggable={false}
          blockScroll
        >
          <form onSubmit={handleSubmit(updateChanges)} className="p-fluid">
            <div>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Name TH"}
                    textSubProps={"ชื่อภาษาไทย"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="NameTh"
                    control={control}
                    defaultValue={props.formData.NameTh}
                    rules={{ required: "Division Name TH is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={"NameTh"}
                        {...field}
                        autoFocus
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
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="NameEn"
                    control={control}
                    defaultValue={props.formData.NameEn}
                    rules={{ required: "Division Name EN is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={"NameEn"}
                        {...field}
                        autoFocus
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
                </Col>{" "}
              </Row>
            </div>
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
