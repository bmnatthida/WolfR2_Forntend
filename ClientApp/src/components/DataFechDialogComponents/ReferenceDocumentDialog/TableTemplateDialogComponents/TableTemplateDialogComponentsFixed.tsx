import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { TextHeaderComponents } from "../../../TextHeaderComponents/TextHeaderComponents";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ButtonComponents } from "../../../ButtonComponents/ButtonComponents";
import { IoCloseOutline } from "react-icons/io5";
import { BiSave } from "react-icons/bi";
type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  header: string;
  refTemplateList: any[];
  rowSelectedData: any;
  onSaveObjTable: (Key: string, objTable: any) => void;
};

const TableTemplateDialogComponentsFixed: React.FC<Props> = ({
  header,
  setVisible,
  visible,
  refTemplateList,
  rowSelectedData,
  onSaveObjTable,
  ...props
}) => {
  const [objectTable, setObjectTable] = useState<any[]>([]);

  const onShow = () => {
    console.log("ref=>rowSelectedData.objTable", rowSelectedData);

    if (rowSelectedData?.objTable && rowSelectedData?.objTable.length !== 0) {
      setObjectTable([...rowSelectedData.objTable]);
    } else {
      let _objTable: any[] = [];
      rowSelectedData.column.forEach((e: any) => {
        _objTable.push({
          Key: e.control.template.label,
          Template: null,
          Value: null,
          TypeControl: null,
          objTable: [],
        });
      });
      setObjectTable([..._objTable]);
    }
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

  function actionBodyTemplate(rowData: any, option: any) {
    let options: any[] = [];

    let advanceForm: any = null;

    refTemplateList?.map((temp: any) => {
      if (
        temp.DocumentCode ===
        rowSelectedData.selectedValue.selectedValue.split("_")[0]
      ) {
        advanceForm = JSON.parse(temp.AdvanceForm);
      }
    });
    if (advanceForm) {
      advanceForm.items.forEach((item: any) => {
        item.layout.forEach((_layout: any) => {
          if (
            _layout.template.type === "tb" &&
            _layout.template.label ===
              rowSelectedData.selectedValue.selectedValue.split("_")[1]
          ) {
            _layout.template.attribute.column.forEach((e: any) => {
              options.push({
                Key: rowData.Key,
                Template: null,
                Value: e.control.template.label,
                TypeControl: convertType(e.control.template.type),
                objTable: [],
              });
            });
          }
        });
      });
    }

    return (
      <>
        <Dropdown
          value={rowData}
          options={options}
          optionLabel="Value"
          filter
          showClear
          onChange={(e: any) => {
            try {
              let _newObj = objectTable;
              _newObj = _newObj.map((obj: any) => {
                if (e.value) {
                  if (obj.Key === e.value.Key) {
                    obj = e.value;
                  }
                } else if (rowData.Key === obj.Key) {
                  obj.Value = null;
                }
                return obj;
              });

              setObjectTable([..._newObj]);
            } catch (error) {
              console.log("ref=>error", error);
            }
          }}
          style={{ width: "100%", borderRadius: "6px 6px 6px 6px" }}
          placeholder="--Please Select--"
        />
      </>
    );
  }

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
          onClickProps={() => {
            onSaveObjTable(header, objectTable);
          }}
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

  const hide = () => {
    setVisible(false);
  };

  return (
    <div>
      <Dialog
        header={header}
        visible={visible}
        onShow={onShow}
        position={"center"}
        modal
        style={{ width: "70vw" }}
        footer={dialogFooter}
        onHide={hide}
        draggable={false}
        resizable={false}
      >
        <Row className="gutter-row">
          <Col xs={12} sm={2} xl={2}>
            <TextHeaderComponents
              textHeaderProps={"Select Field"}
              textSubProps={"เลือกข้อมูล"}
            />
          </Col>
          <Col xs={12} sm={10} xl={10}>
            <DataTable
              value={objectTable}
              responsiveLayout="scroll"
              className="dd"
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
                    textSubProps={rowSelectedData?.Key}
                  />
                }
              ></Column>
              <Column
                headerStyle={{ width: "30rem" }}
                style={{ textAlign: "center" }}
                header={
                  <TextHeaderComponents
                    textHeaderProps={"Reference Form"}
                    textSubProps={rowSelectedData?.selectedValue.selectedValue}
                  />
                }
                body={actionBodyTemplate}
              ></Column>
            </DataTable>
          </Col>
        </Row>
      </Dialog>
    </div>
  );
};

export default TableTemplateDialogComponentsFixed;
