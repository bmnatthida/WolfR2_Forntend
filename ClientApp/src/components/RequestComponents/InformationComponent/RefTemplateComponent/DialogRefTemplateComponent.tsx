import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState, FC, useRef } from "react";
import { InputTextComponents } from "../../../InputTextComponents/InputTextComponents";

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
            try {
              if (e.value === null) {
                setRefSelected([...[]]);
              } else if (!e.value) {
                setRefSelected([]);
              } else if (Array.isArray(e.value)) {
                setRefSelected([...e.value]);
              } else {
                if (Array.isArray(e.value)) {
                  setRefSelected([...e.value]);
                } else {
                  if (Array.isArray(e.value)) {
                    setRefSelected([...e.value]);
                  } else {
                    let val: any[] = [];
                    val.push(e.value);
                    setRefSelected([...val]);
                  }
                }
              }
            } catch (error) {
              console.log("ref=>error", error);
            }
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
