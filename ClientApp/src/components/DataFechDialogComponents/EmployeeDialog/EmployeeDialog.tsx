import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../Context/UserContext";

import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";

interface Props {
  dataProps?: any;
  searchDataProps?: any;
  showModalProps?: any;
  isDialogVisibleProps?: any;
  setisDialogVisibleProps?: any;
  keyProps?: any;
  onRowSelectProps?: any;
  valueProps?: any;
  setDataProps?: any;
}

export default function EmployeeDialog(props: Props) {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [userData, setUserData] = useUserContext();

  useEffect(() => {
    if (props.isDialogVisibleProps === false) {
      setGlobalFilterValue("");
    }
  }, [props.isDialogVisibleProps]);
  const onRowSelect = (event: any) => {
    let dataSelectEmployee: any[] = [];
    if (props.valueProps !== undefined && props.valueProps !== null) {
      dataSelectEmployee = [...props.valueProps];
    }
    const datafilterEmployee = dataSelectEmployee.filter(
      (_data: any) =>
        _data.NameEn === event.data.NameEn || _data.NameTh === event.data.NameTh
    );
    if (datafilterEmployee.length === 0) {
      dataSelectEmployee.push(event.data);
    }

    // console.log("dataSelectEmployee", dataSelectEmployee);
    // console.log("dataSelectEmployee", event.data);

    props.onRowSelectProps(dataSelectEmployee, props.keyProps);
    props.setisDialogVisibleProps(false);
  };
  const onGlobalFilterChange = async (e: any) => {
    const value = e;
    const dataEmp = props.dataProps;
    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      let findData: any = [];
      columns.map((col: any) => {
        let field = col.field;
        if (userData !== undefined) {
          if (userData.Lang === "EN") {
            field = field.replaceAll("Th", "En");
          } else {
            field = field.replaceAll("En", "Th");
          }
        }
        if (data[field].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          findData.push(data);
        }
      });
      if (findData.length > 0) {
        return true;
      }
    });
    props.setDataProps([...data]);
    // if (value.length === 0) {
    //   props.setDataProps(props.searchDataProps);
    // }
  };
  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={globalFilterValue}
          onChangeProps={onGlobalFilterChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };
  const columns = [
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
  ];
  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        key={col.field}
        header={
          <tr>
            <th>
              <p className="row headtext">{col.headerEn}</p>
              <p className="row subtext">{col.headerTh}</p>
            </th>
          </tr>
        }
        body={(rowData) => {
          if (rowData.Lang !== undefined) {
            if (userData.Lang === "EN") {
              let newField = col.field.replace("Th", "En");
              return rowData[newField];
            } else {
              let newField = col.field.replace("En", "Th");
              return rowData[newField];
            }
          } else {
            return rowData[col.field];
          }
        }}
      />
    );
  });
  return (
    <>
      <Dialog
        header={renderHeader}
        visible={props.isDialogVisibleProps}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={props.showModalProps}
        className="information-dialog"
        draggable={false}
        resizable={false}
        dismissableMask
        closable={false}
      >
        <DataTable
          paginator
          rows={5}
          value={props.searchDataProps}
          selectionMode="single"
          tableStyle={{ border: "1px solid #e6e6e6", outlineColor: "#e6e6e6" }}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={onRowSelect}
          sortField="EmployeeCode"
          sortOrder={1}
        >
          {/* <Column
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
            field={empData.employeeData.Lang == "EN" ? "NameEn" : "NameTh"}
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
          ></Column> */}
          {dynamicColumns}
        </DataTable>
      </Dialog>
    </>
  );
}
