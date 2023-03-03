import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { render } from "react-dom";
import { Controller } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import { RiEditLine } from "react-icons/ri";
import AddConditionComponent from "./AddConditionComponent";
import AddPreFixComponent from "./AddPreFixComponent";
import "./AutoNumberComponent.css";
interface Props {
  control: any;
  errors: any;
  template: any;
  advanceForm: any;
  setAdvanceForm: any;
  attributeNumber: any;
  setAttributeNumber: any;
}

export default function AutoNumberComponent(props: Props) {
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    digit: parseInt(props.template?.digit) || 1,
    readonly: props.template.attribute?.readonly === "Y" || "" ? true : false,
  };

  const [viewModal, setViewModal] = useState<any>(false);
  const [conditionViewModal, setConditionViewModal] = useState<any>(false);
  const [attributeIdx, setAttributeIdx] = useState<any>();
  const [checkAction, setCheckAction] = useState<string>("");
  function deleteAutoNumber(idx: any) {
    let _attribute = props.attributeNumber.formats;

    _attribute.splice(idx, 1);
    props.setAttributeNumber((prevState: any) => ({
      ...prevState,
      formats: [..._attribute],
    }));
  }
  return (
    <>
      <div className="container">
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Label</p>
            <span style={{ color: "red" }}>*</span>
            <span className="headtext-form-requestor"> :</span>
          </div>
          <div className="col-md-10">
            <Controller
              name="label"
              control={props.control}
              defaultValue={dataRequest.label}
              rules={{ required: "label is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  autoFocus
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Alt Label: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="alter"
              control={props.control}
              defaultValue={dataRequest.alter}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Digit : </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="digit"
              control={props.control}
              defaultValue={dataRequest.digit}
              render={({ field, fieldState }) => (
                <InputNumber
                  inputId="digit"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  mode="decimal"
                  min={0}
                  max={100}
                  className={`set-input-component-css ${classNames({
                    "p-invalid": fieldState.invalid,
                  })}`}
                />
              )}
            />
          </div>
        </div>
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-12">
            <div className="set-margin-button-add-column">
              <button
                onClick={() => {
                  setViewModal(true);
                  setCheckAction("addFormat");
                }}
                type="button"
                className="set-color-css-button-add-column hover-color-css-282f6a"
              >
                <HiPlus /> Add PreFix
              </button>
            </div>
          </div>
        </div>
        <div>
          <table className="table-layout-create-control">
            <thead className="thead-light">
              <tr className="set-bg-color-table-create-control">
                <th style={{ width: "30%" }}>
                  <p className="row headtext">Sequence</p>
                  <p className="row subtext">ลำดับ</p>
                </th>
                <th style={{ width: "30%" }}>
                  <p className="row headtext">Condition</p>
                  <p className="row subtext">เงื่อนไข</p>
                </th>
                <th style={{ width: "30%" }}>
                  <p className="row headtext">Format</p>
                  <p className="row subtext">รูปแบบแสดงผล</p>
                </th>
                <th style={{ width: "10%" }}>
                  <p className="row headtext">Delete</p>
                  <p className="row subtext">ลบ</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.attributeNumber.formats.map((data: any, idx: any) => (
                <>
                  <tr>
                    <td>{idx + 1}</td>
                    <td>
                      {" "}
                      <span>
                        <RiEditLine
                          className="set-css-pointer-css-atn"
                          onClick={() => {
                            setAttributeIdx(idx);
                            setConditionViewModal(true);
                            setCheckAction("editCondition");
                          }}
                        />
                        {"  "}
                      </span>
                      <span>
                        {data.condition?.map((_data: any, idx2: any) => (
                          <>
                            {data.condition.length > 1
                              ? data.condition.slice(-1)[0] == _data
                                ? `${_data.label}`
                                : `${_data.label} - `
                              : _data.label}
                          </>
                        ))}
                      </span>
                    </td>
                    <td>
                      <span>
                        <RiEditLine
                          className="set-css-pointer-css-atn"
                          onClick={() => {
                            setAttributeIdx(idx);
                            setViewModal(true);
                            setCheckAction("editPrefix");
                          }}
                        />
                        {"  "}
                      </span>
                      <span>
                        {data.format.map((_data: any, idx2: any) => (
                          <>
                            {data.format.length > 1
                              ? data.format.slice(-1)[0] == _data
                                ? `${_data.label}`
                                : `${_data.label} - `
                              : _data.label}
                          </>
                        ))}
                      </span>
                    </td>
                    <td>
                      <BsTrash
                        className="set-css-pointer-css-atn"
                        onClick={() => {
                          deleteAutoNumber(idx);
                        }}
                      />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {viewModal && (
        <AddPreFixComponent
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
          viewModal={viewModal}
          setViewModal={setViewModal}
          setAttributeNumber={props.setAttributeNumber}
          attributeNumber={props.attributeNumber}
          checkAction={checkAction}
          setCheckAction={setCheckAction}
          attributeIdx={attributeIdx}
        />
      )}
      {conditionViewModal && (
        <AddConditionComponent
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
          setConditionViewModal={setConditionViewModal}
          conditionViewModal={conditionViewModal}
          setAttributeNumber={props.setAttributeNumber}
          attributeNumber={props.attributeNumber}
          attributeIdx={attributeIdx}
          checkAction={checkAction}
        />
      )}
    </>
  );
}
