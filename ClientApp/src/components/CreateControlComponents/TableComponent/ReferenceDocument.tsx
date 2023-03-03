import { Spin } from "antd";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { ReportTemplateSelectByReportID } from "../../../Services/ReportService";
import {
  GetAllByCreateTemplate,
  GetAllTemplate,
  GetTemplateByDocTypeCode,
  GetTemplateByIdDto,
  ReportTemplateList,
} from "../../../Services/TemplateService";
import "./TableCreateComponents.css";
interface Props {
  attributeColumn: any;
  setAttributeColumn: any;
  setMergeColumnRefDoc: any;
  mergeColumnRefDoc: any;
  control: any;
  template: any;
  setDocDataSource: any;
  docDataSource: any;
  setSelectedReportRef: any;
  selectedReportRef: any;
  setSelectedTemplateRef: any;
  selectedTemplateRef: any;
  setConditions: any;
  conditions: any;
  advanceForm: any;
  setSelectedDocControlTemplate: any;
  selectedDocControlTemplate: any;
  setDefaultConfigColumn: any;
  defaultConfigColumn: any;
}

export default function ReferenceDocument(props: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleDocControl, setVisibleDocControl] = useState<boolean>(false);
  const dataRequest = {
    enabledpopupdefdoc:
      props.template.attribute?.enabledpopupdefdoc === "Y" ? true : false,
    doccontrol:
      props.template.attribute?.refdoc?.doccontrol === true ? true : false,
  };

  const itemsType = [{ name: "Template" }, { name: "Report" }];

  const itemsControlLabel = [
    { RefDocLabel: "Document No", value: "DocumentNo" },
    { RefDocLabel: "Document Amount", value: "DocumentAmount" },
    { RefDocLabel: "Creator Employee Code", value: "CreatorEmployeeCode" },
    { RefDocLabel: "Creator Employee Name", value: "CreatorEmployeeName" },
    {
      RefDocLabel: "Creator Employee Position",
      value: "CreatorEmployeePosition",
    },
    {
      RefDocLabel: "Creator Employee Division",
      value: "CreatorEmployeeDivision",
    },
    {
      RefDocLabel: "Creator Employee Department",
      value: "CreatorEmployeeDepartment",
    },
    { RefDocLabel: "Creator Employee Email", value: "CreatorEmployeeEmail" },
    {
      RefDocLabel: "Requestor Employee Code",
      value: "RequestorEmployeeCode",
    },
    {
      RefDocLabel: "Requestor Employee Name",
      value: "RequestorEmployeeName",
    },
    {
      RefDocLabel: "Requestor Employee Position",
      value: "RequestorEmployeePosition",
    },
    {
      RefDocLabel: "Requestor Employee Division",
      value: "RequestorEmployeeDivision",
    },
    {
      RefDocLabel: "Requestor Employee Department",
      value: "RequestorEmployeeDepartment",
    },
    {
      RefDocLabel: "Requestor Employee Email",
      value: "RequestorEmployeeEmail",
    },
    {
      RefDocLabel: "Information Document Status",
      value: "InformationDocumentStatus",
    },
    {
      RefDocLabel: "Information Form Category",
      value: "InformationFormCategory",
    },
    { RefDocLabel: "Information Form Name", value: "InformationFormName" },
    {
      RefDocLabel: "Information RequestDate",
      value: "InformationRequestDate",
    },
    { RefDocLabel: "Information Company", value: "InformationCompany" },
    { RefDocLabel: "Information Branch", value: "InformationBranch" },
    { RefDocLabel: "Information Subject", value: "InformationSubject" },
    { RefDocLabel: "Information Project", value: "InformationProject" },
  ];

  const itemsConditionList = [
    { name: "ใต้สังกัด", value: "under" },
    { name: "ค่าคงที่", value: "fixed value" },
  ];

  const conditionRefDoc: any = {
    label: "",
    conditionType: "under",
    value: "",
  };
  const [defaultValueRefDoc, setDefaultValueRefDoc] = useState<any>();
  const [defaultValueRefDoc2, setDefaultValueRefDoc2] = useState<any>();

  const [defaultValueReport, setDefaultValueReport] = useState<any>([]);
  const [checkAction, setCheckAction] = useState<string>();
  const [actionSubmit, setActionSubmit] = useState<boolean>();
  const [defaultValue, setDefaultValue] = useState<any>([]);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (props.advanceForm.items?.length >= 1) {
      let array: any = [];
      props.advanceForm.items.map((_data: any, index: number) => {
        _data.layout.map((_dataLayout: any, index: number) => {
          if (_dataLayout.template.label != undefined) {
            {
              array.push({
                item: _dataLayout.template.label,
                value: _dataLayout.template.label,
              });
            }
          }
        });
      });
      setDefaultValue([...array]);
    }
  }, []);

  useEffect(() => {
    async function fetchMyAPI() {
      setLoading(true);
      await fetchDataTemplate();
      await defaultValueDropDown();
      await defaultValueDocControl();
      setLoading(false);
    }
    fetchMyAPI();
  }, []);
  function defaultValueDocControl() {
    if (dataRequest.doccontrol) {
      setVisibleDocControl(true);
    }
  }
  function defaultValueDropDown() {
    if (props?.mergeColumnRefDoc?.columnRefDoc?.length >= 1) {
      let array: any = [];
      let array2: any = [];
      props.attributeColumn.column.map((_data: any, idx: any) => {
        array.push({
          ColumnLabel: _data.label,
        });
      });
      props?.mergeColumnRefDoc?.columnRefDoc.map((_data: any, idx: any) => {
        array2.push({
          RefDocLabel: _data.RefDocLabel,
        });
      });
      let arr3 = array.map((item: any, i: number) =>
        Object.assign({}, item, array2[i])
      );

      props.setMergeColumnRefDoc((prevState: any) => ({
        ...prevState,
        columnRefDoc: [...arr3],
      }));
    } else {
      let array: any = [];
      props.attributeColumn.column.map((_data: any, idx: any) => {
        array.push({
          ColumnLabel: _data.label,
          RefDocLabel: "",
        });
      });
      props.setMergeColumnRefDoc((prevState: any) => ({
        ...prevState,
        columnRefDoc: [...array],
      }));
    }
  }
  useEffect(() => {
    fetchDataTemplateById();
  }, [props.selectedReportRef]);
  useEffect(() => {
    newValueAlterSelected();
  }, [actionSubmit]);
  useEffect(() => {
    setValueConfigColumnTable();
  }, [props.selectedTemplateRef]);

  const setValueConfigColumnTable = async () => {
    let mapper: any = [];
    if (
      props.docDataSource.docDataSource === "Report" &&
      props.selectedReportRef?.docReport?.ReportTemplateId
    ) {
      let array: any[] = [];
      const reportId = parseInt(
        props.selectedReportRef?.docReport?.ReportTemplateId
      );
      const response = await ReportTemplateSelectByReportID(reportId);
      let selectedFieldList = response.Selectedfieldlist;
      for (let i = 0; i < selectedFieldList?.length; i++) {
        const element = selectedFieldList[i];
        array.push({
          value: element.key,
          RefDocLabel: element.label,
        });
      }
      const _data = itemsControlLabel;
      Array.prototype.push.apply(_data, array);
      props.setDefaultConfigColumn([..._data]);
    } else if (
      props.selectedTemplateRef?.docref?.length > 0 &&
      props.docDataSource.docDataSource === "Template"
    ) {
      props.selectedTemplateRef?.docref?.map((item: any, index: number) => {
        if (item?.AdvanceForm) {
          mapper.push({
            AdvanceForm: JSON.parse(item?.AdvanceForm),
            DocumentCode: item.DocumentCode,
          });
        }
      });
      let array: any = [];
      mapper.map((item: any, i: number) => {
        item.AdvanceForm.items.map((_data: any, j: number) => {
          _data.layout.map((_dataLayout: any, k: number) => {
            if (_dataLayout.template.label) {
              array.push({
                value: item.DocumentCode + "_" + _dataLayout.template.label,
                RefDocLabel:
                  item.DocumentCode + "_" + _dataLayout.template.label,
              });
            }
          });
        });
      });
      const _data = itemsControlLabel;
      Array.prototype.push.apply(_data, array);
      props.setDefaultConfigColumn([..._data]);
    } else {
      const _data = itemsControlLabel;
      props.setDefaultConfigColumn([..._data]);
      defaultConfigColumn();
    }
  };
  function defaultConfigColumn() {
    let array: any = [];
    props.attributeColumn.column.map((_data: any, idx: any) => {
      array.push({
        ColumnLabel: _data.label,
        RefDocLabel: "",
      });
    });
    props.setMergeColumnRefDoc((prevState: any) => ({
      ...prevState,
      columnRefDoc: [...array],
    }));
  }
  async function newValueAlterSelected() {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      props.setSelectedReportRef([]);
      props.setSelectedTemplateRef([]);
    }
  }
  async function fetchDataTemplateById() {
    if (checkAction === "2") {
      let _dataTemplate: any[] = [];
      const templateCode = props.selectedReportRef?.docReport?.TemplateId;
      const arrayCode = templateCode?.split("|");
      const _response = defaultValueRefDoc2?.filter((item: any) =>
        arrayCode?.includes(item?.DocumentCode)
      );
      const _response2 = _response?.filter((item: any) => {
        return item.IsActive === true;
      });
      if (_response2) {
        _dataTemplate.push(..._response2);
      } else {
        _dataTemplate.push();
      }
      setDefaultValueRefDoc([..._dataTemplate]);
      const _data = itemsControlLabel;
      props.setDefaultConfigColumn([..._data]);
    }
  }
  async function fetchDataTemplate() {
    if (
      !props.docDataSource.docDataSource ||
      typeof props.docDataSource.docDataSource === "object"
    ) {
      props.setDocDataSource((prevState: any) => ({
        ...prevState,
        docDataSource: "Template",
      }));
    }
    let _dataTemplate = await GetAllByCreateTemplate();
    let _dataReportTemplate = await ReportTemplateList();
    setDefaultValueRefDoc([..._dataTemplate]);
    setDefaultValueRefDoc2([..._dataTemplate]);
    console.log(_dataReportTemplate, "_dataReportTemplate");
    setDefaultValueReport([..._dataReportTemplate]);
    props.setDefaultConfigColumn([...itemsControlLabel]);
  }

  function deleteCondition(idx: any) {
    let _condition = props.conditions.conditionrefdoc;
    _condition.splice(idx, 1);
    props.setConditions((prevState: any) => ({
      ...prevState,
      conditionrefdoc: [..._condition],
    }));
  }
  async function selectedReportById(idReport: number) {
    if (idReport) {
      let arrayReport: any[] = [];
      const response = await ReportTemplateSelectByReportID(idReport);
      let selectedFieldList = response.Selectedfieldlist;
      for (let i = 0; i < selectedFieldList.length; i++) {
        const element = selectedFieldList[i];
        arrayReport.push({
          value: element.key,
          RefDocLabel: element.label,
        });
      }
      const _data = itemsControlLabel;
      Array.prototype.push.apply(_data, arrayReport);
      props.setDefaultConfigColumn([..._data]);
      let arrayMerge: any = [];
      props.attributeColumn.column.map((_data: any, idx: any) => {
        arrayMerge.push({
          ColumnLabel: _data.label,
          RefDocLabel: "",
        });
      });
      props.setMergeColumnRefDoc((prevState: any) => ({
        ...prevState,
        columnRefDoc: [...arrayMerge],
      }));
    }
  }
  function renderIsDocControl() {
    return (
      <>
        <div
          className="row set-margin-in-row-add-control"
          onClick={() => {
            console.log(props.selectedDocControlTemplate);
          }}
        >
          <div className="col-lg-4">
            <tr>
              <th>
                <div className="label-text-container">
                  <span className="headtext-form">Template New Doc</span>
                </div>
                <p className="subtext-form">ฟอร์มสร้างใหม่</p>
              </th>
            </tr>
          </div>
          <div className="col-lg-8">
            <MultiSelect
              style={{ width: "100%", fontSize: "13px" }}
              value={props.selectedDocControlTemplate.docNewDoc}
              options={defaultValueRefDoc}
              onChange={(e: { value: any }) => {
                props.setSelectedDocControlTemplate((prevState: any) => ({
                  ...prevState,
                  docNewDoc: e.value,
                }));
              }}
              optionLabel="TemplateName"
              placeholder="--Please Select--"
              filter
              showClear
              className="multiselect-custom set-css-multi-select set-padding-item"
              optionGroupChildren="TemplateId"
            ></MultiSelect>
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-lg-4">
            <tr>
              <th>
                <div className="label-text-container">
                  <span className="headtext-form">Template Edit Doc</span>
                </div>
                <p className="subtext-form">ฟอร์มแก้ไข</p>
              </th>
            </tr>
          </div>
          <div className="col-lg-8">
            <MultiSelect
              style={{ width: "100%", fontSize: "13px" }}
              value={props.selectedDocControlTemplate.docEditDoc}
              options={defaultValueRefDoc}
              onChange={(e: { value: any }) => {
                props.setSelectedDocControlTemplate((prevState: any) => ({
                  ...prevState,
                  docEditDoc: e.value,
                }));
              }}
              optionLabel="TemplateName"
              placeholder="--Please Select--"
              filter
              showClear
              className="multiselect-custom set-css-multi-select set-padding-item"
              optionGroupChildren="TemplateId"
            ></MultiSelect>
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-lg-4">
            <tr>
              <th>
                <div className="label-text-container">
                  <span className="headtext-form">Template Cancel Doc</span>
                </div>
                <p className="subtext-form">ฟอร์มยกเลิก</p>
              </th>
            </tr>
          </div>
          <div className="col-lg-8">
            <MultiSelect
              style={{ width: "100%", fontSize: "13px" }}
              value={props.selectedDocControlTemplate.docCancelDoc}
              options={defaultValueRefDoc}
              onChange={(e: { value: any }) => {
                props.setSelectedDocControlTemplate((prevState: any) => ({
                  ...prevState,
                  docCancelDoc: e.value,
                }));
              }}
              optionLabel="TemplateName"
              placeholder="--Please Select--"
              filter
              showClear
              className="multiselect-custom set-css-multi-select set-padding-item"
              optionGroupChildren="TemplateId"
            ></MultiSelect>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Spin
        className="loadingggggggggg"
        tip="Loading..."
        style={{ paddingTop: "15rem" }}
        spinning={loading}
      >
        {!loading && (
          <div
            className="set-layout-ref-css-card set-css-layout-table-condition-css-padding"
            onClick={() =>
              console.log(
                props.defaultConfigColumn,
                "ee",
                props.mergeColumnRefDoc
              )
            }
          >
            <div className="row set-margin-in-row-add-control">
              <div className="col-lg-2">
                <tr>
                  <th>
                    <div className="label-text-container">
                      <span className="headtext-form">Data source</span>
                    </div>
                    <p className="subtext-form">ประเภทข้อมูล</p>
                  </th>
                </tr>
              </div>
              <div className="col-lg-10">
                {itemsType.map((items: any) => {
                  return (
                    <div key={items.name} className="radio-color">
                      <RadioButton
                        inputId={items.name}
                        name="name"
                        value={items}
                        onChange={(e) => {
                          props.setDocDataSource((prevState: any) => ({
                            ...prevState,
                            docDataSource: e.value.name,
                          }));
                          setActionSubmit(!actionSubmit);
                          setCheckAction("1");
                          if (
                            e.value.name !== props.docDataSource.docDataSource
                          ) {
                            if (e.value.name === "Template") {
                              setDefaultValueRefDoc([...defaultValueRefDoc2]);
                            } else if (e.value.name === "Report") {
                              setDefaultValueRefDoc([]);
                            }
                            const _data = itemsControlLabel;
                            props.setDefaultConfigColumn([..._data]);
                          }
                          defaultConfigColumn();
                        }}
                        checked={
                          items.name === props.docDataSource.docDataSource
                        }
                      />
                      <label className="set-text-check-box-create-control">
                        {items.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            {props.docDataSource.docDataSource === "Template" && (
              <div className="row set-margin-in-row-add-control">
                <div className="col-lg-4">
                  <tr>
                    <th>
                      <div className="label-text-container">
                        <span className="headtext-form">
                          Template Reference Document
                        </span>
                      </div>
                      <p className="subtext-form">เอกสารอ้างอิง</p>
                    </th>
                  </tr>
                </div>
                <div className="col-lg-8">
                  <MultiSelect
                    style={{ width: "100%", fontSize: "13px" }}
                    value={props.selectedTemplateRef.docref}
                    options={defaultValueRefDoc}
                    onChange={(e: { value: any }) => {
                      props.setSelectedTemplateRef((prevState: any) => ({
                        ...prevState,
                        docref: e.value,
                      }));
                    }}
                    optionLabel="TemplateName"
                    placeholder="--Please Select--"
                    filter
                    showClear
                    className="multiselect-custom set-css-multi-select set-padding-item"
                    optionGroupChildren="TemplateId"
                  ></MultiSelect>
                </div>
              </div>
            )}
            {props.docDataSource.docDataSource === "Template" && (
              <div className="row">
                <div className="col-lg-4">
                  <div className="row set-margin-in-row-add-control">
                    <div className="col-lg-6">
                      <tr>
                        <th>
                          <div className="label-text-container">
                            <span className="headtext-form">Is DocControl</span>
                          </div>
                          <p className="subtext-form">เอกสารควบคุม</p>
                        </th>
                      </tr>
                    </div>
                    <div className="col-lg-6">
                      <div>
                        <Controller
                          name="doccontrol"
                          control={props.control}
                          defaultValue={dataRequest.doccontrol}
                          render={({ field, fieldState }) => (
                            <div
                              className={"set-layout-check-box-create-control"}
                            >
                              <>
                                <Checkbox
                                  className="set-css-checkbox-in-create-control"
                                  inputId={field.name}
                                  onChange={(e) => {
                                    field.onChange(e.checked);
                                    setVisibleDocControl(!visibleDocControl);
                                  }}
                                  checked={field.value}
                                />
                                <span className="set-text-check-box-create-control">
                                  Yes
                                </span>
                              </>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  {visibleDocControl && renderIsDocControl()}
                </div>
              </div>
            )}

            {props.docDataSource.docDataSource === "Report" && (
              <div className="row set-margin-in-row-add-control">
                <div className="col-lg-4">
                  <tr>
                    <th>
                      <div className="label-text-container">
                        <span className="headtext-form">
                          Report Reference Document
                        </span>
                      </div>
                      <p className="subtext-form">รายงานอ้างอิง</p>
                    </th>
                  </tr>
                </div>
                <div className="col-lg-8">
                  <Dropdown
                    filter
                    style={{
                      width: "100%",
                      paddingLeft: "1.1rem",
                      fontSize: "13px",
                      borderRadius: "6px",
                      height: "38px",
                    }}
                    value={props.selectedReportRef?.docReport}
                    options={defaultValueReport}
                    onChange={(e: { value: any }) => {
                      setCheckAction("2");
                      props.setSelectedReportRef((prevState: any) => ({
                        ...prevState,
                        docReport: e.value,
                      }));
                      props.setSelectedTemplateRef([]);
                      selectedReportById(e.value?.ReportTemplateId);
                    }}
                    optionLabel="ReportName"
                    placeholder="--Please Select--"
                    filterBy="ReportName"
                    showClear
                    className="multiselect-custom set-css-multi-select set-padding-item"
                  />
                </div>
              </div>
            )}
            <div className="row set-margin-in-row-add-control">
              <div className="col-lg-12">
                <tr>
                  <th>
                    <div className="label-text-container">
                      <span className="headtext-form">
                        Display popup Reference Document add row in table
                      </span>
                    </div>
                  </th>
                </tr>
              </div>
            </div>
            <div className="row set-margin-in-row-add-control">
              <div className="col-lg-2">
                <tr>
                  <th>
                    <div className="label-text-container">
                      <span className="headtext-form">Enabled</span>
                    </div>
                  </th>
                </tr>
              </div>
              <div className="col-lg-10">
                <div className="display-flex-css">
                  <Controller
                    name="enabledpopupdefdoc"
                    control={props.control}
                    defaultValue={dataRequest.enabledpopupdefdoc}
                    render={({ field, fieldState }) => (
                      <div className={"set-layout-check-box-create-control"}>
                        <>
                          <Checkbox
                            className="set-css-checkbox-in-create-control"
                            inputId={field.name}
                            onChange={(e) => {
                              field.onChange(e.checked);
                            }}
                            checked={field.value}
                          />
                          <span className="set-text-check-box-create-control">
                            Yes
                          </span>
                        </>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            {props.mergeColumnRefDoc?.columnRefDoc?.length !== 0 && (
              <>
                <div className="row">
                  <div className="col-lg-12">
                    <tr>
                      <th>
                        <div className="label-text-container">
                          <span className="headtext-form">Config Column</span>
                        </div>
                      </th>
                    </tr>
                  </div>
                </div>
                <div className="set-layout-create-control-config-column">
                  {props.mergeColumnRefDoc?.columnRefDoc?.map(
                    (_data: any, idx: any) => (
                      <>
                        <div className="row set-margin-in-row-add-control">
                          <div className="col-lg-2">
                            <tr>
                              <th>
                                <div className="label-text-container">
                                  <span className="headtext-form">
                                    {_data.ColumnLabel}
                                  </span>
                                </div>
                              </th>
                            </tr>
                          </div>
                          <div className="col-lg-10">
                            <Dropdown
                              style={{ width: "100%" }}
                              value={
                                props.mergeColumnRefDoc.columnRefDoc[idx]
                                  .RefDocLabel
                              }
                              options={props.defaultConfigColumn}
                              onChange={(e: { value: any }) => {
                                props.setMergeColumnRefDoc(
                                  (prevState: any) => ({
                                    ...prevState,
                                    columnRefDoc:
                                      props.mergeColumnRefDoc.columnRefDoc.map(
                                        (_val: { ColumnLabel: any }) => {
                                          return _val.ColumnLabel ===
                                            _data.ColumnLabel
                                            ? {
                                                ColumnLabel: _val.ColumnLabel,
                                                RefDocLabel: e.value,
                                              }
                                            : _val;
                                        }
                                      ),
                                  })
                                );
                              }}
                              optionLabel="RefDocLabel"
                              placeholder="--Please Select--"
                              filterBy="RefDocLabel"
                              filter
                              showClear
                            />
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </>
            )}
            <div className="row set-margin-in-row-add-control">
              <div className="col-lg-2">
                <tr>
                  <th>
                    <div className="label-text-container">
                      <span className="headtext-form">Conditions</span>
                    </div>
                    <p className="subtext-form">เงื่อนไข</p>
                  </th>
                </tr>
              </div>
              <div className="col-lg-10">
                <div>
                  <button
                    onClick={() => {
                      let col = props.conditions.conditionrefdoc;
                      col.push(conditionRefDoc);
                      props.setConditions((prevState: any) => ({
                        ...prevState,
                        conditionrefdoc: [...col],
                      }));
                    }}
                    type="button"
                    className="set-color-css-button-add-column hover-color-css-282f6a set-margin-0-css"
                  >
                    <HiPlus /> Add Condition
                  </button>
                </div>
              </div>
            </div>
            {props.conditions?.conditionrefdoc?.length !== 0 && (
              <table className="table-layout-create-control">
                <thead className="thead-light">
                  <tr className="set-bg-color-table-create-control">
                    <th style={{ width: "30%" }}>
                      <p className="row headtext">Control Label</p>
                      <p className="row subtext">ชื่อ</p>
                    </th>
                    <th style={{ width: "30%" }}>
                      <p className="row headtext">Type</p>
                      <p className="row subtext">ชนิด</p>
                    </th>
                    <th style={{ width: "30%" }}>
                      <p className="row headtext">Value</p>
                      <p className="row subtext">ค่า</p>
                    </th>
                    <th style={{ width: "10%" }}>
                      <p className="row headtext">Delete</p>
                      <p className="row subtext">ลบ</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.conditions?.conditionrefdoc?.map(
                    (_data: any, idx: any) => (
                      <>
                        <tr key={idx}>
                          <td>
                            <Dropdown
                              style={{ width: "100%" }}
                              value={
                                props.conditions?.conditionrefdoc[idx]?.label
                              }
                              options={props.defaultConfigColumn}
                              onChange={(e: { value: any }) => {
                                props.setConditions((prevState: any) => ({
                                  ...prevState,
                                  conditionrefdoc:
                                    props.conditions.conditionrefdoc.map(
                                      (_val: any, _idx: any) => {
                                        return _idx === idx
                                          ? {
                                              label: e.value,
                                              conditionType: _val.conditionType,
                                              value: _val.value,
                                            }
                                          : _val;
                                      }
                                    ),
                                }));
                              }}
                              optionLabel="RefDocLabel"
                              placeholder="--Please Select--"
                              filterBy="RefDocLabel"
                              filter
                              showClear
                            />
                          </td>
                          <td>
                            <Dropdown
                              style={{ width: "100%" }}
                              value={
                                props.conditions?.conditionrefdoc[idx]
                                  ?.conditionType
                              }
                              options={itemsConditionList}
                              onChange={(e: { value: any }) => {
                                props.setConditions((prevState: any) => ({
                                  ...prevState,
                                  conditionrefdoc:
                                    props.conditions.conditionrefdoc.map(
                                      (_val: any, _idx: any) => {
                                        return _idx === idx
                                          ? {
                                              label: _val.label,
                                              conditionType: e.value,
                                              value: _val.value,
                                            }
                                          : _val;
                                      }
                                    ),
                                }));
                              }}
                              optionLabel="name"
                              placeholder="--Please Select--"
                              filterBy="name"
                            />
                          </td>
                          {props.conditions?.conditionrefdoc[idx]
                            ?.conditionType === "under" && (
                            <>
                              <td>
                                <Dropdown
                                  style={{ width: "100%" }}
                                  value={
                                    props.conditions?.conditionrefdoc[idx]
                                      ?.value
                                  }
                                  options={defaultValue}
                                  onChange={(e: { value: any }) => {
                                    props.setConditions((prevState: any) => ({
                                      ...prevState,
                                      conditionrefdoc:
                                        props.conditions.conditionrefdoc.map(
                                          (_val: any, _idx: any) => {
                                            return _idx === idx
                                              ? {
                                                  label: _val.label,
                                                  conditionType:
                                                    _val.conditionType,
                                                  value: e.value,
                                                }
                                              : _val;
                                          }
                                        ),
                                    }));
                                  }}
                                  optionLabel="item"
                                  placeholder="--Please Select--"
                                  filterBy="item"
                                  filter
                                  showClear
                                />
                              </td>
                              <td className="set-layout-ref-condition-css">
                                <BsTrash
                                  className="set-css-pointer-css-atn"
                                  onClick={() => {
                                    deleteCondition(idx);
                                  }}
                                />
                              </td>
                            </>
                          )}
                          {props.conditions?.conditionrefdoc[idx]
                            ?.conditionType === "fixed value" && (
                            <>
                              <td>
                                <InputText
                                  style={{
                                    width: "100%",
                                    maxHeight: "38.42px",
                                  }}
                                  value={
                                    props.conditions?.conditionrefdoc[idx]
                                      ?.value
                                  }
                                  onChange={(e: { target: { value: any } }) => {
                                    props.setConditions((prevState: any) => ({
                                      ...prevState,
                                      conditionrefdoc:
                                        props.conditions.conditionrefdoc.map(
                                          (_val: any, _idx: any) => {
                                            return _idx === idx
                                              ? {
                                                  label: _val.label,
                                                  conditionType:
                                                    _val.conditionType,
                                                  value: e.target.value,
                                                }
                                              : _val;
                                          }
                                        ),
                                    }));
                                  }}
                                />
                              </td>
                              <td className="set-layout-ref-condition-css">
                                <BsTrash
                                  className="set-css-pointer-css-atn"
                                  onClick={() => {
                                    deleteCondition(idx);
                                  }}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      </>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Spin>
    </>
  );
}
