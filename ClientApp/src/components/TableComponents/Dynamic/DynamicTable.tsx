import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { SplitButton } from "primereact/splitbutton";
import moment from "moment";
import "../Table.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DialogList } from "./DialogList";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import { GetAllDynamic, updateDynamic } from "../../../Services/DynamicService";
import { FilterMatchMode } from "primereact/api";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { GetAllApprovalMatrixItem } from "../../../Services/ApprovalMatrixService";
import {
  AutoComplete,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";
import {
  GetTemplateTemplateList,
  GetTemplateTemplateListVersion,
} from "../../../Services/TemplateService";
import { useUserContext } from "../../../Context/UserContext";
import useAlert from "../../../hooks/useAlert";
interface Props {
  tableName: string;
  apiName?: string;
  actionBody?: any;
  requestBody?: any;
  canExport?: boolean;
  canAction?: boolean;
  canReorderColumn?: boolean;
  rowClickFunc?: any;
  rowHover?: boolean;
  rowPointer?: boolean;
  onLoading?: boolean;
  setOnLoading?: (bool: boolean) => void;
  setItemsCount?: (num: number) => void;
  data?: any;
  visibleDialogAddProps?: any;
  isEditProps?: any;
  isDeleteProps?: any;
  displayFormDialog?: any;
  setDisplayFormDialog?: (bool: boolean) => void;
}

export const DynamicTable = (props: Props) => {
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;
  let minDate = new Date();
  const toast = useRef<any>(null);
  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);
  let maxDate = new Date();
  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);
  const history = useHistory();
  const { toggleAlert } = useAlert();
  const [dataDynamicTable, setDataDynamicTable] = useState<any>([]);
  const [showdataDynamicTable, setShowDataDynamicTable] = useState<any>([]);
  const [exportData, setExportData] = useState<any>([]);
  const [toggleSelect, setToggleSelect] = useState<boolean>(false);
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const [filters2, setFilters2] = useState<any>();
  const [showClearDate, setshowClearDatel] = useState(false);
  const [titleHead, setTitleHead] = useState<string>("");
  const [dataEdit, setDataEdit] = useState<any>({});
  const [checkAction, setCheckAction] = useState("");
  const [messageButtonDialog, setMessageButtonDialog] = useState("");
  const [visibleConfirm, setVisibleConfirm] = useState<any>(false);
  const [canReoderColumn, setCanReoderColumn] = useState(false);
  const [reportFileName, setReportFileName] = useState<string>();
  const [colletionField, setColletionField] = useState<any>();
  const [canTableAction, setCanTableAction] = useState(props.canAction);
  const [matrixItems, setMatrixItems] = useState<any[]>([]);
  const [columns, setColumns] = useState<any>([]);
  const [selectData, setSelectData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any>();
  const userData2 = JSON.parse(window.localStorage.getItem("userData"));
  const [userData] = useUserContext();

  const dt = useRef(null);

  const [selectedColumns, setSelectedColumns] = useState<any>([]);
  useEffect(() => {
    toggleLoading(true);
  }, []);
  useEffect(() => {
    toggleLoading(true);
    fetchData();
  }, [props.apiName, props.data]);

  useEffect(() => {
    if (props.visibleDialogAddProps) {
      if (
        props.visibleDialogAddProps === false &&
        props.apiName === "DynamicReport/GetAll" &&
        props.isEditProps !== true
      ) {
        toggleLoading(true);

        fetchData();
      }
    }
  }, [props.visibleDialogAddProps]);

  useEffect(() => {
    if (props.isDeleteProps !== undefined) {
      if (props.isDeleteProps) {
        toggleLoading(true);

        fetchData();
      }
    }
  }, [props.isDeleteProps]);

  useEffect(() => {
    if (!props?.displayFormDialog) {
      setDataEdit({});
    }
  }, [props?.displayFormDialog]);

  useEffect(() => {
    if (dataDynamicTable) {
      try {
        setToggleSelect(true);
        setDefSelected();
        getColumns();
        if (dataDynamicTable.length > 0) {
          if (dataDynamicTable[0] !== "") {
            dataDynamicTable.map((e: any, idx: number) => {
              e.rowIdx = idx;
            });
            setShowDataDynamicTable([...dataDynamicTable]);
          } else {
            setShowDataDynamicTable([]);
          }
        }
      } catch (error) {
        console.log("table=>error", error);
      }
    }
  }, [dataDynamicTable]);

  useEffect(() => {
    if (showdataDynamicTable) {
      setTimeout(() => {
        toggleLoading(false);
      }, 3000);
    }
  }, [showdataDynamicTable]);

  function toggleLoading(isload: boolean) {
    if (props.setOnLoading !== undefined) {
      props.setOnLoading(isload);
    }
  }

  useEffect(() => {
    setToggleSelect(true);
    setDefSelected();
    getColumns();
  }, []);

  useEffect(() => {
    var items_label = document.getElementsByClassName(
      "p-multiselect-items-label"
    );

    if (items_label.length > 0) {
      items_label[0].innerHTML = items_label[0].innerHTML.replace(
        "items",
        "columns"
      );
    }
  }, [selectedColumns]);

  // useEffect(() => {
  //   try {
  //     setShowDataDynamicTable([...dataDynamicTable]);
  //   } catch (error) {}
  // }, [exportData, dataDynamicTable]);

  useEffect(() => {
    try {
      setClearFilter(false);
      if (props.setItemsCount !== undefined) {
        props.setItemsCount(showdataDynamicTable.length);
      }
    } catch (error) {}
  }, [showdataDynamicTable]);

  function getColumns() {
    if (dataDynamicTable !== undefined) {
      let arrayDataColumn: any[] = [];
      if (colletionField !== undefined) {
        colletionField.map((collection: any, idx: number) => {
          if (collection.isChecked > 0) {
            arrayDataColumn.push({
              field: collection.key,
              header: collection.dispalyLebelAndAlter,
              alter: collection.alter,
              fieldTypeFilterDynamic: collection.FieldTypeFilterDynamic,
              seq: idx,
            });
          }
        });
      } else {
        Object.keys(
          dataDynamicTable[0] != undefined || dataDynamicTable[0] != null
            ? dataDynamicTable[0]
            : (dataDynamicTable[0] = "")
        ).map((key: any, idx: number) => {
          if (
            props.tableName === "Delegate List" ||
            props.tableName === "Template List"
          ) {
            if (key !== "ModifiedDate" && key !== "IsActive") {
              arrayDataColumn.push({
                field: key,
                header: key.replace("PosotionLevel", "PositionLevel"),
                dataType: typeof dataDynamicTable[0][key],
                seq: idx,
              });
            }
          } else {
            if (key !== "Memo_MAdvancveForm") {
              arrayDataColumn.push({
                field: key,
                header: key.replace("PosotionLevel", "PositionLevel"),
                dataType: typeof dataDynamicTable[0][key],
                seq: idx,
              });
            }
          }
        });
      }
      setColumns(arrayDataColumn);
      setSelectedColumns(arrayDataColumn);
    }
  }

  function setDefSelected() {
    let options: any = [];
    columns.map((e: any) => {
      if (e.field !== "Memo_MAdvancveForm" && !e.field.includes("Id")) {
        options.push(e);
      }
    });

    setSelectedColumns(options);
  }

  const fetchData = async () => {
    try {
      toggleLoading(true);

      let requestBody = undefined;
      setDataDynamicTable([]);
      setFilters2(null);

      if (props.requestBody != undefined) {
        requestBody = props.requestBody;
      }
      if (props.canReorderColumn != undefined) {
        setCanReoderColumn(props.canReorderColumn);
      }

      let _dataDynamic;
      if (props.data !== undefined) {
        _dataDynamic = props.data;
      } else if (props.apiName !== undefined) {
        if (props.apiName === "TemplateList/GetAll") {
          requestBody = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              CreatedBy: userData.EmployeeId.toString(),
              DepartmentId: userData.DepartmentId,
              Username: userData.Username,
            }),
          };
        }
        _dataDynamic = await GetAllDynamic(props.apiName, requestBody);

        if (props.apiName === "ApprovalMatrix/GetAll") {
          let matrixItem = await GetAllApprovalMatrixItem();
          if (matrixItem) {
            setMatrixItems([
              ...matrixItem.filter((e: any) => e.IsActive === true),
            ]);
          }
        }
        if (props.apiName === "TemplateList/GetAll") {
          _dataDynamic = _dataDynamic.filter((e: any) => e.IsActive === true);
        }
        // if (props.apiName === "TemplateList/GetAll") {
        //   const dataJson = {
        //     CreatedBy: userData.employeeData.EmployeeId.toString(),
        //     DepartmentId: userData.employeeData.DepartmentId,
        //   };
        //   console.log("table=>props.apiName", props.apiName);
        //   _dataDynamic = await GetTemplateTemplateListVersion(dataJson);
        // } else {
        //   _dataDynamic = await GetAllDynamic(props.apiName, requestBody);
        //   if (props.apiName === "ApprovalMatrix/GetAll") {
        //     let matrixItem = await GetAllApprovalMatrixItem();
        //     if (matrixItem) {
        //       setMatrixItems([
        //         ...matrixItem.filter((e) => e.IsActive === true),
        //       ]);
        //     }
        //   }
        // }
      }
      if (_dataDynamic !== undefined && _dataDynamic) {
        let myData: any = [];
        let newData: any = [];

        if (_dataDynamic.FieldCollection !== undefined) {
          setColletionField(JSON.parse(_dataDynamic.FieldCollection));
        }
        if (_dataDynamic.dt_Report === undefined) {
          myData = _dataDynamic[0];
          newData = _dataDynamic;
        } else {
          myData = _dataDynamic.dt_Report[0];
          newData = _dataDynamic.dt_Report;
        }

        let filters2: any = {};
        if (myData != undefined) {
          for (const [key, value] of Object.entries(myData)) {
            try {
              if (typeof value === "number") {
                filters2[key] = {
                  value: null,
                  matchMode: FilterMatchMode.EQUALS,
                };
              } else if (key.toLowerCase().includes("date")) {
                if (key === "DateFrom") {
                  filters2[key] = {
                    value: null,
                    matchMode: FilterMatchMode.DATE_AFTER,
                  };
                } else if (key === "DateTo") {
                  filters2[key] = {
                    value: null,
                    matchMode: FilterMatchMode.DATE_BEFORE,
                  };
                } else {
                  filters2[key] = {
                    value: null,
                    matchMode: FilterMatchMode.BETWEEN,
                  };
                }
              } else if (key.toLowerCase().includes("action")) {
                filters2[key] = {
                  value: null,
                  matchMode: FilterMatchMode.DATE_IS,
                };
              } else {
                filters2[key] = {
                  value: null,
                  matchMode: FilterMatchMode.CONTAINS,
                };
              }
            } catch (error) {}
          }
        }

        newData.map((e: any) => {
          Object.keys(newData[0]).map((key) => {
            if (
              key === "ModifiedDate" ||
              key.toLocaleLowerCase().includes("date") ||
              key.includes("วันที่")
            ) {
              if (e[key] !== null) {
                return (e[key] = new Date(e[key]));
              }
            } else if (
              typeof e[key] === "number" &&
              !key.toLowerCase().includes("id") &&
              !key.toLowerCase().includes("id") &&
              !key.toLowerCase().includes("modifiedby") &&
              !key.toLowerCase().includes("createdby")
            ) {
              e[key] = Number(e[key]);
            }
          });
        });

        if (_dataDynamic.ReportName != undefined) {
          setReportFileName(_dataDynamic.ReportName);
        }

        setFilters2(filters2);
        if (newData.length > 0) {
          setDataDynamicTable([...newData]);
          setExportData([...newData]);
        }
      }
    } catch (error) {
      console.log("DynamicTable=>Error", error);
      toggleLoading(false);
    }
  };

  const formatIsActive = (value: any) => {
    if (value == null) {
      return false;
    }
    return value.toString();
  };

  const statusItemTemplate = (option: any) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };
  const statusRowFilterTemplate = (option: any, label: string) => {
    if (clearFilter) {
      option.value = null;
      option.filterApplyCallback(null);
    }
    return (
      <Dropdown
        value={option.value}
        options={["true", "false"]}
        onChange={(e) => option.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder={"Search " + label}
        className="p-column-filter"
        showClear
      />
    );
  };

  const monthNavigatorTemplate = (e: any) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={(event: any) => e.onChange(event.originalEvent, event.value)}
        style={{ lineHeight: 1 }}
      />
    );
  };

  const dateFilterTemplate = (option: any, label: string) => {
    if (clearFilter) {
      option.value = null;
      option.filterApplyCallback(null);
    }
    return (
      <Calendar
        id="range"
        value={option.value}
        placeholder={"Search " + label}
        onChange={(e: any) => {
          setshowClearDatel(true);

          option.filterApplyCallback(e.value);
        }}
        monthNavigator
        yearNavigator
        yearRange={1980 + ":" + 2050}
        monthNavigatorTemplate={monthNavigatorTemplate}
        yearNavigatorTemplate={yearNavigatorTemplate}
        selectionMode="range"
        readOnlyInput
        dateFormat="dd M yy"
      />
    );
  };

  const normalFilterTemplate = (option: any, label: string) => {
    try {
      if (clearFilter) {
        option.value = "";
        option.filterApplyCallback(null);
      }
      if (option.filterModel.matchMode) {
        if (option.filterModel.matchMode === "equals") {
          return (
            <InputNumber
              id={option.field}
              value={option.value}
              placeholder={"Search " + label}
              onValueChange={(e) => option.filterApplyCallback(e.target.value)}
              mode="decimal"
              minFractionDigits={label !== "PositionLevel" ? 2 : 0}
            />
          );
        } else {
          return (
            <AutoComplete
              id={option.field}
              value={option.value}
              suggestions={filteredData}
              placeholder={"Search " + label}
              completeMethod={(e: AutoCompleteCompleteMethodParams) => {
                setTimeout(() => {
                  let datas: any[];
                  if (!e.query.trim().length) {
                    datas = [...dataDynamicTable];
                  } else {
                    datas = dataDynamicTable.filter((c: any) => {
                      return c[option.field]
                        ?.toLowerCase()
                        .startsWith(e.query.toLowerCase());
                    });
                  }
                  datas = getUnique(datas, option.field);
                  setFilteredData([...datas]);
                }, 250);
              }}
              onSelect={(e) => {
                option.filterApplyCallback(e.value[option.field]);
              }}
              field={option.field}
              onChange={(e) => {
                option.filterApplyCallback(e.value);
              }}
            />
          );
        }
      }
    } catch (error) {}
  };

  function getUnique(array: any[], key) {
    if (typeof key !== "function") {
      const property = key;
      key = function (item) {
        return item[property];
      };
    }
    return Array.from(
      array
        .reduce(function (map, item) {
          const k = key(item);
          if (!map.has(k)) map.set(k, item);
          return map;
        }, new Map())
        .values()
    );
  }

  const onColReorder = (colOrder: any) => {
    colOrder.columns.map((col: any, idx: number) => {
      selectedColumns.map((selCol: any) => {
        if (selCol.field === col.props.field) {
          selCol.seq = idx;
        }
      });
    });
    setSelectedColumns([
      ...selectedColumns.sort((a: any, b: any) => (a.seq > b.seq ? 1 : -1)),
    ]);
  };

  const formatDate = (value: any) => {
    if (value != "") {
      let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
      const NewDate = moment(someDateString).format("DD MMM yyyy");
      return NewDate;
    } else {
      return "";
    }
  };

  function reconStructionForExport() {
    try {
      let dataExport: any = [];

      exportData.map((data: any) => {
        let dataField: any = {};
        selectedColumns.map((col: any) => {
          if (col.fieldTypeFilterDynamic === "c") {
            if (data[col.field] !== null) {
              dataField[col.header] = data[col.field]?.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                }
              );
            }
          } else if (
            col.fieldTypeFilterDynamic === "d" ||
            col.field.toLowerCase().includes("date")
          ) {
            if (col.header.toLowerCase().includes("action")) {
              let newDate = data[col.field].toLocaleString("en-UK", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              if (newDate !== "Invalid date") {
                dataField[col.header] = newDate;
              }
            } else {
              let newDate = formatDate(data[col.field]);
              if (newDate !== "Invalid date") {
                dataField[col.header] = newDate;
              } else {
                let someDateString = moment(data[col.field], "MM/DD/YYYY");
                newDate = moment(someDateString).format("DD MMM yyyy");
                if (newDate !== "Invalid date") {
                  dataField[col.header] = newDate;
                } else {
                  newDate = moment(data[col.field]).format("DD MMM yyyy");
                  if (newDate !== "Invalid date") {
                    dataField[col.header] = newDate;
                  } else {
                    dataField[col.header] = "";
                  }
                }
              }
            }
          } else {
            dataField[col.header] = data[col.field];
          }
        });
        if (props.apiName === "MasterCompany/GetAll") {
          delete dataField["UrlLogo"];
        }
        dataExport.push(dataField);
      });
      return dataExport;
    } catch (error) {}
  }

  function reconStructionForShowData() {
    try {
      let dataShow: any = [];
      dataDynamicTable.map((data: any) => {
        let dataField: any = {};
        selectedColumns.map((col: any) => {
          if (col.fieldTypeFilterDynamic === "c") {
            if (data[col.field] !== null) {
              dataField[col.field] = data[col.field];
            }
          } else if (
            col.fieldTypeFilterDynamic === "d" ||
            col.header.toLowerCase().includes("date")
          ) {
            if (data[col.field] !== null && data[col.field] !== "") {
              dataField[col.field] = new Date(data[col.field]);
            }
          } else {
            dataField[col.field] = data[col.field];
          }
        });
        if (props.apiName === "MasterCompany/GetAll") {
          delete dataField["UrlLogo"];
        }
        dataShow.push(dataField);
      });

      return dataShow;
    } catch (error) {}
  }

  const actionLinkIReport = (rowData: any) => {
    return (
      <>
        <p
          className="card-text-detail"
          onClick={() => {
            const memoid = { MemoID: rowData.Memo_MemoId };
            window.open(`/Request?MemoID=${rowData.Memo_MemoId}`, "blank");
            // history.push(`/Request?MemoID=${rowData.Memo_MemoId}`, memoid);
          }}
        >
          <a
            style={{ color: "rgb(39, 105, 178)", textDecoration: "underline" }}
          >
            {rowData.Memo_DocumentNo}
          </a>
        </p>
      </>
    );
  };

  const dynamicColumns = selectedColumns.map((col: any) => {
    try {
      if (
        !col.field.includes("Form") &&
        col.field !== "ModifiedBy" &&
        col.field !== "CreatedBy"
      ) {
        if (
          col.field.toLowerCase().includes("isactive") ||
          col.field.toLowerCase().includes("ispublic") ||
          col.field.toLowerCase().includes("isprivate") ||
          col.field.toLowerCase().includes("InternalUrl")
        ) {
          return (
            <Column
              key={col.field}
              field={col.field}
              style={{ flexGrow: 1, flexBasis: "200px" }}
              body={(rowData: any) => {
                try {
                  return formatIsActive(rowData[col.field]);
                } catch (error) {}
              }}
              header={
                <div className="label-text-container table-control-header">
                  <div className="table-control-headtext">
                    <span className="headtext-form">{col.header}</span>
                  </div>

                  <span className="table-control-header-span">
                    {col.alter !== undefined && col.alter}
                  </span>
                </div>
              }
              sortable
              filter={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterMatchMode={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterElement={(option: any) =>
                statusRowFilterTemplate(option, col.header)
              }
              filterHeaderClassName={"gggg"}
              showClearButton={showClearDate}
              onFilterClear={() => setshowClearDatel(false)}
            />
          );
        } else if (
          col.field.includes("Date") ||
          col.field.includes("วันที่") ||
          col.fieldTypeFilterDynamic === "d"
        ) {
          return (
            <Column
              key={col.field}
              field={col.field}
              style={{ flexGrow: 1, flexBasis: "200px" }}
              header={
                <div className="label-text-container table-control-header">
                  <div className="table-control-headtext">
                    <span className="headtext-form">{col.header}</span>
                  </div>

                  <span className="table-control-header-span">
                    {col.alter !== undefined && col.alter}
                  </span>
                </div>
              }
              body={(rowData: any) => {
                try {
                  if (col.field.toLowerCase().includes("action")) {
                    if (
                      rowData[col.field] !== null &&
                      rowData[col.field] !== undefined &&
                      rowData[col.field] !== ""
                    ) {
                      let newDate = rowData[col.field].toLocaleString("en-UK", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      });
                      if (newDate !== "Invalid date") {
                        return newDate;
                      }
                    } else {
                      rowData[col.field] = null;
                      return "";
                    }
                  } else {
                    if (
                      rowData[col.field] !== null &&
                      rowData[col.field] !== undefined &&
                      rowData[col.field] !== ""
                    ) {
                      let newDate = formatDate(rowData[col.field]);
                      if (newDate !== "Invalid date") {
                        rowData[col.field] = new Date(newDate);
                        return newDate;
                      } else {
                        let someDateString = moment(
                          rowData[col.field],
                          "MM/DD/YYYY"
                        );
                        newDate = moment(someDateString).format("DD MMM yyyy");
                        if (newDate !== "Invalid date") {
                          rowData[col.field] = new Date(newDate);
                          return newDate;
                        } else {
                          newDate = moment(rowData[col.field]).format(
                            "DD MMM yyyy"
                          );
                          if (newDate !== "Invalid date") {
                            rowData[col.field] = new Date(newDate);
                            return newDate;
                          } else {
                            return "";
                          }
                        }
                      }
                    } else {
                      rowData[col.field] = null;
                      return "";
                    }
                  }
                } catch (error) {}
              }}
              sortable
              dataType="date"
              filter={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterMatchMode={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterElement={(option: any) =>
                dateFilterTemplate(option, col.header)
              }
              showClearButton={showClearDate}
              onFilterClear={() => setshowClearDatel(false)}
            />
          );
        } else if (
          (!col.field.includes("Id") &&
            col.dataType === "number" &&
            col.header !== "PositionLevel") ||
          col.fieldTypeFilterDynamic === "c"
        ) {
          return (
            <Column
              key={col.field}
              field={col.field}
              style={{ flexGrow: 1, flexBasis: "200px" }}
              header={
                <div className="label-text-container table-control-header">
                  <div className="table-control-headtext">
                    <span className="headtext-form">{col.header}</span>
                  </div>

                  <span className="table-control-header-span">
                    {col.alter !== undefined && col.alter}
                  </span>
                </div>
              }
              bodyClassName={"number-style"}
              body={(rowData: any) => {
                try {
                  if (rowData[col.field] !== null) {
                    return rowData[col.field]?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    });
                  }
                } catch {}
              }}
              sortable
              dataType="numeric"
              filter={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterMatchMode={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterElement={(option: any) =>
                normalFilterTemplate(option, col.header)
              }
              showClearButton={false}
            />
          );
        } else if (col.field.includes("AmountFrom_AmountTo")) {
          return (
            <Column
              key={col.field}
              field={col.field}
              style={{ flexGrow: 1, flexBasis: "200px" }}
              header={
                <div className="label-text-container table-control-header">
                  <div className="table-control-headtext">
                    <span className="headtext-form">{col.header}</span>
                  </div>

                  <span className="table-control-header-span">
                    {col.alter !== undefined && col.alter}
                  </span>
                </div>
              }
              sortable
              body={(rowData: any) => {
                try {
                  let mainStr = "";
                  let data = matrixItems.filter(
                    (item: any) =>
                      item.ApproveMatrixId === rowData.ApproveMatrixId &&
                      item.IsActive === true &&
                      (item.ApproverId !== 0 || item.PositionLevelId !== 0)
                  );
                  data.sort((a, b) => (a.Seq > b.Seq ? 1 : -1));
                  let dd = data.map((e: any, idx: number) => {
                    if (idx < 3) {
                      let subStr = "";
                      subStr =
                        Number(e.AmountFrom).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        }) +
                        "-" +
                        Number(e.AmountTo).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        }) +
                        ": ";
                      mainStr = mainStr + subStr;
                      return <p>{subStr}</p>;
                    } else if (idx <= 4) {
                      let subStr = "";
                      subStr =
                        Number(e.AmountFrom).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        }) +
                        "-" +
                        Number(e.AmountTo).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        }) +
                        ": ";
                      mainStr = mainStr + subStr;
                      return <p>......</p>;
                    }
                  });

                  rowData.AmountFrom_AmountTo = mainStr;
                  return dd;
                } catch {}
              }}
              filter={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterMatchMode={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterElement={(option: any) =>
                normalFilterTemplate(option, col.header)
              }
              showClearButton={false}
            />
          );
        } else if (
          !col.field.includes("Id") &&
          col.field !== "ModifiedBy" &&
          col.field !== "CreatedBy" &&
          col.field !== "SignPicPath"
        ) {
          return (
            <Column
              key={col.field}
              field={col.field}
              style={{ flexGrow: 1, flexBasis: "200px" }}
              header={
                <div className="label-text-container table-control-header">
                  <div className="table-control-headtext">
                    <span className="headtext-form">{col.header}</span>
                  </div>

                  <span className="table-control-header-span">
                    {col.alter !== undefined && col.alter}
                  </span>
                </div>
              }
              sortable
              body={(rowData: any) => {
                try {
                  if (typeof rowData[col.field] === "string") {
                    let data: string = rowData[col.field];
                    if (data.includes("base64")) {
                      var image = new Image();
                      image.src = data;
                      return <img className="table-img" src={image.src} />;
                    } else {
                      return col.field == "Memo_DocumentNo"
                        ? actionLinkIReport(rowData)
                        : rowData[col.field];
                    }
                  } else {
                    return rowData[col.field];
                  }
                } catch {}
              }}
              filter={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterMatchMode={
                filters2[col.field]?.matchMode !== null
                  ? filters2[col.field]?.matchMode
                  : undefined
              }
              filterElement={(option: any) =>
                normalFilterTemplate(option, col.header)
              }
              showClearButton={false}
            />
          );
        }
      }
    } catch (ex) {
      console.log("table=>ex", ex);
    }
  });

  const toastShowSuccess = () => {
    toggleAlert({
      description: `Success!`,
      message: `Success`,
      type: "success",
    });
    // toast.current.show({
    //   severity: "success",
    //   summary: "Success !",
    //   life: 3000,
    // });
  };
  const toastShowError = () => {
    toggleAlert({
      description: `Error!`,
      message: `Error`,
      type: "error",
    });
    // toast.current.show({
    //   severity: "error",
    //   summary: "Error Message",
    //   detail: "Validation failed",
    // });
  };

  const actionBodyTemplate = (rowData: any) => {
    let selData: any[] = [];
    dataDynamicTable.map((e: any) => {
      if (e[selectedColumns[0].field] === rowData[selectedColumns[0].field]) {
        selData.push(e);
      }
    });
    return (
      <React.Fragment>
        <SplitButton
          className="p-button-secondary"
          model={[
            {
              label: "Edit",
              icon: "pi pi-pencil",
              command: () => {
                setDataEdit(selData[0]);
                setTitleHead("Edit Data / แก้ไขข้อมูล");
                setMessageButtonDialog("Update Changes");
                setCheckAction("edit");
                if (props?.setDisplayFormDialog !== undefined) {
                  props?.setDisplayFormDialog(!props?.displayFormDialog);
                }
                setVisibleConfirm(false);
              },
            },
          ]}
          dropdownIcon="pi pi-ellipsis-v"
        />
      </React.Fragment>
    );
  };

  const onColumnToggle = (event: any) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col: any) =>
      selectedColumns.some((sCol: any) => sCol.field === col.field)
    );

    setSelectedColumns(orderedSelectedColumns);
  };

  const exportXLSX = (selectionOnly: any) => {
    exportXLSX({ selectionOnly });
  };

  const exportExcel = () => {
    const excelData = reconStructionForExport();
    import("xlsx").then((xlsx: any) => {
      const worksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, reportFileName + " : " + new Date());
      toggleLoading(false);
    });
  };

  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then((FileSaver: any) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  };

  const yearNavigatorTemplate = (e: any) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={(event: any) => e.onChange(event.originalEvent, event.value)}
        className="p-ml-2"
        style={{ lineHeight: 1 }}
      />
    );
  };

  const renderHeader1 = () => {
    const selCol = [...selectedColumns];
    let showSelCol: any[] = [];
    const col = [...columns];
    let showCol: any[] = [];
    selCol.map((e: any) => {
      if (!e.field.toLowerCase().includes("id")) {
        showSelCol.push(e);
      }
    });
    col.map((e: any) => {
      if (!e.field.toLowerCase().includes("id")) {
        showCol.push(e);
      }
    });

    return (
      <div className="p-grid">
        <div className="p-col-12 header-inline">
          <div style={{ textAlign: "left" }}>
            <MultiSelect
              value={showSelCol}
              options={showCol}
              optionLabel="header"
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
                setShowDataDynamicTable([...uniqueArray]);
                setClearFilter(true);
              }}
              onChange={onColumnToggle}
              placeholder="Select columns"
              style={{ width: "20em" }}
            />
          </div>
          {props.canExport && (
            <div style={{ textAlign: "right" }} className="Button-canExport">
              <Button
                type="button"
                label="Export to excel"
                icon="pi pi-file-excel"
                onClick={() => {
                  toggleLoading(true);
                  exportExcel();
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
                data-pr-tooltip="XLS"
              />
              {/* <input type="file" onChange={importExcel} /> */}
              {props.apiName !== "DynamicReport/GetReportDetailById" && (
                <>
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
            </div>
          )}
        </div>
      </div>
    );
  };
  const importExcel = async (e: any) => {
    const file = e.target.files[0];
    try {
      if (toggleLoading != undefined) toggleLoading(true);
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
              for (let i = 0; i < _importedData.length; i++) {
                const element = _importedData[i];
                var apiNamereplace = props.apiName?.replace("/GetAll", "");

                let res = await updateDynamic(apiNamereplace, element);
                if (res.result === "success") {
                  if (_importedData.length - 1 === i) {
                    let _dataDynamic = await GetAllDynamic(
                      props.apiName,
                      undefined
                    );

                    setDataDynamicTable([..._dataDynamic]);
                    if (toggleLoading !== undefined) {
                      toggleLoading(false);
                    }
                  }
                } else {
                }
              }
            }
          };

          reader.readAsArrayBuffer(file);
        } catch (error) {}
      });
    } catch (error) {}
  };
  function onRowClick(rowData: any) {
    if (props.rowClickFunc != undefined) {
      props.rowClickFunc(rowData);
    }
  }

  const header1 = renderHeader1();

  function renderActionColumn() {
    if (props.canAction) {
      if (props.actionBody !== undefined) {
        return (
          <Column
            body={props.actionBody}
            exportable={false}
            style={{
              width: "20px",
              padding: "6px 0px 6px 8px",
              flexGrow: 1,
              flexBasis: "50px",
            }}
            frozen
            alignFrozen="right"
          />
        );
      } else {
        return (
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{
              width: "20px",
              padding: "6px 0px 6px 8px",
              flexGrow: 1,
              flexBasis: "50px",
            }}
            frozen
            alignFrozen="right"
          />
        );
      }
    }
  }

  const rowClassName = () => {
    if (props.rowPointer) {
      return "row-pointer";
    } else {
      return "";
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      {!props.onLoading && (
        <div className="card">
          <DataTable
            ref={dt}
            className={"headers set-layout-table dynamic-th"}
            stripedRows
            value={showdataDynamicTable}
            dataKey="rowIdx"
            paginator
            rows={10}
            reorderableColumns={canReoderColumn}
            onRowClick={onRowClick}
            onColReorder={onColReorder}
            rowClassName={rowClassName}
            header={header1}
            selectionMode={"single"}
            selection={selectData}
            onSelectionChange={(e: any) => setSelectData(e.value)}
            globalFilterFields={columns.map((e: any) => e.field)}
            rowsPerPageOptions={[10, 15, 20, 50, 100]}
            rowHover={props.rowHover}
            onValueChange={(e: any) => {
              if (props.setItemsCount !== undefined) {
                props.setItemsCount(e.length);
              }
              setExportData(e);
            }}
            filters={filters2}
            filterDisplay="row"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            responsiveLayout="scroll"
            size="small"
          >
            {dynamicColumns.length > 0 ? renderActionColumn() : null}
            {dynamicColumns}
          </DataTable>
          {visibleConfirm && props?.displayFormDialog == false && (
            <DialogList
              dialogName={props.tableName}
              checkActionProp={checkAction}
              visibleConfirmProp={visibleConfirm}
              setVisibleDialogProp={props.setDisplayFormDialog}
              setVisibleConfirmProp={setVisibleConfirm}
              formDataProp={dataEdit}
              tableColumn={columns}
              titleHeaderProp={titleHead}
              dataListProp={dataDynamicTable}
              matrixItems={matrixItems}
              setDataListProp={setDataDynamicTable}
              toastShowSuccessProp={toastShowSuccess}
              toastShowErrorProp={toastShowError}
              messageButtonDialogProp={messageButtonDialog}
              setCanTableAction={setCanTableAction}
              setOnLoading={toggleLoading}
              setMatrixItems={setMatrixItems}
              toast={toast}
            />
          )}
          {props?.displayFormDialog && (
            <DialogList
              dialogName={props.tableName}
              setVisibleDialogProp={props?.setDisplayFormDialog}
              visibleDialogProp={props?.displayFormDialog}
              checkActionProp={checkAction}
              tableColumn={columns}
              visibleConfirmProp={visibleConfirm}
              setVisibleConfirmProp={setVisibleConfirm}
              titleHeaderProp={titleHead}
              formDataProp={dataEdit}
              dataListProp={dataDynamicTable}
              matrixItems={matrixItems}
              setDataListProp={setDataDynamicTable}
              toastShowSuccessProp={toastShowSuccess}
              toastShowErrorProp={toastShowError}
              messageButtonDialogProp={messageButtonDialog}
              setCanTableAction={setCanTableAction}
              setOnLoading={toggleLoading}
              setMatrixItems={setMatrixItems}
              toast={toast}
            />
          )}
        </div>
      )}
    </div>
  );
};
