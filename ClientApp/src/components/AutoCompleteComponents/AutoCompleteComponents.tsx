import { AutoComplete } from "primereact/autocomplete";
import React, { ReactElement } from "react";
import "./AutoCompleteComponents.css";
interface Props {
  valueProps?: any;
  suggestionsProps?: any;
  completeMethodProps?: any;
  fieldProps?: any;
  disabledProps?: any;
  onChangeProps?: any;
  keyProps?: any;
  styleProps?: any;
  onKeyPress?: any;
  readOnlyprops?: any;
  notButton?: any;
  onBlur?: any;
}

export default function AutoCompleteComponents(props: Props) {
  return (
    <>
      <AutoComplete
        style={props.styleProps}
        value={props.valueProps}
        suggestions={props.suggestionsProps}
        completeMethod={props.completeMethodProps}
        onBlur={(e) => {
          if (props.onBlur) {
            props.onKeyPress(e.target.value, props.keyProps);
            e.target.value = "";
          }
        }}
        field={props.fieldProps}
        className={
          props.notButton === true
            ? "AutoCompleteComponents-autoComplete-notButton"
            : "AutoCompleteComponents-autoComplete"
        }
        multiple
        panelClassName={
          props.notButton === true
            ? "AutoCompleteComponents-autoComplete-notButton"
            : "AutoCompleteComponents-autoComplete"
        }
        disabled={props.disabledProps}
        readOnly={props.readOnlyprops}
        onChange={(e) => props.onChangeProps(e.value, props.keyProps)}
        onMouseDown={(e: any) => {
          console.log("e", e);
        }}
        onKeyPress={(e: any) => {
          console.log("e.code", e.code);

          if (e.code === "Enter") {
            if (props.onKeyPress !== undefined)
              props.onKeyPress(e.target.value, props.keyProps);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
