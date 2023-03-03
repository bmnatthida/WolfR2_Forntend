import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect } from "react";
import { sorterFunc } from "../../../../Helper/SortingFunction";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";

type Props = {
  dataProps?: any;
  setDataProps?: any;
  versionCheckProps?: any;
};

export const VersionAndHistoryTable = (props: Props) => {
  useEffect(() => {
    if (props.dataProps) {
      props.dataProps.sort((a: any, b: any) => {
        return sorterFunc(a, b, "ModifiedDate", "dec");
      });
    }
  }, [props.dataProps]);
  async function previewVersionTemplate(
    documentCode: string,
    rowIndex: number
  ) {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host;
    window.open(
      `${baseUrl}/TemplateDetail?TemplateVersionCode=${documentCode}&VersionTemplate=${
        rowIndex + 1
      }&Version`,
      "_blank",
      "noreferrer"
    );

    // window.open(
    //   `${baseUrl}/Request?MemoID=0&TemplateVersionCode=${documentCode}&VersionTemplate=${
    //     rowIndex + 1
    //   }&Version`,
    //   "_blank"
    // );
  }
  const actionBodyTemplate = (rowData: any) => {
    let someDateString = moment(rowData.ModifiedDate, "DD/MM/YYYY HH:mm:ss");
    const NewDate = moment(someDateString).format("DD MMM yyyy HH:mm:ss");
    return NewDate;
  };

  return (
    <div>
      <DataTable
        value={props.dataProps}
        responsiveLayout="scroll"
        className="referenceDocumentComponents-dataTable"
      >
        <Column
          header={
            <TextHeaderComponents
              textHeaderProps={"Version"}
              textSubProps={"เวอร์ชั่น"}
            />
          }
          headerStyle={{ width: "3em" }}
          body={(data, options) => {
            return (
              <a
                // href="#"
                onClick={() =>
                  previewVersionTemplate(data.DocumentCode, options.rowIndex)
                }
              >
                {options.rowIndex + 1}
              </a>
            );
          }}
        ></Column>
        <Column
          field="TemplateName"
          header={
            <TextHeaderComponents
              textHeaderProps={"Form Name"}
              textSubProps={"ชื่อแบบฟอร์ม"}
            />
          }
          body={(data, options) => {
            return (
              <a
                // href="#"
                onClick={() =>
                  previewVersionTemplate(data.DocumentCode, options.rowIndex)
                }
              >
                {data.TemplateName}
              </a>
            );
          }}
          style={{ textAlign: "start" }}
        ></Column>
        <Column
          field="TemplateName"
          style={{ textAlign: "start" }}
          header={
            <TextHeaderComponents
              textHeaderProps={"Subject"}
              textSubProps={"เรื่อง"}
            />
          }
          body={(data, options) => {
            return (
              <a
                // href="#"
                onClick={() =>
                  previewVersionTemplate(data.DocumentCode, options.rowIndex)
                }
              >
                {data.TemplateName}
              </a>
            );
          }}
        ></Column>
        <Column
          field="ModifiedByName"
          style={{ textAlign: "start" }}
          header={
            <TextHeaderComponents
              textHeaderProps={"Edit By"}
              textSubProps={"แก้ไขโดย"}
            />
          }
          body={(data, options) => {
            return (
              <a
                // href="#"
                onClick={() =>
                  previewVersionTemplate(data.DocumentCode, options.rowIndex)
                }
              >
                {data.ModifiedByName}
              </a>
            );
          }}
        ></Column>

        <Column
          field="ModifiedDate"
          header={
            <TextHeaderComponents
              textHeaderProps={"Edit Date"}
              textSubProps={"แก้ไขเมื่อ"}
            />
          }
          // headerStyle={{ width: "5rem" }}
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};
