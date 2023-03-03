import React, { useState, useEffect, useMemo } from "react";
import NumberComponent from "../../ControlComponents/NumberComponent/NumberComponent";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./CoreControllerComponent.css";
import { useForm, Controller } from "react-hook-form";
import CheckboxComponent from "../../ControlComponents/CheckboxComponent/CheckboxComponent";
import MainCheckboxComponents from "../../ControlComponents/MainCheckboxComponents/MainCheckboxComponents";
import MainTextComponents from "../../ControlComponents/MainTextComponents/MainTextComponents";
import AttachmentComponent from "../../ControlComponents/AttachmentComponent/AttachmentComponent";
import DropdownComponent from "../../ControlComponents/DropdownComponent/DropdownComponent";
import RadioComponent from "../../ControlComponents/RadioComponent/RadioComponent";
import CalendarComponent from "../../ControlComponents/CalendarComponent/CalendarComponent";
import ShortTextComponent from "../../ControlComponents/InputTextComponent/ShortTextComponent/ShortTextComponent";
import TextareaComponent from "../../ControlComponents/InputTextComponent/TextareaComponent/TextareaComponent";
import ButtonComponent from "../../ControlComponents/ButtonComponent/ButtonComponent";
import AutoNumberComponent from "../../ControlComponents/NumberComponent/AutoNumberComponent/AutoNumberComponent";
import RevisionComponent from "../../ControlComponents/NumberComponent/RevisionComponent/RevisionComponent";
import { EditorComponent } from "../../ControlComponents/EditorComponent/EditorComponent";
// import TableComponent from "../../ControlComponents/TableComponent/TableComponent";
import { SummaryComponent } from "../../ControlComponents/SummaryComponent/SummaryComponent";
import { Item } from "rc-menu";
import { AnyMap } from "@reduxjs/toolkit/node_modules/immer/dist/internal";
import { EmptyComponent } from "../../ControlComponents/EmptyComponent/EmptyComponent";
import {
  GetAutoNumber,
  GetRvsRunning,
  // GetRunningNumber,
} from "../../../Services/RequestControlService";
import { GetAllDynamic } from "../../../Services/DynamicService";
import {
  GetAllApprovals,
  GetApprovalByTemplate,
} from "../../../Services/ApprovalService";
import ImageComponent from "../../ControlComponents/ImageComponent/ImageComponent";
import { IListApprovalDetailsModel } from "../../../IRequestModel/IListApprovalDetailsModel";
import { ProgressSpinner } from "primereact/progressspinner";
interface Props {
  coreRender: boolean;
  setCoreRender: any;
  formTemplate: any;
  setInformationMethodProp: (e: any) => void;
  errorResult: any;
  statusMemoDetail: boolean;
  errorTable: any;
  setSummary: (respone: any) => void;
  templateID: any;
  isInitialLogic: any;
  setIsInitialLogic: any;
  selectedView: any;
  showControl: any;
  setShowControl: any;
  requestDetail: any;
  setRequestDetail: any;
  setLineApporve: any;
  getInformationTemplateProp(): any;
  setOnLoading: any;
  logic: any;
  listLogicData: any;
  setListLogicData: any;
}

export const CoreControllerComponent = (props: Props) => {
  const [advanceForm, setAdvanceForm] = useState<any>({});
  const [tableSummary, setTableSummary] = useState<any[]>([]);
  const [summary, setSummary] = useState<number>(0);
  const [isShowSummary, setIsShowSummary] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<any>(true);
  const [formComponent, setFormComponent] = useState<any>();
  const [autoNumFormat, setAutoNumFormat] = useState<string[]>();
  const [autoNumDigit, setAutoNumDigit] = useState<Number>();
  const [numFormulas, setNumFormulas] = useState<any[]>([]);
  const [allLogic, setAllLogic] = useState<any[]>([]);
  const [valueTable, setValueTable] = useState<any>([]);
  const [runningNumber, setRunningNumber] = useState<string>("");
  const [rvsPosition, setRvsPosition] = useState<any>();
  const [currentLogic, setCurrentLogic] = useState<any>("");
  const userData: any = JSON.parse(window.localStorage.getItem("userData"));

  useEffect(() => {
    if (isShowSummary) {
      sumValue();
    }
  }, [isShowSummary]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    setAdvanceForm(JSON.parse(props.formTemplate));
    // console.log("ddddddddddddddd");
    if (tableSummary.length === 0) {
      setSumTable();
    }
    // props.setShowControl([]);
    // console.log("props.form", JSON.parse(props.formTemplate));
  }, [props.formTemplate]);

  useEffect(() => {
    if (advanceForm !== undefined && Object.keys(advanceForm).length !== 0) {
      // if (props.showControl?.length === 0) {
      //   var arr = Array.from(Array(advanceForm.items.length), () =>
      //     new Array(2).fill(true)
      //   );
      //   // props.setShowControl([...arr]);
      // }
      if (runningNumber === "") {
        getRevision();
      }
      // sumValue();
      renderControl(JSON.parse(props.formTemplate));
      setFormLoading(false);
    }
  }, [advanceForm]);
  useEffect(() => {
    if (valueTable.length > 0) {
      renderControl(JSON.parse(props.formTemplate));
      setFormLoading(false);
    }
  }, [valueTable]);

  useEffect(() => {
    if (
      props.logic.length > 0 &&
      props.isInitialLogic === false &&
      advanceForm?.items?.length > 0
    ) {
      checkLogic();
    }
  }, [props.logic, advanceForm]);

  useEffect(() => {
    console.log("listLogicData", props.listLogicData, isFirstLoad);

    if (props.listLogicData?.length > 0) {
      setIsFirstLoad(false);
    }
    if (
      props.listLogicData?.length > 0 &&
      props.isInitialLogic &&
      !isFirstLoad
    ) {
      console.log("listLogicData", props.listLogicData, isFirstLoad);

      for (let i = 0; i < props.listLogicData.length; i++) {
        const logic = props.listLogicData[i];
        if (logic.name === "datasourcerelated") {
          if (logic.data.relateGroup.length > 0) {
            onDataSourceLoadRelated(
              logic.data.relateGroup,
              logic.data.dataJson
            );
          }
        }
        if (logic.name === "datareladtoloaddata") {
          if (logic.data.length > 0) {
            onChangeAttributeForm(logic.data, logic.row, logic.col);
          }
        }
        if (logic.name === "dataajaxloadtable") {
          onDataAjaxLoadTable(
            logic.row,
            logic.col,
            logic.data.label,
            logic.data.dataJson
          );
        }
        if (logic.name === "reference") {
          onDataRefLoadTable(logic.row, logic.col, logic.data.dataJson);
        }
      }
    }
    if (props.listLogicData?.length > 0 && props.isInitialLogic) {
      for (let i = 0; i < props.listLogicData.length; i++) {
        const logic = props.listLogicData[i];
        if (logic.name === "datalineapprove") {
          onLoadLineApproveWithLogic(logic.data.dataJson);
        }
      }
    }
  }, [props.listLogicData]);
  async function getRevision() {
    let _advanceForm: any = advanceForm;
    const detail = props.requestDetail;

    let requestBody: any = {};
    if (rvsPosition !== undefined) {
      let items: any[] = [];
      let rvsTemp =
        _advanceForm.items[rvsPosition.rowIdx].layout[rvsPosition.colIdx];
      requestBody.TemplateId = detail.memoDetail.template_id;
      requestBody.RefId = 0;
      requestBody.Digit = rvsTemp.template.attribute.digit;
      requestBody.Labelrevision = rvsTemp.template.label;
      requestBody.Alter = rvsTemp.template.alter;

      if (rvsTemp.template.attribute.conditions.length > 0) {
        rvsTemp.template.attribute.conditions.map((con: any) => {
          _advanceForm.items.map((item: any, rowIdx: number) => {
            item.layout.map((layout: any, colIdx: number) => {
              if (con.label === layout.template.label) {
                items.push({ Label: con.label, value: layout.data.value });
              }
            });
          });
        });
      }
      requestBody.MemoId = null;
      requestBody.Itemlabel = items;
      const revision = await GetRvsRunning(requestBody);
      if (revision) {
        setRunningNumber(revision.item);
      }
    }
  }

  // useEffect(() => {
  //   if (
  //     // props.showControl?.length > 0 &&
  //     // !props.showControl?.every((e: any) => e === true) &&
  //     advanceForm !== undefined &&
  //     Object.keys(advanceForm).length !== 0
  //   ) {
  //     renderControl(JSON.parse(props.formTemplate));
  //     setFormLoading(true);
  //   }
  // }, [props.showControl]);

  const onClickLogic = async (
    template: any,
    rowIdx: Number,
    colIdx: Number
  ) => {
    // console.log("template", template);
    let mstTable = "";
    let mstType = "";
    let mColumn = "";
    let columnAll = "";
    let requestLogic: any = [];
    let relateGroup: any = [];
    let conditions: any = [];
    let lineLogic: string = "";
    const _logic: any = props.logic;
    for (let i = 0; i < _logic.length; i++) {
      const logic: any = _logic[i];
      // console.log(logic);

      if (logic.jsonvalue !== null) {
        if (logic.jsonvalue.length > 0) {
          const jsonObject = JSON.parse(_logic[i].jsonvalue);
          if (logic.logictype === "datasourcerelated") {
            for (let j = 0; j < jsonObject.relatedvalue.length; j++) {
              const relateValue = jsonObject.relatedvalue[j];
              // console.log(relateValue, template.template.description);
              for (let k = 0; k < advanceForm.items.length; k++) {
                const _advanceForm = advanceForm.items[k];
                // console.log("_advanceForm", _advanceForm);
                for (let l = 0; l < _advanceForm.layout.length; l++) {
                  const _layout = _advanceForm.layout[l];
                  if (
                    relateValue.label === _layout.template.label &&
                    template.template.description ===
                      _layout.template.attribute.description &&
                    jsonObject.label === template.template.label
                  ) {
                    // console.log(
                    //   "dddddddddddddddddddddddddddd",
                    //   relateValue.label,
                    //   template.template,
                    //   _layout.template
                    // );
                    relateGroup.push({
                      group: relateValue,
                      row: k,
                      col: l,
                    });
                  }
                }
              }
            }
            const dataJson = {
              Key: template.template.label,
              Value: template.data.value,
              logicid: logic.logicid,
            };
            // console.log("ddddddddddd", dataJson, relateGroup);
            requestLogic.push({
              name: logic.logictype,
              data: {
                relateGroup,
                dataJson,
              },
            });
            // onDataSourceLoadRelated(relateGroup, dataJson);
          }
          if (logic.logictype === "datareladtoloaddata") {
            for (let j = 0; j < jsonObject.labelactions.length; j++) {
              const labelaction = jsonObject.labelactions[j];
              // console.log(jsonObject);
              if (labelaction.labelintablestatus !== false) {
                for (let k = 0; k < advanceForm.items.length; k++) {
                  const _advanceForm = advanceForm.items[k];
                  // console.log("_advanceForm", _advanceForm);
                  for (let l = 0; l < _advanceForm.layout.length; l++) {
                    const _layout = _advanceForm.layout[l];
                    if (
                      labelaction.label === template.template.label &&
                      jsonObject.autoloadvaluelabel.label ===
                        _layout.template.label
                    ) {
                      // console.log(
                      //   "labelaction.label",
                      //   labelaction.label,
                      //   template.template.label,
                      //   _layout.template.label
                      // );
                      const dataJson = {
                        Key: template.template.label,
                        Value: template.data.value,
                        logicid: logic.logicid,
                      };
                      const data: any = await onDatareladToLoadData([dataJson]);

                      if (data.length > 0) {
                        requestLogic.push({
                          name: logic.logictype,
                          data: data[0].data,
                          row: k,
                          col: l,
                        });
                        // onChangeAttributeForm(data[0].data, k, l);
                      }
                    }
                  }
                }
              }
            }
          }
          if (logic.logictype === "dataajaxloadtable") {
            for (let j = 0; j < jsonObject.labelactions.length; j++) {
              const labelaction = jsonObject.labelactions[j];
              // console.log(jsonObject);
              if (labelaction.labelintablestatus !== false) {
                for (let k = 0; k < advanceForm.items.length; k++) {
                  const _advanceForm = advanceForm.items[k];
                  // console.log("_advanceForm", _advanceForm);
                  for (let l = 0; l < _advanceForm.layout.length; l++) {
                    const _layout = _advanceForm.layout[l];
                    if (_layout.template.type === "tb") {
                      // console.log("dsssssssssssssdasdddddddd", _layout.template);
                      for (
                        let m = 0;
                        m < _layout.template.attribute.column.length;
                        m++
                      ) {
                        const tbColumn = _layout.template.attribute.column[m];
                        if (
                          tbColumn.label === jsonObject.autoloadvaluelabel.label
                        ) {
                          const dataJson = {
                            Key: labelaction.label,
                            Value:
                              template.data.value !== undefined
                                ? template.data.value.toString()
                                : "",
                            logicid: logic.logicid,
                          };
                          requestLogic.push({
                            name: logic.logictype,
                            data: {
                              label: jsonObject.autoloadvaluelabel.label,
                              dataJson,
                            },
                            row: i,
                            col: j,
                          });
                          // const data = onDataAjaxLoadTable(
                          //   i,
                          //   j,
                          //   jsonObject.autoloadvaluelabel.label,
                          //   dataJson
                          // );
                          setCurrentLogic(logic.logictype);
                          // console.log("ddddddEEEEEEEEEE");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (logic.logictype === "reference") {
            let loadTo = { row: -1, col: -1 };
            let refFilter: any = [];
            let loadToField = jsonObject.Column;
            mstTable = jsonObject.Mastertable || "";
            mstType = jsonObject.Type || "";
            mColumn = jsonObject.MColumn || "";
            columnAll = jsonObject.ColumnAll || "";
            for (let j = 0; j < jsonObject.Filter.length; j++) {
              const controlFilter = jsonObject.Filter[j];
              for (let k = 0; k < advanceForm.items.length; k++) {
                const _advanceForm = advanceForm.items[k];
                // console.log("_advanceForm", _advanceForm);
                for (let l = 0; l < _advanceForm.layout.length; l++) {
                  const _layout = _advanceForm.layout[l];
                  if (_layout.template.label === jsonObject.label) {
                    loadTo = {
                      row: k,
                      col: l,
                    };
                  }
                  if (_layout.template.label === controlFilter.TBColumn) {
                    refFilter.push({
                      mstColumn: controlFilter.MSTColumn,
                      tbColumn: _layout.data.value,
                    });
                  }
                }
              }
            }

            const dataJson = {
              mstTable,
              mstType,
              mColumn,
              columnAll,
              refFilter,
              loadToField,
            };
            setCurrentLogic(logic.logictype);
            requestLogic.push({
              name: logic.logictype,
              data: {
                dataJson,
              },
              row: loadTo.row,
              col: loadTo.col,
            });
            // onDataRefLoadTable(loadTo.row, loadTo.col, dataJson);
          }
          if (logic.logictype === "datalineapprove") {
            // console.log("datalineapprove");
            for (let k = 0; k < advanceForm.items.length; k++) {
              const _advanceForm = advanceForm.items[k];
              for (let l = 0; l < _advanceForm.layout.length; l++) {
                const _layout = _advanceForm.layout[l];
                if (jsonObject.label === _layout.template.label) {
                  // console.log(
                  //   "_layout.data.value",
                  //   _layout.data.value,
                  //   _layout.template.label
                  // );

                  conditions.push({
                    label: _layout.template.label,
                    value:
                      _layout.data.value === null
                        ? ""
                        : _layout.template.type === "c"
                        ? Number(_layout.data.value).toLocaleString()
                        : _layout.data.value,
                  });
                  lineLogic = logic.logicid;
                }
              }
            }
            if (conditions.length > 0) {
              const dataJson = {
                logicid: lineLogic,
                conditions: conditions,
              };
              requestLogic.push({
                name: logic.logictype,
                data: {
                  dataJson,
                },
              });
              // onLoadLineApproveWithLogic(dataJson);
              conditions = [];
              lineLogic = "";
              // console.log("dataJsondataJson", dataJson);
            }
          }
        }
      }
    }
    // props.setListLogicData((prevState: any) => {
    //   if (JSON.stringify(prevState) !== JSON.stringify(requestLogic)) {
    //     return requestLogic;
    //   }
    // });
    if (JSON.stringify(props.listLogicData) !== JSON.stringify(requestLogic)) {
      console.log("sssssssssssssssssssssssssssssssssssssss");

      props.setListLogicData([...requestLogic]);
    }
    console.log("requestLogic", requestLogic, props.listLogicData);
  };
  const checkLogic = async () => {
    const _logic = props.logic;
    props.setIsInitialLogic(true);
    // console.log("checklogic");
    console.log("_logic_logic", props.setIsInitialLogic);

    // const userData = JSON.parse(window.localStorage.getItem("userData"));
    const empId = userData.employeeData.EmployeeId;
    // let _showControl: any = props.showControl;
    let dataSourceLoadGroup: any[] = [];
    let dataSourceRelatedToLoadGroup: any[] = [];
    let mstTable = "";
    let mstType = "";
    let mColumn = "";
    let columnAll = "";
    let lineSeq = 0;
    let currentApproverLevel =
      props.requestDetail.memoDetail.current_approval_level;
    // let position = [];
    // let labelAction = [];
    for (let z = 0; z < _logic.length; z++) {
      const element = _logic[z];
      if (element.jsonvalue !== null && element.jsonvalue !== "[]") {
        if (element.jsonvalue.length > 0) {
          const jsonObject = JSON.parse(_logic[z].jsonvalue);
          // console.log("Logic=>jsonObject", jsonObject);

          let positionTable = { row: -1, col: -1 };

          if (element.logictype === "datasourceload") {
            for (let i = 0; i < advanceForm.items.length; i++) {
              const _advanceForm = advanceForm.items[i];
              // console.log("_advanceForm", _advanceForm);
              for (let j = 0; j < _advanceForm.layout.length; j++) {
                const _layout = _advanceForm.layout[j];
                if (_layout.template.label === jsonObject.label) {
                  // console.log("_layout.template.label", _layout.template.label);
                  // const _data = await onDataSourceLoad(i, j, element.logicid);
                  dataSourceLoadGroup.push({
                    col: j,
                    row: i,
                    data: element.logicid,
                  });
                }
              }
            }
          }
          if (element.logictype === "role") {
            const roles = await GetAllDynamic("Roles/GetAll", undefined);

            // const _data = await onDataSourceLoad(i, j, element.logicid);
            if (jsonObject.action === "show") {
              for (let m = 0; m < jsonObject.fieldaction.length; m++) {
                const fieldaction = jsonObject.fieldaction[m];
                for (let k = 0; k < advanceForm.items.length; k++) {
                  const _advanceForm = advanceForm.items[k];
                  // console.log("_advanceForm", _advanceForm);
                  for (let l = 0; l < _advanceForm.layout.length; l++) {
                    const _layout = _advanceForm.layout[l];

                    if (fieldaction.lable === _layout.template.label) {
                      // console.log(
                      //   "_layout_layout_layout_layout.label",
                      //   _layout
                      // );
                      // console.log(
                      //   "fieldaction.label",
                      //   fieldaction.lable,
                      //   "_layout.template.label",
                      //   _layout.template.label
                      // );
                      for (let n = 0; n < jsonObject.roleids.length; n++) {
                        const roleid = jsonObject.roleids[n].id;
                        for (let m = 0; m < roles.length; m++) {
                          const role = roles[m];
                          if (roleid != role.RoleId) {
                            // console.log(
                            //   "_showControl",
                            //   _showControl,
                            //   ":",
                            //   k,
                            //   ":",
                            //   l
                            // );
                            // _showControl[k][l] = false;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (element.logictype === "approvetype") {
            // for (let i = 0; i < props.requestDetail.listApprovalDetails.length; i++) {
            //   const approver = props.requestDetail.listApprovalDetails[i];
            //   if (approver.emp_id === empId ) {
            //     lineSeq = approver.sequence
            //   }
            // }
            // const _data = await onDataSourceLoad(i, j, element.logicid);
            // const approvals = await GetAllApprovals({
            //   memoid: props.requestDetail.memoDetail.memoid,
            // });
            const approvals = await fetch("api/LineApprove/GetByMemoId", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                memoid: props.requestDetail.memoDetail.memoid,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                return data;
              });

            if (jsonObject.action === "show") {
              for (let m = 0; m < jsonObject.fieldaction.length; m++) {
                const fieldaction = jsonObject.fieldaction[m];
                for (let k = 0; k < advanceForm.items.length; k++) {
                  const _advanceForm = advanceForm.items[k];
                  // console.log("_advanceForm", _advanceForm);
                  for (let l = 0; l < _advanceForm.layout.length; l++) {
                    const _layout = _advanceForm.layout[l];

                    if (fieldaction.lable === _layout.template.label) {
                      for (
                        let n = 0;
                        n < jsonObject.approvetypeids.length;
                        n++
                      ) {
                        const typeid = jsonObject.approvetypeids[n].typeid;

                        for (let m = 0; m < approvals.length; m++) {
                          const approver = approvals[m];

                          // if (
                          //   props.requestDetail.memoDetail
                          //     .current_approval_level == approver.sequence
                          // ) {
                          //   console.log("dddddddddddddddddddddd");

                          //   _showControl[k][l] = false;
                          // }
                          if (
                            props.requestDetail.memoDetail
                              .current_approval_level != approver.sequence ||
                            approver.emp_id != empId ||
                            typeid != approver.ApproveType
                          ) {
                            // _showControl[k][l] = false;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    let logicGroupData: any[] = [];
    // console.log("dataSourceRelatedToLoadGroup", dataSourceRelatedToLoadGroup);
    if (dataSourceLoadGroup.length > 0) {
      const response = await onDataSourceLoad(dataSourceLoadGroup);
      logicGroupData.push({ type: "onDataSourceLoad", data: response });
      // console.log("responseGroup", response);
    }
    if (dataSourceRelatedToLoadGroup.length > 0) {
      const response = await onDatareladToLoadData(
        dataSourceRelatedToLoadGroup
      );
      logicGroupData.push({ type: "onDatareladToLoadData", data: response });
      // console.log("onDatareladToLoadData", response);
    }
    onChangeLogicForm(logicGroupData);
    // props.setShowControl([..._showControl]);
    setFormLoading(false);
  };
  const onChangeLogicForm = (logicGroupData: any) => {
    let _advanceForm = advanceForm;
    props.setIsInitialLogic(true);
    for (let i = 0; i < logicGroupData.length; i++) {
      const logicGroup = logicGroupData[i];
      if (logicGroup.type === "onDataSourceLoad") {
        for (let j = 0; j < logicGroup.data.length; j++) {
          let logicData = logicGroup.data[j];
          logicData.data.push({ item: "-- Please Select --" });
          for (let k = 0; k < logicData.data.length; k++) {
            const data = logicData.data[k];
            const keyValues = Object.keys(data).map((key) => {
              const newKey = "item";
              return { [newKey]: data[key] };
            });
            logicData.data[k] = keyValues[0];
          }
          _advanceForm.items[logicData.row].layout[
            logicData.col
          ].template.attribute.items = logicData.data;
          if (
            _advanceForm.items[logicData.row].layout[logicData.col].data
              .value !== "-- Please Select --"
          ) {
            _advanceForm.items[logicData.row].layout[logicData.col].data.value =
              "-- Please Select --";
          }

          // console.log("datasource", logicData);
        }
      }
    }
    // console.log("JSON.stringify(_advanceForm)", JSON.stringify(_advanceForm));

    props.setInformationMethodProp(JSON.stringify(_advanceForm));
  };

  function setSumTable() {
    const items = JSON.parse(props.formTemplate).items;
    let tableArray: any[] = [];

    items.map((item: any, rowIdx: number) => {
      item.layout.map((layout: any, colIdx: number) => {
        if (layout.template.type === "tb") {
          console.log("table=>layout.template", layout.template);
          if (layout.template.attribute.column) {
            for (let i = 0; i < layout.template.attribute.column.length; i++) {
              const column = layout.template.attribute.column[i];
              if (column.control.template.type === "c") {
                if (column.control.template.attribute.summary === "Y") {
                  tableArray.push({
                    tableLabel: layout.template.label,
                    total: 0,
                  });

                  setTableSummary([...tableArray]);
                }
              }
            }
          }
        }
      });
    });
  }
  const onLoadLogic = async (templateID: any) => {
    const dataLogic = await fetch("api/TemplateList/TemplateByid/LoadLogic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ TemplateId: templateID }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Logic=> ", data);

        setAllLogic([...data]);
        return data;
      });
    return dataLogic;
  };

  const onDataRefLoadTable = async (row: any, col: any, dataJson: any) => {
    setFormLoading(true);
    // console.log("dataJsondataJson", dataJson);

    let query = `SELECT * FROM ${dataJson.mstTable} WHERE `;

    for (let i = 0; i < dataJson.refFilter.length; i++) {
      const refFilter = dataJson.refFilter[i];
      if (i === 0 && dataJson.refFilter.length > 1) {
        query = query + `${refFilter.mstColumn}='${refFilter.tbColumn}' AND `;
      }
      if (i % 2 === 0) {
        query = query + `${refFilter.mstColumn}='${refFilter.tbColumn}'`;
      }
      if (i % 2 !== 0 && i !== 0) {
        query = query + ` AND ${refFilter.mstColumn}='${refFilter.tbColumn}'`;
      }
    }
    if (dataJson.mstTable === "MSTMasterData" && dataJson.mstType.length > 0) {
      query = query + ` AND MasterType='${dataJson.mstType}'`;
    }
    if (dataJson.mColumn.length > 0) {
      query = query + ` AND ${dataJson.mColumn}='${dataJson.mstType}'`;
    }
    if (dataJson.columnAll.length > 0) {
      query = query + ` AND ${dataJson.columnAll}='All'`;
    }
    // console.log("queryquery", query);

    const dataSource = await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadDataFormControlRef",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((response) => response.json())
      .then((data: any) => {
        console.log("dddddddddddddddddddsadddddata", data);
        setFormLoading(false);

        onChangeRefValueTableForm(data.DT, dataJson.loadToField, row, col);
      });
  };
  const onDataAjaxLoadTable = async (
    row: any,
    col: any,
    autoloadvaluelabel: any,
    dataJson: any
  ) => {
    // console.log(
    //   "row, col, dataJson",
    //   row,
    //   col,
    //   JSON.stringify(dataJson),
    //   autoloadvaluelabel
    // );

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
      .then(
        (data) => {
          console.log("listLogicData", data);

          onChangeAttributeTableForm(data, row, col, autoloadvaluelabel);
        }
        // console.log("load", data)
      );
  };
  const onLoadLineApproveWithLogic = async (dataJson: any) => {
    // console.log("row, col, dataJson", dataGroup);
    // const userData = JSON.parse(window.localStorage.getItem("userData"));
    const empData = userData.employeeData;
    let _dataJson = dataJson;
    if (_dataJson.length > 0) {
      for (let i = 0; i < _dataJson.length; i++) {
        const data = _dataJson[i];
      }
    }
    const requestData = {
      employee: empData,
      ComCode: props.requestDetail.memoDetail.company_id,
      JsonCondition: JSON.stringify(dataJson),
      templateForm: {
        ...props.requestDetail.memoDetail,
        TemplateApproveId: 0,
      },
      lstTRNLineApprove: [],
    };

    // console.log("requestData", requestData);

    await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadLineApproveFormControl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    )
      .then((response) => response.json())
      .then(
        (data) => {
          // onChangeAttributeForm(data, row, col)
          let lineApproval = props.requestDetail.listApprovalDetails;
          let _data = data;
          let newData: any = [];
          let sequence = 0;
          let isHas = false;
          for (let i = 0; i < _data.length; i++) {
            const lineNew = _data[i];
            for (let j = 0; j < lineApproval.length; j++) {
              const line = lineApproval[j];
              if (line.emp_id === lineNew.emp_id) {
                newData.push(line);
                isHas = true;
              }
            }
            if (isHas) {
              isHas = false;
            } else {
              newData.push(lineNew);
            }
          }

          console.log("_dataLine", newData, data);

          props.setRequestDetail((prevState: any) => ({
            ...prevState,
            listApprovalDetails: [...data],
          }));
        }
        // console.log("load", data)
      );

    // return responseGroup;
  };
  const onDatareladToLoadData = async (dataGroup: any) => {
    // console.log("row, col, dataJson", dataGroup);
    let responseGroup: any[] = [];
    setFormLoading(true);

    for (let i = 0; i < dataGroup.length; i++) {
      const dataSource: any = dataGroup[i];

      const dataJson = {
        logicid: dataSource.logicid,
        Key: dataSource.Key,
        Value: dataSource.Value,
      };
      await fetch(
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
        .then(
          (data) => {
            // console.log("dddddddddddddd", data);
            setFormLoading(false);
            responseGroup.push({
              data: data,
              row: dataSource.row,
              col: dataSource.col,
            });
            // onChangeAttributeForm(data, row, col)
          }
          // console.log("load", data)
        );
    }
    return responseGroup;
  };
  const onDataSourceLoadRelated = async (relateGroup: any, dataJson: any) => {
    // console.log("relateGroup, dataJson", relateGroup, dataJson);
    // const dataJson = {
    //   logicid,
    //   Key: "",
    //   Value: "",
    // };
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
        setFormLoading(false);

        onChangeValueForm(data, relateGroup);
      });
  };
  const onDataSourceLoad = async (dataGroup: any) => {
    // console.log(row, col, logicid);
    let responseGroup: any[] = [];
    console.log("table=>dataGroup", dataGroup);

    for (let i = 0; i < dataGroup.length; i++) {
      const dataSource: any = dataGroup[i];

      const dataJson = {
        logicid: dataSource.data,
        Key: "",
        Value: "",
      };
      await fetch(
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
        .then(
          (data) => {
            responseGroup.push({
              data: data,
              row: dataSource.row,
              col: dataSource.col,
            });
            // onChangeAttributeForm(data, row, col)
          }
          // console.log("load", data)
        );
    }
    return responseGroup;
  };
  const onTableDatareladToLoadData = async (
    row: any,
    advanceRow: any,
    advanceCol: any,
    tableRow: any,
    tableCol: any,
    tableActionCol: any,
    dataJson: any
  ) => {
    // console.log("row, col, dataJson tabel", dataJson, loadToCol);
    let tableValue: any = row;
    // console.log("dataJson", dataJson);

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
      .then((data) => data);

    onChangeValueTableForm(
      row,
      dataSource,
      advanceRow,
      advanceCol,
      tableRow,
      tableCol,
      tableActionCol
    );

    // console.log("dsasdasdweweqweqweqewqwe");

    // console.log(
    //   "tableValuetableValuetableValue",
    //   tableValue,
    //   advanceRow,
    //   advanceCol
    // );
  };
  const onChangeValueTableForm = (
    row: any,
    dataRequest: any,

    advanceRow: any,
    advanceCol: any,
    tableRow: any,
    tableCol: any,
    tableActionCol: any
  ) => {
    let _advanceForm = advanceForm;
    let _dataRequest = dataRequest;
    let _valueTable = valueTable;
    let rowTable: any = row;
    for (let i = 0; i < _dataRequest.length; i++) {
      const _colData = _dataRequest[i];
      const keyValues = Object.keys(_colData).map((key) => {
        const newKey = "item";
        return { [newKey]: _colData[key] };
      });
      _dataRequest[i] = keyValues[0];
    }
    rowTable[tableRow][tableActionCol] = _dataRequest;
    // console.log("eieieieieiei", _dataRequest, rowTable, tableActionCol);
    setValueTable([...rowTable]);

    // _valueTable.push(_dataRequest[i]);
  };

  // console.log("onChangeValueTableForm", _valueTable);

  const onChangeAttributeTableForm = (
    dataRequest: any,
    rowIdx: number,
    colIdx: number,
    autoloadvaluelabel: any
  ) => {
    let _advanceForm = advanceForm;
    let _dataRequest = dataRequest;
    // _dataRequest.splice(0, 0, { item: "--select--" });
    for (let i = 0; i < _dataRequest.length; i++) {
      const data = _dataRequest[i];
      const keyValues = Object.keys(data).map((key) => {
        const newKey = "item";
        return { [newKey]: data[key] };
      });
      _dataRequest[i] = keyValues[0];
    }
    // console.log(W
    //   "datatatatatat",
    //   _dataRequest,
    //   autoloadvaluelabel,
    //   colIdx,
    //   rowIdx
    // );
    try {
      for (
        let i = 0;
        i <
        _advanceForm.items[rowIdx].layout[colIdx].template.attribute.column
          .length;
        i++
      ) {
        const col =
          _advanceForm.items[rowIdx].layout[colIdx].template.attribute.column[
            i
          ];
        if (col.label === autoloadvaluelabel) {
          _advanceForm.items[rowIdx].layout[colIdx].template.attribute.column[
            i
          ].control.template.attribute.items = _dataRequest;
        }
      }
    } catch (error) {}

    // if (_dataRequest.length > 0) {
    //   _advanceForm.items[rowIdx].layout[colIdx].data = _dataRequest[0];

    props.setInformationMethodProp(JSON.stringify(_advanceForm));
    // }
  };
  const onChangeValueForm = (dataRequest: any, relateGroup: any) => {
    let _advanceForm = advanceForm;
    let _dataRequest = dataRequest;
    let res: any = [];
    for (let i = 0; i < _dataRequest.length; i++) {
      const data = _dataRequest[i];
      for (const [key, value] of Object.entries(data)) {
        for (let j = 0; j < relateGroup.length; j++) {
          const relate = relateGroup[j];
          if (relate.group.value === key) {
            _advanceForm.items[relate.row].layout[relate.col].data = {
              value: value,
            };
            // res.push({
            //   label: relate.group.label,
            //   value: value,
            // });
          }
        }
      }
    }

    // for (let i = 0; i < _dataRequest.length; i++) {
    //   const data = _dataRequest[i];
    // const keyValues = Object.keys(data).map((key) => {
    //   const newKey = "value";
    //   return { [newKey]: data[key] };
    // });
    // _dataRequest[i] = keyValues[0];
    // }

    // if (_dataRequest.length > 0) {
    //   _advanceForm.items[rowIdx].layout[colIdx].data = _dataRequest[0];

    props.setInformationMethodProp(JSON.stringify(_advanceForm));
    // }
  };
  const onChangeAttributeForm = (
    dataRequest: any,
    rowIdx: number,
    colIdx: number
  ) => {
    let _advanceForm = advanceForm;
    let _dataRequest = dataRequest;
    // _dataRequest.splice(0, 0, { item: "--select--" });

    for (let i = 0; i < _dataRequest.length; i++) {
      const data = _dataRequest[i];

      let keyValues = Object.keys(data).map((key) => {
        const newKey = "item";
        return { [newKey]: data[key] };
      });
      _dataRequest[i] = keyValues[0];
    }
    if (_dataRequest !== null) {
      let items = _dataRequest;
      const s = items.find((e: any) => e.item === "-- Please Select -- ");
      if (s === undefined) {
        items.push({ item: "-- Please Select -- " });
      }
      _advanceForm.items[rowIdx].layout[colIdx].data.value =
        "-- Please Select -- ";
      _dataRequest = items;
    }
    _advanceForm.items[rowIdx].layout[colIdx].template.attribute.items =
      _dataRequest;
    setFormLoading(false);

    props.setInformationMethodProp(JSON.stringify(_advanceForm));
  };
  const onChangeRefValueTableForm = (
    dataRequest: any,
    loadToField: any,
    advanceRow: any,
    advanceCol: any
  ) => {
    let _advanceForm = advanceForm;
    let _dataRequest: any = dataRequest;
    let _valueTable = valueTable;
    console.log("permittedValues", _dataRequest, _advanceForm, advanceRow);

    const permittedValues = _dataRequest.map(function (value: any) {
      let res: any = {};
      for (let i = 0; i < loadToField.length; i++) {
        const field = loadToField[i];
        res[field["TBColumn"]] = value[field["MSTColumn"]];
        //  ={ [field["TBColumn"]]: value[field["MSTColumn"]] }
      }
      return res;
    });

    let resRow: any = [];
    if (_advanceForm.items) {
      for (let i = 0; i < permittedValues.length; i++) {
        const perValue = permittedValues[i];
        let colData = new Array(
          _advanceForm?.items[advanceRow].layout[
            advanceCol
          ].template.attribute.column.length
        ).fill({ value: "" });
        for (const [key, value] of Object.entries(perValue)) {
          // const dataRef = permittedValues[i];
          for (
            let j = 0;
            j <
            _advanceForm?.items[advanceRow].layout[advanceCol].template
              .attribute.column.length;
            j++
          ) {
            const _tableCol =
              _advanceForm?.items[advanceRow].layout[advanceCol].template
                .attribute.column[j];

            if (_tableCol.label === key) {
              colData[j] = { value };
            }
          }
        }
        resRow.push(colData);
      }
    }
    if (_dataRequest.length > 0 && resRow.length > 0 && _advanceForm.items) {
      _advanceForm.items[advanceRow].layout[advanceCol].data.row = resRow;

      props.setInformationMethodProp(JSON.stringify(_advanceForm));
    }
    // console.log("onChangeValueTableForm", _valueTable);
  };

  const onChangeEditForm = (
    dataRequest: any,
    rowIdx: number,
    colIdx: number
  ) => {
    let _advanceForm = advanceForm;
    let _dataRequest = dataRequest;
    if (_advanceForm) {
      _advanceForm.items[rowIdx].layout[colIdx].data = _dataRequest;

      if (_advanceForm.items[rowIdx].layout[colIdx].template.type !== "an") {
        if (!props.statusMemoDetail) {
          genAutoNum(_advanceForm.items);
        }
      }
      if (
        (_advanceForm.items[rowIdx].layout[colIdx].template.type === "dd" ||
          _advanceForm.items[rowIdx].layout[colIdx].template.type === "c" ||
          _advanceForm.items[rowIdx].layout[colIdx].template.type === "cb" ||
          _advanceForm.items[rowIdx].layout[colIdx].template.type === "r") &&
        props.isInitialLogic
      ) {
        onClickLogic(_advanceForm.items[rowIdx].layout[colIdx], rowIdx, colIdx);

        // onCheckLogic( _advanceForm.items[rowIdx].layout[colIdx].data)

        // checkLogic();
      }
      if (
        _advanceForm.items[rowIdx].layout[colIdx].template.type === "c" ||
        _advanceForm.items[rowIdx].layout[colIdx].template.type === "tb"
      ) {
        sumValue();
      }
      // if (_advanceForm.items[rowIdx].layout[colIdx].template.type === "c") {
      //   if (
      //     _advanceForm.items[rowIdx].layout[colIdx].template.attribute
      //       .formula === ""
      //   ) {
      //     calNumberWithFormula(
      //       _advanceForm.items[rowIdx].layout[colIdx],
      //       rowIdx,
      //       colIdx
      //     );
      //   }
      // }
      props.setInformationMethodProp(JSON.stringify(_advanceForm));
    }
    // setAdvanceForm(_advanceForm);
  };
  const onChangeEditFormTable = (
    columns: any,
    row: any,
    dataRequest: any,
    rowIdx: any,
    colIdx: any,
    tableRowIdx: any,
    tableColIdx: any
  ) => {
    let _advanceForm = advanceForm;
    let _dataRequest = dataRequest;
    let table = _advanceForm.items[tableRowIdx].layout[tableColIdx];

    const _logic: any = props.logic;

    for (let i = 0; i < _logic.length; i++) {
      const logic: any = _logic[i];

      if (logic.jsonvalue !== null) {
        if (logic.jsonvalue.length > 0) {
          const jsonObject = JSON.parse(_logic[i].jsonvalue);

          if (logic.logictype === "datareladtoloaddata") {
            let eiei: any = [];
            let labelAction: any = [];
            if (table.data.row !== null) {
              if (table.data.row.length > 0) {
                let dataJson: any = {};
                let tableActionCol = 0;

                for (let k = 0; k < jsonObject.labelactions.length; k++) {
                  const labelaction = jsonObject.labelactions[k];

                  if (labelaction.label === columns[colIdx].field) {
                    dataJson = {
                      Key: labelaction.label,
                      Value: dataRequest.value,
                      logicid: logic.logicid,
                    };
                  }
                }
                for (let k = 0; k < columns.length; k++) {
                  const _column = columns[k];

                  if (jsonObject.autoloadvaluelabel.label === _column.field) {
                    tableActionCol = k;
                  }
                }
                const data = onTableDatareladToLoadData(
                  row,
                  tableRowIdx,
                  tableColIdx,
                  rowIdx,
                  colIdx,
                  tableActionCol,
                  dataJson
                );
              }
            }
          }
        }
      }
    }
  };

  // useMemo(() => {
  //   sumValue();
  // }, [tableSummary]);

  function onTableFooterChange(
    footerVal: any,
    footerRow: any,
    rowIdx: number,
    colIdx: number
  ) {
    let _advanceForm = advanceForm;

    _advanceForm.items[rowIdx].layout[
      colIdx
    ].template.attribute.footerTable.rows[footerRow].value = footerVal;
    props.setInformationMethodProp(JSON.stringify(_advanceForm));
  }

  async function genAutoNum(control: any[]) {
    if (autoNumFormat === undefined) {
      let formats: any[] = [];
      let digit: number = 0;
      control.forEach((item: any) => {
        item.layout.forEach((layout: any) => {
          if (layout.template.type === "an") {
            formats = layout.template.attribute.formats;
            digit = layout.template.digit;
          }
        });
      });
      setAutoNumDigit(digit);
      setAutoNumFormat(formats);
    } else {
      let str: string[] = [];
      let isCheck: boolean = false;
      control.forEach((item: any, rowIdx: number) => {
        item.layout.forEach(async (layout: any, colIdx: number) => {
          if (
            autoNumFormat.find((format: any) => {
              if (
                format.format.find((fm: any) => {
                  if (fm.type !== "pf") {
                    if (fm.label === layout.template.label) {
                      return true;
                    }
                  }
                })
              ) {
                return true;
              }
            })
          ) {
            let choiceFormat: any = null;
            let requestBody: any = {};
            autoNumFormat.map((format: any) => {
              format.condition.map((con: any) => {
                if (
                  con.label === layout.template.label &&
                  con.value === layout.data.value
                ) {
                  choiceFormat = format;
                }
              });
            });
            if (choiceFormat !== null) {
              choiceFormat.format.map((format: any) => {
                if (format.type === "pf") {
                  if (!str.includes(format.label)) {
                    str.push(format.label);
                  }
                } else if (layout.template.label === format.label) {
                  let value: string = layout.data.value;
                  if (value !== null) {
                    if (value.indexOf("(") > 0 && value.indexOf(")")) {
                      str.push(
                        value.substring(
                          value.indexOf("(") + 1,
                          value.indexOf(")")
                        )
                      );
                    } else {
                      str.push(value);
                    }
                  }
                  if (str.length === format.length) {
                    isCheck = true;
                  }
                }
              });
            } else {
              autoNumFormat.map((ft: any) => {
                if (ft.condition.length === 0) {
                  ft.format.map((format: any) => {
                    if (format.type === "pf") {
                      if (!str.includes(format.label)) {
                        str.push(format.label);
                      }
                    } else if (layout.template.label === format.label) {
                      let value: string = layout.data.value;
                      if (value !== null) {
                        if (value.indexOf("(") > 0 && value.indexOf(")")) {
                          str.push(
                            value.substring(
                              value.indexOf("(") + 1,
                              value.indexOf(")")
                            )
                          );
                        } else {
                          str.push(value);
                        }
                      }
                    }
                    if (str.length === ft.format.length) {
                      if (
                        !str.includes("--Select--") &&
                        !str.includes("--select--")
                      ) {
                        isCheck = true;
                      }
                    }
                  });
                }
              });
            }
            if (isCheck) {
              requestBody.Prefix = str.join("-") + "-";
              requestBody.Digit = autoNumDigit;
              requestBody.TemplateId = props.templateID;
              if (!requestBody.Prefix.toLowerCase().includes("select")) {
                const dd = await GetAutoNumber(requestBody);
                if (dd.Message !== undefined) {
                } else {
                  control.forEach((item: any, rowIdx: number) => {
                    item.layout.forEach((layout: any, colIdx: number) => {
                      if (layout.template.type === "an") {
                        if (layout.data.value !== dd) {
                          onChangeEditForm({ value: dd }, rowIdx, colIdx);
                        }
                      }
                    });
                  });
                }
              }
            } else {
              control.forEach((item: any, rowIdx: number) => {
                item.layout.forEach((layout: any, colIdx: number) => {
                  if (layout.template.type === "an") {
                    if (layout.data.value !== null) {
                      onChangeEditForm({ value: null }, rowIdx, colIdx);
                    }
                  }
                });
              });
            }
          }
        });
      });
    }
  }

  useEffect(() => {
    if (rvsPosition !== undefined) {
      onChangeEditForm(
        { value: runningNumber },
        rvsPosition.rowIdx,
        rvsPosition.colIdx
      );
    }
  }, [runningNumber]);

  function sumValue() {
    if (advanceForm !== undefined && Object.keys(advanceForm).length !== 0) {
      let items = advanceForm.items;
      let sum = 0;
      let digit = 2;
      items.map((item: any, rowIdx: number) => {
        item.layout.map((layout: any, colIdx: number) => {
          if (layout.template.type === "c") {
            if (layout.template.attribute.summary === "Y") {
              digit = Number(layout.template.attribute.decimal);
              if (Number(layout.data.value) !== 0) {
                sum = sum + Number(layout.data.value);
              }
            }
          }
        });
      });
      tableSummary.map((table: any) => {
        if (table.total !== 0) {
          sum = sum + table.total;
        }
      });

      if (sum !== summary) {
        setSummary(sum);
        props.setSummary(sum.toFixed(digit));
      }
    }
  }

  function updateTableSum(tableName: string, tableSum: number) {
    if (tableSummary.length > 0) {
      const ss = JSON.stringify(tableSummary);
      let sumTable = JSON.parse(ss);

      if (tableSum !== 0) {
        sumTable.map((table: any) => {
          if (table.tableLabel === tableName) {
            table.total = tableSum;
          }
        });
        if (
          advanceForm !== undefined &&
          Object.keys(advanceForm).length !== 0
        ) {
          let items = advanceForm.items;
          let sum = 0;
          let digit = 2;
          items.map((item: any, rowIdx: number) => {
            item.layout.map((layout: any, colIdx: number) => {
              if (layout.template.type === "c") {
                if (layout.template.attribute.summary === "Y") {
                  digit = Number(layout.template.attribute.decimal);
                  if (Number(layout.data.value) !== 0) {
                    sum = sum + Number(layout.data.value);
                  }
                }
              }
            });
          });
          sumTable.map((table: any) => {
            if (!isNaN(table.total)) {
              sum = sum + table.total;
            }
          });

          if (!isNaN(sum)) {
            setSummary(sum);
            props.setSummary(sum.toFixed(digit));
          }
        }
        setTableSummary([...sumTable]);
      } else {
        setSummary(0);
        props.setSummary(`0.00`);
      }
    }
  }

  function calNumberWithFormula(temp: any, rowIdx: number, colIdx: number) {
    try {
      let items = advanceForm.items;
      let formu: string = temp.template.attribute.formula;

      let total = 0;
      if (formu !== "" && formu !== null) {
        items.map((item: any, rowIdx: number) => {
          item.layout.map((layout: any, colIdx: number) => {
            if (formu.includes("sum")) {
              const match =
                formu
                  .substring(formu.indexOf("("), formu.indexOf(")"))
                  .match(/[a-zA-Z-'`ก-๏0-9]+[ a-zA-Z-'`ก-๏0-9]/g) || [];

              if (match.includes(layout.template.label)) {
                const selCol = match[1];
                layout.template.attribute.column.map(
                  (col: any, colIdx: number) => {
                    if (selCol === col.label) {
                      layout.data?.row?.map((row: any, rowIdx: number) => {
                        total += Number(row[colIdx].value);
                      });
                    }
                  }
                );
              }
            } else {
              const match =
                formu.match(/[a-zA-Z' `ก-๏0-9]+[ a-zA-Z '`ก-๏0-9]/g) || [];

              if (match.includes(layout.template.label)) {
                if (layout.data.value !== null) {
                  formu = formu.replace(
                    layout.template.label,
                    layout.data.value.toString()
                  );
                } else {
                  formu = formu.replace(layout.template.label, "0");
                }
              }

              var regExp = /[a-zA-Zก-๏]/g;
              if (!regExp.test(formu)) {
                total = eval(formu);
              }
            }
          });
        });

        if (total !== null && total !== NaN) {
          if (Number(temp.data.value) !== total) {
            onChangeEditForm(
              { value: total.toFixed(Number(temp.template.attribute.decimal)) },
              rowIdx,
              colIdx
            );
          }
        } else {
          onChangeEditForm({ value: 0 }, rowIdx, colIdx);
        }
      }
    } catch (error) {
      console.log("number=>error", error);
    }
  }

  const renderControl = async (form: any) => {
    setFormComponent([...controlComponent]);

    // setFormLoading(true);
    // const control = form.items;
    // // console.log(control);
    // // const show: any[] = props.showControl;
    // let controlComponent: any = [];
    // const _errorResult = props.errorResult || [];
    // let numFormulas: any[] = [];
    // let dd: string = "set-padding-core-control";
    // // if (props.showControl?.length > 0) {
    // for (let i = 0; i < control.length; i++) {
    //   const _layout = control[i].layout;
    //   const _layoutLength = _layout.length;
    //   const grid_size = 12 / _layoutLength;
    //   let _colText = 0;
    //   let _colAction = 0;
    //   if (_layoutLength == 1) {
    //     _colText = 2;
    //     _colAction = 10;
    //   } else if (_layoutLength == 2) {
    //     _colText = 2;
    //     _colAction = 4;
    //   }
    //   let grid_row = (
    //     <Row className={dd}>
    //       {_layout.map((_template: any, idx: any) => {
    //         const error_corecontroll = _errorResult.find(
    //           (_data: any, _idx: any) => _data.row === i && _data.col === idx
    //         );
    //         if (!onChangeEditForm) {
    //           return;
    //         }
    //         if (
    //           _template.template.type === "l"
    //           // &&
    //           // props.showControl[i][idx] !== false
    //         ) {
    //           return (
    //             <MainTextComponents
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //             />
    //           );
    //         }
    //         if (
    //           _template.template.type === "c"
    //           // &&
    //           // props.showControl[i][idx] !== false
    //         ) {
    //           if (_template.template.attribute.formula !== "") {
    //             numFormulas.push({
    //               label: _template.template.label,
    //               formula: _template.template.attribute.formula,
    //             });
    //             setNumFormulas(numFormulas);
    //           }
    //           if (_template.template.attribute.summary === "Y") {
    //             setIsShowSummary(true);
    //           }
    //           return (
    //             <NumberComponent
    //               rowIdx={i}
    //               key={idx}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               summaryFunc={calNumberWithFormula(_template, i, idx)}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "d") {
    //           return (
    //             <CalendarComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "cb") {
    //           return (
    //             <MainCheckboxComponents
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "r") {
    //           return (
    //             <RadioComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "bt") {
    //           return (
    //             <ButtonComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               requestDetail={props.requestDetail}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "an") {
    //           return (
    //             <AutoNumberComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               controls={control}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "rvs") {
    //           setRvsPosition({ rowIdx: i, colIdx: idx });
    //           return (
    //             <RevisionComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               errorValid={error_corecontroll}
    //               colText={_colText}
    //               colAction={_colAction}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "tb") {
    //           if (_template.template.attribute.column) {
    //             for (
    //               let i = 0;
    //               i < _template.template.attribute.column.length;
    //               i++
    //             ) {
    //               const column = _template.template.attribute.column[i];
    //               if (column.control.template.type === "c") {
    //                 if (column.control.template.attribute.summary === "Y") {
    //                   setIsShowSummary(true);
    //                 }
    //               }
    //             }
    //           }
    //           return (
    //             <TableComponent
    //               currentLogic={currentLogic}
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               requestDetail={props.requestDetail}
    //               statusMemoDetail={props.statusMemoDetail}
    //               onTableSum={updateTableSum}
    //               errorTable={props.errorTable}
    //               valueTable={valueTable}
    //               onChangeEditFormTable={onChangeEditFormTable}
    //               onTableFooterChange={onTableFooterChange}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "ed") {
    //           return (
    //             <Col md={grid_size} xs={12}>
    //               <EditorComponent
    //                 key={idx}
    //                 rowIdx={i}
    //                 colIdx={idx}
    //                 onChangeEditForm={onChangeEditForm}
    //                 template={_template.template}
    //                 data={_template.data}
    //                 errorValid={error_corecontroll}
    //                 statusMemoDetail={props.statusMemoDetail}
    //               />
    //             </Col>
    //           );
    //         }
    //         if (_template.template.type === "at") {
    //           return (
    //             <AttachmentComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (
    //           _template.template.type === "t"
    //           //  &&
    //           // props.showControl[i][idx] !== false
    //         ) {
    //           dd = "set-padding-core-control";
    //           // console.log(
    //           //   "showControl[i][idx]",
    //           //   _template.template.label,
    //           //   showControl[i][idx],
    //           //   i,
    //           //   idx,
    //           //   showControl
    //           // );
    //           return (
    //             <ShortTextComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "ta") {
    //           return (
    //             <TextareaComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "dd") {
    //           if (_template.template.attribute.items !== null) {
    //             let items = _template.template.attribute.items;
    //             const value = _template.data.value;
    //             if (items.find((e: any) => e.item === value)) {
    //               // console.log("dropdown=>true");
    //             } else {
    //               // console.log("dropdown=>false");
    //             }
    //           }
    //           // console.log("dropdown=>" + _template.template.label, _template);
    //           return (
    //             <DropdownComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //               statusMemoDetail={props.statusMemoDetail}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "im") {
    //           return (
    //             <ImageComponent
    //               key={idx}
    //               rowIdx={i}
    //               colIdx={idx}
    //               onChangeEditForm={onChangeEditForm}
    //               template={_template.template}
    //               data={_template.data}
    //               colText={_colText}
    //               colAction={_colAction}
    //               errorValid={error_corecontroll}
    //             />
    //           );
    //         }
    //         if (_template.template.type === "em") {
    //           return (
    //             <EmptyComponent
    //               key={idx}
    //               colText={_colText}
    //               colAction={_colAction}
    //             />
    //           );
    //         }
    //       })}
    //     </Row>
    //   );
    //   if (!grid_row.props.children.every((e: any) => e === undefined)) {
    //     controlComponent.push(grid_row);
    //   }
    // }
    // // controlComponent.push(
    // //   <div className="summary-documentno-justify-conten-margin-bottom">
    // //     <SummaryComponent
    // //       headtext="All Total"
    // //       subtext="ยอดรวมทั้งหมด"
    // //       summaryProps={summary}
    // //     />
    // //   </div>
    // // );
    // setFormComponent([...controlComponent]);
    // // }
    // // setFormLoading(false);
  };

  return (
    <div className="core-control-container border-shadow-core-control">
      {formLoading && (
        <div className="loading-item">
          <ProgressSpinner />
        </div>
      )}
      {formComponent}
      {isShowSummary && (
        <div style={{ padding: "19px 19px 0 0" }}>
          <SummaryComponent
            headtext="All Total"
            subtext="ยอดรวมทั้งหมด"
            summaryProps={summary}
          />
        </div>
      )}
    </div>
  );
};
