import { Col } from "antd";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import React, { useEffect, useState } from "react";
import { exportExcel } from "../../../Helper/ExportExcel";

type Props = {
  tableName: string;
  dataSource: any[];
  showData: any[];
  setShowData: (values: any[]) => void;
  selectedColumns: any[];
  setSelectedColumns: (values: any[]) => void;
  allColumns: any[];
};

const HeaderComponent = ({
  tableName,
  dataSource,
  showData,
  setShowData,
  selectedColumns,
  setSelectedColumns,
  allColumns,
}: Props) => {
  const [showSelCol, setShowSelCol] = useState<any[]>([]);
  const [showCol, setShowCol] = useState<any[]>([]);
  const [toggleSelect, setToggleSelect] = useState<boolean>(false);

  useEffect(() => {
    if (allColumns) {
      const selCol: any[] = [...selectedColumns];
      let showSelCol: any[] = [];
      const col: any[] = [...allColumns];
      let showCol: any[] = [];
      selCol.forEach((e: any) => {
        if (
          e.dataIndex !== undefined &&
          e.dataIndex !== null &&
          e.dataIndex !== ""
        ) {
          const field: string = e.dataIndex;
          if (!field.toLowerCase().includes("id")) {
            showSelCol.push(e);
          }
        }
      });
      col.map((e: any) => {
        if (
          e.dataIndex !== undefined &&
          e.dataIndex !== null &&
          e.dataIndex !== ""
        ) {
          if (!e.dataIndex.toLowerCase().includes("id")) {
            showCol.push(e);
          }
        }
      });
    }
    setShowSelCol([...showSelCol]);
    setShowCol([...showCol]);
  }, [allColumns]);

  function reconStructionForShowData() {
    try {
      let dataShow: any = [];
      dataSource.map((data: any) => {
        let dataField: any = {};
        selectedColumns.map((col: any) => {
          if (col.fieldTypeFilterDynamic === "c") {
            if (data[col.field] !== null) {
              dataField[col.field] = data[col.field];
            }
          } else if (
            col.fieldTypeFilterDynamic === "d" ||
            col.key.toLowerCase().includes("date") ||
            col.key.toLowerCase().includes("วัน")
          ) {
            if (data[col.field] !== null && data[col.field] !== "") {
              dataField[col.field] = new Date(data[col.field]);
            }
          } else {
            dataField[col.field] = data[col.field];
          }
        });
        // if (props.apiName === "MasterCompany/GetAll") {
        //   delete dataField["UrlLogo"];
        // }
        dataShow.push(dataField);
      });

      return dataShow;
    } catch (error) {}
  }

  const onColumnToggle = (event: any) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = allColumns.filter((col: any) =>
      selectedColumns.some((sCol: any) => sCol.dataIndex === col.dataIndex)
    );
    setSelectedColumns(orderedSelectedColumns);
  };

  return (
    <>
      <Col style={{ textAlign: "left" }}>
        <MultiSelect
          value={showSelCol}
          options={showCol}
          optionLabel="dataIndex"
          showSelectAll={toggleSelect}
          onHide={() => {
            const recon = reconStructionForShowData();
            const uniqueArray = recon.filter((value: any, index: any) => {
              const _value = JSON.stringify(value);
              return (
                index ===
                recon.findIndex((obj: any) => {
                  return JSON.stringify(obj) === _value;
                })
              );
            });
            setShowData([...uniqueArray]);
          }}
          onChange={onColumnToggle}
          placeholder="Select columns"
          style={{ width: "20em" }}
        />
      </Col>
      <Col style={{ textAlign: "right" }} className="Button-canExport">
        <Button
          label="Export to excel"
          icon="pi pi-file-excel"
          data-pr-tooltip="XLS"
          onClick={() => {
            exportExcel(tableName, showData);
          }}
          style={{
            height: "38px",
            background: " #28a745",
            border: "1px solid #28a745",
            color: "#ffffff",
            fontSize: "13px",
            borderRadius: "6px",
            margin: " 0px 11px 0px 0px",
          }}
        />
      </Col>
    </>
  );
};

export default HeaderComponent;
