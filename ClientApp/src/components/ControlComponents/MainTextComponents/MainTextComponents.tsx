import React from "react";
import HeadingComponent from "./HeadingComponent/HeadingComponent";
import TextComponent from "./TextComponent/TextComponent";

interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
}
export default function MainTextComponents(props: Props) {
  return (
    <>
      {props.template.istext === "N" && (
        <HeadingComponent
          template={props.template}
          data={props.data}
          rowIdx={props.rowIdx}
          colIdx={props.colIdx}
        />
      )}
      {props.template.istext === "Y" && (
        <TextComponent
          template={props.template}
          data={props.data}
          rowIdx={props.rowIdx}
          colIdx={props.colIdx}
        />
      )}
    </>
  );
}
