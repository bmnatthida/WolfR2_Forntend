import { isEmptyObject } from "jquery";
import moment from "moment";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, { useState, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import useAlert from "../../../hooks/useAlert";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import { DropdownComponents } from "../../DropdownComponents/DropdownComponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";

interface Props {
  dialogHeader: string;
  apiName: string;
  formData: any;
  tableData?: any;
  setTableData: (items: any) => void;
  tableComfirmDialog?: boolean;
  setTableComfirmDialog?: (bool: boolean) => void;
  mainDialogVisible?: boolean;
  toggleMainDialog: (state: boolean, action: string) => void;
  setMainLoading?: (bool: boolean) => void;
  toast?: any;
}

export const DynamicDiaLog = (props: Props) => {
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
  const [dynamicColumnsGrid, setDynamicColumnsGrid] = useState<any>([]);
  const [obtionList, setObtionList] = useState<any>({});
  const [uploadFile, setUploadFile] = useState<any>();
  const [copyFormdata, setCopyFormdata] = useState<any>();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [subDialogVisible, setSubDialogVisible] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [messageConfirmDialog, setMessageConfirmDialog] = useState<string>("");
  const toast = useRef<any>(null);
  useEffect(() => {
    if (!isEmptyObject(props.formData)) {
      setCopyFormdata(props.formData);
      setAction("edit");
    } else {
      setAction("add");
    }
    getColumns();
  }, []);

  useEffect(() => {
    setMessageConfirmDialog("Do you want to " + action + " this record?");
  }, [action]);

  const GetColumns = () => {
    let columns: any[] = [];
    Object.keys(props.tableData[0] ? props.tableData[0] : "").map(
      (key: string, idx: number) => {
        if (!key.toLowerCase().includes("id")) {
          if (key !== "SignPicPath" && key !== "UrlLogo") {
            columns.push({
              key: key,
              dataType: typeof props.tableData[0][key],
            });
          }
        }
      }
    );
    return columns;
  };

  function getColumns() {
    let data: any[] = GetColumns();
    let grids: any[] = [];
    let dropdownList: string[] = [];
    let apiName = props.apiName;
    if (apiName.endsWith("s")) {
      apiName = apiName.slice(0, -1);
    }

    data.forEach((col: any, index: number) => {
      if (
        !col.key.toLowerCase().includes("account") &&
        !col.key.toLowerCase().includes("connectionstring") &&
        !col.key.toLowerCase().includes("userprincipalname") &&
        !col.key.toLowerCase().includes("itemmenu") &&
        !col.key.toLowerCase().includes("orderitem") &&
        !col.key.toLowerCase().includes("aumenuid") &&
        !col.key.toLowerCase().includes("companycodewithname")
      ) {
        if (col.key.includes("Id")) {
          if (apiName !== "MasterData") {
            if (
              col.key !=
              apiName.replace(" ", "").replace("Master", "") + "Id"
            ) {
              if (
                col.key.toLowerCase().includes("reportto") &&
                col.key.toLowerCase().includes("manager")
              ) {
                const field = col.key.replace("Id", "");

                dropdownList.push(field);
                grids.push({
                  field: field,
                  header: col.key,
                  type: "popup",
                  index: index,
                });
              } else {
                const field = col.key.replace("Id", "");

                dropdownList.push(field);
                grids.push({
                  field: field,
                  header: col.key,
                  type: "object",
                  index: index,
                });
              }
            }
          }
        } else if (
          col.key.toLowerCase() !== "createdby" &&
          col.key.toLowerCase() !== "modifiedby" &&
          col.key.toLowerCase() !== "createddate" &&
          col.key.toLowerCase() !== "modifieddate" &&
          !col.key.toLowerCase().includes("createdby") &&
          !col.key.toLowerCase().includes("modifiedby")
        ) {
          if (
            !dropdownList.includes(col.key.replace("Id", "")) &&
            !dropdownList.includes(col.key.replace("NameTh", "")) &&
            !dropdownList.includes(col.key.replace("NameEn", ""))
          ) {
            if (col.key.includes("Pic")) {
              grids.push({
                field: col.key,
                header: col.key,
                type: "image",
                index: 999,
              });
            } else {
              grids.push({
                field: col.key,
                header: col.key,
                type: col.dataType,
                index: index,
              });
            }
          }
        }
      }
    });
    grids.sort((a, b) => a.index - b.index);

    setDynamicColumnsGrid(_dynamicColumnsGrid(grids));
  }

  const getFormErrorMessage = (name: any) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  function translateFunc(text: string) {
    let textTH = "";

    textTH = text.replace("PositionLevelId", "รหัสระดับตำแหน่ง");
    textTH = textTH.replace("PositionLevel", "ระดับตำแหน่ง");
    textTH = textTH.replace("Name", "ชื่อ");
    textTH = textTH.replace("Th", "ภาษาไทย");
    textTH = textTH.replace("En", "ภาษาอังกฤษ");
    textTH = textTH.replace("RoleDescription", "คำอธิบายหน้าที่");
    textTH = textTH.replace("value", "ค่า");
    textTH = textTH.replace("Tel", "โทรศัพท์");
    textTH = textTH.replace("Web", "เว็ปไซต์");
    textTH = textTH.replace("Address", "ที่อยู่");
    textTH = textTH.replace("Company", "บริษัท");
    textTH = textTH.replace("Code", "รหัส");
    textTH = textTH.replace("IsActive", "สถานะ");
    textTH = textTH.replace("Fax", "แฟกซ์");
    textTH = textTH.replace("UrlLogo", "Url ชองโลโก้");

    return textTH;
  }

  function manageObjectDatas(fieldName: string, selectedData: any) {
    let obtions = obtionList;
    obtions[fieldName] = selectedData;
    setObtionList({ ...obtions });
  }

  function _dynamicColumnsGrid(grids: any) {
    let _dataArray: any = [];
    let _dataArrayCheck: any = [];
    let _dataArraygrid: any = [];
    grids.map((col: any, inx: any) => {
      _dataArrayCheck.push(col);
      if (inx % 2 !== 0) {
        _dataArray.push(_dataArrayCheck);
        _dataArrayCheck = [];
      }
    });

    _dataArray.map((col: any, rowIdx: number) => {
      let _grid = (
        <Row style={{ paddingBottom: "10px" }}>
          {col.map((data: any, colIdx: number) => {
            let textTH = translateFunc(data.header);
            if (data.type === "string") {
              if (data.header.includes("Address")) {
                return (
                  <>
                    <Col xs={2} sm={2} xl={2}>
                      <div className=" font-size-edit-header-input-request">
                        <TextHeaderComponents
                          textHeaderProps={data.header}
                          textSubProps={textTH}
                        />
                      </div>
                    </Col>
                    <Col xs={4} sm={4} xl={4}>
                      <div className=" ">
                        <Controller
                          name={data.field}
                          control={control}
                          defaultValue={props.formData[data.field]}
                          render={({ field, fieldState }) => (
                            <InputTextarea
                              id={field.name}
                              {...field}
                              rows={3}
                              cols={30}
                              autoFocus={
                                rowIdx === 0 && colIdx === 0 ? true : false
                              }
                              style={{
                                height: "38px",
                                borderRadius: "6px 6px 6px 6px",
                              }}
                            />
                          )}
                        />
                      </div>
                    </Col>
                  </>
                );
              } else if (data.header === "NameTh" || data.header === "NameEn") {
                let str = "";
                if (data.header === "NameTh") {
                  str = "Name TH";
                } else {
                  str = "Name EN";
                }

                return (
                  <>
                    {" "}
                    <Col xs={2} sm={2} xl={2}>
                      <div className=" font-size-edit-header-input-request">
                        <TextHeaderComponents
                          textHeaderProps={str}
                          textSubProps={textTH}
                          isRequir
                        />
                      </div>
                    </Col>
                    <Col xs={4} sm={4} xl={4}>
                      <div className=" ">
                        <Controller
                          name={data.field}
                          control={control}
                          defaultValue={props.formData[data.field]}
                          rules={{ required: data.header + " is required." }}
                          render={({ field, fieldState }) => (
                            <InputText
                              id={field.name}
                              {...field}
                              className={classNames({
                                "p-invalid": fieldState.invalid,
                              })}
                              autoFocus={
                                rowIdx === 0 && colIdx === 0 ? true : false
                              }
                              style={{
                                height: "38px",
                                borderRadius: "6px 6px 6px 6px",
                              }}
                            />
                          )}
                        />
                      </div>
                      {getFormErrorMessage(data.header)}
                    </Col>
                  </>
                );
              } else {
                return (
                  <>
                    <Col xs={2} sm={2} xl={2}>
                      <div className=" font-size-edit-header-input-request">
                        <TextHeaderComponents
                          textHeaderProps={data.header}
                          textSubProps={textTH}
                        />
                      </div>
                    </Col>
                    <Col xs={4} sm={4} xl={4}>
                      <div className=" ">
                        <Controller
                          name={data.field}
                          control={control}
                          defaultValue={props.formData[data.field]}
                          render={({ field, fieldState }) => (
                            <InputTextComponents
                              setControllerId={field.name}
                              fieldProps={field}
                              setClassNameProps={classNames({
                                "p-invalid": fieldState.invalid,
                              })}
                              setStyleProps={{
                                height: "38px",
                                borderRadius: "6px 6px 6px 6px",
                              }}
                            />
                          )}
                        />
                      </div>
                    </Col>
                  </>
                );
              }
            } else if (data.type === "boolean") {
              return (
                <>
                  <Col xs={2} sm={2} xl={2}>
                    <div className=" font-size-edit-header-input-request">
                      <TextHeaderComponents
                        textHeaderProps={data.header}
                        textSubProps={textTH}
                      />
                    </div>
                  </Col>
                  <Col xs={4} sm={4} xl={4}>
                    <div className=" ">
                      <Controller
                        name={data.field}
                        defaultValue={
                          props.formData[data.field] == undefined
                            ? true
                            : props.formData[data.field]
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
                    </div>
                  </Col>
                </>
              );
            } else if (data.type === "object") {
              return (
                <>
                  <Col xs={2} sm={2} xl={2}>
                    <div className=" font-size-edit-header-input-request">
                      <TextHeaderComponents
                        textHeaderProps={data.header}
                        textSubProps={textTH}
                      />
                    </div>
                  </Col>
                  <Col xs={4} sm={4} xl={4}>
                    <div className=" ">
                      <Controller
                        name={data.field}
                        defaultValue={
                          props.formData[data.field + "Id"] == undefined
                            ? null
                            : props.formData[data.field + "Id"]
                        }
                        control={control}
                        render={({ field, fieldState }) => (
                          <DropdownComponents
                            apiName={field.name}
                            valueProps={field}
                            onChangeProps={manageObjectDatas}
                            styleProps={{
                              width: "100%",
                              borderRadius: "6px 6px 6px 6px",
                            }}
                          />
                        )}
                      />
                    </div>
                  </Col>
                </>
              );
            } else if (data.type === "number") {
              return (
                <>
                  <Col xs={2} sm={2} xl={2}>
                    <div className=" font-size-edit-header-input-request">
                      <TextHeaderComponents
                        textHeaderProps={data.header}
                        textSubProps={textTH}
                      />
                    </div>
                  </Col>
                  <Col xs={4} sm={4} xl={4}>
                    <div className=" ">
                      <Controller
                        name={data.field}
                        control={control}
                        defaultValue={props.formData[data.field]}
                        render={({ field, fieldState }) => (
                          <InputNumber
                            inputId={field.name}
                            value={field.value}
                            autoFocus={
                              rowIdx === 0 && colIdx === 0 ? true : false
                            }
                            onChange={(e) => field.onChange(e.value)}
                            className={classNames({
                              "p-invalid": fieldState.invalid,
                            })}
                          />
                        )}
                      />
                    </div>
                  </Col>
                </>
              );
            } else if (data.type === "popup") {
              <>
                <div className="col-xl-2 font-size-edit-header-input-request">
                  <p className="headtext-form">{data.header}</p>
                  <p className="subtext-form">รายงานไปที่</p>
                </div>
                <div className="col-xl-10">
                  <Controller
                    name="ReportToEmpCode"
                    control={control}
                    defaultValue={props.formData[data.field]}
                    render={({ field, fieldState }) => (
                      <div className="p-inputgroup">
                        <InputText
                          id={field.name}
                          value={props.formData[data.field].NameTh}
                          className={classNames({
                            "p-invalid": fieldState.invalid,
                          })}
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
                            setSubDialogVisible(true);
                          }}
                        />
                      </div>
                    )}
                  />
                  {getFormErrorMessage("ReportToEmpCode")}
                </div>
              </>;
            }
          })}
        </Row>
      );
      _dataArraygrid.push(_grid);
    });
    return [..._dataArraygrid];
  }

  const updateChanges = (data: any) => {
    try {
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
    } catch (error) {
      console.log("error", error);
    }
  };

  const acceptSave = async (data: any) => {
    try {
      let formData: any = {};

      if (action === "edit") {
        formData = copyFormdata;
        formData["CreatedBy"] = userData.employeeData.EmployeeId.toString();
        formData["CreatedDate"] = moment(new Date()).format("DD MMM YYYY");
      }
      Object.keys(data).map((key) => {
        formData[key] = data[key] === undefined ? "" : data[key];
      });
      if (!isEmptyObject(obtionList)) {
        Object.keys(formData).map((key) => {
          if (key !== props.apiName + "Id") {
            Object.keys(obtionList).map((objectKey) => {
              if (key.includes(objectKey)) {
                Object.keys(obtionList[objectKey]).map((field) => {
                  if (field.includes("Id")) {
                    formData[field] = obtionList[objectKey][field];
                  } else {
                    if (field === key) {
                      formData[key] = obtionList[objectKey][key];
                    } else {
                      if (
                        obtionList[objectKey][key.replace(objectKey, "")] !==
                        undefined
                      ) {
                        formData[key] =
                          obtionList[objectKey][key.replace(objectKey, "")];
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }

      formData["ModifiedBy"] = userData.employeeData.EmployeeId.toString();
      formData["ModifiedDate"] = moment(new Date()).format("DD MMM YYYY");
      console.log(formData);

      let res: any = await updateDynamic(
        props.apiName.replace(" ", ""),
        formData
      );

      if (res.result === "success") {
        if (props.setTableData !== undefined) {
          let newData: any[] = await GetAllDynamic(
            props.apiName.replace(" ", "") + "/GetAll",
            undefined
          );
          if (newData.length > 0) {
            props.setTableData(newData);
          }
        }
        props.setMainDialogVisible(false);
        if (props.setMainLoading !== undefined) {
          props.setMainLoading(false);
        }
      } else {
        toggleAlert({
          description: `${res.errorMessage}`,
          message: `Error`,
          type: "error",
        });
        // props.toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: res.errorMessage,
        //   life: 3000,
        // });
      }
    } catch (error) {
      console.log("error", error);
      if (props.setMainLoading !== undefined) {
        props.setMainLoading(false);
      }
    }
  };
  return (
    <div>
      <Dialog
        header={props.dialogHeader}
        visible={props.mainDialogVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={() => {
          reset();
          props.setMainDialogVisible(false);
        }}
        breakpoints={{}}
        draggable={false}
        closable={false}
        blockScroll
      >
        <form onSubmit={handleSubmit(updateChanges)} className="p-fluid">
          <div className="row set-layout-form-edit-table ">
            {dynamicColumnsGrid}
          </div>
          <div className="footer-dialog">
            <button
              onClick={() => {
                reset();
                props.setMainDialogVisible(false);
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
    </div>
  );
};
