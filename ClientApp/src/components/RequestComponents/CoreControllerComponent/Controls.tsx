import React, { FC, useEffect } from "react";
import { Col } from "react-bootstrap";
import { Controller, useFieldArray } from "react-hook-form";
import {
  TemplateDescContext,
  TemplateDescContextProvider,
} from "../../../Context/TemplateDescContext";
import { formatColumn } from "../../../Helper/formatColumn";
import { IAutoNumberAttibute } from "../../../IRequestModel/IAutoNumberFormat";
import { IMemoDetailModel } from "../../../IRequestModel/IMemoDetailModel";
import { AttachmentControlComponent } from "../../AntdControlComponent/AttachmentUploadControlComponent/AttachmentComponent";
import { DatePickerControlComponent } from "../../AntdControlComponent/DatePickerControlComponent/DatePickerControlComponent";
import { InputControlComponent } from "../../AntdControlComponent/InputControlComponent/InputControlComponent";
import { InputNumberControlComponent } from "../../AntdControlComponent/InputNumberControlComponent/InputNumberControlComponent";
import { RadioControlComponent } from "../../AntdControlComponent/RadioControlComponent/RadioControlComponent";
import { SelectDropdownControlComponent } from "../../AntdControlComponent/SelectDropdownContronComponent/SelectDropdownContronComponent";
import TableComponent, {
  tableSelectOption,
} from "../../AntdControlComponent/TableComponent/TableComponent";
import { InputTextAreaControlComponent } from "../../AntdControlComponent/TextAreaControlComponent/InputTextAreaControlComponent";
import ButtonComponent from "../../ControlComponents/ButtonComponent/ButtonComponent";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { EditorComponent } from "../../ControlComponents/EditorComponent/EditorComponent";
import { EmptyComponent } from "../../ControlComponents/EmptyComponent/EmptyComponent";
import ImageComponent from "../../ControlComponents/ImageComponent/ImageComponent";
import MainCheckboxComponents from "../../ControlComponents/MainCheckboxComponents/MainCheckboxComponents";
import MainTextComponents from "../../ControlComponents/MainTextComponents/MainTextComponents";
import AutoNumberComponent from "../../ControlComponents/NumberComponent/AutoNumberComponent/AutoNumberComponent";
import RevisionNumberComponent from "../../ControlComponents/NumberComponent/RevisionComponent/RevisionComponent";

type Props = {
  nestIndex: number;
  control: any;
  register: any;
  documentNo: any;
  controlRef: any;
  onControlChange: (controlTemplate: any, controlValue: any) => any;
  controlUpdate: any;
  calCulateCorecontrol: any;
  isControlLoading: any;
  canEditDoc: boolean;
  checkActionPage: string;
  tableSummaries?: any[];
  updateTableSummaries: (tableTemp: any, value: any) => void;
  buttonType: string;
  autoNumFormat: IAutoNumberAttibute;
  onSubmit: any;
  memoDetail: IMemoDetailModel;
  tableOptions: tableSelectOption[];
  setTableOptions: (value: tableSelectOption[]) => void;
};

const Controls: FC<Props> = ({
  control,
  nestIndex,
  register,
  documentNo,
  controlRef,
  onControlChange,
  controlUpdate,
  autoNumFormat,
  isControlLoading,
  calCulateCorecontrol,
  memoDetail,
  onSubmit,
  canEditDoc,
  checkActionPage,
  tableSummaries,
  updateTableSummaries,
  buttonType,
  tableOptions,
  setTableOptions,
}) => {
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: `items[${nestIndex}].layout`,
  });

  return (
    <>
      {/* <button type="button" onClick={onLogs}></button> */}
      {fields.map((layout: any, layoutIdx: number) => {
        // const layouts = fieldslayout;
        // console.log({ nestIndex, layoutIdx });

        const layoutLength = fields.length;
        const grid_size = 12 / layoutLength;
        let _colText = 0;
        let _colAction = 0;
        if (layoutLength == 1) {
          _colText =
            layout.template.type === "tb" || layout.template.type === "ed"
              ? 12
              : 2;
          _colAction = layout.template.type === "ed" ? 12 : 10;
        } else if (layoutLength == 2) {
          _colText = 2;
          _colAction = 4;
        }
        let _isCanEdit = canEditDoc;
        const findInAutoFormat = autoNumFormat?.formats?.find((e) =>
          e.format.find((l) => l.label === layout.template.label)
        );
        if (findInAutoFormat) {
          if (memoDetail.status !== "New Request") {
            canEditDoc = false;
          }
        }
        if (layout.template.type === "l" && layout.isShow) {
          return (
            <MainTextComponents
              key={layout.id}
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
            />
          );
        } else if (layout.template.type === "ed" && layout.isShow) {
          return (
            // <Col md={grid_size} xs={12}>
            <>
              <ComponentLabel
                colText={_colText}
                rowIdx={nestIndex}
                colIdx={layoutIdx}
                template={layout.template}
              />
              <EditorComponent
                key={layout.id}
                buttonType={buttonType}
                rowIdx={nestIndex}
                colIdx={layoutIdx}
                canEditDoc={canEditDoc}
                colText={_colText}
                colAction={_colAction}
                // onChangeEditForm={onChangeEditForm}
                template={layout.template}
                data={layout.data}
                name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
                control={control}
                // errorValid={error_corecontroll}
                // statusMemoDetail={props.statusMemoDetail}
              />
            </>
            // </Col>
          );
        } else if (layout.template.type === "c" && layout.isShow) {
          return (
            <InputNumberControlComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
              //  defaultValue={value}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              // key={layoutIdx}
              colIdx={layoutIdx}
              // onChangeEditForm={onChange}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              onControlChange={onControlChange}
              controlUpdate={controlUpdate}
            />
          );
        } else if (layout.template.type === "ta" && layout.isShow) {
          return (
            <InputTextAreaControlComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              // key={layoutIdx}
              colIdx={layoutIdx}
              // onChangeEditForm={onChange}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              control={control}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
          );
          // }
        } else if (layout.template.type === "dd" && layout.isShow) {
          // incomeplete

          return (
            <SelectDropdownControlComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              control={control}
              name={`items[${nestIndex}].layout[${layoutIdx}]`}
              onControlChange={onControlChange}
              controlUpdate={controlUpdate}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
          );
        } else if (layout.template.type === "cb" && layout.isShow) {
          return (
            <MainCheckboxComponents
              {...{ canEditDoc, checkActionPage, buttonType }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              // key={layoutIdx}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              control={control}
              name={`items[${nestIndex}].layout[${layoutIdx}].data`}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
          );
        } else if (layout.template.type === "at" && layout.isShow) {
          return (
            <AttachmentControlComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              // key={layoutIdx}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              control={control}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
            />
            // <AttachmentComponent
            //   key={layout.id} // important to include key with field's id
            //   rowIdx={nestIndex}
            //   // key={layoutIdx}
            //   colIdx={layoutIdx}
            //   // onChangeEditForm={onChangeEditForm}
            //   template={layout.template}
            //   data={layout.data}
            //   colText={_colText}
            //   colAction={_colAction}
            //   name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
            //   control={control}

            //   // errorValid={error_corecontroll}
            //   // statusMemoDetail={props.statusMemoDetail}
            // />
          );
        } else if (layout.template.type === "t" && layout.isShow) {
          return (
            <InputControlComponent
              {...{ canEditDoc, checkActionPage, buttonType, onControlChange }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
            // <ShortTextComponent
            // controlRegister={register}
            // controlRef={controlRef}
            // key={layout.id} // important to include key with field's id
            // rowIdx={nestIndex}
            // // key={layoutIdx}
            // colIdx={layoutIdx}
            // // onChangeEditForm={onChangeEditForm}
            // template={layout.template}
            // data={layout.data}
            // colText={_colText}
            // colAction={_colAction}
            // name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
            // control={control}
            // // errorValid={error_corecontroll}
            // // statusMemoDetail={props.statusMemoDetail}
            // />
          );
        } else if (layout.template.type === "r" && layout.isShow) {
          return (
            <RadioControlComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              // key={layoutIdx}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              onControlChange={onControlChange}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
            />
          );
        } else if (layout.template.type === "tb" && layout.isShow) {
          return (
            <>
              <ComponentLabel
                colText={_colText}
                rowIdx={nestIndex}
                colIdx={layoutIdx}
                template={layout.template}
              />
              <div>
                <Controller
                  name={`items[${nestIndex}].layout[${layoutIdx}]`}
                  control={control}
                  defaultValue={layout.data.row}
                  rules={{
                    value: layout.data.row,
                    required:
                      buttonType !== "draft" && buttonType !== "cancel"
                        ? false
                        : true,
                    validate: (value: any) => {
                      try {
                        console.log("table=>value", value);

                        if (buttonType !== "draft" && buttonType !== "cancel") {
                          let pass: boolean = true;

                          let rows: any = value?.row || value?.data?.row;
                          layout.template.attribute.column.forEach(
                            (col: any, colIdx: number) => {
                              if (
                                col.control.template.attribute.require === "Y"
                              ) {
                                if (rows) {
                                  rows.forEach((row: any) => {
                                    if (
                                      !row[colIdx].value ||
                                      row[colIdx].value === "" ||
                                      row[colIdx].value === "--select--" ||
                                      row[colIdx].value ===
                                        "-- Please Select --"
                                    ) {
                                      pass = false;
                                    }
                                  });
                                } else {
                                  pass = false;
                                }
                              }
                            }
                          );
                          console.log("table=>pass", pass);

                          return pass;
                        } else {
                          return true;
                        }
                      } catch (error) {
                        console.log("table=>validate=>error", error);
                      }
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    formState: { errors, isSubmitted },
                  }) => {
                    const { column, newData } = formatColumn(
                      layout.template.attribute.column,
                      value.data
                    );
                    console.log("table=>", { newData, column, layout, value });

                    return (
                      <div className={`set-layout-required`}>
                        <TableComponent
                          {...{
                            canEditDoc,
                            checkActionPage,
                            buttonType,
                            tableOptions,
                            setTableOptions,
                          }}
                          onControlChange={onControlChange}
                          _columns={column}
                          _data={newData}
                          memoDetail={memoDetail}
                          onChange={onChange}
                          layout={layout}
                          isControlLoading={isControlLoading}
                          rowTemplate={nestIndex}
                          colTemplate={layoutIdx}
                          onSubmit={onSubmit}
                          isError={
                            isSubmitted &&
                            errors?.items &&
                            errors?.items[nestIndex] &&
                            errors?.items[nestIndex].layout[layoutIdx] &&
                            errors?.items[nestIndex].layout[layoutIdx]?.data
                              ?.type === "validate"
                          }
                          tableSummary={
                            tableSummaries?.find(
                              (e: any) =>
                                e.tableTemp.label === layout.template.label
                            )?.AllCol
                          }
                          updateTableSummaries={updateTableSummaries}
                        />
                        {isSubmitted &&
                          errors?.items &&
                          errors?.items[nestIndex] &&
                          errors?.items[nestIndex].layout[layoutIdx] &&
                          errors?.items[nestIndex].layout[layoutIdx]?.data
                            ?.type === "validate" && (
                            <small id="Name-help" className="p-error p-d-block">
                              {layout.template.label} is required.
                            </small>
                          )}
                      </div>
                    );
                  }}
                />
              </div>
            </>
          );
        } else if (layout.template.type === "d" && layout.isShow) {
          return (
            <DatePickerControlComponent
              {...{ canEditDoc, checkActionPage, buttonType }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
          );
        } else if (layout.template.type === "bt" && layout.isShow) {
          //incomplete

          return (
            <ButtonComponent
              {...{ canEditDoc, checkActionPage }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
              documentNo={documentNo}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
          );
        } else if (layout.template.type === "an" && layout.isShow) {
          //incomplete

          return (
            <InputControlComponent
              {...{ canEditDoc, checkActionPage, buttonType, onControlChange }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              control={control}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              // errorValid={error_corecontroll}
              // statusMemoDetail={props.statusMemoDetail}
            />
          );
        } else if (layout.template.type === "rvs" && layout.isShow) {
          // incomplete
          // setRvsPosition({ rowIdx: i, colIdx: idx });
          return (
            <InputControlComponent
              {...{ canEditDoc, checkActionPage, buttonType, onControlChange }}
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              // errorValid={error_corecontroll}
              colText={_colText}
              colAction={_colAction}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
            />
          );
        } else if (layout.template.type === "im" && layout.isShow) {
          return (
            <ImageComponent
              key={layout.id} // important to include key with field's id
              rowIdx={nestIndex}
              colIdx={layoutIdx}
              buttonType={buttonType}
              canEditDoc={canEditDoc}
              // onChangeEditForm={onChangeEditForm}
              template={layout.template}
              data={layout.data}
              colText={_colText}
              colAction={_colAction}
              name={`items[${nestIndex}].layout[${layoutIdx}].data.value`}
              control={control}
              // errorValid={error_corecontroll}
            />
          );
        } else if (
          layout.template.type === "em" ||
          Object.keys(layout.template).length === 0
        ) {
          console.log({ layout });

          return (
            <EmptyComponent
              key={layout.id} // important to include key with field's id
              colText={_colText}
              colAction={_colAction}
            />
          );
        }
      })}
    </>
  );
};

export default Controls;
