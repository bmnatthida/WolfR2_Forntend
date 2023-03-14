import React, { useState, useEffect, FC } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./LineApprovalsComponent.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { IListApprovalDetailsModel } from "../../../IRequestModel/IListApprovalDetailsModel";
import { IApproverModel } from "../../../IRequestModel/IApproverModel";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { Row } from "react-bootstrap";
import { InputNumber } from "primereact/inputnumber";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";
import { useUserContext } from "../../../Context/UserContext";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import useAlert from "../../../hooks/useAlert";

type Props = {
  lineApproval: any;
  setLineApproval: any;
  employeeList: any;
  signatureList: any[];
  canEditLineApproval: boolean;
  currentLevel: number;
  t: any;
};

const LineApprovalsComponentFix: FC<Props> = ({
  lineApproval,
  employeeList,
  signatureList,
  canEditLineApproval,
  setLineApproval,
  currentLevel,
  t,
}) => {
  //PageSetting
  const [userData, setUserData] = useUserContext();
  const [visibleConfirmProp, setVisibleConfirmProp] = useState(false);
  const { lg } = useBreakpoint();
  const [rowDeleted, setRowDeleted] = useState<any>();
  const [fromIndex, setFromIndex] = useState(1);
  const [moveToNumber, setMoveToNumber] = useState(1);
  const [moveToDialogVisible, setMoveToDialogVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [searchData, setSearchData] = useState<any[]>(employeeList);
  const { toggleAlert } = useAlert();

  const confirmDialogfunction = (rowDeleted: any) => {
    setVisibleConfirmProp(true);
    setRowDeleted(rowDeleted);
  };

  function rowDelete(rowIndex: any) {
    let data = lineApproval;
    data.splice(rowIndex, 1);
    let reoderSequence = data.map((e: any, i: number) => {
      e.sequence = i + 1;
      return e;
    });
    setLineApproval([...reoderSequence]);
  }

  const actionBodyTemplate = (rowData: any, options: any) => {
    if (canEditLineApproval && currentLevel < rowData.sequence) {
      return (
        <React.Fragment>
          <ButtonComponents
            setIconProps={"pi pi-trash"}
            setClassNameProps={
              " p-button-danger p-mr-2 set-icon-LineApprovalsComponent"
            }
            onClickProps={() => confirmDialogfunction(options.rowIndex)}
          />
        </React.Fragment>
      );
    }
  };

  function toggleModal() {
    setDialogVisible(!isDialogVisible);
  }

  const onRowReorder = (e: any) => {
    if (currentLevel !== 0) {
      if (e.dropIndex > currentLevel) {
        for (let i = 0; i < e.value.length; i++) {
          let a = 1;
          a = a + i;
          e.value[i].sequence = a;
        }
        setLineApproval(e.value);
      } else {
        console.log("line=>e", e, currentLevel);
        toggleAlert({
          description: `Cannot reorder to lower step.`,
          message: `Reorder`,
          type: "warning",
        });
      }
    } else {
      for (let i = 0; i < e.value.length; i++) {
        let a = 1;
        a = a + i;
        e.value[i].sequence = a;
      }
      setLineApproval(e.value);
    }
  };

  const onRowSelect = (event: any) => {
    addData(event.data);
  };

  function addData(empData: any) {
    try {
      const raw = lineApproval;
      const lastData = lineApproval[lineApproval.length - 1];
      let data: IApproverModel = empData;
      const defSignature = signatureList[0];

      if (lastData != undefined) {
        let newData: IListApprovalDetailsModel = {
          approver: data,
          emp_id: data.EmployeeId,
          lineid: lastData.lineid + 1,
          sequence: lastData.sequence + 1,
          signature_en: defSignature.Value2,
          signature_id: defSignature.MasterId,
          signature_th: defSignature.Value1,
        };
        raw.push(newData);
      } else {
        let newData: IListApprovalDetailsModel = {
          approver: data,
          emp_id: data.EmployeeId,
          lineid: 1,
          sequence: 1,
          signature_en: defSignature.Value2,
          signature_id: defSignature.MasterId,
          signature_th: defSignature.Value1,
        };
        raw.push(newData);
      }

      setLineApproval([...raw]);
      setDialogVisible(!isDialogVisible);
    } catch (error) {
      console.log("LineApproval=>addData=>error", error);
    }
  }

  const statusBodyTemplate = (rowData: any, option: any) => {
    if (canEditLineApproval && currentLevel < rowData.sequence) {
      console.log("line=>rowData", rowData);

      return (
        <Dropdown
          className="dropdown-lineapprove"
          value={
            signatureList.filter((e: any) => {
              if (e.MasterId === rowData.signature_id) {
                return e;
              }
            })[0]
          }
          options={signatureList}
          onChange={(e) => onSelected_Sinatures(e, option.rowIndex)}
          optionLabel={userData.Lang === "EN" ? "Value2" : "Value1"}
          placeholder="Select a Signature"
        />
      );
    } else {
      return (
        <div className="status-badge">
          <span>
            {userData.Lang === "EN"
              ? rowData.signature_en
              : rowData.signature_th}
          </span>
        </div>
      );
    }
  };

  function onSelected_Sinatures(event: any, rowInx: number) {
    let line: any = lineApproval;
    line[rowInx].signature_id = event.value.MasterId;
    line[rowInx].signature_th = event.value.Value1;
    line[rowInx].signature_en = event.value.Value2;
    setLineApproval([...line]);
  }

  const dynamicTable = (
    <DataTable
      className="wolf-table"
      value={lineApproval}
      onRowReorder={onRowReorder}
      dataKey="id"
      stripedRows
      scrollable
      scrollDirection="both"
      responsiveLayout="scroll"
    >
      {canEditLineApproval && (
        <Column
          rowReorder={lg ? true : false}
          body={(rowData: any, options: any) => {
            if (currentLevel < rowData.sequence) {
              return (
                <ButtonComponents
                  setIconProps={"pi pi-sort-alt"}
                  setClassNameProps={
                    "p-button-info p-mr-2 set-icon-LineApprovalsComponent"
                  }
                  onClickProps={() => {
                    setFromIndex(options.rowIndex);
                    setMoveToDialogVisible(true);
                  }}
                />
              );
            }
          }}
          style={{ flexGrow: 0, flexBasis: "50px" }}
        />
      )}
      {canEditLineApproval && (
        <Column
          header="#"
          body={(lineData, options) => options.rowIndex + 1}
          style={{ flexGrow: 0, flexBasis: "50px" }}
        />
      )}

      <Column
        key={userData.Lang === "EN" ? "approver.NameEn" : "approver.NameTh"}
        columnKey={
          userData.Lang === "EN" ? "approver.NameEn" : "approver.NameTh"
        }
        field={userData.Lang === "EN" ? "approver.NameEn" : "approver.NameTh"}
        header={
          <>
            <p className="row headtext">Employee Name</p>
            <p className="row subtext">ชื่อพนักงาน</p>
          </>
        }
        style={{ flexGrow: 1, flexBasis: "150px" }}
      />

      <Column
        key={
          userData.Lang === "EN"
            ? "approver.PositionNameEn"
            : "approver.PositionNameTh"
        }
        columnKey={
          userData.Lang === "EN"
            ? "approver.PositionNameEn"
            : "approver.PositionNameTh"
        }
        field={
          userData.Lang === "EN"
            ? "approver.PositionNameEn"
            : "approver.PositionNameTh"
        }
        header={
          <>
            <p className="row headtext">Position</p>
            <p className="row subtext">ตำแหน่ง</p>
          </>
        }
        style={{ flexGrow: 1, flexBasis: "150px" }}
      />

      <Column
        key={
          userData.Lang === "EN"
            ? "approver.DepartmentNameEn"
            : "approver.DepartmentNameTh"
        }
        columnKey={
          userData.Lang === "EN"
            ? "approver.DepartmentNameEn"
            : "approver.DepartmentNameTh"
        }
        field={
          userData.Lang === "EN"
            ? "approver.DepartmentNameEn"
            : "approver.DepartmentNameTh"
        }
        header={
          <>
            <p className="row headtext">Department</p>
            <p className="row subtext">หน่วยงาน</p>
          </>
        }
        style={{ flexGrow: 1, flexBasis: "150px" }}
      />

      <Column
        key={userData.Lang === "EN" ? "signature_en" : "signature_th"}
        columnKey={userData.Lang === "EN" ? "signature_en" : "signature_th"}
        field={userData.Lang === "EN" ? "signature_en" : "signature_th"}
        header={
          <>
            <p className="row headtext">Signature </p>
            <p className="row subtext">คำลงท้าย</p>
          </>
        }
        body={statusBodyTemplate}
        style={{ flexGrow: 1, flexBasis: "50px" }}
      />

      {canEditLineApproval && (
        <Column
          header={
            <>
              <p className="row headtext">Delete </p>
              <p className="row subtext">ลบ</p>
            </>
          }
          body={actionBodyTemplate}
          exportable={false}
        ></Column>
      )}
    </DataTable>
  );

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setMoveToDialogVisible(false)}
          style={{ height: "38px" }}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => acceptMoveto(fromIndex, moveToNumber)}
          style={{ height: "38px" }}
          autoFocus
        />
      </div>
    );
  };

  const acceptMoveto = (fromIndex: number, targetIndex: number) => {
    if (targetIndex > currentLevel) {
      moveItem(fromIndex, targetIndex - 1);
    } else {
      toggleAlert({
        description: `Cannot reorder to lower step.`,
        message: `Reorder`,
        type: "error",
      });
    }
  };

  const moveItem = (fromIndex: number, targetIndex: number) => {
    try {
      let rows = lineApproval !== null ? [...lineApproval] : [];
      let updateRow = rows[fromIndex];
      rows[fromIndex] = rows[targetIndex];
      rows[targetIndex] = updateRow;
      for (let i = 0; i < rows.length; i++) {
        let a = 1;
        a = a + i;
        rows[i].sequence = a;
      }
      setLineApproval([...rows]);
      setMoveToDialogVisible(false);
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  return (
    <div>
      <ConfirmDialog
        visible={visibleConfirmProp}
        onHide={() => setVisibleConfirmProp(false)}
        message={"Do you want to delete this row?"}
        header="Confirmation"
        icon="pi pi-info-circle"
        className="z-index-confirm"
        acceptClassName="p-button-danger table-control-confirm-button p-button-accept-cancel"
        rejectClassName="p-button p-component p-confirm-dialog-reject p-button p-component p-button-outlined p-button-danger"
        position="top"
        accept={() => rowDelete(rowDeleted)}
        draggable={false}
      />
      {canEditLineApproval && (
        <>
          <ButtonComponents
            setIconProps={"pi pi-plus"}
            setLabelProps={t("Add")}
            setStyleProps={{
              marginBottom: "10px",
              borderRadius: "6px",
              height: "40px",
              backgroundColor: "rgb(40, 47, 106)",
              border: "1px solid rgb(40, 47, 106)",
            }}
            // disabledProps={
            //   locationPathName === "/PreviewTemplate" ? true : false
            // }
            onClickProps={() => toggleModal()}
          />
        </>
      )}{" "}
      {dynamicTable}
      <Dialog
        header="Move To"
        visible={moveToDialogVisible}
        style={{ borderRadius: "16px" }}
        footer={renderFooter()}
        onHide={() => setMoveToDialogVisible(false)}
      >
        <Row>
          <InputNumber
            inputId="integeronly"
            value={moveToNumber}
            min={1}
            max={lineApproval?.length}
            onValueChange={(e: any) => {
              if (e.value <= lineApproval?.length) {
                setMoveToNumber(e.value);
              }
            }}
          />
        </Row>
      </Dialog>
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={searchData}
        onSelectFunc={onRowSelect}
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
        dialogVisible={isDialogVisible}
        setDialogVisible={setDialogVisible}
      />
    </div>
  );
};
export default LineApprovalsComponentFix;
