import React from "react";
import TextareaComponent from "./TextareaComponent/TextareaComponent";
import ShortTextComponent from "./ShortTextComponent/ShortTextComponent";

interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm: (dataRequest: any, rowIdx: number, colIdx: number) => void;
}
export default function InputTextComponent(props: Props) {
  // return (
  //   <div>
  //     {props.template.type === "t" && (
  //       <ShortTextComponent
  //         template={props.template}
  //         data={props.data}
  //         onChangeEditForm={props.onChangeEditForm}
  //         rowIdx={props.rowIdx}
  //         colIdx={props.colIdx}
  //       />
  //     )}
  //     {props.template.type === "ta" && (
  //       <TextareaComponent
  //         template={props.template}
  //         data={props.data}
  //         onChangeEditForm={props.onChangeEditForm}
  //         rowIdx={props.rowIdx}
  //         colIdx={props.colIdx}
  //       />
  //     )}
  //   </div>
  // );
}
