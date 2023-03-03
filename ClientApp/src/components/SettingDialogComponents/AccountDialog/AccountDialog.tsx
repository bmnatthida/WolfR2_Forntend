import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Col, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { FiSave } from "react-icons/fi";
import { InputSwitch } from "primereact/inputswitch";
import {
  CreateWOLFAccount,
  UpdateWOLFAccount,
} from "../../../Services/AcountService";
import { isEmptyObject } from "jquery";
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

export const AccountDialog = (props: Props) => {
  const {
    control,
    formState: { errors },
    setError,
    getValues,
    handleSubmit,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: props.formData,
  });
  const [action, setAction] = useState<string>("");
  const { toggleAlert } = useAlert();

  useEffect(() => {
    if (!isEmptyObject(props.formData)) {
      setAction("edit");
    } else {
      setAction("add");
    }
  }, []);

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const onsubmit = async (data: any) => {
    let result;
    let isError = true;
    const _baseUrl = window.location.hostname;

    data.Remark =
      process.env.NODE_ENV === "development"
        ? "devr2.wolfapprove.com"
        : _baseUrl;
    if (
      data.NewPassword &&
      data.NewPassword !== "" &&
      data.ConfirmNewPassword &&
      data.ConfirmNewPassword !== ""
    ) {
      data.IsVerify =
        data.IsVerify === undefined || data.IsVerify === "true" ? true : false;
      data.IsActive =
        data.IsActive === undefined || data.IsActive === "true" ? true : false;
      data.Password = props.formData.Password;
    } else if (data.NewPassword && data.NewPassword !== "") {
      setError("ConfirmNewPassword", {
        type: "custom",
        message: "Confirm Password is required.",
      });
      isError = false;
    } else {
      const _baseUrl = window.location.hostname;
      data.IsVerify =
        data.IsVerify === undefined || data.IsVerify === "true" ? true : false;
      data.IsActive =
        data.IsActive === undefined || data.IsActive === "true" ? true : false;
      data.NewPassword = null;
      data.ConfirmNewPassword = null;

      data.Password = props.formData.Password;
    }
    console.log("table=>data", data);
    if (isError) {
      if (action === "add") {
        result = await CreateWOLFAccount(data);
      } else {
        result = await UpdateWOLFAccount(data);
      }
      if (result.Remark === "") {
        props.toggleMainDialog(false, "save");
      } else {
        toggleAlert({
          description: result.Remark,
          message: `Warning.`,
          type: "warning",
        });
      }
    }
  };

  return (
    <>
      <Dialog
        visible={props.mainDialogVisible}
        breakpoints={{}}
        style={{ width: "70vw", borderRadius: "16px" }}
        header={props.dialogHeader}
        modal
        className="p-fluid"
        onHide={() => {
          props.toggleMainDialog(false, "close");
        }}
        closable={false}
        draggable={false}
        blockScroll
      >
        <form onSubmit={handleSubmit(onsubmit)} className="p-fluid">
          <Row style={{ paddingBottom: "10px" }}>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"ID"}
                textSubProps={"รหัส"}
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="ID"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
                    readOnly
                    className={classNames({
                      "p-invalid": fieldState.invalid,
                    })}
                  />
                )}
              />
            </Col>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Username"}
                textSubProps={"ชื่อผู้ใช้"}
                isRequir
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="Username"
                control={control}
                rules={{ required: "Username is required." }}
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
              {getFormErrorMessage("Username")}
            </Col>
          </Row>
          <Row style={{ paddingBottom: "10px" }}>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"New Password"}
                textSubProps={"รหัสผ่านใหม่"}
                isRequir={action === "add"}
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="NewPassword"
                control={control}
                rules={{
                  required: action === "add",
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    type="password"
                    {...field}
                    onSelect={(e: any) => {
                      field.onChange(e.target.value);
                    }}
                    className={classNames({
                      "p-invalid": fieldState.invalid,
                    })}
                  />
                )}
              />
            </Col>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Confirm Password"}
                textSubProps={"ยืนยันรหัสผ่านใหม่"}
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="ConfirmNewPassword"
                control={control}
                rules={{
                  required:
                    getValues("NewPassword") && getValues("NewPassword") !== ""
                      ? "Confirm Password is required."
                      : false,
                  onBlur(event) {
                    if (getValues("NewPassword") !== event.target.value) {
                      return false;
                    }
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    type="password"
                    {...field}
                    className={classNames({
                      "p-invalid": fieldState.invalid,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("ConfirmNewPassword")}
            </Col>
          </Row>
          <Row style={{ paddingBottom: "10px" }}>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Is Verify"}
                textSubProps={"ได้รับการยืนยัน"}
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="IsVerify"
                control={control}
                render={({ field, fieldState }) => (
                  <InputSwitch
                    inputId={field.name}
                    checked={
                      field.value === undefined || field.value === "true"
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value.toString());
                    }}
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
                control={control}
                render={({ field, fieldState }) => (
                  <InputSwitch
                    inputId={field.name}
                    checked={
                      field.value === undefined ||
                      field.value ||
                      field.value === "true"
                        ? true
                        : false
                    }
                    onChange={(e) => field.onChange(e.target.value)}
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
                textHeaderProps={"Created Date"}
                textSubProps={"วันที่สร้าง"}
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="CreatedDate"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
                    className={classNames({
                      "p-invalid": fieldState.invalid,
                    })}
                  />
                )}
              />
            </Col>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Modified Date"}
                textSubProps={"วันที่แก้ไข"}
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <Controller
                name="ModifiedDate"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    {...field}
                    disabled
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
    </>
  );
};
