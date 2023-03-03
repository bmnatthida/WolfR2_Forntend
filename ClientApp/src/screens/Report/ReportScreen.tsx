import React, { useEffect, useMemo, useState } from "react";
import { SplitButton } from "primereact/splitbutton";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { useLocation } from "react-router";
import { useHistory, useRouteMatch, Switch, Route } from "react-router-dom";
import { DynamicReport } from "./DynamicReport";
import "./index.css";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import { ReportDialog } from "../../components/SettingDialogComponents/ReportDialog/ReportDialog";
import {
  GetTemplateeBindFormNameDDL,
  GetTemplateTemplateListVersion,
} from "../../Services/TemplateService";
import withPerMission from "../../components/HOC/withPermission";
import {
  DeleteReport,
  GetReportById,
  ReportTemplateSelectByReportID,
} from "../../Services/ReportService";
import { confirmDialog } from "primereact/confirmdialog";
import { GetAllEmployee } from "../../Services/EmployeeService";
import { GetAllDynamic } from "../../Services/DynamicService";
import useLoading from "../../hooks/useLoading";
import { useUserContext } from "../../Context/UserContext";
import DynamicTable from "../../components/TableComponents/DynamicTableFix/DynamicTable";
import DynamicReportFix from "./DynamicReportFix";
interface Props {}

const ReportScreen: React.FC<Props> = () => {
  const text = "Report List";
  const location = useLocation();
  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [apiName, setApiName] = useState<string>(
    location.pathname.replace("/", "")
  );
  const { isLoad, setLoad } = useLoading();
  const [imgLoading, setImgLoading] = useState<any>(LogoLoading);
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [template, setTemplate] = useState<any>([]);
  const [empList, setEmpList] = useState<any>([]);
  const [checkReport, setCheckReport] = useState<any>(false);
  const [isDelete, setIsDelete] = useState<any>(false);
  const [editReport, setEditReport] = useState<any>(false);
  const [dataEditReport, setDataEditReport] = useState<any>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [_baseUrl, setbaseUrl] = useState<string>();
  const [userData, setUserData] = useUserContext();
  const [data, setData] = useState<any>();
  let history = useHistory();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const { url } = useRouteMatch();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  // const [emp_data, setEmp_data] = useState<any>();

  useEffect(() => {
    setLoad(true);
    fetchTemplate();
    fetchEmployee();
    fetchReport();
    console.log("table=>5555555555555555");

    if (process.env.NODE_ENV !== "development") {
      setbaseUrl(window.location.hostname);
    }
  }, []);

  async function fetchEmployee() {
    setEmpList([...(await GetAllEmployee())]);
  }

  // const actionBodyTemplate = (rowData: any) => {
  //   try {
  //     const employee = empList.filter((e: any) => {
  //       return e.EmployeeId === rowData.CreatedBy;
  //     });
  //     if (empData.employeeData.Lang === "TH") {
  //       rowData.CreatedByName = employee[0]?.NameTh;
  //     } else {
  //       rowData.CreatedByName = employee[0]?.NameEn;
  //     }
  //     if (empData.employeeData.EmployeeId === rowData.CreatedBy) {
  //       return (
  //         <React.Fragment>
  //           <SplitButton
  //             className="p-button-secondary"
  //             model={[
  //               {
  //                 label: "Edit",
  //                 icon: "pi pi-pencil",
  //                 command: () => {
  //                   setVisibleDialog(true);
  //                   setCheckReport(true);
  //                   setEditReport(true);
  //                   console.log(
  //                     "rowData.ReportTemplateId",
  //                     rowData.ReportTemplateId
  //                   );

  //                   fetchGetReportById(rowData.ReportTemplateId);
  //                 },
  //               },
  //               {
  //                 label: "Delete",
  //                 icon: "pi pi-trash",
  //                 command: () => {
  //                   confirmDialog({
  //                     message: "Do you want to delete this report.",
  //                     header: "Delete",
  //                     icon: "p-confirm-dialog-icon pi pi-info-circle",
  //                     rejectClassName: "hide",
  //                     acceptClassName:
  //                       "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
  //                     accept: async () => {
  //                       const res = await DeleteReport(
  //                         rowData.ReportTemplateId
  //                       );
  //                       if (res) {
  //                         setOnLoading(true);
  //                         fetchReport();
  //                       }
  //                     },
  //                   });
  //                 },
  //               },
  //             ]}
  //             dropdownIcon="pi pi-ellipsis-v"
  //           />
  //         </React.Fragment>
  //       );
  //     } else {
  //       return (
  //         <React.Fragment>
  //           <SplitButton
  //             className="p-button-secondary"
  //             model={[
  //               {
  //                 label: "Edit",
  //                 icon: "pi pi-pencil",
  //                 command: () => {
  //                   setVisibleDialog(true);
  //                   setCheckReport(true);
  //                   setEditReport(true);

  //                   fetchGetReportById(rowData.ReportTemplateId);
  //                 },
  //               },
  //             ]}
  //             dropdownIcon="pi pi-ellipsis-v"
  //           />
  //         </React.Fragment>
  //       );
  //     }
  //   } catch (error) {
  //     console.log("report=>error", error);
  //   }
  // };

  function toggleDialog() {
    setVisibleDialog(!visibleDialog);
    fetchReport();
    setEditReport(false);
  }

  async function fetchReport() {
    try {
      const userId = query.get("usrid")
        ? () => {
            setIsAdmin(false);
            return query.get("usrid");
          }
        : userData.EmployeeId;
      const _dataDynamic: any[] = await GetAllDynamic(apiName + "/GetAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ EmployeeId: userId?.toString() }),
      });
      setData(_dataDynamic);
      setLoad(false);
    } catch (error) {
      console.log("table=>error", error);
      setLoad(false);
    }
  }

  async function fetchTemplate() {
    const empid = userData.EmployeeId;
    const DepartmentId = userData.DepartmentId;

    const dataJsonn = {
      CreatedBy: empid.toString(),
      DepartmentId: DepartmentId,
      Username: userData.Username,
      Email: userData.Email,
    };

    let _dataTemplatee = await GetTemplateeBindFormNameDDL(dataJsonn);
    console.log("_dataTemplatee", _dataTemplatee);

    setTemplate(_dataTemplatee);
  }

  async function fetchGetReportById(rePortId: any) {
    let _ReportById = await ReportTemplateSelectByReportID(rePortId);

    setDataEditReport(_ReportById);
  }

  if (isLoad) {
    return <></>;
  }

  const actionBodyTemplate = (record: any) => {
    const adminActionBody = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          fetchGetReportById(record.ReportTemplateId);
          setVisibleDialog(true);
          setCheckReport(true);
          setEditReport(true);
        },
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {
          confirmDialog({
            message: "Do you want to delete this report.",
            header: "Delete",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            rejectClassName: "hide",
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: async () => {
              const res = await DeleteReport(record.ReportTemplateId);
              if (res) {
                setLoad(true);
                fetchReport();
              }
            },
          });
        },
      },
    ];
    let _user: any = userData;
    if (query.get("usrId")) {
      _user = empList.find((e: any) => e.EmployeeId == query.get("usrId"));
    }
    console.log("table=>isAdmin", isAdmin);

    if (isAdmin && !query.get("usrId")) {
      return (
        <React.Fragment>
          <SplitButton
            className="p-button-secondary"
            model={adminActionBody}
            dropdownIcon="pi pi-ellipsis-v"
          />
        </React.Fragment>
      );
    } else if (
      record.CreatedBy === _user.NameTh ||
      record.CreatedBy === _user.NameEn
    ) {
      return (
        <React.Fragment>
          <SplitButton
            className="p-button-secondary"
            model={adminActionBody}
            dropdownIcon="pi pi-ellipsis-v"
          />
        </React.Fragment>
      );
    }
  };

  return (
    <Switch>
      <Route exact path={`${url}/:reportName/:reportId`}>
        <DynamicReportFix />
      </Route>
      <React.Fragment>
        <div>
          <div className="main-container" style={{ minHeight: "100vh" }}>
            <div className="worklist-container">
              <div className="header-container">
                <div className="button-container">
                  <TreeSelectNewRequest setDataTemplateTreeProps={null} />
                </div>
                <div
                  className="route-text-container"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p className="route-text">
                    {apiName.replace("Dynamic", "") + "(" + itemsCount + ")"}
                  </p>
                  {_baseUrl !== "lite.wolfapprove.com" && (
                    <ButtonComponents
                      setLabelProps={"Create Report"}
                      setStyleProps={{
                        height: "38px",
                        backgroundColor: "#282F6A",
                        color: "#FFFFFF",
                        border: "1px solid rgb(40, 47, 106)",
                      }}
                      onClickProps={() => {
                        toggleDialog();
                      }}
                    />
                  )}
                </div>
              </div>

              <DynamicTable
                dataSource={data}
                tableName={text}
                rowClickAction={(record: any, rowIndex: any, event: any) => {
                  history.push(
                    `${url}/${record.ReportName.replaceAll("/", "\\")}/${
                      record.ReportTemplateId
                    }`
                  );
                }}
                actionBodyTemplate={actionBodyTemplate}
                setItemsCount={setItemsCount}
                canExport={false}
              />
            </div>
            <ReportDialog
              visible={visibleDialog}
              toggleDialog={toggleDialog}
              templateDataProps={template}
              checkSetProps={setCheckReport}
              checkProps={checkReport}
              editProps={editReport}
              dataEditReportProps={dataEditReport}
              setEditReportProps={setDataEditReport}
              setOnLoading={setOnLoading}
            />
          </div>

          <div
            style={{
              backgroundColor: "rgb(255, 255, 255)",
              paddingRight: "40px",
              paddingLeft: "40px",
              paddingBottom: "20px",
              flex: "1 1",
              width: "100%",
            }}
          >
            <FooterComponents />
          </div>
        </div>
      </React.Fragment>
    </Switch>
  );
};
export default withPerMission(ReportScreen);
