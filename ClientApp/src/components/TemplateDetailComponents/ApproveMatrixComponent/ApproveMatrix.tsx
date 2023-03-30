import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FiCopy, FiPlus } from "react-icons/fi";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { DropdownComponents } from "../../DropdownComponents/DropdownComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import binIcon from "../../../assets/bin-icon.png";
import editIcon from "../../../assets/edit-icon.png";
import "../ApproveMatrixComponent/ApproveMatrix.css";
import { Dialog } from "primereact/dialog";
import SelectCondition from "./SelectCondition";
import { useForm } from "react-hook-form";
import { IoCloseOutline, IoSaveOutline } from "react-icons/io5";
import { confirmDialog } from "primereact/confirmdialog";
import AddMatrixCondition from "./AddMatrixCondition";
import moment from "moment";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { Toast } from "primereact/toast";
import { BiCopyAlt } from "react-icons/bi";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiFileCopy2Line } from "react-icons/ri";
import useAlert from "../../../hooks/useAlert";

interface Props {
  setAdvanceForm: any;
  advanceForm: any;
  controlModel: any;
  setControlModel: any;
  positionList: any;
  matrixList: any;
  signatureList: any;
}

interface TemApprove {
  MaxLevelId?: any;
  ApprovalMatrixId?: any;
  ApproveType: number;
  Conditions: any;
}

export default function ApproveMatrix(props: any) {
  const { toggleAlert } = useAlert();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [redundant_Approver, setRedundant_Approver] = useState<any[]>([]);
  const [auto_Approve, setAuto_Approve] = useState<any>();
  const [allApprovals, setAllApprovals] = useState<any[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<any[]>([]);
  const [templateLogics, setTemplateLogics] = useState<any[]>([]);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogBody, setDialogBody] = useState<any>();
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [dialogMode, setDialogMode] = useState<string>("");
  const toast = useRef<any>(null);
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

  const labelStyle: any = {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "13px",
    lineHeight: "19px",
    marginLeft: "5px",
    color: "#000000",
  };

  const updateChanges = (data: any) => {
    let allSelected = allApprovals;
    let approveType = -1;

    if (
      data.Line_of_Command ||
      data.Direct_to_Position ||
      data.Design_of_Authority ||
      data.Specific_Approver
    ) {
      if (data.Seq > 0) {
        allSelected.map((approval: any) => {
          if (approval.Seq === data.Seq) {
            approval.Conditions = {};
            if (data.Conditions.length > 0) {
              approval.Conditions.Conditions = data.Conditions;
            } else {
              approval.Conditions = null;
            }

            if (data.Line_of_Command) {
              approval.MaxLevelId = data.MaxLevelId.PositionLevelId;
              approval.MaxLevelName =
                userData.employeeData === "EN"
                  ? data.MaxLevelId.NameEn
                  : data.MaxLevelId.NameTh;
            } else if (data.Direct_to_Position) {
              approval.MaxLevelId = data.PositionLevelId.PositionLevelId;
              approval.MaxLevelName =
                userData.employeeData === "EN"
                  ? data.PositionLevelId.NameEn
                  : data.PositionLevelId.NameTh;
            } else if (data.Design_of_Authority) {
              approval.MaxLevelId = data.Approval_MatrixId.ApproveMatrixId;
              approval.MaxLevelName =
                userData.employeeData === "EN"
                  ? data.Approval_MatrixId.NameEn
                  : data.Approval_MatrixId.NameTh;
            } else if (data.Specific_Approver) {
              approval.Specific_Approver = data.specific_Approver;
            }
          }
        });

        setAllApprovals([...allSelected]);
        toggleDialog();
        reset();
      } else {
        if (data.Line_of_Command) {
          approveType = 19;
          const approval: any = {
            Seq: allSelected.length + 1,
            MaxLevelId: data.MaxLevelId.PositionLevelId,
            MaxLevelName:
              userData.employeeData === "EN"
                ? data.MaxLevelId.NameEn
                : data.MaxLevelId.NameTh,
            ApproveType: approveType,
            Conditions:
              data.Conditions.length > 0
                ? { Conditions: data.Conditions }
                : null,
            Type: "Line of Command",
          };
          allSelected.push(approval);
          setAllApprovals([...allSelected]);
          toggleDialog();
          reset();
        }
        if (data.Direct_to_Position) {
          approveType = 22;
          const approval: any = {
            Seq: allSelected.length + 1,
            MaxLevelId: data.PositionLevelId.PositionLevelId,
            MaxLevelName:
              userData.employeeData === "EN"
                ? data.PositionLevelId.NameEn
                : data.PositionLevelId.NameTh,
            ApproveType: approveType,
            Conditions:
              data.Conditions.length > 0
                ? { Conditions: data.Conditions }
                : null,
            Type: "Direct to Position",
          };
          allSelected.push(approval);
          setAllApprovals([...allSelected]);
          toggleDialog();
          reset();
        }
        if (data.Design_of_Authority) {
          approveType = 21;
          const approval: any = {
            Seq: allSelected.length + 1,
            MaxLevelId: data.Approval_MatrixId.ApproveMatrixId,
            MaxLevelName:
              userData.employeeData === "EN"
                ? data.Approval_MatrixId.NameEn
                : data.Approval_MatrixId.NameTh,
            ApproveType: approveType,
            Conditions:
              data.Conditions.length > 0
                ? { Conditions: data.Conditions }
                : null,
            Type: "Design of Authority",
          };
          allSelected.push(approval);
          setAllApprovals([...allSelected]);
          toggleDialog();
          reset();
        }
        if (data.Specific_Approver) {
          console.log("matrix=>data", data);

          approveType = 20;
          const approval: any = {
            Seq: allSelected.length + 1,
            Specific_Approver: data.specific_Approver,
            ApproveType: approveType,
            Conditions:
              data.Conditions.length > 0
                ? { Conditions: data.Conditions }
                : null,
            Type: "Specific Approver",
            IsParallel: data.spc_isParallel,
            IsApproveAll: data.spc_isApproveAll === "all",
            ApproveSlot:
              data.spc_isApproveAll === "slot" ? data.approverSlot : null,
          };

          allSelected.push(approval);
          console.log("matrix=>", allSelected);

          setAllApprovals([...allSelected]);
          toggleDialog();
          reset();
        }
      }
    } else {
      toggleAlert({
        description: `Type of Approval is reqiure`,
        message: `Require field warning.`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Type of Approval is reqiure",
      //   life: 3000,
      // });
    }
  };

  function toggleDialog() {
    setDialogVisible(!dialogVisible);
  }

  const getFormErrorMessage = (name: any) => {
    if (name === "specific_Approver") {
    } else {
      return (
        errors[name] && (
          <small className="p-error">{errors[name].message}</small>
        )
      );
    }
  };

  function callAddMatrixForm() {
    setDialogBody(
      <AddMatrixCondition
        advanceForm={props.advanceForm}
        control={control}
        getFormErrorMessage={getFormErrorMessage}
        controlModel={props.controlModel}
        setControlModel={props.setControlModel}
        allApproveLength={allApprovals.length}
        positionList={props.positionList}
        matrixList={props.matrixList}
        signatureList={props.signatureList}
      />
    );
  }

  const onRedundantChange = (e: any) => {
    let selected: any = [...redundant_Approver];

    if (e.checked) {
      selected.push(e.value);
    } else {
      selected.splice(selected.indexOf(e.value), 1);
    }

    setRedundant_Approver(selected);
  };

  useEffect(() => {
    props.setControlModel((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...prevState.templateForm,
        AutoApprove:
          redundant_Approver.indexOf("Auto Approve By System") !== -1,
        ApproverCanEdit:
          redundant_Approver.indexOf("Approver Can Edit Document") !== -1,
        IsCheckAccess:
          redundant_Approver.indexOf("Approver can check access document") !==
          -1,
      },
    }));
  }, [redundant_Approver]);

  const onDeleteRow = (rowData: any, rowIdx: number) => {
    let selected: any = [...allApprovals];
    let newSpcApprovals: any[] = [];
    confirmDialog({
      message: "Do you to delete this row.",
      header: "Delete Confirmation",
      icon: "p-confirm-dialog-icon pi pi-info-circle",
      className: "matrix-confirmDialog",
      acceptClassName:
        "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
      accept: () => {
        selected.splice(rowIdx, 1);
        selected.map((e: any, idx: number) => {
          e.Seq = idx + 1;
          if (e.Specific_Approver !== undefined) {
            e.Specific_Approver.map((spc: any) => {
              spc.TemLineId = e.TemLineId !== undefined ? e.TemLineId : e.Seq;
              newSpcApprovals.push(spc);
            });
          }
        });
        setAllApprovals([...selected]);
        props.setControlModel((prevState: any) => ({
          ...prevState,
          specificApprovers: newSpcApprovals,
        }));
      },
    });
  };

  useEffect(() => {
    let TemLineApprove: any[] = [];
    let spc_approval: any[] = [];
    let conditions: any[] = [];
    let logic: any[] = [];
    let TemplateLogic: any[] = [];

    allApprovals.map((approval: any, index: number) => {
      let LstCondition: any[] = [];
      console.log("matrix=>approval", approval);
      if (
        approval.Conditions !== undefined &&
        approval.Conditions !== null &&
        approval.Conditions !== ""
      ) {
        if (
          approval.Conditions.Conditions !== undefined &&
          approval.Conditions.Conditions !== null
        ) {
          if (approval.Conditions.Conditions.length > 0) {
            approval.Conditions.Conditions.map((con: any, index: number) => {
              const _con = {
                Column: con.field,
                Value: con.value,
                Seq: index + 1,
                TemLineId: "",
                action: con.action,
                Tem_LineId: index + 1,
              };
              conditions.push(_con);
              LstCondition.push(_con);
            });
          } else {
            approval.Conditions = null;
          }
        }
      }
      if (approval.ApproveType === 21) {
        const _approval = {
          TemLineId: approval.TemLineId,
          Seq: index + 1,
          MaxLevelId: null,
          ApprovalMatrixId: approval.MaxLevelId,
          CompanyCode: null,
          ApproveType: approval.ApproveType,
          Conditions:
            approval.Conditions !== null
              ? JSON.stringify(approval.Conditions)
              : null,
          LstCondition: LstCondition,
          CreatedDate: moment(new Date()).format("DD MMM YYYY"),
          CreatedBy: userData.employeeData.EmployeeId.toString(),
          ModifiedDate: moment(new Date()).format("DD MMM YYYY"),
          ModifiedBy: userData.employeeData.EmployeeId.toString(),
          IsActive: true,
        };
        TemLineApprove.push(_approval);
      } else {
        if (approval.ApproveType === 20) {
          approval.Specific_Approver.map((e: any, eIdx: number) => {
            e.Seq = eIdx + 1;
            spc_approval.push(e);
          });
        }
        const _approval = {
          TemLineId: approval.TemLineId,
          Seq: index + 1,
          MaxLevelId: approval.MaxLevelId,
          ApprovalMatrixId: null,
          CompanyCode: null,
          ApproveType: approval.ApproveType,
          Conditions:
            approval.Conditions !== null
              ? JSON.stringify(approval.Conditions)
              : null,
          LstCondition: LstCondition,
          CreatedDate: moment(new Date()).format("DD MMM YYYY"),
          CreatedBy: userData.employeeData.EmployeeId.toString(),
          ModifiedDate: moment(new Date()).format("DD MMM YYYY"),
          ModifiedBy: userData.employeeData.EmployeeId.toString(),
          IsActive: true,
          IsParallel: approval.IsParallel,
          IsApproveAll: approval.IsApproveAll,
          ApproveSlot: approval.ApproveSlot,
        };
        TemLineApprove.push(_approval);
      }
    });

    let logicControl: any[] = [];
    conditions.map((cons: any) => {
      if (
        logicControl.filter((e: any) => e.label === cons.Column).length === 0
      ) {
        logicControl.push({
          field: "",
          label: cons.Column,
          action: cons.action,
        });
      }
    });

    logicControl.map((con: any) => {
      logic.push(
        JSON.stringify({
          label: con.label,
          methodtype: "ApprovalMatrix",
          InsertType: "Last",
          amountstatus: "false",
          Conditions: logicControl,
        })
      );
    });

    logic.map((logic: any, idx: number) => {
      TemplateLogic.push({
        Seq: idx + 1,
        Logictype: "datalineapprove",
        Jsonvalue: logic,
        LstCondition: conditions,
      });
    });

    setTemplateLogics([...TemplateLogic]);
    props.setControlModel((prevState: any) => ({
      ...prevState,
      TemLineApprove: [...TemLineApprove],
      specificApprovers: [...spc_approval],
      cMSTTemplateLogic: [...TemplateLogic],
    }));
  }, [allApprovals]);

  useEffect(() => {
    let selected: any = [...redundant_Approver];

    if (props.controlModel.templateForm.AutoApprove) {
      selected.push("Auto Approve By System");
    }
    if (props.controlModel.templateForm.ApproverCanEdit) {
      selected.push("Approver Can Edit Document");
    }
    if (props.controlModel.templateForm.IsCheckAccess) {
      selected.push("Approver can check access document");
    }
    console.log("table=>6666666666666666");

    setAllApprovalsForControl();
    setAuto_Approve(props.controlModel.templateForm.AutoApproveWhen);
    setRedundant_Approver(selected);
  }, []);

  function setAllApprovalsForControl() {
    try {
      let temp: any = props.controlModel.TemLineApprove;

      let spcApprove: any = props.controlModel.specificApprovers;

      let approvals: any = [];
      temp.map((tem: any, idx: number) => {
        let _con = "";
        if (tem.Conditions !== "") {
          _con = JSON.parse(tem.Conditions);
        }
        if (tem.ApproveType === 20) {
          let spcApproves: any = [];
          spcApprove.map((e: any) => {
            if (idx === e.TemLineId) {
              spcApproves.push(e);
            } else if (tem.TemLineId === e.TemLineId) {
              spcApproves.push(e);
            }
          });
          const approval: any = {
            TemLineId: tem.TemLineId,
            Seq: tem.Seq,
            Specific_Approver: spcApproves,
            ApproveType: tem.ApproveType,
            Conditions: _con,
            Type: "Specific Approver",
          };
          approvals.push(approval);
        } else if (tem.ApproveType === 21) {
          let type = GetApproveType(tem.ApproveType);
          let maxLevelName = GetMatrixData(tem.ApprovalMatrixId);
          let approval: any = {
            TemLineId: tem.TemLineId,
            Seq: tem.Seq,
            MaxLevelId: tem.ApprovalMatrixId,
            MaxLevelName: maxLevelName,
            ApproveType: tem.ApproveType,
            Conditions: _con,
            Type: type,
          };
          approvals.push(approval);
        } else {
          let type = GetApproveType(tem.ApproveType);
          let maxLevelName = GetMaxLevelName(tem.MaxLevelId);
          let approval: any = {
            TemLineId: tem.TemLineId,
            Seq: tem.Seq,
            MaxLevelId: tem.MaxLevelId,
            MaxLevelName: maxLevelName,
            ApproveType: tem.ApproveType,
            Conditions: _con,
            Type: type,
          };
          approvals.push(approval);
        }
      });
      setAllApprovals([...approvals]);
    } catch (error) {
      console.log("Matrix=>", error);
    }
  }

  useEffect(() => {
    props.setControlModel((prevState: any) => ({
      ...prevState,
      templateForm: {
        ...prevState.templateForm,
        AutoApproveWhen: auto_Approve,
      },
    }));
  }, [auto_Approve]);

  function GetMatrixData(matrixId: number) {
    let name: string = "";
    const matrixes = props.matrixList;

    matrixes.map((e: any) => {
      if (e.ApproveMatrixId === matrixId) {
        if (userData.Leng === "EN") {
          name = e.NameEn;
        } else {
          name = e.NameTh;
        }
      }
    });
    return name;
  }

  function GetMaxLevelName(maxLevelId: number) {
    let name: string = "";
    const positions = props.positionList;
    positions.map((e: any) => {
      if (e.PositionLevelId === maxLevelId) {
        if (userData.Leng === "EN") {
          name = e.NameEn;
        } else {
          name = e.NameTh;
        }
      }
    });
    return name;
  }

  function GetApproveType(ApproveTypeId: number) {
    const approveType = [
      { id: 19, name: "Line of Command" },
      { id: 20, name: "Specific Approver" },
      { id: 21, name: "Design of Authority" },
      { id: 22, name: "Direct to Position" },
    ];
    let name: string = "";
    approveType.map((e: any) => {
      if (e.id === ApproveTypeId) {
        name = e.name;
      }
    });

    return name;
  }

  return (
    <>
      <Toast ref={toast} />
      <Row className="sub-header">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            All Approvals
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div
        className="row-formgroup"
        onClick={() => {
          console.log("matrix=>allApprovals", allApprovals);
        }}
      >
        <Row>
          <Col xs={12} md={12} lg={12} xl={12}>
            <Row>
              <Col xs={12} md={12} lg={12} xl={12}>
                <div className="row-formgroup">
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
                      setDialogMode("Add");
                      setDialogTitle("Approve Matrix");
                      callAddMatrixForm();
                      toggleDialog();
                    }}
                    setLabelProps={"Add Matrix"}
                    setIconProps={<FiPlus />}
                    setClassNameProps={"p-button-text-position"}
                  />
                  <DataTable
                    id="all_Approvals"
                    value={allApprovals}
                    onRowReorder={(e: any) => {
                      e.value.map((approval: any, index: number) => {
                        approval.Seq = index + 1;
                        let appSpcific: any[] = [];
                        if (approval.Specific_Approver !== undefined) {
                          approval.Specific_Approver.map((spc: any) => {
                            spc.TemLineId =
                              approval.TemLineId !== undefined
                                ? approval.TemLineId
                                : index;
                            appSpcific.push(spc);
                          });
                          approval.Specific_Approver = appSpcific;
                        }
                      });

                      setAllApprovals(e.value);
                    }}
                    selection={selectedApprovals}
                    onSelectionChange={(e) => {
                      setSelectedApprovals(e.value);
                    }}
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
                      field="Sequence"
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
                      field="Condition"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Condition"}
                          textSubProps={"เงื่อนไข"}
                        />
                      }
                      body={(rowData: any) => {
                        try {
                          let str = "";

                          if (
                            rowData.Conditions !== null &&
                            rowData.Conditions !== undefined &&
                            rowData.Conditions !== ""
                          ) {
                            rowData?.Conditions?.Conditions?.map(
                              (con: any, index: number) => {
                                if (index === 0) {
                                  str = str + (con.field + ":" + con.value);
                                } else {
                                  str =
                                    str + "," + (con.field + ":" + con.value);
                                }
                              }
                            );
                          }
                          return str;
                        } catch (error) {}
                      }}
                    ></Column>
                    <Column
                      field="Type"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Type of Approval"}
                          textSubProps={"ประเภทการอนุมัติ"}
                        />
                      }
                    ></Column>
                    <Column
                      field="MaxLevelName"
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={
                            "Max Level / Approval Matrix / Specific Approver"
                          }
                          textSubProps={
                            "ลำดับการอนุมัติสูงสุด / ชื่อวงเงินอนุมัติเอกสาร / คนอนุมัติ"
                          }
                        />
                      }
                      body={(rowData: any) => {
                        if (rowData["ApproveType"] === 20) {
                          if (rowData["Specific_Approver"] !== undefined) {
                            let str = "";

                            rowData["Specific_Approver"].map(
                              (approver: any, index: number) => {
                                if (index === 0) {
                                  str = str + approver.EmployeeName;
                                } else {
                                  str = str + "," + approver.EmployeeName;
                                }
                              }
                            );
                            return str;
                          }
                        } else {
                          return rowData.MaxLevelName;
                        }
                      }}
                    ></Column>
                    <Column
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Copy"}
                          textSubProps={"คัดลอก"}
                        />
                      }
                      body={(rowData: any) => (
                        <button
                          className="table-button"
                          onClick={() => {
                            let allSelected = [...allApprovals];
                            if (rowData.ApproveType === 20) {
                              let spc: any[] = [];
                              rowData.Specific_Approver.map((e: any) => {
                                let spc_approval = {
                                  TemLineId: rowData.Seq,
                                  Seq: e.Seq,
                                  EmployeeId: e.EmployeeId,
                                  EmployeeName: e.EmployeeName,
                                  Position: e.Position,
                                  SpecificTypeId: e.SpecificTypeId,
                                  SignatureID: e.SignatureID,
                                  CreatedDate: moment(new Date()).format(
                                    "DD MMM YYYY"
                                  ),
                                  CreatedBy:
                                    userData.employeeData.EmployeeId.toString(),
                                  ModifiedDate: moment(new Date()).format(
                                    "DD MMM YYYY"
                                  ),
                                  ModifiedBy:
                                    userData.employeeData.EmployeeId.toString(),
                                };
                                spc.push(spc_approval);
                              });
                              const approval: any = {
                                Seq: allSelected.length + 1,
                                Specific_Approver: spc,
                                ApproveType: rowData.ApproveType,
                                Conditions: rowData.Conditions,
                                Type: rowData.Type,
                              };
                              allSelected.push(approval);
                              setAllApprovals([...allSelected]);
                            } else {
                              const approval: any = {
                                Seq: allSelected.length + 1,
                                MaxLevelId: rowData.MaxLevelId,
                                MaxLevelName: rowData.MaxLevelName,
                                ApproveType: rowData.ApproveType,
                                Conditions: rowData.Conditions,
                                Type: rowData.Type,
                              };
                              allSelected.push(approval);
                              setAllApprovals([...allSelected]);
                            }
                          }}
                        >
                          <RiFileCopy2Line fontSize={20} />
                        </button>
                      )}
                    ></Column>
                    <Column
                      bodyClassName="approveMatrix-table"
                      header={
                        <TextHeaderComponents
                          textHeaderProps={"Edit"}
                          textSubProps={"แก้ไข"}
                        />
                      }
                      body={(rowData: any) => (
                        <button
                          className="table-button"
                          onClick={() => {
                            setDialogMode("Edit");
                            setDialogBody(
                              <AddMatrixCondition
                                advanceForm={props.advanceForm}
                                control={control}
                                getFormErrorMessage={getFormErrorMessage}
                                controlModel={props.controlModel}
                                setControlModel={props.setControlModel}
                                rowData={rowData}
                                allApproveLength={allApprovals.length}
                                positionList={props.positionList}
                                matrixList={props.matrixList}
                                signatureList={props.signatureList}
                              />
                            );
                            toggleDialog();
                          }}
                        >
                          <img src={editIcon} alt="logo" />
                        </button>
                      )}
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
                            onClick={() => {
                              onDeleteRow(rowData, options.rowIndex);
                            }}
                          >
                            <img src={binIcon} alt="logo" />
                          </button>
                        );
                      }}
                    ></Column>
                  </DataTable>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row className="sub-header">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p
            className="Col-text-header-Inform"
            style={{ fontWeight: 500, color: "#262A2D" }}
          >
            Redundant Approval Condition
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="informationComponents-line-border"></p>
        </Col>
      </Row>
      <div className="row-formgroup">
        <Row>
          <Col xs={2} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Redundant Approver:"}
              textSubProps={"ในกรณีที่ผู้อนุมัติซ้ำ:"}
            />
          </Col>

          <Col xs={3} sm={3} xl={3}>
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Checkbox
                  inputId="redundant_1"
                  checked={
                    redundant_Approver.indexOf("Auto Approve By System") !== -1
                  }
                  value="Auto Approve By System"
                  name="redundant_1"
                  onChange={onRedundantChange}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Auto Approve By System
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    ให้ระบบอนุมัติให้โดยอัตโนมัติ
                  </label>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={3} sm={3} xl={3}>
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Checkbox
                  inputId="redundant_2"
                  checked={
                    redundant_Approver.indexOf("Approver Can Edit Document") !==
                    -1
                  }
                  value="Approver Can Edit Document"
                  name="redundant_2"
                  onChange={onRedundantChange}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Approver Can Edit Document
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    ผู้อนุมัติสามารถแก้ไขข้อมูลได้
                  </label>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={4} sm={4} xl={4}>
            <Row>
              <Col xs={1} sm={1} xl={1}>
                <Checkbox
                  inputId="redundant_3"
                  checked={
                    redundant_Approver.indexOf(
                      "Approver can check access document"
                    ) !== -1
                  }
                  value="Approver can check access document"
                  name="redundant_3"
                  onChange={onRedundantChange}
                />
              </Col>
              <Col xs={10} sm={10} xl={10}>
                <div className="checkbox-lavel">
                  <label style={labelStyle} htmlFor="binary">
                    Approver can check access document
                  </label>
                  <label
                    className="approveMatrix-label"
                    style={labelStyle}
                    htmlFor="binary"
                  >
                    ผู้อนุมัติสามารถจองข้อมูลที่แก้ไขข้อมูลได้
                  </label>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        {redundant_Approver.indexOf("Auto Approve By System") !== -1 && (
          <Row>
            <Col xs={2} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Auto Approve:"}
                textSubProps={"รูปแบบการอนุมัติโดยระบบ:"}
              />
            </Col>
            <Col xs={3} sm={3} xl={3} className="row-radiobutton">
              <Row>
                <Col xs={1} sm={1} xl={1}>
                  <RadioButton
                    inputId="autoType1"
                    name="autoType1"
                    value="F"
                    onChange={(e) => setAuto_Approve(e.value)}
                    checked={auto_Approve === "F"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <div className="checkbox-lavel">
                    <label style={labelStyle} htmlFor="binary">
                      First Step Approve
                    </label>
                    <label
                      className="approveMatrix-label"
                      style={labelStyle}
                      htmlFor="binary"
                    >
                      อนุมัติเฉพาะขั้นแรก
                    </label>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={1} sm={1} xl={1}>
                  <RadioButton
                    inputId="autoType2"
                    name="autoType2"
                    value="L"
                    onChange={(e) => setAuto_Approve(e.value)}
                    checked={auto_Approve === "L"}
                  />
                </Col>
                <Col xs={10} sm={10} xl={10}>
                  <div className="checkbox-lavel">
                    <label style={labelStyle} htmlFor="binary">
                      Last Step Approve
                    </label>
                    <label
                      className="approveMatrix-label"
                      style={labelStyle}
                      htmlFor="binary"
                    >
                      อนุมัติเฉพาะขั้นสุดท้าย
                    </label>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
      <Dialog
        visible={dialogVisible}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "70vw" }}
        header={dialogTitle}
        className="p-fluid"
        onHide={() => {
          reset();
          setDialogVisible(false);
        }}
        blockScroll
        draggable={false}
      >
        <form
          id="1"
          onSubmit={handleSubmit(updateChanges)}
          className="p-fluid row-formgroup"
        >
          {dialogBody}
          <div className="footer-dialog">
            <ButtonComponents
              setLabelProps="Cancel"
              setIconProps={
                <IoCloseOutline size={"16px"} style={{ marginRight: "3px" }} />
              }
              onClickProps={() => {
                reset();
                setDialogVisible(false);
              }}
              typeProps={"button"}
              setClassNameProps="p-button-text referenceDocumentDialog-button"
              setStyleProps={{
                width: "100px",
                border: "0.5px solid #FF2626",
                background: "#FFFFFF",
                color: "#FF2626",
                borderRadius: "6px",
                fontSize: "13px",
              }}
            />
            <ButtonComponents
              setStyleProps={{
                width: "100px",
                borderRadius: "6px",
                boxShadow: "none",
                border: "1px solid #282f6a",
                fontSize: "13px",
                paddingLeft: "16px",
              }}
              typeProps={"submit"}
              setLabelProps={"Save"}
              setIconProps={<IoSaveOutline />}
              setClassNameProps={"p-button-text-position"}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
