import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import "./ReferenceDocumentDialog.css";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { BiSave } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { Col, Row } from "react-bootstrap";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { DropdownComponents } from "../../DropdownComponents/DropdownComponents";
import AutoCompleteComponents from "../../AutoCompleteComponents/AutoCompleteComponents";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import {
  TableSelectField,
  TableTemplateComponents,
  TableTemplateComponentsSelected,
} from "./TableTemplateComponents/TableTemplateComponents";
import {
  GetAllTemplate,
  GetTemplate,
  GetTemplateeBindFormNameDDL,
  GetTemplateTemplateListVersion,
} from "../../../Services/TemplateService";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { TableTemplateDialogComponents } from "./TableTemplateDialogComponents/TableTemplateDialogComponents";
import { MultiSelect } from "primereact/multiselect";
import { GetIsDocControl } from "../../../Services/MasterDataService";
import { Spin } from "antd";

interface Props {
  visibleProps: any;
  setVisibleProps: any;
  referenceDocumentObjProps?: any;
  TableTemplateSelectedProps?: any;
  keyProps?: any;
  stateProps: any;
  isLoadProps?: any;
}

export const ReferenceDocumentDialog = (props: Props) => {
  const [referenceDocumentDialogObject, setReferenceDocumentDialogObject] =
    useState<any>({
      RefDocDisplay: "",
      Display: { Position: "Top" },
      Mode: { Mode: "Single" },
      Affiliation: false,
      Quarter: false,
      IsDefaultLineApprove: false,
      DocControl: false,
      selectField: { selectField: "" },
      templateForm: [],
      tableDialog: false,
      rowDataTable: [],
      ReferenceForm: "",
      listRefTemplate: [],
      TemplateNewDoc: [],
      TemplateEditDoc: [],
      TemplateCancelDoc: [],
      SaveDataTable: [],
    });
  const [template, setTemplate] = useState<any>({});
  const [visibleIsDocControl, setVisibleIsDocControl] = useState<any>({
    TemplateNewDoc: false,
    TemplateEditDoc: false,
    TemplateCancelDoc: false,
  });

  const [filters, setFilters] = useState<any>({});
  const [isLoad, setIsLoad] = useState<any>(false);
  const [isLoadFetchData, setIsLoadLoadFetchData] = useState<any>(false);

  const [isLoadDropdown, setIsLoadDropdown] = useState<any>(true);
  const [globalFilterValueTemplate, setGlobalFilterValueTemplate] = useState();
  const [selectFieldtoshow, setSelectFieldtoshow] = useState<any>([]);
  const [templateAddCodeMulti, setTemplateAddCodeMulti] = useState<any>([]);
  const [selectFieldValidation, setSelectFieldValidation] =
    useState<boolean>(false);

  useEffect(() => {
    fetchTemplate();
  }, []);
  useEffect(() => {
    if (templateAddCodeMulti.length !== 0) {
      _IsDocControl(templateAddCodeMulti);
    }
  }, [templateAddCodeMulti, props.TableTemplateSelectedProps.lstMasterData]);
  useEffect(() => {
    if (selectFieldtoshow.length !== 0) {
      _selectField();
    }
  }, [referenceDocumentDialogObject, selectFieldtoshow]);
  useEffect(() => {
    console.log("selectFieldValidation", selectFieldValidation);
  }, [selectFieldValidation]);
  useEffect(() => {
    _ReferenceDocumentDialog(
      props.TableTemplateSelectedProps.listRefTemplate,
      "listRefTemplate"
    );

    _ReferenceDocumentDialog(
      props.TableTemplateSelectedProps.templateForm,
      "templateForm"
    );
  }, [
    props.TableTemplateSelectedProps.listRefTemplate,
    props.TableTemplateSelectedProps.templateForm,
  ]);
  useEffect(() => {
    _MapSelectTable(referenceDocumentDialogObject.listRefTemplate);
  }, [referenceDocumentDialogObject]);

  useEffect(() => {
    setIsLoadDropdown(true);
  }, [referenceDocumentDialogObject.listRefTemplate]);

  useEffect(() => {
    _RefDocDisplay();
  }, [props.referenceDocumentObjProps]);

  const onHide = () => {
    _ReferenceDocumentDialog(
      props.TableTemplateSelectedProps.listRefTemplate,
      "listRefTemplate"
    );

    _ReferenceDocumentDialog(
      props.TableTemplateSelectedProps.templateForm,
      "templateForm"
    );
    setTemplate(filters);
    props.setVisibleProps();
  };
  const onSave = () => {
    let _ArrayreferenceDocumentDialogObject = [];
    let _display = referenceDocumentDialogObject.Display.Position;
    let _Mode = referenceDocumentDialogObject.Mode.Mode;
    let _selectField = referenceDocumentDialogObject.selectField.selectField;
    let _affiliation = referenceDocumentDialogObject.Affiliation;
    let _quarter = referenceDocumentDialogObject.Quarter;
    let _isDefaultLineApprove =
      referenceDocumentDialogObject.IsDefaultLineApprove;

    let _templateNewDoc: any = [];
    let _templateEditDoc: any = [];
    let _templateCancelDoc: any = [];
    let arraylstMasterData: any = [];
    let lstMasterDataTemplateNewDocOBJ: any = {};
    let lstMasterDataTemplateEditDocOBJ: any = {};
    let lstMasterDataTemplateCancelDocOBJ: any = {};

    if (referenceDocumentDialogObject.DocControl === true) {
      if (
        referenceDocumentDialogObject.TemplateNewDoc.length !== 0 &&
        referenceDocumentDialogObject.TemplateEditDoc.length !== 0 &&
        referenceDocumentDialogObject.TemplateCancelDoc.length !== 0
      ) {
        referenceDocumentDialogObject.TemplateNewDoc.map((_data: any) => {
          _templateNewDoc.push(_data.TemplateId);
        });
        referenceDocumentDialogObject.TemplateEditDoc.map((_data: any) => {
          _templateEditDoc.push(_data.TemplateId);
        });
        referenceDocumentDialogObject.TemplateCancelDoc.map((_data: any) => {
          _templateCancelDoc.push(_data.TemplateId);
        });
        lstMasterDataTemplateNewDocOBJ = {
          masterId:
            props.stateProps === "edit"
              ? props.TableTemplateSelectedProps.lstMasterData[0]?.masterId ===
                undefined
                ? null
                : props.TableTemplateSelectedProps.lstMasterData[0].masterId
              : null,
          createdBy: null,
          createdDate: null,
          isActive: true,
          masterType: "D_NewTpl",
          modifiedBy: null,
          modifiedDate: null,
          seq: null,
          value1:
            props.TableTemplateSelectedProps.templateForm.TemplateId.toString(),
          value2: _templateNewDoc.toString(),
          value3: null,
          value4: null,
          value5: null,
        };
        lstMasterDataTemplateEditDocOBJ = {
          masterId:
            props.stateProps === "edit"
              ? props.TableTemplateSelectedProps.lstMasterData[1]?.masterId ===
                undefined
                ? null
                : props.TableTemplateSelectedProps.lstMasterData[1].masterId
              : null,
          createdBy: null,
          createdDate: null,
          isActive: true,
          masterType: "D_EditTpl",
          modifiedBy: null,
          modifiedDate: null,
          seq: null,
          value1:
            props.TableTemplateSelectedProps.templateForm.TemplateId.toString(),
          value2: _templateEditDoc.toString(),
          value3: null,
          value4: null,
          value5: null,
        };
        lstMasterDataTemplateCancelDocOBJ = {
          masterId:
            props.stateProps === "edit"
              ? props.TableTemplateSelectedProps.lstMasterData[2]?.masterId ===
                undefined
                ? null
                : props.TableTemplateSelectedProps.lstMasterData[2].masterId
              : null,
          createdBy: null,
          createdDate: null,
          isActive: true,
          masterType: "D_CanTpl",
          modifiedBy: null,
          modifiedDate: null,
          seq: null,
          value1:
            props.TableTemplateSelectedProps.templateForm.TemplateId.toString(),
          value2: _templateCancelDoc.toString(),
          value3: null,
          value4: null,
          value5: null,
        };
        arraylstMasterData.push(lstMasterDataTemplateNewDocOBJ);
        arraylstMasterData.push(lstMasterDataTemplateEditDocOBJ);
        arraylstMasterData.push(lstMasterDataTemplateCancelDocOBJ);
        _ArrayreferenceDocumentDialogObject.push(_display);
        _ArrayreferenceDocumentDialogObject.push(_Mode);

        if (_selectField !== undefined) {
          _ArrayreferenceDocumentDialogObject.push(_selectField);
        }

        if (_affiliation !== false) {
          _ArrayreferenceDocumentDialogObject.push("Yes");
        } else {
          _ArrayreferenceDocumentDialogObject.push("No");
        }
        if (_quarter !== false) {
          _ArrayreferenceDocumentDialogObject.push("Yes");
        } else {
          _ArrayreferenceDocumentDialogObject.push("No");
        }
        referenceDocumentDialogObject.RefDocDisplay =
          _ArrayreferenceDocumentDialogObject.toString();

        if (
          referenceDocumentDialogObject.listRefTemplate.length !== 0 &&
          _selectField !== undefined
        ) {
          referenceDocumentDialogObject.listRefTemplate.map(
            (data: any, inx: any) => {
              data.RefDocDisplay = referenceDocumentDialogObject.RefDocDisplay;
              data.IsDefaultLineApprove = _isDefaultLineApprove;
            }
          );

          props.TableTemplateSelectedProps.templateForm.RefDocDisplay =
            referenceDocumentDialogObject.listRefTemplate[0].RefDocDisplay;
          props.TableTemplateSelectedProps.templateForm.RefTemplate =
            JSON.stringify(referenceDocumentDialogObject.listRefTemplate);

          let _JsonParseRefDocColumn_ =
            referenceDocumentDialogObject.templateForm.RefDocColumn !==
              undefined &&
            referenceDocumentDialogObject.templateForm.RefDocColumn !== null &&
            referenceDocumentDialogObject.templateForm.RefDocColumn.length !== 0
              ? JSON.parse(
                  referenceDocumentDialogObject.templateForm.RefDocColumn
                )
              : [];

          for (
            let i = 0;
            i < referenceDocumentDialogObject.SaveDataTable.length;
            i++
          ) {
            const element = referenceDocumentDialogObject.SaveDataTable[i];
            for (let j = 0; j < _JsonParseRefDocColumn_.length; j++) {
              const _element = _JsonParseRefDocColumn_[j];
              if (element.Key === _element.Key) {
                _JsonParseRefDocColumn_[j] = element;
              }
            }
          }
          console.log(" ", _JsonParseRefDocColumn_);

          props.TableTemplateSelectedProps.templateForm.RefDocColumn =
            JSON.stringify(_JsonParseRefDocColumn_);
          console.log(
            "referenceDocumentDialogObject1",
            referenceDocumentDialogObject,
            props.TableTemplateSelectedProps
          );

          props.referenceDocumentObjProps(
            referenceDocumentDialogObject.listRefTemplate,
            "listRefTemplate"
          );
          props.referenceDocumentObjProps(arraylstMasterData, "lstMasterData");

          props.referenceDocumentObjProps(
            props.TableTemplateSelectedProps.templateForm,
            "templateForm"
          );
          props.setVisibleProps();
        }
      } else {
        setVisibleIsDocControl({
          TemplateNewDoc:
            referenceDocumentDialogObject.TemplateNewDoc.length === 0
              ? true
              : false,
          TemplateEditDoc:
            referenceDocumentDialogObject.TemplateEditDoc.length === 0
              ? true
              : false,
          TemplateCancelDoc:
            referenceDocumentDialogObject.TemplateCancelDoc.length === 0
              ? true
              : false,
        });
      }
    } else {
      _ArrayreferenceDocumentDialogObject.push(_display);
      _ArrayreferenceDocumentDialogObject.push(_Mode);

      if (_selectField !== undefined) {
        _ArrayreferenceDocumentDialogObject.push(_selectField);
      }

      if (_affiliation !== false) {
        _ArrayreferenceDocumentDialogObject.push("Yes");
      } else {
        _ArrayreferenceDocumentDialogObject.push("No");
      }
      if (_quarter !== false) {
        _ArrayreferenceDocumentDialogObject.push("Yes");
      } else {
        _ArrayreferenceDocumentDialogObject.push("No");
      }
      referenceDocumentDialogObject.RefDocDisplay =
        _ArrayreferenceDocumentDialogObject.toString();

      if (
        referenceDocumentDialogObject.listRefTemplate.length !== 0 &&
        _selectField !== undefined &&
        _selectField.length !== 0
      ) {
        referenceDocumentDialogObject.listRefTemplate.map(
          (data: any, inx: any) => {
            data.RefDocDisplay = referenceDocumentDialogObject.RefDocDisplay;
            data.IsDefaultLineApprove = _isDefaultLineApprove;
          }
        );

        props.TableTemplateSelectedProps.templateForm.RefDocDisplay =
          referenceDocumentDialogObject.listRefTemplate[0].RefDocDisplay;
        props.TableTemplateSelectedProps.templateForm.RefTemplate =
          JSON.stringify(referenceDocumentDialogObject.listRefTemplate);

        let _JsonParseRefDocColumn_ =
          referenceDocumentDialogObject.templateForm.RefDocColumn !==
            undefined &&
          referenceDocumentDialogObject.templateForm.RefDocColumn !== null &&
          referenceDocumentDialogObject.templateForm.RefDocColumn.length !== 0
            ? JSON.parse(
                referenceDocumentDialogObject.templateForm.RefDocColumn
              )
            : [];

        for (
          let i = 0;
          i < referenceDocumentDialogObject.SaveDataTable.length;
          i++
        ) {
          const element = referenceDocumentDialogObject.SaveDataTable[i];
          for (let j = 0; j < _JsonParseRefDocColumn_.length; j++) {
            const _element = _JsonParseRefDocColumn_[j];
            if (element.Key === _element.Key) {
              _JsonParseRefDocColumn_[j] = element;
            }
          }
        }
        console.log("_JsonParseRefDocColumn_", _JsonParseRefDocColumn_);

        props.TableTemplateSelectedProps.templateForm.RefDocColumn =
          JSON.stringify(_JsonParseRefDocColumn_);
        props.referenceDocumentObjProps(
          referenceDocumentDialogObject.listRefTemplate,
          "listRefTemplate"
        );
        props.referenceDocumentObjProps([], "lstMasterData");

        console.log(
          "referenceDocumentDialogObject1",
          referenceDocumentDialogObject,
          props.TableTemplateSelectedProps
        );
        props.referenceDocumentObjProps(
          props.TableTemplateSelectedProps.templateForm,
          "templateForm"
        );
        props.setVisibleProps();
      } else {
        setSelectFieldValidation(true);
      }
    }
  };

  async function _selectField() {
    let _dataReferenceDocumentDialogObject = referenceDocumentDialogObject;
    let _dataFilter = selectFieldtoshow.filter(
      (data: any) =>
        data.selectField ===
        _dataReferenceDocumentDialogObject.selectField.selectField
    );
    if (_dataFilter.length === 0) {
      _dataReferenceDocumentDialogObject.selectField.selectField = "";
      setIsLoadDropdown(false);
    }
    setReferenceDocumentDialogObject(_dataReferenceDocumentDialogObject);
  }

  async function _RefDocDisplay() {
    let _referenceDocumentDialogObject =
      referenceDocumentDialogObject.listRefTemplate === undefined ||
      referenceDocumentDialogObject.listRefTemplate === null
        ? []
        : referenceDocumentDialogObject?.listRefTemplate;
    if (_referenceDocumentDialogObject?.length !== 0) {
      var _arrayRefDocDisplay =
        referenceDocumentDialogObject?.listRefTemplate[0]?.RefDocDisplay?.split(
          ","
        );

      let _IsDefaultLineApprove =
        referenceDocumentDialogObject.listRefTemplate[0].IsDefaultLineApprove;

      referenceDocumentDialogObject.Display = {
        Position: _arrayRefDocDisplay[0],
      };

      referenceDocumentDialogObject.Mode = { Mode: _arrayRefDocDisplay[1] };
      if (_arrayRefDocDisplay[3]) {
        if (_arrayRefDocDisplay[3] === "No") {
          referenceDocumentDialogObject.Affiliation = false;
        } else {
          referenceDocumentDialogObject.Affiliation = true;
        }
      }

      if (_arrayRefDocDisplay[2]) {
        if (_arrayRefDocDisplay[2].length !== 0) {
          _ReferenceDocumentDialog(
            { selectField: _arrayRefDocDisplay[2] },
            "selectField"
          );
        } else {
          _ReferenceDocumentDialog({ selectField: "" }, "selectField");
          referenceDocumentDialogObject.selectField = { selectField: "" };
        }
      }
      if (_arrayRefDocDisplay[4]) {
        if (_arrayRefDocDisplay[4] === "No") {
          referenceDocumentDialogObject.Quarter = false;
        } else {
          referenceDocumentDialogObject.Quarter = true;
        }
      }
      referenceDocumentDialogObject.IsDefaultLineApprove =
        _IsDefaultLineApprove;
    }
  }

  async function _MapSelectTable(_data: any) {
    console.log("_data", _data);

    let _arraySelect: any = [];
    let _referenceDocumentDialogObject =
      referenceDocumentDialogObject.listRefTemplate === undefined ||
      referenceDocumentDialogObject.listRefTemplate === null
        ? []
        : referenceDocumentDialogObject.listRefTemplate;
    if (
      _referenceDocumentDialogObject !== undefined &&
      _referenceDocumentDialogObject !== null &&
      _referenceDocumentDialogObject.length !== 0
    ) {
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
          _items.items.map((data: any, inx: any) => {
            _arraySelect.push(data);
          });
        }
      });
    } else {
      _arraySelect = [];
      referenceDocumentDialogObject.selectField.selectField = undefined;
    }
    if (_arraySelect.length !== 0) {
      _MapSelectTableItem(_arraySelect);
    } else {
      setIsLoad(false);
    }
  }
  async function _MapSelectTableItem(_data: any) {
    let _dataItem = _data;
    let _arraylayout: any = [];
    _dataItem.map((data: any, inx: any) => {
      let layout = data.layout;

      for (let i = 0; i < layout.length; i++) {
        const element = layout[i].template;
        if (
          (element.istext !== "Y" && element.type === "t") ||
          (element.istext !== "Y" && element.type === "dd") ||
          (element.istext !== "Y" && element.type === "cb") ||
          (element.istext !== "Y" && element.type === "ta") ||
          (element.istext !== "Y" && element.type === "c") ||
          (element.istext !== "Y" && element.type === "d") ||
          (element.istext !== "Y" && element.type === "an") ||
          (element.istext !== "Y" && element.type === "ed")
        ) {
          _arraylayout.push({ selectField: element.label });
        }
      }
    });

    _arraylayout.push({ selectField: "Information DocumentNo" });
    setSelectFieldtoshow([..._arraylayout]);
    setIsLoad(true);
  }

  function _ReferenceDocumentDialog(data: any, key: any) {
    let _Object: any = referenceDocumentDialogObject;
    setSelectFieldValidation(false);

    // if(key==="rowDataTable"){

    // }
    _Object[key] = data === null || data === undefined ? _Object[key] : data;
    setReferenceDocumentDialogObject((prevState: any) => ({
      ...prevState,
      ..._Object,
    }));
  }

  function _ReferenceDocumentTableDialog(data: any, key: any) {
    let _Object: any = referenceDocumentDialogObject;
    let arrayRowDataTable: any = [];
    setSelectFieldValidation(false);
    console.log("_ReferenceDocumentTableDialog", data, _Object, key);
    _Object[key] = data === null || data === undefined ? _Object[key] : data;
    setReferenceDocumentDialogObject((prevState: any) => ({
      ...prevState,
      ..._Object,
    }));
  }
  async function fetchTemplate() {
    const empData = JSON.parse(window.localStorage.getItem("userData"));
    const empid = empData.employeeData.EmployeeId;
    const DepartmentId = empData.employeeData.DepartmentId;
    // const dataJson = {
    //   CreatedBy: empid.toString(),
    //   DepartmentId: DepartmentId,
    // };
    // const dataJsonn = {
    //   CreatedBy: empid.toString(),
    //   DepartmentId: DepartmentId,
    //   Username: empData.employeeData.Username,
    //   Email: empData.employeeData.Email,
    // };
    const dataJson = {
      CreatedBy: empid.toString(),
    };

    let _dataTemplatee = await GetTemplateTemplateListVersion(dataJson);
    // let _dataTemplatee = await GetTemplateeBindFormNameDDL(dataJsonn);
    console.log("_dataTemplate", _dataTemplatee);

    // let _template = await GetTemplateTemplateListVersion(dataJson);

    let arrayTemplate: any = [];
    _dataTemplatee.map((data: any) => {
      if (data.IsTextForm !== true) arrayTemplate.push(data);
    });

    templateAddCode([...arrayTemplate]);
    setTemplate([...arrayTemplate]);
    setFilters([...arrayTemplate]);
  }
  async function templateAddCode(data: any) {
    let _dataTemplate = data;

    await _dataTemplate.map((_dataMap: any, inx: any) => {
      _dataMap["code"] = _dataMap.TemplateId.toString();
      _dataMap["TemplateNameWithCodeMulti"] =
        _dataMap.TemplateId.toString() + ": " + _dataMap.TemplateName;
    });
    setTemplateAddCodeMulti(_dataTemplate);
  }
  async function _IsDocControl(_dataTemplate: any) {
    let _lstMasterData =
      props.TableTemplateSelectedProps.lstMasterData === null ||
      props.TableTemplateSelectedProps.lstMasterData === undefined
        ? []
        : props.TableTemplateSelectedProps.lstMasterData;
    if (_lstMasterData.length !== 0) {
      let _lstMasterDataSplitD_NewTpl = _lstMasterData[0].value2.split(",");
      let _lstMasterDataSplitD_EditTpl = _lstMasterData[1].value2.split(",");
      let _lstMasterDataSplitD_CanTpl = _lstMasterData[2].value2.split(",");

      let _lstMasterD_NewTpl: any = [];
      let _lstMasterD_EditTpl: any = [];
      let _lstMasterD_CanTpl: any = [];

      _lstMasterDataSplitD_NewTpl.filter((data: any, inx: any) => {
        _dataTemplate.filter((_data: any, inx: any) => {
          if (_data.TemplateId.toString() === data) {
            _lstMasterD_NewTpl.push(_data);
          }
        });
      });

      _lstMasterDataSplitD_EditTpl.filter((data: any, inx: any) => {
        _dataTemplate.filter((_data: any, inx: any) => {
          if (_data.TemplateId.toString() === data) {
            _lstMasterD_EditTpl.push(_data);
          }
        });
      });
      _lstMasterDataSplitD_CanTpl.filter((data: any, inx: any) => {
        _dataTemplate.filter((_data: any, inx: any) => {
          if (_data.TemplateId.toString() === data) {
            _lstMasterD_CanTpl.push(_data);
          }
        });
      });

      _ReferenceDocumentDialog(_lstMasterD_NewTpl, "TemplateNewDoc");
      _ReferenceDocumentDialog(_lstMasterD_EditTpl, "TemplateEditDoc");
      _ReferenceDocumentDialog(_lstMasterD_CanTpl, "TemplateCancelDoc");
      _ReferenceDocumentDialog(true, "DocControl");
      props.isLoadProps(true);
      setIsLoadLoadFetchData(true);
    } else {
      setIsLoadLoadFetchData(true);
      props.isLoadProps(true);
    }
  }
  const renderFooter = () => {
    return (
      <div className="referenceDocumentDialog-renderFooter-display">
        <ButtonComponents
          setLabelProps="Cancel"
          setIconProps={
            <IoCloseOutline size={"16px"} style={{ marginRight: "3px" }} />
          }
          onClickProps={() => onHide()}
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
          onClickProps={() => onSave()}
          setStyleProps={{
            height: "38px",
            borderRadius: "6px",
            border: "1px solid rgb(40, 47, 106)",
            fontSize: "13px",
          }}
        />
      </div>
    );
  };

  const onGlobalFilterTemplate = (data: any, inx: any) => {
    const value = data;
    const _Arrayfilters: any = [];
    let _filters = { ...filters };
    for (const [key, value] of Object.entries(_filters)) {
      _Arrayfilters.push(value);
    }
    const _dataFilter = _Arrayfilters.filter((data: any) => {
      if (
        data.DocumentCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.TemplateName.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.TemplateSubject.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ) {
        return true;
      }
    });
    setTemplate(_dataFilter);
  };
  return (
    <>
      {isLoadFetchData ? (
        <Dialog
          visible={props.visibleProps}
          onHide={() => onHide()}
          className="referenceDocumentDialog-dialog"
          breakpoints={{ "960px": "75vw" }}
          style={{ width: "70vw" }}
          footer={renderFooter()}
          onClick={() => {
            console.log(
              "_ReferenceDocumentTableDialog",
              referenceDocumentDialogObject
            );
          }}
        >
          <div style={{ padding: "4px 3.5rem 1rem 1.5rem" }}>
            <Row>
              <Col xs={12} sm={12} xl={12}>
                <p className="referenceDocumentDialog-dialog-p-textheader">
                  Search Reference Document
                </p>
              </Col>
            </Row>
          </div>
          <p style={{ borderBottom: "1px solid #cfcfcf" }}></p>
          <div style={{ padding: "20px 3.5rem 0rem 2.5rem" }}>
            <Row className="gutter-row-Reference">
              <Col xs={12} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Display"}
                  textSubProps={"แสดงผล"}
                />
              </Col>
              <Col xs={12} sm={10} xl={4}>
                <DropdownComponents
                  placeholderProps={
                    referenceDocumentDialogObject.Display.Position
                  }
                  onChangeProps={_ReferenceDocumentDialog}
                  optionLabelProps="Position"
                  optionsProps={[{ Position: "Top" }, { Position: "Bottom" }]}
                  valueProps={referenceDocumentDialogObject.Display}
                  keyProps={"Display"}
                />
              </Col>
              <Col
                xs={12}
                sm={2}
                xl={2}
                className="referenceDocumentDialog-dialog-media"
              >
                <TextHeaderComponents
                  textHeaderProps={"Mode"}
                  textSubProps={"โหมด"}
                />
              </Col>
              <Col
                xs={12}
                sm={10}
                xl={4}
                className="referenceDocumentDialog-dialog-media-padding"
              >
                <DropdownComponents
                  placeholderProps={referenceDocumentDialogObject.Mode.Mode}
                  onChangeProps={_ReferenceDocumentDialog}
                  optionLabelProps="Mode"
                  optionsProps={[{ Mode: "Single" }, { Mode: "Multiselect" }]}
                  valueProps={referenceDocumentDialogObject.Mode}
                  keyProps={"Mode"}
                />
              </Col>
            </Row>

            <Row className="gutter-row-Reference">
              <Col
                xs={12}
                sm={2}
                xl={2}
                className="informationComponents-media-FormCategory-425px"
              >
                <TextHeaderComponents
                  textHeaderProps={"Under Affiliation "}
                  textSubProps={"ใต้สังกัด"}
                />
              </Col>
              <Col
                xs={12}
                sm={1}
                xl={1}
                style={{ marginTop: "-2px" }}
                className="informationComponents-media-FormCategory"
              >
                <div>
                  <CheckboxCpmponents
                    checkedProps={
                      referenceDocumentDialogObject.Affiliation === false
                        ? false
                        : referenceDocumentDialogObject.Affiliation
                    }
                    onChangeProps={_ReferenceDocumentDialog}
                    keyProps={"Affiliation"}
                  />
                </div>
              </Col>
              <Col
                xs={12}
                sm={2}
                xl={2}
                className="informationComponents-media-FormCategory-425px"
              >
                <TextHeaderComponents
                  textHeaderProps={"Quarter cycle"}
                  textSubProps={"รอบไตรมาส"}
                />
              </Col>
              <Col
                xs={12}
                sm={1}
                xl={1}
                style={{ marginTop: "-2px" }}
                className="informationComponents-media-FormCategory1024px"
              >
                <div>
                  <CheckboxCpmponents
                    checkedProps={
                      referenceDocumentDialogObject.Quarter === false
                        ? false
                        : referenceDocumentDialogObject.Quarter
                    }
                    onChangeProps={_ReferenceDocumentDialog}
                    keyProps={"Quarter"}
                  />
                </div>
              </Col>

              <Col
                xs={12}
                sm={2}
                xl={2}
                className="informationComponents-media-FormCategory-425px"
              >
                <TextHeaderComponents
                  textHeaderProps={"Default Line Approve"}
                  textSubProps={"ดึงสายการอนุมัติ"}
                />
              </Col>

              <Col
                xs={12}
                sm={1}
                xl={1}
                style={{ marginTop: "-2px" }}
                className="informationComponents-media-FormCategory1024px"
              >
                <div>
                  <CheckboxCpmponents
                    checkedProps={
                      referenceDocumentDialogObject.IsDefaultLineApprove ===
                      "No"
                        ? "No"
                        : referenceDocumentDialogObject.IsDefaultLineApprove
                    }
                    onChangeProps={_ReferenceDocumentDialog}
                    keyProps={"IsDefaultLineApprove"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="gutter-row">
              <Col
                xs={12}
                sm={2}
                xl={2}
                className="informationComponents-media-FormCategory-425px"
              >
                <TextHeaderComponents
                  textHeaderProps={"Is DocControl"}
                  textSubProps={"เอกสารควบคุม"}
                />
              </Col>

              <Col
                xs={12}
                sm={12}
                xl={1}
                style={{ marginTop: "-2px" }}
                className="informationComponents-media-FormCategory1024px"
              >
                <div>
                  <CheckboxCpmponents
                    checkedProps={
                      referenceDocumentDialogObject.DocControl === "No"
                        ? "No"
                        : referenceDocumentDialogObject.DocControl
                    }
                    onChangeProps={_ReferenceDocumentDialog}
                    keyProps={"DocControl"}
                  />
                </div>
              </Col>
              {referenceDocumentDialogObject.DocControl && (
                <>
                  <Col
                    xs={12}
                    sm={12}
                    xl={9}
                    style={{ marginTop: "-2px" }}
                    className="referenceDocumentDialog-dialog-media-padding"
                  >
                    <Row className="gutter-row-margin-bottom">
                      <Col xs={12} sm={2} xl={2}>
                        <TextHeaderComponents
                          textHeaderProps={"Template New Doc"}
                          textSubProps={"ฟอร์มสร้างใหม่"}
                        />
                      </Col>
                      <Col xs={12} sm={10} xl={10}>
                        <MultiSelect
                          value={referenceDocumentDialogObject.TemplateNewDoc}
                          options={templateAddCodeMulti}
                          onChange={(e) => {
                            _ReferenceDocumentDialog(e.value, "TemplateNewDoc");
                          }}
                          optionLabel="TemplateNameWithCodeMulti"
                          placeholder="--Please Select--"
                          display="chip"
                          style={{
                            width: "100% ",
                            fontSize: "13px",
                            borderColor:
                              visibleIsDocControl.TemplateNewDoc === true
                                ? referenceDocumentDialogObject.TemplateNewDoc
                                    .length === 0
                                  ? "red"
                                  : undefined
                                : undefined,
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="gutter-row-margin-bottom">
                      <Col xs={12} sm={2} xl={2}>
                        <TextHeaderComponents
                          textHeaderProps={"Template Edit Doc"}
                          textSubProps={"ฟอร์มแก้ไข"}
                        />
                      </Col>
                      <Col xs={12} sm={10} xl={10}>
                        <MultiSelect
                          value={referenceDocumentDialogObject.TemplateEditDoc}
                          options={templateAddCodeMulti}
                          onChange={(e) =>
                            _ReferenceDocumentDialog(e.value, "TemplateEditDoc")
                          }
                          optionLabel="TemplateNameWithCodeMulti"
                          placeholder="--Please Select--"
                          display="chip"
                          style={{
                            width: "100% ",
                            fontSize: "13px",
                            borderColor:
                              visibleIsDocControl.TemplateEditDoc === true
                                ? referenceDocumentDialogObject.TemplateEditDoc
                                    .length === 0
                                  ? "red"
                                  : undefined
                                : undefined,
                          }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={2} xl={2}>
                        <TextHeaderComponents
                          textHeaderProps={"Template Cancel Doc"}
                          textSubProps={"ฟอร์มยกเลิก"}
                        />
                      </Col>
                      <Col xs={12} sm={10} xl={10}>
                        <MultiSelect
                          value={
                            referenceDocumentDialogObject.TemplateCancelDoc
                          }
                          options={templateAddCodeMulti}
                          onChange={(e) =>
                            _ReferenceDocumentDialog(
                              e.value,
                              "TemplateCancelDoc"
                            )
                          }
                          optionLabel="TemplateNameWithCodeMulti"
                          placeholder="--Please Select--"
                          display="chip"
                          style={{
                            width: "100% ",
                            fontSize: "13px",
                            borderColor:
                              visibleIsDocControl.TemplateCancelDoc === true
                                ? referenceDocumentDialogObject
                                    .TemplateCancelDoc.length === 0
                                  ? "red"
                                  : undefined
                                : undefined,
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </>
              )}
            </Row>

            <Row className="gutter-row">
              <Col xs={12} sm={2} xl={2}>
                <TextHeaderComponents
                  textHeaderProps={"Search"}
                  textSubProps={"ค้นหา"}
                />
              </Col>
              <Col xs={12} sm={10} xl={10}>
                <div className="p-inputgroup">
                  <div style={{ paddingBottom: "3px", width: "100%" }}>
                    <InputTextComponents
                      setStyleProps={{
                        width: "100%",
                        height: "38px",
                        borderRadius: "6px 0px 0px 6px",
                      }}
                      onChangeProps={onGlobalFilterTemplate}
                      keyProps={"Search"}
                      valueProps={globalFilterValueTemplate}
                    />
                  </div>
                  <ButtonComponents
                    setIconProps={"pi pi-search"}
                    setClassNameProps={"p-button-text-position"}
                    setStyleProps={{
                      backgroundColor: "#282f6a",
                      border: "1px solid #282f6a",
                      borderTopRightRadius: "6px",
                      borderBottomRightRadius: "6px",
                      boxShadow: "none",
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="gutter-row">
              <Col xs={12} sm={12} xl={12}>
                <TableTemplateComponents
                  valueProps={
                    Object.keys(template).length === 0 ? [] : template
                  }
                  setValueProps={_ReferenceDocumentDialog}
                  keyProps={"listRefTemplate"}
                  selectedTableTemplate={
                    referenceDocumentDialogObject.listRefTemplate
                  }
                  filtersProps={filters}
                />
              </Col>
            </Row>
          </div>

          <div>
            <div style={{ padding: "4px 2.5rem 0rem 1.5rem" }}>
              <Row>
                <Col xs={12} sm={12} xl={12}>
                  <p className="referenceDocumentDialog-dialog-p-textheader">
                    Selected Reference Document
                  </p>
                  <p className="referenceDocumentDialog-dialog-p-text-sub">
                    เอกสารอ้างอิงที่เลือก
                  </p>
                </Col>
              </Row>
            </div>
            <p style={{ borderBottom: "1px solid #cfcfcf" }}></p>
            <div style={{ padding: "10px 3.5rem 0rem 2.5rem" }}>
              <Row className="gutter-row">
                <Col xs={12} sm={12} xl={12}>
                  <TableTemplateComponentsSelected
                    valueProps={referenceDocumentDialogObject.listRefTemplate}
                    setValueProps={_ReferenceDocumentDialog}
                    keyProps={"listRefTemplate"}
                  />
                </Col>
              </Row>
              {isLoad && (
                <>
                  {selectFieldtoshow.length !== 0 && (
                    <Row className="gutter-row">
                      <Col xs={12} sm={2} xl={2}>
                        <TextHeaderComponents
                          textHeaderProps={"Select Field to show"}
                          textSubProps={"เลือกข้อมูลที่จะนำมาแสดง"}
                        />
                      </Col>
                      <Col xs={12} sm={4} xl={4}>
                        {isLoadDropdown ? (
                          <DropdownComponents
                            placeholderProps={
                              referenceDocumentDialogObject.selectField
                                .selectField?.length === 0
                                ? "-- Please Select --"
                                : referenceDocumentDialogObject.selectField
                                    .selectField
                            }
                            onChangeProps={_ReferenceDocumentDialog}
                            optionLabelProps="selectField"
                            optionsProps={selectFieldtoshow}
                            valueProps={
                              referenceDocumentDialogObject.selectField
                                .selectField !== undefined
                                ? referenceDocumentDialogObject.selectField
                                    .selectField.length === 0
                                  ? referenceDocumentDialogObject.selectField
                                      .selectField
                                  : referenceDocumentDialogObject.selectField
                                : ""
                            }
                            keyProps={"selectField"}
                            validationProps={selectFieldValidation}
                          />
                        ) : (
                          <DropdownComponents
                            placeholderProps={
                              referenceDocumentDialogObject.selectField
                                .selectField.length === 0
                                ? "-- Please Select --"
                                : referenceDocumentDialogObject.selectField
                                    .selectField
                            }
                            onChangeProps={_ReferenceDocumentDialog}
                            optionLabelProps="selectField"
                            optionsProps={selectFieldtoshow}
                            valueProps={
                              referenceDocumentDialogObject.selectField
                                .selectField.length === 0
                                ? referenceDocumentDialogObject.selectField
                                    .selectField
                                : referenceDocumentDialogObject.selectField
                            }
                            keyProps={"selectField"}
                            validationProps={selectFieldValidation}
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                </>
              )}
              {props.stateProps === "edit" &&
              referenceDocumentDialogObject.listRefTemplate !== undefined ? (
                referenceDocumentDialogObject.listRefTemplate.length !== 0 ? (
                  <div>
                    <Row className="gutter-row">
                      <Col xs={12} sm={2} xl={2}>
                        <TextHeaderComponents
                          textHeaderProps={"Select Field"}
                          textSubProps={"เลือกข้อมูล"}
                        />
                      </Col>
                      <Col xs={12} sm={10} xl={10}>
                        <TableSelectField
                          valueProps={
                            referenceDocumentDialogObject.templateForm
                          }
                          setValueProps={_ReferenceDocumentDialog}
                          keyProps={"templateForm"}
                          TemplateSelected={
                            referenceDocumentDialogObject.listRefTemplate
                          }
                          tableDialog={
                            referenceDocumentDialogObject.tableDialog
                          }
                          rowDataTable={
                            referenceDocumentDialogObject.rowDataTable
                          }
                          keyTableDialog={"tableDialog"}
                          setValueTableProps={_ReferenceDocumentTableDialog}
                        />
                      </Col>
                    </Row>

                    <TableTemplateDialogComponents
                      valueProps={referenceDocumentDialogObject.templateForm}
                      visibleProps={referenceDocumentDialogObject.tableDialog}
                      dataProps={referenceDocumentDialogObject.rowDataTable}
                      referenceFormProps={
                        referenceDocumentDialogObject.ReferenceForm
                      }
                      setVisibleProps={_ReferenceDocumentTableDialog}
                      referenceDocumentDialogObjectProps={
                        referenceDocumentDialogObject
                      }
                      keyProps={"tableDialog"}
                    />
                  </div>
                ) : null
              ) : (
                null && null
              )}
            </div>
          </div>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
};
