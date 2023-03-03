import React, { ReactElement } from "react";
import { RadioButton } from "primereact/radiobutton";
import "./RadioButtonComponents.css";
interface Props {
  inputIdProps: any;
  nameProps: any;
  valueProps: any;
  onChangeProps: any;
  checkedProps: any;
  keyProps: any;
  labelProps?: any;
}

export const RadioButtonComponents = (props: Props) => {
  return (
    <>
      <RadioButton
        inputId={props.inputIdProps}
        name={props.nameProps}
        value={props.valueProps}
        onChange={(e) => {
          console.log("report=>e", e);
          props.onChangeProps(e.value, props.keyProps);
        }}
        checked={props.checkedProps}
      />
      <label htmlFor={props.inputIdProps} className="radiobutton-texrt-label">
        {props.labelProps}
      </label>
    </>
  );
};
