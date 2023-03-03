import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { confirmDialog } from "primereact/confirmdialog";
import "../Dialog.css";

import { FiSave } from "react-icons/fi";
import { Col, Row } from "react-bootstrap";
import { isEmptyObject } from "jquery";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import moment from "moment";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
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

export const PositionDialog = (props: Props) => {
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
  const [positionLevelList, setPositionLevelList] = useState<any>([]);
  const [formSelectedPosition, setFormSelectedPosition] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [action, setAction] = useState<string>("");
  const [dataEmployeeList, setDataEmployeeList] = useState<any[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [subDialogVisible, setSubDialogVisible] = useState<boolean>(false);
  const [subDialogVisible2, setSubDialogVisible2] = useState<boolean>(false);

  const toast = useRef<any>();

  useEffect(() => {
    fecthPositionLevel();
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

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  async function fecthPositionLevel() {
    const data = await GetAllDynamic("PositionLevel/GetAll", undefined);
    if (data) {
      data.map((e: any) => {
        if (e.PositionLevelId === props.formData?.PositionLevelId) {
          if (control._fields.PositionLevel !== undefined) {
            control._fields.PositionLevel._f.value = e;
            control._formValues.PositionLevel = e;
          }
          setFormSelectedPosition({ ...e });
        }
      });
      setPositionLevelList([...data]);
    }
  }

  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};
      if (action === "add") {
        formData.PositionId = 0;
        formData.PositionLevelId = formSelectedPosition.PositionLevelId;
        formData.PosotionLevel = formSelectedPosition.PositionLevel;
        // formData.PosotionLevel = data.PositionLevel.PositionLevel;
        formData.PositionLevelNameEn = formSelectedPosition.NameEn;
        formData.PositionLevelNameTh = formSelectedPosition.NameTh;
        formData.NameEn = data.NameEn;
        formData.NameTh = data.NameTh;
        formData.IsActive = data.IsActive;
        formData.AccountId = userData.employeeData.EmployeeId.toString();
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

        formData.PositionLevelId = formSelectedPosition.PositionLevelId;
        formData.PosotionLevel = formSelectedPosition.PositionLevel;
        // formData.PosotionLevel = data.PositionLevel.PositionLevel;
        formData.PositionLevelNameEn = formSelectedPosition.NameEn;
        formData.PositionLevelNameTh = formSelectedPosition.NameTh;
        formData.NameEn = data.NameEn;
        formData.NameTh = data.NameTh;
        formData.IsActive = data.IsActive;
        formData.AccountId = userData.employeeData.EmployeeId.toString();
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

      let res = await updateDynamic("Position", formData);
      if (res.result === "success") {
        props.toggleMainDialog(false, "save");
      } else {
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
        toggleAlert({
          description: `${res.error}`,
          message: `Error`,
          type: "error",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: res.error,
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

  const updateChanges = (data: any) => {
    if (
      !subDialogVisible &&
      !subDialogVisible2 &&
      props.mainDialogVisible &&
      !isEmptyObject(formSelectedPosition)
    ) {
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

  return (
    <div>
      <Toast ref={toast}></Toast>
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
                    rules={{ required: "Name TH is required." }}
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
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"PositionLevel"}
                    textSubProps={"ระดับตำแหน่ง"}
                    isRequir
                  />
                </Col>
                <Col xs={4} sm={4} xl={4}>
                  <Dropdown
                    id={"PositionLevel"}
                    value={formSelectedPosition}
                    options={positionLevelList}
                    onChange={(e: any) => {
                      setFormSelectedPosition(e.value);
                    }}
                    optionLabel={
                      userData.employeeData.Lang === "EN" ? "NameEn" : "NameTh"
                    }
                    placeholder="Select a PositionLevel"
                    className={classNames({
                      "p-invalid": isEmptyObject(formSelectedPosition),
                    })}
                    filter
                    showClear
                    filterBy={
                      userData.employeeData.Lang === "EN" ? "NameEn" : "NameTh"
                    }
                  />
                  {isEmptyObject(formSelectedPosition) && (
                    <small className="p-error">PositionLevel is require</small>
                  )}
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
