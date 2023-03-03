import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { BiArchiveIn } from "react-icons/bi";
import { FaHeading } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";
import useAlert from "../../../hooks/useAlert";
import { Button } from "../../Button/Button";
import "./RevisionComponent.css";
interface Props {
  setViewModal: any;
  viewModal: any;
  advanceForm: any;
  setAdvanceForm: any;
  setRevisionConditions: any;
  revisionConditions: any;
  conditionsIdx: any;
  checkAction: any;
}

export default function AddConditionModal(props: Props) {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const [selectedFormName, setSelectedFormName] = useState<any>();
  const [defaultValue, setDefaultValue] = useState<any>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (props.checkAction == "edit") {
      setSelectedFormName({
        item: props.revisionConditions.conditions[props.conditionsIdx]?.label,
      });
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
              _dataLayout.template.type === "an"
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
  function saveConditions() {
    if (selectedFormName == undefined) {
      toggleAlert({
        description: `Please fill in all required fields.`,
        message: `Require field warning.`,
        type: "warning",
      });
      return;
    }
    if (props.checkAction === "add") {
      const newConditions: any = {
        label: selectedFormName.item,
        boxid: "",
        controltype: "AdvanceForm",
      };
      let _conditions = props.revisionConditions.conditions;
      _conditions.push(newConditions);
      props.setRevisionConditions((prevState: any) => ({
        ...prevState,
        conditions: [..._conditions],
      }));
    } else if (props.checkAction === "edit") {
      const newConditions: any = {
        label: selectedFormName.item,
        boxid: "",
        controltype: "AdvanceForm",
      };
      let _conditions = props.revisionConditions.conditions;
      _conditions[props.conditionsIdx] = newConditions;
      props.setRevisionConditions((prevState: any) => ({
        ...prevState,
        conditions: [..._conditions],
      }));
    }

    props.setViewModal(false);
  }
  const footer = (
    <div>
      <button
        type="button"
        onClick={() => {
          saveConditions();
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
  return (
    <>
      <Dialog
        header="Revision"
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
            <div className="Sidebar">
              <Button
                onSelectView={(e) => setSelected(e)}
                title={"Advance Form"}
                icon={<BiArchiveIn />}
                page={0}
                curPage={selected}
              />
            </div>
          </div>
          <div className="col-lg-9 set-card-add-control">
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
          </div>
        </div>
        <Toast ref={toast} />
      </Dialog>
    </>
  );
}
