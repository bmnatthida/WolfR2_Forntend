import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import "./CheckboxCpmponents.css";

interface Props {
  checkedProps?: any;
  onChangeProps?: any;
  keyProps?: any;
  notLable?: any;
  readOnlyProps?: boolean;
}

export const CheckboxCpmponents = (props: Props) => {
  return (
    <div className="checkboxCpmponents-checkbox-p-highlight">
      <Checkbox
        inputId="binary"
        checked={props.checkedProps}
        onChange={(e) => props.onChangeProps(e.checked, props.keyProps)}
        readOnly={props.readOnlyProps}
      />
      <label
        style={{
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: "13px",
          lineHeight: "19px",
          marginLeft: "5px",
          color: "#000000",
        }}
        htmlFor="binary"
      >
        {props.notLable !== true && <>{"Yes"}</>}
      </label>
    </div>
  );
};
