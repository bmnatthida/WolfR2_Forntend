import React, { useEffect, useState } from "react";
import useLoading from "../../../hooks/useLoading";
import { AccountDialog } from "../../SettingDialogComponents/AccountDialog/AccountDialog";
import { ApprovalMatrixDialog } from "../../SettingDialogComponents/ApprovalMatrixDIalog/ApprovalMatrixDialog";
import { CompanyDialog } from "../../SettingDialogComponents/CompanyDialog/CompanyDialog";
import { DepartmentDialog } from "../../SettingDialogComponents/Department/DepartmentDialog";
import { DivisionDialog } from "../../SettingDialogComponents/DivisionDialog/DivisionDialog";
import EmployeeDialogFix from "../../SettingDialogComponents/EmployeeDialog/EmployeeDialogFixed";
import { EmployeeDialog } from "../../SettingDialogComponents/EmployeeDialog/EmplyeeDialog";
import { MasterDataDialog } from "../../SettingDialogComponents/MasterDataDialog/MasterDataDialog";
import { MenuDialog } from "../../SettingDialogComponents/MenuDialog/MenuDialog";
import { PositionDialog } from "../../SettingDialogComponents/PositionDialog/PositionDialog";
import { RoleDialog } from "../../SettingDialogComponents/RoleDialog/RoleDialog";
import { DynamicDiaLog } from "./DynamicDialog";

type Props = {
  toast: any;
  tableName: string;
  apiName: string;
  formData: any;
  mainDialogVisible: boolean;
  toggleMainDialog: (state: boolean, action: string) => void;
  tableData: any[];
  setTableData: (values: any[]) => void;
  subTableData: any[];
  setSubTableData: (values: any[]) => void;
  reloadData?: (apiPath?: string) => void;
  isEditProfile?: boolean;
};

export const DialogListFix = ({
  toast,
  tableName,
  apiName,
  formData,
  toggleMainDialog,
  mainDialogVisible,
  tableData,
  setTableData,
  subTableData,
  setSubTableData,
  reloadData,
}: Props) => {
  const [pop_up, setPop_up] = useState<any>();
  const { isLoad, setLoad } = useLoading();
  const editData = JSON.stringify(formData);
  const _editData = JSON.parse(editData);

  const dialogs = [
    {
      name: "Employee",
      item: (
        <EmployeeDialogFix
          dialogHeader={tableName}
          rowData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
          isEditProfile={false}
        />
      ),
    },
    {
      name: "Approval Matrix",
      item: (
        <ApprovalMatrixDialog
          dialogHeader={"Approval Matrix"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
          toast={toast}
          matrixItems={subTableData}
          setMatrixItems={setSubTableData}
        />
      ),
    },
    {
      name: "Master Data",
      item: (
        <MasterDataDialog
          dialogHeader={"Master Data"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
          toast={toast}
        />
      ),
    },
    {
      name: "Master Company",
      item: (
        <CompanyDialog
          dialogHeader={"Master Company"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
    {
      name: "Roles",
      item: (
        <RoleDialog
          dialogHeader={"Role"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
    {
      name: "Position",
      item: (
        <PositionDialog
          dialogHeader={"Position"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
    {
      name: "Authorized",
      item: (
        <MenuDialog
          dialogHeader={"Authorized Menu"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
    {
      name: "Division",
      item: (
        <DivisionDialog
          dialogHeader={"Division"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
    {
      name: "Department",
      item: (
        <DepartmentDialog
          dialogHeader={"Department"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
    {
      name: "Account",
      item: (
        <AccountDialog
          dialogHeader={"Account"}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
        />
      ),
    },
  ];

  useEffect(() => {
    console.log("table=>tableName", tableName);

    let dd = dialogs.filter((data, idx) => {
      if (data.name.includes(tableName)) {
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
          dialogHeader={tableName}
          formData={_editData}
          tableData={tableData}
          setTableData={setTableData}
          mainDialogVisible={mainDialogVisible}
          toggleMainDialog={toggleMainDialog}
          setMainLoading={setLoad}
          apiName={apiName}
        />
      )}
    </div>
  );
};
