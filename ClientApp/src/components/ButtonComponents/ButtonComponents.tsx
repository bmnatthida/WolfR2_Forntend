import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import "./ButtonComponents.css";
import { replaceSpecialChar } from "../../Helper/ReplaceSpecialChar";
interface Props {
  setClassNameProps?: any;
  setStyleDivProps?: any;
  setLabelProps?: any;
  setStyleProps?: any;
  disabledProps?: any;
  setIconProps?: any;
  onClickProps?: any;
  typeProps?: any;
  loading?: boolean;
}

export const ButtonComponents = (props: Props) => {
  return (
    <Button
      label={props.setLabelProps}
      icon={props.setIconProps}
      id={replaceSpecialChar(props.setLabelProps??"")}
      // id={props.setLabelProps}
      className={props.setClassNameProps + " ButtonComponents-background"}
      onClick={props.onClickProps}
      loading={props?.loading}
      style={{
        ...props.setStyleProps,
      }}
      disabled={props.disabledProps}
      type={props.typeProps}
    />
  );
};
