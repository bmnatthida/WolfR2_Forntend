import { isEmptyObject } from "jquery";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { Toast } from "primereact/toast";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { isArray } from "util";
import { MultiSelect } from "primereact/multiselect";
import useAlert from "../../../hooks/useAlert";
import { InputNumber } from "primereact/inputnumber";

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
export const MenuDialog = (props: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    // shouldUnregister: false,
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
    console.log("My", parseInt(props.formData.OrderGroup));
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
      if (props.formData.RolesId) {
        let allRoles: string[] = props.formData.RolesId.split(",");
        const defaultVal = roles?.filter((e: any) => {
          if (allRoles.includes(e.RoleId.toString())) {
            return e;
          }
        });
        console.log("role=>defaultVal", defaultVal);

        setFormSelectedRole([...defaultVal]);

        console.log("table=>props.formData.RolesId", props.formData.RolesId);
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
    console.log(data, "data");
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
      console.log("role=>", formSelectedRole);
      let _rolesId: number[] = [];
      if (formSelectedRole) {
        formSelectedRole.forEach((role: any) => {
          _rolesId.push(role.RoleId);
        });
      }
      if (action === "add") {
        formData.AuMenuId = 0;
        formData.GroupMenu = data.GroupMenu;
        formData.SubMenu = data.SubMenu;
        formData.InternalUrl = data.InternalUrl === true ? 1 : 0;
        formData.IsActive = data.IsActive;
        formData.OrderGroup = data.OrderGroup;
        formData.OrderSub = data.OrderSub;
        formData.Url = data.Url;
        formData.RolesId = _rolesId.join(",");
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
        formData.GroupMenu = data.GroupMenu;
        formData.SubMenu = data.SubMenu;
        formData.InternalUrl = data.InternalUrl === true ? 1 : 0;
        formData.IsActive = data.IsActive;
        formData.OrderGroup = data.OrderGroup;
        formData.OrderSub = data.OrderSub;
        formData.Url = data.Url;
        formData.RolesId = _rolesId.join(",");
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

      let res = await updateDynamic("AuthorizedMenu", formData);

      if (res.result === "success") {
        props.toggleMainDialog(false, "save");
      } else {
        toggleAlert({
          description: `${res.errorMessage}`,
          message: `Error`,
          type: "error",
        });
        // toast.current?.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: res.errorMessage,
        //   life: 3000,
        // });
      }
    } catch (error) {
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
      if (props.setMainLoading !== undefined) {
        props.setMainLoading(false);
      }
    }
  };

  return (
    <div>
      <Toast ref={toast}></Toast>
      {!loading && (
        <Dialog
          visible={props.mainDialogVisible}
          breakpoints={{}}
          style={{ width: "80vw", borderRadius: "16px" }}
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
                    textHeaderProps={"Group Menu"}
                    textSubProps={"กลุ่มเมนู"}
                    isRequir
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="GroupMenu"
                    control={control}
                    defaultValue={props.formData.GroupMenu}
                    rules={{ required: "Group Menu is required." }}
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
                  {getFormErrorMessage("GroupMenu")}
                </Col>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Sub Menu"}
                    textSubProps={"เมนูย่อย"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="SubMenu"
                    control={control}
                    defaultValue={props.formData.SubMenu}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} {...field} />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Order Group"}
                    textSubProps={"ลำดับกลุ่ม"}
                    isRequir
                  />
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  xl={4}
                  onClick={() => {
                    console.log(
                      "defaultValue",
                      typeof props.formData.OrderGroup
                    );
                  }}
                >
                  <Controller
                    name="OrderGroup"
                    control={control}
                    defaultValue={props.formData.OrderGroup}
                    rules={{ required: "OrderGroup is required." }}
                    render={({ field, fieldState }) => (
                      <InputNumber
                        // onChange={(e) => {
                        //   console.log(e.currentTarget);
                        // }}
                        // type="number"
                        inputId="integeronly"
                        id={field.name}
                        {...field}
                        // min={0}
                        onChange={(e) => {
                          if (e.value === null) {
                            field.onChange(0);
                          } else {
                            field.onChange(e.value);
                          }
                        }}
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                        // <InputNumber inputId="integeronly" value={value1} onValueChange={(e) => setValue1(e.value)} />
                      />
                    )}
                  />
                  {getFormErrorMessage("OrderGroup")}
                </Col>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Order Sub"}
                    textSubProps={"ลำดับเมนูย่อย"}
                    isRequir
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="OrderSub"
                    control={control}
                    defaultValue={props.formData.OrderSub}
                    render={({ field, fieldState }) => (
                      <InputNumber
                        id={field.name}
                        {...field}
                        min={0}
                        onChange={(e) => {
                          if (e.value === null) {
                            field.onChange(0);
                          } else {
                            field.onChange(e.value);
                          }
                        }}
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Internal Url"}
                    textSubProps={"Url ภายใน"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="InternalUrl"
                    defaultValue={
                      props.formData.InternalUrl === 1 ? true : false
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

              <Row style={{ paddingBottom: "10px" }}>
                {" "}
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Url"}
                    textSubProps={"ลิงค์ Url"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Url"
                    control={control}
                    defaultValue={props.formData.Url}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} {...field} />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Role (s)"}
                    textSubProps={"กลุ่มคนที่ต้องการให้สิทธิ์"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Role"
                    control={control}
                    defaultValue={formSelectedRole}
                    render={({ field, fieldState }) => (
                      <MultiSelect
                        value={formSelectedRole}
                        options={rolesList}
                        optionLabel={
                          userData.employeeData.Lang === "EN"
                            ? "NameEn"
                            : "NameTh"
                        }
                        placeholder="Select a Role"
                        filter
                        filterBy={
                          userData.employeeData.Lang === "EN"
                            ? "NameEn"
                            : "NameTh"
                        }
                        onChange={(e: any) => setFormSelectedRole(e.value)}
                        showClear={!isEmptyObject(formSelectedRole)}
                      />
                    )}
                  />
                  {/* {getFormErrorMessage("PositionId")} */}
                </Col>
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
