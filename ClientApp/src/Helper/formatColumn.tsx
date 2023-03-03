import { Button, Form, Input, Popconfirm, Table } from "antd";
import React from "react";

type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export const formatToColumns = (columns: any[], data: any) => {
  let rowData: any = {};
  rowData["key"] = data.key;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    rowData[column.label] = data[i].value;
  }
  return rowData;
};

export const formatColumn = (columns: any[], data: any) => {
  let newData: any[] = [];
  // const dataString = JSON.stringify(data);
  // const _data = JSON.parse(dataString);
  console.log({ columns, data });

  for (let i = 0; i < data?.row?.length; i++) {
    const row = data.row[i];
    let rowData: any = {};
    rowData["key"] = i;
    for (let j = 0; j < row.length; j++) {
      const _row = row[j];
      rowData[columns[j].label] = _row.value
        ? _row.value
        : _row.item
        ? _row.item
            .map((_item: any, idx: number) =>
              _item === "Y"
                ? columns[j].control.template.attribute.items[idx].item
                : ""
            )
            .toString()
        : _row.value;
      // rowData[columns[j].label] = _row.value;
    }
    console.log({ rowData, row });

    newData.push(rowData);
  }
  const column: any[] = [];

  column.push({
    title: "#",
    key: "index",
    width: "80px",
    align: "center",
    render: (_: any, record: { key: number }) => <p>{record.key + 1}</p>,
  });
  let cal = 0;
  columns.map((_column: any) => {
    let tableWidth = (25 / 100) * 1220;
    let canEdit: boolean = true;

    if (
      _column.control.template.attribute.widthInTable &&
      _column.control.template.attribute.widthInTable > 0
    ) {
      const width = Number(_column.control.template.attribute.widthInTable);
      tableWidth = (width / 100) * 1220;
    }
    cal += 200;

    column.push({
      title: (
        <div className="label-text-container-table table-control-header">
          <div className="table-control-headtext">
            <span className="headtext-form">{_column.label}</span>
            {_column.control.template.attribute.require === "Y" && (
              <span style={{ color: "red" }}>*</span>
            )}
          </div>

          <span className="table-control-header-span">{_column.alter}</span>
        </div>
      ),
      dataIndex: _column.label,
      editable: canEdit,
      width: tableWidth,
    });
  });
  // console.log({ eee: column });

  return { column, newData };
};
