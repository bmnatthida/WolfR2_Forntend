import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import SelectCondition from "./SelectCondition";
import binIcon from "../../../assets/bin-icon.png";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { Dropdown } from "primereact/dropdown";
import SelectDataFormTable from "./SelectDataFormTable";
import moment from "moment";

interface Props {
  control: any;
  advanceForm: any;
  getFormErrorMessage: any;
  controlModel: any;
  setControlModel: any;
  rowData?: any;
  allApproveLength: number;
  positionList: any;
  matrixList: any;
  signatureList: any;
}

export default function AddMatrixForm(props: Props) {
  const [positionLevelOptions, setPositionLevelOptions] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [matrixOptions, setMatrixOptions] = useState<any[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [showDialogFootter, setShowDialogFootter] = useState<boolean>(true);
  const [maxLevel, setMaxLevel] = useState<any>();
  const [positionLevel, setPositionLevel] = useState<any>();
  const [approvalMatrixDD, setApprovalMatrixDD] = useState<any>();
  const [conditionsValue, setConditionsValue] = useState<any[]>([]);
  const [specficApprovals, setSpecficApprovals] = useState<any[]>([]);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogBody, setDialogBody] = useState<any>();
  const [loadingSelectData, setLoadingSelectData] = useState<boolean>(true);
  const [defSignatureID, setDefSignatureID] = useState<number>(-1);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [temSeq, setTemSeq] = useState<any>(0);
  const [loc, setLoc] = useState<boolean>(false);
  const [dtp, setDtp] = useState<boolean>(false);
  const [doa, setDoa] = useState<boolean>(false);
  const [spc, setSpc] = useState<boolean>(false);

  const labelStyle: any = {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "13px",
    lineHeight: "19px",
    marginLeft: "5px",
    color: "#000000",
  };

  useEffect(() => {
    if (props.rowData !== undefined) {
      setDefValue(props.rowData);
    }
  }, [matrixOptions]);

  useEffect(() => {
    if (props.signatureList !== undefined) {
      props.signatureList.map((e: any) => {
        if (e.Seq === "1") {
          setDefSignatureID(e.masterId);
        } else if (e.value2 === "Approved") {
          setDefSignatureID(e.masterId);
        }
      });
    }
  }, [props.signatureList]);

  function setDefValue(rowData: any) {
    try {
      let conditions: any[] = [];
      if (
        rowData.Conditions !== undefined &&
        rowData.Conditions !== null &&
        rowData.Conditions !== ""
      ) {
        if (
          rowData.Conditions.Conditions !== undefined &&
          rowData.Conditions.Conditions !== null
        ) {
          rowData.Conditions.Conditions.map((con: any) => {
            conditions.push({
              field: con.field,
              value: con.value,
            });
          });
          setConditionsValue(conditions);
        }
      }
      if (rowData.Type === "Line of Command") {
        setLoc(true);
        props.positionList.map((e: any) => {
          if (rowData.MaxLevelId === e.PositionLevelId) {
            props.control._formValues.MaxLevelId = e;
            setMaxLevel(e);
          }
        });
        props.control._formValues.Line_of_Command = true;
      } else if (rowData.Type === "Direct to Position") {
        setDtp(true);
        props.positionList.map((e: any) => {
          if (rowData.MaxLevelId === e.PositionLevelId) {
            props.control._formValues.PositionLevelId = e;
            setPositionLevel(e);
          }
        });
        props.control._formValues.Direct_to_Position = true;
      } else if (rowData.Type === "Design of Authority") {
        setDoa(true);
        props.matrixList.map((e: any) => {
          if (rowData.MaxLevelId === e.ApproveMatrixId) {
            props.control._formValues.Approval_MatrixId = e;
            setApprovalMatrixDD(e);
          }
        });
        props.control._formValues.Design_of_Authority = true;
      } else if (rowData.Type === "Specific Approver") {
        setSpc(true);
        props.control._formValues.Specific_Approver = true;
        console.log("rowdata", rowData);

        setSpecficApprovals(rowData.Specific_Approver);
      }
    } catch (error) {
      console.log("matrix=>error", error);
    }
  }

  const updateChanges = (data: any, componentName?: string) => {
    try {
      if (data !== undefined) {
        if (componentName === "condition") {
          let conditions: any[] = conditionsValue;
          conditions.push({
            field: data.field,
            value: data.value,
            action: data.action,
          });
          setConditionsValue(conditions);
        } else if (data.EmployeeId !== undefined) {
          let specific_Approver: any[] = specficApprovals;
          const user = data;
          console.log("matrix=>", user);

          specific_Approver.push({
            TemLineId:
              props.rowData !== undefined
                ? props.rowData.TemLineId !== undefined
                  ? props.rowData.TemLineId
                  : temSeq
                : temSeq,
            Seq: specific_Approver.length + 1,
            EmployeeId: user.EmployeeId,
            EmployeeName:
              userData.employeeData.Lang === "EN" ? user.NameEn : user.NameTh,
            Position:
              userData.employeeData.Lang === "EN"
                ? user.PositionNameEn
                : user.PositionNameTh,
            SpecificTypeId: 874,
            SignatureID: defSignatureID,
            CreatedDate: moment(new Date()).format("DD MMM YYYY"),
            CreatedBy: userData.employeeData.EmployeeId.toString(),
            ModifiedDate: moment(new Date()).format("DD MMM YYYY"),
            ModifiedBy: userData.employeeData.EmployeeId.toString(),
          });

          setSpecficApprovals([...specific_Approver]);
        } else if (data.RoleId !== undefined) {
          let specific_Approver: any[] = specficApprovals;
          const role = data;
          specific_Approver.push({
            TemLineId:
              props.rowData !== undefined
                ? props.rowData.TemLineId !== undefined
                  ? props.rowData.TemLineId
                  : temSeq
                : temSeq,
            Seq: specific_Approver.length + 1,
            EmployeeId: role.RoleId,
            EmployeeName:
              userData.employeeData.Lang === "EN" ? role.NameEn : role.NameTh,

            Position: role.RoleDescription,
            SpecificTypeId: 875,
            SignatureID: defSignatureID,
            CreatedDate: moment(new Date()).format("DD MMM YYYY"),
            CreatedBy: userData.employeeData.EmployeeId.toString(),
            ModifiedDate: moment(new Date()).format("DD MMM YYYY"),
            ModifiedBy: userData.employeeData.EmployeeId.toString(),
          });
          setSpecficApprovals([...specific_Approver]);
        }
      } else {
        if (componentName === "requestor") {
          let specific_Approver: any[] = specficApprovals;
          specific_Approver.push({
            TemLineId:
              props.rowData !== undefined
                ? props.rowData.TemLineId !== undefined
                  ? props.rowData.TemLineId
                  : temSeq
                : temSeq,
            Seq: specific_Approver.length + 1,
            EmployeeId: null,
            EmployeeName: "(Requestor)",
            Position: "",
            SpecificTypeId: 876,
            SignatureID: defSignatureID,
            CreatedDate: moment(new Date()).format("DD MMM YYYY"),
            CreatedBy: userData.employeeData.EmployeeId.toString(),
            ModifiedDate: moment(new Date()).format("DD MMM YYYY"),
            ModifiedBy: userData.employeeData.EmployeeId.toString(),
          });
          setSpecficApprovals([...specific_Approver]);
        }
      }
      setDialogVisible(false);
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  function callSelectConditionForm() {
    setShowDialogFootter(true);
    setLoadingSelectData(false);
    setDialogBody(
      <SelectCondition
        advanceForm={props.advanceForm}
        updateData={updateChanges}
        setDialogVisible={setDialogVisible}
      />
    );
  }

  // async function fetchMasterData() {
  //   let options: any[] = [];
  //   let signatrue = await GetSignature();
  //   signatrue.map((s: any) => {
  //     if (s.value2 === "Approved") {
  //       setDefSignatureID(s.masterId);
  //     }
  //     options.push({ id: s.masterId, value1: s.value1, value2: s.value2 });
  //   });

  //   setSinatureOptions([...options]);
  // }

  async function fetchMatrixData() {
    let matrix = await GetAllDynamic("ApprovalMatrix/GetAll", undefined);
    setMatrixOptions([...matrix.filter((e: any) => e.IsActive === true)]);
  }

  async function callSelectUserDialog(apiName: string) {
    setDialogTitle("Add User");
    let _dataDynamic = await GetAllDynamic(apiName + "/GetAll", undefined);
    let columns = [
      {
        field: "EmployeeCode",
        header: "EmployeeCode",
      },
      {
        field: "NameEn",
        header: "Employee Name",
      },
      {
        field: "PositionNameEn",
        header: "Position",
      },
      {
        field: "DepartmentNameEn",
        header: "Department",
      },
      {
        field: "Email",
        header: "Email",
      },
    ];
    setShowDialogFootter(false);
    if (_dataDynamic !== undefined) {
      setLoadingSelectData(false);
      setDialogBody(
        <SelectDataFormTable
          name="user"
          dataList={_dataDynamic}
          columns={columns}
          loading={loadingSelectData}
          setLoading={setLoadingSelectData}
          updateData={updateChanges}
        />
      );
    }
  }

  async function callSelectRoleDialog(apiName: string) {
    setDialogTitle("Add Role");
    let _dataDynamic = await GetAllDynamic(apiName + "/GetAll", undefined);
    let columns = [
      {
        field: "NameEn",
        header: "Name",
      },
      {
        field: "RoleDescription",
        header: "Description",
      },
    ];
    setShowDialogFootter(false);
    setLoadingSelectData(false);
    if (_dataDynamic !== undefined) {
      setDialogBody(
        <SelectDataFormTable
          name="role"
          dataList={_dataDynamic}
          columns={columns}
          loading={loadingSelectData}
          setLoading={setLoadingSelectData}
          updateData={updateChanges}
        />
      );
    }
  }

  const onDeleteRow = (data: any, setData: any, rowIdx: number) => {
    let selected: any = [...data];

    confirmDialog({
      message: "Do you to delete this row.",
      header: "Delete Confirmation",
      icon: "p-confirm-dialog-icon pi pi-info-circle",
      acceptClassName:
        "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
      accept: () => {
        selected.splice(rowIdx, 1);
        selected.map((e: any, idx: number) => {
          e.Seq = idx + 1;
        });
        setData(selected);
      },
    });
  };

  async function fecthPositionLevel() {
    let _dataDynamic: any[] = await GetAllDynamic(
      "PositionLevel/GetAll",
      undefined
    );
    _dataDynamic.sort((a, b) => (a.PositionLevel < b.PositionLevel ? 1 : -1));
    setPositionLevelOptions(_dataDynamic);
  }

  useEffect(() => {
    fecthPositionLevel();
    // fecthPosition();
    fetchMatrixData();
    if (props.rowData !== undefined) {
      setTemSeq(props.rowData.Seq - 1);
    } else {
      setTemSeq(props.allApproveLength);
    }
  }, []);

  useEffect(() => {
    if (specficApprovals && specficApprovals.length > 0) {
      specficApprovals.map((spc: any) => {
        if (spc.SignatureID === 0 || spc.SignatureID === -1) {
          spc.SignatureID = defSignatureID;
        }
      });
      props.control._formValues.specific_Approver = specficApprovals;
    }
  }, [specficApprovals]);

  useEffect(() => {
    if (props.control._fields.Conditions !== undefined) {
      props.control._formValues.Conditions = conditionsValue;
    }
  }, [conditionsValue]);

  function onSelected_Sinatures(event: any, rowInx: number) {
    let line: any[] = specficApprovals;
    line[rowInx].SignatureID = event.value.masterId;
    setSpecficApprovals([...line]);
  }

  const statusBodyTemplate = (rowData: any, option: any) => {
    let selectedValue: any[] = [];

    specficApprovals.map((e: any) => {
      if (e.SignatureID !== undefined) {
        props.signatureList.map((sig: any) => {
          if (e.SignatureID === sig.masterId) {
            selectedValue.push(sig);
          }
        });
      } else if (e.SignatureId !== undefined) {
        props.signatureList.map((sig: any) => {
          if (e.SignatureId === sig.masterId) {
            selectedValue.push(sig);
          }
        });
      } else {
        const getSign = props.signatureList.filter((sig: any) => {
          return sig.value1 === "อนุมัติ";
        });
        selectedValue.push(getSign[0]);
      }
    });
    return (
      <Dropdown
        className="dropdown-lineapprove"
        value={selectedValue[option.rowIndex]}
        options={props.signatureList}
        onChange={(e) => onSelected_Sinatures(e, option.rowIndex)}
        optionLabel={userData.employeeData.Lang === "EN" ? "value2" : "value1"}
        placeholder="Select a Signature"
      />
    );
  };

  return (
    <>
      <Controller
        name="Seq"
        control={props.control}
        defaultValue={props.rowData !== undefined ? props.rowData.Seq : -1}
        render={({ field, fieldState }) => (
          <input id={field.name} {...field} type="hidden" />
        )}
      />
      <div className="row-formgroup">
        <Row className="row-table">
          <Col xs={12} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Condition"}
              textSubProps={"เงื่อนไข"}
            />
          </Col>
          <Col className="approveMatrix-inputgroup">
            <ButtonComponents
              setStyleProps={{
                width: "150px",
                borderRadius: "6px",
                boxShadow: "none",
                border: "1px solid #282f6a",
                fontSize: "13px",
                paddingLeft: "16px",
              }}
              onClickProps={() => {
                setDialogTitle("Select Condition");
                callSelectConditionForm();
                setDialogVisible(!dialogVisible);
              }}
              typeProps={"button"}
              setLabelProps={"Add Condition"}
              setIconProps={<FiPlus />}
              setClassNameProps={"p-button-text-position"}
            />
            <Controller
              name="Conditions"
              control={props.control}
              defaultValue={conditionsValue}
              render={({ field, fieldState }) => (
                <>
                  <DataTable
                    id={field.name}
                    onRowReorder={(e: any) => {
                      field.onChange(e.value);
                      setConditionsValue(e.value);
                    }}
                    onValueChange={(e: any) => {
                      field.onChange(e.value);
                      setConditionsValue(e.value);
                    }}
                    value={conditionsValue}
                    responsiveLayout="scroll"
                  >
                    <Column
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Sequence"}
                          textSubProps={"ลำดับ"}
                        />
                      }
                      body={(rowData, options) => options.rowIndex + 1}
                    ></Column>
                    <Column
                      field="field"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Column"}
                          textSubProps={"คอลัมน์"}
                        />
                      }
                    ></Column>
                    <Column
                      field="value"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Value"}
                          textSubProps={"ค่า"}
                        />
                      }
                    ></Column>
                    <Column
                      field="Delete"
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
                                conditionsValue,
                                setConditionsValue,
                                options.rowIndex
                              );
                            }}
                          >
                            <img src={binIcon} alt="logo" />
                          </button>
                        );
                      }}
                    ></Column>
                  </DataTable>
                </>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Type of Approval :"}
              textSubProps={"ประเภทการอนุมัติ :"}
            />
          </Col>
          <Col
            xs={3}
            sm={3}
            xl={3}
            className="approveMatrix-inputgroup row-formgroup"
          >
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Controller
                  name="Line_of_Command"
                  control={props.control}
                  defaultValue={loc}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={field.name}
                      disabled={props.rowData !== undefined}
                      onChange={(e) => {
                        field.onChange(e.checked);
                        setLoc(e.checked);
                        setMaxLevel(null);
                      }}
                      className={classNames({
                        "p-invalid": !loc && !doa && !dtp && !spc,
                      })}
                      checked={loc}
                    />
                  )}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Line of Command
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    สายการบังคับบัญชา
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Controller
                  name="Direct_to_Position"
                  control={props.control}
                  defaultValue={dtp}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      inputId={field.name}
                      disabled={props.rowData !== undefined}
                      onChange={(e) => {
                        field.onChange(e.checked);
                        setDtp(e.checked);
                        setPositionLevel(null);
                      }}
                      className={classNames({
                        "p-invalid": !loc && !doa && !dtp && !spc,
                      })}
                      checked={dtp}
                    />
                  )}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Direct to Position
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    ส่งถึงตำแหน่ง
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Controller
                  name="Design_of_Authority"
                  control={props.control}
                  defaultValue={doa}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      inputId={field.name}
                      disabled={props.rowData !== undefined}
                      onChange={(e) => {
                        field.onChange(e.checked);
                        setDoa(e.checked);
                        setApprovalMatrixDD(null);
                      }}
                      className={classNames({
                        "p-invalid": !loc && !doa && !dtp && !spc,
                      })}
                      checked={doa}
                    />
                  )}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Design of Authority
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    อนุมัติตามอำนาจการดำเนินการ
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Controller
                  name="Specific_Approver"
                  control={props.control}
                  defaultValue={spc}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      inputId={field.name}
                      disabled={props.rowData !== undefined}
                      onChange={(e) => {
                        field.onChange(e.checked);
                        setSpc(e.checked);
                      }}
                      className={classNames({
                        "p-invalid": !loc && !doa && !dtp && !spc,
                      })}
                      checked={spc}
                    />
                  )}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Specific Approver
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    เลือกผู้อนุมัติเอง
                  </label>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={7} sm={7} xl={7} className="row-formgroup">
            <Row>
              <Col xs={3} sm={3} xl={3}>
                <TextHeaderComponents
                  textHeaderProps={"Max Level"}
                  textSubProps={"ลำดับการอนุมัติสูงสุด"}
                />
              </Col>
              <Col xs={9} sm={9} xl={9}>
                <Controller
                  name="MaxLevelId"
                  control={props.control}
                  defaultValue={maxLevel}
                  rules={{ required: loc }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      value={maxLevel}
                      placeholder="--- Please select ---"
                      onChange={(e: any) => {
                        field.onChange(e.value);
                        setMaxLevel(e.value);
                      }}
                      disabled={!loc}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                      optionLabel={
                        userData.employeeData.Lang === "EN"
                          ? "NameEn"
                          : "NameTh"
                      }
                      filter
                      showClear
                      filterBy={
                        userData.employeeData.Lang === "EN"
                          ? "NameEn"
                          : "NameTh"
                      }
                      options={positionLevelOptions}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3} sm={3} xl={3}>
                <TextHeaderComponents
                  textHeaderProps={"Position"}
                  textSubProps={"ตำแหน่งอนุมัติ"}
                />
              </Col>
              <Col xs={9} sm={9} xl={9}>
                <Controller
                  name="PositionLevelId"
                  control={props.control}
                  defaultValue={positionLevel}
                  rules={{ required: dtp }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      value={positionLevel}
                      placeholder="--- Please select ---"
                      onChange={(e: any) => {
                        field.onChange(e.value);
                        setPositionLevel(e.value);
                      }}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                      disabled={!dtp}
                      optionLabel={
                        userData.employeeData.Lang === "EN"
                          ? "NameEn"
                          : "NameTh"
                      }
                      filter
                      showClear
                      filterBy={
                        userData.employeeData.Lang === "EN"
                          ? "NameEn"
                          : "NameTh"
                      }
                      options={positionLevelOptions}
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3} sm={3} xl={3}>
                <TextHeaderComponents
                  textHeaderProps={"Approval Matrix"}
                  textSubProps={"ชื่อวงเงินเอกสาร"}
                />
              </Col>
              <Col xs={9} sm={9} xl={9}>
                <Controller
                  name="Approval_MatrixId"
                  control={props.control}
                  defaultValue={approvalMatrixDD}
                  rules={{ required: doa }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      value={approvalMatrixDD}
                      placeholder="--- Please select ---"
                      onChange={(e: any) => {
                        field.onChange(e.value);
                        setApprovalMatrixDD(e.value);
                      }}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                      disabled={!doa}
                      optionLabel={
                        userData.employeeData.Lang === "EN"
                          ? "NameEn"
                          : "NameTh"
                      }
                      filter
                      showClear
                      filterBy={
                        userData.employeeData.Lang === "EN"
                          ? "NameEn"
                          : "NameTh"
                      }
                      options={matrixOptions}
                    />
                  )}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {spc && (
            <>
              <Col xs={2} sm={2} xl={2}></Col>
              <Col xs={2} sm={2} xl={2}>
                <ButtonComponents
                  setStyleProps={{
                    width: "150px",
                    borderRadius: "6px",
                    boxShadow: "none",
                    border: "1px solid #282f6a",
                    fontSize: "13px",
                    paddingLeft: "16px",
                  }}
                  onClickProps={() => {
                    setLoadingSelectData(true);
                    callSelectUserDialog("Employee");
                    setDialogVisible(!dialogVisible);
                  }}
                  typeProps={"button"}
                  setLabelProps={"Add User"}
                  setIconProps={<FiPlus />}
                  setClassNameProps={"p-button-text-position"}
                />
              </Col>
              <Col xs={2} sm={2} xl={2}>
                <ButtonComponents
                  setStyleProps={{
                    width: "150px",
                    borderRadius: "6px",
                    boxShadow: "none",
                    border: "1px solid #282f6a",
                    fontSize: "13px",
                    paddingLeft: "16px",
                  }}
                  onClickProps={() => {
                    setLoadingSelectData(true);
                    callSelectRoleDialog("Roles");
                    setDialogVisible(!dialogVisible);
                  }}
                  typeProps={"button"}
                  setLabelProps={"Add Role"}
                  setIconProps={<FiPlus />}
                  setClassNameProps={"p-button-text-position"}
                />
              </Col>
              <Col xs={2} sm={2} xl={2}>
                <ButtonComponents
                  setStyleProps={{
                    width: "150px",
                    borderRadius: "6px",
                    boxShadow: "none",
                    border: "1px solid #282f6a",
                    fontSize: "13px",
                    paddingLeft: "16px",
                  }}
                  onClickProps={() => {
                    updateChanges(undefined, "requestor");
                  }}
                  typeProps={"button"}
                  setLabelProps={"Add Requestor"}
                  setIconProps={<FiPlus />}
                  setClassNameProps={"p-button-text-position"}
                />
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col xs={4} sm={2} xl={2}>
            <TextHeaderComponents textHeaderProps={" "} textSubProps={" "} />
          </Col>
          <Col xs={10} md={10} lg={10} xl={10}>
            {spc && (
              <Row>
                <Col
                  xs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  onClick={() => {
                    console.log("matrix=>", specficApprovals);
                  }}
                >
                  <Controller
                    name="specific_Approver"
                    control={props.control}
                    defaultValue={specficApprovals}
                    rules={{ required: spc }}
                    render={({ field, fieldState }) => (
                      <DataTable
                        id={field.name}
                        {...field}
                        value={specficApprovals}
                        onRowReorder={(e: any) => {
                          field.onChange(e.value);
                          setSpecficApprovals([...e.value]);
                        }}
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                        responsiveLayout="scroll"
                      >
                        <Column
                          rowReorder
                          bodyClassName="approveMatrix-table"
                          header={
                            <TextHeaderComponents
                              textHeaderProps={"Up/Down"}
                              textSubProps={"ปรับลำดับ"}
                            />
                          }
                        ></Column>
                        <Column
                          field="Seq"
                          bodyClassName="approveMatrix-table"
                          header={
                            <TextHeaderComponents
                              textHeaderProps={"Sequence"}
                              textSubProps={"ลำดับ"}
                            />
                          }
                          // body={(rowData, options) => options.rowIndex + 1}
                        ></Column>
                        <Column
                          field="EmployeeName"
                          bodyClassName="approveMatrix-table"
                          header={
                            <TextHeaderComponents
                              textHeaderProps={"Name - Surname / Role Name"}
                              textSubProps={"ชื่อ - สกุล / ชื่อกลุ่ม"}
                            />
                          }
                        ></Column>
                        <Column
                          field="Position"
                          bodyClassName="approveMatrix-table"
                          header={
                            <TextHeaderComponents
                              textHeaderProps={"Position / Role Description"}
                              textSubProps={"ตำแหน่ง / รายละเอียดของกลุ่ม"}
                            />
                          }
                          // body={statusBodyTemplate}
                        ></Column>
                        <Column
                          field="Signature_Wording"
                          bodyClassName="approveMatrix-table"
                          header={
                            <TextHeaderComponents
                              textHeaderProps={"Signature Wording"}
                              textSubProps={"คำลงท้าย"}
                            />
                          }
                          body={statusBodyTemplate}
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
                                    specficApprovals,
                                    setSpecficApprovals,
                                    options.rowIndex
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
                  {props.getFormErrorMessage("specific_Approver")}
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Dialog
          visible={dialogVisible}
          breakpoints={{ "960px": "75vw" }}
          style={{ width: "70vw" }}
          modal
          header={dialogTitle}
          className="p-fluid "
          onHide={() => {
            setDialogVisible(false);
          }}
          blockScroll
          draggable={false}
        >
          {!loadingSelectData && dialogBody}
        </Dialog>
      </div>
    </>
  );
}
