import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import useAlert from "../../../hooks/useAlert";

interface Props {
  setViewModal: any;
  viewModal: any;
  setAttributeButton: any;
  attributeButton: any;
}

export const AddQueryComponent = (props: Props) => {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const valueDropdown = [{ name: "Document No" }];

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>();

  function onSaveQuery() {
    console.log(inputValue, "inputValue");
    console.log(selectedValue?.name, "inputValue");

    if (!inputValue || !selectedValue?.name) {
      toggleAlert({
        description: `Please fill in all required fields.`,
        message: `Require field warning.`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Please fill in all required fields.",
      //   life: 7000,
      // });
      return;
    }
    let _items = props.attributeButton.items;
    const dataRequest = {
      layout: [
        {
          paramiter: {
            value: inputValue,
          },
          control: {
            label: selectedValue.name,
          },
        },
      ],
    };
    _items.push(dataRequest);
    props.setAttributeButton((prevState: any) => ({
      ...prevState,
      items: [..._items],
    }));
    props.setViewModal(false);
  }
  const footer = (
    <div>
      <button
        type="button"
        onClick={() => {
          onSaveQuery();
        }}
        className="hover-color-css-blue set-css-button-save-in-modal"
      >
        <IoSaveOutline /> Save
      </button>
    </div>
  );

  return (
    <>
      <Dialog
        header="Button"
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
        baseZIndex={2}
      >
        <div className="set-card-add-control set-css-layout-table-condition-css-padding">
          <div className="row set-margin-in-row-add-control">
            <div className="col-lg-2">
              <tr>
                <th>
                  <div className="label-text-container">
                    <span className="headtext-form">Parameter</span>

                    <span className="headtext-form text-Is-require">*</span>
                  </div>
                  <p className="subtext-form">ตัวแปร</p>
                </th>
              </tr>
            </div>
            <div className="col-lg-10">
              <InputText
                className="set-input-component-css"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
          <div className="row set-margin-in-row-add-control">
            <div className="col-lg-2">
              <tr>
                <th>
                  <div className="label-text-container">
                    <span className="headtext-form">Control</span>

                    <span className="headtext-form text-Is-require">*</span>
                  </div>
                  <p className="subtext-form">ควบคุม</p>
                </th>
              </tr>
            </div>
            <div className="col-lg-10">
              <Dropdown
                className="set-dnd-revision-css"
                value={selectedValue}
                options={valueDropdown}
                onChange={(e: any) => {
                  setSelectedValue(e.value);
                }}
                optionLabel="name"
                placeholder="--Select--"
              />
            </div>
          </div>
        </div>
        <Toast ref={toast} />
      </Dialog>
    </>
  );
};
