import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import useAlert from "../../../hooks/useAlert";
import AttachmentComponent from "../AttachmentComponent/AttachmentComponent";
import CalendarComponent from "../CalendarComponent/CalendarComponent";
import ChoiceComponent from "../ChoiceComponent/ChoiceComponent";
import DropdownComponent from "../DropdownComponent/DropdownComponent";
import CreateControlSideBarElement from "../ModalCreateComponents/CreateControlSideBarElement";
import MultiChoiceComponent from "../MultiChoiceComponent/MultiChoiceComponent";
import NumberComponent from "../NumberComponent/NumberComponent";
import ShortTextComponent from "../ShortTextComponent/ShortTextComponent";
import TextAreaComponent from "../TextAreaComponent/TextAreaComponent";
import "./TableCreateComponents.css";
interface Props {
  setViewModal: any;
  viewModal: any;
  attributeColumn: any;
  setAttributeColumn: any;
  setFromRender: any;
  fromRender: string;
  layoutIdx: any;
  action: any;
  setUploadFileState: any;
  uploadFileState: any;
  userData: any;
}

export default function ColumnComponent(props: Props) {
  const column: any = [
    {
      label: {},
      alter: null,
      control: {},
      data: {
        value: null,
      },
    },
  ];
  const { toggleAlert } = useAlert();
  const toast = useRef<any>(null);
  const [selected, setSelected] = useState<string>("");
  const [component, setComponent] = useState<any>();
  const [itemsList, setItemsList] = useState<any>({ items: [] });
  const [displayDropdown, setDisplayDropdown] = useState<any>();
  const {
    control: control2,
    formState: { errors: errors2 },
    setValue,
    handleSubmit: handleSubmit2,
  } = useForm({
    mode: "onBlur",
  });
  useEffect(() => {
    setSelected("1");
    props.setFromRender("table");
    checkType();
  }, []);

  useEffect(() => {
    renderComponent();
  }, [selected, itemsList]);

  const checkType = () => {
    if (props.action === "edit") {
      let _column = props.attributeColumn.column[props.layoutIdx];
      console.log(props.attributeColumn, "_column");
      checkActionButton(_column.control.template.type);
    }
  };
  const checkActionButton = (dataType: any) => {
    if (dataType === "t") {
      setSelected("1");
    } else if (dataType === "ta") {
      setSelected("2");
    } else if (dataType === "c") {
      setSelected("3");
    } else if (dataType === "d") {
      setSelected("4");
    } else if (dataType === "r") {
      setSelected("5");
    } else if (dataType === "cb") {
      setSelected("6");
    } else if (dataType === "dd") {
      setSelected("7");
    } else if (dataType === "at") {
      setSelected("8");
    } else {
      setSelected("1");
    }
  };

  const requestData = (columnData: any, columnIdx?: number) => {
    let _column = props.attributeColumn.column;
    if (props.action === "add") {
      _column.push(columnData);
    } else if (props.action === "edit") {
      _column[props.layoutIdx] = columnData;
    }
    props.setAttributeColumn((prevState: any) => ({
      ...prevState,
      column: [..._column],
    }));
    props.setFromRender("control");
  };

  const updateChanges2 = (data: any) => {
    if (itemsList.items.length === 0) {
      if (selected === "5" || selected === "6" || selected === "7") {
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: "Please fill in all required fields.",
        //   life: 7000,
        // });
        toggleAlert({
          description: `Please fill in all required fields.`,
          message: `Require field warning.`,
          type: "warning",
        });
        return;
      }
    }
    if (selected === "1") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "t",
            label: data.label,
            alter: data.alter,
            attribute: {
              description: data.description,
              default: data.default,
              length: data.length?.toString() || "0",
              require: data.require ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              widthInTable: data.widthInTable?.toString() || "0",
              hideInPdf: data.hideInPdf ? "Y" : "N",
            },
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "2") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "ta",
            label: data.label,
            alter: data.alter,
            attribute: {
              description: data.description,
              default: data.default,
              length: data.length.toString(),
              require: data.require ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              widthInTable: data.widthInTable.toString(),
              hideInPdf: data.hideInPdf ? "Y" : "N",
            },
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "3") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "c",
            label: data.label,
            alter: data.alter,
            attribute: {
              require: data.require ? "Y" : "N",
              formula: data.formula,
              description: data.description,
              decimal: data.decimal?.toString(),
              default: data.default,
              align: data.align ? "l" : "r",
              min: data.min?.toString(),
              max: data.max?.toString(),
              useComma: data.useComma ? "Y" : "N",
              symbol: data.symbolNumber,
              symbolPosition: data.symbolPosition ? "B" : "E",
              summary: data.summary ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              widthInTable: data.widthInTable.toString(),
              hideInPdf: data.hideInPdf ? "Y" : "N",
              isSummary: data.isSummary ? "Y" : "N",
            },
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "4") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "d",
            label: data.label,
            alter: data.alter,
            attribute: {
              description: data.description,
              require: data.require ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              widthInTable: data.widthInTable.toString(),
              hideInPdf: data.hideInPdf ? "Y" : "N",
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
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "5") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "r",
            label: data.label,
            alter: data.alter,
            attribute: {
              description: data.description,
              require: data.require ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              multipleLine: data.multipleLine ? "Y" : "N",
              widthInTable: data.widthInTable.toString(),
              items: itemsList.items,
              hideInPdf: data.hideInPdf ? "Y" : "N",
            },
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "6") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "cb",
            label: data.label,
            alter: data.alter,
            attribute: {
              description: data.description,
              require: data.require ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              multipleLine: data.multipleLine ? "Y" : "N",
              display: displayDropdown?.code,
              widthInTable: data.widthInTable.toString(),
              items: itemsList.items,
              hideInPdf: data.hideInPdf ? "Y" : "N",
            },
          },
          data: {
            value: {
              items: [],
            },
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "7") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "dd",
            label: data.label,
            alter: data.alter,
            description: data.description,
            attribute: {
              require: data.require ? "Y" : "N",
              items: itemsList.items,
              widthInTable: data.widthInTable.toString(),
              hideInPdf: data.hideInPdf ? "Y" : "N",
            },
            readonly: data.readonly ? "Y" : "N",
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    } else if (selected === "8") {
      const dataRequest = {
        guid: generateQuickGuid(),
        label: data.label,
        alter: data.alter,
        control: {
          template: {
            type: "at",
            label: data.label,
            alter: data.alter,
            description: data.fileTypeFile,
            attribute: {
              require: data.require ? "Y" : "N",
              readonly: data.readonly ? "Y" : "N",
              max: data.maxFile.toString(),
              widthInTable: data.widthInTable.toString(),
              hideInPdf: data.hideInPdf ? "Y" : "N",
            },
          },
          data: {
            value: null,
          },
        },
      };
      requestData(dataRequest);
    }

    props.setViewModal(false);
  };

  const renderComponent = () => {
    let _column: any;
    if (props.action === "add") {
      _column = props.attributeColumn;
    } else if (props.action === "edit") {
      let respone = props.attributeColumn.column[props.layoutIdx];
      _column = {
        label: respone?.label,
        alter: respone?.alter,
        description: respone?.control?.template?.description,
        attribute: {
          description: respone?.control?.template?.attribute?.description,
          default: respone?.control?.template?.attribute?.default,
          length: parseInt(respone?.control?.template?.attribute?.length),
          require: respone?.control?.template?.attribute?.require,
          readonly: respone?.control?.template?.attribute?.readonly,
          min: parseInt(respone?.control?.template?.attribute?.min),
          max: parseInt(respone?.control?.template?.attribute?.max),
          useComma: respone?.control?.template?.attribute?.useComma,
          symbol: respone?.control?.template?.attribute?.symbol,
          symbolPosition: respone?.control?.template?.attribute?.symbolPosition,
          summary: respone?.control?.template?.attribute?.summary,
          decimal: parseInt(respone?.control?.template?.attribute?.decimal),
          formula: respone?.control?.template?.attribute?.formula,
          align: respone?.control?.template?.attribute?.align,
          multipleLine: respone?.control?.template?.attribute?.multipleLine,
          date: {
            symbol: respone?.control?.template?.attribute?.date?.symbol,
          },
          items: [...(respone?.control?.template?.attribute?.items || "")],
          display: respone?.control?.template?.attribute?.display,
          widthInTable: parseInt(
            respone?.control?.template?.attribute?.widthInTable
          ),
          hideInPdf: respone?.control?.template?.attribute?.hideInPdf,
          isSummary: respone?.control?.template?.attribute?.isSummary,
        },
      };
    }
    if (selected === "1") {
      setComponent(
        <ShortTextComponent
          control={control2}
          errors={errors2}
          template={_column}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "2") {
      setComponent(
        <TextAreaComponent
          control={control2}
          errors={errors2}
          template={_column}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "3") {
      setComponent(
        <NumberComponent
          control={control2}
          setValue={setValue}
          errors={errors2}
          template={_column}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "4") {
      setComponent(
        <CalendarComponent
          control={control2}
          errors={errors2}
          template={_column}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "5") {
      setComponent(
        <ChoiceComponent
          control={control2}
          errors={errors2}
          template={_column}
          itemsList={itemsList}
          setItemsList={setItemsList}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "6") {
      setComponent(
        <MultiChoiceComponent
          control={control2}
          errors={errors2}
          template={_column}
          itemsList={itemsList}
          setItemsList={setItemsList}
          setDisplayDropdown={setDisplayDropdown}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "7") {
      setComponent(
        <DropdownComponent
          control={control2}
          errors={errors2}
          template={_column}
          itemsList={itemsList}
          setItemsList={setItemsList}
          fromRender={props.fromRender}
        />
      );
    } else if (selected === "8") {
      setComponent(
        <AttachmentComponent
          control={control2}
          errors={errors2}
          template={_column}
          setUploadFileState={props.setUploadFileState}
          uploadFileState={props.uploadFileState}
          userData={props.userData}
          fromRender={props.fromRender}
        />
      );
    }
  };

  const handleKeyDown = (event: any, callback: any) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      callback(handleSubmit2);
    }
  };

  return (
    <>
      <Dialog
        header="Header"
        visible={props.viewModal}
        style={{
          width: "70.20833333333333vw",
          height: "43.5vw",
          borderRadius: "16px",
        }}
        onHide={() => {
          props.setFromRender("control");
          props.setViewModal(false);
        }}
        breakpoints={{ "960px": "75vw" }}
        blockScroll
        draggable={false}
        resizable={false}
      >
        <Toast style={{ whiteSpace: "pre-line" }} ref={toast} />
        <div className="row">
          <div className="col-lg-3">
            <CreateControlSideBarElement
              curPage={selected}
              onSelectView={setSelected}
              renderIn={"column"}
            ></CreateControlSideBarElement>
          </div>
          <div className="col-lg-9 set-card-add-control">
            <form
              key={2}
              onSubmit={handleSubmit2(updateChanges2)}
              onKeyDown={(e) => {
                handleKeyDown(e, handleSubmit2);
              }}
            >
              {component}
              <div className="footer-dialog-css">
                <button
                  className="set-btn-create-form   hover-color-css-red"
                  onClick={() => {
                    props.setFromRender("control");
                    props.setViewModal(false);
                  }}
                  type="button"
                >
                  <BsX className="set-size-BsX " />
                  Cancel
                </button>

                <button
                  // className="hover-color-css-blue set-btn-create-form set-margin-css-layout-column"
                  className="set-btn-create-form-new hover-color-css-white-2 p-button-outlined"
                  type="submit"
                >
                  <IoSaveOutline /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}
