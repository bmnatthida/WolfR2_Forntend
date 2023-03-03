import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../../Context/UserContext";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { Tooltip } from "primereact/tooltip";

interface Props {
  dataList: any;
  dialogKey: any;
  onSelectFunc?: (rowData: any) => void;
  columns: IColumn[];
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  selectionMode?: "single" | "multi";
  loading?: boolean;
  customFooter?: any;
  selectionData?: any[];
  setSelectedData?: (val: any[]) => void;
}

export interface IColumn {
  field: string;
  headerEn: string;
  headerTh?: string;
}

export const SelectDataDialog = (props: Props) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [searchKey, setSearchKey] = useState<any[]>([]);
  const [userData, setUserData] = useUserContext();
  const tooltipRef = useRef<any>(null);

  useEffect(() => {
    if (props.dialogVisible) {
      let keys: any[] = [];
      Object.keys(props.dataList[0] ? props.dataList[0] : "").map(
        (key: string, idx: number) => {
          if (!key.toLowerCase().includes("id") && key !== "SignPicPath") {
            keys.push(key);
          }
        }
      );
      setSearchKey([...keys]);
      setGlobalFilterValue("");
      setSearchData(props.dataList);
    }
  }, [props.dialogVisible, props.dataList]);

  function toggleModal() {
    props.setDialogVisible(!props.dialogVisible);
  }

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps={"set-input-search-dialog"}
          valueProps={globalFilterValue}
          onChangeProps={onGlobalFilterChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left"}
        />
      </div>
    );
  };

  // useEffect(() => {
  //   tooltipRef.current && tooltipRef.current.updateTargetEvents();
  // }, [searchData]);
  const dynamicColumns = props.columns.map((col, i) => {
    if (col.field !== "Memo_MAdvancveForm") {
      return (
        <Column
          key={col.field}
          header={
            <>
              <p className="row headtext">{col.headerEn}</p>
              <p className="row subtext">{col.headerTh}</p>
            </>
          }
          body={(rowData) => {
            let newField = "";
            if (userData.Lang === "EN") {
              newField = col.field?.replace("Th", "En");
              // return rowData[newField];
            } else {
              newField = col.field?.replace("En", "Th");
              // return rowData[newField];
            }

            return (
              <div
                className="tooltip-data"
                data-pr-tooltip={"EmployeeId : " + rowData.EmployeeId}
                style={{ display: "flex", justifyContent: "space-between" }}
                onMouseOver={() => {
                  if (props.dialogKey === "Employee") {
                    tooltipRef.current &&
                      tooltipRef.current.updateTargetEvents();
                  }
                }}
              >
                <span>{rowData[newField]}</span>
              </div>
            );
          }}
        />
      );
    }
  });

  const onGlobalFilterChange = (e: any) => {
    try {
      const value = e;
      const data = props.dataList.filter((data: any) => {
        let findData: any = [];
        searchKey.map((col: any) => {
          let field = col;
          if (data[field]) {
            if (
              data[field]
                .toString()
                .toLowerCase()
                .indexOf(value.toLowerCase()) !== -1
            ) {
              findData.push(data);
            }
          }
        });
        if (findData.length > 0) {
          return true;
        }
      });
      setSearchData([...data]);
      setGlobalFilterValue(value);
    } catch (error) {
      console.log("table=>search=>error", error);
    }
  };

  return (
    <>
      <Tooltip
        ref={tooltipRef}
        position={"top"}
        mouseTrack
        mouseTrackLeft={0}
        mouseTrackTop={1}
        autoHide={false}
        target={".p-selectable-row .tooltip-data"}
      />

      <Dialog
        key={props.dialogKey}
        header={renderHeader}
        visible={props.dialogVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={toggleModal}
        footer={props.customFooter}
        draggable={false}
        resizable={false}
        blockScroll
        closable={true}
      >
        {!props.loading ? (
          <>
            {props.selectionMode === undefined ||
            props.selectionMode === "single" ? (
              <DataTable
                paginator
                rows={5}
                value={searchData}
                selectionMode="single"
                loading={props.loading}
                tableStyle={{ borderColor: "#e6e6e6" }}
                dataKey="id"
                responsiveLayout="scroll"
                onRowSelect={(rowData: any) => {
                  if (tooltipRef.current) {
                    tooltipRef.current.state.visible = false;
                  }
                  if (props.onSelectFunc) {
                    props.onSelectFunc(rowData);
                  }
                }}
                sortField="EmployeeCode"
                sortOrder={1}
              >
                {dynamicColumns}
              </DataTable>
            ) : (
              <DataTable
                paginator
                rows={5}
                value={searchData}
                tableStyle={{ borderColor: "#e6e6e6" }}
                dataKey="Memo_MemoId"
                selectionMode="multiple"
                responsiveLayout="scroll"
                // onRowSelect={props.onSelectFunc}
                selection={props.selectionData}
                onSelectionChange={(e) => {
                  if (props.setSelectedData) {
                    props.setSelectedData(e.value);
                  }
                }}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3em" }}
                ></Column>
                {dynamicColumns}
              </DataTable>
            )}
          </>
        ) : (
          <>
            {" "}
            <DataTable
              paginator
              rows={5}
              value={searchData}
              tableStyle={{ borderColor: "#e6e6e6" }}
              dataKey="Memo_MemoId"
              selectionMode="multiple"
              responsiveLayout="scroll"
              loading={props.loading}
            >
              {dynamicColumns}
            </DataTable>
          </>
        )}
      </Dialog>
    </>
  );
};
