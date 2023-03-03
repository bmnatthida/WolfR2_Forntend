import { InputText } from "primereact/inputtext";
import React, { useEffect } from "react";
import { replaceSpecialChar } from "../../Helper/ReplaceSpecialChar";
import Field from "../Input/Field";

interface Props {
  setClassNameProps?: any;
  setClassNameSpanProps?: any;
  setStyleDivProps?: any;
  setStyleProps?: any;
  onChangeProps?: any;
  valueProps?: any;
  disabledProps?: any;
  placeholderProps?: any;
  setIconProps?: any;
  onClickProps?: any;
  readOnlyProps?: any;
  setControllerId?: any;
  autoFocusProps?: any;
  fieldProps?: any;
  typeProps?: any;
  acceptProps?: any;
  keyProps?: any;
  onBlurProps?: any;
}

export const InputTextComponents = (props: Props) => {
  return (
    <div style={props.setStyleDivProps}>
      <span
        className={
          props.setClassNameSpanProps === undefined
            ? "inputTextComponents-width "
            : props.setClassNameSpanProps
        }
      >
        {props.setIconProps !== undefined ? props.setIconProps : null}
        <InputText
          className={props.setClassNameProps}
          style={props.setStyleProps}
          onChange={(e) => props.onChangeProps(e.target.value, props.keyProps)}
          value={props.valueProps}
          
          disabled={props.disabledProps}
          placeholder={props.placeholderProps}
          onClick={props.onClickProps}
          readOnly={props.readOnlyProps}
          // id={props.setControllerId}
          // testing if id shows up in the inspect in the right format
          id={replaceSpecialChar(props.valueProps??"")}
          // value={replaceSpecialChar(props.valueProps??"")}
          autoFocus={props.autoFocusProps}
          type={props.typeProps}
          accept={props.acceptProps}
          // onBlur={(e) =>
          //   props.onBlurProps
          //     ? props.onBlurProps(e.target.value, props.keyProps)
          //     : undefined
          // }
          {...props.fieldProps}
        />
      </span>
    </div>
  );
};
