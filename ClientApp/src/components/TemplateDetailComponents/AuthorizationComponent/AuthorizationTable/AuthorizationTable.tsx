import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { ButtonComponents } from "../../../ButtonComponents/ButtonComponents";
import { DropdownComponents } from "../../../DropdownComponents/DropdownComponents";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";

interface Props {
  departmentListProps?: any;
  setValueProps?: any;
  keyProps?: any;
  departmentRequestProp?: any;
  departmentManageProp?: any;
}

export const AuthorizationTableDepartment = (props: Props) => {
  const [departmentSelect, setDepartmentSelect] = useState<any>({});
  const [departmentPlaceholderDropdown, setDepartmentPlaceholderDropdown] =
    useState<any>([]);
  useEffect(() => {
    gatPlaceholder();
    console.log("props.departmentListProps", props.departmentListProps);
  }, [departmentSelect]);

  function gatPlaceholder() {
    let _array: any = [];
    let _arrayNull: any = [];
    if (
      props.keyProps === "Authorization_request_department" ||
      props.keyProps === "Authorization_request_department"
    ) {
      props.departmentListProps.map((data: any) => {
        let _departmentManageFilter = props.departmentRequestProp.filter(
          (_department: any) => {
            if (_department.depID === data.DepartmentId.toString()) {
              _array.push({
                depID: _department.depID,
                placeholder: _department.depaction,
              });
            }
          }
        );
      });
      if (props.departmentListProps.length !== _array.length) {
        props.departmentListProps.map((_dataMap: any) => {
          let _arrayFilter = _array.filter(
            (_dataFilter: any) =>
              _dataFilter.depID === _dataMap.DepartmentId.toString()
          );

          if (_arrayFilter.length === 0) {
            _arrayNull.push({ placeholder: "-- Please Select --" });
          } else {
            _arrayNull.push(_arrayFilter[0]);
          }
        });
      }
    } else {
      props.departmentListProps.map((data: any) => {
        let _departmentManageFilter = props.departmentManageProp.filter(
          (_department: any) => {
            if (_department.depID === data.DepartmentId.toString()) {
              _array.push({
                depID: _department.depID,
                placeholder: _department.depaction,
              });
            }
          }
        );
      });
      if (props.departmentListProps.length !== _array.length) {
        props.departmentListProps.map((_dataMap: any) => {
          let _arrayFilter = _array.filter(
            (_dataFilter: any) =>
              _dataFilter.depID === _dataMap.DepartmentId.toString()
          );
          if (_arrayFilter.length === 0) {
            _arrayNull.push({ placeholder: "-- Please Select --" });
          } else {
            _arrayNull.push(_arrayFilter[0]);
          }
        });
      }
    }

    setDepartmentPlaceholderDropdown(_arrayNull);
  }
  const onClickAction = (event: any) => {
    // let _event: any = event;
    // const dataFilter = props.valueProps.filter((item: any) => _event !== item);
    // props.setValueProps(dataFilter, props.keyProps);
  };
  const _setDepartmentSelect = (event: any, key: any) => {
    if (key !== undefined && key !== null) {
      let _event = {
        depID: event.DepartmentId.toString(),
        depname: event.NameTh,
        depaction: key.Position,
      };
      console.log("_event", _event);

      props.setValueProps(_event, props.keyProps);
      setDepartmentSelect(event);
    }
    // let _event: any = event;
    // const dataFilter = props.valueProps.filter((item: any) => _event !== item);
    // props.setValueProps(dataFilter, props.keyProps);
  };
  function actionBodyTemplate(rowData: any, inx: any) {
    return (
      <>
        <DropdownComponents
          placeholderProps={
            departmentPlaceholderDropdown[inx.rowIndex] === undefined ||
            departmentPlaceholderDropdown.length === 0
              ? "-- Please Select --"
              : departmentPlaceholderDropdown[inx.rowIndex].placeholder
            // props.keyProps === "Authorization_request_department" ||
            // props.keyProps === "Authorization_request_department"
            // ? props.departmentRequestProp.length > rowData.rowIndex
            //   ? props.departmentRequestProp[inx.rowIndex].depaction
            //   : "-- Please Select --"
            // : inx.rowIndex < props.departmentManageProp.length
            // ? props.departmentRequestProp[inx.rowIndex].depaction
            // : "-- eeee --"
            // "-- Please Select --"
            // props.departmentRequestProp[inx.rowIndex].depaction ===
            //   undefined
            //   ? "-- Please Select --"
            //   : props.departmentRequestProp[inx.rowIndex].depaction
            // : props.departmentManageProp[inx.rowIndex].depaction === undefined
            // ? "-- Please Select --"
            // : props.departmentManageProp[inx.rowIndex].depaction
            // "-- Please Select --"
          }
          onChangeProps={(e: any) => _setDepartmentSelect(rowData, e)}
          optionLabelProps="Position"
          optionsProps={[{ Position: "Above" }, { Position: "Below" }]}
          valueProps={
            props.keyProps === "Authorization_request_department" ||
            props.keyProps === "Authorization_request_department"
              ? props.departmentRequestProp
              : props.departmentManageProp
          }
          keyProps={"Department"}
        />
      </>
    );
  }

  return (
    <>
      <DataTable
        value={props.departmentListProps}
        responsiveLayout="scroll"
        className="tableTemplateComponents"
        size="small"
        dataKey="DepartmentId"
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        // virtualScrollerOptions={{ lazy: true, onLazyLoad: loadCarsLazy, itemSize: 46, delay: 200, showLoader: true, loading: lazyLoading, loadingTemplate }}
        // loading={true}
      >
        <Column
          field="NameTh"
          style={{ textAlign: "start" }}
          headerStyle={{ width: "12rem" }}
          header={<TextHeaderComponents textHeaderProps={"Department Name"} />}
        ></Column>
        <Column
          field="CompanyCode"
          style={{ textAlign: "start" }}
          headerStyle={{ width: "12rem" }}
          header={<TextHeaderComponents textHeaderProps={"Company Code"} />}
        ></Column>
        <Column
          header={<TextHeaderComponents textHeaderProps={"Action"} />}
          headerStyle={{ width: "5rem" }}
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
    </>
  );
};
