import React, { useEffect, FC, useRef, Dispatch, SetStateAction } from "react";
import Row from "react-bootstrap/Row";
import "./CoreControllerComponent.css";
import { useFieldArray } from "react-hook-form";

import Controls from "./Controls";
import { Form, Spin } from "antd";
import {
  ILogic,
  ILogicReferenceField,
  ILogicTypeDataLineApprove,
  ILogicTypeReference,
  ILogicTypeReladToLoadData,
  ILogicTypeSourceRelated,
} from "../../../IRequestModel/ILogicModel";
import { ISelectDropdownTemplate } from "../../../IRequestModel/ITemplateDescModel";
import { formatToColumns } from "../../../Helper/formatColumn";
import { formatKeyLogicData } from "../../../Helper/formatKeyLogicData";
import { INumberFormula } from "../../../IRequestModel/INumberFormula";
import {
  IAutoNumberAttibute,
  IAutoNumberFormat,
  IFormat,
} from "../../../IRequestModel/IAutoNumberFormat";
import {
  GetAutoNumber,
  GetRvsRunning,
} from "../../../Services/RequestControlService";
import { IRvsAttribute } from "../../../IRequestModel/IRvision";
import { onChanceRef, RefResult } from "../../../Helper/RequestRefFunctions";
import { GetApprovalsByMemoIDs } from "../../../Services/LineApprovalsService";
import { genAutoNum } from "../../../Helper/RequestScreenHelper";
import { log } from "console";
import { tableSelectOption } from "../../AntdControlComponent/TableComponent/TableComponent";
interface Props {
  templateDesc: any;
  setMemoDetail: any;
  memoDetail: any;
  control: any;
  register: any;
  handleSubmit: any;
  onSubmit: any;
  documentNo: any;
  errors: any;
  reset: any;
  allLogic: ILogic[];
  isFirstRun: any;
  jsonConditions: any;
  setJsonConditions: any;
  onControlChange: (controlName: any, controlValue: any) => any;
  numFormulas: INumberFormula[];
  lineApproval: any;
  setLineApproval: (value: any[]) => void;
  autoNumFormat: IAutoNumberAttibute;
  setValue: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
  isControlLoading: boolean;
  setIsControlLoading: (valaue: boolean) => void;
  getLineApproveForAmount: (
    amount: number,
    jsonCondition: string,
    logicType?: string,
    layout?: any
  ) => void;
  previousView: any;
  tableSummaries: any;
  setTableSummaries: (value: any[]) => void;
  refTempSelected: any[];
  listFormNames: any;
  setListRefDocDetails: (value: any[]) => void;
  setListFileAttachDetails: (value: any[]) => void;
  refAttribute: any;
  prepareInitialLogic: (logics: ILogic[], templateDesc: any) => void;
  onProcessLogicReference: (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    control: any
  ) => Promise<{
    loadTo: any[];
    data: any[];
    row: number;
    col: number;
  } | null>;
  previousRefTempSelected: any;
  tableOptions: tableSelectOption[];
  setTableOptions: (value: tableSelectOption[]) => void;
}

export const CoreControllerComponentTest: FC<Props> = ({
  onProcessLogicReference,
  templateDesc,
  setMemoDetail,
  isFirstRun,
  previousRefTempSelected,
  control,
  register,
  handleSubmit,
  onSubmit,
  documentNo,
  errors,
  onControlChange,
  reset,
  memoDetail,
  allLogic,
  jsonConditions,
  setJsonConditions,
  numFormulas,
  lineApproval,
  setLineApproval,
  autoNumFormat,
  setValue,
  canEditDoc,
  checkActionPage,
  buttonType,
  isControlLoading,
  setIsControlLoading,
  getLineApproveForAmount,
  setListFileAttachDetails,
  tableSummaries,
  setTableSummaries,
  previousView,
  refTempSelected,
  listFormNames,
  refAttribute,
  setListRefDocDetails,
  prepareInitialLogic,
  tableOptions,
  setTableOptions,
}) => {
  // const [isControlLoading, setIsControlLoading] = useState(false);

  const { fields, append, prepend, remove, swap, move, insert, update } =
    useFieldArray({
      control, // control from template_desc
      name: "items",
    });

  const controlRef = useRef([]);
  const logTemplateDesc = async () => {};
  const returnToValure = (template: any, _data: any) => {
    let newJa: any = [];
    console.log({ template, _data });
    // for (let i = 0; i < _data.length; i++) {
    // const _eiei = _data[i];
    let gogo = [];
    for (let j = 0; j < template.attribute.column.length; j++) {
      const column = template.attribute.column[j];
      gogo.push({ value: _data[column.label] });
    }
    // newJa.push(gogo);
    return gogo;
  };
  const checkIsSummaryWithoutLogic = (logics: any, controlTemplate: any) => {
    let isSummary: boolean = false;

    return isSummary;
  };
  useEffect(() => {
    processRef();
  }, [refAttribute, refTempSelected]);

  async function processRef() {
    try {
      if (refAttribute) {
        if (refAttribute.refIdOnQuery) {
          try {
            const refResult: RefResult = await onChanceRef(
              refTempSelected,
              memoDetail,
              listFormNames,
              refAttribute,
              fields,
              _onControlChange
            );

            if (refResult.errorMessage) {
            } else if (refResult.items.length > 0) {
              if (canEditDoc) {
                previousRefTempSelected.current = refTempSelected;
                onRefSelect(refResult, refTempSelected);
              }
            }
          } catch (error) {
            console.log("ref=>error", error);
          }
        } else if (
          !isFirstRun.current &&
          previousView.current === "2" &&
          JSON.stringify(previousRefTempSelected.current) !==
            JSON.stringify(refTempSelected)
        ) {
          try {
            const refResult: RefResult = await onChanceRef(
              refTempSelected,
              memoDetail,
              listFormNames,
              refAttribute,
              fields,
              _onControlChange
            );

            if (refResult.errorMessage) {
            } else if (refResult.items.length > 0) {
              if (canEditDoc) {
                previousRefTempSelected.current = refTempSelected;
                onRefSelect(refResult, refTempSelected);
              }
            }
          } catch (error) {
            console.log("ref=>error", error);
          }
        }
      }
    } catch (error) {
      console.log("ref=>useEffect=>error", error);
    }
  }

  const onRefSelect = async (refResult: any, refSelected: any) => {
    try {
      setIsControlLoading(true);
      let _listLineApprove: any[] = [...lineApproval];
      let listMemoIds: number[] = [];
      refSelected.forEach((e: any) => {
        listMemoIds.push(e.MemoId);
      });

      if (refAttribute?.isDefaultLineApprove) {
        const resApprovals: any[] = await GetApprovalsByMemoIDs(listMemoIds);
        if (resApprovals?.length > 0) {
          setLineApproval([..._listLineApprove, ...resApprovals]);
        }
      }

      const _control = await detechRevisionControl(
        memoDetail.template_id,
        refResult.items,
        listMemoIds[0]
      );

      const newControl = await _onControlChangeRef(_control);

      setValue("items", [...newControl.items]);

      setListRefDocDetails(refResult.listRefDocsDetail);
      console.log("ref=>refResult", refResult);

      setListFileAttachDetails(refResult.listFileAttachDetails);
    } catch (error) {
      console.log("ref=>error", error);
    }
  };
  const onProcessSummary = (
    _control: any,
    jsonCondition: any,
    controlTemplate?: any,
    controlValue?: any
  ) => {
    try {
      let _amount = 0;
      let isSum = false;
      let isControlHasSum = false;

      if (
        controlTemplate &&
        controlTemplate.type === "c" &&
        controlTemplate.attribute.summary === "Y"
      ) {
        isControlHasSum = true;
      }
      _control.forEach((item: any, rowIdx: number) => {
        item.layout.forEach((layout: any) => {
          try {
            if (layout.template.type === "c") {
              if (layout.template.attribute.summary === "Y") {
                isControlHasSum = true;
                isSum = true;
                _amount += Number(layout.data.value);
              }
            } else if (layout.template.type === "tb") {
              const tableCol: any[] = layout.template.attribute.column;
              let tableSum: number = 0;

              if (controlValue || controlValue.length > 0) {
                const selTable =
                  controlTemplate?.type === "tb"
                    ? controlValue?.find(
                        (e: any) => e.tableTemp.label === layout.template.label
                      )
                    : tableSummaries?.find(
                        (e: any) => e.tableTemp.label === layout.template.label
                      );

                tableCol.forEach((col: any, colIdx: number) => {
                  if (col.control.template.attribute.summary === "Y") {
                    if (
                      !Number.isNaN(
                        Number(selTable.AllCol[col.control.template.label])
                      )
                    ) {
                      isSum = true;
                      isControlHasSum = true;
                      tableSum += Number(
                        selTable.AllCol[col.control.template.label]
                      );
                    }
                  }
                });
              } else {
                tableCol.forEach((col: any, colIdx: number) => {
                  if (col.control.template.attribute.summary === "Y") {
                    layout.data.row?.forEach((row: any) => {
                      isSum = true;
                      isControlHasSum = true;
                      if (Number(row[colIdx]) !== 0) {
                        tableSum += Number(row[colIdx]);
                      }
                    });
                  }
                });
              }
              _amount += tableSum;
            }
          } catch (error) {
            console.log("sum=>error", error);
          }
        });
      });

      return {
        _amount: _amount,
        isSum: isSum,
        isControlHasSum: isControlHasSum,
      };
    } catch (error) {
      console.log("sum=>error", error);
    }
  };

  const calCulateCorecontrol = (
    currentControl: any,
    controlTemplate: any,
    controlValue: any
  ) => {
    try {
      numFormulas?.forEach((formula: INumberFormula) => {
        if (formula.formula) {
          let resulstField = formula.formula.split("=");
          let variables = resulstField[0];
          let match: any = resulstField[0].match(/[^+\-\*\/=]+/g) || [];
          let total: number = NaN;
          match.forEach((formu: any) => {
            if (formu?.includes("sum")) {
              if (controlTemplate.type === "tb") {
                const selCol = formu
                  .substring(formu.indexOf("(") + 1, formu.lastIndexOf(")"))
                  .split(";");
                const tableCol: any[] = controlTemplate.attribute.column;
                const selValue = controlValue.find(
                  (e: any) => e.tableTemp.label === selCol[0]
                );

                tableCol?.forEach((col: any) => {
                  if (selCol[1] === col.label) {
                    total = 0;
                    if (selValue?.AllCol[col.label]) {
                      variables = variables.replace(
                        formu,
                        selValue.AllCol[selCol[1]].toString()
                      );
                    }
                  }
                });
              } else {
                currentControl.forEach((layout: any) => {
                  layout.layout.forEach((col: any) => {
                    if (col.template.type === "tb") {
                      const selCol = formu
                        .substring(
                          formu.indexOf("(") + 1,
                          formu.lastIndexOf(")")
                        )
                        .split(";");
                      const tableCol: any[] = col.template.attribute.column;

                      const selValue = tableSummaries.find(
                        (e: any) => e.tableTemp.label === selCol[0]
                      );
                      tableCol?.forEach((col: any) => {
                        if (selCol[1] === col.label) {
                          if (selValue?.AllCol[col.label]) {
                            variables = variables.replace(
                              formu,
                              selValue.AllCol[selCol[1]].toString()
                            );
                          }
                        }
                      });
                    }
                  });
                });
              }
            } else {
              currentControl?.forEach((item: any, rowIdx: number) => {
                item?.layout?.forEach((layout: any) => {
                  if (match.includes(layout.template.label)) {
                    if (layout.data.value && layout.data.value !== "") {
                      variables = variables.replace(
                        layout.template.label,
                        layout.data.value.toString().replaceAll(",", "")
                      );
                    } else {
                      variables = variables.replace(layout.template.label, "0");
                    }
                  }
                });
              });
            }
          });
          var regExp = /[a-zA-Zก-๏]/g;

          if (!regExp.test(variables)) {
            total = eval(variables);
          }
          if (!isNaN(total)) {
            currentControl[formula.rowIndex].layout[
              formula.colIndex
            ].data.value = total.toFixed(
              currentControl[formula.rowIndex].layout[formula.colIndex].template
                .attribute.decimal
            );
          }
        }
      });

      return currentControl;
    } catch (error) {
      console.log("cal=>error", error);
    }
  };

  const updateTableSummaries = (tableTemp: any, value: any) => {
    if (tableSummaries) {
      const _tableSummaries = JSON.stringify(tableSummaries);
      let _sumTable = JSON.parse(_tableSummaries);

      _sumTable.map((e: any) => {
        if (e.tableTemp.label === tableTemp.label) {
          e.AllCol = value;
        }
      });

      if (JSON.stringify(_sumTable) !== JSON.stringify(tableSummaries)) {
        _onControlChange(tableTemp, _sumTable, true);
        setTableSummaries([..._sumTable]);
      }
    }
  };

  //check if control has logic
  const checkCallLogic = (logics: any, controlTemplate: any) => {
    let callLogic: boolean = false;
    let logicType: string | null = null;

    logics.forEach((logic: ILogic) => {
      if (logic.logictype === "datasourcerelated") {
        console.log("logic=>", logic.logictype);

        const jsonValue: ILogicTypeSourceRelated =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));

        if (controlTemplate.type === "tb") {
          for (let j = 0; j < controlTemplate.attribute.column.length; j++) {
            const col = controlTemplate.attribute.column[j];
            if (jsonValue.label === col.label) {
              logicType = "datasourcerelated";
              callLogic = true;
            }
          }
        } else {
          if (jsonValue.label === controlTemplate.label) {
            callLogic = true;
            logicType = "datasourcerelated";
          }
        }
      } else if (logic.logictype === "dataajaxloadtable") {
        const jsonValue: ILogicTypeSourceRelated =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));

        console.log(
          "logic=>labelAction",
          jsonValue.labelactions,
          controlTemplate.label
        );

        const selectAction = jsonValue.labelactions.find(
          (e) => e.label === controlTemplate.label
        );
        if (selectAction) {
          callLogic = true;
          logicType = "dataajaxloadtable";
        }
      } else if (logic.logictype === "datareladtoloaddata") {
        const jsonValue: ILogicTypeReladToLoadData =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));
        if (controlTemplate.type === "tb") {
          for (let i = 0; i < jsonValue.labelactions.length; i++) {
            const labelAction = jsonValue.labelactions[i];
            for (let j = 0; j < controlTemplate.attribute.column.length; j++) {
              const col = controlTemplate.attribute.column[j];
              if (labelAction.label === col.label) {
                logicType = "datareladtoloaddata";
                callLogic = true;
              }
            }
          }
        } else {
          for (let i = 0; i < jsonValue.labelactions.length; i++) {
            const labelAction = jsonValue.labelactions[i];

            if (labelAction.label === controlTemplate.label) {
              console.log({ controlTemplate, jsonValue });
              logicType = "datareladtoloaddata";

              callLogic = true;
            }
          }
        }
      } else if (logic.logictype === "reference") {
        const jsonValue: ILogicTypeReference =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));
        for (let i = 0; i < jsonValue.Filter.length; i++) {
          const filter = jsonValue.Filter[i];
          if (filter.TBColumn === controlTemplate.label) {
            logicType = "reference";
            callLogic = true;
          }
        }
      } else if (logic.logictype === "datalineapprove") {
        const jsonValue: ILogicTypeDataLineApprove =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));
        if (jsonValue.label === controlTemplate.label) {
          callLogic = true;
          logicType = "datalineapprove";
        }
      }
    });
    // console.log({ callLogic, logicType });

    return { callLogic, logicType };
  };
  const _onControlChangeRef = async (refControl: any) => {
    let _jsonConditions = jsonConditions;
    let logic: string | null = null;
    let template: any = null;
    if (!isFirstRun?.current) {
      if (previousView?.current === "2") {
        const logics = allLogic;

        let oldRefControl = refControl;

        setIsControlLoading(true);

        oldRefControl = await prepareInitialLogic(logics, {
          items: oldRefControl,
        });

        for (let i = 0; i < oldRefControl.items.length; i++) {
          const item = oldRefControl.items[i];
          for (let j = 0; j < item.layout.length; j++) {
            const layout = item.layout[j];
            if (layout.template.type !== "tb") {
              const { callLogic, logicType } = await checkCallLogic(
                logics,
                layout.template
              );
              if (callLogic && logicType) {
                logic = logicType;
                template = layout.template;
              }
              if (callLogic) {
                for (let i = 0; i <= logics.length; i++) {
                  const _response = await onProcessLogic(
                    logics[i],
                    layout.template,
                    layout.data.value,
                    refControl,
                    false
                  );

                  _jsonConditions = _response || "";
                  console.log({ _responseRef: _response });
                }
              }
            }
          }
        }

        if (autoNumFormat.formats.length > 0 && canEditDoc) {
          oldRefControl.items = await genAutoNum(
            oldRefControl.items,
            autoNumFormat,
            memoDetail.template_id
          );
        }

        const sumRes = await onProcessSummary(
          refControl,
          _jsonConditions,
          template,
          null
        );

        setIsControlLoading(false);
        return oldRefControl;
      }
      return refControl;
    }
    return refControl;
  };

  //trigger when control value change
  const _onControlChange = async (
    controlTemplate: ISelectDropdownTemplate | any, //controled change template
    controlValue: any, //value
    isInTable: boolean = false, // if control in table
    isRef?: boolean
  ) => {
    try {
      let _amount = 0;
      let _jsonConditions: string = jsonConditions; //condition for datalineapprove logic
      console.log(
        { controlTemplate, controlValue, isInTable },
        "sssssssssssssss"
      );

      setIsControlLoading(true);

      //for not trigger when change tap to Information screen
      if (controlValue && !isFirstRun?.current) {
        if (previousView?.current === "2") {
          const logics = allLogic; //all template logic
          console.log("table=>", { logics });

          //check if triggered control has logic or not
          const { callLogic, logicType } = await checkCallLogic(
            logics,
            controlTemplate
          );
          console.log("logic=>callLogic", callLogic, logicType);

          //unrelate constant
          const _controlString = JSON.stringify(fields);
          let oldControl = JSON.parse(_controlString);
          let _control = JSON.parse(_controlString);

          const newControlString = JSON.stringify(_control);
          let newControl = JSON.parse(newControlString);

          //check if can call logic and this control not type = tb

          //calculate all control value to amount in memodetail
          _control = await calCulateCorecontrol(
            _control,
            controlTemplate,
            controlValue
          );

          if (autoNumFormat.formats.length > 0 && canEditDoc) {
            _control = await genAutoNum(
              _control,
              autoNumFormat,
              memoDetail.template_id
            );
          }

          const sumRes = await onProcessSummary(
            _control,
            _jsonConditions,
            controlTemplate,
            controlValue
          );

          if ((controlTemplate.type !== "tb" || isInTable) && callLogic) {
            /*process logic return type [control,table,lineapprove] and value when fetch from api
             1.control value in template
             2.table value in row in table
             3.lineapprove value is jsoncondition
            */
            for (let i = 0; i <= logics.length; i++) {
              const { type, value, controls } = await onProcessLogic(
                logics[i],
                controlTemplate,
                controlValue,
                _control,
                isInTable,
                sumRes
              );

              if (type === "table_dd_to_dd" && isInTable) {
                //setNewOptionToControl
                _control[controls.row].layout[
                  controls.layout
                ].template.attribute.column[
                  controls.columnTb
                ].control.template.attribute.items = value;
              } else if (type === "control") {
                _control = value;
              }
              //return value to save function in TableComponent
              if ((type === "table" || type === "control") && isInTable) {
                setIsControlLoading(false);
                return { type, value };
              } else if (type === "lineapprove" && !isInTable) {
                //set jsonconditions
                _jsonConditions = value || "";
              }
            }
          }

          //set value to hook-form

          if (_control && !isRef) {
            if (JSON.stringify(_control) !== JSON.stringify(oldControl)) {
              setValue("items", [..._control]);
            }
          }
        } else {
          setIsControlLoading(false);
        }
      } else {
        setIsControlLoading(false);
      }
      setIsControlLoading(false);
    } catch (error) {
      setIsControlLoading(false);
      console.log("core=>error", error);
    }
  };

  const detechRevisionControl = async (
    _templateId: any,
    _control: any,
    memoId?: number
  ) => {
    try {
      let requestBody: any = {};
      let items: any[] = [];
      let rowIndex = -1;
      let colIndex = -1;

      _control.forEach((item: any, rowIdx: number) => {
        item.layout.forEach((layout: any, colIdx: number) => {
          if (layout.template.type === "rvs") {
            requestBody.TemplateId = _templateId;
            requestBody.RefId = memoId;
            requestBody.Digit = layout.template.attribute.digit;
            requestBody.Labelrevision = layout.template.label;
            requestBody.Alter = layout.template.alter;
            requestBody.MemoId = null;
            rowIndex = rowIdx;
            colIndex = colIdx;
          }
        });
      });

      if (rowIndex !== -1 && colIndex !== -1) {
        if (
          _control[rowIndex].layout[colIndex].template.attribute.conditions
            .length > 0
        ) {
          const rvsCon = _control[rowIndex].layout[colIndex];
          rvsCon.template.attribute.conditions.map((con: any) => {
            _control.map((item: any, rowIdx: number) => {
              item.layout.map((layout: any, colIdx: number) => {
                if (con.label === layout.template.label) {
                  items.push({
                    Label: con.label,
                    value: layout.data.value,
                  });
                }
              });
            });
          });
        }

        requestBody.Itemlabel = items;

        if (requestBody.Itemlabel.length > 0) {
          let isCheck = true;

          requestBody.Itemlabel.forEach((item: any) => {
            if (!item.value || item.value === "") {
              isCheck = false;
              return;
            }
          });

          if (isCheck) {
            const revision = await GetRvsRunning(requestBody);
            _control[rowIndex].layout[colIndex].data.value = revision.item;
          }
        }
      }
      return _control;
    } catch (error) {
      console.log("rvs=>error", error);
    }
  };

  //process datasourcerelate function
  const onProcessLogicDataSourceRelated = async (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    isInTable: boolean
  ) => {
    let responseDataSourceLoadRelated: any = {
      relateGroup: [],
      data: [],
    };
    const jsonValue: ILogicTypeSourceRelated =
      logic.jsonvalue &&
      logic.jsonvalue.length > 0 &&
      JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));

    if (jsonValue.label === controlTemplate.label && !isInTable) {
      //body to fetch data
      const dataJson = {
        Key: controlTemplate.label,
        Value: controlValue,
        logicid: logic.logicid,
      };
      console.log("logic=>dataJson", dataJson);

      responseDataSourceLoadRelated.data = await onDataSourceLoadRelated(
        dataJson
      );

      //check if has response data
      if (responseDataSourceLoadRelated.data.length > 0) {
        //find control position to put data in
        for (let i = 0; i < jsonValue.relatedvalue?.length; i++) {
          const relateValue = jsonValue?.relatedvalue[i];
          for (let j = 0; j < templateDesc?.items?.length; j++) {
            const item = templateDesc?.items[j];
            for (let k = 0; k < item.layout?.length; k++) {
              const layout = item?.layout[k];
              if (layout.template.label === relateValue.label) {
                responseDataSourceLoadRelated.relateGroup.push({
                  row: j,
                  col: k,
                  relateValue,
                });
              }
            }
          }
        }

        return { responseDataSourceLoadRelated, isInTable };
      }
    } else if (isInTable) {
      console.log("logic2=>controlValue", controlValue, jsonValue);

      if (controlValue.dataIndex === jsonValue.label) {
        const dataJson = {
          Key: controlValue.dataIndex,
          Value: controlValue.values[controlValue.dataIndex],
          logicid: logic.logicid,
        };
        console.log("logic2=>dataJson", dataJson);

        const _dataJson: any[] = [];
        const conditions = jsonValue.conditions;
        const _control = controlTemplate.attribute.column;
        console.log("logic2=>jsonValue,", jsonValue, controlValue);

        conditions.forEach((e) => {
          console.log("logic2=>e", e);

          for (let k = 0; k < _control.length; k++) {
            const item = _control[k];

            if (e.label === item.label) {
              console.log("logic2=>item", item);

              _dataJson.push({
                Key: item.label,
                Value: controlValue[e.label],
                logicid: logic.logicid,
              });
            }
          }
        });
        console.log("logic=>_dataJson", _dataJson);

        responseDataSourceLoadRelated.data = await onDatareladToLoadData(
          _dataJson
        );

        if (responseDataSourceLoadRelated.data.length > 0) {
          for (let i = 0; i < jsonValue.relatedvalue.length; i++) {
            const relateValue = jsonValue.relatedvalue[i];
            for (let j = 0; j < controlTemplate.attribute.column.length; j++) {
              const item = controlTemplate.attribute.column[j];
              for (
                let k = 0;
                k < responseDataSourceLoadRelated.data.length;
                k++
              ) {
                const relate = responseDataSourceLoadRelated.data[k];
                for (const [keyRelate, valueRelate] of Object.entries(relate)) {
                  if (
                    keyRelate === relateValue.value &&
                    relateValue.label === item.label
                  ) {
                    responseDataSourceLoadRelated.relateGroup.push({
                      row: controlValue.key,
                      col: j,
                      valueRelate,
                    });
                  }
                }
              }
            }
          }
          return { responseDataSourceLoadRelated, isInTable };
        }
      }
    }
    return false;
  };

  const onProcessLogicAjax = async (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    isInTable: boolean
  ) => {
    let responseDataSourceLoadRelated: any = {
      relateGroup: [],
      data: [],
      actionFrom: { row: -1, col: -1 },
    };
    const jsonValue: ILogicTypeSourceRelated =
      logic.jsonvalue &&
      logic.jsonvalue.length > 0 &&
      JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));

    //body to fetch data
    const dataJson = {
      Key: controlTemplate.label,
      Value: controlValue,
      logicid: logic.logicid,
    };

    responseDataSourceLoadRelated.data = await onDataSourceLoadRelated(
      dataJson
    );

    //check if has response data
    if (responseDataSourceLoadRelated.data.length > 0) {
      //find control position to put data in
      const relateValue = jsonValue.autoloadvaluelabel.label;

      for (let j = 0; j < templateDesc?.items?.length; j++) {
        const item = templateDesc?.items[j];
        for (let k = 0; k < item.layout?.length; k++) {
          const layout = item?.layout[k];

          if (layout.template.type === "tb") {
            layout.template.attribute.column.forEach(
              (col: any, colIdx: number) => {
                if (col.label === relateValue) {
                  responseDataSourceLoadRelated.relateGroup.push({
                    row: j,
                    col: k,
                    relateValue,
                    tableCol: colIdx,
                  });
                }
              }
            );
          }
        }
      }

      return { responseDataSourceLoadRelated, isInTable };
    }

    return false;
  };

  //process datalineapprove logic
  const onProcessLogicLineApprove = async (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    control: any
  ) => {
    const jsonValue: ILogicTypeDataLineApprove =
      logic.jsonvalue &&
      logic.jsonvalue.length > 0 &&
      JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));

    const conditionsValue = onFilterCondotionsValue(
      jsonValue,
      control,
      controlTemplate,
      controlValue
    );

    if (conditionsValue.length > 0) {
      return JSON.stringify({
        logicid: logic.logicid,
        conditions: conditionsValue,
      });
    }
    return false;
  };
  const onProcessLogicDataRelatedToLoadData = async (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    control: any,
    isInTable: boolean
  ) => {
    const jsonValue: ILogicTypeReladToLoadData =
      logic.jsonvalue &&
      logic.jsonvalue.length > 0 &&
      JSON.parse(logic.jsonvalue.replace(`},\r\n],`, "}],"));
    const { dataJson, loadTo, actionFrom } = onFindDataJson(
      controlTemplate,
      controlValue,
      control,
      jsonValue,
      logic.logicid,
      isInTable
    );

    if (dataJson) {
      if (dataJson.length > 0) {
        console.log(
          "logic=>check",
          isFirstRun.current,
          checkIfLogicsHaveValue(dataJson)
        );

        if (isFirstRun.current || checkIfLogicsHaveValue(dataJson)) {
          const rawData: any = await onDatareladToLoadData(dataJson);

          if (rawData && loadTo) {
            let data = formatKeyLogicData({ data: rawData });

            return { data, loadTo, actionFrom };
          }
        }
      }
    }
    return false;
  };

  const checkIfLogicsHaveValue = (dataJson: any[]) => {
    let _bool = false;
    dataJson.forEach((data) => {
      Object.keys(data).map((key) => {
        if (key.toLowerCase() === "value") {
          _bool = true;
        }
      });
    });

    return _bool;
  };

  const checkIfGetData = (data: any[]) => {
    let _bool = true;
    console.log("logic=>data", data);

    for (let i = 0; i < data.length; i++) {
      if (data[i].item === "") {
        _bool = false;
        return _bool;
      }
    }
    if (data.length === 1 && data[0].item === "-- Please Select --") {
      _bool = false;
      return _bool;
    }
    return _bool;
  };

  const onProcessLogic = async (
    logic: ILogic,
    controlTemplate: ISelectDropdownTemplate | any,
    controlValue: any,
    _control: any,
    isInTable: boolean,
    sumRes?: any
  ): Promise<{
    type: "control" | "lineapprove" | "table" | "table_dd_to_dd" | null;
    value: any;
    controls?: any;
  }> => {
    let responseDataSourceLoadRelated: any = {
      relateGroup: [],
      data: [],
    };
    try {
      let isSetLineApprove = false;
      const controlString = JSON.stringify(_control);
      let newControl = JSON.parse(controlString);
      console.log("logic=>controlValue", controlValue, controlTemplate);

      if (logic) {
        //find logic that control have

        if (logic.logictype === "datasourcerelated") {
          const responseData = await onProcessLogicDataSourceRelated(
            logic,
            controlTemplate,
            controlValue,
            isInTable
          );

          if (responseData) {
            //check if this control in table
            if (controlTemplate.type === "tb" && isInTable) {
              //format value to data in template type = table
              const ee = returnToValure(controlTemplate, controlValue);

              let newColumn: any = {};

              for (
                let i = 0;
                i <
                responseData.responseDataSourceLoadRelated.relateGroup.length;
                i++
              ) {
                //put data to specific row
                const relateGroup =
                  responseData.responseDataSourceLoadRelated.relateGroup[i];
                newControl[controlValue.rowTemplate].layout[
                  controlValue.colTemplate
                ].data.row[relateGroup.row] = ee;

                newControl[controlValue.rowTemplate].layout[
                  controlValue.colTemplate
                ].data.row[relateGroup.row][relateGroup.col].value =
                  relateGroup.valueRelate;

                //format value to row value
                newColumn = formatToColumns(
                  controlTemplate.attribute.column,
                  newControl[controlValue.rowTemplate].layout[
                    controlValue.colTemplate
                  ].data.row[relateGroup.row]
                );
              }

              const responseDataTable = {
                ...newColumn,
                key: controlValue.key,
              };

              return { type: "table", value: responseDataTable };
            } else {
              console.log("logic=>datasourcerelated", responseData);

              for (
                let i = 0;
                i <
                responseData.responseDataSourceLoadRelated.relateGroup.length;
                i++
              ) {
                const relateGroup =
                  responseData.responseDataSourceLoadRelated.relateGroup[i];

                for (
                  let j = 0;
                  j < responseData.responseDataSourceLoadRelated.data.length;
                  j++
                ) {
                  const relateData =
                    responseData.responseDataSourceLoadRelated.data[j];

                  newControl[relateGroup.row].layout[
                    relateGroup.col
                  ].data.value = relateData[relateGroup.relateValue.value];
                }
              }
              return { type: "control", value: newControl };

              // setValue("items", [..._control]);
            }
          }
        } else if (logic.logictype === "reference") {
          const responseData = await onProcessLogicReference(
            logic,
            controlTemplate,
            controlValue,
            newControl
          );

          if (responseData) {
            //map data from api response
            const permittedValues = responseData.data.map(function (
              value: any
            ) {
              let res: any = {};
              for (let i = 0; i < responseData.loadTo.length; i++) {
                const field = responseData.loadTo[i];
                res[field["TBColumn"]] = value[field["MSTColumn"]];
              }
              return res;
            });
            let resRow: any[] = [];

            if (permittedValues) {
              for (let i = 0; i < permittedValues.length; i++) {
                const perValue = permittedValues[i];

                //create empty table data as response api length
                let colData = new Array(
                  templateDesc?.items[responseData.row].layout[
                    responseData.col
                  ].template.attribute.column.length
                ).fill({ value: "" });

                //loop for put data to table
                for (const [key, value] of Object.entries(perValue)) {
                  //loop throught table template column length
                  for (
                    let j = 0;
                    j <
                    templateDesc?.items[responseData.row].layout[
                      responseData.col
                    ].template.attribute.column.length;
                    j++
                  ) {
                    const _tableCol =
                      templateDesc?.items[responseData.row].layout[
                        responseData.col
                      ].template.attribute.column[j];

                    // if column label = key of data response, put data in
                    if (_tableCol.label === key) {
                      colData[j] = { value };
                    }
                  }
                }

                resRow.push(colData);
              }

              newControl[responseData.row].layout[responseData.col].data.row =
                resRow;
              return { type: "control", value: newControl };
            }
          }
        } else if (logic.logictype === "datalineapprove" && !isSetLineApprove) {
          console.log("logic=>logic", logic);
          console.log("logic=>sumRes", sumRes);

          const responseData = await onProcessLogicLineApprove(
            logic,
            controlTemplate,
            controlValue,
            newControl
          );
          console.log("logic=>datalineapprove", responseData);

          if (responseData) {
            isSetLineApprove = true;
            setJsonConditions = responseData;
            getLineApproveForAmount(
              sumRes._amount,
              responseData,
              "datalineapprove",
              controlTemplate
            );
            setIsControlLoading(false);
            // return { type: "lineapprove", value: responseData };
          }
        } else if (logic.logictype === "datareladtoloaddata") {
          const responseData = await onProcessLogicDataRelatedToLoadData(
            logic,
            controlTemplate,
            controlValue,
            newControl,
            isInTable
          );

          if (responseData) {
            if (responseData.data) {
              if (!isInTable) {
                newControl[responseData.loadTo.row].layout[
                  responseData.loadTo.col
                ].template.attribute.items = responseData.data.data;

                return { type: "control", value: newControl };
              } else {
                if (checkIfGetData(responseData.data.data)) {
                  let positionControl: { row: number; col: number } = {
                    row: -1,
                    col: -1,
                  };
                  for (let i = 0; i < newControl.length; i++) {
                    const items = newControl[i];
                    for (let j = 0; j < items.layout.length; j++) {
                      const layout = items.layout[j];
                      if (layout.template.label === controlTemplate.label) {
                        positionControl = { row: i, col: j };
                      }
                    }
                  }
                  //addCheckedToArray
                  const mapDataItem: any[] = [];
                  for (
                    let index = 0;
                    index < responseData.data.data.length;
                    index++
                  ) {
                    const element = responseData.data.data[index];
                    mapDataItem.push({
                      checked: index === 0 ? "Y" : "N",
                      ...element,
                    });
                  }
                  let actionCol = null;
                  let targetCol = null;

                  if (responseData.actionFrom.col !== -1) {
                    let _tableOptions = [...tableOptions];

                    actionCol =
                      controlTemplate.attribute.column[
                        responseData.actionFrom?.col
                      ];
                    targetCol =
                      controlTemplate.attribute.column[responseData.loadTo.col];
                    const options = tableOptions.find(
                      (e) =>
                        e.actionsCol.rowIdx === responseData.actionFrom.row &&
                        e.actionsCol.colIdx === responseData.actionFrom.col
                    );
                    if (options) {
                      _tableOptions.map((e) => {
                        if (
                          e.actionsCol.rowIdx === responseData.actionFrom.row &&
                          e.actionsCol.colIdx === responseData.actionFrom.col
                        ) {
                          e.targetCol.options = responseData.data.data;
                        }
                      });
                    } else {
                      _tableOptions.push({
                        actionsCol: {
                          label: actionCol.label,
                          rowIdx: controlValue.key,
                          colIdx: responseData.actionFrom.col,
                          value: controlValue[actionCol.label],
                        },
                        targetCol: {
                          label: targetCol.label,
                          rowIdx: controlValue.key,
                          colIdx: responseData.loadTo.col,
                          options: responseData.data.data,
                        },
                      });
                    }
                    setTableOptions([..._tableOptions]);
                  }

                  return {
                    type: "table_dd_to_dd",
                    value: mapDataItem,
                    controls: {
                      row: positionControl.row,
                      layout: positionControl.col,
                      columnTb: responseData.loadTo.col,
                    },
                  };
                }
              }
            }
          }
        } else if (logic.logictype === "dataajaxloadtable") {
          console.log("logic=>logic", logic);

          const responseData = await onProcessLogicAjax(
            logic,
            controlTemplate,
            controlValue,
            isInTable
          );
          if (responseData) {
            for (
              let i = 0;
              i < responseData.responseDataSourceLoadRelated.relateGroup.length;
              i++
            ) {
              const processData = formatKeyLogicData(
                responseData.responseDataSourceLoadRelated
              );

              _control[processData.relateGroup[i].row].layout[
                processData.relateGroup[i].col
              ].template.attribute.column[
                processData.relateGroup[i].tableCol
              ].control.template.attribute.items = processData.data;
            }

            reset({
              items: _control,
            });
          }
        }
      }
    } catch (error) {
      console.log(
        "onProcessLogic=>error",
        error,
        "Logic=> " + logic,
        "value=> ",
        controlValue
      );
    }
    return { type: null, value: null };
  };

  const onDataSourceLoadRelated = async (dataJson: any) => {
    const dataSource = await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadDataFormControl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
        // setFormLoading(false);

        // onChangeValueForm(data, relateGroup);
      });
    return dataSource;
  };

  const onFindDataJson = (
    controlTemplate: any,
    controlValue: string,
    _control: any,
    jsonValue: ILogicTypeReladToLoadData,
    logicid: string,
    isInTable: boolean
  ) => {
    const response: {
      dataJson: any[];
      loadTo: { row: number; col: number };
      actionFrom: { row: number; col: number };
    } = {
      dataJson: [],
      loadTo: { row: -1, col: -1 },
      actionFrom: { row: -1, col: -1 },
    };

    if (!isInTable) {
      for (let j = 0; j < jsonValue.labelactions.length; j++) {
        const labelaction = jsonValue.labelactions[j].label;

        if (controlTemplate.label === labelaction) {
          const conditions = jsonValue.conditions;
          conditions.forEach((e) => {
            for (let k = 0; k < _control.length; k++) {
              const item = _control[k];
              for (let l = 0; l < item.layout.length; l++) {
                const _layout = item.layout[l];
                const _label = _layout.label || _layout.template.label;
                if (e.label === _label) {
                  response.dataJson.push({
                    Key: _label,
                    Value: _layout.data.value,
                    logicid: logicid,
                  });
                }
                if (jsonValue.autoloadvaluelabel.label === _label) {
                  response.loadTo = {
                    row: k,
                    col: l,
                  };
                }
              }
            }
          });
        }
      }
    } else {
      const _controlValue = controlValue as any;
      for (let j = 0; j < jsonValue.labelactions.length; j++) {
        const labelaction = jsonValue.labelactions[j];

        for (let k = 0; k < controlTemplate.attribute.column.length; k++) {
          const column = controlTemplate.attribute.column[k];

          if (column.control.template.label === labelaction.label) {
            console.log("logic=>_controlValue", _controlValue);

            // response.dataJson = {
            //   Key: column.control.template?.label,
            //   Value: _controlValue.values[labelaction.label],
            //   logicid: logicid,
            // };
            response.dataJson.push({
              Key: column.control.template?.label,
              Value: _controlValue.values[column.control.template.label],
              logicid: logicid,
            });
            response.actionFrom = { row: _controlValue.key, col: k };

            // }
          }
          if (
            column.control.template.label === jsonValue.autoloadvaluelabel.label
          ) {
            console.log("logic=>column", column);

            response.loadTo = {
              row: _controlValue.key,
              col: k,
            };
          }
        }
      }
    }
    console.log("logic=>response", response);

    return response;
  };
  const onDatareladToLoadData = async (dataJson: any) => {
    const response = await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadDataFormControl2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch(() => false);
    return response;
  };

  const onFilterCondotionsValue = (
    jsonValue: ILogicTypeDataLineApprove,
    _control: any,
    controlTemplate: any,
    controlValue: any
  ) => {
    let conditions: { label: string; value: string; action?: string }[] = [];
    for (let i = 0; i < jsonValue.Conditions.length; i++) {
      const condition = jsonValue.Conditions[i];

      if (condition.label === controlTemplate.label) {
        conditions.push({
          label: condition.label,
          value: controlValue ? controlValue.toLocaleString() : "0",
          action: condition.action,
        });
      } else {
        for (let j = 0; j < _control.length; j++) {
          const item = _control[j];

          for (let k = 0; k < item.layout.length; k++) {
            const layout = item.layout[k];

            if (
              condition.label === layout.template.label &&
              layout.template.label !== controlTemplate.label
            ) {
              conditions.push({
                label: condition.label,
                value: layout.data.value
                  ? layout.data.value.toLocaleString()
                  : "0",
                action: condition.action,
              });
            }
          }
        }
      }
    }
    return conditions;
  };

  return (
    <Spin
      className="loadingggggggggg"
      tip="Loading..."
      spinning={isControlLoading}
    >
      {/* <button onClick={() => console.log({ fields })}>Loggggggggggggggg</button> */}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit(onSubmit)}
        className="form-core-control-container"
      >
        {fields.map((_control: any, idx: number) => {
          let dd: string = "set-padding-core-control";
          return (
            <Row className={dd} key={_control.id}>
              <Controls
                calCulateCorecontrol={calCulateCorecontrol}
                controlRef={controlRef}
                nestIndex={idx}
                onSubmit={handleSubmit(onSubmit)}
                {...{
                  tableOptions,
                  setTableOptions,
                  autoNumFormat,
                  buttonType,
                  canEditDoc,
                  control,
                  register,
                  onControlChange: _onControlChange,
                  controlUpdate: update,
                  isControlLoading,
                  checkActionPage,
                  tableSummaries,
                  updateTableSummaries,
                  memoDetail,
                }}
                documentNo={documentNo}
              />
            </Row>
          );
        })}
      </Form>
    </Spin>
  );
};
