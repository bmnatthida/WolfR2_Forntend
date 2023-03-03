import { InputNumber } from "primereact/inputnumber";
import React, { useEffect } from "react";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import "./SummaryComponent.css";
interface Props {
  headtext: string;
  subtext: string;
  summaryProps?: any;
}

export const SummaryComponent = (props: Props) => {
  return (
    <div className="summary-documentno-justify-conten-margin-bottom">
      <div className="summary-documentno-flex-direction">
        <TextHeaderComponents
          textHeaderProps={props.headtext}
          textSubProps={props.subtext}
        />
      </div>

      <InputNumber
        inputId="integeronly"
        value={props.summaryProps}
        inputClassName="summary-input-number-border-radius"
        minFractionDigits={2}
        // style={{ width: "100%" }}
        inputStyle={{
          textAlign: "right",
          background: "#F5F6F9",
          borderRadius: "6px",
          height: "38px",
          width: " 100%",
        }}
        disabled={true}
      />
    </div>
  );
};
