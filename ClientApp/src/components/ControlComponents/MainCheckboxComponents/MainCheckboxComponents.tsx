import React, { useEffect } from "react";
// import { SelectCheckboxComponent } from "../../AntdControlComponent/MainCheckboxControl/SelectCheckboxComponent";
import { CheckboxControlComponent } from "../../AntdControlComponent/MainCheckboxControl/CheckboxComponent";
import { SelectCheckboxControlComponent } from "../../AntdControlComponent/MainCheckboxControl/SelectCheckboxComponent";
import CheckboxDropdownComponent from "./CheckboxDropdownComponent/CheckboxDropdownComponent";
interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  colText?: number;
  colAction?: number;
  renderInTable?: boolean;
  errorValid?: any;
  statusMemoDetail?: boolean;
  name: any;
  control: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
}
export default function MainCheckboxComponents(props: Props) {
  return (
    <>
      {props.template.attribute.display === "dd" && (
        <SelectCheckboxControlComponent
          canEditDoc={props.canEditDoc}
          checkActionPage={props.checkActionPage}
          template={props.template}
          data={props.data}
          buttonType={props.buttonType}
          // template 5
          // onChangeEditForm={props.onChangeEditForm}
          rowIdx={props.rowIdx}
          colIdx={props.colIdx}
          colText={props.colText != undefined ? props.colText : 0}
          colAction={props.colAction != undefined ? props.colAction : 0}
          control={props.control}
          name={props.name}
        />
      )}
      {props.template.attribute.display !== "dd" && (
        <CheckboxControlComponent
          // buttonType={buttonType}
          buttonType={props.buttonType}
          canEditDoc={props.canEditDoc}
          checkActionPage={props.checkActionPage}
          template={props.template}
          // onChangeEditForm={props.onChangeEditForm}
          rowIdx={props.rowIdx}
          colIdx={props.colIdx}
          colText={props.colText != undefined ? props.colText : 0}
          colAction={props.colAction != undefined ? props.colAction : 0}
          control={props.control}
          name={props.name}
        />
      )}
    </>
  );
}
