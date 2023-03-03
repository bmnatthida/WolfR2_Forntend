import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import {
  AddReport,
  ReportListTemplateSelect,
  UpdateReport,
} from "../../../Services/ReportService";

import "./ReportDialog.css";
import AutoCompleteComponents from "../../AutoCompleteComponents/AutoCompleteComponents";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";

import { GetAllEmployee } from "../../../Services/EmployeeService";
import EmployeeDialog from "../../DataFechDialogComponents/EmployeeDialog/EmployeeDialog";
import { RadioButtonComponents } from "../../RadioButtonComponents/RadioButtonComponents";
import { Calendar } from "primereact/calendar";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { IReportModel } from "../../../IRequestModel/IReportModel";
import moment from "moment";
import { IoCloseOutline } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
import { GetTemplateById } from "../../../Services/TemplateService";
import { filterHash } from "@fullcalendar/react";
import { DatePicker, Spin } from "antd";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";
interface Props {
  visible: boolean;
  toggleDialog: any;
  templateDataProps?: any;
  checkSetProps?: any;
  checkProps?: any;
  editProps?: any;
  dataEditReportProps?: any;
  setEditReportProps?: any;
  setOnLoading: (bool: boolean) => void;
}
const reportModelIReportModel: IReportModel = {
  ReportTemplateId: 0,
  ReportName: "",
  TemplateId: "",
  Selectedfieldlist: [],
  ReportDescription: "",
  IsPrivate: false,
  IsActive: true,
  CreatedBy: "",
  CreatedByname: "",
  CreatedDate: "",
  ModifiedBy: "",
  ModifiedByname: "",
  ModifiedDate: "",
  Selectedfieldlistfilter: [],
  Columns: [],
  Rows: [],
  TemplateNewVersion: false,
  PageIndex: 0,
  PageSize: 10,
  CanDelete: false,
  RoleId: "",
  RoleEmp: "",
  Mode: false,
};

export const ReportDialog = (props: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [selectedField, setSelectedField] = useState<any[]>([]);
  const [templateKey, setTemplateKey] = useState<any[]>([]);
  const [templateField, setTemplateField] = useState<any[]>([]);
  const [templateMulti, setTemplateMulti] = useState<any[]>([]);

  const [templateFieldMulti, setTemplateFieldMulti] = useState<any>([]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [keyAutoComplete, setKeyAutoComplete] = useState<any>();
  const [employeeRequest, setEmployeeRequest] = useState<any>([]);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any>([]);
  const [roleData, setRoleData] = useState<any>([]);
  const [radioButtonCheck, setRadioButtonCheck] = useState<any>(false);
  const [radioButtonCheckToday, setRadioButtonCheckToday] =
    useState<any>(false);
  const [radioButtonCheckFrom, setRadioButtonCheckFrom] = useState<any>(false);
  const [filterValue, setFilterValue] = useState<any>([]);
  const [reportModel, setReportModel] = useState<any>({});
  const [filterValueSelected, setFilterValueSelected] = useState<any>([]);
  const [dropdownfilterValue, setDropdownfilterValue] = useState<any>([]);
  const [group, setGroup] = useState<any>([]);
  const [groupData, setGroupData] = useState<any>([]);
  const [indexOrderBy, setIndexOrderBy] = useState<any>([]);
  const [indexHideColumn, setIndexHideColumn] = useState<any>([]);
  const [indexSortingBy, setIndexSortingBy] = useState<any>([]);
  const [textHeader, setTextHeader] = useState<any>("");

  const [templateMode, setTemplateMode] = useState<any>({ Mode: "Real Time" });
  // const [disabledSave, setDisabledSave] = useState<any>(true);

  const [validationForm, setValidationForm] = useState<any>({
    TemplateIdValidation: false,
    FieldCollectionValidation: false,
    ReportNameValidation: false,
    ReportDescriptionValidation: false,
    RoleEmpValidation: false,
    RoleIdValidation: false,
    DisabledSave: true,
  });

  useEffect(() => {
    addTemplateKey();
  }, [props.templateDataProps, props.visible]);

  useEffect(() => {
    if (
      employee !== undefined &&
      employee.length !== 0 &&
      roleData !== undefined &&
      roleData.length !== 0 &&
      props.dataEditReportProps !== undefined &&
      props.editProps === true
    ) {
      editData();
    }
  }, [employee, roleData, props.dataEditReportProps]);

  useEffect(() => {
    _fechData();
  }, [props.visible]);

  useEffect(() => {
    if (props.editProps === true) {
      setTextHeader("Edit Report / แก้ไขรายงาน");
      setReportModel((prevState: any) => ({
        ...prevState,
        CreatedBy: props.dataEditReportProps.CreateBy,
        CreatedDate: props.dataEditReportProps.CreateDate,
        IsPrivate: props.dataEditReportProps.Isprivate,
        Mode: props.dataEditReportProps.Mode,
        ModifiedBy: props.dataEditReportProps.ModifiedBy,

        ReportDescription: props.dataEditReportProps.Reportdescription,
        ReportName: props.dataEditReportProps.Reportname,
        ReportTemplateId: props.dataEditReportProps.ReporttemplateID,
        RoleEmp: props.dataEditReportProps.RoleEmp,
        RoleId: props.dataEditReportProps.RoleId,
        SecretId: props.dataEditReportProps.SecretId,
        Selectedfieldlist: props.dataEditReportProps.Selectedfieldlist,

        Selectedfieldlistfilter:
          props.dataEditReportProps.Selectedfieldlistfilter,
        TemplateId: props.dataEditReportProps.TemplateID,
        TemplateNewVersion: props.dataEditReportProps.Templateversion,
      }));
      console.log("props.dataEditReportProps", props.dataEditReportProps);
      if (props.dataEditReportProps !== undefined) {
        if (
          JSON.stringify(props.dataEditReportProps) !==
          JSON.stringify(reportModel)
        ) {
          editReportData();
        }
      }
    } else {
      setTextHeader("Create Report / สร้างรายงาน");
    }
  }, [props.editProps, props.dataEditReportProps]);
  useEffect(() => {
    if (templateFieldMulti !== undefined && templateFieldMulti.length !== 0) {
      let indexGroupByFilter = templateFieldMulti.filter(
        (_data: any) => _data.indexGroupBy === "1"
      );
      let indexSortingByByFilter = templateFieldMulti.filter(
        (_data: any) => _data.indexSortingBy === "1"
      );
      let indexHideColumnByByFilter = templateFieldMulti.filter(
        (_data: any) => _data.indexHideColumn === "1"
      );
      let indexOrderByColumnByByFilter = templateFieldMulti.filter(
        (_data: any) => _data.indexOrderBy === "1"
      );
      if (indexGroupByFilter.length !== 0) {
        setGroupData(indexGroupByFilter);
      }
      if (indexSortingByByFilter.length !== 0) {
        setIndexSortingBy(indexSortingByByFilter);
      }
      if (indexHideColumnByByFilter.length !== 0) {
        setIndexHideColumn(indexHideColumnByByFilter);
      }
      if (indexOrderByColumnByByFilter.length !== 0) {
        setIndexOrderBy(indexOrderByColumnByByFilter);
      }
    }
  }, [templateFieldMulti]);
  async function Data() {
    setReportModel(reportModelIReportModel);

    setSelectedField([]);
    setTemplateKey([]);
    setTemplateField([]);
    setTemplateMulti([]);
    setTemplateFieldMulti([]);
    setEmployeeRequest([]);
    setSearchData([]);
    setEmployee([]);
    setRoleData([]);
    setFilterValue([]);
    setFilterValueSelected([]);
    setGroup([]);
    setGroupData([]);
    setIndexOrderBy([]);
    setIndexHideColumn([]);
    setIndexSortingBy([]);
    setValidationForm({
      TemplateIdValidation: false,
      FieldCollectionValidation: false,
      ReportNameValidation: false,
      ReportDescriptionValidation: false,
      DisabledSave: true,
    });
  }
  function formatDate(date: string) {
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
  }

  async function editData() {
    console.log("props.dataEditReportProps?.Mode", props.dataEditReportProps);
    onTemplateMode(
      props.dataEditReportProps?.Mode === false
        ? { Mode: "Real Time" }
        : { Mode: "Schedule Mode" }
    );
    if (props.dataEditReportProps !== undefined) {
      const _employee = await GetAllEmployee();
      const roles = await GetAllDynamic("Roles/GetAll", undefined);
      let _RoleEmpSplit =
        props.dataEditReportProps.RoleEmp === undefined
          ? []
          : props.dataEditReportProps.RoleEmp !== null
          ? props.dataEditReportProps.RoleEmp.split(",")
          : [];
      let _RoleIdSplit =
        props.dataEditReportProps.RoleId === undefined
          ? []
          : props.dataEditReportProps.RoleId !== null
          ? props.dataEditReportProps.RoleId.split(",")
          : [];
      let arrayRoleEmp: any = [];
      let arrayGroup: any = [];
      if (_RoleEmpSplit.length !== 0) {
        _RoleEmpSplit.map((_data: any) => {
          let _dataRoleEmp = _employee.filter(
            (item: any) => item.EmployeeId === Number(_data)
          );
          if (_dataRoleEmp.length !== 0) {
            arrayRoleEmp.push(_dataRoleEmp[0]);
          }
        });
      }
      if (_RoleIdSplit.length !== 0) {
        _RoleIdSplit.map((_data: any) => {
          let _dataRoleEmp = roles.filter(
            (item: any) => item.RoleId === Number(_data)
          );
          if (_dataRoleEmp.length !== 0) {
            arrayGroup.push(_dataRoleEmp[0]);
          }
        });
      }
      setEmployeeRequest([...arrayRoleEmp]);
      setGroup([...arrayGroup]);
      setRadioButtonCheck(props.dataEditReportProps?.Isprivate);
    }
  }
  async function editReportData() {
    let _dataJSONParse: any = [];
    var TemplateId = props.dataEditReportProps?.TemplateID?.split("|");
    _dataJSONParse =
      props.dataEditReportProps.Selectedfieldlist !== undefined
        ? props.dataEditReportProps.Selectedfieldlist !== null &&
          props.dataEditReportProps.Selectedfieldlist.length !== 0 &&
          props.dataEditReportProps.Selectedfieldlist !== "[]"
          ? props.dataEditReportProps.Selectedfieldlist
          : []
        : [];

    for (let i = 0; i < _dataJSONParse.length; i++) {
      delete _dataJSONParse[i]["value"];
    }

    let _dataFavoritesItem: any = [];
    _dataFavoritesItem =
      props.dataEditReportProps.Selectedfieldlistfilter !== undefined
        ? props.dataEditReportProps.Selectedfieldlistfilter !== null &&
          props.dataEditReportProps.Selectedfieldlistfilter.length !== 0 &&
          props.dataEditReportProps.Selectedfieldlistfilter !== "[]"
          ? props.dataEditReportProps.Selectedfieldlistfilter
          : []
        : [];

    let arrayTemplate: any = [];
    if (TemplateId !== undefined) {
      if (TemplateId.length !== 0) {
        for (let i = 0; i < TemplateId.length; i++) {
          let dataFilter = props.templateDataProps?.filter(
            (item: any) =>
              item.DocumentCode === TemplateId[i] ||
              item.TemplateId === Number(TemplateId[i])
          );
          arrayTemplate.push(dataFilter[0]);
          if (TemplateId.length - 1 === i) {
            _SelectFormEdit(arrayTemplate, _dataJSONParse);
          }
        }
      }
    }
    let _arrayItes: any = [];
    if (_dataFavoritesItem.length !== 0) {
      for (let i = 0; i < _dataFavoritesItem.length; i++) {
        const element = _dataFavoritesItem[i];
        let arrayDataReplace: any = [];
        if (element.FieldText && element.FieldText.length !== 0) {
          var _dataSplit = element.FieldText?.split("|");
          for (let j = 0; j < _dataSplit.length; j++) {
            arrayDataReplace.push({
              FieldText: _dataSplit[j].replaceAll(";", ""),
            });
          }
        } else {
          element.FieldText = [];
        }
        element.FieldText = arrayDataReplace;
      }

      for (let i = 0; i < _dataJSONParse.length; i++) {
        const element = _dataJSONParse[i];
        for (let j = 0; j < _dataFavoritesItem.length; j++) {
          const _element = _dataFavoritesItem[j];
          if (element.key === _element.FieldCode) {
            _arrayItes.push(element);
          }
        }
      }
      setFilterValueSelected(_dataFavoritesItem);
      setSelectedField(_arrayItes);
    } else {
      setFilterValueSelected([]);
      setSelectedField([]);
    }
  }
  async function _save() {
    if (
      reportModel.TemplateId === undefined ||
      reportModel.TemplateId === null ||
      reportModel.TemplateId.length === 0 ||
      reportModel.Selectedfieldlist === undefined ||
      reportModel.Selectedfieldlist === null ||
      reportModel.Selectedfieldlist.length === 0 ||
      reportModel.Selectedfieldlist === "[]" ||
      reportModel.ReportName === undefined ||
      reportModel.ReportName === null ||
      reportModel.ReportName.length === 0 ||
      reportModel.ReportDescription === undefined ||
      reportModel.ReportDescription === null ||
      reportModel.ReportDescription.length === 0
    ) {
      setValidationForm((dataDF: any) => ({
        ...dataDF,
        TemplateIdValidation:
          reportModel.TemplateId === undefined ||
          reportModel.TemplateId === null ||
          reportModel.TemplateId.length === 0
            ? true
            : false,
        FieldCollectionValidation:
          reportModel.Selectedfieldlist === undefined ||
          reportModel.Selectedfieldlist === null ||
          reportModel.Selectedfieldlist.length === 0 ||
          reportModel.Selectedfieldlist === "[]"
            ? true
            : false,
        ReportNameValidation:
          reportModel.ReportName === undefined ||
          reportModel.ReportName === null ||
          reportModel.ReportName.length === 0
            ? true
            : false,
        ReportDescriptionValidation:
          reportModel.ReportDescription === undefined ||
          reportModel.ReportDescription === null ||
          reportModel.ReportDescription.length === 0
            ? true
            : false,
      }));
    } else {
      let objSave = {
        ...reportModel,
        Selectedfieldlistfilter:
          filterValueSelected.length !== 0
            ? filterValueSelected
            : // JSON.stringify(filterValueSelected)
              [],
      };
      objSave.Selectedfieldlist.map((data: any) => {
        data["value"] = null;
        data.reportTemplateId = null;
        data.isChecked = "1";
      });

      if (objSave.Selectedfieldlistfilter.length !== 0) {
        for (let i = 0; i < objSave.Selectedfieldlistfilter.length; i++) {
          let _arrayName: any = [];
          const element = objSave.Selectedfieldlistfilter[i];
          console.log("element", element.FieldText);
          // remove_character
          if (element.FieldText.length !== 0) {
            for (let j = 0; j < element.FieldText.length; j++) {
              const _element = element.FieldText[j];
              _arrayName.push(_element.FieldText + ";");
            }
            objSave.Selectedfieldlistfilter[i].FieldText = _arrayName
              .toString()
              .replaceAll(",", "|;");
          } else {
            objSave.Selectedfieldlistfilter[i].FieldText = "";
          }
          if (objSave.Selectedfieldlistfilter[i].FieldText.length !== 0) {
            objSave.Selectedfieldlistfilter[i].FieldText = remove_character(
              objSave.Selectedfieldlistfilter[i].FieldText,
              objSave.Selectedfieldlistfilter[i].FieldText.length - 1
            );
          }
        }
      } else {
        objSave.Selectedfieldlistfilter = [];
      }

      try {
        if (props.editProps !== true) {
          let _AddReport = await AddReport(objSave);
          if (_AddReport) {
            Data();
            props.checkSetProps(false);
            props.setOnLoading(true);
            props.toggleDialog();
          }
        } else {
          let _UpdatrReport = await UpdateReport(objSave);
          console.log("_UpdatrReport", _UpdatrReport);

          if (_UpdatrReport) {
            Data();
            props.checkSetProps(false);
            props.setOnLoading(true);
            props.setEditReportProps([]);

            props.toggleDialog();
          }
        }
      } catch (error) {}
    }
  }
  const searchTextEnter = (event: any, key: any, rowData: any) => {
    if (event.length < 1) return;
    let _rowData: any = rowData;
    let _filterValueSelected = filterValueSelected;
    _rowData.FieldText.push({ FieldText: event });
    console.log("FilterValueSelected", filterValueSelected, _rowData);
    _filterValueSelected.map((_data: any) => {
      if (_data.FieldCode === rowData.FieldCode) {
        _data.FieldText = _rowData.FieldText;
      }
    });

    setFilterValueSelected([..._filterValueSelected]);
  };
  function remove_character(str: any, char_pos: any) {
    let part1 = str.substring(0, char_pos);
    let part2 = str.substring(char_pos + 1, str.length);
    return part1 + part2;
  }
  const footer = (
    <>
      <div className="referenceDocumentDialog-renderFooter-display">
        <ButtonComponents
          setLabelProps="Cancel"
          setIconProps={
            <IoCloseOutline size={"16px"} style={{ marginRight: "3px" }} />
          }
          onClickProps={() => {
            Data();
            if (props.editProps === true) {
              props.setEditReportProps([]);
            }
            props.toggleDialog();
          }}
          setClassNameProps="p-button-text referenceDocumentDialog-button"
          setStyleProps={{
            height: "38px",
            border: "0.5px solid #FF2626",
            background: "#FFFFFF",
            color: "#FF2626",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />

        <ButtonComponents
          setLabelProps="Save"
          setIconProps={<BiSave size={"16px"} style={{ marginRight: "3px" }} />}
          onClickProps={() => {
            // props.setOnLoading(true);
            _save();
          }}
          setStyleProps={{
            height: "38px",
            borderRadius: "6px",
            border: "1px solid rgb(40, 47, 106)",
            fontSize: "13px",
          }}
        />
      </div>
    </>
  );
  async function _fechData() {
    try {
      const _employee = await GetAllEmployee();
      const roles = await GetAllDynamic("Roles/GetAll", undefined);
      setReportModel((prevState: any) => ({
        ...prevState,
        CreateBy: userData.employeeData.EmployeeId.toString(),
        ModifiedBy: userData.employeeData.EmployeeId.toString(),
      }));
      setRoleData(roles);
      setEmployee(_employee);
      setSearchData(_employee);
    } catch (error) {
      console.log("report=>error", error);
    }
  }

  const onRowReorder = (e: any) => {
    // setTemplateFieldMulti(e.value);
    _SelectFliedMulti(e.value);
  };
  const onRowReorderFilter = (e: any) => {
    setFilterValueSelected(e.value);
  };
  const onTemplateMode = (e: any) => {
    setReportModel((prevState: any) => ({
      ...prevState,
      Mode: e.Mode === "Schedule Mode" ? true : false,
    }));
    setTemplateMode(e);
  };
  const onChangeReportName = (e: any, key: any) => {
    setReportModel((prevState: any) => ({
      ...prevState,
      [key]: e,
    }));
  };
  function onChangeDropdownSelectForm(e: any, editReport?: any) {
    let _dataFilter: any;
    let _dataArrya: any = [];

    let dataFilterValueSelected: any = filterValueSelected;

    e.map((_data: any) => {
      const characteristics = Object.entries(_data).map((key, i) => {
        console.log("key", key);
      });
      console.log("_________________________________________________________");
      console.log("FilterValueSelected", filterValueSelected);

      console.log("_________________________________________________________");
      let _objJson = {
        ID: 0,
        FieldCode: _data.key,
        FieldDisplay: _data.label,
        IsExcludeBlankData: true,
        FieldType: _data.type,
        IsEquals: false,
        FieldText: [],
        FieldTextFrom: null,
        FieldTextTo: null,
        FieldBit: null,
        FieldTypeFilterStatic: _data.FieldTypeFilterStatic,
        FieldTypeFilterDynamic: _data.FieldTypeFilterDynamic,
        IsTodayFrom: false,
        IsTodayTo: false,
        FilterParameter: "",
        indexHideColumn: null,
        SecretId: null,
      };
      if (dataFilterValueSelected.length !== 0) {
        let FilterValueSelected = dataFilterValueSelected.filter(
          (item: any) => item.FieldCode === _objJson.FieldCode
        );
        if (FilterValueSelected.length === 0) {
          dataFilterValueSelected.push(_objJson);
        } else {
          for (let i = 0; i < dataFilterValueSelected.length; i++) {
            const filter = dataFilterValueSelected[i];
            if (filter.FieldCode === FilterValueSelected[0].FieldCode) {
              dataFilterValueSelected[i] = filter;
            }
          }
        }
      } else {
        dataFilterValueSelected.push(_objJson);
      }
      onChangeFilterValue(dataFilterValueSelected);

      setFilterValueSelected([...dataFilterValueSelected]);
    });

    if (e.length !== filterValueSelected.length) {
      e.map((_data: any) => {
        _dataFilter = filterValueSelected.filter(
          (item: any) => _data.key === item.FieldCode
        );
        if (_dataFilter.length !== 0) {
          _dataArrya.push(_dataFilter[0]);
        }
      });
      console.log("dataFilterValueSelected", _dataArrya);
      setFilterValueSelected([..._dataArrya]);
    }
    console.log("eeeeeeeeeeeeeeeeeeeee", e);
    // selectedField
    // if (_dataArrya.length !== 0) {
    //   let _arrayElement: any = [];
    //   for (let i = 0; i < _dataArrya.length; i++) {
    //     const element = _dataArrya[i];
    //     for (let j = 0; j < e.length; j++) {
    //       const _element = e[j];
    //       if (element.key === _element.key) {
    //         _arrayElement.push(element);
    //       }
    //     }
    //   }
    //   setSelectedField(_arrayElement);
    // } else {
    //   setSelectedField([]);
    // }
    setSelectedField(e);
  }
  function onChangeFilterValue(e: any) {
    setFilterValue(e);
  }

  function onChangeFilterNo(e: any) {}

  function onChangeGroupData(e: any, key: any) {
    if (key !== undefined && key !== null) {
      let _FilterValueSelected = templateFieldMulti;
      for (let i = 0; i < _FilterValueSelected.length; i++) {
        const allFilter = _FilterValueSelected[i];
        _FilterValueSelected[i][key] = null;
      }
      for (let i = 0; i < _FilterValueSelected.length; i++) {
        const allFilter = _FilterValueSelected[i];
        for (let j = 0; j < e.length; j++) {
          const valueSelected = e[j];
          console.log("allFilter", allFilter);
          console.log("allFilter", valueSelected);

          if (allFilter?.key === valueSelected?.key) {
            _FilterValueSelected[i][key] = "1";
          }
        }
      }

      setReportModel((prevState: any) => ({
        ...prevState,
        Selectedfieldlist: [..._FilterValueSelected],
      }));
      setTemplateFieldMulti([..._FilterValueSelected]);
      if (key === "indexGroupBy") {
        setGroupData(e);
      }
      if (key === "indexOrderBy") {
        setIndexOrderBy(e);
      }
      if (key === "indexHideColumn") {
        setIndexHideColumn(e);
      }
      if (key === "indexSortingBy") {
        setIndexSortingBy(e);
      }
    }
  }
  function onChangeDropdownfilterValue(e: any, data: any) {
    let _FilterValueSelected = filterValueSelected;
    let _dataFilter = _FilterValueSelected.filter(
      (item: any) => item.FieldCode === e.FieldCode
    );
    if (_dataFilter.length !== 0) {
      for (let index = 0; index < _FilterValueSelected.length; index++) {
        const element = _FilterValueSelected[index].FieldCode;
        if (_dataFilter[0].FieldCode === element) {
          _FilterValueSelected[index] = {
            ..._dataFilter[0],

            FilterParameter:
              data.Filter === "Contains"
                ? "Like"
                : data.Filter === "Not Contains"
                ? "Not Like"
                : data.Filter,
          };
        }
      }
    }
    console.log("_FilterValueSelected", _FilterValueSelected);

    setFilterValueSelected([..._FilterValueSelected]);
    setDropdownfilterValue(data);
  }
  function addTemplateKey() {
    try {
      let _TemplateKey = props.templateDataProps;
      let _TemplateKeyArray: any = [];
      _TemplateKey?.map((_data: any) => {
        _TemplateKeyArray.push({
          ..._data,
          TemplateKey: _data.TemplateNameWithCode,
        });
      });
      console.log("_TemplateKeyArray", _TemplateKeyArray);

      setTemplateKey(_TemplateKeyArray);
    } catch (error) {}

    // + "(" + _data.TemplateId + ")",
  }
  async function _RadioButtonFormType(data: any, key: any, rowData: any) {
    let _FilterValueSelected = filterValueSelected;
    if (key !== "Private" && key !== "Public") {
      let _dataFilter = _FilterValueSelected.filter(
        (item: any) => item.FieldCode === rowData.FieldCode
      );
      if (_dataFilter.length !== 0) {
        for (let index = 0; index < _FilterValueSelected.length; index++) {
          const element = _FilterValueSelected[index].FieldCode;
          if (_dataFilter[0].FieldCode === element) {
            _FilterValueSelected[index] = {
              ..._dataFilter[0],

              [key]: data,
            };
          }
        }
      }

      setFilterValueSelected([..._FilterValueSelected]);
      if (key === "IsTodayFrom") {
        setRadioButtonCheckFrom(data);
      } else {
        setRadioButtonCheckToday(data);
      }
    }
    if (key === "Private" || key === "Public") {
      setReportModel((prevState: any) => ({
        ...prevState,
        IsPrivate: data,
      }));

      setRadioButtonCheck(data);
    }
  }
  async function _SelectFormEdit(e: any, _dataJSONParse: any) {
    let arrayTemplate: any = [];
    console.log("eeeeeeee", e);

    setTemplateMulti(e);

    _SelectFliedEdit(e, _dataJSONParse);
    _SelectFliedMulti(_dataJSONParse);
  }
  async function _SelectForm(e: any) {
    let arrayTemplate: any = [];
    console.log("eeeeeeeeeeeeeeeeeeee", e);
    if (e) {
      e.map((data: any) => {
        arrayTemplate.push(data.DocumentCode);
      });

      setTemplateMulti(e);

      _SelectFlied(e);
      setReportModel((prevState: any) => ({
        ...prevState,
        TemplateId: arrayTemplate.toString().replaceAll(",", "|"),
      }));
    } else {
      setTemplateMulti([]);

      _SelectFlied([]);
      setReportModel((prevState: any) => ({
        ...prevState,
        TemplateId: "",
      }));
    }
  }
  function _CalendarDate(e: any, rowdata: any, key: any) {
    console.log("rowdata", rowdata);
    console.log("e", e);

    let _FilterValueSelected = filterValueSelected;
    let _dataFilter = _FilterValueSelected.filter(
      (item: any) => item.FieldCode === rowdata.FieldCode
    );

    let _DateTime: any = formatDateTime(e);
    if (_dataFilter.length !== 0) {
      for (let index = 0; index < _FilterValueSelected.length; index++) {
        const element = _FilterValueSelected[index].FieldCode;
        if (_dataFilter[0].FieldCode === element) {
          _FilterValueSelected[index] = {
            ..._dataFilter[0],
            [key]: _DateTime,
          };
        }
      }
    }

    setFilterValueSelected([..._FilterValueSelected]);
  }
  const formatDateTime = (value: any) => {
    if (value != "") {
      let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
      const NewDate = moment(someDateString).format("DD/MM/yyyy");
      return NewDate;
    } else {
      const NewDate = "";
      return NewDate;
    }
  };
  async function _SelectFliedMulti(edit: any) {
    console.log("editeeeeeeeeeeeeeeeeeeeeee", edit);

    let arrayPush: any = [];
    if (edit) {
      for (let i = 0; i < edit.length; i++) {
        const element = edit[i];
        for (let j = 0; j < filterValueSelected.length; j++) {
          const _element = filterValueSelected[j];

          if (element.key === _element.FieldCode) {
            arrayPush.push(_element);
          }
        }
      }
      console.log("arrayPush", arrayPush);
      console.log("arrayPush", selectedField);
      let arraySelected: any = [];
      if (arrayPush.length !== 0) {
        for (let i = 0; i < arrayPush.length; i++) {
          const element = arrayPush[i];
          for (let j = 0; j < selectedField.length; j++) {
            const _element = selectedField[j];
            if (element.FieldCode === _element.key) {
              arraySelected.push(_element);
            }
          }
        }
        setSelectedField(arraySelected);
      } else {
        setSelectedField([]);
      }
      console.log("filterValueSelected", filterValueSelected);

      // filterValueSelected
      // onChangeDropdownSelectForm(edit);
      setFilterValueSelected(arrayPush);
      setReportModel((prevState: any) => ({
        ...prevState,
        Selectedfieldlist: edit,
      }));

      setTemplateFieldMulti(edit);
    } else {
      setSelectedField([]);

      setFilterValueSelected(arrayPush);
      setReportModel((prevState: any) => ({
        ...prevState,
        Selectedfieldlist: [],
      }));

      setTemplateFieldMulti([]);
    }
  }
  async function showModal(key: any) {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    setDialogVisible(!isDialogVisible);
    setKeyAutoComplete(key);
  }
  async function _SelectFliedEdit(e: any, edit: any) {
    let arrayFlied: any = [];
    let arrayFliedTest: any = [];
    let arrayFliedId: any = [];
    let _selectFliedData = e;
    console.log("e", e);

    // if (edit !== undefined && edit.length !== 0) {
    //   onChangeFilterValue(edit);
    // }
    for (let i = 0; i < _selectFliedData.length; i++) {
      const element = _selectFliedData[i];
      arrayFliedId.push(_selectFliedData[i]?.TemplateId.toString());
    }

    let replaceString = arrayFliedId.toString().replaceAll(",", "|");
    console.log("replaceString", replaceString);

    let _objJson = {
      TemplateID: replaceString,
      Templateversion: "0",
      ReporttemplateID: null,
    };

    if (_selectFliedData.length !== 0) {
      let _templateSelect: any = await ReportListTemplateSelect(_objJson);
      let _SelectedfieldlistAll = _templateSelect.SelectedfieldlistAll;

      for (let i = 0; i < _SelectedfieldlistAll.length; i++) {
        const element = _SelectedfieldlistAll[i];

        delete _SelectedfieldlistAll[i]["value"];
        arrayFliedTest.push(_SelectedfieldlistAll[i]);
      }
      console.log("arrayFliedTest", arrayFliedTest);
      console.log("arrayFliedTest", edit);
      for (let inx = 0; inx < edit.length; inx++) {
        const element = edit[inx];

        // for (let j = 0; j < arrayFliedTest.length; j++) {
        //   const _element = arrayFliedTest[j];

        //   if (element.key === _element.key) {
        //     console.log("element____________", element);
        //     // arrayFliedTest.push(element);
        //   }
        // }
        let _dataFilter = arrayFliedTest.filter(
          (item: any) => element.key === item.key
        );
        if (_dataFilter.length === 0) {
          arrayFliedTest.push(element);
        }
        console.log("_dataFilter", _dataFilter, element);

        // if (_dataFilter.length !== 0) {
        //   console.log("_dataFilter", _dataFilter);
        // }
      }
      setTemplateField(arrayFliedTest);
      // setSelectedField(selectedField);
    } else {
      setTemplateField([]);
    }
    let arrayFieldMulti: any = [];
    if (templateFieldMulti.length !== 0) {
      for (let i = 0; i < templateFieldMulti.length; i++) {
        if (arrayFliedTest.length !== 0) {
          let arrayFliedFliter = arrayFliedTest.filter(
            (_item: any) => templateFieldMulti[i].label === _item.label
          );
          if (arrayFliedFliter.length !== 0) {
            arrayFieldMulti.push(arrayFliedFliter[0]);
          }
        }
      }
      console.log("arrayFieldMulti", arrayFieldMulti);

      setTemplateFieldMulti(arrayFieldMulti);
      if (arrayFieldMulti.length === 0) {
        setFilterValueSelected([]);
        console.log("selectedFieldzzzzzzzzzzzzz", selectedField);
      } else {
        let _arraykey: any = [];
        for (let i = 0; i < arrayFieldMulti.length; i++) {
          const element = arrayFieldMulti[i];
          for (let j = 0; j < selectedField.length; j++) {
            const _element = selectedField[j];
            if (element.key === _element.key) {
              _arraykey.push(_element);
            }
          }
        }
        console.log("_arraykey", _arraykey);

        setFilterValueSelected(_arraykey);
      }
    }
  }
  async function _SelectFlied(e: any) {
    let arrayFlied: any = [];
    let arrayFliedTest: any = [];
    let arrayFliedId: any = [];
    let _selectFliedData = e;
    console.log("e", e);

    // if (edit !== undefined && edit.length !== 0) {
    //   onChangeFilterValue(edit);
    // }
    for (let i = 0; i < _selectFliedData.length; i++) {
      const element = _selectFliedData[i];
      arrayFliedId.push(_selectFliedData[i].TemplateId.toString());
    }

    let replaceString = arrayFliedId.toString().replaceAll(",", "|");
    console.log("replaceString", replaceString);

    let _objJson = {
      TemplateID: replaceString,
      Templateversion: "0",
      ReporttemplateID: null,
    };

    if (_selectFliedData.length !== 0) {
      let _templateSelect: any = await ReportListTemplateSelect(_objJson);
      let _SelectedfieldlistAll = _templateSelect.SelectedfieldlistAll;

      for (let i = 0; i < _SelectedfieldlistAll.length; i++) {
        const element = _SelectedfieldlistAll[i];

        delete _SelectedfieldlistAll[i]["value"];
        arrayFliedTest.push(_SelectedfieldlistAll[i]);
      }
      console.log(
        "arrayFliedTest_templateSelect_templateSelect",
        arrayFliedTest,
        _templateSelect
      );

      setTemplateField(arrayFliedTest);
      // setSelectedField(selectedField);
    } else {
      setTemplateField([]);
    }
    let arrayFieldMulti: any = [];
    if (templateFieldMulti.length !== 0) {
      for (let i = 0; i < templateFieldMulti.length; i++) {
        if (arrayFliedTest.length !== 0) {
          let arrayFliedFliter = arrayFliedTest.filter(
            (_item: any) => templateFieldMulti[i].label === _item.label
          );
          if (arrayFliedFliter.length !== 0) {
            arrayFieldMulti.push(arrayFliedFliter[0]);
          }
        }
      }

      setTemplateFieldMulti(arrayFieldMulti);
      if (arrayFieldMulti.length === 0) {
        setFilterValueSelected([]);
        console.log("selectedFieldzzzzzzzzzzzzz", selectedField);
      } else {
        let _arraykey: any = [];
        for (let i = 0; i < arrayFieldMulti.length; i++) {
          const element = arrayFieldMulti[i];
          for (let j = 0; j < selectedField.length; j++) {
            const _element = selectedField[j];
            if (element.key === _element.key) {
              _arraykey.push(_element);
            }
          }
        }
        console.log("_arraykey", _arraykey);

        setFilterValueSelected(_arraykey);
      }
    }

    // selectedField
    console.log(
      "selectedFieldjjjjjjjjjjjjjjjj",
      selectedField,
      arrayFieldMulti
    );
    // console.log("selectedField",selectedField);
    let _arrayKey: any = [];
    for (let i = 0; i < selectedField.length; i++) {
      const element = selectedField[i];
      for (let j = 0; j < arrayFieldMulti.length; j++) {
        const _element = arrayFieldMulti[j];
        if (element.key === _element.key) {
          _arrayKey.push(element);
        }
      }
    }

    setSelectedField(_arrayKey);
    _SelectFliedMulti(_arrayKey);
  }

  function _AutoComplete(data: any, key: any) {
    let _dataName: any = [];
    if (key === "RoleEmp") {
      data.map((_data: any) => {
        _dataName.push(_data.EmployeeId);
      });
      setEmployeeRequest(data);
    }
    if (key === "RoleId") {
      data.map((_data: any) => {
        _dataName.push(_data.RoleId);
      });
      setGroup(data);
    }
    setReportModel((prevState: any) => ({
      ...prevState,
      [key]: _dataName.toString(),
    }));
  }
  const _AutoCompleteText = (data: any, key: any, rowData: any) => {
    let _filterValueSelected = filterValueSelected;

    for (let i = 0; i < _filterValueSelected.length; i++) {
      const element = _filterValueSelected[i];
      if (rowData.FieldCode === element.FieldCode) {
        rowData.FieldText = [];

        _filterValueSelected[i].FieldText = data;
      }
    }
    setFilterValueSelected([..._filterValueSelected]);
  };
  return (
    <>
      <Dialog
        footer={footer}
        visible={props.visible}
        style={{ Height: "100%", width: "80vw" }}
        modal
        blockScroll={true}
        draggable={false}
        onHide={() => {
          Data();
          if (props.editProps === true) {
            props.setEditReportProps([]);
          }
          props.toggleDialog();
        }}
        breakpoints={{ "1348px": "75vw" }}
        onClick={() => {
          console.log(
            "reportModelreportModelreportModelreportModel",
            reportModel,
            validationForm
          );
        }}
        className="header-text"
      >
        <div
          className="dialog-content"
          style={{
            padding: "4px 3.5rem 1rem 1.5rem",
            marginTop: "0",
            width: "100%",
          }}
        >
          <div>
            <Row>
              <Col xs={12} sm={12} xl={12}>
                <p className="referenceDocumentDialog-dialog-p-textheader">
                  {textHeader}
                </p>
              </Col>
            </Row>
          </div>
          <p style={{ borderBottom: "1px solid #cfcfcf" }}></p>
          <Row className="report-row">
            <Col xs={12} sm={12} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Select Form : "}
                textSubProps={"เลือกแบบฟอร์ม"}
                isRequir
              />
            </Col>
            <Col xs={12} md={12} lg={10} xl={10}>
              <Controller
                name="Select_Form"
                control={control}
                render={({ field, fieldState }) => (
                  <MultiSelect
                    id={"Select_Form"}
                    value={templateMulti}
                    options={templateKey}
                    dataKey="TemplateId"
                    onChange={(e: any) => {
                      _SelectForm(e.value);
                    }}
                    optionLabel="TemplateKey"
                    placeholder="-- Please Select --"
                    display="chip"
                    style={{ width: "100% ", fontSize: "13px" }}
                    className={
                      validationForm.TemplateIdValidation === true
                        ? templateMulti.length !== 0
                          ? ""
                          : "Validation"
                        : ""
                    }
                    filter
                    resetFilterOnHide
                  />
                )}
              />
            </Col>
          </Row>
          <Row className="report-row">
            <Col xs={12} sm={12} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Template Mode : "}
                textSubProps={"เวอร์ชั่นการแสดงผล"}
                isRequir
              />
            </Col>
            <Col xs={12} md={12} lg={10} xl={10}>
              <Controller
                name="Template_Mode"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={"Template_Mode"}
                    value={templateMode}
                    placeholder="--- Please select ---"
                    optionLabel="Mode"
                    className="report-input"
                    options={[{ Mode: "Real Time" }, { Mode: "Schedule Mode" }]}
                    onChange={(e: any) => onTemplateMode(e.value)}
                  />
                )}
              />
            </Col>
          </Row>
          <Row className="report-row">
            <Col xs={12} sm={12} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Select Field : "}
                textSubProps={"เลือกแบบฟอร์ม"}
                isRequir
              />
            </Col>
            <Col xs={12} md={12} lg={10} xl={10}>
              <Controller
                name="Select_Flied"
                control={control}
                render={({ field, fieldState }) => (
                  <MultiSelect
                    id={"Select_Flied"}
                    value={templateField.length !== 0 ? templateFieldMulti : []}
                    options={templateField}
                    onChange={(e: any) => {
                      _SelectFliedMulti(e.value);
                    }}
                    dataKey="key"
                    optionLabel="label"
                    placeholder="-- Please Select --"
                    display="chip"
                    style={{ width: "100% ", fontSize: "13px" }}
                    className={
                      validationForm.FieldCollectionValidation === true
                        ? templateFieldMulti.length !== 0
                          ? ""
                          : "Validation"
                        : ""
                    }
                    filter
                    resetFilterOnHide
                    showClear
                  />
                )}
              />
            </Col>
          </Row>
          <Row className="report-row">
            <Col xs={6} md={6} lg={6} xl={6}>
              <div className="report-card">
                <div className="report-card-header">
                  <p className="card-header-text">Selected Field</p>
                </div>
                <div className="report-card-body" style={{ height: "550px" }}>
                  <Controller
                    name="Template_Mode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DataTable
                        value={templateFieldMulti}
                        onRowReorder={onRowReorder}
                        selection={selectedField}
                        onSelectionChange={(e: any) =>
                          onChangeDropdownSelectForm(e.value)
                        }
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
              {selectedField.length !== 0 &&
                filterValueSelected.length !== 0 && (
                  <>
                    <div className="report-card">
                      <div className="report-card-header">
                        <p className="card-header-text">Filter Value</p>
                      </div>
                      <div
                        className="report-card-body"
                        style={{ height: "550px" }}
                      >
                        <Controller
                          name="Template_Mode"
                          control={control}
                          render={({ field, fieldState }) => (
                            <DataTable
                              value={filterValueSelected}
                              onRowReorder={onRowReorderFilter}
                              selection={filterValue}
                              onSelectionChange={(e: any) =>
                                onChangeFilterValue(e.value)
                              }
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
                                body={(rowData: any) => {
                                  if (
                                    rowData.FieldTypeFilterDynamic === "d" ||
                                    rowData.FieldTypeFilterStatic === "Datetime"
                                  ) {
                                    return (
                                      <>
                                        {filterValueSelected !== undefined ? (
                                          filterValueSelected.length !== 0 ? (
                                            filterValueSelected.map(
                                              (data: any) => {
                                                let dateFormat: any =
                                                  rowData.FieldTextFrom !==
                                                    undefined &&
                                                  rowData.FieldTextFrom !==
                                                    null &&
                                                  rowData.FieldTextFrom
                                                    .length !== 0
                                                    ? moment(
                                                        moment(
                                                          formatDate(
                                                            rowData.FieldTextFrom
                                                          )
                                                        ).format("DD MMM YYYY"),
                                                        "DD MMM YYYY"
                                                      ).toDate()
                                                    : "";

                                                if (
                                                  data.FieldCode ===
                                                  rowData.FieldCode
                                                ) {
                                                  return (
                                                    <>
                                                      <p>
                                                        {"From("}
                                                        <RadioButtonComponents
                                                          inputIdProps={true}
                                                          nameProps={true}
                                                          valueProps={
                                                            !radioButtonCheckFrom
                                                          }
                                                          onChangeProps={(
                                                            e: any
                                                          ) =>
                                                            _RadioButtonFormType(
                                                              e,
                                                              "IsTodayFrom",
                                                              rowData
                                                            )
                                                          }
                                                          checkedProps={
                                                            rowData.IsTodayFrom ===
                                                            true
                                                          }
                                                          labelProps={""}
                                                          keyProps={"From"}
                                                        />
                                                        {"Today"} {")"}
                                                      </p>
                                                      <Calendar
                                                        id="basic"
                                                        onChange={(e) =>
                                                          _CalendarDate(
                                                            e.value,
                                                            rowData,
                                                            "FieldTextFrom"
                                                          )
                                                        }
                                                        style={{
                                                          marginBottom: "1em",
                                                        }}
                                                        inputStyle={{
                                                          borderRadius: "6px",
                                                          width: "100%",
                                                          height: "38px",
                                                        }}
                                                        showButtonBar
                                                        value={dateFormat}
                                                        dateFormat={"dd M yy"}
                                                        readOnlyInput
                                                      />
                                                    </>
                                                  );
                                                }
                                              }
                                            )
                                          ) : (
                                            <></>
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    );
                                  }
                                  let _dataFilter: any = [];
                                  if (filterValueSelected.length !== 0) {
                                    _dataFilter = filterValueSelected.filter(
                                      (item: any) =>
                                        rowData.FieldCode === item.FieldCode
                                    );
                                  }
                                  if (
                                    rowData.FieldTypeFilterDynamic !== "d" &&
                                    rowData.FieldTypeFilterStatic !== "Datetime"
                                  ) {
                                    return (
                                      <>
                                        <Dropdown
                                          value={
                                            _dataFilter.length !== 0
                                              ? _dataFilter[0].IsEquals === true
                                                ? { Filter: "Equals" }
                                                : {
                                                    Filter:
                                                      _dataFilter[0]
                                                        .FilterParameter ===
                                                      "Like"
                                                        ? "Contains"
                                                        : _dataFilter[0]
                                                            .FilterParameter ===
                                                          "Not Like"
                                                        ? "Not Contains"
                                                        : _dataFilter[0]
                                                            .FilterParameter,
                                                  }
                                              : []
                                          }
                                          id={"Template_version"}
                                          placeholder="--- Please select ---"
                                          optionLabel="Filter"
                                          className="report-input"
                                          options={[
                                            { Filter: "Equals" },
                                            { Filter: "Not Equals" },
                                            { Filter: "Contains" },
                                            { Filter: "Not Contains" },
                                          ]}
                                          onChange={(e: any) => {
                                            onChangeDropdownfilterValue(
                                              rowData,
                                              e.value
                                            );
                                          }}
                                        />
                                      </>
                                    );
                                  }
                                }}
                              ></Column>
                              <Column
                                style={{ flexGrow: 1, flexBasis: "200px" }}
                                body={(rowData: any) => {
                                  if (
                                    rowData.FieldTypeFilterDynamic === "d" ||
                                    rowData.FieldTypeFilterStatic === "Datetime"
                                  ) {
                                    return (
                                      <>
                                        {filterValueSelected !== undefined ? (
                                          filterValueSelected.length !== 0 ? (
                                            filterValueSelected.map(
                                              (data: any) => {
                                                let dateFormat: any =
                                                  rowData.FieldTextTo !==
                                                    undefined &&
                                                  rowData.FieldTextTo !==
                                                    null &&
                                                  rowData.FieldTextTo.length !==
                                                    0
                                                    ? moment(
                                                        moment(
                                                          formatDate(
                                                            rowData.FieldTextTo
                                                          )
                                                        ).format("DD MMM YYYY"),
                                                        "DD MMM YYYY"
                                                      ).toDate()
                                                    : "";

                                                if (
                                                  data.FieldCode ===
                                                  rowData.FieldCode
                                                ) {
                                                  return (
                                                    <>
                                                      <p>
                                                        To (
                                                        <RadioButtonComponents
                                                          inputIdProps={true}
                                                          nameProps={true}
                                                          valueProps={
                                                            !radioButtonCheckToday
                                                          }
                                                          onChangeProps={(
                                                            e: any
                                                          ) =>
                                                            _RadioButtonFormType(
                                                              e,
                                                              "IsTodayTo",
                                                              rowData
                                                            )
                                                          }
                                                          checkedProps={
                                                            rowData.IsTodayTo ===
                                                            true
                                                          }
                                                          keyProps={"Today"}
                                                          labelProps={""}
                                                        />
                                                        Today )
                                                      </p>
                                                      <Calendar
                                                        id="basic"
                                                        monthNavigator
                                                        yearNavigator
                                                        yearRange="2010:2030"
                                                        onChange={(e) =>
                                                          _CalendarDate(
                                                            e.value,
                                                            rowData,
                                                            "FieldTextTo"
                                                          )
                                                        }
                                                        inputStyle={{
                                                          borderRadius: "6px",
                                                          height: "38px",
                                                        }}
                                                        showButtonBar
                                                        value={dateFormat}
                                                        dateFormat={"dd M yy"}
                                                        readOnlyInput
                                                      />
                                                    </>
                                                  );
                                                }
                                              }
                                            )
                                          ) : (
                                            <></>
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    );
                                  } else {
                                    return (
                                      <>
                                        {filterValueSelected !== undefined ? (
                                          filterValueSelected.length !== 0 ? (
                                            filterValueSelected.map(
                                              (data: any) => {
                                                if (
                                                  data.FieldCode ===
                                                  rowData.FieldCode
                                                ) {
                                                  console.log(
                                                    "rowDatarowDatarowData",
                                                    rowData.FieldText
                                                  );

                                                  return (
                                                    <>
                                                      <AutoCompleteComponents
                                                        notButton={true}
                                                        fieldProps="FieldText"
                                                        onChangeProps={(
                                                          e: any
                                                        ) =>
                                                          _AutoCompleteText(
                                                            e,
                                                            "FieldText",
                                                            rowData
                                                          )
                                                        }
                                                        onBlur={(e: any) =>
                                                          searchTextEnter(
                                                            e,
                                                            "FieldText",
                                                            rowData
                                                          )
                                                        }
                                                        valueProps={
                                                          rowData.FieldText !==
                                                            undefined &&
                                                          rowData.FieldText
                                                            .length !== 0 &&
                                                          typeof rowData.FieldText ===
                                                            "object"
                                                            ? rowData.FieldText
                                                            : []
                                                        }
                                                        keyProps={"FieldText"}
                                                        styleProps={{
                                                          height:
                                                            rowData?.FieldText !==
                                                            undefined
                                                              ? rowData
                                                                  ?.FieldText
                                                                  .length === 0
                                                                ? "38px"
                                                                : "100%"
                                                              : "38px",
                                                          width: "100%",
                                                          borderRadius:
                                                            "6px 6px 6px 6px",
                                                        }}
                                                        onKeyPress={(e: any) =>
                                                          searchTextEnter(
                                                            e,
                                                            "FieldText",
                                                            rowData
                                                          )
                                                        }
                                                      />

                                                      {/* <InputText
                                                      id={"Select_Form"}
                                                      className="report-input"
                                                    /> */}
                                                    </>
                                                  );
                                                }
                                              }
                                            )
                                          ) : (
                                            <></>
                                          )
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    );

                                    //   <>
                                    //     <InputText
                                    //       id={"Select_Form"}
                                    //       className="report-input"
                                    //     />
                                    //   </>
                                    // );
                                  }
                                }}
                              ></Column>
                            </DataTable>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
            </Col>
          </Row>
          <Row className="report-row">
            <Col className="report-row">
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Report Name : "}
                  textSubProps={"ชื่อรายงาน"}
                  isRequir
                />
              </Col>
              <Col xs={10} md={10} lg={10} xl={10}>
                <Controller
                  name="Report_Name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={"Report_Name"}
                      onChange={(e) =>
                        onChangeReportName(e.target.value, "ReportName")
                      }
                      className={
                        validationForm.ReportNameValidation === true
                          ? reportModel.ReportName !== undefined &&
                            reportModel.ReportName !== null &&
                            reportModel.ReportName.length !== 0
                            ? "report-input"
                            : "Validation report-input"
                          : "report-input"
                      }
                      value={reportModel.ReportName}
                      // onFocus={true}
                      // Foc
                    />
                  )}
                />
              </Col>
            </Col>
          </Row>
          <Row className="report-row">
            {" "}
            <Col className="report-row">
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Report Description  : "}
                  textSubProps={"รายละเอียดรายงาน"}
                  isRequir
                />
              </Col>
              <Col xs={12} md={12} lg={10} xl={10}>
                <Controller
                  name="Report_Description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={"Report_Description"}
                      onChange={(e) =>
                        onChangeReportName(e.target.value, "ReportDescription")
                      }
                      className={
                        validationForm.ReportDescriptionValidation === true
                          ? reportModel.ReportDescription !== undefined &&
                            reportModel.ReportDescription !== null &&
                            reportModel.ReportDescription.length !== 0
                            ? "report-input"
                            : "Validation report-input"
                          : "report-input"
                      }
                      value={reportModel.ReportDescription}
                    />
                  )}
                />
              </Col>
            </Col>
          </Row>
          <Row className="report-row">
            <Col className="report-row">
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Data Control :"}
                  textSubProps={"รายละเอียดรายงาน"}
                />
              </Col>
              <Col xs={5} md={5} lg={5} xl={5}>
                <Controller
                  name="Select_Form"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <MultiSelect
                        id={"Select_Form"}
                        value={groupData}
                        options={templateFieldMulti}
                        optionLabel="label"
                        placeholder="-- Please Select --"
                        display="chip"
                        style={{ width: "95% ", fontSize: "13px" }}
                        dataKey="key"
                        onChange={(e: any) => {
                          onChangeGroupData(e.value, "indexGroupBy");
                        }}
                      />

                      <TextHeaderComponents
                        textSubProps={"Select field for group data."}
                      />
                    </>
                  )}
                />
              </Col>

              <Col xs={5} md={5} lg={5} xl={5}>
                <Controller
                  name="Select_Form"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <MultiSelect
                        id={"Select_Form"}
                        value={indexOrderBy}
                        options={templateFieldMulti}
                        dataKey="key"
                        onChange={(e: any) => {
                          onChangeGroupData(e.value, "indexOrderBy");
                        }}
                        optionLabel="label"
                        placeholder="-- Please Select --"
                        display="chip"
                        style={{ width: "100% ", fontSize: "13px" }}
                      />

                      <TextHeaderComponents
                        textSubProps={
                          "Select field relate field group by for order data."
                        }
                      />
                    </>
                  )}
                />
              </Col>
            </Col>
          </Row>
          <Row className="report-row">
            <Col className="report-row">
              <Col xs={2} sm={2} xl={2}></Col>
              <Col xs={5} md={5} lg={5} xl={5}>
                <Controller
                  name="Select_Form"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <MultiSelect
                        id={"Select_Form"}
                        value={indexHideColumn}
                        options={templateFieldMulti}
                        dataKey="key"
                        onChange={(e: any) => {
                          onChangeGroupData(e.value, "indexHideColumn");
                        }}
                        optionLabel="label"
                        placeholder="-- Please Select --"
                        display="chip"
                        style={{ width: "95% ", fontSize: "13px" }}
                      />

                      <TextHeaderComponents
                        textSubProps={"Select field for Hide Column"}
                      />
                    </>
                  )}
                />
              </Col>

              <Col xs={5} md={5} lg={5} xl={5}>
                <Controller
                  name="Select_Form"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <MultiSelect
                        id={"Select_Form"}
                        value={indexSortingBy}
                        options={templateFieldMulti}
                        dataKey="key"
                        onChange={(e: any) => {
                          onChangeGroupData(e.value, "indexSortingBy");
                        }}
                        optionLabel="label"
                        placeholder="-- Please Select --"
                        display="chip"
                        style={{ width: "100% ", fontSize: "13px" }}
                      />

                      <TextHeaderComponents
                        textSubProps={"Select field for Sorting data."}
                      />
                    </>
                  )}
                />
              </Col>
            </Col>
          </Row>
          <div>
            <Row>
              <Col xs={12} sm={12} xl={12}>
                <p className="referenceDocumentDialog-dialog-p-textheader">
                  Edit / User Permission
                </p>
              </Col>
            </Row>
          </div>
          <p style={{ borderBottom: "1px solid #cfcfcf" }}></p>
          <Row className="report-row">
            <Col className="report-row">
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Employee (s) : "}
                  textSubProps={"คนที่ให้สิทธิ์ในการขอเฉพาะ"}
                />
              </Col>
              <Col
                xs={10}
                md={10}
                lg={10}
                xl={10}
                style={{ marginLeft: "4px" }}
              >
                <Controller
                  name="Select_Flied"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <div className="p-inputgroup">
                        <div
                          style={{ paddingBottom: "3px", width: "100%" }}
                          onClick={() => showModal("RoleEmp")}
                        >
                          <AutoCompleteComponents
                            fieldProps={
                              userData.Lang === "EN" ? "NameEn" : "NameTh"
                            }
                            valueProps={employeeRequest}
                            styleProps={{
                              width: "100%",
                              height:
                                employeeRequest === undefined ||
                                employeeRequest === null
                                  ? "38px"
                                  : employeeRequest.length !== 0
                                  ? "100%"
                                  : "38px",
                            }}
                            readOnlyprops={true}
                            onChangeProps={_AutoComplete}
                            keyProps={"RoleEmp"}
                          />
                        </div>
                        <ButtonComponents
                          setIconProps={"pi pi-search"}
                          setClassNameProps={"p-button-text-position"}
                          onClickProps={() => showModal("RoleEmp")}
                          setStyleProps={{
                            backgroundColor: "#282f6a",
                            border: "1px solid #282f6a",
                            borderTopRightRadius: "6px",
                            borderBottomRightRadius: "6px",
                            boxShadow: "none",
                            height:
                              employeeRequest === undefined ||
                              employeeRequest === null
                                ? "38px"
                                : employeeRequest.length !== 0
                                ? "100%"
                                : "38px",
                          }}
                        />
                      </div>

                      {/* <p>Validation Employee (s)</p> */}
                    </>
                  )}
                />
              </Col>
            </Col>
          </Row>
          <Row className="report-row">
            <Col className="report-row">
              <Col xs={2} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Group : "}
                  textSubProps={"กลุ่มคนที่ต้องการให้สิทธิ์"}
                />
              </Col>
              <Col
                xs={10}
                md={10}
                lg={10}
                xl={10}
                style={{ marginLeft: "4px" }}
              >
                <Controller
                  name="Group"
                  control={control}
                  render={({ field, fieldState }) => (
                    <MultiSelect
                      id={"Group"}
                      value={group}
                      options={roleData}
                      onChange={(e: any) => {
                        _AutoComplete(e.value, "RoleId");
                      }}
                      optionLabel="NameEn"
                      placeholder="-- Please Select --"
                      display="chip"
                      style={{ width: "100% ", fontSize: "13px" }}
                      filter
                      showClear
                      resetFilterOnHide
                    />
                  )}
                />
              </Col>
            </Col>
          </Row>
          <Row className="gutter-row">
            <Col xs={12} sm={2} xl={2}></Col>
            <Col
              xs={12}
              sm={10}
              xl={4}
              style={{
                marginTop: "-10px",
                display: "flex",
              }}
              className="informationComponents-media-department"
            >
              <div style={{ paddingBottom: "3px" }}>
                <RadioButtonComponents
                  inputIdProps={true}
                  nameProps={true}
                  valueProps={true}
                  onChangeProps={_RadioButtonFormType}
                  checkedProps={radioButtonCheck === true}
                  keyProps={"Private"}
                  labelProps={"Private"}
                />
              </div>
              <div style={{ paddingLeft: "4px" }}>
                <RadioButtonComponents
                  inputIdProps={false}
                  nameProps={false}
                  valueProps={false}
                  onChangeProps={_RadioButtonFormType}
                  checkedProps={radioButtonCheck === false}
                  labelProps={"Public"}
                  keyProps={"Public"}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
      <SelectDataDialog
        dataList={employee}
        dialogKey={"empList"}
        onSelectFunc={(rowData: any) => {
          try {
            let dataSelectEmployee: any[] = [];
            if (employeeRequest) {
              dataSelectEmployee = [...employeeRequest];
            }
            const datafilterEmployee = dataSelectEmployee.filter(
              (_data: any) =>
                _data.NameEn === rowData.data.NameEn ||
                _data.NameTh === rowData.data.NameTh
            );
            if (datafilterEmployee.length === 0) {
              dataSelectEmployee.push(rowData.data);
            }

            _AutoComplete(dataSelectEmployee, keyAutoComplete);
            setDialogVisible(false);
          } catch (error) {
            console.log("report=>error", error);
          }
        }}
        columns={[
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
        ]}
        dialogVisible={isDialogVisible}
        setDialogVisible={setDialogVisible}
      />
      {/* <EmployeeDialog
        isDialogVisibleProps={isDialogVisible}
        dataProps={employee}
        setDataProps={setSearchData}
        setisDialogVisibleProps={setDialogVisible}
        showModalProps={showModal}
        keyProps={keyAutoComplete}
        onRowSelectProps={_AutoComplete}
        searchDataProps={searchData}
        valueProps={employeeRequest}
      /> */}
    </>
  );
};
