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
import { GetAllDynamic } from "../../../Services/DynamicService";
import { InputNumber } from "primereact/inputnumber";
import binIcon from "../../../assets/bin-icon.png";
import editIcon from "../../../assets/edit-icon.png";
import { UpdateApprovalMatrix } from "../../../Services/ApprovalMatrixService";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";
import { useUserContext } from "../../../Context/UserContext";
import { sorterFunc } from "../../../Helper/SortingFunction";
interface Props {
  dialogHeader: string;
  formData: any;
  tableData?: any;
  setTableData?: (items: any) => void;
  tableComfirmDialog?: boolean;
  matrixItems: any;
  setMatrixItems: (items: any) => void;
  setTableComfirmDialog?: (bool: boolean) => void;
  mainDialogVisible?: boolean;
  toggleMainDialog: (state: boolean, action: string) => void;
  setMainLoading?: (bool: boolean) => void;
  toast: any;
}

export const ApprovalMatrixDialog = (props: Props) => {
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
  const [itemsList, setItemsList] = useState<any>([]);
  const [itemsListShow, setItemsListShow] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useUserContext();
  const [action, setAction] = useState<string>("");
  const [dataEmployeeList, setDataEmployeeList] = useState<any[]>([]);
  const [subDialogVisible, setSubDialogVisible] = useState<boolean>(false);
  const [subDialogVisible2, setSubDialogVisible2] = useState<boolean>(false);
  const [mode, setMode] = useState<any>("เพิ่มตามคน");
  const [approver, setApprover] = useState<any>();
  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [positionLevelList, setPositionLevelList] = useState<any[]>([]);
  const [formSelectedPositionLevel, setFormSelectedPositionLevel] =
    useState<any>([]);
  const [itemAction, setItemAction] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>();

  useEffect(() => {
    fetchDataEmployee();
    fecthPositionLevel();

    if (!isEmptyObject(props.formData)) {
      setAction("edit");
    } else {
      setAction("add");
    }
  }, []);

  useEffect(() => {
    setMessageConfirmDialog("Do you want to " + action + " this record?");
  }, [action]);

  useEffect(() => {
    if (props.matrixItems !== undefined && props.matrixItems.length > 0) {
      if (dataEmployeeList) {
        let data = props.matrixItems.filter(
          (item: any) => item.ApproveMatrixId === props.formData.ApproveMatrixId
        );

        let items: any[] = [];
        data.map((e: any) => {
          if (e.IsActive) {
            if (
              e.ApproverId !== null &&
              e.ApproverId !== undefined &&
              e.ApproverId !== 0
            ) {
              const approver = dataEmployeeList.find((emp: any) => {
                return e.ApproverId === emp.EmployeeId;
              });
              if (approver) {
                let item: any = {};
                item.ApproveMatrixItemId = e.ApproveMatrixItemId;
                item.AmountFrom = e.AmountFrom;
                item.AmountTo = e.AmountTo;
                item.PositionLevelId = null;
                item.PositionLevelName = null;
                item.ApproverId = approver.EmployeeId;
                item.ApproverName =
                  approver[userData.Lang === "EN" ? "NameEn" : "NameTh"];
                item.IsActive = e.IsActive;
                item.Seq = e.Seq;
                item.IsTypePosition = true;
                items.push(item);
              } else {
                let item: any = {};
                item.ApproveMatrixItemId = e.ApproveMatrixItemId;
                item.AmountFrom = e.AmountFrom;
                item.AmountTo = e.AmountTo;
                item.PositionLevelId = null;
                item.PositionLevelName = null;
                item.ApproverId = e.EmployeeId;
                item.ApproverName = "Not Found";
                item.Seq = e.Seq;
                item.IsActive = e.IsActive;
                item.IsTypePosition = true;
                items.push(item);
              }
            } else if (e.PositionLevelId > 0) {
              const positionLv = positionLevelList.find((posi: any) => {
                return e.PositionLevelId == posi.PositionLevelId;
              });
              if (positionLv) {
                let item: any = {};
                item.ApproveMatrixItemId = e.ApproveMatrixItemId;
                item.AmountFrom = e.AmountFrom;
                item.AmountTo = e.AmountTo;
                item.PositionLevelId = positionLv.PositionLevelId;
                item.PositionLevelName =
                  positionLv[userData.Lang === "EN" ? "NameEn" : "NameTh"];
                item.ApproverId = null;
                item.ApproverName = null;
                item.Seq = e.Seq;
                item.IsActive = e.IsActive;
                item.IsTypePosition = true;
                items.push(item);
              } else {
                let item: any = {};
                item.ApproveMatrixItemId = e.ApproveMatrixItemId;
                item.AmountFrom = e.AmountFrom;
                item.AmountTo = e.AmountTo;
                item.PositionLevelId = -1;
                item.PositionLevelName = "Not Found";
                item.ApproverId = null;
                item.ApproverName = null;
                item.Seq = e.Seq;
                item.IsActive = e.IsActive;
                item.IsTypePosition = true;
                items.push(item);
              }
            }
          }
        });
        setItemsList([...items]);
      }
    }
  }, [dataEmployeeList, positionLevelList]);

  useEffect(() => {
    let newList = itemsList.filter((item: any) => item.IsActive === true);
    newList.sort((a: any, b: any) => (a.Seq > b.Seq ? 1 : -1));
    setItemsListShow([...newList]);
    setLoading(false);
  }, [itemsList]);

  async function fecthPositionLevel() {
    try {
      let positionLevel: any[] = await GetAllDynamic(
        "PositionLevel/GetAll",
        undefined
      );

      setPositionLevelList([...positionLevel]);
    } catch (error) {}
  }

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
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

  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};
      if (action === "add") {
        formData.ApproveMatrixId = 0;
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
        formData.ModifiedBy = userData.EmployeeId.toString();
      }

      // const _itemsList: any[] = itemsList.sort((a: any, b: any) =>
      //   sorterFunc(a, b, "Seq", "dec")
      // );
      // _itemsList.map((e: any, idx: number) => {
      //   if (e.IsActive) {
      //     e.Seq = idx + 1;
      //   } else {
      //     e.Seq = 999;
      //   }
      //   return e;
      // });

      let res: any = await UpdateApprovalMatrix(formData, itemsList);

      if (res.result === "success") {
        props.toggleMainDialog(false, "save");
      } else {
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
      }
    } catch (error) {
      console.log("matrix=>error", error);

      props.toggleMainDialog(false, "save");
      if (props.setMainLoading !== undefined) {
        props.setMainLoading(false);
      }
    }
  };

  async function fetchDataEmployee() {
    let _dataEmployee = await GetAllEmployee();
    setDataEmployeeList(_dataEmployee);
  }

  function AddItem() {
    try {
      if (amountFrom !== null && amountTo !== null) {
        if (amountTo > amountFrom) {
          let items: any[] = itemsList;
          if (mode === "เพิ่มตามคน") {
            if (approver) {
              let item: any = {};
              item.AmountFrom = amountFrom.toFixed(2);
              item.AmountTo = amountTo.toFixed(2);
              item.ApproverId = approver.EmployeeId;
              item.ApproverName =
                approver[userData.Lang === "EN" ? "NameEn" : "NameTh"];
              item.IsActive = true;
              item.IsTypePosition = true;
              if (itemAction === "add") {
                item.Seq = itemsListShow?.length + 1;
                items.push(item);
              } else {
                let replaceIndex = -1;
                items.forEach((e: any, idx: number) => {
                  if (e.Seq === selectedItem.Seq) {
                    if (selectedItem.ApproveMatrixItemId) {
                      item.ApproveMatrixItemId =
                        selectedItem.ApproveMatrixItemId;
                    }
                    item.Seq = selectedItem.Seq;
                    replaceIndex = idx;
                  }
                });
                if (replaceIndex !== -1) {
                  items[replaceIndex] = item;
                }
              }
              resetSubDialog();
              setSubDialogVisible(false);
            } else {
              confirmDialog({
                message: "Please select a approver.",
                header: "Alert",
                icon: "p-confirm-dialog-icon pi pi-info-circle",
                rejectClassName: "hide",
                acceptClassName:
                  "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
                accept: () => {},
              });
            }
          } else {
            if (
              formSelectedPositionLevel !== undefined &&
              formSelectedPositionLevel.length !== 0
            ) {
              let item: any = {};
              item.AmountFrom = amountFrom.toFixed(2);
              item.AmountTo = amountTo.toFixed(2);
              item.PositionLevelId = formSelectedPositionLevel.PositionLevelId;
              item.PositionLevelName =
                formSelectedPositionLevel[
                  userData.Lang === "EN" ? "NameEn" : "NameTh"
                ];
              item.IsActive = true;
              item.IsTypePosition = true;
              if (itemAction === "add") {
                item.Seq = itemsListShow?.length + 1;
                items.push(item);
              } else {
                let replaceIndex = -1;
                items.forEach((e: any, idx: number) => {
                  if (e.Seq === selectedItem.Seq) {
                    if (selectedItem.ApproveMatrixItemId) {
                      item.ApproveMatrixItemId =
                        selectedItem.ApproveMatrixItemId;
                    }
                    item.Seq = selectedItem.Seq;
                    replaceIndex = idx;
                  }
                });
                if (replaceIndex !== -1) {
                  items[replaceIndex] = item;
                }
              }
              resetSubDialog();
              setSubDialogVisible(false);
            } else {
              confirmDialog({
                message: "Please select a position.",
                header: "Alert",
                icon: "p-confirm-dialog-icon pi pi-info-circle",
                acceptClassName:
                  "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
                accept: () => {},
                rejectClassName: "hide",
              });
            }
          }
          setItemsList([...items]);
        } else {
          confirmDialog({
            message: "AmountTo must be greater than AmountFrom",
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {
              setAmountTo(0);
            },
            rejectClassName: "hide",
          });
        }
      } else {
        confirmDialog({
          message: "Please insert a amount range.",
          header: "Alert",
          icon: "p-confirm-dialog-icon pi pi-info-circle",
          acceptClassName:
            "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
          accept: () => {},
          rejectClassName: "hide",
        });
      }
    } catch (error) {
      console.log("matrix=>error", error);
    }
  }

  function resetSubDialog() {
    setAmountFrom(0);
    setAmountTo(0);
    setApprover(undefined);
    setFormSelectedPositionLevel(undefined);
  }

  const onDeleteRow = (rowData: any) => {
    let selected: any = [...itemsList];

    confirmDialog({
      message: "Do you to delete this row.",
      header: "Delete Confirmation",
      icon: "p-confirm-dialog-icon pi pi-info-circle",
      acceptClassName:
        "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
      accept: () => {
        rowData.IsActive = false;
        selected.map((e: any) => {
          if (e.seq === rowData.seq) {
            e = rowData;
          }
        });

        setItemsList([...selected]);
      },
    });
  };

  return (
    <div>
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
        closable={false}
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
              <Col xs={3} sm={3} xl={3}>
                <ButtonComponents
                  setLabelProps={"Create Approve Matrix Item"}
                  setStyleProps={{
                    height: "38px",
                    backgroundColor: "#282F6A",
                    color: "#FFFFFF",
                    border: "1px solid rgb(40, 47, 106)",
                  }}
                  onClickProps={() => {
                    setItemAction("add");
                    setSubDialogVisible(true);
                  }}
                />
              </Col>
              <Col xs={11} sm={11} xl={11}></Col>
            </Row>
            <Row style={{ paddingBottom: "10px" }}>
              <Col xs={12} sm={12} xl={12}>
                <Controller
                  name="ApproveMatrixItems"
                  control={control}
                  defaultValue={itemsListShow}
                  render={({ field, fieldState }) => (
                    <DataTable
                      id={field.name}
                      onRowReorder={(e: any) => {
                        let value = e.value;
                        for (let i = 0; i < value?.length; i++) {
                          let a = 1;
                          a = a + i;
                          value[i].Seq = a;
                        }
                        field.onChange(value);
                        setItemsListShow(value);
                      }}
                      onValueChange={(e: any) => {
                        field.onChange(e.value);
                        let data = e.value;
                        data.map((data: any, idx: number) => {
                          data.Seq = idx + 1;
                        });
                        setItemsList(data);
                      }}
                      loading={loading}
                      value={itemsListShow}
                      tableStyle={{
                        border: "1px solid #e6e6e6",
                        outlineColor: "#e6e6e6",
                      }}
                      // size="small"
                      dataKey="id"
                      responsiveLayout="scroll"
                    >
                      <Column rowReorder style={{ width: "3em" }} />
                      <Column
                        field="AmountFrom"
                        header={
                          <tr>
                            <th>
                              <TextHeaderComponents
                                textHeaderProps={"AmountFrom"}
                                textSubProps={"ค่าเริ่มต้น"}
                              />
                            </th>
                          </tr>
                        }
                        bodyClassName="numberBody"
                        body={(rowData: any) => {
                          return Number(rowData["AmountFrom"]).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          );
                        }}
                      ></Column>
                      <Column
                        field="AmountTo"
                        header={
                          <tr>
                            <th>
                              <TextHeaderComponents
                                textHeaderProps={"AmountTo"}
                                textSubProps={"ค่าสิ้นสุด"}
                              />
                            </th>
                          </tr>
                        }
                        bodyClassName="numberBody"
                        body={(rowData: any) => {
                          return Number(rowData["AmountTo"]).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          );
                        }}
                      ></Column>
                      <Column
                        field="ApproverName"
                        header={
                          <tr>
                            <th>
                              <TextHeaderComponents
                                textHeaderProps={"Approver"}
                                textSubProps={"ผู้อนุมัติ"}
                              />
                            </th>
                          </tr>
                        }
                      ></Column>
                      <Column
                        field="PositionLevelName"
                        header={
                          <tr>
                            <th>
                              <TextHeaderComponents
                                textHeaderProps={"PositionLevel"}
                                textSubProps={"ระดับตำแหน่ง"}
                              />
                            </th>
                          </tr>
                        }
                      ></Column>
                      <Column
                        bodyClassName="approveMatrix-table"
                        header={
                          <TextHeaderComponents
                            textHeaderProps={"Edit"}
                            textSubProps={"แก้ไข"}
                          />
                        }
                        body={(rowData: any, options: any) => {
                          return (
                            <button
                              className="table-button"
                              type="button"
                              onClick={() => {
                                setAmountFrom(Number(rowData.AmountFrom));
                                setAmountTo(Number(rowData.AmountTo));
                                setSelectedItem(rowData);
                                setItemAction("edit");
                                const _approver = dataEmployeeList.find(
                                  (e: any) =>
                                    e.EmployeeId === rowData?.ApproverId
                                );
                                const _pos = positionLevelList.find(
                                  (e: any) =>
                                    e.PositionLevelId ===
                                    rowData?.PositionLevelId
                                );
                                if (_approver) {
                                  setMode("เพิ่มตามคน");
                                  setApprover(_approver);
                                } else if (_pos) {
                                  setMode("ตามลำดับการอนุมัติสูงสุด");
                                  setFormSelectedPositionLevel(_pos);
                                } else {
                                  setMode("เพิ่มตามคน");
                                }
                                setAction("edit");
                                setSubDialogVisible(true);
                              }}
                            >
                              <img src={editIcon} alt="logo" />
                            </button>
                          );
                        }}
                      ></Column>
                      <Column
                        bodyClassName="approveMatrix-table"
                        header={
                          <TextHeaderComponents
                            textHeaderProps={"Delete"}
                            textSubProps={"ลบ"}
                          />
                        }
                        body={(rowData: any, options: any) => {
                          return (
                            <button
                              className="table-button"
                              type="button"
                              onClick={() => {
                                onDeleteRow(rowData);
                              }}
                            >
                              <img src={binIcon} alt="logo" />
                            </button>
                          );
                        }}
                      ></Column>
                    </DataTable>
                  )}
                />
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
      <Dialog
        visible={subDialogVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={() => {
          resetSubDialog();
          setSubDialogVisible(false);
        }}
        className="requestor-dialog"
        draggable={false}
        blockScroll
        resizable={false}
        closable={false}
      >
        <div>
          <Row style={{ paddingBottom: "10px" }}>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"AmountFrom"}
                textSubProps={"ค่าเริ่มต้น"}
                isRequir
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <div className="field">
                <InputNumber
                  value={amountFrom}
                  onChange={(e: any) => setAmountFrom(e.value)}
                  inputStyle={{
                    textAlign: "right",
                  }}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  style={{
                    borderRadius: "6px 0 0 6px",
                    width: "100%",
                    height: "38px",
                  }}
                />
              </div>
            </Col>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"AmountTo"}
                textSubProps={"ค่าสิ้นสุด"}
                isRequir
              />
            </Col>
            <Col xs={4} sm={4} xl={4}>
              <div className="field">
                <InputNumber
                  value={amountTo}
                  onChange={(e: any) => setAmountTo(e.value)}
                  inputStyle={{
                    textAlign: "right",
                  }}
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  style={{
                    borderRadius: "6px 0 0 6px",
                    width: "100%",
                    height: "38px",
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ paddingBottom: "10px" }}>
            <Col xs={2} sm={2} xl={2}></Col>
            <Col xs={10} sm={10} xl={10}>
              <Row>
                <Col xs={6} sm={6} xl={6}>
                  <Row>
                    <Col xs={1} sm={1} xl={1}>
                      <RadioButton
                        inputId="mode1"
                        name="mode"
                        value="เพิ่มตามคน"
                        onChange={(e: any) => {
                          setFormSelectedPositionLevel(undefined);
                          setMode(e.value);
                        }}
                        checked={mode === "เพิ่มตามคน"}
                      />{" "}
                    </Col>
                    <Col xs={11} sm={11} xl={11}>
                      <TextHeaderComponents
                        textHeaderProps={"เพิ่มตามคน"}
                        textSubProps
                        isRequir
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={6} sm={6} xl={6}>
                  <Row>
                    <Col xs={1} sm={1} xl={1}>
                      <RadioButton
                        inputId="mode2"
                        name="mode"
                        value="ตามลำดับการอนุมัติสูงสุด"
                        onChange={(e: any) => {
                          setApprover(undefined);
                          setMode(e.value);
                        }}
                        checked={mode === "ตามลำดับการอนุมัติสูงสุด"}
                      />
                    </Col>
                    <Col xs={11} sm={11} xl={11}>
                      <TextHeaderComponents
                        textHeaderProps={"ตามลำดับการอนุมัติสูงสุด"}
                        isRequir
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingBottom: "10px" }}>
            {mode == "เพิ่มตามคน" ? (
              <>
                <Col xs={2} sm={2} xl={2}>
                  <TextHeaderComponents
                    textHeaderProps={"Approver"}
                    textSubProps={"ผู้อนุมัติ"}
                    isRequir
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <div className="p-inputgroup">
                    <InputText
                      id={"approver"}
                      value={[
                        userData.Lang === "EN"
                          ? approver?.NameEn
                          : approver?.NameTh,
                      ]}
                      onClick={() => setSubDialogVisible2(true)}
                      style={{
                        borderRadius: "6px 0 0 6px",
                        height: "38px",
                      }}
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
                        setSubDialogVisible2(true);
                      }}
                    />
                  </div>
                </Col>
              </>
            ) : (
              <>
                <Col xs={2} sm={2} xl={2}>
                  <p className="headtext-form"></p>
                  <TextHeaderComponents
                    textHeaderProps={"Max Approver Position"}
                    textSubProps={"ตำแหน่งผู้อนุมัติสูงสุด"}
                    isRequir
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <div className="p-inputgroup">
                    <Dropdown
                      value={formSelectedPositionLevel}
                      options={positionLevelList}
                      optionLabel={userData.Lang === "EN" ? "NameEn" : "NameTh"}
                      filter
                      showClear
                      filterBy={userData.Lang === "EN" ? "NameEn" : "NameTh"}
                      placeholder="Select a Position"
                      onChange={(e: any) =>
                        setFormSelectedPositionLevel(e.value)
                      }
                    />
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
        <div className="footer-dialog">
          <button
            onClick={() => {
              resetSubDialog();
              setSubDialogVisible(false);
            }}
            type="button"
            className="button-cancle"
          >
            Close
          </button>

          <button
            className="button-save"
            type="button"
            onClick={() => AddItem()}
          >
            <AiOutlinePlus />
            Add
          </button>
        </div>
      </Dialog>
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={dataEmployeeList}
        onSelectFunc={(e: any) => {
          setApprover(e.data);
          setSubDialogVisible2(false);
          setLoading(false);
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
        dialogVisible={subDialogVisible2}
        setDialogVisible={setSubDialogVisible2}
      />
    </div>
  );
};
