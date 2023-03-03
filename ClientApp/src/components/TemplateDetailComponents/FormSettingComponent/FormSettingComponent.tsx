import React, { useState, useEffect } from "react";
import "./FormSettingComponent.css";
import { Row, Col } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Column1 from "../../../assets/ImageAddControl/Column1.svg";
import Column2 from "../../../assets/ImageAddControl/Column2.svg";
import Field from "../../../assets/ImageAddControl/Field.svg";
import FluentText from "../../../assets/ImageAddControl/FluentText.svg";

import ModalCreateComponents from "../../CreateControlComponents/ModalCreateComponents/ModalCreateComponents";
import { Button as ButtonComponent } from "../../../components/Button/Button";
import { Button } from "primereact/button";
import ButtonForm from "../../ButtonForm/ButtonForm";
import { AiOutlineNumber, AiOutlinePlus } from "react-icons/ai";

import iconsDelete from "../../../assets/ImageAddControl/ImageActionAddControl/iconsDelete.svg";
import iconsCopy from "../../../assets/ImageAddControl/ImageActionAddControl/iconsCopy.svg";
import iconsEdit from "../../../assets/ImageAddControl/ImageActionAddControl/iconsEdit.svg";
import {
  BsFileEarmarkRichtext,
  BsFileEarmarkText,
  BsFileFont,
  BsSortNumericDown,
  BsTable,
  BsTrash,
  BsX,
} from "react-icons/bs";
import { BiCopyAlt, BiText, BiTimeFive } from "react-icons/bi";
import { FaHeading, FaRegImage, FaRegListAlt } from "react-icons/fa";
import { ImTextHeight } from "react-icons/im";
import { FiCalendar } from "react-icons/fi";
import { IoMdRadioButtonOn } from "react-icons/io";
import { MdOutlineCheckBox } from "react-icons/md";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { GrAttachment } from "react-icons/gr";
import { CgPlayButtonO } from "react-icons/cg";
import TinyMceComponent from "../../TinyMceComponent/TinyMceComponent";
type Props = {
  setAdvanceForm: any;
  advanceForm: any;
  textFromValue: any;
  setTextFromValue: any;
  setViewManageComponent: any;
  viewManageComponent: any;
  setControlModel: any;
};

const FormSettingComponent = (props: Props) => {
  const [viewModalControl, setViewModalControl] = useState<boolean>(false);

  const [itemIdx, setItemsIdx] = useState<any>();
  const [layoutIdx, setLayoutIdx] = useState<any>();
  const [layoutLength, setLayoutLength] = useState<any>();

  const column1: any = {
    layout: [
      {
        template: {
          alter: "",
          label: "",
          type: "em",
          attribute: {
            require: "",
            description: "",
            length: "",
            default: "",
          },
        },
        data: { value: null },
        guid: generateQuickGuid(),
      },
    ],
  };
  const column2: any = {
    items: {
      layout: [
        {
          template: {
            alter: "",
            label: "",
            type: "em",
            attribute: {
              require: "",
              description: "",
              length: "",
              default: "",
            },
          },
          data: { value: null },
          guid: generateQuickGuid(),
        },
        {
          template: {
            alter: "",
            label: "",
            type: "em",
            attribute: {
              require: "",
              description: "",
              length: "",
              default: "",
            },
          },
          data: { value: null },
          guid: generateQuickGuid(),
        },
      ],
    },
  };
  function findUnique(str: string, data: any) {
    var uniq = str;
    data.map((_dataLayout: any, index: number) => {
      _dataLayout.layout.map((_data: any, index: number) => {
        if (_data.template.label != undefined) {
          if (_data.template.type !== "em") {
            if (_data.template.label.includes(str)) {
              uniq = uniq + "-copy";
              console.log(str);
              console.log(_data.template.label);
            }
          }
        }
      });
    });
    return uniq;
  }

  function copyLayout(itemIdx: number, layoutIdx: number, data: any) {
    let _components = props.advanceForm.items;
    if (_components[itemIdx].layout.length == 1) {
      var unique = findUnique(
        _components[itemIdx].layout[0].template.label,
        props.advanceForm.items
      );
      const newCol1: any = {
        layout: [
          {
            template: {
              ...data.layout[0].template,
              label: unique,
            },
            data: data.layout[0].data,
            guid: generateQuickGuid(),
          },
        ],
      };
      _components.splice(itemIdx + 1, 0, newCol1);
    } else if (_components[itemIdx].layout.length == 2) {
      var unique1 = findUnique(
        _components[itemIdx].layout[0].template.label,
        props.advanceForm.items
      );
      var unique2 = findUnique(
        _components[itemIdx].layout[1].template.label,
        props.advanceForm.items
      );
      const newCol2: any = {
        layout: [
          {
            template: {
              ...data.layout[0].template,
              label: unique1,
            },
            data: data.layout[0].data,
            guid: generateQuickGuid(),
          },
          {
            template: {
              ...data.layout[1].template,
              label: unique2,
            },
            data: data.layout[1].data,
            guid: generateQuickGuid(),
          },
        ],
      };
      _components.splice(itemIdx + 1, 0, newCol2);
    }
    props.setAdvanceForm((prevState: any) => ({
      ...prevState,
      items: [..._components],
    }));
  }

  function deleteLayout(itemIdx: number, layoutIdx: number) {
    let _components = props.advanceForm.items;
    _components.splice(itemIdx, 1);
    props.setAdvanceForm((prevState: any) => ({
      ...prevState,
      items: [..._components],
    }));
  }

  function deleteControl(itemIdx: number, layoutIdx: number, data: any) {
    let _components = props.advanceForm.items;
    _components[itemIdx].layout[layoutIdx].template = {};
    props.setAdvanceForm((prevState: any) => ({
      ...prevState,
      items: [..._components],
    }));
  }

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result: any) => {
    let _components = props.advanceForm.items;
    if (!result.destination) {
      return;
    }
    const items = reorder(
      _components,
      result.source.index,
      result.destination.index
    );

    props.setAdvanceForm((prevState: any) => ({
      ...prevState,
      items: [...items],
    }));
  };

  function renderIconShowCreateControl(dataType: any) {
    if (dataType === "l") {
      return (
        <>
          <FaHeading className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Heading</span>
        </>
      );
    } else if (dataType === "t") {
      return (
        <>
          <BiText className="fontSize-Fa" />
          <span className="set-padding-at-create-control">ShortText</span>
        </>
      );
    } else if (dataType === "ta") {
      return (
        <>
          <ImTextHeight className="fontSize-Fa" />
          <span className="set-padding-at-create-control">MultiLine</span>
        </>
      );
    } else if (dataType === "c") {
      return (
        <>
          <AiOutlineNumber className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Number</span>
        </>
      );
    } else if (dataType === "d") {
      return (
        <>
          <FiCalendar className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Calendar</span>
        </>
      );
    } else if (dataType === "r") {
      return (
        <>
          <IoMdRadioButtonOn className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Choice</span>
        </>
      );
    } else if (dataType === "cb") {
      return (
        <>
          <MdOutlineCheckBox className="fontSize-Fa" />
          <span className="set-padding-at-create-control-6-padding">
            MultiChoice
          </span>
        </>
      );
    } else if (dataType === "dd") {
      return (
        <>
          <FaRegListAlt className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Dropdown</span>
        </>
      );
    } else if (dataType === "tb") {
      return (
        <>
          <BsTable className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Table</span>
        </>
      );
    } else if (dataType === "ed") {
      return (
        <>
          <BsFileEarmarkRichtext className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Rich Text</span>
        </>
      );
    } else if (dataType === "at") {
      return (
        <>
          <GrAttachment className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Attachment</span>
        </>
      );
    } else if (dataType === "bt") {
      return (
        <>
          <CgPlayButtonO className="fontSize-Fa" />
          <span className="set-padding-at-create-control-6-padding">
            Button
          </span>
        </>
      );
    } else if (dataType === "an") {
      return (
        <>
          <BsSortNumericDown className="fontSize-Fa" />
          <span className="set-padding-at-create-control-6-padding">
            AutoNumber
          </span>
        </>
      );
    } else if (dataType === "rvs") {
      return (
        <>
          <BiTimeFive className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Revision</span>
        </>
      );
    } else if (dataType === "im") {
      return (
        <>
          <FaRegImage className="fontSize-Fa" />
          <span className="set-padding-at-create-control">Image</span>
        </>
      );
    }
  }
  function truncate(str: any, no_words: any) {
    return str.split(" ").splice(0, no_words).join(" ");
  }

  return (
    <>
      <div
        className="set-layout-in-setting-from"
        onClick={() => {
          console.log(props.advanceForm, "ControlModel");
        }}
      >
        <div className="set-layout-button-field">
          <button
            className={`set-bg-bttn-glass hover-color-css${
              props.viewManageComponent == "1" ? " BTNActive" : ""
            }`}
            onClick={() => {
              props.setViewManageComponent("1");
              props.setControlModel((prevState: any) => ({
                ...prevState,
                templateForm: { ...prevState.templateForm, IsTextForm: false },
              }));
            }}
          >
            <BsFileEarmarkText /> Field
          </button>

          <button
            className={`set-bg-bttn-glass hover-color-css${
              props.viewManageComponent == "2" ? " BTNActive" : ""
            }`}
            onClick={() => {
              props.setViewManageComponent("2");
              props.setControlModel((prevState: any) => ({
                ...prevState,
                templateForm: { ...prevState.templateForm, IsTextForm: true },
              }));
            }}
          >
            <BsFileFont /> Text
          </button>
        </div>
        {props.viewManageComponent == "1" && (
          <div className="set-layout-in-add-control-grid">
            {props.advanceForm.items.length === 0 ? (
              <div className="set-card-create">
                <p className="set-font-in-card">Please Add Column</p>
              </div>
            ) : (
              <>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided: any, snapshot: any) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          // background: snapshot.isDraggingOver
                          //   ? "lightblue"
                          //   : "lightgrey",
                          padding: 4,
                          width: "100%",
                        }}
                        key={props.advanceForm}
                      >
                        {props.advanceForm.items.map((data: any, idx: any) => (
                          <div
                            className="set-layout-flex-at-add-control "
                            onClick={() => {
                              setLayoutLength(data.layout.length);
                            }}
                          >
                            <Draggable
                              draggableId={data.layout[0].guid}
                              key={data.layout[0].guid}
                              index={idx}
                            >
                              {(provided: any, snapshot: any) => (
                                <div
                                  key={data.layout[0].guid}
                                  className="set-layout-add-control set-margin-button-add-control"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: "none",
                                    margin: "0 0 20px 0",
                                    minHeight: "70px",
                                    // backgroundColor: snapshot.isDragging
                                    //   ? "#263B4A"
                                    //   : "#456C86",
                                    color: "white",
                                    ...provided.draggableProps.style,
                                    cursor: snapshot.isDragging
                                      ? "-webkit-grabbing"
                                      : "-webkit-grab",
                                  }}
                                >
                                  {data.layout.map((_data: any, idx2: any) => (
                                    <div
                                      key={_data.guid}
                                      className="set-layout-flex-at-add-control-layout"
                                    >
                                      {_data.template.label ? (
                                        <div className="tool2">
                                          <p
                                            className="set-cursor-pointer-css"
                                            onClick={() =>
                                              deleteControl(idx, idx2, data)
                                            }
                                          >
                                            <BsX />
                                          </p>
                                        </div>
                                      ) : (
                                        <></>
                                      )}

                                      <div className="tool">
                                        <p
                                          className="set-cursor-pointer-css"
                                          onClick={() =>
                                            copyLayout(idx, idx2, data)
                                          }
                                        >
                                          <BiCopyAlt />
                                        </p>
                                        <p
                                          className="set-cursor-pointer-css"
                                          onClick={() =>
                                            deleteLayout(idx, idx2)
                                          }
                                        >
                                          <BsTrash />
                                        </p>
                                      </div>
                                      <div
                                        className="set-css-border-action-add-create-form "
                                        onClick={() => {
                                          setItemsIdx(idx);
                                          setLayoutIdx(idx2);
                                          setViewModalControl(true);
                                        }}
                                      >
                                        {_data.template?.type &&
                                        _data.template?.type != "em" ? (
                                          <div className="row">
                                            <div className="set-text-in-control-form-add">
                                              <span className="set-color-label-create-control">
                                                {/* {_data.template.label ? (
                                                  _data.template.label
                                                ) : (
                                                  <div
                                                  // style={{
                                                  //   minHeight: "20.42px",
                                                  // }}
                                                  />
                                                )} */}

                                                {_data.template.textvalue ? (
                                                  truncate(
                                                    _data.template.textvalue,
                                                    3
                                                  )
                                                ) : _data.template.label ? (
                                                  _data.template.label
                                                ) : (
                                                  <div
                                                    style={{
                                                      minHeight: "20.42px",
                                                    }}
                                                  />
                                                )}
                                              </span>
                                              <span className="set-color-alt-label-create-control">
                                                {_data.template.textvalue
                                                  ? ""
                                                  : _data.template.alter
                                                  ? ` / ${_data.template.alter}`
                                                  : ""}
                                                {/* {_data.template.alter
                                                  ? ` / ${_data.template.alter}`
                                                  : ""} */}
                                              </span>
                                            </div>
                                            <div className="set-layout-control-edit-and-icon">
                                              <div className="set-color-bg-lay-out-control-edit">
                                                {renderIconShowCreateControl(
                                                  _data.template.type
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="font-at-add-control set-layout-form-control-font-at-add">
                                            <AiOutlinePlus className="set-css-in-icon" />
                                            Add Control
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Draggable>
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
          </div>
        )}

        {props.viewManageComponent == "1" && (
          <div className="set-layout-button-field">
            <button
              onClick={() => {
                let col = props.advanceForm.items;
                col.push(column1);
                props.setAdvanceForm((prevState: any) => ({
                  ...prevState,
                  items: [...col],
                }));
              }}
              className="set-bg-bttn-glass hover-color-css"
            >
              <BsFileEarmarkText /> Column1
            </button>
            <button
              onClick={() => {
                let col = props.advanceForm.items;
                col.push(column2.items);
                props.setAdvanceForm((prevState: any) => ({
                  ...prevState,
                  items: [...col],
                }));
              }}
              className="set-bg-bttn-glass hover-color-css"
            >
              <BsFileEarmarkText /> Column2
            </button>
          </div>
        )}
        {props.viewManageComponent == "2" && (
          <TinyMceComponent
            setTextFromValue={props.setTextFromValue}
            textFromValue={props.textFromValue}
          />
        )}
      </div>
      {viewModalControl && (
        <ModalCreateComponents
          layoutIdx={layoutIdx}
          itemIdx={itemIdx}
          layoutLength={layoutLength}
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
          visibleCreateControl={viewModalControl}
          setVisibleCreateControl={setViewModalControl}
        ></ModalCreateComponents>
      )}
    </>
  );
};

export default FormSettingComponent;
