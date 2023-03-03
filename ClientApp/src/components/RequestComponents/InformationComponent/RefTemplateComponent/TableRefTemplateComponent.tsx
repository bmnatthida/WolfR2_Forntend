import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState, FC } from "react";
import "./index.css";
type Props = {
  canEditDoc: boolean;
  refAttribute: any;
  refTempSelected: any;
  refLoading: boolean;
  setRefTempSelected: any;
};
const TableReferenceComponent = (props: Props) => {
  const deleteBodyTemplate = (selected: any) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          className="set-button-css-ref"
          onClick={() => {
            props.setRefTempSelected(
              props.refTempSelected.filter((_val: any, _idx: number) => {
                return selected.MemoId !== _val.MemoId;
              })
            );
          }}
        />
      </>
    );
  };

  return (
    <div>
      <DataTable
        className="wolf-table"
        stripedRows
        value={props.refTempSelected}
        scrollable
        scrollHeight="400px"
        rowHover
        loading={props.refLoading}
        rowClassName={() => "row-pointer"}
        onRowClick={(rowData: any) => {
          const urlElelement: any = window.location.href.split("/");
          const url = urlElelement[2];
          window.open(
            `/Request?MemoID=${rowData.data.MemoId}`,
            "_blank",
            "noreferrer"
          );
        }}
        size="small"
        rows={5}
      >
        <Column
          header="#"
          body={(refTempSelected, options) => options.rowIndex + 1}
          style={{ flexGrow: 0, flexBasis: "50px" }}
        />
        {props.refAttribute?.optionLabel === "เลขที่เอกสาร" ? (
          <Column
            field="เลขที่เอกสาร"
            header={
              <tr>
                <th>
                  <p className="row headtext">เลขที่เอกสาร</p>
                </th>
              </tr>
            }
            sortable
          ></Column>
        ) : (
          <Column
            field={props.refAttribute.optionLabel}
            header={
              <tr>
                <th>
                  <p className="row headtext">
                    {props.refAttribute.optionLabel}
                  </p>
                  {/* <p className="row subtext">รหัสเอกสาร</p> */}
                </th>
              </tr>
            }
            sortable
          ></Column>
        )}
        <Column
          field="TemplateName"
          header={
            <tr>
              <th>
                <p className="row headtext">Form Template</p>
                <p className="row subtext">ชื่อเอกสาร</p>
              </th>
            </tr>
          }
        ></Column>
        <Column
          field="MemoSubject"
          header={
            <tr>
              <th>
                <p className="row headtext">Subject</p>
                <p className="row subtext">หัวข้อเอกสาร</p>
              </th>
            </tr>
          }
        ></Column>
        <Column
          body={deleteBodyTemplate}
          header={
            <tr>
              <th>
                <p className="row headtext">Delete</p>
                <p className="row subtext">ลบ</p>
              </th>
            </tr>
          }
        ></Column>
      </DataTable>
    </div>
  );
};

export default TableReferenceComponent;
