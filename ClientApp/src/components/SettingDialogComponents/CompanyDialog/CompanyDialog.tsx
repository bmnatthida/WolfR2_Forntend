import { isEmptyObject } from "jquery";
import moment from "moment";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { useUserContext } from "../../../Context/UserContext";
import useAlert from "../../../hooks/useAlert";
import { AddCompany } from "../../../Services/CompanyService";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";

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
}

export const CompanyDialog = (props: Props) => {
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
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadFile, setUploadFile] = useState<any>();
  const [userData, setUserData] = useUserContext();
  const [action, setAction] = useState<string>("");
  const toast = useRef<any>(null);

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
        formData.CompanyCode = data.CompanyCode;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.Tel = data.Tel;
        formData.Fax = data.Fax;
        formData.UrlWeb = data.UrlWeb === undefined ? "" : data.UrlWeb;
        formData.AddressTh = data.AddressTh === undefined ? "" : data.AddressTh;
        formData.AddressEn = data.AddressEn === undefined ? "" : data.AddressEn;
        formData.IsActive = data.IsActive;
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
        formData.CompanyCode = data.CompanyCode;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.Tel = data.Tel;
        formData.Fax = data.Fax;
        formData.UrlWeb = data.UrlWeb === undefined ? "" : data.UrlWeb;
        formData.AddressTh = data.AddressTh === undefined ? "" : data.AddressTh;
        formData.AddressEn = data.AddressEn === undefined ? "" : data.AddressEn;
        formData.IsActive = data.IsActive;
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
      if (uploadFile !== undefined) {
        formData.UrlLogo = uploadFile;
      }

      let res: any = await updateDynamic("MasterCompany", formData);

      if (res.result === "success") {
        props.toggleMainDialog(false, "save");
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
      } else {
        toggleAlert({
          description: `Please Select File.`,
          message: `File select warning.`,
          type: "warning",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: res.error,
        //   life: 3000,
        // });
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
      }
    } catch (error) {
      toggleAlert({
        description: `Please insert comment.`,
        message: `${error}`,
        type: "warning",
      });
      // toast.current.show({
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

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
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
                    textHeaderProps={"Company Code"}
                    textSubProps={"รหัสบริษัท"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="CompanyCode"
                    control={control}
                    defaultValue={props.formData.CompanyCode}
                    rules={{ required: "CompanyCode is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        autoFocus
                        maxLength={10}
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage("CompanyCode")}
                </Col>
              </Row>
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
                    rules={{ required: "Name TH is required." }}
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
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="NameEn"
                    control={control}
                    defaultValue={props.formData.NameEn}
                    rules={{ required: "Name EN is required." }}
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
                    textHeaderProps={"Tel"}
                    textSubProps={"โทรศัพท์"}
                    isRequir
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="Tel"
                    control={control}
                    defaultValue={props.formData.Tel}
                    rules={{ required: "Tel is required." }}
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
                  {getFormErrorMessage("Tel")}
                </Col>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Fax"}
                    textSubProps={"โทรสาร"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="Fax"
                    control={control}
                    defaultValue={props.formData.Fax}
                    rules={{ required: "Fax is required." }}
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
                  {getFormErrorMessage("Fax")}
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Address TH"}
                    textSubProps={"ที่อยู่ภาษาไทย"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="AddressTh"
                    control={control}
                    defaultValue={props.formData.AddressTh}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        {...field}
                        rows={5}
                        cols={20}
                      />
                    )}
                  />
                </Col>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Address EN"}
                    textSubProps={"ที่อยู่ภาษาอังกฤษ"}
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Controller
                    name="AddressEn"
                    control={control}
                    defaultValue={props.formData.AddressEn}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        {...field}
                        rows={5}
                        cols={20}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"WebUrl"}
                    textSubProps={"ลิงค์ Url"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <Controller
                    name="UrlWeb"
                    control={control}
                    defaultValue={props.formData.UrlWeb}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} {...field} />
                    )}
                  ></Controller>
                </Col>{" "}
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Logo"}
                    textSubProps={"โลโก้"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
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
                              setUploadFile(undefined);
                            }}
                            style={{
                              height: "38px",
                              borderRadius: "0 6px 6px 0",
                            }}
                          />
                        </div>
                      )}
                    ></Controller>
                    {uploadFile !== undefined && uploadFile !== "" ? (
                      <div className="image-box">
                        <img
                          className="table-img"
                          src={uploadFile}
                          width="500"
                          height="250"
                        />
                      </div>
                    ) : (
                      <div className="image-box">
                        {props.formData.UrlLogo !== "" && (
                          <img
                            className="table-img"
                            src={props.formData.UrlLogo}
                            width="500"
                            height="300"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </Col>{" "}
              </Row>
              <Row>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Active Status"}
                    textSubProps={"สถานะ"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
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
