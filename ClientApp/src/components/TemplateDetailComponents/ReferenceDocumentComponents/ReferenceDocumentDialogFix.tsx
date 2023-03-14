import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { BiSave } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import "../../DataFechDialogComponents/ReferenceDocumentDialog/ReferenceDocumentDialog.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../../DataFechDialogComponents/ReferenceDocumentDialog/TableTemplateComponents/TableTemplateComponents.css";
import { AutoComplete } from "antd";
import TableTemplateDialogComponentsFixed from "../../DataFechDialogComponents/ReferenceDocumentDialog/TableTemplateDialogComponents/TableTemplateDialogComponentsFixed";
import { MultiSelect } from "primereact/multiselect";
import { IMasterDataModel } from "../../../IRequestModel/IMasterDataModel";
import "./ReferenceDocumentComponents.css";
import { Button } from "primereact/button";

type Props = {
  listRefTemplateProps: any;
  templateList: any[];
  visibleRefenceDocumentDialog: boolean;
  setVisibleRefenceDocumentDialog: (val: boolean) => void;
  advanceForm: any;
  controlModel: any;
  setControlModelObj?: any;
};
const ReferenceDocumentDialogFix: React.FC<Props> = ({
  listRefTemplateProps,
  templateList,
  visibleRefenceDocumentDialog,
  setVisibleRefenceDocumentDialog,
  setControlModelObj,
  controlModel,
  advanceForm,
  ...props
}) => {
  const [referenceDocumentDialogObject, setReferenceDocumentDialogObject] =
    useState<any>({
      RefDocDisplay: "",
      Display: { Position: "Top" },
      Mode: { Mode: "Single" },
      Affiliation: false,
      Quarter: false,
      ReferenceAttachment: false,
      IsDefaultLineApprove: false,
      DocControl: false,
      selectField: { selectField: "" },
      templateForm: [],
      tableDialog: false,
      listRefTemplate: [],
      rowDataTable: [],
      ReferenceForm: "",
      TemplateNewDoc: [],
      TemplateEditDoc: [],
      TemplateCancelDoc: [],
      SaveDataTable: [],
    });
  const [searchTemplateList, setSearchTemplateList] = useState<any[]>([]);
  const [selectField, setSelectField] = useState<any[]>([]);
  const [tableRefDialog, setTableRefDialog] = useState<boolean>(false);
  const [tableRefData, setTableRefData] = useState<any>();
  const [tableRefDialogHeader, setTableRefDialogHeader] = useState<string>("");
  const [templateAddCodeMulti, setTemplateAddCodeMulti] = useState<any[]>([]);
  const [selectFieldtoshow, setSelectFieldtoshow] = useState<any[]>([]);
  const [listMasterData, setListMasterData] = useState<any>();

  const onShowDialog = async () => {
    try {
      setSearchTemplateList([...templateList]);
      await templateAddCode();
      if (controlModel) {
        const docControl: {
          isDocControl: boolean;
          D_NewTpl: any[];
          D_EditTpl: any[];
          D_CanTpl: any[];
        } = _IsDocControl(controlModel);
        const templateForm = controlModel.templateForm;
        const mappingLstMaster = _IsDocControl(controlModel);
        setListMasterData(mappingLstMaster);
        console.log("ref=>templateForm", templateForm);

        let display: string[] = templateForm?.RefDocDisplay?.split(",");

        const defaultRefModel = {
          RefDocDisplay: templateForm.RefDocDisplay,
          Display:
            display[0] === "Top" ? { Position: "Top" } : { Position: "Bottom" },
          Mode:
            display[1] === "Single"
              ? { Mode: "Single" }
              : { Mode: "Multiselect" },
          ReferenceAttachment: display[5] === "Yes",
          Affiliation: display[3] === "Yes",
          Quarter: display[4] === "Yes",
          IsDefaultLineApprove:
            listRefTemplateProps[0]?.IsDefaultLineApprove || false,
          DocControl: docControl.isDocControl,
          selectField: { selectField: display[2] },
          templateForm: [],
          listRefTemplate: listRefTemplateProps,
          tableDialog: false,
          rowDataTable: [],
          ReferenceForm: "",
          TemplateNewDoc: docControl.D_NewTpl,
          TemplateEditDoc: docControl.D_EditTpl,
          TemplateCancelDoc: docControl.D_CanTpl,
          SaveDataTable: [],
        };
        dynamicSelect(templateForm);

        setReferenceDocumentDialogObject({ ...defaultRefModel });
      }
    } catch (error) {
      console.log("ref=>error", error);
    }
  };

  function _IsDocControl(_dataTemplate: any) {
    let _lstMasterData = _dataTemplate.lstMasterData;

    let res: {
      isDocControl: boolean;
      D_NewTpl: any[];
      D_EditTpl: any[];
      D_CanTpl: any[];
    } = {
      isDocControl: false,
      D_NewTpl: [],
      D_EditTpl: [],
      D_CanTpl: [],
    };
    if (_lstMasterData) {
      if (_lstMasterData?.length !== 0) {
        res.isDocControl = true;
        const _lstMasterDataSplitD_NewTpl = _lstMasterData
          .find((e: any) => e.masterType === "D_NewTpl")
          ?.value2.split(",");
        const _lstMasterDataSplitD_EditTpl = _lstMasterData
          .find((e: any) => e.masterType === "D_EditTpl")
          ?.value2.split(",");
        const _lstMasterDataSplitD_CanTpl = _lstMasterData
          .find((e: any) => e.masterType === "D_CanTpl")
          ?.value2.split(",");

        _lstMasterDataSplitD_NewTpl.forEach((data: any, inx: any) => {
          templateList.forEach((_data: any, inx: any) => {
            if (_data.TemplateId.toString() == data) {
              res.D_NewTpl.push(_data);
            }
          });
        });

        _lstMasterDataSplitD_EditTpl.forEach((data: any, inx: any) => {
          templateList.forEach((_data: any, inx: any) => {
            if (_data.TemplateId.toString() === data) {
              res.D_EditTpl.push(_data);
            }
          });
        });
        _lstMasterDataSplitD_CanTpl.forEach((data: any, inx: any) => {
          templateList.forEach((_data: any, inx: any) => {
            if (_data.TemplateId.toString() === data) {
              res.D_CanTpl.push(_data);
            }
          });
        });
      }
    }

    return res;
  }

  const dialogHeader = () => {
    return (
      <Row style={{ borderBottom: "1px solid #cfcfcf" }}>
        <Col xs={12} sm={12} xl={12}>
          <p className="referenceDocumentDialog-dialog-p-textheader">
            Search Reference Document
          </p>
        </Col>
      </Row>
    );
  };

  const dialogFooter = () => {
    return (
      <div className="referenceDocumentDialog-renderFooter-display">
        <ButtonComponents
          setLabelProps="Cancel"
          setIconProps={
            <IoCloseOutline size={"16px"} style={{ marginRight: "3px" }} />
          }
          onClickProps={hide}
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

  // const searchTemplate = (event: any) => {
  //   // let filteredCountries = //suggestions
  //   // setFilteredCountries(filteredCountries);
  // };

  const hide = () => {
    setVisibleRefenceDocumentDialog(!visibleRefenceDocumentDialog);
  };

  const dynamicSelect = (templateForm: any) => {
    let seltectItems: any[] = [];

    if (
      templateForm.RefDocColumn &&
      templateForm.RefDocColumn !== "" &&
      templateForm.RefDocColumn !== "[]"
    ) {
      const _RefDocColumn = JSON.parse(templateForm.RefDocColumn);

      advanceForm.items.map((item: any) => {
        item.layout.forEach((_layout: any) => {
          if (_layout.template.type !== "em" && _layout.template.type !== "l") {
            let selectedCol: any = null;
            const _column = _RefDocColumn?.find(
              (refColumn: any) => refColumn.Key === _layout.template.label
            );

            if (_column) {
              console.log("ref=>_column", _column);
              selectedCol = _column;
              selectedCol.selectedValue = {
                selectedValue: _column.Value,
                type: _column.TypeControl,
              };
            } else {
              if (_layout.template.type === "tb") {
                selectedCol = {
                  Key: _layout.template.label,
                  Template: null,
                  TypeControl: convertType(_layout.template.type),
                  column: _layout.template.attribute.column,
                  objTable: null,
                  Value: "",
                };
              } else {
                selectedCol = {
                  Key: _layout.template.label,
                  Template: null,
                  TypeControl: convertType(_layout.template.type),
                  Value: "",
                };
              }
            }

            if (
              _layout.template.type !== "em" ||
              _layout.template.type === "l"
            ) {
              seltectItems.push(selectedCol);
            }

            // if (
            //   _layout.template.type !== "em" ||
            //   _layout.template.type === "l"
            // ) {
            //   if (_layout.template.type === "tb") {
            //     seltectItems.push({
            //       Key: _layout.template.label,
            //       Template: null,
            //       TypeControl: convertType(_layout.template.type),
            //       column: _layout.template.attribute.column,
            //       objTable: selectedCol.objTable,
            //       Value: selectedCol.Value,
            //       selectedValue: {
            //         selectedValue: selectedCol.Value,
            //         type: selectedCol.TypeControl,
            //       },
            //     });
            //   } else {
            //     seltectItems.push({
            //       Key: _layout.template.label,
            //       Template: null,
            //       TypeControl: convertType(_layout.template.type),
            //       Value: selectedCol.Value,
            //       selectedValue: {
            //         selectedValue: selectedCol.Value,
            //         type: selectedCol.TypeControl,
            //       },
            //     });
            //   }
            // }
          }
        });
      });
    } else {
      advanceForm.items.map((item: any) => {
        item.layout.forEach((_layout: any) => {
          if (_layout.template.type !== "em" && _layout.template.type !== "l") {
            if (_layout.template.type === "tb") {
              seltectItems.push({
                Key: _layout.template.label,
                Template: null,
                column: _layout.template.attribute.column,
                objTable: null,
              });
            } else {
              seltectItems.push({
                Key: _layout.template.label,
                selectedValue: null,
              });
            }
          }
        });
      });
    }
    console.log("ref=>seltectItems", seltectItems);

    setSelectField([...seltectItems]);
  };

  const actionBodyTemplate = (rowData: any) => {
    let options: any[] = [
      {
        selectedValue: "_" + "DocumentNo",
        type: "system",
      },
      {
        selectedValue: "_" + "DocumentAmount",
        type: "system",
      },
    ];
    referenceDocumentDialogObject?.listRefTemplate?.map((temp: any) => {
      const _refTemp = templateList.find(
        (e) => e.TemplateId === temp.TemplateId
      );
      if (_refTemp) {
        const advanceForm = JSON.parse(_refTemp.AdvanceForm);
        advanceForm.items.forEach((item: any) => {
          item.layout.forEach((_layout: any) => {
            if (
              !rowData.column &&
              _layout.template.type !== "em" &&
              _layout.template.type !== "l" &&
              _layout.template.type !== "tb"
            ) {
              options.push({
                selectedValue: temp.DocumentCode + "_" + _layout.template.label,
                type: convertType(_layout.template.type),
              });
            } else if (rowData.column) {
              if (_layout.template.type === "tb") {
                options.push({
                  selectedValue:
                    temp.DocumentCode + "_" + _layout.template.label,
                  type: convertType(_layout.template.type),
                });
              }
            }
          });
        });
      }
    });
    if (rowData.column) {
      options = options.filter((e) => e.type !== "system");
    }
    return (
      <Dropdown
        value={rowData.selectedValue}
        options={options}
        optionLabel="selectedValue"
        filter
        showClear
        onChange={(e: any) => {
          let _selectField = selectField;
          _selectField.map((field: any) => {
            if (field.Key === rowData.Key) {
              field.selectedValue = e.value;
            }
          });
          setSelectField([..._selectField]);
        }}
        style={{ width: "100%", borderRadius: "6px 6px 6px 6px" }}
        placeholder="--Please Select--"
      />
    );
  };

  function _ReferenceDocumentDialog(data: any, key: any) {
    let _Object: any = referenceDocumentDialogObject;

    _Object[key] = data === null || data === undefined ? _Object[key] : data;
    setReferenceDocumentDialogObject((prevState: any) => ({
      ...prevState,
      ..._Object,
    }));

    if (key === "TemplateNewDoc") {
      Array.prototype.push.apply(data, listMasterData);
      setListMasterData((prevState: any) => ({
        ...prevState,
        D_NewTpl: data,
      }));
    } else if (key === "TemplateEditDoc") {
      Array.prototype.push.apply(data, listMasterData);
      setListMasterData((prevState: any) => ({
        ...prevState,
        D_EditTpl: data,
      }));
    } else if (key === "TemplateCancelDoc") {
      Array.prototype.push.apply(data, listMasterData);
      setListMasterData((prevState: any) => ({
        ...prevState,
        D_CanTpl: data,
      }));
    } else if (key === "DocControl") {
      Array.prototype.push.apply(data, listMasterData);
      setListMasterData((prevState: any) => ({
        ...prevState,
        isDocControl: data,
      }));
    }
  }

  const getOptions = () => {
    let _list: any[] = [];
    templateList.forEach((e: any) => {
      _list.push({ value: e.DocumentCode + "_" + e.TemplateName });
    });
    return _list;
  };

  const convertType = (type: string) => {
    let _type = "";
    if (type === "an") {
      _type = "AutoNumber";
    } else if (type === "tb") {
      _type = "Table";
    } else if (type === "t") {
      _type = "ShortText";
    } else if (type === "d") {
      _type = "Calendar";
    } else if (type === "at") {
      _type = "Attachmen";
    } else if (type === "r") {
      _type = "Radio";
    } else if (type === "ta") {
      _type = "MultiLine";
    } else if (type === "c") {
      _type = "Decimal";
    } else if (type === "cb") {
      _type = "MultiChoice";
    } else if (type === "dd") {
      _type = "Dropdown";
    } else if (type === "ed") {
      _type = "Editor";
    }
    return _type;
  };

  const onSave = () => {
    try {
      let _result: any[] = [];
      selectField.map((e: any) => {
        if (e.selectedValue) {
          if (e.selectedValue?.type === "Table") {
            _result.push({
              Key: e.Key,
              Template: null,
              column: e.column,
              objTable: e.objTable,
              TypeControl: e.selectedValue?.type,
              Value: e.selectedValue.selectedValue,
            });
          } else {
            _result.push({
              Key: e.Key,
              Template: null,
              TypeControl: e.selectedValue?.type,
              Value: e.selectedValue.selectedValue,
            });
          }
        }
      });
      const _controlModel = controlModel;
      let display: string[] =
        _controlModel?.templateForm.RefDocDisplay?.split(",");
      display[0] = referenceDocumentDialogObject.Display.Position;
      display[1] = referenceDocumentDialogObject.Mode.Mode;
      display[2] = referenceDocumentDialogObject.selectField.selectField;
      display[3] = referenceDocumentDialogObject.Affiliation ? "Yes" : "No";
      display[4] = referenceDocumentDialogObject.Quarter ? "Yes" : "No";
      display[5] = referenceDocumentDialogObject.ReferenceAttachment
        ? "Yes"
        : "No";
      let RefTemplate: any[] = [];
      referenceDocumentDialogObject.listRefTemplate.map((e: any) => {
        RefTemplate.push({
          TemplateId: e.TemplateId,
          DocumentCode: e.DocumentCode,
          TemplateName: e.TemplateName,
          TemplateSubject: e.TemplateSubject,
          IsDefaultLineApprove:
            referenceDocumentDialogObject.IsDefaultLineApprove,
        });
      });
      const lstMastData = lstMastDataFunction(
        _controlModel.templateForm.TemplateId,
        _controlModel.lstMasterData
      );
      console.log(lstMastData, "controlModel_lstMastData");

      _controlModel.lstMasterData = lstMastData;
      _controlModel.templateForm.RefDocDisplay = display.join(",");
      _controlModel.templateForm.RefDocColumn = JSON.stringify(_result);
      _controlModel.templateForm.RefTemplate = JSON.stringify(RefTemplate);
      _controlModel.listRefTemplate = RefTemplate;
      console.log("ref=>listRefTemplate=>error", _controlModel);
      setControlModelObj({ ..._controlModel });
      setVisibleRefenceDocumentDialog(!visibleRefenceDocumentDialog);
    } catch (error) {
      console.log("ref=>onSave=>error", error);
    }
  };
  function lstMastDataFunction(templateId: number, _lstMasterData: any) {
    const _list = listMasterData;
    let array: any[] = [];
    console.log(_list, "controlModel66999");

    if (_list.isDocControl) {
      let newTplId;
      let editTplId;
      let canTplId;
      for (let i = 0; i < _lstMasterData.length; i++) {
        const element = _lstMasterData[i];
        if (element.masterType === "D_NewTpl") {
          newTplId = element.masterId;
        } else if (element.masterType === "D_EditTpl") {
          editTplId = element.masterId;
        } else if (element.masterType === "D_CanTpl") {
          canTplId = element.masterId;
        }
      }
      var requestModelD_NewTpl: IMasterDataModel = {
        isActive: true,
        masterId: newTplId || null,
        masterType: "D_NewTpl",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        seq: null,
        value1: templateId.toString(),
        value2:
          listMasterData.D_NewTpl.map((item: any) => {
            return item.TemplateId;
          }).join(",") || "",
        value3: null,
        value4: null,
        value5: null,
      };
      array.push(requestModelD_NewTpl);
      var requestModelD_EditTpl: IMasterDataModel = {
        isActive: true,
        masterId: editTplId || null,
        masterType: "D_EditTpl",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        seq: null,
        value1: templateId.toString(),
        value2:
          listMasterData.D_EditTpl.map((item: any) => {
            return item.TemplateId;
          }).join(",") || "",
        value3: null,
        value4: null,
        value5: null,
      };
      array.push(requestModelD_EditTpl);
      var requestModelD_CanTpl: IMasterDataModel = {
        isActive: true,
        masterId: canTplId || null,
        masterType: "D_CanTpl",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        seq: null,
        value1: templateId.toString(),
        value2:
          listMasterData.D_CanTpl.map((item: any) => {
            return item.TemplateId;
          }).join(",") || "",
        value3: null,
        value4: null,
        value5: null,
      };
      array.push(requestModelD_CanTpl);
    }
    return array;
  }
  function actionBodyTemplateTable(rowData: any, option: any) {
    if (rowData?.selectedValue?.type === "Table") {
      return (
        <>
          <span
            style={{ color: "#2769b2" }}
            className="ActionBody"
            onClick={() => {
              setTableRefData({ ...rowData });
              setTableRefDialogHeader(rowData.Key);
              setTableRefDialog(true);
              // props.setValueTableProps(
              //   !props.tableDialog,
              //   props.keyTableDialog
              // );
              // console.log("rowData", rowData);
              // props.setValueTableProps(rowData, "rowDataTable");
              // props.setValueTableProps(
              //   refTemplate === undefined || refTemplate === null
              //     ? ""
              //     : refTemplate.length === 0
              //     ? null
              //     : refTemplate[0].TemplateNameWithCode,
              //   "ReferenceForm"
              // );
            }}
          >
            {rowData.Key}
          </span>
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

  const onTableDialogSave = (Key: string, objTable: any) => {
    tableRefData.objTable = objTable;
    let _selectField = selectField;
    _selectField = _selectField.map((e: any) => {
      if (e.Key === Key) {
        e.objTable = objTable;
      }
      return e;
    });
    setSelectField([..._selectField]);
    setTableRefDialog(false);
  };

  function templateAddCode() {
    let _dataTemplate: any[] = templateList;
    _dataTemplate.map((_dataMap: any, inx: any) => {
      _dataMap["code"] = _dataMap.TemplateId.toString();
      _dataMap["TemplateNameWithCodeMulti"] =
        _dataMap.TemplateId.toString() + ": " + _dataMap.TemplateName;
    });
    setTemplateAddCodeMulti([..._dataTemplate]);
  }

  useEffect(() => {
    _MapSelectTable(referenceDocumentDialogObject.listRefTemplate);
  }, [referenceDocumentDialogObject]);

  async function _MapSelectTable(_data: any) {
    try {
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
      }
    } catch (error) {
      console.log("ref=>error", error);
    }
  }

  async function _MapSelectTableItem(_data: any) {
    try {
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
    } catch (error) {
      console.log("ref=>error", error);
    }
  }

  return (
    <>
      <Dialog
        header={dialogHeader}
        draggable={false}
        closable={false}
        visible={visibleRefenceDocumentDialog}
        style={{ width: "70vw" }}
        blockScroll
        baseZIndex={1000}
        footer={dialogFooter}
        onShow={onShowDialog}
        onHide={hide}
      >
        <div
          style={{ display: "flex", flexDirection: "column", rowGap: 20 }}
          onClick={() => {
            console.log(
              listMasterData,
              "controlModel666666666666666666666666666666666"
            );
            console.log(
              controlModel,
              "controlModel666666666666666666666666666666666"
            );
          }}
        >
          <Row className="gutter-row-Reference">
            <Col xs={12} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Display"}
                textSubProps={"แสดงผล"}
              />
            </Col>
            <Col xs={12} sm={10} xl={4}>
              <Dropdown
                key={"Display"}
                value={referenceDocumentDialogObject.Display}
                style={{ width: "100%", borderRadius: "6px 6px 6px 6px" }}
                onChange={(e: any) => {
                  _ReferenceDocumentDialog(e.value, "Display");
                }}
                options={[{ Position: "Top" }, { Position: "Bottom" }]}
                optionLabel={"Position"}
              />

              {/* <DropdownComponents
              //   placeholderProps={
              //     referenceDocumentDialogObject.Display.Position
              //   }
              //   onChangeProps={_ReferenceDocumentDialog}
              optionLabelProps="Position"
              optionsProps={[{ Position: "Top" }, { Position: "Bottom" }]}
              //   valueProps={referenceDocumentDialogObject.Display}
              keyProps={"Display"}
            /> */}
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
              <Dropdown
                value={referenceDocumentDialogObject.Mode}
                options={[{ Mode: "Single" }, { Mode: "Multiselect" }]}
                optionLabel={"Mode"}
                onChange={(e: any) => {
                  _ReferenceDocumentDialog(e.value, "Mode");
                }}
                style={{ width: "100%", borderRadius: "6px 6px 6px 6px" }}
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
                  checkedProps={referenceDocumentDialogObject.Affiliation}
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
                  checkedProps={referenceDocumentDialogObject.Quarter}
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
                    referenceDocumentDialogObject.IsDefaultLineApprove
                  }
                  onChangeProps={_ReferenceDocumentDialog}
                  keyProps={"IsDefaultLineApprove"}
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
                textHeaderProps={"Reference Attachment"}
                textSubProps={"ดึงไฟล์แนบ"}
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
                    referenceDocumentDialogObject.ReferenceAttachment
                  }
                  onChangeProps={_ReferenceDocumentDialog}
                  keyProps={"ReferenceAttachment"}
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
                  checkedProps={referenceDocumentDialogObject.DocControl}
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
                        filter
                        display="chip"
                        style={{
                          width: "100% ",
                          fontSize: "13px",
                          borderColor:
                            referenceDocumentDialogObject.DocControl === true
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
                        filter
                        style={{
                          width: "100% ",
                          fontSize: "13px",
                          borderColor:
                            referenceDocumentDialogObject.DocControl === true
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
                        value={referenceDocumentDialogObject.TemplateCancelDoc}
                        options={templateAddCodeMulti}
                        onChange={(e) =>
                          _ReferenceDocumentDialog(e.value, "TemplateCancelDoc")
                        }
                        optionLabel="TemplateNameWithCodeMulti"
                        placeholder="--Please Select--"
                        display="chip"
                        filter
                        style={{
                          width: "100% ",
                          fontSize: "13px",
                          borderColor:
                            referenceDocumentDialogObject.DocControl === true
                              ? referenceDocumentDialogObject.TemplateCancelDoc
                                  .length === 0
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
          <Row className="gutter-row" style={{ rowGap: 10 }}>
            <Col xs={12} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Search"}
                textSubProps={"ค้นหา"}
              />
            </Col>
            <Col xs={12} sm={10} xl={10}>
              <div className="p-inputgroup">
                <AutoComplete
                  options={getOptions()}
                  placeholder={"Search template"}
                  style={{
                    width: "100%",
                    height: 34,
                    borderRadius: "6px 6px 6px 6px",
                  }}
                  filterOption={(inputValue, option) =>
                    // option?.DocumentCode?.toString()
                    //   .toUpperCase()
                    //   .indexOf(inputValue.toUpperCase()) !== -1
                    option.value
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  onChange={(e: any) => {
                    try {
                      let value = e.split("_")[0];
                      setSearchTemplateList([
                        ...templateList.filter(
                          (template: any) =>
                            template.DocumentCode.toLowerCase().startsWith(
                              value.toLowerCase()
                            ) ||
                            template.TemplateSubject.toLowerCase().startsWith(
                              value.toLowerCase()
                            ) ||
                            template.TemplateName.toLowerCase().startsWith(
                              value.toLowerCase()
                            )
                        ),
                      ]);
                    } catch (error) {
                      console.log("table=>onFilter=>error", error);
                    }
                  }}
                  // onBlur={(e: any) => {
                  //   try {
                  //     let value = e.target.value;
                  //   } catch (error) {
                  //     console.log("table=>onFilter=>error", error);
                  //   }
                  // }}
                  // onSelect={(e: any) => {
                  //   try {
                  //     let value = e;
                  //   } catch (error) {
                  //     console.log("table=>onFilter=>error", error);
                  //   }
                  allowClear
                  // }}
                />
              </div>
            </Col>
            {/* </Row>
          <Row className="gutter-row"> */}
            <Col xs={12} sm={12} xl={12}>
              <DataTable
                value={searchTemplateList}
                className="tableTemplateComponents"
                size="small"
                selectionMode="multiple"
                paginator
                first={0}
                rows={3}
                metaKeySelection={false}
                selection={referenceDocumentDialogObject.listRefTemplate}
                onSelectionChange={(e) => {
                  let listRefTemplate = referenceDocumentDialogObject;
                  listRefTemplate.listRefTemplate = e.value;
                  _MapSelectTable(listRefTemplate.listRefTemplate);
                  setReferenceDocumentDialogObject({ ...listRefTemplate });
                }}
              >
                <Column field="DocumentCode" header="Document Code"></Column>
                <Column field="TemplateName" header="Template Name"></Column>
                <Column
                  field="TemplateSubject"
                  header="Template Subject"
                ></Column>
              </DataTable>
            </Col>
          </Row>
          <Row>
            <Col
              xs={12}
              sm={12}
              xl={12}
              style={{ borderBottom: "1px solid #cfcfcf" }}
            >
              <p className="referenceDocumentDialog-dialog-p-textheader">
                Selected Reference Document
              </p>
              <p className="referenceDocumentDialog-dialog-p-text-sub">
                เอกสารอ้างอิงที่เลือก
              </p>
            </Col>
          </Row>
          <Row
            className="gutter-row"
            onClick={() =>
              console.log(
                "ref=>referenceDocumentDialogObject",
                referenceDocumentDialogObject
              )
            }
          >
            <Col xs={12} sm={12} xl={12}>
              {/* <TableTemplateComponentsSelected
                valueProps={referenceDocumentDialogObject.listRefTemplate}
                setValueProps={_ReferenceDocumentDialog}
                keyProps={"listRefTemplate"}
              /> */}
              <DataTable
                value={referenceDocumentDialogObject.listRefTemplate}
                className="tableTemplateComponents dd"
                size="small"
                paginator
                first={0}
                responsiveLayout="scroll"
                rows={3}
                metaKeySelection={false}
              >
                <Column field="DocumentCode" header="Document Code"></Column>
                <Column field="TemplateName" header="Template Name"></Column>
                <Column
                  field="TemplateSubject"
                  header="Template Subject"
                ></Column>
                <Column
                  headerStyle={{ width: "5rem" }}
                  body={(rowData: any) => (
                    <>
                      <ButtonComponents
                        setIconProps="pi pi-trash"
                        setClassNameProps={"set-margin"}
                        onClickProps={() => {
                          let listRefTemplate = referenceDocumentDialogObject;
                          listRefTemplate.listRefTemplate =
                            listRefTemplate.listRefTemplate.filter(
                              (e: any) => e.TemplateId !== rowData.TemplateId
                            );
                          setReferenceDocumentDialogObject({
                            ...listRefTemplate,
                          });
                        }}
                      />
                    </>
                  )}
                ></Column>
              </DataTable>
            </Col>
          </Row>
          <Row className="gutter-row">
            <Col xs={12} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Select Field to show"}
                textSubProps={"เลือกข้อมูลที่จะนำมาแสดง"}
              />
            </Col>
            <Col xs={12} sm={4} xl={4}>
              <Dropdown
                placeholder="-- Please Select --"
                value={referenceDocumentDialogObject.selectField}
                options={selectFieldtoshow}
                optionLabel={"selectField"}
                onChange={(e) => {
                  let _refObject = referenceDocumentDialogObject;
                  _refObject.selectField = e.value;
                  console.log("ref=>_refObject", _refObject);

                  setReferenceDocumentDialogObject({ ..._refObject });
                }}
                style={{ width: "100%", borderRadius: "6px 6px 6px 6px" }}
              />
            </Col>
            {/* <Col xs={12} sm={4} xl={4}>
              <DropdownComponents
                placeholderProps={
                  referenceDocumentDialogObject.selectField.selectField
                    .length === 0
                    ? "-- Please Select --"
                    : referenceDocumentDialogObject.selectField.selectField
                }
                onChangeProps={_ReferenceDocumentDialog}
                optionLabelProps="selectField"
                optionsProps={selectFieldtoshow}
                valueProps={
                  referenceDocumentDialogObject.selectField.selectField
                    .length === 0
                    ? referenceDocumentDialogObject.selectField.selectField
                    : referenceDocumentDialogObject.selectField
                }
                keyProps={"selectField"}
                validationProps={selectFieldValidation}
              />
            </Col> */}
          </Row>
          <Row className="gutter-row">
            <Col xs={12} sm={2} xl={2}>
              <TextHeaderComponents
                textHeaderProps={"Select Field"}
                textSubProps={"เลือกข้อมูล"}
              />
            </Col>
            <Col xs={12} sm={10} xl={10}>
              <DataTable
                value={selectField}
                responsiveLayout="stack"
                metaKeySelection={false}
                className="dd"
                dragSelection
                size="small"
                dataKey="TemplateId"
                filterDisplay="row"
              >
                <Column
                  headerStyle={{ width: "30rem" }}
                  style={{ textAlign: "center" }}
                  header={
                    <TextHeaderComponents
                      textHeaderProps={"Current Template"}
                      //   textSubProps={props.valueProps.TemplateNameWithCode}
                    />
                  }
                  body={actionBodyTemplateTable}
                ></Column>
                <Column
                  headerStyle={{ width: "30rem" }}
                  style={{ textAlign: "center" }}
                  field={"selectedValue"}
                  header={
                    <TextHeaderComponents
                      textHeaderProps={"Reference Form"}
                      //   textSubProps={props.referenceFormProps}
                    />
                  }
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
            </Col>
          </Row>

          {/* <TableTemplateDialogComponents
            valueProps={referenceDocumentDialogObject.templateForm}
            visibleProps={referenceDocumentDialogObject.tableDialog}
            dataProps={referenceDocumentDialogObject.rowDataTable}
            referenceFormProps={referenceDocumentDialogObject.ReferenceForm}
            setVisibleProps={_ReferenceDocumentTableDialog}
            referenceDocumentDialogObjectProps={referenceDocumentDialogObject}
            keyProps={"tableDialog"}
          /> */}

          <TableTemplateDialogComponentsFixed
            visible={tableRefDialog}
            setVisible={setTableRefDialog}
            header={tableRefDialogHeader}
            refTemplateList={referenceDocumentDialogObject?.listRefTemplate}
            rowSelectedData={tableRefData}
            onSaveObjTable={onTableDialogSave}
            // data={undefined}
            // value={undefined}
            // referenceForm={undefined}
            // referenceDocumentDialogObject={undefined}
          />
        </div>
      </Dialog>
    </>
  );
};

export default ReferenceDocumentDialogFix;
