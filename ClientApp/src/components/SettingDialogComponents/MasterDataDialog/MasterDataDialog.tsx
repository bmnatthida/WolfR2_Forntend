import { Button } from "primereact/button";
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
import { FiSave } from "react-icons/fi";
import { Col, Row } from "react-bootstrap";
import { isEmptyObject } from "jquery";
import { Toast } from "primereact/toast";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { RadioButton } from "primereact/radiobutton";
import { AiOutlinePlus } from "react-icons/ai";
import { Dropdown } from "primereact/dropdown";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import moment from "moment";
import {
  UpdateApprovalMatrix,
  UpdateApprovalMatrixItems,
} from "../../../Services/ApprovalMatrixService";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { useUserContext } from "../../../Context/UserContext";
interface Props {
  dialogHeader: string;
  formData: any;
  tableData?: any;
  setTableData: (items: any) => void;
  tableComfirmDialog?: boolean;
  setTableComfirmDialog?: (bool: boolean) => void;
  mainDialogVisible?: boolean;
  toggleMainDialog: (state: boolean, action: string) => void;
  setMainLoading?: (bool: boolean) => void;
  toast: any;
}

export const MasterDataDialog = (props: Props) => {
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
  const [messageConfirmDialog, setMessageConfirmDialog] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useUserContext();
  const [action, setAction] = useState<string>("");

  useEffect(() => {
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

  const updateChanges = (data: any) => {
    if (props.mainDialogVisible) {
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
  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};
      if (action === "add") {
        formData.MasterId = -1;
        formData.Value1 = data.Value1;
        formData.Value2 = data.Value2;
        formData.Value3 = data.Value3;
        formData.Value4 = data.Value4;
        formData.Value5 = data.Value5;
        formData.MasterType = data.MasterType;
        formData.IsActive = data.IsActive;
        formData.Seq = data.Seq;
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
        formData = props.formData;
        formData.Value1 = data.Value1;
        formData.Value2 = data.Value2;
        formData.Value3 = data.Value3;
        formData.Value4 = data.Value4;
        formData.Value5 = data.Value5;
        formData.MasterType = data.MasterType;
        formData.IsActive = data.IsActive;
        formData.Seq = data.Seq;
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
      let res = await updateDynamic("MasterData", formData);

      if (res.result === "success") {
        props.toggleMainDialog(false, "save");
      } else {
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
        props.toast?.current.show({
          severity: "error",
          summary: "Error Message",
          detail: res.errorMessage,
          life: 3000,
        });
      }
    } catch (error) {
      props.toast?.current.show({
        severity: "error",
        summary: "Error Message",
        detail: error,
        life: 3000,
      });
    }
  };
  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  return (
    <div>
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
            <div>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Master Type"}
                    textSubProps={"ประเภท"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="MasterType"
                    control={control}
                    defaultValue={props.formData.MasterType}
                    rules={{ required: "Master Type is required." }}
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
                  {getFormErrorMessage("MasterType")}
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
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Value1"}
                    textSubProps={"ค่าที่1"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Value1"
                    control={control}
                    defaultValue={props.formData.Value1}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        rows={3}
                        cols={30}
                        id={field.name}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Value2"}
                    textSubProps={"ค่าที่2"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Value2"
                    control={control}
                    defaultValue={props.formData.Value2}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        rows={3}
                        cols={30}
                        id={field.name}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Value3"}
                    textSubProps={"ค่าที่3"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Value3"
                    control={control}
                    defaultValue={props.formData.Value3}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        rows={3}
                        cols={30}
                        id={field.name}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Value4"}
                    textSubProps={"ค่าที่4"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Value4"
                    control={control}
                    defaultValue={props.formData.Value4}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        rows={3}
                        cols={30}
                        id={field.name}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Value5"}
                    textSubProps={"ค่าที่5"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Value5"
                    control={control}
                    defaultValue={props.formData.Value5}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        rows={3}
                        cols={30}
                        id={field.name}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Sequence"}
                    textSubProps={"ลำดับ"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="Seq"
                    control={control}
                    defaultValue={props.formData.Seq}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} {...field} />
                    )}
                  />
                </Col>
              </Row>
            </div>
            <div className="footer-dialog">
              <button
                onClick={() => {
                  reset();
                  props.toggleMainDialog(false, "close");
                }}
                type="button"
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
