import moment from "moment";
import { confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import React, { useEffect, useMemo, useState } from "react";
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import { ReportDialog } from "../../components/SettingDialogComponents/ReportDialog/ReportDialog";
import DynamicTable from "../../components/TableComponents/DynamicTableFix/DynamicTable";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { useUserContext } from "../../Context/UserContext";
import useLoading from "../../hooks/useLoading";
import { CheckAutoReport } from "../../Services/AppSettingService";
import { CheckRolePermission } from "../../Services/AuthorizedService";
import { GetAllDynamic } from "../../Services/DynamicService";
import { Panel } from "primereact/panel";
import { Ripple } from "primereact/ripple";
import {
  DeleteReport,
  ReportTemplateSelectByReportID,
} from "../../Services/ReportService";
import { GetTemplateeBindFormNameDDL } from "../../Services/TemplateService";
import { IReportModel } from "../../IRequestModel/IReportModel";
import SelectedFieldComponent from "../../components/ReportScreenComponent/SelectedFieldComponent";
import { ProgressSpinner } from "primereact/progressspinner";
import { IoArrowBackSharp } from "react-icons/io5";
import { TablePaginationConfig } from "antd";
import DynamicReportFix from "./DynamicReportFix";

const reportModelIReportModel: IReportModel = {
  ReporttemplateID: 0,
  ReportName: "",
  TemplateId: "",
  Selectedfieldlist: [],
  ReportDescription: "",
  IsPrivate: false,
  IsActive: true,
  CreatedBy: "",
  CreatedByname: "",
  CreatedDate: "",
  ModifiedBy: "",
  ModifiedByname: "",
  ModifiedDate: "",
  Selectedfieldlistfilter: [],
  Columns: [],
  Rows: [],
  TemplateNewVersion: false,
  PageIndex: 0,
  PageSize: 10,
  CanDelete: false,
  RoleId: "",
  RoleEmp: "",
  Mode: false,
};

const ReportScreenFix = () => {
  const location = useLocation();
  const apiName = location.pathname.replace("/", "");
  const [text, setText] = useState<string>("");
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [reportList, setReportList] = useState<any>();
  const [tableData, setTableData] = useState<any[]>([]);
  const [reportColumns, setReportColumns] = useState<any[]>();
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [template, setTemplate] = useState<any>([]);
  const { isLoad, setLoad } = useLoading();
  const [editReport, setEditReport] = useState<any>(false);
  const [checkReport, setCheckReport] = useState<any>(false);
  const [dataEditReport, setDataEditReport] = useState<any>([]);
  const [userData] = useUserContext();
  const [emp_data, setEmp_data] = useState<any>();
  const [_baseUrl, setbaseUrl] = useState<string>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [isAutoReport, setIsAutoReport] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const { url } = useRouteMatch();
  let history = useHistory();

  const [paginationOption, setPaginationOption] =
    useState<TablePaginationConfig>({
      position: ["bottomLeft"],
      size: "small",
      current: 1,
      showSizeChanger: true,
      onChange: (page, pageSize) => {
        let _page: TablePaginationConfig = paginationOption;
        _page.current = page;
        _page.pageSize = pageSize;

        setPaginationOption(_page);
      },
    });

  useEffect(() => {
    setLoad(true);
    const path = apiName.split("/");
    if (path[2]) {
      history.push(
        `${url}/${path[1].replaceAll("/", "\\")}/${path[2]}/${isAutoReport}`
      );
    } else {
      checkAutoReport();
    }
  }, []);

  useEffect(() => {
    setLoad(true);

    fetchTemplate();
    fetchReport();
  }, [isAutoReport]);

  useEffect(() => {
    if (!isAdmin) {
      if (tableData) {
        const findedData = tableData.find((e: any) => {
          if (
            e.CreatedBy === userData.NameEn ||
            e.CreatedBy === userData.NameTh
          ) {
            return e;
          }
        });
        if (findedData) {
          setCanEdit(true);
        }
      }
    }
  }, [tableData]);

  const checkAutoReport = async () => {
    const mode = query.get("mode");
    const isEnable = await CheckAutoReport();
    if (mode === "test") {
      setIsAutoReport(!isEnable);
    } else {
      setIsAutoReport(isEnable);
    }
  };

  async function fetchReport() {
    try {
      let empList: any[] = [];
      let _emp_dataFind: any = undefined;
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
        body: JSON.stringify({
          EmployeeId: userId?.toString(),
          UserPrincipalName: userData.Email,
        }),
      });
      const _isAdmin = await CheckRolePermission(
        _emp_dataFind ? _emp_dataFind?.EmployeeId : userData.EmployeeId
      );

      if (query.get("usrid") && _isAdmin) {
        _emp_dataFind = empList.find(
          (item: any) => item.EmployeeId === Number(query.get("usrid"))
        );
      }

      if (reportList === undefined) {
        setReportList(_dataDynamic);
      }

      if (!emp_data) {
        empList = await GetAllDynamic("Employee" + "/GetAll", undefined);
        setEmp_data(empList);
      } else {
        empList = emp_data;
      }

      const hasMy = _dataDynamic.find(
        (_data: any) =>
          _data.CreatedBy === userData.NameTh ||
          _data.CreatedBy === userData.NameEn
      );
      if (hasMy) {
        setCanEdit(true);
      }
      if (empList.length > 0) {
        _dataDynamic?.map((e: any) => {
          let emp = empList?.find(
            (_emp: any) => _emp.EmployeeId === e.CreatedBy
          );
          if (emp) {
            e.CreatedBy = userData.Lang === "TH" ? emp?.NameTh : emp?.NameEn;
          } else {
            e.CreatedBy = "";
          }
        });
        _dataDynamic?.map((e: any) => {
          let emp = empList?.find(
            (_emp: any) => _emp.EmployeeId === e.ModifiedBy
          );
          if (emp) {
            e.ModifiedBy = userData.Lang === "TH" ? emp?.NameTh : emp?.NameEn;
          } else {
            e.ModifiedBy = "";
          }
        });
      }

      const uniqueArray = _dataDynamic.filter((value: any, index: any) => {
        const _value = JSON.stringify(value);
        return (
          index ===
          _dataDynamic.findIndex((obj: any) => {
            return JSON.stringify(obj) === _value;
          })
        );
      });
      setIsAdmin(_isAdmin);
      setTableData([...uniqueArray]);
      setReportColumns(undefined);
      setText("Report List");
      setLoad(false);
    } catch (error) {
      console.log("report=>error", error);
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

    setTemplate(_dataTemplatee);
  }

  async function fetchGetReportById(rePortId: any) {
    let _ReportById = await ReportTemplateSelectByReportID(rePortId);
    setDataEditReport(_ReportById);
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
      _user = emp_data.find((e: any) => e.EmployeeId == query.get("usrId"));
    }

    if (isAdmin && !query.get("usrId")) {
      return (
        <React.Fragment>
          <SplitButton
            // id
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

  function toggleDialog() {
    setVisibleDialog(!visibleDialog);
    fetchReport();
    setEditReport(false);
  }

  if (isLoad) {
    return <></>;
  } else {
    return (
      <Switch>
        <Route exact path={`${url}/:reportName/:reportId/:isAutoReport`}>
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
                      {text.replace("Dynamic", "") + "(" + itemsCount + ")"}
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
                  tableName={text}
                  dataSource={tableData}
                  customColumns={reportColumns}
                  setItemsCount={setItemsCount}
                  actionBodyTemplate={actionBodyTemplate}
                  paginationOption={paginationOption}
                  canEdit={isAdmin || canEdit}
                  rowClickAction={(record: any) => {
                    history.push(
                      `${url}/${record.ReportName.replaceAll("/", "\\")}/${
                        record.ReportTemplateId
                      }/${isAutoReport}`
                    );
                  }}
                  canExport={text !== "Report List"}
                />
                {/* <DynamicTable
                  dataSource={tableData}
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
                /> */}
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
                setOnLoading={setLoad}
              />
            </div>
          </div>
        </React.Fragment>
      </Switch>
    );
    // if (isAutoReport) {
    //   return (
    //     <div className="main-container">
    //       <div className="worklist-container" style={{ height: "100%" }}>
    //         <div className="header-container">
    //           <div className="button-container">
    //             <TreeSelectNewRequest setDataTemplateTreeProps={null} />
    //           </div>
    //           <div
    //             className="route-text-container"
    //             style={{ display: "flex", justifyContent: "space-between" }}
    //           >
    //             <p className="route-text">{text + "(" + itemsCount + ")"}</p>
    //             <div
    //               style={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 columnGap: 10,
    //               }}
    //             >
    //               {reportList && text !== "Report List" && (
    //                 <ButtonComponents
    //                   setLabelProps="Back"
    //                   setIconProps={
    //                     <IoArrowBackSharp
    //                       size={"16px"}
    //                       style={{ marginRight: "3px" }}
    //                     />
    //                   }
    //                   onClickProps={() => {
    //                     setTableData([...reportList]);
    //                     setReportColumns(undefined);
    //                     setText("Report List");
    //                   }}
    //                   setStyleProps={{
    //                     height: "38px",
    //                     borderRadius: "6px",
    //                     border: "1px solid #F2F2F2",
    //                     fontSize: "13px",
    //                     background: "#F2F2F2",
    //                     color: "#282F6A",
    //                     width: "120px",
    //                   }}
    //                 />
    //               )}
    //               {_baseUrl !== "lite.wolfapprove.com" && (
    //                 <ButtonComponents
    //                   setLabelProps={"Create Report"}
    //                   setStyleProps={{
    //                     height: "38px",
    //                     backgroundColor: "#282F6A",
    //                     color: "#FFFFFF",
    //                     border: "1px solid rgb(40, 47, 106)",
    //                   }}
    //                   onClickProps={() => {
    //                     toggleDialog();
    //                   }}
    //                 />
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="body-container">
    //           <DynamicTable
    //             tableName={text}
    //             dataSource={tableData}
    //             customColumns={reportColumns}
    //             setItemsCount={setItemsCount}
    //             actionBodyTemplate={actionBodyTemplate}
    //             paginationOption={paginationOption}
    //             canEdit={isAdmin || canEdit}
    //             rowClickAction={(record: any, rowIndex: any, event: any) => {
    //               if (text === "Report List") {
    //                 setLoad(true);
    //                 fecthDataReport(record.ReportTemplateId);
    //               } else if (record["Memo_MemoId"]) {
    //                 window.open(
    //                   `/Request?MemoID=${record["Memo_MemoId"]}`,
    //                   "_blank"
    //                 );
    //               }
    //             }}
    //             canExport={text !== "Report List"}
    //           />

    //           <ReportDialog
    //             visible={visibleDialog}
    //             toggleDialog={toggleDialog}
    //             templateDataProps={template}
    //             checkSetProps={setCheckReport}
    //             checkProps={checkReport}
    //             editProps={editReport}
    //             dataEditReportProps={dataEditReport}
    //             setEditReportProps={setDataEditReport}
    //             setOnLoading={setLoad}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div className="main-container">
    //       <div className="worklist-container" style={{ height: "100%" }}>
    //         <div className="header-container">
    //           <div className="button-container">
    //             <TreeSelectNewRequest setDataTemplateTreeProps={null} />
    //           </div>
    //           <div
    //             className="route-text-container"
    //             style={{ display: "flex", justifyContent: "space-between" }}
    //           >
    //             <p className="route-text">{text + "(" + itemsCount + ")"}</p>
    //             <div
    //               style={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 columnGap: 10,
    //               }}
    //             >
    //               {reportList && text !== "Report List" && (
    //                 <ButtonComponents
    //                   setLabelProps="Back"
    //                   setIconProps={
    //                     <IoArrowBackSharp
    //                       size={"16px"}
    //                       style={{ marginRight: "3px" }}
    //                     />
    //                   }
    //                   onClickProps={() => {
    //                     setTableData([...reportList]);
    //                     setReportColumns(undefined);
    //                     setText("Report List");
    //                   }}
    //                   setStyleProps={{
    //                     height: "38px",
    //                     borderRadius: "6px",
    //                     border: "1px solid #F2F2F2",
    //                     fontSize: "13px",
    //                     background: "#F2F2F2",
    //                     color: "#282F6A",
    //                     width: "120px",
    //                   }}
    //                 />
    //               )}
    //               {_baseUrl !== "lite.wolfapprove.com" && (
    //                 <ButtonComponents
    //                   setLabelProps={"Create Report"}
    //                   setStyleProps={{
    //                     height: "38px",
    //                     backgroundColor: "#282F6A",
    //                     color: "#FFFFFF",
    //                     border: "1px solid rgb(40, 47, 106)",
    //                   }}
    //                   onClickProps={() => {
    //                     toggleDialog();
    //                   }}
    //                 />
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="body-container">
    //           {text !== "" && (
    //             <>
    //               {" "}
    //               {text === "Report List" ? (
    //                 <DynamicTable
    //                   tableName={text}
    //                   dataSource={tableData}
    //                   customColumns={reportColumns}
    //                   setItemsCount={setItemsCount}
    //                   actionBodyTemplate={actionBodyTemplate}
    //                   canEdit={isAdmin || canEdit}
    //                   paginationOption={paginationOption}
    //                   rowClickAction={(
    //                     record: any,
    //                     rowIndex: any,
    //                     event: any
    //                   ) => {
    //                     if (text === "Report List") {
    //                       setLoad(true);
    //                       fecthDataReport(record.ReportTemplateId);
    //                     } else if (record["Memo_MemoId"]) {
    //                       window.open(
    //                         `/Request?MemoID=${record["Memo_MemoId"]}`,
    //                         "_blank"
    //                       );
    //                     }
    //                   }}
    //                   canExport={text !== "Report List"}
    //                 />
    //               ) : (
    //                 <>
    //                   <Panel
    //                     headerTemplate={(option: any) =>
    //                       panelTemplate(option, "Filter")
    //                     }
    //                     toggleable
    //                   >
    //                     <SelectedFieldComponent
    //                       reportTemp={reportTemp}
    //                       setReportColumns={setReportColumns}
    //                       setTableData={setTableData}
    //                       setGettingreport={setGettingreport}
    //                     />
    //                   </Panel>
    //                   <Panel
    //                     headerTemplate={(option: any) =>
    //                       panelTemplate(option, "Report")
    //                     }
    //                     className={"table-panel"}
    //                     toggleable
    //                   >
    //                     {gettingReport ? (
    //                       <>
    //                         <ProgressSpinner className="report-progress" />
    //                         <DynamicTable
    //                           tableName={text}
    //                           dataSource={[]}
    //                           customColumns={reportColumns}
    //                           // loading={gettingReport}
    //                           setItemsCount={setItemsCount}
    //                           actionBodyTemplate={actionBodyTemplate}
    //                           canEdit={isAdmin || canEdit}
    //                           rowClickAction={(
    //                             record: any,
    //                             rowIndex: any,
    //                             event: any
    //                           ) => {
    //                             if (text === "Report List") {
    //                               setLoad(true);
    //                               fecthDataReport(record.ReportTemplateId);
    //                             } else if (record["Memo_MemoId"]) {
    //                               window.open(
    //                                 `/Request?MemoID=${record["Memo_MemoId"]}`,
    //                                 "_blank"
    //                               );
    //                             }
    //                           }}
    //                           canExport={text !== "Report List"}
    //                         />
    //                       </>
    //                     ) : (
    //                       <DynamicTable
    //                         tableName={text}
    //                         dataSource={tableData}
    //                         customColumns={reportColumns}
    //                         loading={gettingReport}
    //                         setItemsCount={setItemsCount}
    //                         actionBodyTemplate={actionBodyTemplate}
    //                         canEdit={isAdmin || canEdit}
    //                         rowClickAction={(
    //                           record: any,
    //                           rowIndex: any,
    //                           event: any
    //                         ) => {
    //                           if (text === "Report List") {
    //                             setLoad(true);
    //                             fecthDataReport(record.ReportTemplateId);
    //                           } else if (record["Memo_MemoId"]) {
    //                             window.open(
    //                               `/Request?MemoID=${record["Memo_MemoId"]}`,
    //                               "_blank"
    //                             );
    //                           }
    //                         }}
    //                         canExport={text !== "Report List"}
    //                       />
    //                     )}
    //                   </Panel>
    //                 </>
    //               )}
    //             </>
    //           )}

    //           <ReportDialog
    //             visible={visibleDialog}
    //             toggleDialog={toggleDialog}
    //             templateDataProps={template}
    //             checkSetProps={setCheckReport}
    //             checkProps={checkReport}
    //             editProps={editReport}
    //             dataEditReportProps={dataEditReport}
    //             setEditReportProps={setDataEditReport}
    //             setOnLoading={setLoad}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }
  }
};

export default ReportScreenFix;
