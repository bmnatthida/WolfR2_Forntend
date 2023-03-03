import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { TieredMenu } from "primereact/tieredmenu";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { SummaryComponent } from "../SummaryComponent/SummaryComponent";

type Props = {
  template: any;
  value: any;
  ss?: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: any;
  renderInTable?: string;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: any;
};

export const TableComponentFix = (props: Props) => {
  const dynamicColumns = props.template.attribute.column.map(
    (col: any, colIdx: any) => {
      let type = col.control.template.type;
      var percents = 0;
      if (document?.getElementById("table-Control")?.offsetWidth) {
        var percents =
          document?.getElementById("table-Control")?.offsetWidth - 80;
      }
      const colWidth =
        col.control.template.attribute.widthInTable !== undefined &&
        col.control.template.attribute.widthInTable !== "0"
          ? col.control.template.attribute.widthInTable * (percents / 100) +
            "px"
          : 25 * (percents / 100) + "px";
      return (
        <Column
          columnKey={col.control.template.label}
          style={{
            flexGrow: 1,
            flexBasis: colWidth,
          }}
          header={() => {
            return (
              <>
                <div className="label-text-container table-control-header">
                  <div className="table-control-headtext">
                    <span className="headtext-form">{col.label}</span>
                    {col.control.template.attribute.require === "Y" && (
                      <span className="headtext-form text-Is-require">*</span>
                    )}
                  </div>

                  <span className="table-control-header-span">
                    {col.control.template.alter}
                  </span>
                </div>
              </>
            );
          }}
          bodyStyle={{ verticalAlign: "top" }}
          body={(rowData: any, options: any) => {
            console.log("table=>rowData", rowData);

            if (type === "ta") {
            } else if (type === "dd") {
            } else if (type === "l") {
            } else if (type === "c") {
            } else if (type === "cb") {
            } else if (type === "l") {
            } else if (type === "t") {
            } else if (type === "r") {
            } else if (type === "d") {
            } else if (type === "bt") {
            } else if (type === "id") {
              return <>1</>;
            } else if (type === "action") {
              return <InputText value={"1"} />;
            }
          }}
        />
      );
    }
  );

  function createRowCopy() {
    let newRowCopy: any[] = [];
    props.template.attribute.column.map((col: any, i: any) => {
      let type = col.control.template.type;
      if (type == "cb") {
        let items: any[] = [];
        col.control.template.attribute.items.map((item: any) => {
          items.push(item.checked);
        });

        newRowCopy.push({
          value:
            col.control.data.value == undefined || null
              ? ""
              : col.control.data.value,
          item: items,
        });
      } else if (type == "dd") {
        newRowCopy.push({
          value:
            col.control.data.value == undefined || null
              ? ""
              : col.control.data.value,
          item: col.control.template.attribute.items[0].item,
        });
      } else {
        newRowCopy.push({
          value:
            col.control.data.value == undefined || null
              ? ""
              : col.control.data.value,
        });
      }
    });

    return newRowCopy;
  }

  function onChanceTable(dataRequest: any, rowIdx: number, colIdx: number) {
    let str: string = JSON.stringify(props.value.row);
    let _rows: any[] = JSON.parse(str);
    console.log("table=>old", props.value.row);
    _rows[rowIdx][colIdx].value = dataRequest.value;
    console.log("table=>new", _rows);
    props.onChangeEditForm({ row: _rows });
  }

  const addRowTo = (rowData: any, addTo: number) => {
    try {
      setLoading(true);
      let rows = row !== null ? [...row] : [];
      let updateRow = rowData;
      let newRow = createRowCopy();
      for (let i = 0; i < newRow.length; i++) {
        if (updateRow[i].item !== undefined) {
          newRow[i].value = updateRow[i].value;
          newRow[i].item = updateRow[i].item;
        } else {
          newRow[i].value = updateRow[i].value;
        }
      }
      rows.splice(addTo, 0, newRow);
      // setRow([...rows]);
      props.onChangeEditForm({ row: [...rows] }, props.rowIdx, props.colIdx);
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  const actionBodyTemplate = (rowData: any, options: any) => {
    const items = [
      {
        label: "Create new item",
        icon: "pi pi-fw pi-plus",
        items: [
          {
            label: "Create new item above",
            icon: "pi pi-fw pi-plus",
            command: () => {
              const copyData = createRowCopy();
              //   addRowTo(copyData, options.rowIndex);
            },
          },
          {
            label: "Create new item below",
            icon: "pi pi-fw pi-plus",
            command: () => {
              const copyData = createRowCopy();
              //   addRowTo(copyData, options.rowIndex + 1);
            },
          },
        ],
      },
      {
        label: "Move to",
        icon: "pi pi-fw pi-sort-alt",
        command: () => {
          //   setFromIndex(options.rowIndex);
          //   setDialogVisible(true);
        },
      },
      {
        label: "Duplicate",
        icon: "pi pi-fw pi-copy",
        command: () => {
          //   duplicate(rowData, options.rowIndex);
        },
      },
      {
        label: "Delete",
        icon: "pi pi-fw pi-trash",
        command: () => {
          //   confirmDelete(options.rowIndex);
        },
      },
    ];
    return (
      <React.Fragment>
        <TieredMenu
          model={items}
          popup
          //   ref={(el) => (menu.current[options.rowIndex] = el)}
        />

        <i
          className=" header-click"
          //   onClick={(event) => menu.current[options.rowIndex].toggle(event)}
        >
          <IoEllipsisVertical className="pi pi-bars" />
        </i>
      </React.Fragment>
    );
  };

  const addRow = (rows: any, onChangeFunc: any) => {
    console.log("table=>old", rows);
    let _rows: any[] = rows !== null ? rows : [];
    let newRow = createRowCopy();
    _rows.push(newRow);
    console.log("table=>new", _rows);
    onChangeFunc({ row: [..._rows] });
    // append([newRow]);
  };

  function addbits(s: any) {
    try {
      let newForm = s.split("=");
      var total = 0;
      total = eval(newForm[0]);
      return total;
    } catch (error) {
      console.log("table=>error: ", error);
    }
  }

  // function summaryFunc() {
  //   try {
  //     const formulas = props.template.formula.split("|");
  //     const rows = getValues().rows;
  //     console.log(rows);

  //     formulas.map((formula: string) => {
  //       const resulstField = formula.split("=");
  //       let resultColIdx = -1;
  //       let result: number | undefined = 0;
  //       const cols = props.template.attribute.column;
  //       rows.map((row: any, rowIdx: number) => {
  //         let formu: any = resulstField[0];
  //         const allField =
  //           formu.match(/[a-zA-Z': `ก-๏]+[ a-zA-Z :'`ก-๏]/g) || [];
  //         cols.map((col: any, colIdx: number) => {
  //           if (col.control.template.type === "c") {
  //             const label = col.label;
  //             if (allField.includes(label)) {
  //               formu = formu.replace(
  //                 label,
  //                 Number(row[colIdx].value).toFixed(
  //                   Number(col.control.template.attribute.decimal)
  //                 ) !== "NaN"
  //                   ? Number(row[colIdx].value).toFixed(
  //                       Number(col.control.template.attribute.decimal)
  //                     )
  //                   : 0
  //               );
  //             } else if (resulstField[1] === label) {
  //               console.log("table=>label", label);
  //               resultColIdx = colIdx;
  //             }
  //           }
  //         });
  //         if (resultColIdx > -1) {
  //           let dd = formu.replaceAll(",", "");
  //           result = addbits(dd);
  //           if (result !== undefined && !isNaN(result)) {
  //             rows[rowIdx][resultColIdx].value = result.toFixed(
  //               Number(cols[resultColIdx].control.template.attribute.decimal)
  //             );
  //           }
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.log("table=>sum=>error", error);
  //   }
  // }

  // function sumValue(sumCol: number) {
  //   try {
  //     let rows = watchControl !== null ? [...watchControl] : [];
  //     let sum = 0;
  //     rows.map((row: any) => {
  //       sum = sum + Number(row[sumCol]?.value.replaceAll(",", ""));
  //     });
  //     return sum;
  //   } catch (error) {
  //     // console.log("table=>sumValue", error);
  //   }
  // }

  const renderTableFooter = () => {
    const attribute = props.template.attribute?.footerTable?.rows;
    let isSummary: boolean = false;
    let sumCol: number = -1;
    props.template.attribute.column.map((col: any, colIdx: any) => {
      if (col.control.template.attribute.summary === "Y") {
        isSummary = true;
        sumCol = colIdx;
      }
    });
    return (
      <Row>
        <Col xs={12} sm={12} xl={12} className={"footer-layout"}>
          {isSummary && (
            <Row>
              <Col xs={12} sm={12} xl={12}>
                <SummaryComponent
                  headtext="Total"
                  subtext="ยอดรวม"
                  // summaryProps={sumValue(sumCol)}
                />
              </Col>
            </Row>
          )}
          {attribute?.length > 0 &&
            attribute.map((row: any) => {
              return (
                <Row>
                  <Col xs={12} sm={12} xl={12}>
                    <SummaryComponent
                      headtext={row.label}
                      subtext=""
                      summaryProps={Number(row.value)}
                    />
                  </Col>
                </Row>
              );
            })}
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Col
        sm={props.col === undefined ? 12 : undefined}
        md={props.col === undefined ? props.colText : undefined}
        xs={props.col === undefined ? 12 : undefined}
        xl={props.col === undefined ? props.colText : undefined}
      >
        {props.renderInTable != "renderInTable" && (
          <tr>
            <th>
              <div className="label-text-container">
                <span className="headtext-form">
                  {props.template.label} {"Number"}
                </span>
                {props.template.attribute.require === "Y" && (
                  <span className="headtext-form text-Is-require">*</span>
                )}
              </div>
              <p className="subtext-form">
                {props.template.alter} {"Number"}
              </p>
            </th>
          </tr>
        )}
      </Col>
      <Col
        sm={props.col === undefined ? 12 : 12}
        md={props.col === undefined ? props.colAction : 12}
        xs={props.col === undefined ? 12 : 12}
        xl={props.col === undefined ? props.colAction : 12}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        <DataTable
          className="wolf-table"
          id="table-Control"
          value={props.value.row}
          stripedRows
          scrollable
          scrollHeight="flex"
          scrollDirection="both"
          size="small"
          footer={renderTableFooter()}
        >
          <Column
            header=""
            body={(row, options) => options.rowIndex + 1}
            style={{
              width: "20px",
              justifyContent: "center",
            }}
          />
          {dynamicColumns}
          {!props.statusMemoDetail && (
            <Column
              className="header-click"
              header={
                <i
                  className="pi pi-plus"
                  onClick={() =>
                    addRow(props.value.row, props.onChangeEditForm)
                  }
                ></i>
              }
              body={actionBodyTemplate}
              style={{
                justifyContent: "center",
              }}
            ></Column>
          )}
        </DataTable>
      </Col>
    </>
  );
};

export default TableComponentFix;
