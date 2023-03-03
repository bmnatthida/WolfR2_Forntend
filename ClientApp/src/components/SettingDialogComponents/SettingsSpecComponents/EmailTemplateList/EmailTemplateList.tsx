import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import React, { useState, useRef, useEffect } from "react";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { useHistory } from "react-router-dom";
import moment from "moment";
interface Props {
  valueProps: any;
}

export const EmailTemplateList = (props: Props) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [columnsHeader, setcolumnsHeader] = useState<any>([]);
  const [selectedColumns, setSelectedColumns] = useState<any>([]);
  const [filters2, setFilters2] = useState<any>();
  const history = useHistory();
  useEffect(() => {
    if (props.valueProps.length !== 0) {
      arrayHeader();
      _formatDate();
    }
  }, [props.valueProps]);

  function arrayHeader() {
    let array = [];

    for (const [key, value] of Object.entries(props.valueProps[0])) {
      if (
        key === "IsActive" ||
        key === "userPrincipalName" ||
        key === "connectionString" ||
        key === "SecretId" ||
        key === "EmailBody"
      ) {
      } else {
        array.push({ Header: key, field: key });
      }
    }
    setcolumnsHeader(array);
    setSelectedColumns(array);
  }
  function _formatDate() {
    let _data = props.valueProps;
    _data.map((data: any) => {
      if (data.ModifiedDate !== null && data.ModifiedDate !== null) {
        if (data.ModifiedDate.length !== 0) {
          data.ModifiedDate = formatDateTime(data.ModifiedDate);
        }
      }
      if (data.CreatedDate !== null && data.CreatedDate !== null) {
        if (data.CreatedDate.length !== 0) {
          data.CreatedDate = formatDateTime(data.CreatedDate);
        }
      }
    });
  }

  function onRowSelect(data: any) {
    history.push(
      "/EmailTemplateDetail?EmailTemplateId=" + data[0].EmailTemplateId
    );
  }
  const onColumnToggle = (event: any) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columnsHeader.filter((col: any) =>
      selectedColumns.some((sCol: any) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };
  const header = (
    <div style={{ textAlign: "left" }}>
      <MultiSelect
        value={selectedColumns}
        options={columnsHeader}
        optionLabel="Header"
        onChange={onColumnToggle}
        style={{ width: "20em" }}
      />
    </div>
  );
  const columnComponents = selectedColumns.map((col: any) => {
    return (
      <Column
        key={col.field}
        field={col.field}
        header={<TextHeaderComponents textHeaderProps={col.Header} />}
        sortable
      />
    );
  });
  const formatDateTime = (value: any) => {
    let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
    const NewDate = moment(someDateString).format("DD MMM yyyy");
    return NewDate;
  };
  return (
    <>
      <DataTable
        value={props.valueProps}
        responsiveLayout="scroll"
        className="tableTemplateComponents"
        selectionMode="multiple"
        metaKeySelection={false}
        paginator
        first={first}
        dragSelection
        size="small"
        rows={rows}
        dataKey="EmailTemplateId"
        header={header}
        filterDisplay="row"
        //   selection={props.selectedTableTemplate}
        onSelectionChange={(e) => onRowSelect(e.value)}
        //   globalFilterFields={["DocumentCode", "TemplateName", "TemplateSubject"]}
        // filters={filters2}
      >
        {columnComponents}
      </DataTable>
    </>
  );
};
