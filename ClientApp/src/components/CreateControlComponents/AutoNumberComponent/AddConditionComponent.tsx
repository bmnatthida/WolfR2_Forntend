import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import { RiEditLine } from "react-icons/ri";
import useAlert from "../../../hooks/useAlert";
import "./AutoNumberComponent.css";
interface Props {
  setConditionViewModal: any;
  conditionViewModal: any;
  advanceForm: any;
  setAdvanceForm: any;
  setAttributeNumber: any;
  attributeNumber: any;
  attributeIdx: any;
  checkAction: any;
}

export default function AddConditionComponent(props: Props) {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const [selectedFormName, setSelectedFormName] = useState<any>();
  const [selectedFormValue, setSelectedFormValue] = useState<any>();
  const [inputValue, setInputValue] = useState("");
  const [defaultValue, setDefaultValue] = useState<any>([]);
  const [defaultValueItem, setDefaultValueItem] = useState<any>([]);
  const [conditions, setConditions] = useState<any>([]);
  const [actionConditions, setActionConditions] = useState<any>("add");
  const [idxConditions, setIdxConditions] = useState<any>();

  useEffect(() => {
    if (props.checkAction == "editCondition") {
      let _condition =
        props.attributeNumber.formats[props.attributeIdx]?.condition || [];
      setConditions((prevState: any) => ({
        ...prevState,
        condition: [..._condition],
      }));
    }
  }, []);

  useEffect(() => {
    if (props.advanceForm.items?.length >= 1) {
      let array: any = [];
      let arrayItem: any = [];
      let arrayDataItem: any = [];
      props.advanceForm.items.map((_data: any, index: number) => {
        _data.layout.map((_dataLayout: any, index: number) => {
          if (_dataLayout.template.label !== undefined) {
            if (_dataLayout.template.label !== "") {
              if (_dataLayout.template.type !== "em") {
                array.push({
                  item: _dataLayout.template.label,
                  type: _dataLayout.template.type,
                });
              }
            }
          }

          if (_dataLayout.template.attribute != undefined) {
            if (_dataLayout.template.attribute.items) {
              arrayItem.push({ attribute: _dataLayout.template.attribute });
              arrayItem.map((_dataArray: any, index: number) => {
                _dataArray.attribute.items.map(
                  (_dataItem: any, index: number) => {
                    if (_dataItem.item !== "--select--") {
                      arrayDataItem.push({ value: _dataItem.item });
                    }
                  }
                );
              });
            }
          }
        });
      });
      setDefaultValue([...array]);
      setDefaultValueItem([...arrayDataItem]);
    }
  }, []);
  function Save() {
    if (props.checkAction === "editCondition") {
      let _formats = props.attributeNumber.formats;
      _formats[props.attributeIdx].condition = conditions.condition;
      props.setAttributeNumber((prevState: any) => ({
        ...prevState,
        formats: [..._formats],
      }));
      props.setConditionViewModal(false);
    }
  }
  function onSaveToCondition() {
    if (
      inputValue === "" &&
      selectedFormName?.item === undefined &&
      selectedFormValue?.value === undefined
    ) {
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
    } else {
      if (actionConditions === "edit") {
        const dataRequest = {
          type: selectedFormName.type,
          label: selectedFormName.item,
          form: "adv",
          value: selectedFormValue,
          // value: inputValue,
        };

        let _condition = conditions.condition;
        _condition[idxConditions] = dataRequest;
        setConditions((prevState: any) => ({
          ...prevState,
          condition: [..._condition],
        }));
        setActionConditions("add");
      } else if (actionConditions === "add") {
        let _condition = conditions.condition;
        const dataRequest = {
          type: selectedFormName.type,
          label: selectedFormName.item,
          form: "adv",
          value: selectedFormValue,
          // value: inputValue,
        };

        _condition.push(dataRequest);
        setConditions((prevState: any) => ({
          ...prevState,
          condition: [..._condition],
        }));
      }
    }

    setSelectedFormName([]);
    setSelectedFormValue([]);
    setInputValue("");
  }
  function editCondition(_data: any, _idx: any) {
    setSelectedFormName({
      item: _data.label,
      type: _data.type,
    });

    setSelectedFormValue(_data.value);
    setInputValue(_data.value);
    setActionConditions("edit");
    setIdxConditions(_idx);
  }
  function deleteCondition(idx: any) {
    let _condition = conditions.condition;
    _condition.splice(idx, 1);
    setConditions((prevState: any) => ({
      ...prevState,
      condition: [..._condition],
    }));
  }
  const footer = (
    <div>
      <button
        type="button"
        onClick={() => {
          Save();
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
  const onSelectedChangeValue = (e: { value: any }) => {
    setSelectedFormValue(e.value);
  };
  return (
    <>
      <Dialog
        header="Header"
        visible={props.conditionViewModal}
        style={{
          width: "70.20833333333333vw",
          height: "43.5vw",
          borderRadius: "16px",
        }}
        onHide={() => props.setConditionViewModal(false)}
        breakpoints={{ "960px": "75vw" }}
        blockScroll
        draggable={false}
        resizable={false}
        footer={footer}
      >
        <div className="set-card-add-control set-css-layout-table-condition-css-padding">
          <div className="row set-margin-in-row-add-control">
            <div className="col-lg-2">
              <tr>
                <th>
                  <div className="label-text-container">
                    <span className="headtext-form">Column</span>

                    <span className="headtext-form text-Is-require">*</span>
                  </div>
                  <p className="subtext-form">คอลัมน์</p>
                </th>
              </tr>
            </div>
            <div className="col-lg-10">
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
          <div className="row set-margin-in-row-add-control">
            <div className="col-lg-2">
              <tr>
                <th>
                  <div className="label-text-container">
                    <span className="headtext-form">Value</span>
                  </div>
                  <p className="subtext-form">ข้อมูล</p>
                </th>
              </tr>
            </div>
            <div className="col-lg-10">
              <Dropdown
                className="set-dnd-revision-css"
                value={selectedFormValue}
                options={defaultValueItem}
                onChange={onSelectedChangeValue}
                optionLabel="value"
                filter
                filterBy="value"
                placeholder="Select a Value"
              />
            </div>
          </div>
          <div className="row set-margin-in-row-add-control">
            <div className="row set-margin-in-row-add-control">
              <div className="col-lg-12">
                <div className="set-button-layout-css-prefix">
                  <button
                    type="button"
                    className="hover-color-css-blue set-size-button-css-save-to-format set-layout-in-condition-css"
                    onClick={() => {
                      onSaveToCondition();
                    }}
                  >
                    <IoSaveOutline /> Save To Condition
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row set-margin-in-row-add-control">
            <div className="col-lg-12">
              <table className="table-layout-create-control">
                <thead className="thead-light">
                  <tr className="set-bg-color-table-create-control">
                    <th style={{ width: "22.5%" }}>
                      <p className="row headtext">Sequence</p>
                      <p className="row subtext">ลำดับ</p>
                    </th>
                    <th style={{ width: "22.5%" }}>
                      <p className="row headtext">Label</p>
                      <p className="row subtext">ชื่อ</p>
                    </th>
                    <th style={{ width: "22.5%" }}>
                      <p className="row headtext">Value</p>
                      <p className="row subtext">ค่า</p>
                    </th>
                    <th style={{ width: "22.5%" }}>
                      <p className="row headtext">Edit</p>
                      <p className="row subtext">แก้ไข</p>
                    </th>
                    <th style={{ width: "10%" }}>
                      <p className="row headtext">Delete</p>
                      <p className="row subtext">ลบ</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conditions?.condition?.map((data: any, idx: any) => (
                    <>
                      <tr>
                        <td>{idx + 1}</td>
                        <td>{data.label}</td>
                        <td>{data.value}</td>
                        <td>
                          <RiEditLine
                            className="set-css-pointer-css-atn"
                            onClick={() => {
                              editCondition(data, idx);
                            }}
                          />
                        </td>
                        <td>
                          <BsTrash
                            className="set-css-pointer-css-atn"
                            onClick={() => {
                              deleteCondition(idx);
                            }}
                          />
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Toast ref={toast} />
      </Dialog>
    </>
  );
}
