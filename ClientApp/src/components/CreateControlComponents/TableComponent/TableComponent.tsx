import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { Controller } from "react-hook-form";
import { TabMenu } from "primereact/tabmenu";
import { HiPlus } from "react-icons/hi";
import ColumnComponent from "./ColumnComponent";
import { BiText } from "react-icons/bi";
import { ImTextHeight } from "react-icons/im";
import { AiOutlineNumber } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { IoMdRadioButtonOn } from "react-icons/io";
import { MdOutlineCheckBox } from "react-icons/md";
import { FaRegListAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReferenceDocument from "./ReferenceDocument";
import { TabView, TabPanel } from "primereact/tabview";
import { BsTrash } from "react-icons/bs";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import FooterTableComponents from "./FooterTableComponents";
import { Checkbox } from "primereact/checkbox";
interface Props {
  control: any;
  errors: any;
  template: any;
  setAttributeColumn: any;
  attributeColumn: any;
  setFromRender: any;
  fromRender: any;
  setMergeColumnRefDoc: any;
  mergeColumnRefDoc: any;
  setDocDataSource: any;
  docDataSource: any;
  setSelectedReportRef: any;
  selectedReportRef: any;
  setSelectedTemplateRef: any;
  selectedTemplateRef: any;
  conditions: any;
  setConditions: any;
  advanceForm: any;
  setFooterTable: any;
  footerTable: any;
  setUploadFileState: any;
  uploadFileState: any;
  userData: any;
  setSelectedDocControlTemplate: any;
  selectedDocControlTemplate: any;
  setDefaultConfigColumn: any;
  defaultConfigColumn: any;
}

export default function TableComponent(props: Props) {
  const [viewModal, setViewModal] = useState<any>(false);
  const [layoutIdx, setLayoutIdx] = useState<any>();
  const [action, setAction] = useState<string>("");
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    formula: props.template.formula || "",
    hideInPdf: props.template?.hideInPdf === "Y" || "" ? true : false,
    column: props.template.attribute?.column || [],
  };
  useEffect(() => {
    let respone = props.attributeColumn.column;
    for (let i = 0; i < respone.length; i++) {
      if (respone[i].guid == undefined) {
        respone[i]["guid"] = generateQuickGuid();
      }
    }

    props.setAttributeColumn((prevState: any) => ({
      ...prevState,
      column: [...respone],
    }));
  }, []);

  const items = [
    { label: "Column", icon: "pi pi-book" },
    { label: "Reference Document", icon: "pi pi-folder" },
    { label: "FooterTable", icon: "pi pi-cog" },
  ];
  const [activeIndex, setActiveIndex] = useState<any>(0);
  function renderIconShowCreateControl(dataType: any) {
    if (dataType === "t") {
      return (
        <>
          <BiText className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">ShortText</span>
        </>
      );
    } else if (dataType === "ta") {
      return (
        <>
          <ImTextHeight className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">MultiLine</span>
        </>
      );
    } else if (dataType === "c") {
      return (
        <>
          <AiOutlineNumber className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Number</span>
        </>
      );
    } else if (dataType === "d") {
      return (
        <>
          <FiCalendar className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Calendar</span>
        </>
      );
    } else if (dataType === "r") {
      return (
        <>
          <IoMdRadioButtonOn className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Choice</span>
        </>
      );
    } else if (dataType === "cb") {
      return (
        <>
          <MdOutlineCheckBox className="fontSize-Fa set-layout-css-icons" />
          <span className=" -6-padding">MultiChoice</span>
        </>
      );
    } else if (dataType === "dd") {
      return (
        <>
          <FaRegListAlt className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Dropdown</span>
        </>
      );
    } else if (dataType === "at") {
      return (
        <>
          <GrAttachment className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Attachment</span>
        </>
      );
    }
  }
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result: any) => {
    let _components = props.attributeColumn.column;
    if (!result.destination) {
      return;
    }
    const items = reorder(
      _components,
      result.source.index,
      result.destination.index
    );
    props.setAttributeColumn((prevState: any) => ({
      ...prevState,
      column: [...items],
    }));
  };

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    margin: "0 0 17px 0",
    minHeight: "82px",
    ...draggableStyle,
  });
  function deleteColumn(idx: any) {
    let _components = props.attributeColumn.column;
    _components.splice(idx, 1);
    props.setAttributeColumn((prevState: any) => ({
      ...prevState,
      column: [..._components],
    }));
  }

  return (
    <>
      <div className="container">
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Label</p>
            <span style={{ color: "red" }}>*</span>
            <span className="headtext-form-requestor"> :</span>
          </div>
          <div className="col-md-10">
            <Controller
              name="label"
              control={props.control}
              defaultValue={dataRequest.label}
              rules={{ required: "label is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  autoFocus
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Alt Label: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="alter"
              control={props.control}
              defaultValue={dataRequest.alter}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input-2-input">
            <p className="headtext-form-requestor">Formula :</p>
          </div>
          <div className="col-md-10">
            <Controller
              name="formula"
              control={props.control}
              defaultValue={dataRequest.formula}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
            <p className="set-font-size">
              Operators for use : Addition (+), Subtraction (-), Multiplication
              (*), Division (/) Ex. : Column Label 1*Column Label 2=Column Label
              3
            </p>
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">HideInPdf: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="hideInPdf"
              control={props.control}
              defaultValue={dataRequest.hideInPdf}
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
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-12">
            <div className="card-create-control-table">
              <TabMenu
                model={items}
                activeIndex={parseInt(activeIndex)}
                onTabChange={(e) => {
                  setActiveIndex(e.index);
                }}
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="">
            {activeIndex === 0 && (
              <>
                <div className="set-margin-button-add-column">
                  <button
                    onClick={() => {
                      props.setFromRender("table");
                      setViewModal(true);
                      setAction("add");
                    }}
                    type="button"
                    className="set-color-css-button-add-column hover-color-css-282f6a"
                  >
                    <HiPlus /> Add Column
                  </button>
                </div>
                {props.attributeColumn.column.length !== 0 && (
                  <div>
                    <>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              style={{
                                padding: 4,
                                width: "100%",
                                marginBottom: "41px",
                              }}
                            >
                              {props.attributeColumn.column.map(
                                (_data: any, idx: any) => (
                                  <div className="set-layout-flex-at-add-control ">
                                    <Draggable
                                      draggableId={_data.guid}
                                      key={_data.guid}
                                      index={idx}
                                    >
                                      {(provided: any, snapshot: any) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                          )}
                                          className="set-layout-add-control set-margin-button-add-control"
                                        >
                                          <div
                                            className="row set-layout-data-label-table-icon "
                                            onClick={() => {
                                              setViewModal(true);
                                              setLayoutIdx(idx);
                                              setAction("edit");
                                            }}
                                          >
                                            <div className="">
                                              <span className="set-font-data-label-table">
                                                {_data.label}
                                              </span>
                                              <span>
                                                {_data.alter != ""
                                                  ? ` / ${_data.alter}`
                                                  : ""}
                                              </span>
                                              <div className="set-border-css-layout">
                                                {renderIconShowCreateControl(
                                                  _data.control.template.type
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="tool">
                                            <p
                                              className="set-cursor-pointer-css"
                                              onClick={() => {
                                                deleteColumn(idx);
                                              }}
                                            >
                                              <BsTrash />
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  </div>
                                )
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </>
                  </div>
                )}
              </>
            )}
            {activeIndex === 1 && (
              <>
                <ReferenceDocument
                  attributeColumn={props.attributeColumn}
                  setAttributeColumn={props.setAttributeColumn}
                  setMergeColumnRefDoc={props.setMergeColumnRefDoc}
                  mergeColumnRefDoc={props.mergeColumnRefDoc}
                  control={props.control}
                  template={props.template}
                  setDocDataSource={props.setDocDataSource}
                  docDataSource={props.docDataSource}
                  setSelectedReportRef={props.setSelectedReportRef}
                  selectedReportRef={props.selectedReportRef}
                  setSelectedTemplateRef={props.setSelectedTemplateRef}
                  selectedTemplateRef={props.selectedTemplateRef}
                  setConditions={props.setConditions}
                  conditions={props.conditions}
                  advanceForm={props.advanceForm}
                  setSelectedDocControlTemplate={
                    props.setSelectedDocControlTemplate
                  }
                  selectedDocControlTemplate={props.selectedDocControlTemplate}
                  setDefaultConfigColumn={props.setDefaultConfigColumn}
                  defaultConfigColumn={props.defaultConfigColumn}
                />
              </>
            )}
            {activeIndex === 2 && (
              <>
                <FooterTableComponents
                  advanceForm={props.advanceForm}
                  setFooterTable={props.setFooterTable}
                  footerTable={props.footerTable}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {viewModal && (
        <ColumnComponent
          setViewModal={setViewModal}
          setFromRender={props.setFromRender}
          fromRender={"table"}
          viewModal={viewModal}
          attributeColumn={props.attributeColumn}
          setAttributeColumn={props.setAttributeColumn}
          layoutIdx={layoutIdx}
          action={action}
          setUploadFileState={props.setUploadFileState}
          uploadFileState={props.uploadFileState}
          userData={props.userData}
        />
      )}
    </>
  );
}
