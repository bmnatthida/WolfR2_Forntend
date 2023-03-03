import React, { useState, useEffect, useRef, useMemo } from "react";

import "./InformationComponent.css";
import moment from "moment";
import { Col, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Spin, Space } from "antd";
import { Dialog } from "primereact/dialog";

import { Toast } from "primereact/toast";
import { CoreControllerComponent } from "../CoreControllerComponent/CoreControllerComponent";
import { Badge } from "primereact/badge";
import { AutoComplete } from "primereact/autocomplete";

import { dataCompany } from "../../../Services/CompanyService";
import { GetApprovalByTemplate } from "../../../Services/ApprovalService";
import { useHistory, useLocation } from "react-router";
import { GetAllProject } from "../../../Services/ProjectService";
import { GetAllEmployee } from "../../../Services/EmployeeService";
import {
  GetAllTemplate,
  GetTemplateById,
  SearchTemplateListEditing,
} from "../../../Services/TemplateService";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { v4 as uuidv4 } from "uuid";
import { GetRefDocTemp } from "../../../Services/MemoService";
import { count, log } from "console";
import TinyMceComponent from "../../TinyMceComponent/TinyMceComponent";
import { GetSignature } from "../../../Services/MasterDataService";
import LeaveTypeComponents from "./LeaveTypeComponents/LeaveTypeComponents";
import { MdPreview } from "react-icons/md";
import { json } from "stream/consumers";
interface Props {
  onLoadLineApprove: boolean;
  setOnLoadLineApprove: any;
  workList?: any;
  setFormCategory?: any;
  formCategory?: any;
  form?: any;
  setForm?: any;
  getLineApprove: () => any;
  getInformationMethodProp: () => any;
  setInformationMethodProp: (respone: any) => any;
  getInformationTemplateProp: () => any;
  getInformationTemplateSetDataProp: any;
  setLineApporve: (respone: any) => any;
  setListFormName: (respone: any) => void;
  setListRefDocsDetail: (respone: any) => void;
  errorResult: any;
  setOnLoading: any;
  errorTable: any;
  isLoading: boolean;
  requestDetail: any;
  setInformationTemplate_Desc: (respone: any) => any;
  isInitialLogic: any;
  setIsInitialLogic: any;
  onLoading: any;
  setSummary?: (respone: any) => any;
  selectedView: any;
  showControl: any;
  setShowControl: any;
  setTextFromValue: any;
  textFromValue: any;
  isTextFromValue: any;
  setRequestDetail: any;
  leaveTypeTable: any;
  checkTypeLeave: any;
  isSetCanEdit: boolean;
  setIsSetCanEdit: (_state: any) => void;
  isCopyProps?: any;
  isHideProject: any;
  logic: any;
  listLogicData: any;
  setListLogicData: any;
  branchFromADTitle: any;
  isBranchFromADTitle: any;
  refTempSelectedProps: any;
  refAttibuteProps: any;
}
export const InformationComponent = (props: Props) => {
  const query = new URLSearchParams(useLocation().search);
  let location = useLocation<any>();
  const [projectData, setProjectData] = useState<any[]>([]);
  const [canEdit, setCanNotEdit] = useState<boolean>(true);
  const [treeTemplate, setTreeTemplate] = useState<any>();
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [nameEnCompanyTo, setNameEnCompanyTo] = useState<any[]>([]);
  const [nameEnCompanyCc, setNameEnCompanyCc] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any[]>([]);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [searchDataCc, setSearchDataCc] = useState<any[]>([]);
  const [searchCompanyData, setSearchCompanyData] = useState<any[]>([]);
  const [searchRefDocData, setSearchRefDocData] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [globalFilterValueCc, setGlobalFilterValueCc] = useState("");
  const [globalFilterCompanyValue, setGlobalFilterCompanyValue] = useState("");
  const [globalFilterRefTempValue, setGlobalFilterRefTempValue] =
    useState<string>("");
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isDialogVisibleCc, setDialogVisibleCc] = useState(false);
  const [isDialogVisibleCompany, setDialogVisibleCompany] = useState(false);
  const [isDialogVisibleRefTemp, setDialogVisibleRefTemp] = useState(false);
  const [selectProject, setSelectProject] = useState<any>([]);
  const [selectedEmployeeTo, setSelectedEmployeeTo] = useState<any>([]);
  const [filteredEmployeeTo, setFilteredEmployeeTo] = useState<any>();
  const [selectedEmployeeCc, setSelectedEmployeeCc] = useState<any>([]);
  const [filteredEmployeeCc, setFilteredEmployeeCc] = useState<any>();
  const [refTempSelected, setRefTempSelected] = useState<any>(
    props.refTempSelectedProps
  );
  const [selectFormTemplate, setSelectFormTemplate] = useState<any>([]);
  const [searchTemplateListEditing, setSearchTemplateListEditing] =
    useState<any>([]);
  const [isSearchTemplateEditing, setIsSearchTemplateEditing] =
    useState<any>(false);
  const [locationPathName, setLocationPathName] = useState<any>(
    location.pathname
  );
  const [coreRender, setCoreRender] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [onLazyLoad, setOnLazyLoad] = useState(false);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const empData = JSON.parse(window.localStorage.getItem("userData") || "");

  const toast = useRef<any>(null);

  useEffect(() => {
    if (props.refAttibuteProps) {
      setSearchRefDocData([...props.refAttibuteProps.option]);
    }
    props.setOnLoading(false);
  }, [props.refAttibuteProps]);

  useEffect(() => {
    if (
      props.getInformationMethodProp() !== undefined &&
      onLazyLoad === false
    ) {
      checkTextSubject();
      checkCanEdit();
    }
  }, [props.getInformationMethodProp()]);

  useEffect(() => {
    if (props.getInformationMethodProp().pass.length === 0) {
      setSelectedEmployeeCc([]);
      setNameEnCompanyCc([]);
    }
    if (props.getInformationMethodProp().to.length === 0) {
      setSelectedEmployeeTo([]);
      setNameEnCompanyTo([]);
    }
  }, [props.getInformationMethodProp(), props.getInformationTemplateProp()]);

  useEffect(() => {
    if (props.getInformationMethodProp() !== undefined) {
      if (
        props.getInformationMethodProp().status === "Draft" ||
        props.getInformationMethodProp().status === "New Request" ||
        props.getInformationMethodProp().status === "Rework" ||
        props.getInformationMethodProp().status === "Recall"
      ) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
      checkCanEdit();
      TemplateListEditing();
    }
    if (
      props.getInformationTemplateProp() !== undefined &&
      props.getInformationTemplateProp() !== null &&
      Object.keys(props.getInformationTemplateProp()).length !== 0 &&
      props.getInformationMethodProp() !== undefined
    ) {
      // checkRefTemplate();
    }
    if (props.getInformationMethodProp() !== undefined) {
      if (props.getInformationMethodProp().template_desc.length !== 0) {
        // checkRefTemplate();
        setTreeTemplate(props.getInformationMethodProp().template_desc);
        fetchDataEmployee();
      }
    }

    // fetchDataEmployee();
  }, [props.getInformationMethodProp()]);
  useEffect(() => {
    if (searchRefDocData.length > 0) {
      if (query.get("RefID") !== undefined && query.get("RefID") !== null) {
        const refId = query.get("RefID");
        let selQuery: any[] = [];
        searchRefDocData.map((refDoc: any) => {
          if (refDoc.DocumentNo === refId) {
            selQuery.push(refDoc);
          }
        });

        setRefTempSelected([...selQuery]);
      }
    }
  }, [searchRefDocData]);

  useEffect(() => {
    if (
      props.getInformationTemplateProp() !== undefined &&
      props.getInformationTemplateProp() !== null &&
      Object.keys(props.getInformationTemplateProp()).length !== 0 &&
      props.getInformationMethodProp() !== undefined
    ) {
      getInformation();
      setOnLazyLoad(false);
    } else if (
      props.getInformationTemplateProp() !== undefined &&
      props.getInformationTemplateProp() !== null &&
      Object.keys(props.getInformationTemplateProp()).length === 0 &&
      props.getInformationMethodProp() !== undefined
    ) {
      getInformation();
      setOnLazyLoad(false);
    }
  }, [props.getInformationTemplateProp()]);

  useEffect(() => {}, [treeTemplate]);
  useEffect(() => {
    if (companyList.length === 1) {
      props.setInformationTemplate_Desc({
        company_name: companyList[0].CompanyCodeWithName,

        company_id: companyList[0].CompanyId,
      });
    }
  }, [companyList]);

  function onChanceRef(refTempSelected: any) {
    try {
      if (props.requestDetail !== undefined && props.requestDetail !== null) {
        if (
          props.requestDetail.memoDetail !== null &&
          props.requestDetail.listFormName[0] !== null
        ) {
          let listFormName = props.requestDetail.listFormName[0];
          if (
            refTempSelected !== undefined &&
            refTempSelected !== null &&
            refTempSelected.length > 0
          ) {
            let docsCode: any[] = [];
            let template_desc = JSON.parse(listFormName.AdvanceForm);
            let _listRefDocsDetail: any[] = [];
            let refTemp: any;
            const refColumn = JSON.parse(listFormName.RefDocColumn);
            if (
              listFormName.RefTemplate !== "" &&
              listFormName.RefTemplate !== null
            ) {
              refTemp = JSON.parse(listFormName.RefTemplate);
              refTemp.map((temp: any) => {
                if (temp.DocumentCode !== "") {
                  docsCode.push(temp.DocumentCode);
                }
              });
            }
            refTempSelected.map((refTems: any) => {
              let refDocDetail = {
                memoRefdoc_id: refTems.MemoId,
                doc_no: refTems.DocumentNo,
                template_ID: listFormName.template_id,
                template_Name: listFormName.template_name,
                memoSubject: listFormName.subject,
              };
              const selectedColumn = JSON.parse(refTems.MAdvancveForm);
              let valibCol: any[] = [];
              _listRefDocsDetail.push(refDocDetail);
              docsCode.map((code: any) => {
                refColumn.map((col: any) => {
                  if (col.Value !== null && col.Value !== "") {
                    if (col.Value === "_DocumentNo") {
                      col.ControlValue = { value: refTems.DocumentNo };
                    } else {
                      let selColLabel = "";
                      if (col.Value.indexOf("_") !== -1) {
                        let colLabel = col.Value.split("_");
                        selColLabel = colLabel[1];
                      } else {
                        selColLabel = col.Value;
                      }
                      if (col.TypeControl === "Table") {
                        let sourceRow: any = -1;
                        let sourceCols: any[] = [];
                        let targetPositions: any[] = [];

                        selectedColumn.items.map(
                          (selCol: any, rowIdx: number) => {
                            selCol.layout.map((_layout: any) => {
                              if (selColLabel === _layout.template.label) {
                                col.objTable?.map(
                                  (objTable: any, tarColIdx: number) => {
                                    if (objTable?.Value !== null) {
                                      _layout.template.attribute.column.map(
                                        (refTable: any, colIdx: number) => {
                                          if (
                                            refTable.label === objTable.Value
                                          ) {
                                            sourceRow = rowIdx;
                                            sourceCols.push({
                                              colIdx: colIdx,
                                            });
                                            targetPositions.push(tarColIdx);
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            });
                          }
                        );
                        if (sourceRow > -1) {
                          let tableRows: any[] = [];
                          if (props.refAttibuteProps.mode !== "Single") {
                            tableRows = col.ControlValue;
                          }
                          selectedColumn.items[
                            sourceRow
                          ].layout[0]?.data?.row?.map((row: any) => {
                            let newRow: any[] = [];

                            for (let i = 0; i < col.objTable.length; i++) {
                              newRow.push({ value: "" });
                            }

                            sourceCols.map((col: any, colIdx: number) => {
                              newRow[targetPositions[colIdx]] = row[col.colIdx];
                            });
                            if (newRow.length > 0) {
                              tableRows.push(newRow);
                            }
                          });

                          col.ControlValue = tableRows;
                        }
                      } else {
                        selectedColumn.items.map((selCol: any) => {
                          selCol.layout.map((_layout: any) => {
                            if (_layout.template.label === selColLabel) {
                              col.ControlValue = _layout.data;
                            }
                          });
                        });
                      }
                    }

                    valibCol.push(col);
                  }
                });
              });

              valibCol.map((col: any) => {
                template_desc.items.map((item: any) => {
                  item.layout.map((_layout: any) => {
                    if (col.ControlValue !== undefined) {
                      if (
                        col.TypeControl === "Table" &&
                        _layout.template.type === "tb"
                      ) {
                        if (col.Key === _layout.template.label) {
                          _layout.data.row = [...col.ControlValue];
                        }
                      } else {
                        if (col.Key === _layout.template.label) {
                          _layout.data = col.ControlValue;
                        }
                      }
                    }
                  });
                });
              });
            });
            props.setListRefDocsDetail(_listRefDocsDetail);
            props.setInformationMethodProp(JSON.stringify(template_desc));
          } else {
            let template_desc = JSON.parse(listFormName.AdvanceForm);
            props.setListRefDocsDetail([]);
            props.setInformationMethodProp(JSON.stringify(template_desc));
          }
        }
        if (props.refAttibuteProps.mode === "Single") {
          setDialogVisibleRefTemp(!isDialogVisibleRefTemp);
        }
      }
    } catch (error) {
      console.log("ref=>error", error);
    }
  }

  // useEffect(() => {
  //   props.setOnLoading(false);
  // }, [props.refAttibuteProps]);

  async function previewTemplate() {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host;

    window.open(
      `${baseUrl}/PreviewTemplate?MemoID=0&template=${selectFormTemplate.TemplateId}&preview`,
      "_blank"
    );
  }
  function checkTextSubject() {
    if (props.getInformationTemplateProp() != undefined) {
      if (
        props.getInformationMethodProp().subject === undefined ||
        props.getInformationMethodProp().subject === null ||
        props.getInformationMethodProp().subject.length === 0
      ) {
        props.setInformationTemplate_Desc({
          subject: props.getInformationTemplateProp().TemplateSubject,
        });
        setSubject(props.getInformationTemplateProp().TemplateSubject);
      } else if (props.getInformationMethodProp().subject.length !== 0) {
        setSubject(props.getInformationMethodProp().subject);
      }
      setOnLazyLoad(true);
    }
  }
  async function TemplateListEditing() {
    if (
      props.requestDetail.listFormName !== undefined &&
      props.requestDetail.listFormName !== null &&
      props.requestDetail.listFormName.length !== 0
    ) {
      if (props.requestDetail.listFormName[0].isFormControl) {
        let searchTemplate = await SearchTemplateListEditing({
          TemplateId: null,
          CreatedBy: userData.employeeData.EmployeeId.toString(),
        });
        let searchTemplateEdit: any;
        if (
          props.requestDetail.memoDetail.TemplateApproveId !== undefined &&
          props.requestDetail.memoDetail.TemplateApproveId !== null &&
          props.requestDetail.memoDetail.TemplateApproveId.length !== 0
        ) {
          searchTemplateEdit = await SearchTemplateListEditing({
            TemplateId: Number(
              props.requestDetail.memoDetail.TemplateApproveId
            ),
          });
          if (
            searchTemplateEdit === undefined ||
            searchTemplateEdit === null ||
            searchTemplateEdit.length === 0
          ) {
            searchTemplateEdit = await GetTemplateById({
              TemplateId: Number(
                props.requestDetail.memoDetail.TemplateApproveId
              ),
            });
          }
          console.log(
            "searchTemplateEdit",
            searchTemplateEdit,
            props.requestDetail.memoDetail
          );

          setSelectFormTemplate(
            searchTemplateEdit[0] === undefined ||
              searchTemplateEdit[0] === null ||
              searchTemplateEdit[0].length === 0
              ? searchTemplateEdit
              : searchTemplateEdit[0]
          );
        }

        setSearchTemplateListEditing(searchTemplate);
        setIsSearchTemplateEditing(true);
      }
    }
  }

  function dataStatusDraftSetDateNew() {
    const newDate = new Date();

    props.setInformationTemplate_Desc({
      request_date: formatDateTimeDataReQuest(newDate),
      created_date: formatDateTimeDataReQuest(newDate),
    });
  }

  function checkCanEdit() {
    let info = props.getInformationMethodProp();

    if (info.status === "Completed" || info.status === "Reject") {
      setCanNotEdit(true);
    } else if (
      info.status === "Draft" ||
      info.status === "New Request" ||
      info.status === "Rework" ||
      info.status === "Recall"
    ) {
      props.setIsSetCanEdit(true);

      setCanNotEdit(false);
    } else {
      const detail = props.requestDetail;
      if (detail?.listFormName[0]?.ApproverCanEdit) {
        props.setIsSetCanEdit(true);
        setDisabled(false);
        setCanNotEdit(false);
      } else {
        props.setIsSetCanEdit(true);

        setCanNotEdit(true);
      }
    }
  }

  async function getInformation() {
    if (companyList !== [] || employee !== []) {
      fetchDataCompany();
      fetchDataEmployee();
    }

    let info_template = props.getInformationMethodProp();
    if (
      props.getInformationMethodProp().project === null ||
      props.getInformationMethodProp().project === undefined
    ) {
      props.getInformationMethodProp().project = "";
      props.setInformationTemplate_Desc({ project: "" });
    }
    if (props.getInformationMethodProp().copyInformation === undefined) {
      props.getInformationMethodProp().copyInformation = "N";
      props.setInformationTemplate_Desc({ copyInformation: "N" });
    }

    if (
      props.getInformationMethodProp().memoid === 0 &&
      props.getInformationMethodProp().copyInformation === "N"
    ) {
      if (
        props.getInformationTemplateProp() !== undefined &&
        props.getInformationTemplateProp() !== null &&
        Object.keys(props.getInformationTemplateProp()).length !== 0
      ) {
        fetchDataTemplateByid();
      }

      if (
        props.getInformationMethodProp().template_desc.trim() !== "" &&
        props.getInformationMethodProp().template_desc.trim() !==
          props.getInformationTemplateProp().AdvanceForm
      ) {
        if (
          props.getInformationMethodProp().template_id !==
          props.getInformationTemplateProp().TemplateId
        ) {
          props.setInformationMethodProp(
            props.getInformationTemplateProp().AdvanceForm
          );
          props.getInformationMethodProp().subject = "";
          setTreeTemplate(props.getInformationTemplateProp().AdvanceForm);
          await dataGetInformationMethodProp();
        } else {
          setTreeTemplate(info_template.template_desc);

          await dataGetInformationMethodProp();
        }
      } else {
        setTreeTemplate(props.getInformationTemplateProp().AdvanceForm);
        await dataGetInformationMethodProp();
      }
    } else if (
      props.getInformationMethodProp().memoid !== 0 &&
      props.getInformationMethodProp().copyInformation === "N"
    ) {
      templateListFormName();
      if (props.getInformationMethodProp().template_detail.length === 0) {
        setGuid();
      }
      props.setInformationTemplate_Desc({
        document_set: props.getInformationMethodProp().template_detail,
      });
      if (props.getInformationMethodProp().status === "Draft") {
        dataStatusDraftSetDateNew();
      }
      if (Object.keys(props.getInformationTemplateProp()).length !== 0) {
        setTreeTemplate(props.getInformationTemplateProp().AdvanceForm);
        props.setInformationTemplate_Desc({
          subject: props.getInformationTemplateProp().TemplateName,
        });
        dataGetInformationMethodMemoProp();
      } else {
        setTreeTemplate(props.getInformationMethodProp().template_desc);
      }
      setSubject(props.getInformationMethodProp().subject);
    }
    if (
      props.getInformationMethodProp().memoid === 0 &&
      props.getInformationMethodProp().copyInformation === "Y"
    ) {
      templateListFormName();
      dataStatusDraftSetDateNew();
      if (Object.keys(props.getInformationTemplateProp()).length !== 0) {
        setTreeTemplate(props.getInformationTemplateProp().AdvanceForm);
        dataGetInformationMethodMemoProp();
      } else {
        setTreeTemplate(props.getInformationMethodProp().template_desc);
      }
      setSubject(props.getInformationMethodProp().subject);
      // props.setOnLoading(false);
    }
  }
  async function setGuid() {
    let _uuid = uuidv4().replace(/-/g, "");
    await props.setInformationTemplate_Desc({
      template_detail: _uuid,
      document_set: _uuid,
    });
  }
  async function templateListFormName() {
    const dataJson = {
      TemplateId: props.requestDetail?.memoDetail.template_id,
    };
    if (dataJson.TemplateId !== null) {
      let _templateIdListFormName: any = await GetTemplateById(dataJson);
      if (
        _templateIdListFormName === null ||
        _templateIdListFormName === undefined
      ) {
        _templateIdListFormName = [];
      }
      props.setListFormName(_templateIdListFormName);
    }
  }

  async function dataGetInformationMethodProp() {
    const newDate = new Date();
    let _dataSetInformation: any = {
      request_date: formatDateTimeDataReQuest(newDate),
      created_date: formatDateTimeDataReQuest(newDate),
      status:
        location.pathname === "/PreviewTemplate"
          ? props.getInformationMethodProp().status
          : "New Request",
      modified_date: formatDateTimeDataReQuest(newDate),
      modified_by: window.localStorage.getItem("employeeId"),
      created_by: window.localStorage.getItem("employeeId"),
      report_lang: props.getInformationTemplateProp().ReportLang,
      auto_approve_when: props.getInformationTemplateProp().AutoApproveWhen,
      GroupTemplateName: props.getInformationTemplateProp().GroupTemplateName,
      template_id: props.getInformationTemplateProp().TemplateId,
      template_name: props.getInformationTemplateProp().TemplateName,
      template_code: props.getInformationTemplateProp().DocumentCode,
      document_no: "Auto Generate",
      template_detail: uuidv4().replace(/-/g, ""),
      waiting_for: window.localStorage.getItem("nameTh"),
      waiting_for_id: window.localStorage.getItem("employeeId"),
    };
    await props.setInformationTemplate_Desc(_dataSetInformation);
  }
  function dataGetInformationMethodMemoProp() {
    const newDate = new Date();
    props.setInformationTemplate_Desc({
      memoid: 0,
      request_date: formatDateTimeDataReQuest(newDate),
      created_date: formatDateTimeDataReQuest(newDate),
      status: "New Request",
      modified_date: formatDateTimeDataReQuest(newDate),
      modified_by: window.localStorage.getItem("employeeId"),
      created_by: window.localStorage.getItem("employeeId"),
      report_lang: props.getInformationTemplateProp().ReportLang,

      auto_approve_when: props.getInformationTemplateProp().AutoApproveWhen,

      GroupTemplateName: props.getInformationTemplateProp().GroupTemplateName,
      template_id: props.getInformationTemplateProp().TemplateId,

      template_name: props.getInformationTemplateProp().TemplateName,
      template_code: props.getInformationTemplateProp().DocumentCode,
      document_no: "Auto Generate",
      waiting_for: window.localStorage.getItem("nameTh"),
      waiting_for_id: window.localStorage.getItem("employeeId"),
      company_name: "",
      company_id: 0,
      project_id: 0,
      project: "",
      subject: "",
      amount: "",
      to: "",
      pass: "",
    });
  }

  const onGlobalFilterChange = (e: any) => {
    const value = e;
    const dataEmp = employee;
    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      let findData: any = [];
      columns.map((col: any) => {
        let field = col.field;
        if (userData !== undefined) {
          if (userData.employeeData.Lang === "EN") {
            field = field.replaceAll("Th", "En");
          } else {
            field = field.replaceAll("En", "Th");
          }
        }
        if (data[field].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          findData.push(data);
        }
      });
      if (findData.length > 0) {
        return true;
      }
    });
    setSearchData([...data]);
  };
  const columns = [
    {
      field: "EmployeeCode",
      headerEn: "EmployeeCode",
      headerTh: "รหัสพนักงาน",
    },
    {
      field: "NameEn",
      headerEn: "Name",
      headerTh: "ชื่อ",
    },
    {
      field: "PositionNameEn",
      headerEn: "Position",
      headerTh: "ตำแหน่ง",
    },
    {
      field: "DepartmentNameEn",
      headerEn: "Department",
      headerTh: "หน่วยงาน",
    },
  ];
  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        key={col.field}
        header={
          <tr>
            <th>
              <p className="row headtext">{col.headerEn}</p>
              <p className="row subtext">{col.headerTh}</p>
            </th>
          </tr>
        }
        body={(rowData) => {
          if (rowData.Lang !== undefined) {
            if (userData.employeeData.Lang === "EN") {
              let newField = col.field.replace("Th", "En");
              return rowData[newField];
            } else {
              let newField = col.field.replace("En", "Th");
              return rowData[newField];
            }
          } else {
            return rowData[col.field];
          }
        }}
      />
    );
  });
  const onGlobalFilterChangeCc = (e: any) => {
    const value = e;
    const dataEmp = employee;
    setGlobalFilterValueCc(value);
    const data = dataEmp.filter((data: any) => {
      let findData: any = [];
      columns.map((col: any) => {
        let field = col.field;
        if (userData !== undefined) {
          if (userData.employeeData.Lang === "EN") {
            field = field.replaceAll("Th", "En");
          } else {
            field = field.replaceAll("En", "Th");
          }
        }
        if (data[field].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          findData.push(data);
        }
      });
      if (findData.length > 0) {
        return true;
      }
    });

    setSearchDataCc([...data]);
  };
  const onGlobalFilterCompanyChange = (e: any) => {
    const value = e;
    const dataCpl = companyList;
    setGlobalFilterCompanyValue(value);
    const data = dataCpl.filter((data: any) => {
      if (
        data.CompanyCode?.toLowerCase().includes(value?.toLowerCase()) ||
        empData.employeeData.Lang === "EN"
          ? data.NameEn?.toLowerCase().includes(value?.toLowerCase())
          : data.NameTh?.toLowerCase().includes(value?.toLowerCase()) ||
            data.AddressEn?.toLowerCase().includes(value?.toLowerCase())
      ) {
        return true;
      }
    });
    setSearchCompanyData([...data]);
  };

  // const onGlobalFilterRefTempChange = (e: any) => {
  //   const value = e;
  //   const dataOption = props.refAttibuteProps.option;
  //   setGlobalFilterRefTempValue(value);
  //   const data = dataOption.filter((data: any) => {
  //     if (
  //       data.DocumentNo.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
  //       data.TemplateName.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
  //       data.MemoSubject.toLowerCase().indexOf(value.toLowerCase()) !== -1
  //     ) {
  //       return true;
  //     }
  //   });
  //   setSearchRefDocData([...data]);
  // };
  useEffect(() => {
    try {
      if (props.refAttibuteProps !== undefined) {
        console.log("ref=>", props.refAttibuteProps.option);

        const dataOption = props.refAttibuteProps.option;
        const data = dataOption.filter((data: any) => {
          if (
            data.DocumentNo.toLowerCase().indexOf(
              globalFilterRefTempValue.toLowerCase()
            ) !== -1 ||
            data.TemplateName.toLowerCase().indexOf(
              globalFilterRefTempValue.toLowerCase()
            ) !== -1 ||
            data.MemoSubject.toLowerCase().indexOf(
              globalFilterRefTempValue.toLowerCase()
            ) !== -1
          ) {
            return true;
          }
        });
        setSearchRefDocData([...data]);
      }
    } catch (error) {
      console.log("ref=>", error);
    }
  }, [globalFilterRefTempValue]);

  //Test
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const _project = await GetAllProject();
    setProjectData(_project);
  }

  async function fetchDataEmployee() {
    const employee = await GetAllEmployee();
    setEmployee(employee);
    setSearchData(employee);
    setSearchDataCc(employee);
    if (
      (props.getInformationMethodProp().pass.length !== 0 &&
        props.getInformationMethodProp().pass !== undefined) ||
      (Object.keys(props.getInformationTemplateProp()).length !== 0 &&
        props.getInformationTemplateProp().CcId.length !== 0)
    ) {
      let answer_array = [];
      if (props.getInformationMethodProp().memoid === 0) {
        answer_array =
          props.getInformationMethodProp().pass.length !== 0
            ? props.getInformationMethodProp().pass.split(",")
            : Object.keys(props.getInformationTemplateProp()).length !== 0
            ? props.getInformationTemplateProp().CcId.length !== 0
              ? props.getInformationTemplateProp().CcId.split(",")
              : []
            : [];
      } else {
        answer_array =
          Object.keys(props.getInformationMethodProp()).length !== 0
            ? props.getInformationMethodProp().pass.length === 0
              ? []
              : props.getInformationMethodProp().pass.split(",")
            : props.getInformationMethodProp().pass.split(",");
      }

      let dataName: any = [];
      let res: any = [];
      for (let i = 0; i < employee.length; i++) {
        for (let j = 0; j < answer_array.length; j++) {
          if (employee[i].NameEn === answer_array[j]) {
            if (res.length != 0) {
              let _dataFilter = res.filter(
                (item: any) => item.NameEn === employee[i].NameEn
              );
              if (_dataFilter.length === 0) {
                res.push(employee[i]);
              }
            } else {
              res.push(employee[i]);
            }

            if (dataName.length !== 0) {
              let _dataFilter = dataName.filter(
                (item: any) => item === employee[i].NameEn
              );
              if (_dataFilter.length === 0) {
                dataName.push(employee[i].NameEn);
              }
            } else {
              dataName.push(employee[i].NameEn);
            }
          }
        }
      }
      if (answer_array.length !== res.length) {
        let _dataFilter = answer_array.filter((data: any) => {
          let _data = res.filter((_data: any) => _data.NameEn === data);
          if (_data.length === 0) {
            dataName.push(data);
            let _event = {
              AccountCode: "",
              AccountName:
                "                                                                                                                                                                                                                                             ",
              CreatedBy: null,
              CreatedDate: "",
              DefaultLang: "EN",
              DepartmentId: null,
              DepartmentNameEn: "",
              DepartmentNameTh: "",
              Email: "",
              EmployeeCode: "",
              EmployeeId: null,
              ExpiredDate: "",
              IsActive: true,
              Lang: "EN",
              ModifiedBy: "",
              ModifiedDate: "",
              NameEn: data,
              NameTh: data,
              PositionId: null,
              PositionNameEn: "",
              PositionNameTh: "",
              RegisteredDate: "",
              ReportToEmpCode: "",
              SignPicPath: null,
              Username: "",
            };
            res.push(_event);
          }
        });
      }

      setSelectedEmployeeCc(res);
      setNameEnCompanyCc([...dataName]);

      if (props.getInformationMethodProp().pass.length === 0) {
        props.setInformationTemplate_Desc({ pass: dataName.toString() });
      }
    } else {
      setSelectedEmployeeCc([]);
      setNameEnCompanyCc([]);
    }
    // (props.getInformationMethodProp().pass.length !== 0 &&
    // props.getInformationMethodProp().pass !== undefined) ||
    if (
      (props.getInformationMethodProp().to !== undefined &&
        props.getInformationMethodProp().to.length !== 0) ||
      (Object.keys(props.getInformationTemplateProp()).length !== 0 &&
        props.getInformationTemplateProp().ToId.length !== 0)
    ) {
      let answer_array: any = [];
      if (props.getInformationMethodProp().memoid === 0) {
        answer_array =
          props.getInformationMethodProp().to.length !== 0
            ? props.getInformationMethodProp().to.split(",")
            : Object.keys(props.getInformationTemplateProp()).length !== 0
            ? props.getInformationTemplateProp().ToId.length !== 0
              ? props.getInformationTemplateProp().ToId.split(",")
              : []
            : [];
      } else {
        answer_array =
          Object.keys(props.getInformationMethodProp()).length !== 0
            ? props.getInformationMethodProp().to.length === 0
              ? []
              : props.getInformationMethodProp().to.split(",")
            : props.getInformationMethodProp().to.split(",");
      }
      console.log("answer_array", answer_array);

      let dataName: any = [];
      let res: any = [];
      for (let i = 0; i < employee.length; i++) {
        for (let j = 0; j < answer_array.length; j++) {
          if (employee[i].NameEn === answer_array[j]) {
            if (res.length != 0) {
              let _dataFilter = res.filter(
                (item: any) => item.NameEn === employee[i].NameEn
              );
              if (_dataFilter.length === 0) {
                res.push(employee[i]);
              }
            } else {
              res.push(employee[i]);
            }

            if (dataName.length !== 0) {
              let _dataFilter = dataName.filter(
                (item: any) => item === employee[i].NameEn
              );
              if (_dataFilter.length === 0) {
                dataName.push(employee[i].NameEn);
              }
            } else {
              dataName.push(employee[i].NameEn);
            }
          }
        }
      }
      if (answer_array.length !== res.length) {
        let _dataFilter = answer_array.filter((data: any) => {
          let _data = res.filter((_data: any) => _data.NameEn === data);
          if (_data.length === 0) {
            dataName.push(data);
            let _event = {
              AccountCode: "",
              AccountName:
                "                                                                                                                                                                                                                                             ",
              CreatedBy: null,
              CreatedDate: "",
              DefaultLang: "EN",
              DepartmentId: null,
              DepartmentNameEn: "",
              DepartmentNameTh: "",
              Email: "",
              EmployeeCode: "",
              EmployeeId: null,
              ExpiredDate: "",
              IsActive: true,
              Lang: "EN",
              ModifiedBy: "",
              ModifiedDate: "",
              NameEn: data,
              NameTh: data,
              PositionId: null,
              PositionNameEn: "",
              PositionNameTh: "",
              RegisteredDate: "",
              ReportToEmpCode: "",
              SignPicPath: null,
              Username: "",
            };
            res.push(_event);
          }
        });
      }

      setSelectedEmployeeTo(res);
      setNameEnCompanyTo([...dataName]);

      if (props.getInformationMethodProp().to.length === 0) {
        props.setInformationTemplate_Desc({ to: dataName.toString() });
      }
      // props.setInformationTemplate_Desc({ to: dataName.toString() });
    } else {
      setSelectedEmployeeTo([]);
      setNameEnCompanyTo([]);
    }

    const project =
      projectData === undefined ||
      projectData === null ||
      projectData.length === 0
        ? await GetAllProject()
        : projectData;

    if (
      props.getInformationMethodProp().project !== 0 &&
      props.getInformationMethodProp().project !== undefined
    ) {
      const dataFilter = project.filter(
        (item: any) =>
          item.ProjectName === props.getInformationMethodProp().project
      );

      setSelectProject(dataFilter[0]);
    }
    setProjectData(project);
  }

  async function fetchDataTemplateByid() {
    const dataJson = {
      TemplateId: props.getInformationTemplateProp().TemplateId,
    };

    if (!props.isInitialLogic) {
      console.log("props.isInitialLogic", props.isInitialLogic);

      props.setOnLoadLineApprove(true);
      await fetchDataLineApproveWithTemplate(await GetTemplateById(dataJson));
    }
  }

  async function fetchDataLineApproveWithTemplate(data: any) {
    let localStorageData: any = window.localStorage.getItem("userData");
    const userData = JSON.parse(localStorageData);
    const _templateByid = data;
    const lineApprove = props.getLineApprove();
    let Template: any = {};
    if (Object.keys(props.getInformationTemplateProp()).length !== 0) {
      Template = props.getInformationTemplateProp();
    } else {
      Template = _templateByid;
    }
    console.log("Template", Template);

    const dataJson = {
      templateForm: Template,
      lstTRNLineApprove: [],
      VEmployee: userData.employeeData,
    };
    console.log("dataJson", dataJson);

    if (lineApprove.length === 0) {
      let responeAprovaWithTemplate: any = await GetApprovalByTemplate(
        dataJson
      );
      props.setLineApporve(responeAprovaWithTemplate);

      props.setOnLoading(false);
    }
    props.setOnLoadLineApprove(false);
  }
  async function fetchDataCompany() {
    let responeCompanyData = await dataCompany();
    console.log("responeCompanyData", responeCompanyData);

    if (responeCompanyData.length !== companyList.length) {
      setCompanyList(responeCompanyData);
    }
    setSearchCompanyData(responeCompanyData);
  }
  function onChangeSubjectMemo(value: any) {
    let temp = props.getInformationMethodProp();
    let _listRefDocsDetail: any[] = [];
    refTempSelected.map((refTems: any) => {
      let refDocDetail = {
        memoRefdoc_id: refTems.MemoId,
        doc_no: refTems.DocumentNo,
        template_ID: temp.template_id,
        template_Name: temp.template_name,
        memoSubject: value,
      };
      _listRefDocsDetail.push(refDocDetail);
    });
    props.setListRefDocsDetail(_listRefDocsDetail);
    props.setInformationTemplate_Desc({
      subject: value,
    });
    setSubject(value);
  }
  const formatDateTimeDataReQuest = (value: any) => {
    if (value != "") {
      let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
      const NewDate = moment(someDateString).format("DD/MM/YYYY HH:mm:ss");
      return NewDate;
    } else {
      const NewDate = "";
      return NewDate;
    }
  };
  const formatDateTime = (value: any) => {
    if (value != "") {
      let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
      const NewDate = moment(someDateString).format("DD MMM yyyy");
      return NewDate;
    } else {
      const NewDate = "";
      return NewDate;
    }
  };
  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={globalFilterValue}
          onChangeProps={onGlobalFilterChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };
  const renderHeaderCc = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={globalFilterValueCc}
          onChangeProps={onGlobalFilterChangeCc}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };
  const renderHeaderCompany = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={globalFilterCompanyValue}
          onChangeProps={onGlobalFilterCompanyChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };
  const renderHeaderReftemp = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={globalFilterRefTempValue}
          onChangeProps={(e: any) => setGlobalFilterRefTempValue(e)}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };
  function showModal() {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    setDialogVisible(!isDialogVisible);
    fetchDataEmployee();
  }
  function showModalCompany() {
    if (globalFilterCompanyValue != "") {
      setGlobalFilterCompanyValue("");
    }
    fetchDataCompany();
    setDialogVisibleCompany(!isDialogVisibleCompany);
  }
  function showModalRefTemp() {
    setGlobalFilterRefTempValue("");
    setDialogVisibleRefTemp(!isDialogVisibleRefTemp);
  }
  function showModalCc() {
    if (globalFilterValueCc != "") {
      setGlobalFilterValueCc("");
    }
    setDialogVisibleCc(!isDialogVisibleCc);
    fetchDataEmployee();
  }
  const onRowSelect = (event: any) => {
    let dataName: any[] = nameEnCompanyTo;
    let dataSelectEmployee: any[] = [...selectedEmployeeTo];
    const datafilterEmployee = dataSelectEmployee.filter(
      (_data: any) => _data.EmployeeId === event.data.EmployeeId
    );
    console.log("datafilterEmployee", datafilterEmployee);

    if (datafilterEmployee.length === 0) {
      dataSelectEmployee.push(event.data);
      dataName.push(event.data.NameEn);
    }
    console.log("dataName", dataName);

    setSelectedEmployeeTo(dataSelectEmployee);
    setNameEnCompanyTo([...dataName]);
    props.setInformationTemplate_Desc({ to: dataName.toString() });

    setDialogVisible(false);
  };
  const onRowSelectCc = (event: any) => {
    let dataName: any[] = nameEnCompanyCc;
    let dataSelectEmployee: any[] = [...selectedEmployeeCc];
    const datafilterEmployee = dataSelectEmployee.filter(
      (_data: any) => _data.EmployeeId === event.data.EmployeeId
    );
    if (datafilterEmployee.length === 0) {
      dataSelectEmployee.push(event.data);
      dataName.push(event.data.NameEn);
    }
    setSelectedEmployeeCc(dataSelectEmployee);
    setNameEnCompanyCc([...dataName]);
    props.setInformationTemplate_Desc({ pass: dataName.toString() });
    setDialogVisibleCc(false);
  };
  const onRowSelectCompany = (event: any) => {
    if (
      props.getInformationMethodProp().status.trim() === "Wait for Approve" ||
      props.getInformationMethodProp().status.trim() === "Completed"
    ) {
    } else {
      props.getInformationMethodProp().company_id = event.data.CompanyId;
      props.getInformationMethodProp().company_name =
        event.data.CompanyCodeWithName;
    }
    setDialogVisibleCompany(false);
  };

  const onChangeSelectProject = (data: any) => {
    setSelectProject(data);
    props.setInformationTemplate_Desc({
      project_id: data.ProjectId,
      project: data.ProjectName,
    });
  };
  const onChangeSelectFormTemplate = (data: any) => {
    setSelectFormTemplate(data);
    props.setInformationTemplate_Desc({
      TemplateApproveId: data.TemplateId.toString(),
    });
  };

  const searchEmployeeTo = (event: any) => {
    setTimeout(() => {
      let _filteredEmployee;
      if (!event.query.trim().length) {
        _filteredEmployee = [...employee];
      } else {
        _filteredEmployee = employee.filter((dataemployee: any) => {
          if (
            dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
        });
      }

      setFilteredEmployeeTo(_filteredEmployee);
    }, 250);
  };
  const searchEmployeeToEnter = (event: any) => {
    let dataSelectEmployee: any[] = [...selectedEmployeeTo];
    if (event.length !== 0) {
      let _event = {
        AccountCode: "",
        AccountName: "",
        CreatedBy: null,
        CreatedDate: "",
        DefaultLang: "EN",
        DepartmentId: null,
        DepartmentNameEn: "",
        DepartmentNameTh: "",
        Email: "",
        EmployeeCode: "",
        EmployeeId: null,
        ExpiredDate: "",
        IsActive: true,
        Lang: "EN",
        ModifiedBy: "",
        ModifiedDate: "",
        NameEn: event,
        NameTh: event,
        PositionId: null,
        PositionNameEn: "",
        PositionNameTh: "",
        RegisteredDate: "",
        ReportToEmpCode: "",
        SignPicPath: null,
        Username: "",
      };
      dataSelectEmployee.push(_event);
      setSelectedEmployeeToFunction(dataSelectEmployee);
    }
    // setSelectedEmployeeTo(dataSelectEmployee);
    // setFilteredEmployeeTo(_event);
  };

  const searchEmployeeCc = (event: any) => {
    setTimeout(() => {
      let _filteredEmployee;
      if (!event.query.trim().length) {
        _filteredEmployee = [...employee];
      } else {
        _filteredEmployee = employee.filter((dataemployee: any) => {
          if (
            dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.NameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.PositionNameTh.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
          if (
            dataemployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            )
          ) {
            return dataemployee.PositionNameEn.toLowerCase().includes(
              event.query.toLowerCase()
            );
          }
        });
      }

      setFilteredEmployeeCc(_filteredEmployee);
    }, 250);
  };
  const searchEmployeeCcEnter = (event: any) => {
    let dataSelectEmployee: any[] = [...selectedEmployeeCc];
    if (event.length !== 0) {
      let _event = {
        AccountCode: "",
        AccountName:
          "                                                                                                                                                                                                                                             ",
        CreatedBy: null,
        CreatedDate: "",
        DefaultLang: "EN",
        DepartmentId: null,
        DepartmentNameEn: "",
        DepartmentNameTh: "",
        Email: "",
        EmployeeCode: "",
        EmployeeId: null,
        ExpiredDate: "",
        IsActive: true,
        Lang: "EN",
        ModifiedBy: "",
        ModifiedDate: "",
        NameEn: event,
        NameTh: event,
        PositionId: null,
        PositionNameEn: "",
        PositionNameTh: "",
        RegisteredDate: "",
        ReportToEmpCode: "",
        SignPicPath: null,
        Username: "",
      };
      dataSelectEmployee.push(_event);
      setSelectedEmployeeCcFunction(dataSelectEmployee);
    }
    // setSelectedEmployeeTo(dataSelectEmployee);
    // setFilteredEmployeeTo(_event);
  };

  const setSelectedEmployeeToFunction = (event: any) => {
    let dataName: any[] = [];

    event.map((d: any) => dataName.push(d.NameEn));
    setNameEnCompanyTo([...dataName]);
    setSelectedEmployeeTo(event);

    props.setInformationTemplate_Desc({ to: dataName.toString() });
  };
  const setSelectedEmployeeCcFunction = (event: any) => {
    let dataName: any[] = [];
    event.map((d: any) => dataName.push(d.NameEn));
    setNameEnCompanyCc([...dataName]);
    setSelectedEmployeeCc(event);
    props.setInformationTemplate_Desc({ pass: dataName.toString() });
  };

  const rowClassName = () => {
    return "row-pointer";
  };

  return (
    <>
      {!props.onLoading && (
        <div>
          <Toast ref={toast} />
          <>
            <Row className="0">
              <Col
                xs={12}
                md={7}
                lg={9}
                xl={9}
                style={{ alignItems: "center" }}
              >
                <div className="badge-display-justify-content">
                  <p className="Col-text-header-Inform">Information</p>
                  {locationPathName === "/PreviewTemplate" ? null : (
                    <Badge
                      value={props.getInformationMethodProp().status}
                      className="p-mr-2 badge-custom badge-display-justify-content-display-initial "
                      style={{
                        color: "#FFFFFF",
                        background:
                          props.getInformationMethodProp().status ===
                          "Wait for Approve"
                            ? "#282f6a"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Recall"
                            ? "#F8A51C"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Draft"
                            ? "#B4B4B4"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Completed"
                            ? "#28a745"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "New Request"
                            ? "#2769B2"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Rework"
                            ? "#F8A51C"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Cancelled"
                            ? "#dc3545"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Rejected"
                            ? "#dc3545"
                            : null ||
                              props.getInformationMethodProp().status ===
                                "Wait for Comment"
                            ? "#06BEE1"
                            : null,
                      }}
                    ></Badge>
                  )}
                </div>
                <p
                  style={{
                    color: "#B4B4B4",
                    fontSize: "13px",
                    marginBottom: "1px",
                  }}
                >
                  {props.getInformationMethodProp().memoid === 0 &&
                  !props.isCopyProps
                    ? props.getInformationMethodProp().template_code +
                      ": " +
                      props.getInformationMethodProp().template_name
                    : props.getInformationMethodProp().template_name}
                </p>
              </Col>
              <Col xs={12} md={5} lg={3} xl={3}>
                <div className="document-justify-conten">
                  <label
                    className="information-inputTexta-width  information-documentno-justify-conten-margin-bottom "
                    style={{ marginBottom: "17px" }}
                  >
                    {locationPathName === "/PreviewTemplate" ? null : (
                      <Badge
                        value={props.getInformationMethodProp().status}
                        className="p-mr-2 badge-custom badge-display-justify-content-display-none"
                        style={{
                          color: "#FFFFFF",
                          background:
                            props.getInformationMethodProp().status ===
                            "Wait for Approve"
                              ? "#282f6a"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Recall"
                              ? "#F8A51C"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Draft"
                              ? "#B4B4B4"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Completed"
                              ? "#28a745"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "New Request"
                              ? "#2769B2"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Rework"
                              ? "#F8A51C"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Cancelled"
                              ? "#dc3545"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Rejected"
                              ? "#dc3545"
                              : null ||
                                props.getInformationMethodProp().status ===
                                  "Wait for Comment"
                              ? "#06BEE1"
                              : null,
                        }}
                      ></Badge>
                    )}
                  </label>

                  <p
                    className="information-inputTexta-width  information-documentno-justify-conten "
                    style={{ color: "#B4B4B4", fontSize: "13" }}
                  >
                    {locationPathName !== "/PreviewTemplate" && (
                      <> {props.getInformationMethodProp().document_no}</>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12} xl={12}>
                <p className="Col-text-header"></p>
              </Col>
            </Row>

            <>
              <div className="Information-panding-card">
                <Row className="gutter-row-bottom">
                  <Col xs={4} sm={2} xl={2}>
                    <tr>
                      <th>
                        <p
                          id="lbl_Info_RequestDate_EN"
                          className="information-text-header-p"
                        >
                          Request Date
                        </p>
                        <p
                          id="lbl_Info_RequestDate_TH"
                          className="information-text-sub-p"
                        >
                          วันที่ร้องขอเอกสาร
                        </p>
                      </th>
                    </tr>
                  </Col>

                  <Col xs={8} sm={10} xl={6}>
                    <div
                      className="information-inputTexta-width"
                      style={{ color: "#b4b4b4", fontSize: "13px" }}
                    >
                      {formatDateTime(
                        props.getInformationMethodProp().request_date
                      )}
                    </div>
                  </Col>
                </Row>
                <Row className="gutter-row-bottom">
                  <Col xs={12} sm={12} xl={2}>
                    <tr>
                      <th>
                        <div className="label-text-container">
                          <p
                            id="lbl_Info_Company_EN"
                            className="information-text-header-p"
                          >
                            Company
                          </p>
                          <span className="headtext-form text-Is-require">
                            *
                          </span>
                        </div>
                        <p
                          id="lbl_Info_Company_TH"
                          className="information-text-sub-p"
                        >
                          บริษัท
                        </p>
                      </th>
                    </tr>
                  </Col>

                  <Col xs={12} sm={12} xl={4}>
                    <div
                      className="p-inputgroup"
                      style={{
                        height: "38px",
                        width: "100% ",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <InputTextComponents
                        setClassNameProps="information-inputTexta-width-inputText-company"
                        setStyleDivProps={{ flex: "1" }}
                        valueProps={
                          props.getInformationMethodProp().company_name
                        }
                        placeholderProps={"Select"}
                        disabledProps={canEdit}
                        setStyleProps={{
                          height: "38px",
                          width: "100% ",
                          fontSize: "13px",
                        }}
                        onClickProps={showModalCompany}
                        readOnlyProps={true}
                      />
                      <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        onClickProps={showModalCompany}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "38px",
                        }}
                        disabledProps={canEdit}
                      />
                    </div>
                  </Col>
                  {props.isBranchFromADTitle && (
                    <>
                      <Col xs={12} sm={12} xl={2}>
                        <tr>
                          <th>
                            <p
                              id="lbl_Info_Branch_EN"
                              className="information-text-header-p"
                            >
                              Branch
                            </p>
                            <p
                              id="lbl_Info_Branch_TH"
                              className="information-text-sub-p"
                            >
                              สาขา
                            </p>
                          </th>
                        </tr>
                      </Col>

                      <Col
                        xs={12}
                        sm={12}
                        xl={4}
                        onClick={() => {
                          console.log(props.isBranchFromADTitle);
                        }}
                      >
                        <InputTextComponents
                          setStyleProps={{ height: 38 }}
                          setClassNameProps={"information-inputTexta-width"}
                          placeholderProps={""}
                          disabledProps={true}
                          valueProps={props.branchFromADTitle}
                        />
                      </Col>
                    </>
                  )}
                </Row>
                <Row className="gutter-row-bottom gutter-row-Form">
                  <Col xs={12} xl={2}>
                    <tr>
                      <th>
                        <p
                          id="lbl_Info_To_EN"
                          className="information-text-header-p"
                        >
                          To
                        </p>
                        <p
                          id="lbl_Info_To_TH"
                          className="information-text-sub-p"
                        >
                          เรียน
                        </p>
                      </th>
                    </tr>
                  </Col>

                  <Col xs={12} xl={10}>
                    <div
                      className="p-inputgroup "
                      style={{
                        height: `${
                          selectedEmployeeTo.length > 0 ? "100%" : "38px"
                        }`,
                      }}
                    >
                      <AutoComplete
                        value={selectedEmployeeTo}
                        suggestions={filteredEmployeeTo}
                        completeMethod={searchEmployeeTo}
                        field="NameEn"
                        className="information-autoComplete"
                        multiple
                        panelClassName="information-autoComplete-panel"
                        disabled={canEdit}
                        onKeyPress={(e: any) => {
                          if (e.code === "Enter") {
                            searchEmployeeToEnter(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        onChange={(e) => setSelectedEmployeeToFunction(e.value)}
                      />
                      <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        onClickProps={showModal}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "100%",
                        }}
                        disabledProps={canEdit}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="gutter-row-bottom gutter-row-Form">
                  <Col xs={12} xl={2}>
                    <tr>
                      <th>
                        <p
                          id="lbl_Info_CC_EN"
                          className="information-text-header-p"
                        >
                          Cc
                        </p>
                        <p
                          id="lbl_Info_CC_TH"
                          className="information-text-sub-p"
                        >
                          สำเนา
                        </p>
                      </th>
                    </tr>
                  </Col>
                  <Col xs={12} xl={10}>
                    <div
                      className="p-inputgroup  "
                      style={{
                        height: `${
                          selectedEmployeeCc.length > 0 ? "100%" : "38px"
                        }`,
                      }}
                    >
                      <AutoComplete
                        value={selectedEmployeeCc}
                        suggestions={filteredEmployeeCc}
                        completeMethod={searchEmployeeCc}
                        field="NameEn"
                        multiple
                        className="information-autoComplete"
                        panelClassName="information-autoComplete-panel"
                        disabled={canEdit}
                        onKeyPress={(e: any) => {
                          if (e.code === "Enter") {
                            searchEmployeeCcEnter(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        onChange={(e) => setSelectedEmployeeCcFunction(e.value)}
                      />
                      <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        onClickProps={showModalCc}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "100%",
                        }}
                        disabledProps={canEdit}
                      />
                    </div>
                  </Col>
                </Row>
                {!props.isHideProject && (
                  <>
                    {props.getInformationMethodProp().project?.length !== 0 ? (
                      <Row className="gutter-row-bottom">
                        <Col xs={12} sm={12} xl={2}>
                          <tr>
                            <th>
                              <p className="information-text-header-p">
                                Project
                              </p>
                              <p className="information-text-sub-p">โครงการ</p>
                            </th>
                          </tr>
                        </Col>

                        <Col xs={12} sm={12} xl={10}>
                          {props.getInformationMethodProp().memoid !== 0 ? (
                            <Dropdown
                              options={projectData}
                              value={selectProject}
                              onChange={(e) => onChangeSelectProject(e.value)}
                              filter
                              virtualScrollerOptions={{
                                itemSize: 38,
                              }}
                              panelStyle={{ fontSize: "13px" }}
                              optionLabel="ProjectNameWithCode"
                              placeholder={
                                props.getInformationMethodProp().project ==
                                undefined
                                  ? "Select Project"
                                  : props.getInformationMethodProp().project
                                      .length === 0
                                  ? "Select Project"
                                  : props.getInformationMethodProp().project
                              }
                              className="information-inputTexta-width-Button-Company"
                              style={{
                                borderRadius: "6px",
                                height: 38,
                                fontSize: "13px",
                              }}
                              disabled={canEdit}
                            />
                          ) : (
                            <Dropdown
                              options={projectData}
                              value={selectProject}
                              onChange={(e) => onChangeSelectProject(e.value)}
                              filter
                              virtualScrollerOptions={{
                                itemSize: 38,
                              }}
                              panelStyle={{ fontSize: "13px" }}
                              optionLabel="ProjectNameWithCode"
                              placeholder={
                                props.getInformationMethodProp().project ==
                                undefined
                                  ? "Select Project"
                                  : props.getInformationMethodProp().project
                                      .length === 0
                                  ? "Select Project"
                                  : props.getInformationMethodProp().project
                              }
                              className="information-inputTexta-width-Button-Company"
                              style={{
                                borderRadius: "6px",
                                height: 38,
                                fontSize: "13px",
                              }}
                              disabled={canEdit}
                            />
                          )}
                        </Col>
                      </Row>
                    ) : (
                      <>
                        <Row className="gutter-row-bottom">
                          <Col xs={12} sm={12} xl={2}>
                            <tr>
                              <th>
                                <p className="information-text-header-p">
                                  Project
                                </p>
                                <p className="information-text-sub-p">
                                  โครงการ
                                </p>
                              </th>
                            </tr>
                          </Col>

                          <Col xs={12} sm={12} xl={10}>
                            {props.getInformationMethodProp().memoid !== 0 ? (
                              <Dropdown
                                options={projectData}
                                value={selectProject}
                                onChange={(e) => onChangeSelectProject(e.value)}
                                filter
                                virtualScrollerOptions={{
                                  itemSize: 38,
                                }}
                                panelStyle={{ fontSize: "13px" }}
                                optionLabel="ProjectNameWithCode"
                                placeholder={
                                  props.getInformationMethodProp().project ==
                                  undefined
                                    ? "Select Project"
                                    : props.getInformationMethodProp().project
                                        .length === 0
                                    ? "Select Project"
                                    : props.getInformationMethodProp().project
                                }
                                className="information-inputTexta-width-Button-Company"
                                style={{
                                  borderRadius: "6px",
                                  height: 38,
                                  fontSize: "13px",
                                }}
                                disabled={canEdit}
                              />
                            ) : (
                              <Dropdown
                                options={projectData}
                                value={selectProject}
                                onChange={(e) => onChangeSelectProject(e.value)}
                                filter
                                virtualScrollerOptions={{
                                  itemSize: 38,
                                }}
                                panelStyle={{ fontSize: "13px" }}
                                optionLabel="ProjectNameWithCode"
                                placeholder={
                                  props.getInformationMethodProp().project ==
                                  undefined
                                    ? "Select Project"
                                    : props.getInformationMethodProp().project
                                        .length === 0
                                    ? "Select Project"
                                    : props.getInformationMethodProp().project
                                }
                                className="information-inputTexta-width-Button-Company"
                                style={{
                                  borderRadius: "6px",
                                  height: 38,
                                  fontSize: "13px",
                                }}
                                disabled={canEdit}
                              />
                            )}
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                )}

                <Row className="gutter-row-bottom">
                  <Col xs={12} sm={12} xl={2}>
                    <tr>
                      <th>
                        <div className="label-text-container">
                          <p
                            id="lbl_Info_Subject_EN"
                            className="information-text-header-p"
                          >
                            Subject
                          </p>
                          <span className="headtext-form text-Is-require">
                            *
                          </span>
                        </div>
                        <p
                          id="lbl_Info_Subject_TH"
                          className="information-text-sub-p"
                        >
                          เรื่อง
                        </p>
                      </th>
                    </tr>
                  </Col>

                  <Col xs={12} sm={12} xl={10}>
                    {props.getInformationMethodProp().memoid !== 0 ? (
                      <InputTextComponents
                        setClassNameProps="information-inputTexta-width"
                        setStyleProps={{ height: 38, fontSize: "13px" }}
                        onChangeProps={onChangeSubjectMemo}
                        valueProps={subject}
                        disabledProps={canEdit}
                      />
                    ) : (
                      <InputTextComponents
                        setClassNameProps="information-inputTexta-width"
                        setStyleProps={{ height: 38 }}
                        onChangeProps={onChangeSubjectMemo}
                        valueProps={subject}
                        disabledProps={canEdit}
                      />
                    )}
                  </Col>
                </Row>
                {props.requestDetail.listFormName !== undefined &&
                  props.requestDetail.listFormName !== null &&
                  props.requestDetail.listFormName.length !== 0 &&
                  props.requestDetail.listFormName[0].isFormControl && (
                    <Row className="gutter-row-bottom">
                      <Col xs={12} sm={12} xl={2}>
                        <tr>
                          <th>
                            <div className="label-text-container">
                              <p className="information-text-header-p">
                                Select Form Template
                              </p>
                            </div>
                            <p className="information-text-sub-p">
                              เลือกฟอร์มที่ต้องการขออนุมัติ
                            </p>
                          </th>
                        </tr>
                      </Col>

                      <Col xs={12} sm={12} xl={10}>
                        <div style={{ display: "flex" }}>
                          <Dropdown
                            options={searchTemplateListEditing}
                            value={selectFormTemplate}
                            onChange={(e) =>
                              onChangeSelectFormTemplate(e.value)
                            }
                            filter
                            virtualScrollerOptions={{
                              itemSize: 38,
                            }}
                            panelStyle={{
                              fontSize: "13px",
                              justifyContent: "start",
                            }}
                            optionLabel="TemplateNameWithCode"
                            placeholder={
                              selectFormTemplate !== undefined &&
                              selectFormTemplate !== null &&
                              Object.keys(selectFormTemplate).length !== 0
                                ? selectFormTemplate.TemplateNameWithCode
                                : "Select Form Template"
                            }
                            className="information-inputTexta-width-Button-Company"
                            style={{
                              borderRadius: "6px",
                              height: 38,
                              fontSize: "13px",
                              width: "300px",
                            }}
                            disabled={canEdit}
                          />
                          {selectFormTemplate !== undefined &&
                            selectFormTemplate !== null &&
                            Object.keys(selectFormTemplate).length !== 0 && (
                              <div style={{ marginLeft: "31px" }}>
                                <ButtonComponents
                                  setLabelProps="Preview"
                                  setIconProps={
                                    <MdPreview
                                      size={"16px"}
                                      style={{ marginRight: "3px" }}
                                    />
                                  }
                                  onClickProps={previewTemplate}
                                  setStyleProps={{
                                    borderRadius: "6px",
                                    border: "1px solid rgb(40, 47, 106)",
                                    fontSize: "13px",
                                    width: "120px",
                                    height: "32px",
                                  }}
                                  disabledProps={canEdit}
                                />
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                  )}

                {props.refAttibuteProps?.option.length > 0 && (
                  <>
                    {props.refAttibuteProps?.position === "Top" && (
                      <Row className="gutter-row-bottom">
                        <Col xs={12} sm={12} xl={2}>
                          <tr>
                            <th>
                              <div className="label-text-container">
                                <p className="information-text-header-p">
                                  Reference Template
                                </p>
                                {/* <span className="headtext-form text-Is-require">*</span> */}
                              </div>
                              <p className="information-text-sub-p">
                                เอกสารอ้างอิง
                              </p>
                            </th>
                          </tr>
                        </Col>
                        <Col xs={12} sm={12} xl={10} className={"col-row-gap"}>
                          {!canEdit && (
                            <Row>
                              <Col xs={12} sm={12} xl={10}>
                                <ButtonComponents
                                  setIconProps={"pi pi-plus"}
                                  setClassNameProps={"p-button-text-position"}
                                  onClickProps={showModalRefTemp}
                                  setLabelProps={"Add"}
                                  setStyleProps={{
                                    backgroundColor: "#282f6a",
                                    border: "1px solid #282f6a",
                                    borderTopRightRadius: "6px",
                                    borderBottomRightRadius: "6px",
                                    boxShadow: "none",
                                    height: "38px",
                                  }}
                                  disabledProps={canEdit}
                                />
                              </Col>
                            </Row>
                          )}

                          <Row>
                            <Col xs={12} sm={12} xl={12}>
                              <DataTable
                                className="wolf-table"
                                stripedRows
                                value={refTempSelected}
                                scrollable
                                scrollHeight="400px"
                                rowHover
                                rowClassName={rowClassName}
                                onRowClick={(rowData: any) => {
                                  const urlElelement: any =
                                    window.location.href.split("/");
                                  const url = urlElelement[2];

                                  window.open(
                                    `https://${url}/Request?MemoID=${rowData.data.MemoId}`,
                                    "_blank",
                                    "noreferrer"
                                  );
                                }}
                                size="small"
                                rows={5}
                              >
                                <Column
                                  header="#"
                                  body={(refTempSelected, options) =>
                                    options.rowIndex + 1
                                  }
                                  style={{ flexGrow: 0, flexBasis: "50px" }}
                                />
                                {props.refAttibuteProps?.optionLabel ===
                                "เลขที่เอกสาร" ? (
                                  <Column
                                    field="เลขที่เอกสาร"
                                    header={
                                      <tr>
                                        <th>
                                          <p className="row headtext">
                                            เลขที่เอกสาร
                                          </p>
                                        </th>
                                      </tr>
                                    }
                                    sortable
                                  ></Column>
                                ) : (
                                  <Column
                                    field="DocumentNo"
                                    header={
                                      <tr>
                                        <th>
                                          <p className="row headtext">
                                            Document No.
                                          </p>
                                          <p className="row subtext">
                                            รหัสเอกสาร
                                          </p>
                                        </th>
                                      </tr>
                                    }
                                    sortable
                                  ></Column>
                                )}
                                <Column
                                  field="TemplateName"
                                  header={
                                    <tr>
                                      <th>
                                        <p className="row headtext">
                                          Form Template
                                        </p>
                                        <p className="row subtext">
                                          ชื่อเอกสาร
                                        </p>
                                      </th>
                                    </tr>
                                  }
                                ></Column>
                                <Column
                                  field="MemoSubject"
                                  header={
                                    <tr>
                                      <th>
                                        <p className="row headtext">Subject</p>
                                        <p className="row subtext">
                                          หัวข้อเอกสาร
                                        </p>
                                      </th>
                                    </tr>
                                  }
                                ></Column>
                              </DataTable>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
                {props.leaveTypeTable.length !== 0 &&
                  props.checkTypeLeave === true && (
                    <LeaveTypeComponents
                      leaveTypeTable={props.leaveTypeTable}
                    />
                  )}

                {treeTemplate !== undefined && (
                  <>
                    {props.requestDetail !== undefined && (
                      <>
                        {props.isTextFromValue === true && (
                          <>
                            <TinyMceComponent
                              setTextFromValue={props.setTextFromValue}
                              textFromValue={props.textFromValue}
                            />
                          </>
                        )}
                        {props.isTextFromValue === false && (
                          <>
                            <CoreControllerComponent
                              listLogicData={props.listLogicData}
                              setListLogicData={props.setListLogicData}
                              logic={props.logic}
                              setRequestDetail={props.setRequestDetail}
                              requestDetail={props.requestDetail}
                              showControl={props.showControl}
                              setShowControl={props.setShowControl}
                              selectedView={props.selectedView}
                              isInitialLogic={props.isInitialLogic}
                              setIsInitialLogic={props.setIsInitialLogic}
                              coreRender={coreRender}
                              setCoreRender={setCoreRender}
                              statusMemoDetail={canEdit}
                              templateID={
                                props.getInformationMethodProp().template_id
                              }
                              setLineApporve={props.setLineApporve}
                              formTemplate={treeTemplate}
                              getInformationMethodProp={getInformation}
                              errorResult={props.errorResult}
                              errorTable={props.errorTable}
                              setInformationMethodProp={(e: any) =>
                                props.setInformationMethodProp(e)
                              }
                              getInformationTemplateProp={
                                props.getInformationTemplateProp
                              }
                              onLoading={props.onLoading}
                              setOnLoading={props.setOnLoading}
                              setSummary={props.setSummary}
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

                {props.refAttibuteProps?.option.length > 0 && (
                  <>
                    {props.refAttibuteProps?.position === "Bottom" && (
                      <Row className="gutter-row-bottom">
                        <Col xs={12} sm={12} xl={2}>
                          <tr>
                            <th>
                              <div className="label-text-container">
                                <p className="information-text-header-p">
                                  Reference Template
                                </p>
                                {/* <span className="headtext-form text-Is-require">*</span> */}
                              </div>
                              <p className="information-text-sub-p">
                                เอกสารอ้าง
                              </p>
                            </th>
                          </tr>
                        </Col>
                        <Col xs={12} sm={12} xl={10} className={"col-row-gap"}>
                          {!canEdit && (
                            <Row>
                              <Col xs={12} sm={12} xl={10}>
                                <ButtonComponents
                                  setIconProps={"pi pi-plus"}
                                  setClassNameProps={"p-button-text-position"}
                                  onClickProps={showModalRefTemp}
                                  setLabelProps={"Add"}
                                  setStyleProps={{
                                    backgroundColor: "#282f6a",
                                    border: "1px solid #282f6a",
                                    borderTopRightRadius: "6px",
                                    borderBottomRightRadius: "6px",
                                    boxShadow: "none",
                                    height: "38px",
                                  }}
                                  disabledProps={canEdit}
                                />
                              </Col>
                            </Row>
                          )}

                          <Row>
                            <Col xs={12} sm={12} xl={12}>
                              <DataTable
                                className="wolf-table"
                                stripedRows
                                value={refTempSelected}
                                scrollable
                                scrollHeight="400px"
                                size="small"
                                rows={5}
                              >
                                <Column
                                  header="#"
                                  body={(refTempSelected, options) =>
                                    options.rowIndex + 1
                                  }
                                  style={{ flexGrow: 0, flexBasis: "50px" }}
                                />
                                {props.refAttibuteProps?.optionLabel ===
                                "เลขที่เอกสาร" ? (
                                  <Column
                                    field="เลขที่เอกสาร"
                                    header={
                                      <tr>
                                        <th>
                                          <p className="row headtext">
                                            เลขที่เอกสาร
                                          </p>
                                        </th>
                                      </tr>
                                    }
                                    sortable
                                  ></Column>
                                ) : (
                                  <Column
                                    field="DocumentNo"
                                    header={
                                      <tr>
                                        <th>
                                          <p className="row headtext">
                                            Document No.
                                          </p>
                                          <p className="row subtext">
                                            รหัสเอกสาร
                                          </p>
                                        </th>
                                      </tr>
                                    }
                                    sortable
                                  ></Column>
                                )}
                                <Column
                                  field="TemplateName"
                                  header={
                                    <tr>
                                      <th>
                                        <p className="row headtext">
                                          Form Template
                                        </p>
                                        <p className="row subtext">
                                          ชื่อเอกสาร
                                        </p>
                                      </th>
                                    </tr>
                                  }
                                ></Column>
                                <Column
                                  field="MemoSubject"
                                  header={
                                    <tr>
                                      <th>
                                        <p className="row headtext">Subject</p>
                                        <p className="row subtext">
                                          หัวข้อเอกสาร
                                        </p>
                                      </th>
                                    </tr>
                                  }
                                ></Column>
                              </DataTable>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </div>
            </>
          </>

          <Dialog
            header={renderHeader}
            visible={isDialogVisible}
            style={{ width: "60vw", borderRadius: "16px" }}
            onHide={showModal}
            className="information-dialog"
            dismissableMask
            draggable={false}
            resizable={false}
            closable={false}
          >
            <DataTable
              paginator
              rows={5}
              value={searchData}
              selectionMode="single"
              tableStyle={{
                border: "1px solid #e6e6e6",
                outlineColor: "#e6e6e6",
              }}
              dataKey="id"
              responsiveLayout="scroll"
              onRowSelect={onRowSelect}
              sortField="EmployeeCode"
              sortOrder={1}
            >
              {/* <Column
            field="EmployeeCode"
            header={
              <tr>
                <th>
                  <p className="row headtext">EmployeeCode</p>
                  <p className="row subtext">รหัสพนักงาน</p>
                </th>
              </tr>
            }
            sortable
          ></Column>
          <Column
            field={empData.employeeData.Lang == "EN" ? "NameEn" : "NameTh"}
            header={
              <tr>
                <th>
                  <p className="row headtext">Name</p>
                  <p className="row subtext">ชื่อ</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="PositionNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Position</p>
                  <p className="row subtext">ตำแหน่ง</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="DepartmentNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Department</p>
                  <p className="row subtext">หน่วยงาน</p>
                </th>
              </tr>
            }
          ></Column> */}
              {dynamicColumns}
            </DataTable>
          </Dialog>

          <Dialog
            header={renderHeaderCc}
            visible={isDialogVisibleCc}
            style={{ width: "60vw", borderRadius: "16px" }}
            onHide={showModalCc}
            className="information-dialog"
            dismissableMask
            draggable={false}
            resizable={false}
            closable={false}
          >
            <DataTable
              paginator
              rows={5}
              value={searchDataCc}
              selectionMode="single"
              tableStyle={{
                border: "1px solid #e6e6e6",
                outlineColor: "#e6e6e6",
              }}
              dataKey="id"
              responsiveLayout="scroll"
              onRowSelect={onRowSelectCc}
              sortField="EmployeeCode"
              sortOrder={1}
            >
              {/* <Column
            field="EmployeeCode"
            header={
              <tr>
                <th>
                  <p className="row headtext">EmployeeCode</p>
                  <p className="row subtext">รหัสพนักงาน</p>
                </th>
              </tr>
            }
            sortable
          ></Column>
          <Column
            field={empData.employeeData.Lang == "EN" ? "NameEn" : "NameTh"}
            header={
              <tr>
                <th>
                  <p className="row headtext">Name</p>
                  <p className="row subtext">ชื่อ</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="PositionNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Position</p>
                  <p className="row subtext">ตำแหน่ง</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="DepartmentNameEn"
            header={
              <tr>
                <th>
                  <p className="row headtext">Department</p>
                  <p className="row subtext">หน่วยงาน</p>
                </th>
              </tr>
            }
          ></Column> */}
              {dynamicColumns}
            </DataTable>
          </Dialog>
          {companyList.length !== 0 && (
            <Dialog
              header={renderHeaderCompany}
              visible={isDialogVisibleCompany}
              style={{ width: "60vw", borderRadius: "16px" }}
              onHide={showModalCompany}
              dismissableMask
              className="information-dialog"
              draggable={false}
              resizable={false}
              closable={false}
            >
              <DataTable
                paginator
                rows={5}
                value={searchCompanyData}
                selectionMode="single"
                dataKey="id"
                responsiveLayout="scroll"
                tableStyle={{
                  border: "1px solid #e6e6e6",
                  outlineColor: "#e6e6e6",
                }}
                className=""
                onRowSelect={onRowSelectCompany}
                sortField="CompanyCode"
                sortOrder={1}
              >
                <Column
                  field="CompanyCode"
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">CompanyCode</p>
                        <p className="row subtext">รหัสบริษัท</p>
                      </th>
                    </tr>
                  }
                  sortable
                  style={{ width: "10%" }}
                ></Column>
                <Column
                  field={
                    empData.employeeData.Lang == "EN" ? "NameEn" : "NameTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Name</p>
                        <p className="row subtext">ชื่อ</p>
                      </th>
                    </tr>
                  }
                  style={{ width: "20%" }}
                ></Column>
                <Column
                  field={
                    empData.employeeData.Lang === "EN"
                      ? "AddressEn"
                      : "AddressTh"
                  }
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Address</p>
                        <p className="row subtext">ที่อยู่</p>
                      </th>
                    </tr>
                  }
                  style={{ width: "30%" }}
                ></Column>
              </DataTable>
            </Dialog>
          )}

          <Dialog
            header={renderHeaderReftemp}
            visible={isDialogVisibleRefTemp}
            style={{ width: "60vw", borderRadius: "16px" }}
            onShow={() => {
              setGlobalFilterRefTempValue("");
            }}
            onHide={showModalRefTemp}
            dismissableMask
            className="information-dialog"
            draggable={false}
            resizable={false}
          >
            <DataTable
              paginator
              rows={5}
              value={searchRefDocData}
              selection={refTempSelected}
              onSelectionChange={(e: any) => {
                if (Array.isArray(e.value)) {
                  setRefTempSelected([...e.value]);
                  onChanceRef(e.value);
                } else {
                  let val: any[] = [];
                  val.push(e.value);
                  setRefTempSelected([...val]);
                  onChanceRef(val);
                }
              }}
              selectionMode={
                props.refAttibuteProps?.mode === "Single"
                  ? "radiobutton"
                  : "checkbox"
              }
              dataKey="DocumentNo"
              responsiveLayout="scroll"
              tableStyle={{
                border: "1px solid #e6e6e6",
                outlineColor: "#e6e6e6",
              }}
              sortField="DocumentNo"
              sortOrder={1}
            >
              <Column
                selectionMode={
                  props.refAttibuteProps?.mode === "Single"
                    ? "single"
                    : "multiple"
                }
              ></Column>
              {props.refAttibuteProps?.optionLabel !==
              "Information DocumentNo" ? (
                <Column
                  field={props.refAttibuteProps?.optionLabel}
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">
                          {props.refAttibuteProps?.optionLabel}
                        </p>
                      </th>
                    </tr>
                  }
                  sortable
                ></Column>
              ) : (
                <Column
                  field="DocumentNo"
                  header={
                    <tr>
                      <th>
                        <p className="row headtext">Document No.</p>
                        <p className="row subtext">รหัสเอกสาร</p>
                      </th>
                    </tr>
                  }
                  sortable
                ></Column>
              )}

              <Column
                field="TemplateName"
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Form Template</p>
                      <p className="row subtext">ชื่อเอกสาร</p>
                    </th>
                  </tr>
                }
              ></Column>
              <Column
                field="MemoSubject"
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Subject</p>
                      <p className="row subtext">หัวข้อเอกสาร</p>
                    </th>
                  </tr>
                }
              ></Column>
            </DataTable>
          </Dialog>
        </div>
      )}
    </>
  );
};
