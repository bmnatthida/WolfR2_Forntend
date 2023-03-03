import {
  AutoComplete,
  Col,
  DatePicker,
  Row,
  Table,
  TablePaginationConfig,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import "../Table.css";
import SortingButton from "../../ButtonComponents/SortingButton";
import { sorterFunc } from "../../../Helper/SortingFunction";
import moment from "moment";
import { Button } from "primereact/button";
import { exportExcel } from "../../../Helper/ExportExcel";
import { updateDynamic } from "../../../Services/DynamicService";
import { useLocation } from "react-router";
import { useUserContext } from "../../../Context/UserContext";
import { IPaging } from "../../../IRequestModel/IPaginationOptionModel";
const { RangePicker } = DatePicker;

type Props = {
  tableName: string;
  dataSource: any[];
  customColumns?: any[];
  setItemsCount?: (value: number) => void;
  canExport: boolean;
  setLoad?: (value: boolean) => void;
  actionBodyTemplate?: any;
  customImportFileButton?: any;
  rowClickAction?: any;
  canEdit?: any;
  toast?: any;
  loading?: boolean;
  reloadData?: (apiName: string) => void;
  VersionTempVCProps?: any;
  paginationOption?: TablePaginationConfig;
  onPageChange?: (paginationValue: IPaging) => void;
};

type ITableFilter = {
  key: string;
  type: string;
  sortType: "dec" | "asc" | null;
  value: any;
};

const DynamicTable = ({
  tableName,
  dataSource,
  customColumns,
  canExport,
  setItemsCount,
  setLoad,
  canEdit,
  actionBodyTemplate,
  rowClickAction,
  reloadData,
  customImportFileButton,
  loading,
  paginationOption,
  onPageChange,
}: Props) => {
  const location = useLocation();
  const [toggleSelect, setToggleSelect] = useState<boolean>(false);
  const [allColumns, setAllColumns] = useState<any>();
  const [selectedColumns, setSelectedColumns] = useState<any>([]);
  const [showData, setShowData] = useState<any>([]);
  const [isHoverAction, setIsHoverAction] = useState<boolean>(false);
  const [filters, setFilters] = useState<ITableFilter[]>();
  const [canOpenMemo, setCanOpenMemo] = useState<boolean>(false);
  const [userData, setUserData] = useUserContext();
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [importLoading, setImportLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dataSource) {
      setToggleSelect(true);
      GetFilter();
    }
  }, [dataSource]);

  useEffect(() => {
    if (filters) {
      if (filters.length > 0) {
        GetColumns(filters);
      }
    }
  }, [filters]);

  useEffect(() => {
    if (allColumns) {
      setSelectedColumns([
        ...allColumns.filter((e: any) => !e.key.toLowerCase().includes("id")),
      ]);
    }
  }, [allColumns]);

  useEffect(() => {
    if (showData) {
      if (setItemsCount) {
        setItemsCount(showData.length);
      }
    }
  }, [showData]);

  // useEffect(() => {
  //   if (filters) {
  //     if (filters.length > 0) {
  //       filterFunc();
  //     }
  //   }
  // }, [filters]);

  const formatData = (_allColumns: any[]) => {
    let _data = dataSource;
    _allColumns.forEach((col: any) => {
      if (
        col.key.toLowerCase().includes("date") ||
        col.key.toLowerCase().includes("วัน") ||
        col.filterType === "d"
      ) {
        _data.forEach((e: any) => {
          if (e[col.key] && e[col.key] !== "") {
            let newDate = formatDate(e[col.key]);
            if (newDate !== "Invalid date") {
              e[col.key] = newDate;
            } else {
              let someDateString = moment(e[col.key], "MM/DD/YYYY");
              newDate = moment(someDateString).format("DD MMM yyyy");
              if (newDate !== "Invalid date") {
                e[col.key] = newDate;
              } else {
                newDate = moment(e[col.key]).format("DD MMM yyyy");
                if (newDate !== "Invalid date") {
                  e[col.key] = newDate;
                } else {
                  let someDateString = moment(e[col.key], "DD/MM/YYYY");
                  newDate = moment(someDateString).format("DD MMM yyyy");
                  if (newDate !== "Invalid date") {
                    e[col.key] = newDate;
                  }
                }
              }
            }
          }
        });
      } else {
        _data.forEach((e: any) => {
          if (typeof e[col.key] === "boolean") {
            e[col.key] = e[col.key].toString();
          } else if (e[col.key] === 0 || e[col.key] === null) {
            e[col.key] = "";
          }
        });
      }
      // else {
      //   _data.forEach((e: any) => {
      //     console.log("table=>key", col.key);

      //     if (e[col.key] === 0 || e[col.key] === null) {
      //       e[col.key] = "";
      //     }
      //   });
      // }
    });

    setShowData([..._data]);
  };

  const formatDate = (value: any) => {
    if (value != "") {
      let someDateString = moment(new Date(value), "DD/MM/YYYY HH:mm:ss");
      const NewDate = moment(someDateString).format("DD MMM yyyy");
      return NewDate;
    } else {
      return "";
    }
  };

  const GetColumns = (tableFilter: ITableFilter[]) => {
    try {
      let columns: any[] = [];
      let _filters: ITableFilter[] = [];
      if (customColumns) {
        columns = getsettingReportTableColumns(customColumns, tableFilter);
      } else {
        columns = getsettingTableColumns(tableFilter);
      }
      formatData(columns);
      setFilters([..._filters]);
      setAllColumns([...columns]);
    } catch (error) {}
  };

  const GetFilter = () => {
    let _filters: ITableFilter[] = [];
    try {
      if (customColumns) {
        customColumns.forEach((colField: any) => {
          const filter: ITableFilter = {
            key: colField.key,
            type: "",
            sortType: null,
            value: "",
          };
          if (colField.FieldTypeFilterDynamic) {
            const colType = colField.FieldTypeFilterDynamic;
            if (colType === "c") {
              filter.type = "number";
            } else if (colType === "d") {
              filter.type = "date";
            } else {
              filter.type = "text";
            }
          } else if (colField.FieldTypeFilterStatic) {
            const colType = colField.FieldTypeFilterDynamic;
            if (
              colType === "Datetime" ||
              colField.key.toLowerCase().includes("date") ||
              colField.key.toLowerCase().includes("วัน")
            ) {
              filter.type = "date";
            } else {
              filter.type = "text";
            }
          }
          _filters.push(filter);
        });
      } else {
        Object.keys(dataSource[0] ? dataSource[0] : "").map(
          (key: string, idx: number) => {
            const filter: ITableFilter = {
              key: key,
              type:
                key.toLowerCase().includes("date") ||
                key.toLowerCase().includes("วัน")
                  ? "date"
                  : typeof dataSource[0][key],
              sortType: null,
              value: "",
            };
            _filters.push(filter);
          }
        );
      }
      // return _filters;
      setFilters([..._filters]);
    } catch (error) {
      return _filters;
    }
  };

  const getsettingReportTableColumns = (
    customColumns: any[],
    tableFilter: ITableFilter[]
  ) => {
    let columns: any[] = [];
    customColumns.forEach((colField: any) => {
      const colWidth = Math.max(
        getWitdthFormText(colField.dispalyLebelAndAlter) * 2.5 + 20,
        getWitdthFormText(dataSource[0][colField.key])
      );

      if (colField.key !== "operation") {
        columns.push({
          title: () => {
            return (
              <div className="table-title">
                <Row>
                  <Col xl={24}>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Col xl={15}>
                        <span className="headtext-form">
                          {colField.dispalyLebelAndAlter}
                        </span>
                      </Col>
                      <Col xl={6}>
                        {getSorterButton(colField.key, tableFilter)}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col xl={24}>
                    {tableFilter &&
                      getInputFilter(
                        tableFilter,
                        tableFilter.filter(
                          (e: ITableFilter) => e.key === colField.key
                        )[0]
                      )}
                  </Col>
                </Row>
              </div>
            );
          },
          dataIndex: colField.key,
          key: colField.key,
          filterType: colField.FieldTypeFilterDynamic,
          width:
            colField.key.toLowerCase().includes("date") ||
            colField.key.toLowerCase().includes("วัน")
              ? 250
              : colWidth,
        });
      }
    });
    return columns;
  };

  const getsettingTableColumns = (tableFilter: ITableFilter[]) => {
    let columns: any[] = [];
    if (canEdit) {
      columns.push({
        key: "operation",
        align: "center",
        fixed: "left",
        width: 50,
        render: (_: any, record: any) => {
          if (actionBodyTemplate) {
            return (
              <div
                onMouseOver={(e: any) => setIsHoverAction(true)}
                onMouseLeave={(e: any) => setIsHoverAction(false)}
              >
                {actionBodyTemplate(record)}
              </div>
            );
          }
        },
      });
    }

    Object.keys(dataSource[0] ? dataSource[0] : "").map(
      (key: string, idx: number) => {
        const colWidth = Math.max(
          getWitdthFormText(key) * 3 + 20,
          getWitdthFormText(dataSource[0][key])
        );
        if (key !== "operation" && key.toLowerCase() !== "password") {
          if (key !== "SignPicPath" && key !== "UrlLogo") {
            if (key === "AmountFrom_AmountTo") {
              columns.push({
                title: () => {
                  return (
                    <div className="table-title">
                      <Row>
                        <Col xl={24}>
                          <Row style={{ justifyContent: "space-between" }}>
                            <Col xl={18}>
                              <span className="headtext-form">{key}</span>
                            </Col>
                            <Col xl={4}>
                              {getSorterButton(key, tableFilter)}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={24}>
                          {tableFilter &&
                            getInputFilter(
                              tableFilter,
                              tableFilter.filter(
                                (e: ITableFilter) => e.key === key
                              )[0]
                            )}
                        </Col>
                      </Row>
                    </div>
                  );
                },
                dataIndex: key,
                key: key,
                ellipsis: {
                  showTitle: false,
                },
                width: colWidth,
                render: (record: any) => {
                  const dd = record.split(":");
                  let htmlBody: any[] = [];
                  dd.forEach((data: any, idx: number) => {
                    if (idx < 4) {
                      htmlBody.push(<p>{data}</p>);
                    } else {
                      htmlBody.push(<p>.......</p>);
                    }
                  });
                  return <>{htmlBody}</>;
                },
              });
            } else if (key === "TemplateName") {
              columns.push({
                title: () => {
                  return (
                    <div className="table-title">
                      <Row>
                        <Col xl={24}>
                          <Row style={{ justifyContent: "space-between" }}>
                            <Col xl={18}>
                              <span className="headtext-form">{key}</span>
                            </Col>
                            <Col xl={4}>
                              {getSorterButton(key, tableFilter)}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={24}>
                          {tableFilter &&
                            getInputFilter(
                              tableFilter,
                              tableFilter.filter(
                                (e: ITableFilter) => e.key === key
                              )[0]
                            )}
                        </Col>
                      </Row>
                    </div>
                  );
                },

                key: key,
                render: (_: any, record: any) => {
                  return (
                    <span>
                      {record[key]}
                      {record.isPublishVersion === "true" && (
                        <Tag color="#007bff" style={{ borderRadius: "6px" }}>
                          Public
                        </Tag>
                      )}
                      {record.isEditing === "true" && (
                        <Tag color="#dc3545" style={{ borderRadius: "6px" }}>
                          Editing
                        </Tag>
                      )}
                    </span>
                  );
                },
                width: 350,
              });
            } else {
              columns.push({
                title: () => {
                  return (
                    <div className="table-title">
                      <Row>
                        <Col xl={24}>
                          <Row style={{ justifyContent: "space-between" }}>
                            <Col xl={18}>
                              <span className="headtext-form">
                                {key === "Delegate_To" ? "Delegate To" : key}
                              </span>
                            </Col>
                            <Col xl={4}>
                              {tableFilter && (
                                <>{getSorterButton(key, tableFilter)}</>
                              )}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={24}>
                          {tableFilter &&
                            getInputFilter(
                              tableFilter,
                              tableFilter.filter(
                                (e: ITableFilter) => e.key === key
                              )[0]
                            )}
                        </Col>
                      </Row>
                    </div>
                  );
                },
                dataIndex: key,
                key: key,
                width:
                  key.toLowerCase().includes("date") ||
                  (key.toLowerCase().includes("วัน") &&
                    tableName !== "Time Stamp")
                    ? 250
                    : key.toLowerCase() === "nameth" ||
                      key.toLowerCase() === "nameen"
                    ? 250
                    : colWidth,
              });
            }
          }
        }
      }
    );
    return columns;
  };

  const getWitdthFormText = (str: string) => {
    var canvas = document.createElement("canvas");

    var ctx = canvas.getContext("2d");
    var width: number = 0;

    if (ctx) {
      ctx.font = "14px ";
      width = ctx.measureText(str).width;
    }
    return width;
  };

  const getSorterButton = (key: string, tableFilter: ITableFilter[]) => {
    return (
      <SortingButton
        sortType={
          tableFilter.find((e: ITableFilter) => e.key === key)
            ? tableFilter.find((e: ITableFilter) => e.key === key)?.sortType
            : "asc"
        }
        onClick={(type: "dec" | "asc" | null) => {
          // let _data: any[] = dataSource;
          tableFilter.map((e: ITableFilter) => {
            if (e.key === key) {
              if (e.sortType === "dec") {
                e.sortType = "asc";
              } else {
                e.sortType = "dec";
              }
            } else {
              e.sortType = null;
            }
          });

          filterFunc(key, type);

          // setShowData([
          //   ..._data.sort((a: any, b: any) => {
          //     return sorterFunc(a, b, key, type);
          //   }),
          // ]);
        }}
      />
    );
  };

  const getInputFilter = (
    tableFilter: ITableFilter[],
    rowFilter: ITableFilter
  ) => {
    if (rowFilter) {
      if (rowFilter.type === "date") {
        return (
          <div className="setting-table">
            <RangePicker
              format={"DD MMM YYYY"}
              // id Startdate
              id="StartDate"
              style={{ borderRadius: "6px" }}
              onChange={(e: any) => {
                let _filters: ITableFilter[] = tableFilter;
                if (e) {
                  let value: any[] = e.map(
                    (val: any) => (val = moment(val).format("DD MMM YYYY"))
                  );
                  _filters.forEach((filter: ITableFilter) => {
                    if (filter.key === rowFilter.key) {
                      filter.value = value;
                    }
                  });
                  // setFilters([..._filters]);
                } else {
                  _filters.forEach((filter: ITableFilter) => {
                    if (filter.key === rowFilter.key) {
                      filter.value = "";
                    }
                  });
                  // setFilters([..._filters]);
                }
                filterFunc();
              }}
              ranges={{
                Today: [moment(), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
                "This Year": [moment().startOf("year"), moment().endOf("year")],
              }}
              allowClear
            />
          </div>
        );
      } else {
        let uniq: Set<any> = new Set<any>();
        let options: any[] = [];
        if (rowFilter.type === "boolean") {
          dataSource.forEach((e: any) => {
            if (e[rowFilter.key]) {
              e[rowFilter.key] = e[rowFilter.key].toString();
            } else {
              e[rowFilter.key] = "";
            }
          });
        }
        dataSource.forEach((e: any) => {
          if (e[rowFilter.key] !== "") {
            const isDuplicate = uniq.has(e[rowFilter.key]);
            uniq.add(e[rowFilter.key]);
            if (!isDuplicate) {
              options.push({ value: e[rowFilter.key] });
            }
          }
        });

        return (
          <div className="setting-table">
            <AutoComplete
              
              options={options}
              placeholder={"Search by " + rowFilter.key}
              id={rowFilter.key}
              // id={replaceSpecialChar(rowFilter.key??"")}
              filterOption={(inputValue, option) =>
                option.value
                  ?.toString()
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              onChange={(e: any) => {
                try {
                  let value = e;
                  let _filters: ITableFilter[] = tableFilter;
                  _filters.forEach((filter: ITableFilter) => {
                    if (filter.key === rowFilter.key) {
                      filter.value = value;
                    }
                  });
                  filterFunc();
                } catch (error) {
                  console.log("table=>onFilter=>error", error);
                }
              }}
              className={"table-search"}
              onBlur={(e: any) => {
                try {
                  let value = e.target.value;
                  let _filters: ITableFilter[] = tableFilter;
                  _filters.forEach((filter: ITableFilter) => {
                    if (filter.key === rowFilter.key) {
                      filter.value = value;
                    }
                  });
                  filterFunc();
                } catch (error) {
                  console.log("table=>onFilter=>error", error);
                }
              }}
              onSelect={(e: any) => {
                try {
                  let value = e;
                  let _filters: ITableFilter[] = tableFilter;
                  _filters.forEach((filter: ITableFilter) => {
                    if (filter.key === rowFilter.key) {
                      filter.value = value;
                    }
                  });
                  filterFunc();
                } catch (error) {
                  console.log("table=>onFilter=>error", error);
                }
              }}
              allowClear
              onClear={() => {
                let _filters: ITableFilter[] = tableFilter;
                _filters.forEach((filter: ITableFilter) => {
                  if (filter.key == rowFilter.key) {
                    filter.value = "";
                  }
                });
                filterFunc();

                // setFilters([..._filters]);
              }}
            />
          </div>
        );
      }
    }
  };

  const filterFunc = (key?: string, type?: "dec" | "asc" | null) => {
    try {
      let _data: any[] = dataSource;

      filters?.forEach((filter: ITableFilter) => {
        if (filter.value !== "" && filter.value !== "Invalid date") {
          if (filter.type === "number") {
            _data = _data.filter((e: any) => {
              return e[filter.key] == Number(filter.value);
            });
          } else if (filter.type === "date") {
            const startDate = new Date(filter.value[0]);
            const endDate = new Date(filter.value[1]);
            _data = _data.filter((e: any) => {
              let date = new Date(e[filter.key]);
              if (date.toString() !== "Invalid Date") {
                return date >= startDate && date <= endDate;
              }
            });
          } else {
            _data = _data.filter((e: any) =>
              e[filter.key]
                ?.toString()
                ?.toLowerCase()
                .includes(filter.value.toLowerCase())
            );
          }
        }
      });

      if (key && type) {
        _data.sort((a: any, b: any) => {
          return sorterFunc(a, b, key, type);
        });
      }
      setShowData([..._data]);
    } catch (error) {
      console.log("table=>filterFunc=>error", error);
    }
  };

  const onColumnToggle = (event: any) => {
    try {
      let selectedColumns = event.value;

      let orderedSelectedColumns = allColumns.filter((col: any) =>
        selectedColumns.some(
          (sCol: any) =>
            sCol.dataIndex === col.dataIndex || col.key === "operation"
        )
      );
      setSelectedColumns(orderedSelectedColumns);
    } catch (error) {
      console.log("table=>onColumnToggle=>error", error);
    }
  };

  function reconStructionForShowData() {
    try {
      let dataShow: any = [];
      dataSource.map((data: any) => {
        let dataField: any = {};
        allColumns.forEach((col: any) => {
          if (!col.key.toLowerCase().includes("id")) {
            selectedColumns.forEach((selCol: any) => {
              if (col.key === selCol.key) {
                dataField[selCol.key] = data[selCol.key];
              }
            });
          } else {
            dataField[col.key] = data[col.key];
          }
        });
        dataShow.push(dataField);
      });

      return dataShow;
    } catch (error) {
      console.log("table=>reconStructionForShowData=>error", error);
    }
  }

  const renderHeader1 = () => {
    try {
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

        return (
          <>
            <Col style={{ textAlign: "left" }}>
              <MultiSelect
                // id
                
                value={showSelCol}
                options={showCol}
                optionLabel="dataIndex"
                showSelectAll={toggleSelect}
                onHide={() => {
                  try {
                    const recon = reconStructionForShowData();
                    const uniqueArray = recon.filter(
                      (value: any, index: any) => {
                        const _value = JSON.stringify(value);
                        return (
                          index ===
                          recon.findIndex((obj: any) => {
                            return JSON.stringify(obj) === _value;
                          })
                        );
                      }
                    );
                    setShowData([...uniqueArray]);
                  } catch (error) {
                    console.log("table=>onHide=>error", error);
                  }
                }}
                onChange={onColumnToggle}
                placeholder="Select columns"
                style={{ width: "20em" }}
              />
            </Col>
            {canExport && (
              <>
                <Col
                  style={{ textAlign: "right" }}
                  className="Button-canExport"
                >
                  <Button
                    label="Export to excel"
                    icon="pi pi-file-excel"
                    data-pr-tooltip="XLS"
                    loading={exportLoading}
                    onClick={async () => {
                      await exportExcel(
                        tableName,
                        reconStructionForExport(),
                        setExportLoading
                      );
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
                  {!location.pathname.includes("DynamicReport") &&
                    !location.search?.includes("DelegateList") &&
                    !location.search?.includes("TimeStamp") && (
                      <>
                        {customImportFileButton ? (
                          customImportFileButton
                        ) : (
                          <>
                            {" "}
                            <input
                              type="file"
                              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              onChange={importExcel}
                              style={{ display: "none" }}
                              id="file"
                            />
                            <label
                              htmlFor="file"
                              style={{
                                height: "38px",
                                background: " #28a745",
                                border: "1px solid #28a745",
                                color: "#ffffff",
                                fontSize: "13px",
                                borderRadius: "6px",
                                width: "11rem",
                                margin: " 0px 11px 0px 0px",
                              }}
                              className="import"
                            >
                              <span
                                style={{
                                  fontWeight: "normal",
                                  marginTop: "8px",
                                  display: "flex",
                                  justifyContent: "center",
                                  margin: "7px 3px 0px 5px",
                                  cursor: "pointer",
                                }}
                                className="import"
                              >
                                <i
                                  className="pi pi-file-excel"
                                  style={{ margin: "4px 5px 0px 5px" }}
                                ></i>
                                Import From excel
                              </span>
                            </label>
                          </>
                        )}
                      </>
                    )}
                </Col>
              </>
            )}
          </>
        );
      }
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  const importExcel = async (e: any) => {
    const file = e.target.files[0];
    try {
      import("xlsx").then((xlsx) => {
        const reader = new FileReader();
        try {
          reader.onload = async (e: any) => {
            const wb = xlsx.read(e.target.result, { type: "array" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
            const cols: any = data[0];
            data.shift();
            let _importedData = data.map((d: any) => {
              return cols.reduce((obj: any, c: any, i: any) => {
                obj[c] = d[i];
                return obj;
              }, {});
            });
            if (_importedData.length !== 0) {
              let res = null;
              for (let i = 0; i < _importedData.length; i++) {
                const element = _importedData[i];
                var apiNamereplace = tableName?.replace("/GetAll", "");
                if (
                  !_importedData[i][apiNamereplace + "Id"] ||
                  _importedData[i][apiNamereplace + "Id"] === ""
                ) {
                  _importedData[i].CreatedBy = userData.EmployeeId.toString();
                  _importedData[i].ModifiedBy = userData.EmployeeId.toString();
                } else {
                  _importedData[i].ModifiedBy = userData.EmployeeId.toString();
                }
                setImportLoading(true);

                res = await updateDynamic(apiNamereplace, element);
              }

              if (res.result === "success") {
                if (reloadData) {
                  reloadData(tableName);
                }
              }
              setImportLoading(false);
            }
          };

          reader.readAsArrayBuffer(file);
        } catch (error) {
          setImportLoading(false);
        }
      });
    } catch (error) {
      setImportLoading(false);
    }
    e.target.value = null;
  };

  function reconStructionForExport() {
    try {
      let dataExport: any = [];
      showData.forEach((data: any) => {
        let dataField: any = {};
        if (customColumns) {
          customColumns?.forEach((col: any) => {
            if (col.key !== "operation") {
              if (col.key.toLowerCase().includes("id")) {
                dataField[col.dispalyLebelAndAlter] = data[col.key];
              } else {
                selectedColumns.forEach((selCol: any) => {
                  if (selCol.key === col.key) {
                    dataField[col.dispalyLebelAndAlter] = data[col.key];
                  }
                });
              }
            }
          });
        } else {
          allColumns.forEach((allCol: any) => {
            if (allCol.key !== "operation") {
              if (allCol.key.toLowerCase().includes("id")) {
                dataField[allCol.key] = data[allCol.key];
              } else {
                selectedColumns.forEach((selCol: any) => {
                  if (selCol.key === allCol.key) {
                    dataField[selCol.key] = data[selCol.key];
                  }
                });
              }
            }
          });
        }
        dataExport.push(dataField);
      });

      return dataExport;
    } catch (error) {
      console.log("table=>error", error);
    }
  }

  return (
    <>
      <div className="dynamictable-container">
        <Row className="dynamictable-header">{renderHeader1()}</Row>
        <Row>
          <Col>
            <Table
              dataSource={showData}
              columns={selectedColumns}
              loading={loading || importLoading}
              size="middle"
              scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
              showHeader
              rowClassName={canOpenMemo || rowClickAction ? "row-pointer" : ""}
              className="setting-datatable"
              pagination={
                paginationOption
                  ? paginationOption
                  : { pageSize: 10, showSizeChanger: false }
              }
              onRow={(record: any, rowIndex: any) => {
                return {
                  onClick: (event: any) => {
                    if (rowClickAction) {
                      if (!isHoverAction) {
                        rowClickAction(record, rowIndex, event);
                      }
                    }
                  }, // click row
                  onDoubleClick: (event: any) => {}, // double click row
                  onContextMenu: (event: any) => {}, // right button click row
                  onMouseEnter: (event: any) => {
                    if (record["Memo_MemoId"]) {
                      setCanOpenMemo(true);
                    }
                  }, // mouse enter row
                  onMouseLeave: (event: any) => {
                    setCanOpenMemo(false);
                  }, // mouse leave row
                };
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DynamicTable;
