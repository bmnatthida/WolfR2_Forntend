import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { ButtonComponents } from "../../../ButtonComponents/ButtonComponents";
import { DropdownComponents } from "../../../DropdownComponents/DropdownComponents";
import { InputTextComponents } from "../../../InputTextComponents/InputTextComponents";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";
import "./TableTemplateComponents.css";
interface Props {
  valueProps?: any;
  setValueProps?: any;
  keyProps?: any;
  selectedTableTemplate?: any;
  filtersProps?: any;
}

interface PropsSelected {
  valueProps?: any;
  setValueProps?: any;
  keyProps?: any;
}
interface _TableSelectField {
  valueProps?: any;
  setValueProps?: any;
  keyProps?: any;
  referenceFormProps?: any;
  dataProps?: any;
  referenceDocumentDialogObjectProps?: any;
}
interface PropsSelectField {
  valueProps?: any;
  setValueProps?: any;
  keyProps?: any;
  TemplateSelected?: any;
  tableDialog?: any;
  keyTableDialog?: any;
  settableDialog?: any;
  rowDataTable?: any;
  setValueTableProps?: any;
}

export const TableTemplateComponents = (props: Props) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);
  const [selectFieldtoshow, setSelectFieldtoshow] = useState<any>({});

  const onRowSelect = (event: any) => {
    props.setValueProps(event, props.keyProps);
  };
  useEffect(() => {
    console.log("props.valueProps", props.valueProps);
  }, [props.valueProps]);

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
        filters={props.filtersProps}
        dragSelection
        size="small"
        rows={rows}
        dataKey="TemplateId"
        selection={props.selectedTableTemplate}
        onSelectionChange={(e) => onRowSelect(e.value)}
        globalFilterFields={["DocumentCode", "TemplateName", "TemplateSubject"]}
      >
        <Column
          field="DocumentCode"
          style={{ textAlign: "start" }}
          headerStyle={{ width: "12rem" }}
          header={<TextHeaderComponents textHeaderProps={"Document Code"} />}
        ></Column>
        <Column
          field="TemplateName"
          headerStyle={{ width: "22rem" }}
          style={{ textAlign: "start" }}
          header={<TextHeaderComponents textHeaderProps={"Template Name"} />}
        ></Column>

        <Column
          field="TemplateSubject"
          style={{ textAlign: "start" }}
          header={<TextHeaderComponents textHeaderProps={"Template Subject"} />}
        ></Column>
      </DataTable>
    </>
  );
};

export const TableTemplateComponentsSelected = (props: PropsSelected) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);

  const onClickAction = (event: any) => {
    let _event: any = event;
    const dataFilter = props.valueProps.filter((item: any) => _event !== item);
    props.setValueProps(dataFilter, props.keyProps);
  };
  function actionBodyTemplate(rowData: any) {
    return (
      <>
        <ButtonComponents
          setIconProps="pi pi-trash"
          onClickProps={() => onClickAction(rowData)}
        />
      </>
    );
  }
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
        dataKey="TemplateId"
        filterDisplay="row"
      >
        <Column
          field="DocumentCode"
          style={{ textAlign: "start" }}
          headerStyle={{ width: "12rem" }}
          header={<TextHeaderComponents textHeaderProps={"Document Code"} />}
        ></Column>
        <Column
          field="TemplateName"
          headerStyle={{ width: "22rem" }}
          style={{ textAlign: "start" }}
          header={<TextHeaderComponents textHeaderProps={"Template Name"} />}
        ></Column>

        <Column
          field="TemplateSubject"
          style={{ textAlign: "start" }}
          header={<TextHeaderComponents textHeaderProps={"Template Subject"} />}
        ></Column>
        <Column
          headerStyle={{ width: "5rem" }}
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
    </>
  );
};
export const TableSelectField = (props: PropsSelectField) => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);
  const [refDocColumn, setRefDocColumn] = useState<any>([]);
  const [refDocColumnNull, setRefDocColumnNull] = useState<any>([]);
  const [refDocColumnType, setRefDocColumnType] = useState<any>();
  const [refTemplate, setRefTemplate] = useState<any>();
  const [templateNameWithCode, setTemplateNameWithCode] = useState<any>();
  const [templateAdvanceForm, setTemplateAdvanceForm] = useState<any>();
  const [selectField, setSelectField] = useState<any>();
  const [selectFieldTb, setSelectFieldTb] = useState<any>();

  useEffect(() => {
    _RefConvertJsonParse();
    console.log(
      "props.valuePropsqqqqqqq",
      props.valueProps,
      JSON.parse(props.valueProps.AdvanceForm),
      // JSON.parse(props.valueProps.RefDocColum),
      props.TemplateSelected
    );
  }, [props.valueProps, props.TemplateSelected]);

  useEffect(() => {}, [props.valueProps, props.TemplateSelected]);

  useEffect(() => {
    if (
      refDocColumn !== undefined &&
      selectField !== undefined &&
      selectFieldTb !== undefined
    ) {
      let _refDocColumn_: any =
        refDocColumn === undefined || refDocColumn === null ? [] : refDocColumn;
      if (_refDocColumn_.length !== 0) {
        let _refDocColumn = refDocColumn;

        _refDocColumn.map((data_: any, inx: any) => {
          if (data_.TypeControl !== "Table") {
            let _dataFilterSelectField = selectField.filter(
              (data: any) => data.selectFieldDocumentCode === data_.Value
            );
            if (_dataFilterSelectField.length === 0) {
              data_.Value = "";
            }
          } else {
            let _dataFilterSelectFieldTb = selectFieldTb.filter((data: any) => {
              let _dataTb =
                data_.Value === null || data_.Value === undefined
                  ? data.selectField
                  : data_.Value;

              if (
                data.selectField === _dataTb ||
                data.selectFieldDocumentCode === _dataTb
              ) {
                return true;
              }
            });
            if (_dataFilterSelectFieldTb.length === 0) {
              data_.Value = "";
              if (data_.objTable !== undefined) {
                data_.objTable.map((_dataObjTable: any, inx: any) => {
                  _dataObjTable.Value = "";
                });
              }
            }
          }
        });

        setRefDocColumn([..._refDocColumn]);
      }
    }
  }, [refTemplate, selectField, selectFieldTb]);
  useEffect(() => {
    _RowDataTable(props.rowDataTable);
  }, [props.rowDataTable]);

  async function _RefConvertJsonParse() {
    let _JsonParseRefDocColumn =
      props.valueProps.RefDocColumn !== undefined &&
      props.valueProps.RefDocColumn !== null &&
      props.valueProps.RefDocColumn.length !== 0
        ? JSON.parse(props.valueProps.RefDocColumn)
        : [];
    let _JsonParseRefTemplate = props.TemplateSelected;
    let _TemplateNameWithCode = props.valueProps.TemplateNameWithCode;
    let _TemplateAdvanceForm =
      props.valueProps.AdvanceForm !== undefined
        ? props.valueProps.AdvanceForm !== null
          ? props.valueProps.AdvanceForm.length !== 0
            ? JSON.parse(props.valueProps.AdvanceForm)
            : []
          : []
        : [];
    console.log("_JsonParseRefDocColumn", _JsonParseRefDocColumn);

    _MapSelectTable(_JsonParseRefTemplate);
    _MapTemplateAdvanceForm(_TemplateAdvanceForm, _JsonParseRefDocColumn);
    setTemplateNameWithCode(_TemplateNameWithCode);
    setRefTemplate(_JsonParseRefTemplate);
    // setRefDocColumn(
    //   _JsonParseRefDocColumn !== undefined
    //     ? _JsonParseRefDocColumn !== null
    //       ? _JsonParseRefDocColumn.length === 0
    //         ? refDocColumn
    //         : _JsonParseRefDocColumn
    //       : refDocColumn
    //     : refDocColumn
    // );
    setTemplateAdvanceForm(_TemplateAdvanceForm);
  }
  async function _RowDataTable(_data: any) {
    let _refDocColumn =
      refDocColumnNull.length !== 0 ? refDocColumnNull : refDocColumn;
    if (_data.length !== 0 && _refDocColumn.length !== 0) {
      let _ValuePropsObj = { ...props.valueProps };
      setRefDocColumn(_refDocColumn);
      _ValuePropsObj.RefDocColumn = JSON.stringify(_refDocColumn);
      props.setValueProps(_ValuePropsObj, props.keyProps);
    }
  }

  async function _MapTemplateAdvanceForm(_data: any, _refDocColumns: any) {
    let _dataItems: any =
      _data.items !== undefined
        ? _data.items !== null
          ? _data.items.length !== 0
            ? _data.items
            : []
          : []
        : [];
    let _refDocColumn = _refDocColumns;

    let _refDocColumnObj = {};
    let _refDocColumnObjArray: any = [];
    let _refDocColumnObjArrayCheck: any = [];

    if (_dataItems.length !== 0) {
      _dataItems.map((data: any, inx: any) => {
        let _items = data.layout;
        _items.map((dataitems: any, inx: any) => {
          if (_refDocColumn && _refDocColumn.length !== 0) {
            _refDocColumn.map((_datarefDocColumn: any, inx: any) => {
              if (_datarefDocColumn.Key === dataitems.template.label) {
                _datarefDocColumn.TypeControl =
                  dataitems.template.type === "dd"
                    ? "Dropdown"
                    : dataitems.template.type === "tb"
                    ? "Table"
                    : dataitems.template.type === "t"
                    ? "ShortText"
                    : dataitems.template.type === "d"
                    ? "Calendar"
                    : dataitems.template.type === "at"
                    ? "Attachmen"
                    : dataitems.template.type === "ta"
                    ? "MultiLine"
                    : dataitems.template.type === "c"
                    ? "Decimal"
                    : dataitems.template.type === "r"
                    ? "Choice"
                    : dataitems.template.type === "cb"
                    ? "MultiChoice"
                    : dataitems.template.type === "n"
                    ? "Number"
                    : dataitems.template.type === "an"
                    ? "AutoNumber"
                    : dataitems.template.type === "ed"
                    ? "Editor"
                    : dataitems.template.type;
              }

              if (
                props.rowDataTable.length !== 0 &&
                _datarefDocColumn.TypeControl === "Table"
              ) {
                if (_datarefDocColumn.Key === props.rowDataTable.Key) {
                  _datarefDocColumn.objTable =
                    props.rowDataTable.objTable === undefined ||
                    props.rowDataTable.objTable === null
                      ? []
                      : props.rowDataTable.objTable;
                }
              }
            });
          }

          if (
            dataitems.template.type === "dd" ||
            dataitems.template.type === "tb" ||
            dataitems.template.type === "t" ||
            dataitems.template.type === "d" ||
            dataitems.template.type === "at" ||
            dataitems.template.type === "d" ||
            dataitems.template.type === "r" ||
            dataitems.template.type === "ta" ||
            dataitems.template.type === "c" ||
            dataitems.template.type === "r" ||
            dataitems.template.type === "cb" ||
            dataitems.template.type === "an" ||
            dataitems.template.type === "ed" ||
            dataitems.template.type === "n"
          ) {
            _refDocColumnObj = {
              Key: dataitems.template.label,
              Template: null,
              TypeControl:
                dataitems.template.type === "dd"
                  ? "Dropdown"
                  : dataitems.template.type === "tb"
                  ? "Table"
                  : dataitems.template.type === "t"
                  ? "ShortText"
                  : dataitems.template.type === "d"
                  ? "Calendar"
                  : dataitems.template.type === "at"
                  ? "Attachmen"
                  : dataitems.template.type === "ta"
                  ? "MultiLine"
                  : dataitems.template.type === "c"
                  ? "Decimal"
                  : dataitems.template.type === "r"
                  ? "Choice"
                  : dataitems.template.type === "cb"
                  ? "MultiChoice"
                  : dataitems.template.type === "n"
                  ? "Number"
                  : dataitems.template.type === "an"
                  ? "AutoNumber"
                  : dataitems.template.type === "ed"
                  ? "Editor"
                  : dataitems.template.type,
              Value: "",
            };
            _refDocColumnObjArray.push(_refDocColumnObj);
          }
        });
      });
    }
    console.log("_refDocColumnObjArray", _refDocColumn, _refDocColumnObjArray);
    if (_refDocColumn.length !== 0) {
      for (let i = 0; i < _refDocColumn.length; i++) {
        const element = _refDocColumn[i];

        for (let j = 0; j < _refDocColumnObjArray.length; j++) {
          const _element = _refDocColumnObjArray[j];
          if (
            element.Key === _element.Key &&
            element.TypeControl === _element.TypeControl
          ) {
            _refDocColumnObjArrayCheck.push(element);
          }
        }
      }

      if (_refDocColumnObjArrayCheck.length !== _refDocColumnObjArray.length) {
        for (let i = 0; i < _refDocColumnObjArray.length; i++) {
          const element = _refDocColumnObjArray[i];

          let elementFilter = _refDocColumnObjArrayCheck.filter(
            (item: any) =>
              item.Key === element.Key &&
              element.TypeControl === item.TypeControl
          );

          if (elementFilter.length === 0) {
            _refDocColumnObjArrayCheck.push(element);
          }
        }
      }

      _refDocColumn = _refDocColumnObjArrayCheck;

      _refDocColumnObjArray = [];
    }
    console.log("_refDocColumnObjArray", _refDocColumnObjArray, _refDocColumn);

    setRefDocColumn(_refDocColumn);
    setRefDocColumnNull(_refDocColumnObjArray);
    let _ValueProps = props.valueProps;
    if (_refDocColumnObjArray.length !== 0) {
      _ValueProps.RefDocColumn = JSON.stringify(_refDocColumnObjArray);
      props.setValueProps(_ValueProps, props.keyProps);
    } else if (_refDocColumnObjArray.length === 0) {
      _ValueProps.RefDocColumn = JSON.stringify(_refDocColumn);
      props.setValueProps(_ValueProps, props.keyProps);
    }
  }
  async function _MapSelectTable(_data: any) {
    let _arraySelect: any = [];
    _data.map((data: any, inx: any) => {
      let _items =
        data.AdvanceForm !== undefined
          ? data.AdvanceForm !== null
            ? data.AdvanceForm.length !== 0
              ? JSON.parse(data.AdvanceForm)
              : []
            : []
          : [];
      if (
        _items.items !== undefined &&
        _items.items !== null &&
        _items.items.length !== 0
      ) {
        _items.items.map((dataitems: any, inx: any) => {
          dataitems["DocumentCode"] = data.DocumentCode;
          _arraySelect.push(dataitems);
        });
      }
    });

    _MapSelectTableItem(_arraySelect);
  }

  async function _MapSelectTableItem(_data: any) {
    let _dataItem = _data;

    let _arraylayout: any = [];
    let _arraylayoutTb: any = [];
    _arraylayout.push({
      selectField: "--Please Select--",
      selectFieldDocumentCode: "--Please Select--",
    });
    _arraylayoutTb.push({
      selectField: "--Please Select--",
      selectFieldDocumentCode: "--Please Select--",
      column: [],
    });
    _dataItem.map((data: any, inx: any) => {
      let layout = data.layout;
      // dataitems.template.type === "dd" ||
      // dataitems.template.type === "tb" ||
      // dataitems.template.type === "t" ||
      // dataitems.template.type === "d" ||
      // dataitems.template.type === "at" ||
      // dataitems.template.type === "d" ||
      // dataitems.template.type === "r" ||
      // dataitems.template.type === "ta" ||
      // dataitems.template.type === "c" ||
      // dataitems.template.type === "r" ||
      // dataitems.template.type === "cb" ||
      // dataitems.template.type === "n"
      layout.map((_layout: any, inx: any) => {
        let _layoutData = _layout.template;
        if (
          (_layoutData.istext !== "Y" && _layoutData.type === "t") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "dd") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "cb") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "d") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "at") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "r") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "c") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "cb") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "n") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "ta") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "an") ||
          (_layoutData.istext !== "Y" && _layoutData.type === "ed")
        ) {
          _arraylayout.push({
            selectFieldDocumentCode:
              data.DocumentCode + "_" + _layoutData.label,
            selectField: _layoutData.label,
            type: _layoutData.type,
          });
        }

        if (_layoutData.istext !== "Y" && _layoutData.type === "tb") {
          _arraylayoutTb.push({
            selectFieldDocumentCode:
              data.DocumentCode + "_" + _layoutData.label,
            selectField: _layoutData.label,
            type: _layoutData.type,
            column: _layoutData.attribute.column,
          });
        }
      });
    });
    _arraylayout.push({
      selectField: "_DocumentNo",
      selectFieldDocumentCode: "_DocumentNo",
    });
    _arraylayout.push({
      selectField: "_DocumentAmount",
      selectFieldDocumentCode: "_DocumentAmount",
    });
    if (refDocColumn !== undefined) {
      if (refDocColumn.length !== 0) {
        refDocColumn.map((data_: any, inx: any) => {});
      }
    }

    setSelectFieldTb(_arraylayoutTb);
    setSelectField(_arraylayout);
  }

  async function _ReferenceDocumentDialog(data: any, key: any) {
    if (key !== null && key !== undefined) {
      let _refDocColumn =
        refDocColumnNull.length !== 0 ? refDocColumnNull : refDocColumn;
      let _refDocColumnData = data;
      console.log("_refDocColumn", _refDocColumn, _refDocColumnData);

      let _ValuePropsObj = { ...props.valueProps };
      _refDocColumn.map((_d: any, inx: any) => {
        if (
          _d.Key === _refDocColumnData.Key &&
          _d.TypeControl === _refDocColumnData.TypeControl
        ) {
          _d.Value =
            key === undefined || key === null
              ? ""
              : key.selectFieldDocumentCode === "--Please Select--"
              ? ""
              : key.selectFieldDocumentCode;
          _d["column"] = key.column;
        }
      });

      setRefDocColumn(_refDocColumn);
      _ValuePropsObj.RefDocColumn = JSON.stringify(_refDocColumn);

      props.setValueProps(_ValuePropsObj, props.keyProps);
    }
  }
  function actionBodyTemplate(rowData: any, option: any) {
    console.log("selectFieldselectField", selectField);

    let _selectField =
      selectField === undefined || selectField === null ? [] : selectField;

    let _rowDataValue = rowData.Value !== null ? rowData.Value : [];
    if (_selectField.length !== 0 && _rowDataValue.length !== 0) {
      let _dataFilter = selectField.filter(
        (item: any) => item.selectField === rowData.Value
      );
      if (_dataFilter.length !== 0) {
        rowData.Value =
          _dataFilter[0].selectFieldDocumentCode === undefined
            ? rowData.Value
            : _dataFilter[0].selectFieldDocumentCode;
      }
    }
    return (
      <>
        <DropdownComponents
          placeholderProps={
            rowData.Value === null || rowData.Value === undefined
              ? "--Please Select--"
              : rowData.Value.length !== 0
              ? rowData.Value
              : "--Please Select--"
          }
          onChangeProps={(e: any) => {
            _ReferenceDocumentDialog(rowData, e);
          }}
          optionLabelProps="selectFieldDocumentCode"
          optionsProps={
            refDocColumnNull.length !== 0
              ? refDocColumnNull[option.rowIndex].TypeControl === "Table"
                ? selectFieldTb
                : selectField
              : refDocColumn[option.rowIndex].TypeControl === "Table"
              ? selectFieldTb
              : selectField
          }
          filterProps
          keyProps={"selectField"}
        />
      </>
    );
  }

  function actionBodyTemplateTable(rowData: any, option: any) {
    let _rowData =
      rowData.Value === null || rowData.Value === undefined
        ? []
        : rowData.Value;

    rowData.Key = rowData.Key.length === 0 ? "/" : rowData.Key;
    if (rowData.TypeControl === "Table" && _rowData.length !== 0) {
      return (
        <>
          <a
            style={{ color: "#2769b2" }}
            className="ActionBody"
            onClick={() => {
              props.setValueTableProps(
                !props.tableDialog,
                props.keyTableDialog
              );
              console.log("rowData", rowData);

              props.setValueTableProps(rowData, "rowDataTable");
              props.setValueTableProps(
                refTemplate === undefined || refTemplate === null
                  ? ""
                  : refTemplate.length === 0
                  ? null
                  : refTemplate[0].TemplateNameWithCode,
                "ReferenceForm"
              );
            }}
          >
            {rowData.Key}
          </a>
        </>
      );
    } else {
      return (
        <>
          <p>{rowData.Key}</p>
        </>
      );
    }
  }
  return (
    <div>
      <DataTable
        value={refDocColumnNull.length === 0 ? refDocColumn : refDocColumnNull}
        responsiveLayout="scroll"
        className=""
        selectionMode="multiple"
        metaKeySelection={false}
        dragSelection
        size="small"
        rows={rows}
        dataKey="TemplateId"
        filterDisplay="row"
      >
        <Column
          style={{ textAlign: "center" }}
          headerStyle={{ width: "30rem" }}
          header={
            <TextHeaderComponents
              textHeaderProps={"Current Template"}
              textSubProps={templateNameWithCode}
            />
          }
          body={actionBodyTemplateTable}
        ></Column>
        <Column
          headerStyle={{ width: "30rem" }}
          style={{ textAlign: "center" }}
          header={
            <TextHeaderComponents
              textHeaderProps={"Reference Form"}
              textSubProps={
                refTemplate === undefined
                  ? ""
                  : refTemplate.length === 0
                  ? null
                  : refTemplate[0].TemplateNameWithCode
              }
            />
          }
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};

export const _TableSelectField = (props: _TableSelectField) => {
  const [objTable, setObjTable] = useState<any>([]);
  const [refDocColumnNull, setRefDocColumnNull] = useState<any>([]);
  const [optionLabel, setOptionLabel] = useState<any>("Label");
  useEffect(() => {
    _AdvanceFormTable();
  }, [props.valueProps, props.referenceDocumentDialogObjectProps]);
  useEffect(() => {}, [objTable]);

  async function _AdvanceFormTable() {
    let _AdvanceFormJSON = JSON.parse(props.valueProps.AdvanceForm);

    _AdvanceFormTableMap(_AdvanceFormJSON);
    setRefDocColumnNull(
      props.dataProps.column === undefined
        ? props.dataProps.objTable
        : props.dataProps.column
    );
    setOptionLabel(props.dataProps.column === undefined ? "Key" : "label");
  }
  async function _AdvanceFormTableMap(_data: any) {
    let _dataItems: any = _data.items;
    let _refDocColumnObj = {};
    let _refDocColumnObjArray: any = [];
    let _referenceDocument =
      props.referenceDocumentDialogObjectProps.SaveDataTable;
    console.log(
      "referenceDocumentDialogObjectProps",
      props.referenceDocumentDialogObjectProps,
      props.dataProps.objTable
    );
    if (
      _referenceDocument !== undefined &&
      _referenceDocument !== null &&
      _referenceDocument.length !== 0
    ) {
      let _dataFilter = _referenceDocument.filter(
        (item: any) =>
          item?.Key ===
          props.referenceDocumentDialogObjectProps.rowDataTable.Key
      );
      console.log("_dataFilter", _dataFilter, props.dataProps);

      if (_dataFilter.length !== 0) {
        props.dataProps.objTable =
          _dataFilter[0].objTable !== undefined &&
          _dataFilter[0].objTable !== null &&
          _dataFilter[0].objTable.length !== 0
            ? _dataFilter[0].objTable
            : props.dataProps.objTable;
      } else {
        props.dataProps.objTable =
          props.dataProps.objTable === undefined ||
          props.dataProps.objTable === null ||
          props.dataProps.objTable.length === 0
            ? []
            : props.dataProps.objTable;
      }
    } else {
      props.dataProps.objTable =
        props.dataProps.objTable === undefined ||
        props.dataProps.objTable === null ||
        props.dataProps.objTable.length === 0
          ? []
          : props.dataProps.objTable;
    }

    if (
      props.dataProps.objTable !== undefined &&
      props.dataProps.objTable !== null &&
      props.dataProps.objTable.length === 0
    ) {
      props.dataProps.Key =
        props.dataProps.Key === "/" ? "" : props.dataProps.Key;
      _dataItems.map((data: any, inx: any) => {
        let _items = data.layout;
        _items.map((dataitems: any, inx: any) => {
          if (
            dataitems.template.type === "tb" &&
            dataitems.template.label === props.dataProps.Key
          ) {
            dataitems.template.attribute.column.map(
              (_dataColumn: any, inx: any) => {
                _refDocColumnObj = {
                  Key: _dataColumn.label,
                  Template: null,
                  TypeControl:
                    _dataColumn.control.template.type === "dd"
                      ? "Dropdown"
                      : _dataColumn.control.template.type === "tb"
                      ? "Table"
                      : _dataColumn.control.template.type === "t"
                      ? "ShortText"
                      : _dataColumn.control.template.type === "d"
                      ? "Calendar"
                      : _dataColumn.control.template.type === "at"
                      ? "Attachmen"
                      : _dataColumn.control.template.type === "r"
                      ? "Radio"
                      : _dataColumn.control.template.type === "ed"
                      ? "Editor"
                      : _dataColumn.control.template.type === "c"
                      ? "Decimal"
                      : _dataColumn.control.template.type,

                  Value: "",
                  objTable: [],
                };
                _refDocColumnObjArray.push(_refDocColumnObj);
              }
            );
          }
        });
      });

      setObjTable(_refDocColumnObjArray);
    } else {
      setObjTable(props.dataProps.objTable);
    }
  }

  async function _ReferenceDocumentDialog(data: any, key: any) {
    if (key !== null && key !== undefined) {
      let _refDocColumn = objTable;
      let _refDocColumnData = data;
      // let _ValuePropsObj = { ...props.valueProps };
      _refDocColumn.map((_d: any, inx: any) => {
        if (_d.Key === _refDocColumnData.Key) {
          _d.Value =
            optionLabel === "label"
              ? key === undefined || key === null
                ? ""
                : key.label === "--Please Select--"
                ? ""
                : key.label
              : key === undefined || key === null
              ? ""
              : key.Key === "--Please Select--"
              ? ""
              : key.Key;
        }
      });

      setObjTable(_refDocColumn);
      // _ValuePropsObj.RefDocColumn = JSON.stringify(_refDocColumn);

      props.setValueProps(_refDocColumn);
    }
  }
  function actionBodyTemplate(rowData: any, option: any) {
    return (
      <>
        <DropdownComponents
          placeholderProps={
            rowData.Value !== "" ? rowData.Value : "--Please Select--"
          }
          onChangeProps={(e: any) => _ReferenceDocumentDialog(rowData, e)}
          optionLabelProps={optionLabel}
          optionsProps={refDocColumnNull}
          keyProps={"selectField"}
        />
      </>
    );
  }
  return (
    <>
      <DataTable
        value={
          objTable !== undefined && objTable !== null && objTable.length === 0
            ? null
            : objTable
        }
        responsiveLayout="scroll"
        className=""
        selectionMode="multiple"
        metaKeySelection={false}
        dragSelection
        size="small"
        dataKey="TemplateId"
        filterDisplay="row"
      >
        <Column
          field="Key"
          headerStyle={{ width: "30rem" }}
          style={{ textAlign: "center" }}
          header={
            <TextHeaderComponents
              textHeaderProps={"Current Template"}
              textSubProps={props.valueProps.TemplateNameWithCode}
            />
          }
        ></Column>
        <Column
          headerStyle={{ width: "30rem" }}
          style={{ textAlign: "center" }}
          header={
            <TextHeaderComponents
              textHeaderProps={"Reference Form"}
              textSubProps={props.referenceFormProps}
            />
          }
          body={actionBodyTemplate}
        ></Column>
      </DataTable>
    </>
  );
};
