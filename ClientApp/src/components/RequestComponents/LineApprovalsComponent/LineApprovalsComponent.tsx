import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Grid } from "antd";
import "./LineApprovalsComponent.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { IListApprovalDetailsModel } from "../../../IRequestModel/IListApprovalDetailsModel";
import { IApproverModel } from "../../../IRequestModel/IApproverModel";
import { GetAllEmployee } from "../../../Services/EmployeeService";
import { GetSignature } from "../../../Services/MasterDataService";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { useLocation } from "react-router";
import { Row } from "react-bootstrap";
import { InputNumber } from "primereact/inputnumber";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";

interface Props {
  getLineAproveMethodProp: any;
  setLineApproveMethodProp: any;
  getRequestorDetailProp: any;
  dataEmployeeList: any;
  signature: any;
  onLoading: boolean;
}
const { useBreakpoint } = Grid;

const LineApprovalsComponent: React.FC<Props> = (props: Props) => {
  const [lineData, setLineData] = useState<any>([]);
  const [dataEmployeeList, setdataEmployeeList] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const toast = useRef<any>(null);
  const isMounted = useRef(false);
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [visibleConfirmProp, setVisibleConfirmProp] = useState(false);
  const [rowDeleted, setRowDeleted] = useState<any>();
  const [canEdit, setCanEdit] = useState<boolean>();
  const [sinatures_Seleted, setSinatures_Seleted] = useState<any>([]);
  const [sinatureOptions, setSinatureOptions] = useState<any>([]);
  const [defSignatureID, setDefSignatureID] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  let location = useLocation<any>();
  const { lg } = useBreakpoint();
  const [locationPathName, setLocationPathName] = useState<any>(
    location.pathname
  );
  const empData = JSON.parse(window.localStorage.getItem("userData") || "");
  const [moveToDialogVisible, setMoveToDialogVisible] = useState(false);
  const [fromIndex, setFromIndex] = useState(1);
  const [moveToNumber, setMoveToNumber] = useState(1);
  useEffect(() => {
    try {
      let responeMemoDetail = props.getRequestorDetailProp;
      fetchMasterData();
      fetchEmployee();
      if (responeMemoDetail.memoDetail.memoid == 0) {
        fetchApprovals();
        setCanEdit(responeMemoDetail.listFormName[0].isRequesterEditApproval);
      } else {
        fetchApprovals();
        if (responeMemoDetail.listFormName[0].isRequesterEditApproval) {
          if (
            responeMemoDetail.memoDetail.status === "Completed" ||
            responeMemoDetail.memoDetail.status === "Rejected"
          ) {
            setCanEdit(false);
          } else if (
            responeMemoDetail.memoDetail.status === "Draft" ||
            responeMemoDetail.memoDetail.status === "Rework" ||
            responeMemoDetail.memoDetail.status === "Recall"
          ) {
            setCanEdit(true);
          }
        } else {
          setCanEdit(responeMemoDetail.listFormName[0].isRequesterEditApproval);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    props.setLineApproveMethodProp(lineData);
  }, [lineData]);

  useEffect(() => {
    fetchMasterData();
  }, [props.signature]);

  async function fetchApprovals() {
    let options: any[] = [];
    let signatrue = props.signature;
    const responeData = props.getLineAproveMethodProp();
    let id = -1;
    signatrue.map((s: any) => {
      if (s.value2 === "Approved") {
        id = s.id;
      }
      options.push({ id: s.id, value1: s.value1, value2: s.value2 });
    });

    responeData.map((e: any) => {
      if (
        e.signature_id === 0 &&
        (e.signature_en === null || e.signature_th === null)
      ) {
        e.signature_id = id;
        e.signature_en = "Approved";
        e.signature_th = "อนุมัติ";
      } else {
        options.map((sig: any) => {
          if (sig.id === e.signature_id) {
            e.signature_en = sig.value2;
            e.signature_th = sig.value1;
          }
        });
      }
    });
    setDefSignatureID(id);
    setSinatureOptions([...options]);
    setLineData([...responeData]);
  }

  function fetchMasterData() {
    props.signature.map((s: any) => {
      if (s.value2 === "Approved") {
        setDefSignatureID(s.id);
      }
    });
  }

  async function fetchEmployee() {
    setdataEmployeeList([...props.dataEmployeeList]);
    setSearchData([...props.dataEmployeeList]);
  }

  function addData(empData: any) {
    const raw = lineData;
    const lastData = lineData[lineData.length - 1];
    let data: IApproverModel = empData;
    if (lastData != undefined) {
      let newData: IListApprovalDetailsModel = {
        approver: data,
        emp_id: data.EmployeeId,
        lineid: lastData.lineid + 1,
        sequence: lastData.sequence + 1,
        signature_en: "Approved",
        signature_id: defSignatureID,
        signature_th: "อนุมัติ",
      };
      raw.push(newData);
    } else {
      let newData: IListApprovalDetailsModel = {
        approver: data,
        emp_id: data.EmployeeId,
        lineid: 1,
        sequence: 1,
        signature_en: "Approved",
        signature_id: defSignatureID,
        signature_th: "อนุมัติ",
      };
      raw.push(newData);
    }
    setLineData([...raw]);
    setDialogVisible(!isDialogVisible);
  }

  const onGlobalFilterChange2 = (e: any) => {
    const value = e;
    const dataEmp = dataEmployeeList;
    setGlobalFilterValue2(value);

    const data = dataEmp.filter((data: any) => {
      if (empData.employeeData.Lang === "EN") {
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

  useEffect(() => {
    isMounted.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps={"set-input-search-dialog"}
          valueProps={globalFilterValue2}
          onChangeProps={onGlobalFilterChange2}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left"}
        />
      </div>
    );
  };

  const onRowReorder = (e: any) => {
    for (let i = 0; i < e.value.length; i++) {
      let a = 1;
      a = a + i;
      e.value[i].sequence = a;
    }

    setLineData(e.value);
  };

  function onSelected_Sinatures(event: any, sinatures: any, rowInx: number) {
    let line: any = lineData;
    line[rowInx].signature_id = event.value.id;
    line[rowInx].signature_th = event.value.value1;
    line[rowInx].signature_en = event.value.value2;
    setLineData([...line]);
  }

  const statusBodyTemplate = (rowData: any, option: any) => {
    if (canEdit) {
      let sinatures = sinatures_Seleted;
      let selectedValue: any[] = [];
      lineData.map((e: any) => {
        selectedValue.push({
          id: e.signature_id,
          value1: e.signature_th,
          value2: e.signature_en,
        });
      });

      return (
        <Dropdown
          className="dropdown-lineapprove"
          value={selectedValue[option.rowIndex]}
          options={props.signature}
          onChange={(e) => onSelected_Sinatures(e, sinatures, option.rowIndex)}
          optionLabel={empData.employeeData.Lang === "EN" ? "value2" : "value1"}
          placeholder="Select a Signature"
        />
      );
    } else {
      return (
        <div className="status-badge">
          <span>{rowData.signature_en}</span>
        </div>
      );
    }
  };

  const onRowSelect = (event: any) => {
    addData(event.data);
  };

  function toggleModal() {
    setGlobalFilterValue2("");
    setDialogVisible(!isDialogVisible);
  }

  const confirmDialogfunction = (rowDeleted: any) => {
    setVisibleConfirmProp(true);
    setRowDeleted(rowDeleted);
  };

  function rowDelete(rowIndex: any) {
    let data = lineData;

    data.splice(rowIndex, 1);

    let reoderSequence = data.map((e: any, i: number) => {
      e.sequence = i + 1;
      return e;
    });

    setLineData([...reoderSequence]);
  }

  const actionBodyTemplate = (rowData: any, options: any) => {
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
  };

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
    setIsLoading(true);
    moveItem(fromIndex, targetIndex - 1);
  };

  const moveItem = (fromIndex: number, targetIndex: number) => {
    try {
      let rows = lineData !== null ? [...lineData] : [];
      let updateRow = rows[fromIndex];
      rows[fromIndex] = rows[targetIndex];
      rows[targetIndex] = updateRow;
      for (let i = 0; i < rows.length; i++) {
        let a = 1;
        a = a + i;
        rows[i].sequence = a;
      }
      setLineData([...rows]);
      setMoveToDialogVisible(false);
      setIsLoading(false);
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
      <p className="Col-text-header">Approvals</p>
      {!isLoading && (
        <>
          {canEdit ? (
            <>
              <ButtonComponents
                setIconProps={"pi pi-plus"}
                setLabelProps={"Add"}
                setStyleProps={{
                  marginBottom: "10px",
                  borderRadius: "6px",
                  height: "40px",
                  backgroundColor: "rgb(40, 47, 106)",
                  border: "1px solid rgb(40, 47, 106)",
                }}
                disabledProps={
                  locationPathName === "/PreviewTemplate" ? true : false
                }
                onClickProps={() => toggleModal()}
              />

              <DataTable
                className="wolf-table"
                value={lineData}
                onRowReorder={onRowReorder}
                loading={isLoading}
                dataKey="id"
                stripedRows
                scrollable
                scrollDirection="both"
                responsiveLayout="scroll"
              >
                <Column
                  rowReorder={lg ? true : false}
                  body={(rowData: any, options: any) => {
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
                  }}
                  style={{ flexGrow: 0, flexBasis: "50px" }}
                />
                <Column
                  header="#"
                  body={(lineData, options) => options.rowIndex + 1}
                  style={{ flexGrow: 0, flexBasis: "50px" }}
                />
                {/* {dynamicColumns} */}
                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "approver.NameEn"
                      : "approver.NameTh"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "approver.NameEn"
                      : "approver.NameTh"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "approver.NameEn"
                      : "approver.NameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Employee Name</p>
                        <p className="row subtext">ชื่อพนักงาน</p>
                      </th>
                    </tr>
                  }
                  style={{ flexGrow: 1, flexBasis: "150px" }}
                />

                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "approver.PositionNameEn"
                      : "approver.PositionNameTh"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "approver.PositionNameEn"
                      : "approver.PositionNameTh"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "approver.PositionNameEn"
                      : "approver.PositionNameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Position</p>
                        <p className="row subtext">ตำแหน่ง</p>
                      </th>
                    </tr>
                  }
                  style={{ flexGrow: 1, flexBasis: "150px" }}
                />

                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "approver.DepartmentNameEn"
                      : "approver.DepartmentNameTh"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "approver.DepartmentNameEn"
                      : "approver.DepartmentNameTh"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "approver.DepartmentNameEn"
                      : "approver.DepartmentNameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Department</p>
                        <p className="row subtext">หน่วยงาน</p>
                      </th>
                    </tr>
                  }
                  style={{ flexGrow: 1, flexBasis: "150px" }}
                />

                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "signature_en"
                      : "signature_th"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "signature_en"
                      : "signature_th"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "signature_en"
                      : "signature_th"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Signature </p>
                        <p className="row subtext">คำลงท้าย</p>
                      </th>
                    </tr>
                  }
                  body={statusBodyTemplate}
                  style={{ flexGrow: 1, flexBasis: "50px" }}
                />

                <Column
                  header={() => {
                    return (
                      <>
                        <div className="label-text-container table-control-header">
                          <div className="table-control-headtext">
                            <span className="headtext-form">Action</span>
                            {/* {col.control.template.attribute.require === "Y" && (
                              <span className="headtext-form text-Is-require">*</span>
                            )} */}
                          </div>

                          {/* <span className="table-control-header-span">
                            {col.control.template.alter}
                          </span> */}
                        </div>
                      </>
                    );
                  }}
                  body={actionBodyTemplate}
                  exportable={false}
                ></Column>
              </DataTable>
            </>
          ) : (
            <>
              <DataTable
                value={lineData}
                className="wolf-table"
                onRowReorder={onRowReorder}
                loading={isLoading}
                dataKey="id"
                scrollable
                scrollDirection="both"
                responsiveLayout="scroll"
              >
                <Column
                  header="#"
                  body={(lineData, options) => options.rowIndex + 1}
                  style={{ flexGrow: 0, flexBasis: "50px" }}
                />
                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "approver.NameEn"
                      : "approver.NameTh"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "approver.NameEn"
                      : "approver.NameTh"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "approver.NameEn"
                      : "approver.NameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Employee Name</p>
                        <p className="row subtext">ชื่อพนักงาน</p>
                      </th>
                    </tr>
                  }
                  style={{ flexGrow: 1, flexBasis: "50px" }}
                />

                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "approver.PositionNameEn"
                      : "approver.PositionNameTh"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "approver.PositionNameEn"
                      : "approver.PositionNameTh"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "approver.PositionNameEn"
                      : "approver.PositionNameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Position</p>
                        <p className="row subtext">ตำแหน่ง</p>
                      </th>
                    </tr>
                  }
                  style={{ flexGrow: 1, flexBasis: "50px" }}
                />

                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "approver.DepartmentNameEn"
                      : "approver.DepartmentNameTh"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "approver.DepartmentNameEn"
                      : "approver.DepartmentNameTh"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "approver.DepartmentNameEn"
                      : "approver.DepartmentNameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Department</p>
                        <p className="row subtext">หน่วยงาน</p>
                      </th>
                    </tr>
                  }
                  style={{ flexGrow: 1, flexBasis: "20%" }}
                />

                <Column
                  key={
                    empData.employeeData.Lang === "EN"
                      ? "signature_en"
                      : "signature_th"
                  }
                  columnKey={
                    empData.employeeData.Lang === "EN"
                      ? "signature_en"
                      : "signature_th"
                  }
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "signature_en"
                      : "signature_th"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Signature </p>
                        <p className="row subtext">คำลงท้าย</p>
                      </th>
                    </tr>
                  }
                  body={statusBodyTemplate}
                  style={{ flexGrow: 1, flexBasis: "20%" }}
                />
              </DataTable>
            </>
          )}
        </>
      )}
      <Dialog
        header="Move To"
        visible={moveToDialogVisible}
        style={{ width: "25vw", borderRadius: "16px" }}
        footer={renderFooter()}
        onHide={() => setMoveToDialogVisible(false)}
      >
        <Row>
          <InputNumber
            inputId="integeronly"
            value={moveToNumber}
            min={1}
            max={lineData?.length}
            onValueChange={(e) => {
              if (e.value <= lineData?.length) {
                setMoveToNumber(e.value);
              }
            }}
          />
        </Row>
      </Dialog>
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={dataEmployeeList}
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
      <Toast ref={toast}></Toast>
    </div>
  );
};
export default LineApprovalsComponent;
