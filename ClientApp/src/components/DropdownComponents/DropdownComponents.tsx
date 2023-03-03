import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import "./DropdownComponents.css";
import { GetAllDynamic } from "../../Services/DynamicService";
interface Props {
  apiName?: string;
  valueProps?: any;
  optionsProps?: any;
  optionLabelProps?: any;
  placeholderProps?: any;
  onChangeProps?: any;
  styleProps?: any;
  keyProps?: any;
  disable?: any;
  filterProps?: boolean;
  validationProps?: boolean;
}

export const DropdownComponents = (props: Props) => {
  const [selectValue, setSelectValue] = useState<any>();
  const [obtions, setObtions] = useState<any[]>([]);
  const [style, setstyle] = useState<any>({});
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  useEffect(() => {
    if (props.apiName !== undefined) {
      fecthData();
    } else {
      setObtions(props.optionsProps);
    }
  }, [props.optionsProps]);

  useEffect(() => {
    if (props.styleProps !== undefined) {
      setstyle(props.styleProps);
    }
  }, [props.styleProps]);

  useEffect(() => {
    if (obtions !== undefined) {
      if (props.keyProps === undefined) {
        obtions.map((data: any) => {
          if (data[props.apiName + "Id"] === props.valueProps.value) {
            setSelectValue(data);
          }
        });
      }
    }
  }, [obtions]);

  useEffect(() => {
    if (props.apiName !== undefined) {
      fecthData();
    }
  }, [props.apiName]);

  useEffect(() => {
    setSelectValue(null);
  }, [props.disable]);

  useEffect(() => {
    if (props.apiName != undefined) {
      props.onChangeProps(props.apiName, selectValue);
    } else if (props.keyProps !== undefined) {
      props.onChangeProps(selectValue, props.keyProps);
    } else {
      props.onChangeProps(selectValue);
    }
  }, [selectValue]);

  async function fecthData() {
    let _dataDynamic = await GetAllDynamic(
      props.apiName + "/GetAll",
      undefined
    );
    if (_dataDynamic !== false) {
      setObtions(_dataDynamic);
    }
  }

  return (
    <>
      <Dropdown
        value={selectValue === undefined ? props.valueProps : selectValue}
        options={
          obtions !== undefined && obtions !== null && obtions.length === 0
            ? props.optionsProps
            : obtions
        }
        disabled={props.disable}
        optionLabel={
          props.optionLabelProps !== undefined
            ? props.optionLabelProps
            : userData.employeeData.Lang === "EN"
            ? "NameEn"
            : "NameTh"
        }
        placeholder={props.placeholderProps}
        onChange={(e: any) => {
          setSelectValue(e.target.value);
        }}
        style={{
          width: style.width !== undefined ? style.width : "100%",
          borderRadius:
            style.borderRadius !== undefined
              ? style.borderRadius
              : "6px 6px 6px 6px",
          ...style,
          borderColor: props.validationProps === true ? "red" : "",
        }}
        filter={props.filterProps === undefined ? false : props.filterProps}
        panelClassName="background-p-highlight"
      />
    </>
  );
};
