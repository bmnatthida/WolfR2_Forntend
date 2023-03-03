import { InputRef, Layout, Typography } from "antd";
import { Form, Input, Table } from "antd";
import type { FormInstance } from "antd/lib/form";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Col, Row } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { IMemoDetailModel } from "../../../IRequestModel/IMemoDetailModel";
import { GetRefDocFormTable } from "../../../Services/MemoService";
import {
  IColumn,
  SelectDataDialog,
} from "../../Select/SelectionDataDialog/SelectDataDialog";

import { AttachmentTableComponent } from "../AttachmentUploadControlComponent/AttachmentComponent";
import { DatePickerTableComponent } from "../DatePickerControlComponent/DatePickerControlComponent";
import { InputTableComponent } from "../InputControlComponent/InputControlComponent";
import { InputNumberTableComponent } from "../InputNumberControlComponent/InputNumberControlComponent";
import { CheckboxTableComponent } from "../MainCheckboxControl/CheckboxComponent";
import { SelectCheckboxTableComponent } from "../MainCheckboxControl/SelectCheckboxComponent";
import { RadioTableComponent } from "../RadioControlComponent/RadioControlComponent";
import { SelectDropdownTableComponent } from "../SelectDropdownContronComponent/SelectDropdownContronComponent";
import { InputTextAreaTableComponent } from "../TextAreaControlComponent/InputTextAreaControlComponent";
import MoveToDialog from "./MoveToDialog";
import RefDocTableDialog from "./RefDocTableDialog";
import "./TableComponentCSS.css";

const { Text } = Typography;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

export interface tableSelectOption {
  actionsCol: {
    label: string;
    rowIdx: number;
    colIdx: number;
    value: any;
  };
  targetCol: {
    label: string;
    rowIdx: number;
    colIdx: number;
    options: { item: string }[];
  };
}

export interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

export type TableInputProps = {
  rowIdx?: number;
  colIdx?: number;
  template: any;
  name: string;
  saveFunc: any;
  inputRef: any;
  value?: any;
  isEditing: boolean;
  onEdit: any;
  children: any;
  canEditDoc: any;
  checkActionPage: any;
  buttonType: string;
  record?: Item;
  tableOptions?: tableSelectOption[];
};

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item, responseControlChange: any) => void;
  template: any;
  onControlChange: any;
  rowTemplate: any;
  colTemplate: any;
  canEditDoc: any;
  checkActionPage: any;
  buttonType: string;
  isError: boolean;
  tableOptions: tableSelectOption[];
  setTableOptions: Dispatch<
    SetStateAction<{ loadtoLabel: string; options: any[] }>
  >;
  // isControlLoading: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  template,
  onControlChange,
  rowTemplate,
  colTemplate,
  canEditDoc,
  checkActionPage,
  buttonType,
  isError,
  tableOptions,
  setTableOptions,
  // isControlLoading,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  // const [templateState, setTemplateState] = useTemplateDescContext();

  useEffect(() => {
    if (editing) {
      inputRef?.current!?.focus({
        cursor: "end",
      });
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async (value?: any, type?: any) => {
    try {
      let values = await form.validateFields();

      let responseControlChange = null;
      if (type === "dd") {
        responseControlChange = await onControlChange(
          template,
          { ...record, ...values, rowTemplate, colTemplate, dataIndex, values },
          true
        );
        if (responseControlChange && responseControlChange.type === "table") {
          values = responseControlChange.value;
        }
      }
      toggleEdit();
      handleSave({ ...record, ...values }, responseControlChange);
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    for (let i = 0; i < template.attribute.column.length; i++) {
      let _col = template.attribute.column[i];
      const label = _col.control.template.label
        ? _col.control.template.label
        : _col.label;
      const type = _col.control.template.type;

      if (label === dataIndex) {
        if (type === "ta") {
          childNode = (
            <InputTextAreaTableComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              inputRef={inputRef}
              saveFunc={save}
              name={dataIndex}
              template={_col.control.template}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
              rowIdx={Number(record.key)}
              colIdx={i}
            />
          );
        } else if (type === "dd") {
          childNode = (
            <SelectDropdownTableComponent
              {...{
                canEditDoc,
                checkActionPage,
                buttonType,
                record,
                tableOptions,
              }}
              inputRef={inputRef}
              saveFunc={save}
              name={dataIndex}
              template={_col.control.template}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
              rowIdx={Number(record.key)}
              colIdx={i}
            />
          );
        } else if (type === "l") {
        } else if (type === "c") {
          childNode = (
            <InputNumberTableComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              inputRef={inputRef}
              rowIdx={Number(record.key)}
              colIdx={i}
              saveFunc={save}
              name={dataIndex}
              template={_col.control.template}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
            />
          );
        } else if (type === "cb") {
          if (_col.control.template.attribute.display === "dd") {
            childNode = (
              <SelectCheckboxTableComponent
                {...{ canEditDoc, checkActionPage, buttonType }}
                inputRef={inputRef}
                saveFunc={save}
                name={dataIndex}
                template={_col.control.template}
                isEditing={editing}
                onEdit={toggleEdit}
                children={children}
              />
            );
          } else {
            childNode = (
              <CheckboxTableComponent
                {...{ canEditDoc, checkActionPage, buttonType }}
                inputRef={inputRef}
                saveFunc={save}
                name={dataIndex}
                template={_col.control.template}
                isEditing={editing}
                onEdit={toggleEdit}
                children={children}
              />
            );
          }
        } else if (type === "t") {
          childNode = (
            <InputTableComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              inputRef={inputRef}
              saveFunc={save}
              name={dataIndex}
              template={_col.control.template}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
            />
          );
        } else if (type === "r") {
          childNode = (
            <RadioTableComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              inputRef={inputRef}
              saveFunc={save}
              name={dataIndex}
              value={record[dataIndex]}
              template={_col.control.template}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
            />
          );
        } else if (type === "d") {
          childNode = (
            <DatePickerTableComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              inputRef={inputRef}
              saveFunc={save}
              name={dataIndex}
              template={_col.control.template}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
            />
          );
        } else if (type === "at") {
          childNode = (
            <AttachmentTableComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              inputRef={inputRef}
              saveFunc={save}
              name={dataIndex}
              template={_col.control.template}
              value={record[dataIndex]}
              isEditing={editing}
              onEdit={toggleEdit}
              children={children}
              rowIdx={Number(record.key)}
              colIdx={i}
            />
          );
        } else if (type === "bt") {
        } else if (type === "id") {
          return <>1</>;
        } else if (type === "action") {
          // return <InputText value={"1"} />;
        }
      }
    }
  }

  return (
    <td
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
      {...restProps}
    >
      <div>{childNode}</div>
    </td>
  );
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
type TableProps = {
  _columns: any;
  _data: any;
  onChange: any;
  layout: any;
  isControlLoading: any;
  onControlChange: any;
  rowTemplate: any;
  colTemplate: any;
  canEditDoc: any;
  checkActionPage: any;
  buttonType: any;
  tableSummary?: any;
  onSubmit: any;
  isError: boolean;
  memoDetail: IMemoDetailModel;
  updateTableSummaries: (tableTemp: any, value: any) => void;
  tableOptions: { loadtoLabel: string; options: any[] };
  setTableOptions: Dispatch<
    SetStateAction<{ loadtoLabel: string; options: any[] }>
  >;
};
const TableComponent: React.FC<TableProps> = ({
  _columns,
  _data,
  onChange,
  layout,
  isControlLoading,
  onControlChange,
  rowTemplate,
  colTemplate,
  canEditDoc,
  checkActionPage,
  buttonType,
  tableSummary,
  onSubmit,
  isError,
  memoDetail,
  updateTableSummaries,
  tableOptions,
  setTableOptions,
  ...props
}) => {
  const [moveToDialogVisible, setMoveToDialogVisible] =
    useState<boolean>(false);
  const [moveFormIndex, setMoveFormIndex] = useState<number>(-1);

  const [summary, setSummary] = useState<any>();

  const [tableLoad, setTableLoad] = useState<boolean>(false);
  const [refTableDialogVisible, setRefTableDialogVisible] =
    useState<boolean>(false);

  const [refTableLoading, setRefTableLoading] = useState<boolean>(false);
  const [refDocOptions, setRefDocOptions] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [refTableColumn, setRefTableColumn] = useState<IColumn[]>([]);

  useMemo(() => {
    if (layout.template.attribute.enabledpopupdefdoc === "Y") {
      fetchRefDocFormTable();
    }
  }, []);

  useMemo(() => {
    setSummary(tableSummary);
  }, [tableSummary]);

  const handleDelete = (key: React.Key) => {
    const newData = _data.filter((item: any) => item.key !== key);
    if (newData.length === 0) {
      summaryFunc();
    }
    // onChange({ row: [...returnToValue(newData)] });
    onChange({ ...layout, data: { row: returnToValue(newData) } });

    setTimeout(() => {
      setTableLoad(false);
    }, 500);
  };

  const menu = useRef<any[]>([]);

  function createRowCopy(key: number) {
    let newData: any = {
      key: key,
    };
    const cols = layout.template.attribute.column;

    cols.map((col: any, i: any) => {
      let type = col.control.template.type;
      if (type == "cb") {
        newData[col.label] = "";
      } else if (type == "t" || type == "ta" || type == "c") {
        newData[col.label] = col.control.template.attribute.default
          ? col.control.template.attribute.default
          : null;
      } else if (type == "dd") {
        let items = col.control.template.attribute.items;
        newData[col.label] = items[0].item;
      } else {
        newData[col.label] = null;
      }
    });

    return newData;
  }

  const handleAdd = () => {
    let newData: any = createRowCopy(_data.length);

    let eiei = [..._data, newData];

    onChange({ ...layout, data: { row: returnToValue(eiei) } });
  };

  const handleAddMultiRow = (newRows: any[]) => {
    let newData: any = newRows;
    let rows: any[] = [..._data];
    newData.map((e: any) => {
      rows.push(e);
    });
    rows.map((e: any, idx: number) => {
      e.key = idx;
    });

    onChange({ ...layout, data: { row: returnToValue(rows) } });
  };

  const returnToValue = (_data: any) => {
    let newJa: any = [];
    for (let i = 0; i < _data.length; i++) {
      const _eiei = _data[i];
      let gogo = [];
      for (let j = 0; j < layout.template.attribute.column.length; j++) {
        const column = layout.template.attribute.column[j];
        gogo.push({ value: _eiei[column.label] });
      }
      newJa.push(gogo);
    }

    return newJa;
  };

  const calCulateFunc = (row: any) => {
    try {
      if (layout.template.formula !== "") {
        const formulas = layout.template.formula.split("|");
        const columns = layout.template.attribute.column;
        formulas.map((formula: string) => {
          let resulstField = formula.split("=");
          let formu: any = resulstField[0];
          let resultColIdx = -1;
          let resultDecimal = 0;
          let result: number | undefined = 0;

          const allField = formu.match(/[^+\-\*\/=]+/g) || [];

          allField.forEach((field: string) => {
            columns.forEach((col: any, colIdx: number) => {
              if (field === col.label) {
                const decimal = Number(col.control.template.attribute.decimal);
                const value = Number(
                  row[col.label]?.replaceAll(",", "")
                ).toFixed(decimal);
                formu = formu.replace(
                  col.label,
                  value !== "NaN" ? value : Number(0).toFixed(decimal)
                );
              }
              if (col.label === resulstField[1]) {
                resultColIdx = colIdx;
                resultDecimal = Number(col.control.template.attribute.decimal);
              }
            });
          });

          let dd = formu.replaceAll(",", "");
          result = eval(dd);
          row[resulstField[1]] = result?.toFixed(resultDecimal);
        });
      }
    } catch (error) {
      console.log("table=>cal=>error", error);
    }
  };

  const summaryFunc = () => {
    try {
      if (tableSummary) {
        const cols = layout.template.attribute.column;
        const _tableSummary = JSON.stringify(tableSummary);
        let _sum = JSON.parse(_tableSummary);
        cols.map((e: any) => {
          if (e.control.template.type === "c") {
            _sum[e.label] = 0;
          }
        });
        _data.forEach((e: any) => {
          cols.map((col: any, colidx: number) => {
            if (col.control.template.type === "c") {
              //ทำไว้เผื่อแก้โครงสร้าง object ที่ผิดรูป
              if (!e[col.control.template.label]) {
                col.control.template.label = col.label;
              }

              if (e[col.control.template.label]) {
                if (e[col.control.template.label]) {
                  col.control.template.label = col.label;
                  if (
                    !Number.isNaN(
                      Number(e[col.control.template.label]?.replaceAll(",", ""))
                    )
                  ) {
                    _sum[col.control.template.label] += Number(
                      e[col.control.template.label]?.replaceAll(",", "")
                    );
                  } else if (
                    !Number.isNaN(Number(e[col.control.template.label]))
                  ) {
                    _sum[col.control.template.label] += Number(
                      e[col.control.template.label]
                    );
                  }
                }
              }
            }
          });
        });

        updateTableSummaries(layout.template, _sum);
      }
    } catch (error) {
      console.log("table=>sum=>error", error);
    }
  };

  useMemo(() => summaryFunc(), [_data]);

  const handleSave = (row: any, responseControlChange?: any) => {
    const newData = [..._data];
    const index = newData.findIndex((item) => row.key === item.key);

    calCulateFunc(row);

    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    let res = layout;

    if (responseControlChange && responseControlChange.type === "control") {
      for (let i = 0; i < responseControlChange.value.length; i++) {
        const items = responseControlChange.value[i];
        for (let j = 0; j < items.layout.length; j++) {
          const _layout = items.layout[j];
          if (_layout.template.label === layout.template.label) {
            res = _layout;
          }
        }
      }
    }
    // console.log("table=>responseControlChange", responseControlChange);

    // if (responseControlChange.type === "table_dd_to_dd") {
    //   res = responseControlChange.value;
    // }
    onChange({ ...res, data: { row: returnToValue(newData) } });
  };

  const defColumns: any[] = _columns.map((_col: any, idx: any) => {
    return {
      ..._col,
    };
  });

  if (canEditDoc) {
    defColumns.push({
      title: (
        <i
          className="pi pi-plus"
          id="add_bt"
          onClick={() => {
            try {
              if (layout.template.attribute.enabledpopupdefdoc === "Y") {
                setRefTableDialogVisible(true);
              } else {
                handleAdd();
              }
            } catch (error) {
              console.log("table=>error", error);
            }
          }}
        ></i>
      ),
      className: "action-column",
      key: "operation",
      align: "center",
      fixed: "right",
      width: 50,
      render: (_: any, record: { key: number }) => (
        <div>{actionBodyTemplate(record.key)}</div>
      ),
      onCell: (record: any, rowIndex: number) => {
        return {
          onClick: (e: any) => {
            menu?.current[record?.key]?.toggle(e);
          },
        };
      },
    });
  }

  const addRowTo = (key: number) => {
    try {
      let rows: any[] = _data;
      let newData: any = createRowCopy(key);
      rows.splice(key, 0, newData);
      rows.map((row: any, idx: number) => (row.key = idx));
      onChange({ ...layout, data: { row: returnToValue(rows) } });

      setTimeout(() => {
        setTableLoad(false);
      }, 500);
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  const duplicate = (key: number) => {
    try {
      let rows: any[] = _data;
      let newData: any = createRowCopy(key);
      layout.template.attribute.column.forEach((_col: any) => {
        newData[_col.label] = rows[key][_col.label];
      });
      rows.splice(key, 0, newData);
      rows.map((row: any, idx: number) => (row.key = idx));
      console.log("table=>rows", returnToValue(rows));

      onChange({ ...layout, data: { row: returnToValue(rows) } });
    } catch (error) {
      console.log("table=>error", error);
    }
    setTimeout(() => {
      setTableLoad(false);
    }, 500);
  };

  const moveTo = (key: number) => {
    try {
      if (moveFormIndex !== -1) {
        let dd = JSON.stringify(_data);
        let rows: any[] = JSON.parse(dd);
        let updateRow = rows.splice(moveFormIndex, 1)[0];
        rows.splice(key, 0, updateRow);
        setMoveFormIndex(-1);
        rows.map((row: any, idx: number) => (row.key = idx));

        onChange({ ...layout, data: { row: returnToValue(rows) } });

        setTimeout(() => {
          setTableLoad(false);
        }, 500);
      }
    } catch (error) {
      console.log("table=>error", error);
    }
  };

  const actionBodyTemplate = (key: number) => {
    const items = [
      {
        label: "Create new item",
        icon: "pi pi-fw pi-plus",
        items: [
          {
            label: "Create new item above",
            icon: "pi pi-fw pi-plus",
            command: () => {
              setTableLoad(true);
              addRowTo(key);
            },
          },
          {
            label: "Create new item below",
            icon: "pi pi-fw pi-plus",
            command: () => {
              setTableLoad(true);
              addRowTo(key + 1);
            },
          },
        ],
      },
      {
        label: "Move to",
        icon: "pi pi-fw pi-sort-alt",
        command: () => {
          setMoveFormIndex(key);
          setMoveToDialogVisible(true);
        },
      },
      {
        label: "Duplicate",
        icon: "pi pi-fw pi-copy",
        command: () => {
          setTableLoad(true);
          duplicate(key);
        },
      },
      {
        label: "Delete",
        icon: "pi pi-fw pi-trash",
        command: () => {
          setTableLoad(true);
          handleDelete(key);
        },
      },
    ];
    return (
      <React.Fragment>
        <TieredMenu
          model={items}
          popup
          ref={(el) => {
            menu.current[key] = el;
          }}
        />
        <i className=" header-click">
          <IoEllipsisVertical className="pi pi-bars" />
        </i>
      </React.Fragment>
    );
  };

  const columns = defColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        template: layout.template,
        onControlChange,
        rowTemplate,
        colTemplate,
        canEditDoc,
        checkActionPage,
        buttonType,
        tableOptions,
        setTableOptions,
      }),
    };
  });

  const renderTableFooter = () => {
    let footers = layout.template.attribute?.footerTable?.rows;
    const columns = layout.template.attribute.column;
    if (footers) {
      let attribute: any[] = [];
      footers.forEach((row: any) => {
        let formu = row.formula;
        let decimal: number = 0;
        const _row = { ...row };
        const allField = formu.match(/[^+\-\*\/=]+/g) || [];

        columns.forEach((col: any, colIdx: number) => {
          if (allField.includes(col.label)) {
            decimal = Number(col.control.template.attribute.decimal);

            formu = formu.replace(
              col.label,
              summary[col.label].toFixed(decimal) !== "NaN"
                ? summary[col.label].toFixed(decimal)
                : Number(0).toFixed(decimal)
            );
          }
        });

        const value = addbits(formu)?.toLocaleString(undefined, {
          minimumFractionDigits: decimal,
        });

        _row.value = value;
        _row.formula = formu;
        attribute.push(_row);
      });

      attribute.map((footer: any) => {
        const footerTable = footer.formula.match(/[/[ก-๙A-Za-z.()]/g) || [];
        if (footerTable.length > 0) {
          let formula = footer.formula;
          const allField = formula.match(/[^+\-\*\/=]+/g) || [];
          attribute.map((attributefooter: any) => {
            let decimal: number = 5;

            if (allField.includes(attributefooter.label)) {
              console.log(
                "Number" + attributefooter.value,
                Number(attributefooter.value)
              );
              const _val = attributefooter.value.replace(/,/g, "");
              formula = formula.replace(
                attributefooter.label,
                Number(_val).toString() !== "NaN"
                  ? Number(_val).toString()
                  : "0.00"
              );

              const value = addbits(formula)?.toLocaleString(undefined, {
                maximumFractionDigits: 3,
              });

              footer.value = value;
            }
          });
        }
      });

      return (
        <>
          <Row>
            <Col xs={12} sm={12} xl={12} className={"footer-layout"}>
              {attribute?.length > 0 &&
                _data.length > 0 &&
                attribute.map((row: any) => {
                  try {
                    return (
                      <Row>
                        <Col
                          xs={10}
                          sm={10}
                          xl={10}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          {row.label}
                        </Col>
                        <Col xs={2} sm={2} xl={2}>
                          <Input
                            size={"large"}
                            placeholder={row.label}
                            addonAfter={row.symbol}
                            value={row.value}
                          />
                        </Col>
                      </Row>
                    );
                  } catch (error) {
                    console.log("table=>error", error);
                  }
                })}
            </Col>
          </Row>
        </>
      );
    }

    function addbits(s: any) {
      try {
        let newForm = s.split("=");
        var total = 0;
        let result =
          newForm[0].match(
            /\((?:\d+)((\d{1,3})*([\,\ ]\d{3})*)(\.\d+)?[*+/-](?:\d+)((\d{1,3})*([\,\ ]\d{3})*)(\.\d+)?\)/g
          ) || [];
        if (result.length > 0) {
          total = eval(result.join("+"));
        } else {
          result =
            newForm[0].match(
              /(?:\d+)((\d{1,3})*([\,\ ]\d{3})*)(\.\d+)?[\,\ ]?[*+/-][\,\ ]?(?:\d+)((\d{1,3})*([\,\ ]\d{3})*)(\.\d+)?/g
            ) || [];
          if (result.length > 0) {
            let strFormula = "";

            for (let i = 0; i < result.length; i++) {
              strFormula = strFormula + result[i];
            }

            total = eval(strFormula);
          }
        }
        return total;
      } catch (error) {
        console.log("table=>error: ", error);
      }
    }
  };

  async function fetchRefDocFormTable() {
    let tempAtt = layout.template.attribute;
    if (refDocOptions.length === 0) {
      setRefTableLoading(true);
      if (tempAtt !== undefined) {
        if (tempAtt.refdoc !== undefined) {
          const dataRequest = {
            PageIndex: 0,
            PageSize: 0,
            CUserID: memoDetail.creator.EmployeeId.toString(),
            RUserID: memoDetail.requestor.EmployeeId.toString(),
            ConditionRefdoc:
              tempAtt.conditionrefdoc.length > 0
                ? JSON.stringify(tempAtt.conditionrefdoc)
                : "",
            Search: "",
            docDataSource: tempAtt.refdoc.docDataSource,
            docReport: tempAtt.refdoc.docReport,
            docCancelDoc: tempAtt.refdoc.docCancelDoc,
            docEditDoc: tempAtt.refdoc.docEditDoc,
            docNewDoc: tempAtt.refdoc.docNewDoc,
            doccontrol: tempAtt.refdoc.doccontrol !== "N",
            docref: tempAtt.refdoc.docref,
          };

          const refDetails = await GetRefDocFormTable(dataRequest);

          if (refDetails) {
            if (refDetails?.dt_Report?.length > 0) {
              let refColumn: any[] = [];
              tempAtt.mergecolumnrefdoc.forEach((e: any) => {
                refColumn.push({
                  field: e.RefDocLabel.split("_")[1],
                  headerEn: e.RefDocLabel.split("_")[1],
                });
              });

              setRefTableColumn([...refColumn]);
              setRefDocOptions([...refDetails.dt_Report]);
            }
          }
        }
      }
      setRefTableLoading(false);
    }
  }

  return (
    <>
      <Col
        sm={12}
        md={12}
        xs={12}
        xl={12}
        className={"padding-controller"}
        onClick={() => {
          if (tableLoad) {
            setTableLoad(false);
          }
        }}
      >
        <Table
          className={`padding-controller control-table ${
            isError && "error-table"
          }`}
          components={
            !tableLoad
              ? {
                  body: {
                    cell: EditableCell,
                    row: EditableRow,
                  },
                }
              : {}
          }
          dataSource={_data}
          loading={tableLoad}
          columns={columns as ColumnTypes}
          rowClassName={() => "editable-row"}
          bordered
          id="table-control"
          scroll={{ x: 1500 - 1000, y: 500 }}
          footer={renderTableFooter}
          summary={(pageData: any) => {
            try {
              const cols = layout?.template?.attribute?.column;
              let isShowSum = false;
              cols.forEach((col: any, idx: any) => {
                if (col.control.template.attribute.isSummary === "Y") {
                  isShowSum = true;
                  return;
                }
              });
              if (isShowSum && _data.length > 0 && summary) {
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <span>Total</span>
                      </Table.Summary.Cell>
                      {cols.map((col: any, idx: any) => {
                        if (col.control.template.attribute.isSummary !== "Y") {
                          return (
                            <Table.Summary.Cell
                              index={idx}
                            ></Table.Summary.Cell>
                          );
                        } else {
                          return (
                            <Table.Summary.Cell index={idx} align="right">
                              <Text style={{ margin: "15px" }}>
                                {!isNaN(
                                  Number(summary[col.control.template.label])
                                )
                                  ? Number(
                                      Number(
                                        summary[col.control.template.label]
                                      )
                                    ).toLocaleString("en-US", {
                                      minimumFractionDigits: Number(
                                        col.control.template.attribute.decimal
                                      ),
                                    })
                                  : "0.00"}
                              </Text>
                            </Table.Summary.Cell>
                          );
                        }
                      })}
                      <Table.Summary.Cell
                        index={cols.length + 1}
                      ></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }
            } catch (error) {
              console.log("table=>sum=>", error);
            }
          }}
        />

        <MoveToDialog
          header={"Move To"}
          dataLength={_data.length}
          isVisible={moveToDialogVisible}
          setIsVisible={setMoveToDialogVisible}
          setLoading={setTableLoad}
          moveFunc={moveTo}
        />

        <SelectDataDialog
          dialogKey={"refDocTable"}
          dataList={refDocOptions}
          dialogVisible={refTableDialogVisible}
          setDialogVisible={setRefTableDialogVisible}
          selectionMode={"multi"}
          columns={refTableColumn}
          loading={refTableLoading}
          selectionData={selectedData}
          setSelectedData={setSelectedData}
          customFooter={() => {
            return (
              <Button
                label="OK"
                loading={refTableLoading}
                onClick={() => {
                  try {
                    if (selectedData?.length > 0) {
                      let newRows: any[] = [];
                      selectedData?.map((e: any, idx: number) => {
                        let newRow = createRowCopy(idx);
                        layout.template.attribute.mergecolumnrefdoc.forEach(
                          (col: any) => {
                            const targetLabel = col.RefDocLabel.split("_")[1];
                            newRow[targetLabel] = e[targetLabel];
                          }
                        );
                        newRows.push(newRow);
                      });
                      handleAddMultiRow(newRows);
                      setSelectedData([]);
                      setRefTableDialogVisible(false);
                    }
                  } catch (error) {
                    console.log("table=>ref=>", error);
                  }
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
            );
          }}
        />
      </Col>
    </>
  );
};

export default TableComponent;
