import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import AttachmentComponent from "../AttachmentComponent/AttachmentComponent";
import AutoNumberComponent from "../AutoNumberComponent/AutoNumberComponent";
import CalendarComponent from "../CalendarComponent/CalendarComponent";
import ChoiceComponent from "../ChoiceComponent/ChoiceComponent";
import MultiChoiceComponent from "../MultiChoiceComponent/MultiChoiceComponent";
import DropdownComponent from "../DropdownComponent/DropdownComponent";
import EditorComponent from "../EditorComponent/EditorComponent";
import HeadingComponent from "../HeadingComponent/HeadingComponent";
import NumberComponent from "../NumberComponent/NumberComponent";
import RevisionComponent from "../RevisionComponent/RevisionComponent";
import ShortTextComponent from "../ShortTextComponent/ShortTextComponent";
import TableComponent from "../TableComponent/TableComponent";
import TextAreaComponent from "../TextAreaComponent/TextAreaComponent";
import CreateControlSideBarElement from "./CreateControlSideBarElement";
import { Toast } from "primereact/toast";
import "./ModalCreateComponents.css";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import {
  GetAllByCreateTemplate,
  ReportTemplateList,
} from "../../../Services/TemplateService";
import { UploadFileRenderControl } from "../../../Services/UploadFileService";
import ImageComponents from "../ImageComponents/ImageComponents";
import useAlert from "../../../hooks/useAlert";
import { Spin } from "antd";
import { ReportTemplateSelectByReportID } from "../../../Services/ReportService";
interface Props {
  visibleCreateControl: boolean;
  setVisibleCreateControl: any;
  itemIdx: number;
  layoutIdx: number;
  setAdvanceForm: any;
  advanceForm: any;
  layoutLength: any;
}

export default function ModalCreateComponents(props: Props) {
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
  const displayCheckBox = [
    { name: "Heading", code: "N" },
    { name: "Text", code: "Y" },
  ];

  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const [selected, setSelected] = useState<string>("");
  const [component, setComponent] = useState<any>();
  const [checkAction, setCheckAction] = useState<string>("");
  const userData = JSON.parse(localStorage.getItem("userData") || "");
  const [loading, setLoading] = useState<boolean>(true);
  //checkbox-dropdown editor table
  const [itemsList, setItemsList] = useState<any>({ items: [] });
  const [displayDropdown, setDisplayDropdown] = useState<any>();
  const [fromRender, setFromRender] = useState<any>("control");
  const [richText, setRichText] = useState<any>({});
  const [checkBoxHeading, setCheckBoxHeading] = useState<any>({
    name: "Heading",
    code: "N",
  });
  const [attributeNumber, setAttributeNumber] = useState<any>({
    formats: [],
  });
  const [revisionConditions, setRevisionConditions] = useState<any>({
    conditions: [],
  });

  //table
  const [attributeColumn, setAttributeColumn] = useState<any>({ column: [] });
  const [footerTable, setFooterTable] = useState<any>({ rows: [] });
  const [mergeColumnRefDoc, setMergeColumnRefDoc] = useState<any>({
    columnRefDoc: [],
  });
  const [docDataSource, setDocDataSource] = useState<any>({
    docDataSource: {},
  });
  const [selectedReportRef, setSelectedReportRef] = useState<any>({
    docReport: {},
  });
  const [selectedTemplateRef, setSelectedTemplateRef] = useState<any>({
    docref: [],
  });
  const [selectedDocControlTemplate, setSelectedDocControlTemplate] =
    useState<any>({
      docNewDoc: [],
      docEditDoc: [],
      docCancelDoc: [],
    });
  const [defaultConfigColumn, setDefaultConfigColumn] = useState<any>([]);
  const [conditions, setConditions] = useState<any>({ conditionrefdoc: [] });
  const [attributeButton, setAttributeButton] = useState<any>({ items: [] });
  const [uploadFileState, setUploadFileState] = useState<any>();

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });
  useEffect(() => {
    setLoading(true);
    setFromRender("control");
    checkType();
  }, []);

  useEffect(() => {
    renderComponent();
  }, [
    selected,
    itemsList,
    revisionConditions,
    attributeColumn,
    attributeNumber,
    mergeColumnRefDoc,
    docDataSource,
    selectedReportRef,
    selectedTemplateRef,
    conditions,
    props.advanceForm,
    attributeButton,
    uploadFileState,
    footerTable,
    selectedDocControlTemplate,
    defaultConfigColumn,
    checkBoxHeading,
  ]);
  const checkType = () => {
    let _itemsLength = props.advanceForm.items[props.itemIdx].layout.length;
    let _templatesDes =
      props.advanceForm.items[props.itemIdx].layout[props.layoutIdx].template;
    let _data =
      props.advanceForm.items[props.itemIdx].layout[props.layoutIdx].data;
    if (_templatesDes.type === "em") {
      setCheckAction("add");
      addFunction();
      if (props.layoutLength === 1) {
        setSelected("1");
      } else if (props.layoutLength === 2) {
        setSelected("2");
      }
      setLoading(false);
    } else {
      setCheckAction("edit");
      checkActionButton(_templatesDes.type, _templatesDes, _data, _itemsLength);
    }
  };
  function addFunction() {
    setDocDataSource((prevState: any) => ({
      ...prevState,
      docDataSource: "Template",
    }));
  }
  const checkActionButton = async (
    dataType: any,
    templatesDes: any,
    data: any,
    _itemsLength: any
  ) => {
    if (dataType === "l") {
      defaultCheckBoxHeading(templatesDes);
      setSelected("1");
    } else if (dataType === "t") {
      setSelected("2");
    } else if (dataType === "ta") {
      setSelected("3");
    } else if (dataType === "c") {
      setSelected("4");
    } else if (dataType === "d") {
      setSelected("5");
    } else if (dataType === "r") {
      setSelected("6");
    } else if (dataType === "cb") {
      setSelected("7");
    } else if (dataType === "dd") {
      setSelected("8");
    } else if (dataType === "tb") {
      await defaultValueReportTable(templatesDes);
      await defaultValueTemplateTable(templatesDes);
      await defaultValueFooterTable(templatesDes);
      await defaultValueConfigColumnTable(templatesDes);
      setSelected("9");
    } else if (dataType === "ed") {
      setSelected("10");
    } else if (dataType === "at") {
      setUploadFileState(data.value);
      setSelected("11");
    } else if (dataType === "im") {
      setUploadFileState(data.value);
      setSelected("12");
    } else if (dataType === "bt") {
      setAttributeButton((prevState: any) => ({
        ...prevState,
        items: [...templatesDes.attribute.items],
      }));
      setSelected("13");
    } else if (dataType === "an") {
      setAttributeNumber((prevState: any) => ({
        ...prevState,
        formats: [...templatesDes.attribute.formats],
      }));
      setSelected("14");
    } else if (dataType === "rvs") {
      if (templatesDes.attribute?.conditions) {
        setRevisionConditions((prevState: any) => ({
          ...prevState,
          conditions: [...templatesDes.attribute.conditions],
        }));
      }
      setSelected("15");
    } else {
      if (_itemsLength === 1) {
        setSelected("1");
      } else {
        setSelected("2");
      }
    }
    setLoading(false);
  };
  const defaultCheckBoxHeading = (templatesDes: any) => {
    if (templatesDes.istext === "Y") {
      setCheckBoxHeading(displayCheckBox[1]);
    } else if (templatesDes.istext === "N") {
      setCheckBoxHeading(displayCheckBox[0]);
    }
  };
  const defaultValueReportTable = async (templatesDes: any) => {
    setAttributeColumn((prevState: any) => ({
      ...prevState,
      column: [...templatesDes.attribute.column],
    }));
    if (templatesDes.attribute?.mergecolumnrefdoc) {
      setMergeColumnRefDoc((prevState: any) => ({
        ...prevState,
        columnRefDoc: [...templatesDes.attribute.mergecolumnrefdoc],
      }));
    }
    if (templatesDes.attribute?.conditionrefdoc) {
      setConditions((prevState: any) => ({
        ...prevState,
        conditionrefdoc: templatesDes.attribute.conditionrefdoc,
      }));
    }
    if (templatesDes.attribute?.refdoc?.docDataSource) {
      setDocDataSource((prevState: any) => ({
        ...prevState,
        docDataSource: templatesDes.attribute.refdoc.docDataSource,
      }));
      let _dataReportTemplate = await ReportTemplateList();
      var response = _dataReportTemplate.filter(
        (x: { ReportTemplateId: string }) =>
          x.ReportTemplateId.toString() ===
          templatesDes.attribute.refdoc.docReport
      );
      setSelectedReportRef((prevState: any) => ({
        ...prevState,
        docReport: response[0] || [],
      }));
    }
  };
  const defaultValueTemplateTable = async (templatesDes: any) => {
    if (templatesDes.attribute?.refdoc?.docref?.length >= 1) {
      let _dataTemplate = await GetAllByCreateTemplate();
      let _template: any[] = [];
      for (let i = 0; i < templatesDes.attribute.refdoc.docref.length; i++) {
        const docRef = templatesDes.attribute.refdoc.docref[i];

        for (let j = 0; j < _dataTemplate.length; j++) {
          const template = _dataTemplate[j];
          if (docRef.id == template.DocumentCode) {
            _template.push(template);
          }
        }
      }
      await setSelectedTemplateRef((prevState: any) => ({
        ...prevState,
        docref: _template,
      }));
      setDefaultValueDocControl(templatesDes, _dataTemplate);
    }
  };
  const defaultValueFooterTable = (templatesDes: any) => {
    if (templatesDes.attribute?.footerTable) {
      setFooterTable((prevState: any) => ({
        ...prevState,
        rows: [...templatesDes.attribute?.footerTable.rows],
      }));
    }
  };
  const defaultValueConfigColumnTable = async (templatesDes: any) => {
    let mapper: any = [];
    console.log(templatesDes.attribute?.refdoc?.docref, "response1");
    console.log(templatesDes.attribute?.refdoc?.docDataSource, "response2");

    if (templatesDes.attribute?.refdoc?.docDataSource === "Report") {
      let array: any[] = [];
      const reportId = parseInt(templatesDes.attribute?.refdoc?.docReport);
      const response = await ReportTemplateSelectByReportID(reportId);
      console.log(response, "response");
      let selectedFieldList = response.Selectedfieldlist;
      for (let i = 0; i < selectedFieldList.length; i++) {
        const element = selectedFieldList[i];
        array.push({
          value: element.key,
          RefDocLabel: element.label,
        });
      }
      const _data = itemsControlLabel;
      Array.prototype.push.apply(_data, array);
      console.log(_data, "_data");
      setDefaultConfigColumn([..._data]);
    } else if (
      templatesDes.attribute?.refdoc?.docref > 0 &&
      templatesDes.attribute?.refdoc?.docDataSource === "Template"
    ) {
      templatesDes.attribute?.refdoc?.docref?.map(
        (item: any, index: number) => {
          if (item?.AdvanceForm) {
            mapper.push({
              AdvanceForm: JSON.parse(item?.AdvanceForm),
              DocumentCode: item.DocumentCode,
            });
          }
        }
      );
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
      setDefaultConfigColumn([..._data]);
    } else {
      const _data = itemsControlLabel;
      setDefaultConfigColumn([..._data]);
    }
  };
  const setDefaultValueDocControl = async (
    templatesDes: any,
    _dataTemplate: any
  ) => {
    //docNewDoc
    if (templatesDes.attribute?.refdoc?.docNewDoc) {
      let _newDoc: any[] = [];
      const docNewDocArray =
        templatesDes.attribute?.refdoc?.docNewDoc?.split(",");
      for (let i = 0; i < docNewDocArray.length; i++) {
        const newDoc = docNewDocArray[i];
        for (let j = 0; j < _dataTemplate.length; j++) {
          const template = _dataTemplate[j];
          if (newDoc == template.DocumentCode) {
            _newDoc.push(template);
          }
        }
      }
      await setSelectedDocControlTemplate((prevState: any) => ({
        ...prevState,
        docNewDoc: _newDoc,
      }));
    }
    //docEditDoc
    if (templatesDes.attribute?.refdoc?.docEditDoc) {
      let _docEditDoc: any[] = [];
      const docEditDocArray =
        templatesDes.attribute?.refdoc?.docEditDoc?.split(",");
      for (let i = 0; i < docEditDocArray.length; i++) {
        const docEditDoc = docEditDocArray[i];
        for (let j = 0; j < _dataTemplate.length; j++) {
          const template = _dataTemplate[j];
          if (docEditDoc == template.DocumentCode) {
            _docEditDoc.push(template);
          }
        }
      }
      await setSelectedDocControlTemplate((prevState: any) => ({
        ...prevState,
        docEditDoc: _docEditDoc,
      }));
    }
    //docCancelDoc
    if (templatesDes.attribute?.refdoc?.docCancelDoc) {
      let _docCancelDoc: any[] = [];
      const docCancelDocArray =
        templatesDes.attribute?.refdoc?.docCancelDoc?.split(",");
      for (let i = 0; i < docCancelDocArray.length; i++) {
        const docCancelDoc = docCancelDocArray[i];
        for (let j = 0; j < _dataTemplate.length; j++) {
          const template = _dataTemplate[j];
          if (docCancelDoc == template.DocumentCode) {
            _docCancelDoc.push(template);
          }
        }
      }
      await setSelectedDocControlTemplate((prevState: any) => ({
        ...prevState,
        docCancelDoc: _docCancelDoc,
      }));
    }
  };
  const requestData = (
    templates: any,
    itemIdx: number,
    layoutIdx: number,
    _data?: any
  ) => {
    let _templates = templates;
    let _advanceForm = props.advanceForm;
    _advanceForm.items[itemIdx].layout[layoutIdx].template = _templates;
    _advanceForm.items[itemIdx].layout[layoutIdx].data = _data;
    props.setAdvanceForm(_advanceForm);
  };
  const requestDataToLayout = (
    layout: any,
    itemIdx: number,
    layoutIdx: number
  ) => {
    let _layout = layout;
    let _advanceForm = props.advanceForm;
    _advanceForm.items[itemIdx].layout[layoutIdx] = _layout;
    props.setAdvanceForm(_advanceForm);
  };

  const updateChanges = async (data: any) => {
    let checkUnique: boolean = false;

    if (fromRender !== "control") {
      return;
    }
    if (itemsList.items.length === 0) {
      if (selected === "6" || selected === "7" || selected === "8") {
        toggleAlert({
          description: `Please fill in all required fields.`,
          message: `Require field warning.`,
          type: "warning",
        });
        return;
      }
    }
    if (props.advanceForm.items?.length >= 1) {
      props.advanceForm.items.map((_data: any, index: number) => {
        _data.layout.map((_dataLayout: any, index2: number) => {
          if (_dataLayout.template.label != undefined) {
            if (_dataLayout.template.type !== "em") {
              if (
                _dataLayout.template.label === data.label &&
                _dataLayout.template.label !==
                  props.advanceForm.items[props.itemIdx].layout[props.layoutIdx]
                    .template.label
              ) {
                if (!data.description) {
                  checkUnique = true;
                }
              } else if (checkAction === "edit") {
                if (
                  selected === "2" ||
                  selected === "4" ||
                  selected === "7" ||
                  selected === "8"
                ) {
                  if (
                    data.description ===
                      _dataLayout.template.attribute?.description &&
                    _dataLayout.template.label === data.label &&
                    props.advanceForm.items[props.itemIdx].layout[
                      props.layoutIdx
                    ].guid !== _dataLayout.guid
                  ) {
                    checkUnique = true;
                  }
                }
              }
            }
          }
        });
      });
    }
    if (checkUnique) {
      toggleAlert({
        description: `Duplicate information in label.\n please input field description.`,
        message: `Dupplicate field warning.`,
        type: "warning",
      });
      return;
    }

    if (selected === "1") {
      console.log(data, "dataRequest");
      const dataRequest = {
        type: "l",
        label: data.labelHeading || "",
        alter: data.alter || "",
        istext: checkBoxHeading.code,
        textvalue: data.textvalue || "",
      };

      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "2") {
      const dataRequest = {
        type: "t",
        label: data.label,
        alter: data.alter,
        attribute: {
          description: data.description,
          default: data.default,
          length: data.length.toString(),
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "3") {
      const dataRequest = {
        type: "ta",
        label: data.label,
        alter: data.alter,
        attribute: {
          description: data.description,
          default: data.default,
          length: data.length.toString(),
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "4") {
      const dataRequest = {
        type: "c",
        label: data.label,
        alter: data.alter,
        attribute: {
          require: data.require ? "Y" : "N",
          formula: data.formula,
          description: data.description,
          decimal: data.decimal.toString(),
          default: data.default,
          align: data.align ? "l" : "r",
          min: data.min.toString(),
          max: data.max.toString(),
          useComma: data.useComma ? "Y" : "N",
          symbol: data.symbolNumber,
          symbolPosition: data.symbolPosition ? "B" : "E",
          summary: data.summary ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
        },
      };
      const defaultDataValue = { value: null };

      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "5") {
      const dataRequest = {
        type: "d",
        label: data.label,
        alter: data.alter,
        attribute: {
          description: data.description,
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
          date: {
            use: "Y",
            useDate: "Y",
            fullYear: "Y",
            symbol: data.symbol,
          },
          time: {
            use: "N",
            useSecond: "N",
            symbol: ":",
          },
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "6") {
      const dataRequest = {
        type: "r",
        label: data.label,
        alter: data.alter,
        attribute: {
          description: data.description,
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
          multipleLine: data.multipleLine ? "Y" : "N",
          items: itemsList.items,
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "7") {
      const dataRequest = {
        type: "cb",
        label: data.label,
        alter: data.alter,
        attribute: {
          description: data.description,
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
          multipleLine: data.multipleLine ? "Y" : "N",
          display: displayDropdown?.code,
          items: itemsList.items,
        },
      };
      const defaultDataValue = {
        value: null,
        item: [],
      };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "8") {
      const dataRequest = {
        type: "dd",
        label: data.label,
        alter: data.alter,
        description: data.description,
        attribute: {
          require: data.require ? "Y" : "N",
          items: itemsList.items,
        },
        readonly: data.readonly ? "Y" : "N",
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "9") {
      //functionCheckInputWidth
      // let checkWidthInTableDoNotHas: boolean = false;
      // let checkWidthInTableHasValue: boolean = false;
      // console.log(attributeColumn, "_width");

      // attributeColumn.column.map((_column: any) => {
      //   if (
      //     _column.control.template.attribute?.widthInTable === "0" ||
      //     !_column.control.template.attribute?.widthInTable
      //   ) {
      //     checkWidthInTableDoNotHas = true;
      //   } else {
      //     checkWidthInTableHasValue = true;
      //   }
      // });

      // if (checkWidthInTableHasValue && checkWidthInTableDoNotHas) {
      //   checkWidthInTableDoNotHas = false;
      //   attributeColumn.column.map((_column: any) => {
      //     const _width = _column.control.template.attribute?.widthInTable || 0;
      //     if (_width !== "0") {
      //       checkWidthInTableHasValue = true;
      //     }
      //   });

      //   if (checkWidthInTableHasValue) {
      //     toggleAlert({
      //       description: `Please fill in all required width fields.`,
      //       message: `Width field warning.`,
      //       type: "warning",
      //     });
      //     return;
      //   }
      // }
      const dataRequest = {
        type: "tb",
        label: data.label,
        alter: data.alter,
        formula: data.formula,
        hideInPdf: data.hideInPdf ? "Y" : "N",
        attribute: {
          column: attributeColumn.column,
          enabledpopupdefdoc: data.enabledpopupdefdoc ? "Y" : "N",
          mergecolumnrefdoc: mergeColumnRefDoc?.columnRefDoc || [],
          conditionrefdoc: conditions?.conditionrefdoc,
          refdoc: {
            doccontrol:
              docDataSource.docDataSource === "Template"
                ? data.doccontrol
                : false,
            docDataSource: docDataSource?.docDataSource,
            docReport:
              docDataSource.docDataSource === "Report"
                ? selectedReportRef?.docReport?.ReportTemplateId?.toString() ||
                  ""
                : "",
            docNewDoc:
              docDataSource.docDataSource === "Template"
                ? selectedDocControlTemplate?.docNewDoc
                    .map((item: any) => {
                      return item.DocumentCode;
                    })
                    .join(",") || ""
                : "",
            docEditDoc:
              docDataSource.docDataSource === "Template"
                ? selectedDocControlTemplate.docEditDoc
                    .map((item: any) => {
                      return item.DocumentCode;
                    })
                    .join(",") || ""
                : "",
            docCancelDoc:
              docDataSource.docDataSource === "Template"
                ? selectedDocControlTemplate.docCancelDoc
                    .map((item: any) => {
                      return item.DocumentCode;
                    })
                    .join(",") || ""
                : "",
            docref:
              selectedTemplateRef?.docref?.map((data: any, idx: any) => {
                return {
                  id: data.DocumentCode,
                };
              }) || [],
          },
          footerTable: footerTable,
          autoRowNumber: "Y",
        },
        readonly: data.readonly ? "Y" : "N",
      };
      const defaultDataValue = {
        row: null,
      };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "10") {
      const dataRequest = {
        template: {
          type: "ed",
          label: data.label,
          alter: data.alter,
          description: "",
          height: data.height.toString(),
          attribute: {
            require: data.require ? "Y" : "N",
            readonly: data.readonly ? "Y" : "N",
          },
        },
        data: {
          value: richText.value,
        },
        guid: generateQuickGuid(),
      };
      requestDataToLayout(dataRequest, props.itemIdx, props.layoutIdx);
    } else if (selected === "11") {
      const dataRequest = {
        type: "at",
        label: data.label,
        alter: data.alter,
        description: data.fileTypeFile,
        attribute: {
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
          max: data.maxFile.toString(),
        },
      };
      let defValue: any = null;
      if (uploadFileState) {
        defValue = uploadFileState;
      }
      const defaultDataValue = { value: defValue };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "12") {
      const dataRequest = {
        type: "im",
        label: data.label,
        alter: data.alter,
        fileType: data.fileTypeImage,
        attribute: {
          maxFile: data.maxFile.toString(),
          width: data.width?.toString() || "",
          height: data.height?.toString() || "",
          require: data.require ? "Y" : "N",
          readonly: data.readonly ? "Y" : "N",
        },
      };
      let defValue: any = null;
      if (uploadFileState) {
        defValue = uploadFileState;
      }
      const defaultDataValue = { value: defValue };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "13") {
      const dataRequest = {
        type: "bt",
        label: data.label,
        alter: data.textButton,
        URL: data.url,
        attribute: {
          items: attributeButton.items,
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "14") {
      const dataRequest = {
        type: "an",
        label: data.label,
        alter: data.alter,
        digit: data.digit.toString(),
        attribute: {
          formats: attributeNumber.formats,
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    } else if (selected === "15") {
      const dataRequest = {
        type: "rvs",
        label: data.label,
        alter: data.alter,
        attribute: {
          digit: data.digit.toString(),
          readonly: data.readonly ? "Y" : "N",
          conditions: revisionConditions.conditions,
        },
      };
      const defaultDataValue = { value: null };
      requestData(
        dataRequest,
        props.itemIdx,
        props.layoutIdx,
        defaultDataValue
      );
    }
    props.setVisibleCreateControl(false);
  };

  const renderComponent = () => {
    let _template =
      props.advanceForm.items[props.itemIdx].layout[props.layoutIdx].template;
    let _data =
      props.advanceForm.items[props.itemIdx].layout[props.layoutIdx].data;

    if (selected === "1") {
      setComponent(
        <HeadingComponent
          requestData={requestData}
          control={control}
          errors={errors}
          template={_template}
          selected={selected}
          setCheckBoxHeading={setCheckBoxHeading}
          checkBoxHeading={checkBoxHeading}
          displayCheckBox={displayCheckBox}
        />
      );
    } else if (selected === "2") {
      setComponent(
        <ShortTextComponent
          control={control}
          errors={errors}
          template={_template}
        />
      );
    } else if (selected === "3") {
      setComponent(
        <TextAreaComponent
          control={control}
          errors={errors}
          template={_template}
        />
      );
    } else if (selected === "4") {
      setComponent(
        <NumberComponent
          control={control}
          errors={errors}
          template={_template}
          setValue={setValue}
        />
      );
    } else if (selected === "5") {
      setComponent(
        <CalendarComponent
          control={control}
          errors={errors}
          template={_template}
        />
      );
    } else if (selected === "6") {
      setComponent(
        <ChoiceComponent
          control={control}
          errors={errors}
          template={_template}
          setItemsList={setItemsList}
          itemsList={itemsList}
        />
      );
    } else if (selected === "7") {
      setComponent(
        <MultiChoiceComponent
          control={control}
          errors={errors}
          template={_template}
          setItemsList={setItemsList}
          itemsList={itemsList}
          setDisplayDropdown={setDisplayDropdown}
        />
      );
    } else if (selected === "8") {
      setComponent(
        <DropdownComponent
          control={control}
          errors={errors}
          template={_template}
          setItemsList={setItemsList}
          itemsList={itemsList}
        />
      );
    } else if (selected === "9") {
      setComponent(
        <TableComponent
          control={control}
          errors={errors}
          template={_template}
          setAttributeColumn={setAttributeColumn}
          attributeColumn={attributeColumn}
          setFromRender={setFromRender}
          fromRender={fromRender}
          setMergeColumnRefDoc={setMergeColumnRefDoc}
          mergeColumnRefDoc={mergeColumnRefDoc}
          setDocDataSource={setDocDataSource}
          docDataSource={docDataSource}
          setSelectedReportRef={setSelectedReportRef}
          selectedReportRef={selectedReportRef}
          setSelectedTemplateRef={setSelectedTemplateRef}
          selectedTemplateRef={selectedTemplateRef}
          setConditions={setConditions}
          conditions={conditions}
          advanceForm={props.advanceForm}
          setFooterTable={setFooterTable}
          footerTable={footerTable}
          setUploadFileState={setUploadFileState}
          uploadFileState={uploadFileState}
          userData={userData}
          setSelectedDocControlTemplate={setSelectedDocControlTemplate}
          selectedDocControlTemplate={selectedDocControlTemplate}
          setDefaultConfigColumn={setDefaultConfigColumn}
          defaultConfigColumn={defaultConfigColumn}
        />
      );
    } else if (selected === "10") {
      setComponent(
        <EditorComponent
          control={control}
          errors={errors}
          template={_template}
          data={_data}
          setRichText={setRichText}
        />
      );
    } else if (selected === "11") {
      setComponent(
        <AttachmentComponent
          control={control}
          errors={errors}
          template={_template}
          userData={userData}
          setUploadFileState={setUploadFileState}
          uploadFileState={uploadFileState}
        />
      );
    } else if (selected === "12") {
      setComponent(
        <ImageComponents
          control={control}
          errors={errors}
          template={_template}
          userData={userData}
          setUploadFileState={setUploadFileState}
          uploadFileState={uploadFileState}
        />
      );
    } else if (selected === "13") {
      setComponent(
        <ButtonComponent
          control={control}
          errors={errors}
          template={_template}
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
          attributeButton={attributeButton}
          setAttributeButton={setAttributeButton}
        />
      );
    } else if (selected === "14") {
      setComponent(
        <AutoNumberComponent
          control={control}
          errors={errors}
          template={_template}
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
          attributeNumber={attributeNumber}
          setAttributeNumber={setAttributeNumber}
        />
      );
    } else if (selected === "15") {
      setComponent(
        <RevisionComponent
          control={control}
          errors={errors}
          template={_template}
          setRevisionConditions={setRevisionConditions}
          revisionConditions={revisionConditions}
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
        />
      );
    }
  };
  const handleKeyDown = (event: any, callback: any) => {
    if (selected === "1" || selected === "3") {
      return;
    } else if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      callback(handleSubmit);
    }
  };
  return (
    <>
      <>
        <Toast style={{ whiteSpace: "pre-line" }} ref={toast} />
        {props.visibleCreateControl && (
          <Dialog
            header="Control"
            visible={props.visibleCreateControl}
            style={{
              width: "70.20833333333333vw",
              height: "43.5vw",
              borderRadius: "16px",
            }}
            onHide={() =>
              props.setVisibleCreateControl(!props.visibleCreateControl)
            }
            breakpoints={{ "960px": "75vw" }}
            blockScroll
            draggable={false}
            resizable={false}
          >
            <Spin
              className="loadingggggggggg"
              tip="Loading..."
              style={{ paddingTop: "19rem" }}
              spinning={loading}
            >
              <div className="row">
                <div className="col-lg-3">
                  <CreateControlSideBarElement
                    curPage={selected}
                    onSelectView={setSelected}
                    layoutLength={props.layoutLength}
                    renderIn={"control"}
                  ></CreateControlSideBarElement>
                </div>
                <div className="col-lg-9 set-card-add-control">
                  <form
                    key={1}
                    onSubmit={handleSubmit(updateChanges)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, handleSubmit);
                    }}
                  >
                    {component}
                    <div className="footer-dialog-css">
                      <Button
                        style={{
                          width: "6.25rem",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "6px",
                          zIndex: 2,
                          fontSize: "13px",
                        }}
                        label="Cancel"
                        type="button"
                        onClick={() => props.setVisibleCreateControl(false)}
                        className="hover-color-css-white-3 p-button-outlined"
                        icon="pi pi-times-circle"
                      />
                      <Button
                        style={{
                          width: "6.25rem",
                          backgroundColor: "#282f6a",
                          color: "white",
                          borderRadius: "6px",
                          zIndex: 2,
                          fontSize: "13px",
                        }}
                        label="Save"
                        type="submit"
                        className="hover-color-css-white-2 p-button-outlined"
                        icon="pi pi-save"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </Spin>
          </Dialog>
        )}
      </>
    </>
  );
}
