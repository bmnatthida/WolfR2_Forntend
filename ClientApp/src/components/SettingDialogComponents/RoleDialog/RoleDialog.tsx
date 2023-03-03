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
import { GetAllDynamic } from "../../../Services/DynamicService";
import binIcon from "../../../assets/bin-icon.png";
import moment from "moment";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { GetRolePermission, UpdateRole } from "../../../Services/RoleServices";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";
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

export const RoleDialog = (props: Props) => {
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
  const [itemsList, setItemsList] = useState<any>([]);
  const [itemsListShow, setItemsListShow] = useState<any>([]);
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
    fetchDataEmployee();

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

  useEffect(() => {
    fetchRoleItem();
  }, [dataEmployeeList]);

  async function fetchRoleItem() {
    let permissions = await GetRolePermission();
    let items: any[] = [];
    if (permissions) {
      let thisPermis = permissions.filter(
        (permis: any) =>
          permis.RoleId === props.formData.RoleId && !permis.IsDelete
      );

      thisPermis.map((permis: any, idx: number) => {
        let object: any = {};
        object.RoleId = permis.RoleId;
        object.EmployeeId = permis.EmployeeId;
        object.EmployeeCode = null;
        object.NameThRole = null;
        object.NameEnRole = null;
        object.Email = null;
        object.NameThEmployee = null;
        object.NameEnEmployee = null;
        object.IsActive = true;
        object.IsDelete = permis.IsDelete === null ? false : permis.IsDelete;
        object.Seq = idx + 1;
        items.push(object);
      });

      items.map((item: any) => {
        dataEmployeeList.map((emp: any) => {
          if (item.EmployeeId === emp.EmployeeId) {
            item.EmployeeId = emp.EmployeeId;
            item.EmployeeCode = emp.EmployeeCode;
            item.NameThEmployee = emp.NameTh;
            item.NameEnEmployee = emp.NameEn;
            item.Email = emp.Email;
          }
        });
        item.NameThRole = props.formData.NameTh;
        item.NameEnRole = props.formData.NameEn;
      });
      setSearchData([
        ...dataEmployeeList.filter(
          (data: any) =>
            !items.find(
              ({ EmployeeId, IsDelete }) =>
                data.EmployeeId === EmployeeId && !IsDelete
            )
        ),
      ]);
      console.log("role=>items", items);

      setItemsList([...items]);
    }
  }

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

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

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const dataEmp = dataEmployeeList;
    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      if (userData.employeeData.Lang === "EN") {
        if (
          data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.NameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.PositionNameEn.toLowerCase().indexOf(value.toLowerCase()) !==
            -1 ||
          data.DepartmentNameEn.toLowerCase().indexOf(value.toLowerCase()) !==
            -1
        ) {
          return true;
        }
      } else {
        if (
          data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.NameTh.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.PositionNameTh.toLowerCase().indexOf(value.toLowerCase()) !==
            -1 ||
          data.DepartmentNameTh.toLowerCase().indexOf(value.toLowerCase()) !==
            -1
        ) {
          return true;
        }
      }
    });
    setSearchData([...data]);
  };

  async function fetchDataEmployee() {
    let _dataEmployee = await GetAllEmployee();
    setDataEmployeeList(_dataEmployee);
  }

  const onDeleteRow = (data: any, setData: any, empId: string) => {
    confirmDialog({
      message: "Do you to delete this row.",
      header: "Delete Confirmation",
      icon: "p-confirm-dialog-icon pi pi-info-circle",
      acceptClassName:
        "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
      accept: () => {
        data.map((e: any) => {
          if (e["EmployeeId"] === empId) {
            e.IsActive = false;
            e.IsDelete = true;
          }
        });
        setData([...data]);
      },
    });
  };

  useEffect(() => {
    let newList = itemsList.filter((item: any) => !item.IsDelete);
    setItemsListShow([...newList]);
  }, [itemsList]);

  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};
      if (action === "add") {
        formData.RoleId = -1;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.IsActive = data.IsActive;
        formData.RoleDescription = "";
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
        formData.RoleId = props.formData.RoleId;
        formData.NameTh = data.NameTh;
        formData.NameEn = data.NameEn;
        formData.IsActive = data.IsActive;
        formData.RoleDescription = "";
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

      let res = await UpdateRole(formData, itemsList);
      if (itemsList > 0) {
        if (res.result === "success") {
          props.toggleMainDialog(false, "save");
        } else {
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
      } else {
        if (res) {
          props.toggleMainDialog(false, "save");
        } else {
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
      }
    } catch (error) {
      console.log("roles=>error", error);

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
      props.toggleMainDialog(false, "close");
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
          blockScroll
          closable={false}
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
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={4} sm={4} xl={4}>
                  <ButtonComponents
                    setLabelProps={"Create Items"}
                    setStyleProps={{
                      height: "38px",
                      backgroundColor: "#282F6A",
                      color: "#FFFFFF",
                      border: "1px solid rgb(40, 47, 106)",
                    }}
                    onClickProps={() => {
                      setSubDialogVisible(true);
                    }}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}></Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col xs={12} sm={12} xl={12}>
                  <Controller
                    name="items"
                    control={control}
                    defaultValue={itemsListShow}
                    render={({ field, fieldState }) => (
                      <DataTable
                        id={field.name}
                        onRowReorder={(e: any) => {
                          let items: any[] = e.value;
                          items.map((item: any, idx: number) => {
                            item.Seq = idx + 1;
                          });

                          field.onChange([...items]);
                          setItemsList([...items]);
                        }}
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
                          field="EmployeeCode"
                          header={
                            <tr>
                              <th>
                                <p className="row headtext">Employee Code</p>
                                <p className="row subtext">รหัสพนักงาน</p>
                              </th>
                            </tr>
                          }
                        ></Column>
                        <Column
                          field="NameThEmployee"
                          header={
                            <tr>
                              <th>
                                <p className="row headtext">Name Thai</p>
                                <p className="row subtext">ชื่อภาษาไทย</p>
                              </th>
                            </tr>
                          }
                        ></Column>
                        <Column
                          field="NameEnEmployee"
                          header={
                            <tr>
                              <th>
                                <p className="row headtext">Name English</p>
                                <p className="row subtext">ชื่อภาษาอังกฤษ</p>
                              </th>
                            </tr>
                          }
                        ></Column>
                        <Column
                          field="Email"
                          header={
                            <tr>
                              <th>
                                <p className="row headtext">E-mail</p>
                                <p className="row subtext">อีเมล</p>
                              </th>
                            </tr>
                          }
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
                                  onDeleteRow(
                                    itemsList,
                                    setItemsList,
                                    rowData["EmployeeId"]
                                  );
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
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={dataEmployeeList}
        onSelectFunc={(e: any) => {
          let item = e?.data;
          if (e.data !== undefined) {
            setSearchData([
              ...searchData.filter(
                (emp: any) => emp.EmployeeId !== e?.data?.EmployeeId
              ),
            ]);
          }
          let itemsShow: any[] = itemsList;
          let object: any = {};
          object.RoleId = action === "add" ? -1 : props.formData.RoleId;
          object.EmployeeId = item.EmployeeId;
          object.EmployeeCode = item.EmployeeCode;
          object.NameThRole = action === "add" ? "" : props.formData.NameTh;
          object.NameEnRole = action === "add" ? "" : props.formData.NameEn;
          object.Email = item.Email;
          object.NameThEmployee = item.NameTh;
          object.NameEnEmployee = item.NameEn;
          object.IsActive = true;
          object.IsDelete = false;
          object.Seq = itemsShow.length;
          itemsShow.push(object);

          setItemsList([...itemsShow]);
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
