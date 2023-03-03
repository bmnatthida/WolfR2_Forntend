import { DataTable } from "primereact/datatable";
import { Col, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { Controller, useForm } from "react-hook-form";
import { RadioButtonComponents } from "../RadioButtonComponents/RadioButtonComponents";
import { IReportModel } from "../../IRequestModel/IReportModel";
import moment from "moment";
import { Chips } from "primereact/chips";
import { GetAllDynamic } from "../../Services/DynamicService";
import { ButtonComponents } from "../ButtonComponents/ButtonComponents";
import { DatePicker } from "antd";
import { Dropdown } from "primereact/dropdown";
import { GetReportSetting } from "../../Services/MasterDataService";
import { confirmDialog } from "primereact/confirmdialog";
import { UserContext, useUserContext } from "../../Context/UserContext";

interface Props {
  reportTemp: IReportModel;
  setReportColumns: (value: any[]) => void;
  setTableData: (value: any[]) => void;
  setGettingreport: (value: boolean) => void;
}

const SelectedFieldComponent = ({
  reportTemp,
  setReportColumns,
  setTableData,
  setGettingreport,
}: Props) => {
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: reportTemp,
  });

  const [filterValue, setFilterValue] = useState<any[]>([]);
  const [selectedField, setSelectedField] = useState<any[]>([]);
  const [userData] = useUserContext();
  const [rtcon, setRtcon] = useState<any>();

  useEffect(() => {
    findSelected();
    fecthMasterData();
  }, []);

  const fecthMasterData = async () => {
    try {
      const _rtcon = await GetReportSetting();
      if (_rtcon) {
        let value: string = _rtcon[0]?.value2?.split("|");
        setRtcon(value);
      }
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  const findSelected = () => {
    try {
      const _selectedfieldlist = reportTemp.Selectedfieldlist;
      const _selectedfieldlistfilter = reportTemp.Selectedfieldlistfilter;

      if (_selectedfieldlist) {
        const selected = _selectedfieldlist.filter((field: any) => {
          return _selectedfieldlistfilter?.find(
            (filter: any) => field.key === filter.FieldCode
          );
        });
        setValue("Selectedfieldlistfilter", _selectedfieldlistfilter);
        setSelectedField(selected);
      }
    } catch (error) {}
  };

  function formatDate(date: string) {
    try {
      let arrDate = date.split("/");
      const mm = Number(arrDate[1]);
      if (mm === 1) {
        arrDate[1] = "Jan";
      } else if (mm === 2) {
        arrDate[1] = "Feb";
      } else if (mm === 3) {
        arrDate[1] = "Mar";
      } else if (mm === 4) {
        arrDate[1] = "Apr";
      } else if (mm === 5) {
        arrDate[1] = "May";
      } else if (mm === 6) {
        arrDate[1] = "Jun";
      } else if (mm === 7) {
        arrDate[1] = "Jul";
      } else if (mm === 8) {
        arrDate[1] = "Aug";
      } else if (mm === 9) {
        arrDate[1] = "Sep";
      } else if (mm === 10) {
        arrDate[1] = "Oct";
      } else if (mm === 11) {
        arrDate[1] = "Nov";
      } else if (mm === 12) {
        arrDate[1] = "Dec";
      }
      return arrDate.join(" ");
    } catch (error) {
      return date;
    }
  }

  const validateFun = (data: any) => {
    let isPass = true;
    try {
      if (rtcon?.length > 0) {
        const request_date = data.Selectedfieldlistfilter.find(
          (e: any) => e.FieldCode.toLowerCase() === rtcon[0]
        );
        if (!request_date) {
          isPass = false;
          confirmDialog({
            message: () => {
              return (
                <>
                  {
                    "Please select field Request Date for data search condition after click Generate Report button! / กรุณาเลือก field Request Date เพื่อเป็นเงื่อนไขในการค้นหาข้อมูลก่อนกดปุ่ม Generate Report !"
                  }
                </>
              );
            },
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            draggable: false,
            closable: false,
            rejectClassName: "hide",
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {},
          });
        } else if (!request_date.FieldTextFrom && !request_date.FieldTextTo) {
          isPass = false;
          confirmDialog({
            message:
              "Please select filter value Memorandum - Request Date From / กรุณาเลือกค่าสำหรับการกรอง Memorandum - Request Date จาก !",
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            draggable: false,
            closable: false,
            rejectClassName: "hide",
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {},
          });
        } else if (request_date.FieldTextFrom && !request_date.FieldTextTo) {
          isPass = false;
          confirmDialog({
            message:
              "Please select filter value Memorandum - Request Date To / กรุณาเลือกค่าสำหรับการกรอง Memorandum - Request Date ถึง !",
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            draggable: false,
            closable: false,
            rejectClassName: "hide",
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {},
          });
        } else if (!request_date.FieldTextFrom && request_date.FieldTextTo) {
          isPass = false;
          confirmDialog({
            message:
              "Please select filter value Memorandum - Request Date From / กรุณาเลือกค่าสำหรับการกรอง Memorandum - Request Date จาก !",
            header: "Alert",
            icon: "p-confirm-dialog-icon pi pi-info-circle",
            draggable: false,
            closable: false,
            rejectClassName: "hide",
            acceptClassName:
              "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
            accept: () => {},
          });
        } else {
          const dateForm = getDateValue(request_date.FieldTextFrom);
          const dateTo = getDateValue(request_date.FieldTextTo);
          const diffDays = dateTo.diff(dateForm, "days");
          if (diffDays > rtcon[1]) {
            isPass = false;
            confirmDialog({
              message:
                "Please select field Request Date difference between " +
                rtcon[1] +
                "! / " +
                "กรุณาเลือก field Request Date ที่มีระยะห่างไม่เกิน " +
                rtcon[1] +
                "!",
              header: "Alert",
              icon: "p-confirm-dialog-icon pi pi-info-circle",
              draggable: false,
              closable: false,
              rejectClassName: "hide",
              acceptClassName:
                "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
              accept: () => {},
            });
          }
        }
      }
    } catch (error) {
      isPass = false;
    }

    return isPass;
  };

  const onSubmit = (data: any) => {
    if (validateFun(data)) {
      setGettingreport(true);
      data.Selectedfieldlistfilter?.map((e: any) => {
        try {
          if (e.FieldText && typeof e.FieldText !== "string") {
            e.FieldText = e.FieldText.join("|");
          }
        } catch (error) {
          console.log("table=>error", error);
        }
      });
      fecthDataReport(
        data.ReporttemplateID,
        JSON.stringify(data.Selectedfieldlistfilter)
      );
    }
  };

  const fecthDataReport = async (reportId: number, data: string) => {
    const reportDetailBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReportTemplateId: reportId,
        FavoritesItem: data,
        PageIndex: 0,
        PageSize: 10000,
        UserPrincipalName: userData.Email,
      }),
    };

    const _dataDynamic: any = await GetAllDynamic(
      "DynamicReport/GetReportDetailById",
      reportDetailBody
    );
    if (_dataDynamic) {
      if (_dataDynamic.FieldCollection && _dataDynamic.FieldCollection !== "") {
        const fieldCollection: any[] = JSON.parse(_dataDynamic.FieldCollection);
        let numCols: string[] = [];
        let dateCols: string[] = [];
        let edCols: string[] = [];
        fieldCollection.forEach((col: any) => {
          if (
            col.FieldTypeFilterDynamic === "c" ||
            col.FieldTypeFilterStatic === "Number"
          ) {
            numCols.push(col.key);
          } else if (
            col.FieldTypeFilterDynamic === "d" ||
            col.FieldTypeFilterStatic === "Datetime"
          ) {
            dateCols.push(col);
          } else if (col.FieldTypeFilterDynamic === "ed") {
            edCols.push(col);
          }
        });

        if (numCols.length > 0) {
          numCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col]) {
                data[col] = Number(data[col])?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                });
              }
            });
          });
        }
        if (dateCols.length > 0) {
          dateCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col.key]) {
                const symbol =
                  col.symbol && col.symbol !== "" ? col.symbol : " ";
                let newDate = moment(new Date(data[col.key]))
                  .format("DD" + symbol + "MMM" + symbol + "YYYY")
                  .toString();
                data[col.key] = newDate;
              }
            });
          });
        }
        if (edCols.length > 0) {
          edCols.forEach((col: any) => {
            _dataDynamic.dt_Report.map((data: any) => {
              if (data[col.key] && data[col.key] !== "") {
                let parser = new DOMParser();
                let doc = parser.parseFromString(data[col.key], "text/html");
                data[col.key] = doc.body.innerText;
              }
            });
          });
        }
        setReportColumns([...fieldCollection]);
      }

      setTableData(_dataDynamic.dt_Report);
      setGettingreport(false);
    }
  };

  const getChipValue = (fieldValue?: any) => {
    let _chip: any[] = [];
    if (fieldValue) {
      if (typeof fieldValue === "string") {
        _chip = fieldValue.split("|");
      } else {
        _chip = fieldValue;
      }
      return _chip;
    }
  };

  function onChangeSelectField(fieldValue: any[], onChange: any) {
    let _filters: any[] = [];
    selectedField.forEach((field: any) => {
      const exitFilter = fieldValue.find(
        (filter: any) => filter.FieldCode === field.key
      );
      if (exitFilter) {
        _filters.push(exitFilter);
      } else {
        let _objJson = {
          ID: 0,
          FieldCode: field.key,
          FieldDisplay: field.label,
          IsExcludeBlankData: true,
          FieldType: field.type,
          IsEquals: false,
          FieldText: [],
          FieldTextFrom: null,
          FieldTextTo: null,
          FieldBit: null,
          FieldTypeFilterStatic: field.FieldTypeFilterStatic,
          FieldTypeFilterDynamic: field.FieldTypeFilterDynamic,
          IsTodayFrom: false,
          IsTodayTo: false,
          FilterParameter: "",
          indexHideColumn: null,
          SecretId: null,
        };
        _filters.push(_objJson);
      }
    });
    if (JSON.stringify(fieldValue) !== JSON.stringify(_filters)) {
      onChange(_filters);
    }
    return _filters;
  }

  const getDateValue = (dateValue: any) => {
    // let newDate: Date = new Date();

    let newDate = moment(
      moment(new Date(dateValue)).format("DD MMM YYYY"),
      "DD MMM YYYY"
    ).toDate();
    if (newDate.toString().toLowerCase() === "invalid date") {
      newDate = moment(formatDate(dateValue), "DD MMM YYYY").toDate();
    } else {
      newDate = moment(
        moment(formatDate(dateValue)).format("DD MMM YYYY"),
        "DD MMM YYYY"
      ).toDate();
      if (newDate.toString().toLowerCase() === "invalid date") {
        console.log("table=>dateValue", dateValue);
      }
    }
    // return newDate;

    return moment(
      new Date(newDate).toLocaleString("en-UK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="report-row">
          <Col xs={6} md={6} lg={6} xl={6}>
            <div className="report-card">
              <div className="report-card-header">
                <p className="card-header-text">Selected Field</p>
              </div>
              <div className="report-card-body" style={{ height: "550px" }}>
                <Controller
                  name="Selectedfieldlist"
                  control={control}
                  render={({ field }) => (
                    <DataTable
                      value={field.value}
                      onRowReorder={(e: any) => field.onChange(e.value)}
                      selection={selectedField}
                      onSelectionChange={(e: any) => {
                        setSelectedField(e.value);
                      }}
                      // rowClassName={rowClassName}
                      // isDataSelectable={isRowSelectable}
                      responsiveLayout="scroll"
                      scrollable
                      scrollHeight="flex"
                      size="small"
                    >
                      <Column
                        rowReorder
                        style={{ flexGrow: 1, flexBasis: "40px" }}
                      />
                      <Column
                        header={
                          <>
                            <p
                              style={{
                                marginRight: "290px",
                                marginBottom: "0",
                              }}
                            >
                              Field
                            </p>
                          </>
                        }
                        field="label"
                        style={{ flexGrow: 1, flexBasis: "500px" }}
                      ></Column>
                      <Column
                        selectionMode="multiple"
                        style={{ flexGrow: 1, flexBasis: "40px" }}
                      ></Column>
                    </DataTable>
                  )}
                />
              </div>
            </div>
          </Col>
          <Col xs={6} md={6} lg={6} xl={6}>
            <>
              <div className="report-card">
                <div className="report-card-header">
                  <p className="card-header-text">Filter Value</p>
                </div>
                <div className="report-card-body" style={{ height: "550px" }}>
                  <Controller
                    name="Selectedfieldlistfilter"
                    control={control}
                    defaultValue={reportTemp.Selectedfieldlistfilter}
                    render={({ field }) => (
                      <DataTable
                        value={
                          field.value &&
                          onChangeSelectField(field.value, field.onChange)
                        }
                        selection={filterValue}
                        onSelectionChange={(e: any) => setFilterValue(e.Value)}
                        size="small"
                        scrollable
                        scrollHeight="flex"
                        responsiveLayout="scroll"
                      >
                        <Column
                          rowReorder
                          style={{ flexGrow: 1, flexBasis: "40px" }}
                        />
                        <Column
                          header={
                            <>
                              <p
                                style={{
                                  marginRight: "79px",
                                  marginBottom: "0",
                                }}
                              >
                                Field
                              </p>
                            </>
                          }
                          field="FieldDisplay"
                          style={{ flexGrow: 1, flexBasis: "110px" }}
                        ></Column>
                        <Column
                          style={{ flexGrow: 1, flexBasis: "200px" }}
                          body={(rowData: any, option: any) => {
                            if (
                              rowData.FieldTypeFilterDynamic === "d" ||
                              rowData.FieldTypeFilterStatic === "Datetime"
                            ) {
                              let dateFormat: any = rowData.FieldTextFrom
                                ? getDateValue(rowData.FieldTextFrom)
                                : null;

                              return (
                                <>
                                  <p>
                                    {"From("}
                                    <RadioButtonComponents
                                      inputIdProps={true}
                                      nameProps={true}
                                      valueProps={!rowData.IsTodayFrom}
                                      onChangeProps={(e: any) => {
                                        rowData.IsTodayFrom = e;
                                        if (field?.value) {
                                          field.value[option.rowIndex] =
                                            rowData;
                                          field.onChange(field.value);
                                        }
                                      }}
                                      checkedProps={
                                        rowData.IsTodayFrom === true
                                      }
                                      labelProps={""}
                                      keyProps={"From"}
                                    />
                                    {"Today"} {")"}
                                  </p>
                                  <DatePicker
                                    value={dateFormat}
                                    className={"report-date"}
                                    style={{
                                      marginBottom: "1em",
                                      borderRadius: "6px",
                                      width: "100%",
                                      height: "38px",
                                    }}
                                    format={"DD MMM YYYY"}
                                    onChange={(e: any) => {
                                      try {
                                        if (e) {
                                          rowData.FieldTextFrom =
                                            e.format("DD MMM yy");
                                        } else {
                                          rowData.FieldTextFrom = e;
                                        }

                                        if (field?.value) {
                                          field.value[option.rowIndex] =
                                            rowData;
                                          field.onChange(field.value);
                                        }
                                      } catch (error) {
                                        console.log("error=>", error);
                                      }
                                    }}
                                  />
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <Dropdown
                                    value={
                                      rowData.FilterParameter === "Like"
                                        ? "Contains"
                                        : rowData.FilterParameter === "Not Like"
                                        ? "Not Contains"
                                        : rowData.FilterParameter
                                    }
                                    id={"Template_version"}
                                    placeholder="--- Please select ---"
                                    className="report-input"
                                    options={[
                                      "Equals",
                                      "Not Equals",
                                      "Contains",
                                      "Not Contains",
                                    ]}
                                    onChange={(e: any) => {
                                      rowData.FilterParameter =
                                        e.value === "Contains"
                                          ? "Like"
                                          : e.value === "Not Contains"
                                          ? "Not Like"
                                          : e.value;
                                      if (field?.value) {
                                        field.value[option.rowIndex] = rowData;
                                        field.onChange(field.value);
                                      }
                                      // onChangeDropdownfilterValue(
                                      //   rowData,
                                      //   e.value
                                      // );
                                    }}
                                  />
                                </>
                              );
                            }
                          }}
                        ></Column>
                        <Column
                          style={{ flexGrow: 1, flexBasis: "200px" }}
                          body={(rowData: any, option: any) => {
                            if (
                              rowData.FieldTypeFilterDynamic === "d" ||
                              rowData.FieldTypeFilterStatic === "Datetime"
                            ) {
                              let dateFormat: any = rowData.FieldTextTo
                                ? getDateValue(rowData.FieldTextTo)
                                : null;
                              console.log("report=>rowData", rowData);

                              return (
                                <>
                                  <p>
                                    To (
                                    <RadioButtonComponents
                                      inputIdProps={true}
                                      nameProps={true}
                                      valueProps={!rowData.IsTodayFrom}
                                      onChangeProps={(e: any) => {
                                        rowData.IsTodayTo = e;
                                        console.log("report=>field", field);
                                        if (field?.value) {
                                          field.value[option.rowIndex] =
                                            rowData;
                                          field.onChange(field.value);
                                        }
                                      }}
                                      checkedProps={rowData.IsTodayTo === true}
                                      labelProps={""}
                                      keyProps={"Today"}
                                    />
                                    {"Today"} {")"}
                                  </p>
                                  <DatePicker
                                    value={dateFormat}
                                    style={{
                                      marginBottom: "1em",
                                      borderRadius: "6px",
                                      width: "100%",
                                      height: "38px",
                                    }}
                                    format={"DD MMM YYYY"}
                                    onChange={(e: any) => {
                                      try {
                                        if (e) {
                                          rowData.FieldTextTo =
                                            e.format("DD MMM yy");
                                        } else {
                                          rowData.FieldTextTo = e;
                                        }

                                        if (field?.value) {
                                          field.value[option.rowIndex] =
                                            rowData;
                                          field.onChange(field.value);
                                        }
                                      } catch (error) {
                                        console.log("error=>", error);
                                      }
                                    }}
                                  />
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <Chips
                                    value={
                                      field.value &&
                                      getChipValue(
                                        field.value[option.rowIndex].FieldText
                                      )
                                    }
                                    onChange={(e) => {
                                      if (field.value) {
                                        field.value[option.rowIndex].FieldText =
                                          e.value;
                                        field.onChange(field.value);
                                      }
                                    }}
                                    separator="|"
                                  />
                                </>
                              );
                            }
                          }}
                        ></Column>
                      </DataTable>
                    )}
                  />
                </div>
              </div>
            </>
          </Col>
        </Row>
        <br />
        <Row className="report-row">
          <Col>
            <ButtonComponents
              setLabelProps={"Generate report"}
              typeProps="submit"
              setStyleProps={{
                height: "38px",
                backgroundColor: "#282F6A",
                color: "#FFFFFF",
                border: "1px solid rgb(40, 47, 106)",
              }}
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default SelectedFieldComponent;
