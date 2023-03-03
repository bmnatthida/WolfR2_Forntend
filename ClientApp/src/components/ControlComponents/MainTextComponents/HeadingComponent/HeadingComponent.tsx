import React from "react";
import "./HeadingComponent.css";
interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
}
export default function HeadingComponent(props: Props) {
  return (
    <div className="card.border-primary .color">
      <p className="card-header">
        <div className="label-header ">{props.template.label} </div>
        <div className="alt-label-header">
          {props.template.alter != "" ? `${props.template.alter}` : ""}
        </div>
      </p>
    </div>
  );
}
