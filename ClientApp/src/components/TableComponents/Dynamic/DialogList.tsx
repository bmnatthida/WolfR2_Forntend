import React, { useEffect, useState } from "react";
import { ApprovalMatrixDialog } from "../../SettingDialogComponents/ApprovalMatrixDIalog/ApprovalMatrixDialog";
import { CompanyDialog } from "../../SettingDialogComponents/CompanyDialog/CompanyDialog";
import { DepartmentDialog } from "../../SettingDialogComponents/Department/DepartmentDialog";
import { DivisionDialog } from "../../SettingDialogComponents/DivisionDialog/DivisionDialog";
import { EmployeeDialog } from "../../SettingDialogComponents/EmployeeDialog/EmplyeeDialog";
import { MasterDataDialog } from "../../SettingDialogComponents/MasterDataDialog/MasterDataDialog";
import { MenuDialog } from "../../SettingDialogComponents/MenuDialog/MenuDialog";
import { PositionDialog } from "../../SettingDialogComponents/PositionDialog/PositionDialog";
import { RoleDialog } from "../../SettingDialogComponents/RoleDialog/RoleDialog";
import { DynamicDiaLog } from "./DynamicDialog";
interface Props {
  dialogName: string;
  titleHeaderProp?: string;
  visibleDialogProp?: boolean;
  setVisibleDialogProp?: any;
  visibleConfirmProp?: boolean;
  setVisibleConfirmProp?: any;
  checkActionProp?: string;
  formDataProp?: any;
  dataListProp?: any;
  setDataListProp?: any;
  matrixItems: any;
  tableColumn: any;
  setMatrixItems: (items: any) => void;
  toastShowSuccessProp: () => void;
  toastShowErrorProp: () => void;
  messageButtonDialogProp?: string;
  setOnLoading?: (bool: boolean) => void;
  setCanTableAction: (bool: boolean) => void;
  toast?: any;
}

export const DialogList = (props: Props) => {
  const [pop_up, setPop_up] = useState<any>();
  const dialogs = [
    {
      name: "Employee",
      item: (
        <EmployeeDialog
          dialogHeader={"Employee"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
          toast={props.toast}
        />
      ),
    },
    {
      name: "Department",
      item: (
        <DepartmentDialog
          dialogHeader={"Department"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
    {
      name: "NavbarMenu",
      item: (
        <MenuDialog
          dialogHeader={"Authorized Menu"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
    {
      name: "Division",
      item: (
        <DivisionDialog
          dialogHeader={"Division"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
    {
      name: "Approval Matrix",
      item: (
        <ApprovalMatrixDialog
          dialogHeader={"Approval Matrix"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
          matrixItems={props.matrixItems}
          setMatrixItems={props.setMatrixItems}
        />
      ),
    },
    {
      name: "Master Data",
      item: (
        <MasterDataDialog
          dialogHeader={"Master Data"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
    {
      name: "Master Company",
      item: (
        <CompanyDialog
          dialogHeader={"Master Company"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
    // RoleDialog
    {
      name: "Roles",
      item: (
        <RoleDialog
          dialogHeader={"Role"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
    {
      name: "Position",
      item: (
        <PositionDialog
          dialogHeader={"Position"}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
        />
      ),
    },
  ];

  useEffect(() => {
    let dd = dialogs.filter((data, idx) => {
      if (data.name.includes(props.dialogName)) {
        return data;
      }
    });
    if (dd.length > 0) {
      setPop_up(dd[0]);
    }
  }, []);

  return (
    <div>
      {pop_up !== undefined ? (
        <div key={pop_up.name}>{pop_up.item}</div>
      ) : (
        <DynamicDiaLog
          dialogHeader={props.dialogName}
          tableColumn={props.tableColumn}
          apiName={props.dialogName}
          formData={props.formDataProp}
          tableData={props.dataListProp}
          setTableData={props.setDataListProp}
          tableComfirmDialog={props.visibleConfirmProp}
          setTableComfirmDialog={props.setVisibleConfirmProp}
          mainDialogVisible={props.visibleDialogProp}
          setMainDialogVisible={props.setVisibleDialogProp}
          setMainLoading={props.setOnLoading}
          toast={props.toast}
        />
      )}
    </div>
  );
};
