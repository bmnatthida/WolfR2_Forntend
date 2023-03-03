import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AiOutlineFileText } from "react-icons/ai";
import { BiArchiveIn, BiFont } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import useAlert from "../../../hooks/useAlert";
import { Button } from "../../Button/Button";
import "./AutoNumberComponent.css";
interface Props {
  setViewModal: any;
  viewModal: any;
  advanceForm: any;
  setAdvanceForm: any;
  attributeNumber: any;
  setAttributeNumber: any;
  attributeIdx: any;
  checkAction: any;
  setCheckAction: any;
}

export default function AddPreFixComponent(props: Props) {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const dataFormats: any = {
    condition: [],
    format: [],
  };
  const [formats, setFormats] = useState<any>(dataFormats);
  const [selected, setSelected] = useState<string>("1");
  const [selectedFormName, setSelectedFormName] = useState<any>();
  const [defaultValue, setDefaultValue] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const [formatsIdx, setFormatsIdx] = useState<any>();
  const [saveToFormatAction, setSaveToFormatAction] = useState<any>("add");

  useEffect(() => {
    if (props.checkAction === "editPrefix") {
      let _formats = props.attributeNumber.formats;
      let _format = _formats[props.attributeIdx].format;
      for (let i = 0; i < _format.length; i++) {
        if (_format[i].guid == undefined) {
          _format[i]["guid"] = generateQuickGuid();
        }
      }
      setFormats((prevState: any) => ({
        ...prevState,
        format: [..._format],
      }));
    }
  }, []);

  useEffect(() => {
    if (props.advanceForm.items?.length >= 1) {
      let array: any = [];
      props.advanceForm.items.map((_data: any, index: number) => {
        _data.layout.map((_dataLayout: any, index: number) => {
          if (_dataLayout.template.label != undefined) {
            if (
              _dataLayout.template.type === "t" ||
              _dataLayout.template.type === "dd"
            ) {
              array.push({
                item: _dataLayout.template.label,
              });
            }
          }
        });
      });
      setDefaultValue([...array]);
    }
  }, []);
  function SavePreFix() {
    if (formats?.format.length === 0) {
      toggleAlert({
        description: `Please fill in all required fields.`,
        message: `Require field warning.`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Please fill in all required fields.",
      //   life: 6000,
      // });
      return;
    }
    if (props.checkAction === "addFormat") {
      let _attribute = props.attributeNumber.formats;
      _attribute.push(formats);
      props.setAttributeNumber((prevState: any) => ({
        ...prevState,
        formats: [..._attribute],
      }));
    } else if (
      props.checkAction === "editPrefix" ||
      saveToFormatAction === "edit"
    ) {
      let _formats = props.attributeNumber.formats;
      _formats[props.attributeIdx].format = formats.format;
      props.setAttributeNumber((prevState: any) => ({
        ...prevState,
        formats: [..._formats],
      }));
    }

    props.setViewModal(false);
  }
  const footer = (
    <div>
      <button
        type="button"
        onClick={() => {
          SavePreFix();
        }}
        className="hover-color-css-blue set-css-button-save-in-modal"
      >
        <IoSaveOutline /> Save
      </button>
    </div>
  );
  const onSelectedChange = (e: { value: any }) => {
    setSelectedFormName(e.value);
  };

  function onSaveToFormat() {
    if (inputValue === "" && selected === "1") {
      toggleAlert({
        description: `Please fill in all required fields.`,
        message: `Require field warning.`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Please fill in all required fields.",
      //   life: 6000,
      // });
      return;
    } else if (selectedFormName?.item === undefined && selected === "2") {
      toggleAlert({
        description: `Please fill in all required fields.`,
        message: `Require field warning.`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Please fill in all required fields.",
      //   life: 6000,
      // });
      return;
    } else if (selected === "1") {
      if (saveToFormatAction === "edit") {
        let _formats = formats.format;
        const dataRequest = {
          type: "pf",
          label: inputValue,
          guid: generateQuickGuid(),
        };
        _formats[formatsIdx] = dataRequest;
        setFormats((prevState: any) => ({
          ...prevState,
          format: [..._formats],
        }));
      } else if (saveToFormatAction === "add") {
        const dataRequest = {
          type: "pf",
          label: inputValue,
          guid: generateQuickGuid(),
        };
        let _format = formats.format;
        _format.push(dataRequest);
        setFormats((prevState: any) => ({
          ...prevState,
          format: [..._format],
        }));
      }
    } else if (selected === "2") {
      if (saveToFormatAction === "edit") {
        let _formats = formats.format;
        const dataRequest = {
          type: "ddl",
          label: selectedFormName.item,
          guid: generateQuickGuid(),
        };
        _formats[formatsIdx] = dataRequest;
        setFormats((prevState: any) => ({
          ...prevState,
          format: [..._formats],
        }));
      } else if (saveToFormatAction === "add") {
        const dataRequest = {
          type: "ddl",
          label: selectedFormName.item,
          guid: generateQuickGuid(),
        };
        let _format = formats.format;
        _format.push(dataRequest);
        setFormats((prevState: any) => ({
          ...prevState,
          format: [..._format],
        }));
      }
    }
    setSaveToFormatAction("add");
    setInputValue("");
    setSelectedFormName([]);
  }

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result: any) => {
    let _components = formats.format;
    if (!result.destination) {
      return;
    }
    const items = reorder(
      _components,
      result.source.index,
      result.destination.index
    );
    setFormats((prevState: any) => ({
      ...prevState,
      format: [...items],
    }));
  };

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    margin: "0 0 17px 0",
    minHeight: "82px",
    ...draggableStyle,
  });
  function renderIconShowCreateControl(dataType: any) {
    if (dataType === "pf") {
      return (
        <>
          <BiFont className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Fix PreFix</span>
        </>
      );
    } else if (dataType === "ddl") {
      return (
        <>
          <AiOutlineFileText className="fontSize-Fa set-layout-css-icons" />
          <span className=" ">Advance Form</span>
        </>
      );
    }
  }
  function deleteFormat(idx: any) {
    let _formats = formats.format;

    _formats.splice(idx, 1);
    setFormats((prevState: any) => ({
      ...prevState,
      format: [..._formats],
    }));
  }
  function updateFormat(data: any, idx: any) {
    setSaveToFormatAction("edit");
    if (data.type === "pf") {
      setInputValue(data.label);
      setSelected("1");
    } else if (data.type === "ddl") {
      const dd = {
        item: data.label,
      };
      setSelectedFormName(dd);
      setSelected("2");
    }
    setFormatsIdx(idx);
  }
  return (
    <>
      <Dialog
        header="AutoNumber"
        visible={props.viewModal}
        style={{
          width: "70.20833333333333vw",
          height: "43.5vw",
          borderRadius: "16px",
        }}
        onHide={() => props.setViewModal(false)}
        breakpoints={{ "960px": "75vw" }}
        blockScroll
        draggable={false}
        resizable={false}
        footer={footer}
      >
        <div className="row">
          <div className="col-lg-3">
            <>
              <div
                className="Sidebar"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "10px",
                }}
              >
                <Button
                  onSelectView={(e) => {
                    setSelected(e);
                    setSaveToFormatAction("add");
                  }}
                  title={"Fix PreFix"}
                  icon={<BiFont />}
                  page={1}
                  curPage={selected}
                />
                <Button
                  onSelectView={(e) => {
                    setSelected(e);
                    setSaveToFormatAction("add");
                  }}
                  title={"Advance Form"}
                  icon={<AiOutlineFileText />}
                  page={2}
                  curPage={selected}
                />
              </div>
            </>
          </div>

          <div className="col-lg-9 set-card-add-control">
            {selected == "1" && (
              <div className="row set-margin-in-row-add-control">
                <div className="col-md-2 set-layout-text-input">
                  <p className="headtext-form-requestor">Fix Prefix :</p>
                  <p className="headtext-form-requestor set-color-red">*</p>
                </div>
                <div className="col-md-10">
                  <InputText
                    className="set-input-component-css"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              </div>
            )}
            {selected == "2" && (
              <div className="row set-margin-in-row-add-control">
                <div className="col-md-2 set-layout-text-input">
                  <p className="headtext-form-requestor">FormName :</p>
                  <p className="headtext-form-requestor set-color-red">*</p>
                </div>
                <div className="col-md-10">
                  <Dropdown
                    className="set-dnd-revision-css"
                    value={selectedFormName}
                    options={defaultValue}
                    onChange={onSelectedChange}
                    optionLabel="item"
                    filter
                    filterBy="item"
                    placeholder="Select a FormName"
                  />
                </div>
              </div>
            )}
            <div className="set-button-layout-css-prefix">
              <button
                type="button"
                className="hover-color-css-blue set-size-button-css-save-to-format"
                onClick={() => {
                  onSaveToFormat();
                }}
              >
                <IoSaveOutline /> Save To Format
              </button>
            </div>
            {formats?.format?.length >= 1 && (
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
                          }}
                        >
                          {formats?.format?.map((_data: any, idx: any) => (
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
                                        updateFormat(_data, idx);
                                      }}
                                    >
                                      <div className="">
                                        <span className="set-font-data-label-table">
                                          {_data.label}
                                        </span>
                                        <div className="set-border-css-layout">
                                          {renderIconShowCreateControl(
                                            _data.type
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="tool">
                                      <p
                                        className="set-cursor-pointer-css"
                                        onClick={() => {
                                          deleteFormat(idx);
                                        }}
                                      >
                                        <BsTrash />
                                      </p>
                                    </div>
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
              </div>
            )}
          </div>
        </div>
        <Toast ref={toast} />
      </Dialog>
    </>
  );
}
