import { isEmptyObject } from "jquery";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoCloseOutline, IoSaveOutline } from "react-icons/io5";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import "../../RequestComponents/InformationComponent/InformationComponent.css";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";

interface Props {
  advanceForm: any;
  updateData: any;
  setDialogVisible: any;
}

function SelectCondition(props: Props) {
  const [selectedColumn, setSelectedColumn] = useState<any>();
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState<any>();

  const [numCondition, setNumCondition] = useState<string>();
  const [isMultiValue, setIsMultiValue] = useState<boolean>(false);
  const [multiOptions, setMultiOptions] = useState<any[]>([]);
  const [multiValues, setMultiValues] = useState<any>();

  const num_conditions = [
    { label: "Equal to (=)", value: "Equal_to" },
    { label: "Not equal (!=)", value: "Not_equal" },
    { label: "Greater-Than (>)", value: "Greater_Than" },
    { label: "Greater-Than or Equal to (>=)", value: "Greater_Than_or_Equal_" },
    { label: "Less-Than (<)", value: "Less_Than" },
    { label: "Less-Than or Equal to (<=)", value: "Less_Than_or_Equal_to" },
  ];

  useEffect(() => {
    const advanceForm: any[] = props.advanceForm.items;
    let columns: any[] = [];
    advanceForm.map((item: any) => {
      item.layout.map((layout: any) => {
        if (
          layout.template.type !== "l" &&
          layout.template.type !== "em" &&
          layout.template.type !== "tb" &&
          !isEmptyObject(layout.template)
        ) {
          columns.push({ label: layout.template.label, control: layout });
        }
      });
    });
    setOptions(columns);
  }, []);

  useEffect(() => {
    try {
      if (selectedColumn !== undefined) {
        if (selectedColumn.control) {
          if (selectedColumn.control.template.attribute !== undefined) {
            if (selectedColumn.control.template.attribute.items !== undefined) {
              setIsMultiValue(true);
              setMultiOptions(selectedColumn.control.template.attribute.items);
            } else {
              setIsMultiValue(false);
            }
          } else {
            setIsMultiValue(false);
          }
        }
      }
    } catch (error) {}
  }, [selectedColumn]);

  return (
    <div className="row-formgroup">
      <div className="row set-layout-form-edit-table ">
        <div className="col-xl-2 font-size-edit-header-input-request">
          <TextHeaderComponents
            textHeaderProps={"Column  : "}
            isRequir
            textSubProps={"คอลัมน์ :"}
          />
        </div>
        <div className="col-xl-10 ">
          <Dropdown
            id={"Column"}
            value={selectedColumn}
            onChange={(e: any) => {
              setSelectedColumn(e.value);
            }}
            filter
            showClear
            filterBy="label"
            optionLabel="label"
            options={options}
          />
        </div>
      </div>
      <div className="row set-layout-form-edit-table ">
        <div className="col-xl-2 font-size-edit-header-input-request">
          <TextHeaderComponents
            textHeaderProps={"Value : "}
            isRequir
            textSubProps={"ข้อมูล :"}
          />
        </div>
        <div className="col-xl-10 ">
          <InputText
            id={"Value"}
            value={value}
            onChange={(e: any) => {
              setValue(e.target.value);
            }}
            className={classNames({
              "p-invalid": value !== undefined && value !== "" ? false : true,
            })}
            autoFocus
          />
        </div>
      </div>
      {selectedColumn?.control?.template?.type === "c" && (
        <div className="row set-layout-form-edit-table ">
          <div className="col-xl-2 font-size-edit-header-input-request">
            <TextHeaderComponents
              textHeaderProps={"Condition  : "}
              isRequir
              textSubProps={"เงื่อนไข :"}
            />
          </div>
          <div className="col-xl-10 ">
            <Dropdown
              id={"num_condition"}
              value={numCondition}
              onChange={(e: any) => {
                setNumCondition(e.value);
              }}
              filter
              showClear
              filterBy="label"
              optionLabel="label"
              options={num_conditions}
            />
          </div>
        </div>
      )}
      {isMultiValue && (
        <div className="row set-layout-form-edit-table ">
          <div className="col-xl-2 font-size-edit-header-input-request">
            <TextHeaderComponents
              textHeaderProps={"Options : "}
              isRequir
              textSubProps={"ตัวเลือก :"}
            />
          </div>
          <div className="col-xl-10 ">
            <Dropdown
              id={"Column"}
              value={multiValues}
              onChange={(e: any) => {
                setMultiValues(e.value);
              }}
              className={classNames({
                "p-invalid":
                  multiValues !== undefined && multiValues !== ""
                    ? false
                    : true,
              })}
              filter
              showClear
              filterBy="item"
              optionLabel="item"
              options={multiOptions}
            />
          </div>
        </div>
      )}
      <div className="footer-dialog">
        <ButtonComponents
          setLabelProps="Cancel"
          setIconProps={
            <IoCloseOutline size={"16px"} style={{ marginRight: "3px" }} />
          }
          onClickProps={() => props.setDialogVisible(false)}
          setClassNameProps="p-button-text referenceDocumentDialog-button"
          setStyleProps={{
            width: "100px",
            border: "0.5px solid #FF2626",
            background: "#FFFFFF",
            color: "#FF2626",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        />

        <ButtonComponents
          setStyleProps={{
            width: "100px",
            borderRadius: "6px",
            boxShadow: "none",
            border: "1px solid #282f6a",
            fontSize: "13px",
            paddingLeft: "16px",
          }}
          onClickProps={() => {
            let val: any;
            if (selectedColumn !== undefined) {
              if (value !== undefined && value !== "") {
                val = value;
                const data: any = {
                  field: selectedColumn.label,
                  value: val,
                };
                if (numCondition) {
                  val = value;
                  data.action = numCondition;
                }
                props.updateData(data, "condition");
              }

              if (multiValues !== undefined) {
                if (multiValues.item !== undefined) {
                  val = multiValues.item;
                  const data = {
                    field: selectedColumn.label,
                    value: val,
                  };
                  props.updateData(data, "condition");
                }
              }
            }
          }}
          typeProps={"button"}
          setLabelProps={"Save"}
          setIconProps={<IoSaveOutline />}
          setClassNameProps={"p-button-text-position"}
        />
      </div>
    </div>
  );
}

export default SelectCondition;
