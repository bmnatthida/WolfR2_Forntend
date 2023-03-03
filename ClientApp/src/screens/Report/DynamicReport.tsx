import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import { DynamicTable } from "../../components/TableComponents/Dynamic/DynamicTable";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import { GetAllDynamic } from "../../Services/DynamicService";
interface Props {}

type QuizParams = {
  reportId: string;
  reportName: string;
};

export const DynamicReport = (props: Props) => {
  let { reportId } = useParams<QuizParams>();
  let { reportName } = useParams<QuizParams>();
  const text = "Report Detail";
  const apiName = "DynamicReport/GetReportDetailById";
  const [itemsCount, setItemsCount] = useState<number>(0);
  const reportDetailBody = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ReportTemplateId: reportId,
      PageIndex: 0,
      PageSize: 10000,
    }),
  };
  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [imgLoading, setImgLoading] = useState<any>(LogoLoading);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setOnLoading(false);
    }
  }, [data]);

  async function fetchData() {
    try {
      setOnLoading(true);

      const _dataDynamic: any[] = await GetAllDynamic(
        apiName,
        reportDetailBody
      );

      setData(_dataDynamic);
    } catch (error) {
      console.log("table=>error", error);
    }
  }

  return (
    <div>
      {onLoading ? (
        <div className="logo-loading cursor-loading">
          <img src={imgLoading} alt="loading..." />
        </div>
      ) : (
        <div className="main-container" style={{ minHeight: "100vh" }}>
          <div className="worklist-container">
            <div className="header-container">
              <div className="button-container">
                <TreeSelectNewRequest />
              </div>
              <div className="route-text-container">
                <p className="route-text">
                  {reportName.replace("\\", "/") + "(" + itemsCount + ")"}
                </p>
              </div>
            </div>
            <DynamicTable
              data={data}
              tableName={text}
              canExport={true}
              canAction={false}
              canReorderColumn={true}
              setItemsCount={setItemsCount}
            />
          </div>
        </div>
      )}

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
  );
};
