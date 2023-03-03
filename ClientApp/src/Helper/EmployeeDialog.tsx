import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { InputTextComponents } from "../components/InputTextComponents/InputTextComponents";

type Props = {
  onRowSelect: (rowData: any) => void;
  dataEmployee: any;
  setDialogVisible: any;
  dialogVisible: any;
  isLoading?: any;
};

export const EmployeeDialog = (props: Props) => {
  const [globalFilterValue, setGlobalFilterValue] = useState<any>("");
  const [visibleLanguage, setVisibleLanguage] = useState<any>("");
  const [searchData, setSearchData] = useState<any>();
  const userData = JSON.parse(localStorage.getItem("userData") || "");

  useEffect(() => {
    setSearchData(props.dataEmployee);
    if (userData.employeeData.Lang === "TH") {
      setVisibleLanguage("NameTh");
    } else if (userData.employeeData.Lang === "EN") {
      setVisibleLanguage("NameEn");
    }
  }, []);

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps={"set-input-search-dialog"}
          valueProps={globalFilterValue}
          onChangeProps={onGlobalFilterChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog"}
        />
      </div>
    );
  };
  const onGlobalFilterChange = (e: any) => {
    const value = e;
    const dataEmp = props.dataEmployee;
    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      if (
        data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.NameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.PositionNameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.DepartmentNameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ) {
        return true;
      }
    });
    setSearchData([...data]);
  };
  function showModal() {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    props.setDialogVisible(!props.dialogVisible);
  }
  return (
    <>
      <Dialog
        header={renderHeader}
        visible={props.dialogVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={showModal}
        className="requestor-dialog"
        draggable={false}
        resizable={false}
        closable={true}
      >
        <DataTable
          loading={props.isLoading}
          paginator
          rows={5}
          value={searchData}
          selectionMode="single"
          tableStyle={{ border: "1px solid #e6e6e6", outlineColor: "#e6e6e6" }}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={props.onRowSelect}
          sortField="EmployeeCode"
          sortOrder={1}
        >
          <Column
            field="EmployeeCode"
            header={
              <tr>
                <th>
                  <p className="row headtext">EmployeeCode</p>
                  <p className="row subtext">รหัสพนักงาน</p>
                </th>
              </tr>
            }
            sortable
          ></Column>
          <Column
            field={visibleLanguage}
            header={
              <tr>
                <th>
                  <p className="row headtext">Name</p>
                  <p className="row subtext">ชื่อ</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="PositionNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Position</p>
                  <p className="row subtext">ตำแหน่ง</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="DepartmentNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Department</p>
                  <p className="row subtext">หน่วยงาน</p>
                </th>
              </tr>
            }
          ></Column>
        </DataTable>
      </Dialog>
    </>
  );
};
