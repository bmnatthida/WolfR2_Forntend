import moment from "moment";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Ripple } from "primereact/ripple";
import React, { useEffect, useMemo, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import SelectedFieldComponent from "../../components/ReportScreenComponent/SelectedFieldComponent";
import DynamicTable from "../../components/TableComponents/DynamicTableFix/DynamicTable";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { useUserContext } from "../../Context/UserContext";
import useLoading from "../../hooks/useLoading";
import { IReportModel } from "../../IRequestModel/IReportModel";
import { CheckAutoReport } from "../../Services/AppSettingService";
import { GetAllDynamic } from "../../Services/DynamicService";
import { ReportTemplateSelectByReportID } from "../../Services/ReportService";

type Props = {};

type QuizParams = {
  reportId: string;
  reportName: string;
  // isAutoReport: string;
};

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

const DynamicReportFix = (props: Props) => {
  let { reportId } = useParams<QuizParams>();
  let { reportName } = useParams<QuizParams>();
  // let { isAutoReport } = useParams<QuizParams>();
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [_isAutoReport, setIsAutoReport] = useState<boolean>(true);
  const [reportTemp, setReportTemp] = useState<IReportModel>(
    reportModelIReportModel
  );
  const [_reportName, setReportName] = useState<string>("");
  const [reportColumns, setReportColumns] = useState<any[]>();
  const [gettingFilter, setGettingFilter] = useState<boolean>(false);
  const [gettingReport, setGettingreport] = useState<boolean>(true);
  const history = useHistory();
  const [userData] = useUserContext();
  const [link, setLink] = useState<any>();
  const _userData = JSON.parse(window.localStorage.getItem("userData") || "");
  const _sharepointSiteURL = _userData.SharepointSiteURL;

  useEffect(() => {
    fecthData();
  }, []);

  // useEffect(() => {
  //   if (_isAutoReport !== undefined) {
  //     fecthData();
  //     setReportName(reportName);
  //   }
  // }, [_isAutoReport]);

  function openWindow() {
    var pathArray = link.split("/");
    const _link = link
      ? link.charAt(0) !== "/" && !_sharepointSiteURL
        ? "/" + link
        : link
      : "";

    const protocol = window.location.protocol;
    if (_sharepointSiteURL) {
      if (_link.startsWith(_sharepointSiteURL)) {
        console.log("att=>", _link);

        window.open(`${_link}`, "_blank", "noreferrer");
      } else {
        console.log("att=>", `${_sharepointSiteURL}${_link}`);

        window.open(`${_sharepointSiteURL}${_link}`, "_blank", "noreferrer");
      }
    } else if (_userData.TinyURL) {
      if (
        _link.includes("www") ||
        _link.includes(".com") ||
        _link.includes(".tv") ||
        _link.includes(".net") ||
        _link.includes("https") ||
        _link.includes("http") ||
        _link.includes(".com") ||
        _link.includes(".co.th")
      ) {
        if (_link.includes("https")) {
          window.open(
            `https://${_link.replaceAll("https://", "")}`,
            "_blank",
            "noreferrer"
          );
        } else if (_link.includes("http")) {
          window.open(
            `http://${_link.replaceAll("http://", "")}`,
            "_blank",
            "noreferrer"
          );
        } else {
          window.open(`https://${_link}`, "_blank", "noreferrer");
        }
      } else {
        window.open(
          `${protocol}//${_userData.TinyURL}${_link}`,
          "_blank",
          "noreferrer"
        );
      }
    } else if (!_userData.TinyURL) {
      window.open(`${_link}`, "_blank", "noreferrer");
    }
  }

  const fecthData = async () => {
    const dd = await CheckAutoReport();
    if (dd) {
      const reportDetailBody = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ReportTemplateId: reportId,
          PageIndex: 0,
          PageSize: 10000,
          UserPrincipalName: userData.Email,
        }),
      };
      const _dataDynamic: any = await GetAllDynamic(
        "DynamicReport/GetReportDetailById",
        reportDetailBody
      );

      if (_dataDynamic.FieldCollection && _dataDynamic.FieldCollection !== "") {
        const fieldCollection: any[] = JSON.parse(_dataDynamic.FieldCollection);

        let numCols: string[] = [];
        let dateCols: string[] = [];
        let edCols: string[] = [];
        let atCols: string[] = [];
        fieldCollection.forEach((col: any, index: number) => {
          console.log("col=>col", col);

          if (
            col.FieldTypeFilterDynamic === "c" ||
            col.FieldTypeFilterStatic === "Number"
          ) {
            numCols.push(col.key);
          } else if (
            col.FieldTypeFilterDynamic === "d" ||
            col.FieldTypeFilterStatic === "Datetime"
          ) {
            dateCols.push(col);
          } else if (col.FieldTypeFilterDynamic === "ed") {
            edCols.push(col);
          } else if (col.FieldTypeFilterDynamic === "at") {
            atCols.push(col);
          }
        });

        if (numCols.length > 0) {
          numCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col]) {
                data[col] = Number(data[col])?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                });
              }
            });
          });
        }
        if (dateCols.length > 0) {
          dateCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col.key]) {
                const symbol =
                  col.symbol && col.symbol !== "" ? col.symbol : " ";
                let newDate = moment(new Date(data[col.key]))
                  .format("DD" + symbol + "MMM" + symbol + "YYYY")
                  .toString();
                data[col.key] = newDate;
              }
            });
          });
        }
        if (edCols.length > 0) {
          edCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col.key] && data[col.key] !== "") {
                let parser = new DOMParser();
                let doc = parser.parseFromString(data[col.key], "text/html");
                data[col.key] = doc.body.innerText;
              }
            });
          });
        }
        if (atCols.length > 0) {
          atCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col.key] && data[col.key] !== "") {
                const [nameFile, linkFile] = data[col.key].split("|");
                setLink(linkFile);
                data[col.key] = (
                  <Button
                    label={nameFile}
                    onClick={() => {
                      openWindow();
                    }}
                  />
                );
              }
            });
          });
        }
        setReportColumns([...fieldCollection]);
      }
      setReportName(_dataDynamic.ReportName);
      setData([..._dataDynamic.dt_Report]);
      setGettingreport(false);
    } else {
      setGettingFilter(true);
      const _reportTemp: any = await ReportTemplateSelectByReportID(
        Number(reportId)
      );
      setReportName(reportName);
      if (_reportTemp) {
        setReportTemp(_reportTemp);
        setData([]);
      }
      setGettingFilter(false);
      setGettingreport(false);
    }
    setIsAutoReport(dd);
  };

  // const checkAutoReport = async () => {
  //   const mode = query.get("mode");
  //   const isEnable = await CheckAutoReport();
  //   console.log("table=>isEnable", isEnable);

  //   if (mode === "test") {
  //     setIsAutoReport(!isEnable);
  //   } else {
  //     setIsAutoReport(isEnable);
  //   }
  // };

  const panelTemplate = (options: any, headText: string) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} pl-1`;

    return (
      <div className={className}>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
        <span className={titleClassName}>{headText}</span>
      </div>
    );
  };

  return (
    <div className="main-container">
      <div className="worklist-container" style={{ height: "100%" }}>
        <div className="header-container">
          <div className="button-container">
            <TreeSelectNewRequest setDataTemplateTreeProps={null} />
          </div>
          <div
            className="route-text-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p className="route-text">{_reportName + "(" + itemsCount + ")"}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                columnGap: 10,
              }}
            >
              <ButtonComponents
                setLabelProps="Back"
                setIconProps={
                  <IoArrowBackSharp
                    size={"16px"}
                    style={{ marginRight: "3px" }}
                  />
                }
                onClickProps={() => {
                  history.push("/DynamicReport");
                  // setTableData([...reportList]);
                  // setReportColumns(undefined);
                  // setText("Report List");
                }}
                setStyleProps={{
                  height: "38px",
                  borderRadius: "6px",
                  border: "1px solid #F2F2F2",
                  fontSize: "13px",
                  background: "#F2F2F2",
                  color: "#282F6A",
                  width: "120px",
                }}
              />
              {/* {_baseUrl !== "lite.wolfapprove.com" && (
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
        )} */}
            </div>
          </div>
        </div>
        <div className="body-container">
          <>
            {_isAutoReport ? (
              <>
                <DynamicTable
                  tableName={reportName}
                  dataSource={data}
                  loading={gettingReport}
                  // customColumns={reportColumns}
                  setItemsCount={setItemsCount}
                  rowClickAction={(record: any, rowIndex: any, event: any) => {
                    console.log("table=>record", record);

                    if (record["Memo_MemoId"]) {
                      window.open(
                        `/Request?MemoID=${record["Memo_MemoId"]}`,
                        "_blank"
                      );
                    }
                  }}
                  canExport={true}
                />
              </>
            ) : (
              <>
                {" "}
                <Panel
                  headerTemplate={(option: any) =>
                    panelTemplate(option, "Filter")
                  }
                  toggleable
                >
                  {!gettingFilter && (
                    <SelectedFieldComponent
                      reportTemp={reportTemp}
                      setReportColumns={setReportColumns}
                      setTableData={setData}
                      setGettingreport={setGettingreport}
                    />
                  )}
                </Panel>
                <Panel
                  headerTemplate={(option: any) =>
                    panelTemplate(option, "Report")
                  }
                  className={"table-panel"}
                  toggleable
                >
                  {gettingReport ? (
                    <>
                      {/* <ProgressSpinner className="report-progress" /> */}
                      <DynamicTable
                        tableName={reportName}
                        dataSource={data}
                        customColumns={reportColumns}
                        loading={gettingReport}
                        setItemsCount={setItemsCount}
                        rowClickAction={(
                          record: any,
                          rowIndex: any,
                          event: any
                        ) => {
                          if (record["Memo_MemoId"]) {
                            window.open(
                              `/Request?MemoID=${record["Memo_MemoId"]}`,
                              "_blank"
                            );
                          }
                        }}
                        canExport={true}
                      />
                    </>
                  ) : (
                    <>
                      <DynamicTable
                        tableName={reportName}
                        dataSource={data}
                        customColumns={reportColumns}
                        loading={gettingReport}
                        setItemsCount={setItemsCount}
                        rowClickAction={(
                          record: any,
                          rowIndex: any,
                          event: any
                        ) => {
                          if (record["Memo_MemoId"]) {
                            window.open(
                              `/Request?MemoID=${record["Memo_MemoId"]}`,
                              "_blank"
                            );
                          }
                        }}
                        canExport={true}
                      />
                    </>
                  )}
                </Panel>
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
};
{
  /* if (isAutoReport) {
      return (
      
            <div className="body-container">
              <DynamicTable
                tableName={reportName}
                dataSource={data}
                // customColumns={reportColumns}
                setItemsCount={setItemsCount}
                rowClickAction={(record: any, rowIndex: any, event: any) => {
                  console.log("table=>record", record);

                  if (record["Memo_MemoId"]) {
                    window.open(
                      `/Request?MemoID=${record["Memo_MemoId"]}`,
                      "_blank"
                    );
                  }
                }}
                canExport={true}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return <div>DynamicReportFix</div>;
    } */
}
{
  /* } */
}
export default DynamicReportFix;
