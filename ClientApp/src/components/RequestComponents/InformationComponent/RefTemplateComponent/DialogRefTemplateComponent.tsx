import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState, FC, useRef } from "react";
import { InputTextComponents } from "../../../InputTextComponents/InputTextComponents";
import { ValidateRefTemplate } from "../../../../Services/TemplateService";
import useAlert from "../../../../hooks/useAlert";

type Props = {
  refAttribute: any;
  dialogVisibleInRefTemplate: any;
  setDialogVisibleInRefTemplate: any;
  refTempSelected: any;
  refObtions: any[];
  setRefTempSelected: any;
  setSearchRefDocData: any;
  searchRefDocData: any;
  previousRefTempSelected: any;
};

const DialogRefTemplateComponent = (props: Props) => {
  const [filterRefTempValue, setFilterRefTempValue] = useState<string>("");
  const [refSelected, setRefSelected] = useState<any[]>();

  useEffect(() => {
    try {
      if (refSelected) {
        if (
          JSON.stringify(refSelected) !== JSON.stringify(props.refTempSelected)
        ) {
          if (props.refAttribute.mode.toLowerCase() === "single") {
            props.setRefTempSelected(refSelected);
            props.setDialogVisibleInRefTemplate(false);
          }
        }
      }
    } catch (error) {}
  }, [refSelected]);

  useEffect(() => {
    try {
      const dataOption = props.refObtions;
      const data = dataOption.filter((data: any, index: number) => {
        if (
          data.DocumentNo.toLowerCase().includes(
            filterRefTempValue.toLowerCase()
          ) ||
          data.TemplateName.toLowerCase().includes(
            filterRefTempValue.toLowerCase()
          ) ||
          data.MemoSubject.toLowerCase().includes(
            filterRefTempValue.toLowerCase()
          ) ||
          data[props.refAttribute.optionLabel]
            ?.toLowerCase()
            .includes(filterRefTempValue.toLowerCase())
        ) {
          return true;
        }
      });
      props.setSearchRefDocData([...data]);
    } catch (error) {
      console.log("ref=>error", error);
    }
  }, [filterRefTempValue]);

  const renderHeaderRefTemplate = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={filterRefTempValue}
          onChangeProps={(e: any) => setFilterRefTempValue(e)}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };

  const onHide = () => {
    if (refSelected) {
      props.setRefTempSelected([...refSelected]);
    }
    props.setDialogVisibleInRefTemplate(false);
    setFilterRefTempValue("");
  };

  async function onSelect(refTemp: any){
   const validate = await ValidateSelected(refTemp);

   if (validate){
      try {
        if (refTemp === null) {
          setRefSelected([...[]]);
        } else if (!refTemp) {
          setRefSelected([]);
        } else if (Array.isArray(refTemp)) {
          setRefSelected([...refTemp]);
        } else {
          if (Array.isArray(refTemp)) {
            setRefSelected([...refTemp]);
          } else {
            if (Array.isArray(refTemp)) {
              setRefSelected([...refTemp]);
            } else {
              let val: any[] = [];
              val.push(refTemp);
              setRefSelected([...val]);
            }
          }
        }
      } catch (error) {
        console.log("ref=>error", error);
      }
    }
  }
  const { toggleAlert } = useAlert();

  async function ValidateSelected(refTempSelected: any) {
    let respone;
    let valid: boolean = true;
    let val: any[] = [];
    if (refTempSelected){
      if (Array.isArray(refTempSelected)){
        val = refTempSelected
      } else {
        val.push(refTempSelected);
      }
     for (let i = 0; i < val.length; i++) {
      const dataJson = {
        TemplateId: val[i].TemplateId,
        Label: val[i].SelectField.label,
        DocNo: val[i].SelectField.value,
      }
      respone = await ValidateRefTemplate(dataJson);
      if (respone.ValidateRef === false){
        toggleAlert({
          description: respone.Message,
          message: 'Reference documant warning.',
          type: "warning",
          duration: 6,
        });
        valid = false;
      }
     }
    }
    return valid;
  }

  return (
    <>
      <Dialog
        header={renderHeaderRefTemplate}
        visible={props.dialogVisibleInRefTemplate}
        style={{ width: "60vw", borderRadius: "16px" }}
        onShow={() => {
          if (props.refTempSelected) {
            setRefSelected([...props.refTempSelected]);
          }
        }}
        onHide={onHide}
        dismissableMask
        className="information-dialog"
        blockScroll
        draggable={false}
        resizable={false}
        closable
      >
        <DataTable
          paginator
          rows={5}
          value={props.searchRefDocData?.filter((e: any) => e)}
          selection={refSelected}
          onSelectionChange={(e: any) => {
            onSelect(e.value);
          }}
          selectionMode={
            props.refAttribute?.mode.toLowerCase() === "single"
              ? "single"
              : "multiple"
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
              props.refAttribute?.mode.toLowerCase() === "single"
                ? "single"
                : "multiple"
            }
          ></Column>
          {props.refAttribute?.optionLabel !== "Information DocumentNo" ? (
            <Column
              field={props.refAttribute?.optionLabel}
              header={
                <tr>
                  <th>
                    <p className="row headtext">
                      {props.refAttribute?.optionLabel}
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
    </>
  );
};

export default DialogRefTemplateComponent;
