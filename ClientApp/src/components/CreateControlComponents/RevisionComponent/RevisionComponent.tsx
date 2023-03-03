import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { Controller } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import AddConditionModal from "./AddConditionModal";
import "./RevisionComponent.css";
interface Props {
  control: any;
  errors: any;
  template: any;
  advanceForm: any;
  setAdvanceForm: any;
  revisionConditions: any;
  setRevisionConditions: any;
}

export default function RevisionComponent(props: Props) {
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    digit: parseInt(props.template.attribute?.digit) || 0,
    readonly: props.template.attribute?.readonly === "Y" || "" ? true : false,
  };
  const [viewModal, setViewModal] = useState<any>(false);
  const [conditionsIdx, setConditionsIdx] = useState<any>();
  const [checkAction, setCheckAction] = useState<string>("");

  function deleteCondition(idx: number) {
    let _conditions = props.revisionConditions.conditions;
    _conditions.splice(idx, 1);
    props.setRevisionConditions((prevState: any) => ({
      ...prevState,
      conditions: [..._conditions],
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
                  inputId="minmax"
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
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Readonly: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="readonly"
              control={props.control}
              defaultValue={dataRequest.readonly}
              render={({ field, fieldState }) => (
                <div className={"set-layout-check-box-create-control"}>
                  <>
                    <Checkbox
                      className="set-css-checkbox-in-create-control"
                      inputId={field.name}
                      onChange={(e) => {
                        field.onChange(e.checked);
                      }}
                      checked={field.value}
                    />
                    <span className="set-text-check-box-create-control">
                      Yes
                    </span>
                  </>
                </div>
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
                  setCheckAction("add");
                }}
                type="button"
                className="set-color-css-button-add-column hover-color-css-282f6a"
              >
                <HiPlus /> Add Condition
              </button>
            </div>
          </div>
        </div>
        {props.revisionConditions.conditions.length >= 1 ? (
          <>
            <div className="row set-margin-in-row-add-control">
              <div className="col-md-12 row-gap-css-revision-css">
                {props.revisionConditions.conditions.map(
                  (_data: any, idx: number) => (
                    <div className="ss" key={idx}>
                      <div
                        className="set-css-card-revision-css hover-card-in-revision-css"
                        onClick={(e: any) => {
                          setConditionsIdx(idx);
                          setViewModal(true);
                          setCheckAction("edit");
                        }}
                      >
                        <span className="set-font-revision-css">{`[${
                          idx + 1
                        }]`}</span>
                        <span className="set-font-revision-css">
                          {_data.label}
                        </span>
                      </div>
                      <div className="ee">
                        <span className="set-lay-out-delete-revision-css">
                          <BsX
                            className="set-font-delete-revision-css set-point-css-revision hover-color-css-revision"
                            onClick={(e: any) => {
                              deleteCondition(idx);
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      {viewModal && (
        <AddConditionModal
          conditionsIdx={conditionsIdx}
          setAdvanceForm={props.setAdvanceForm}
          advanceForm={props.advanceForm}
          setRevisionConditions={props.setRevisionConditions}
          revisionConditions={props.revisionConditions}
          viewModal={viewModal}
          setViewModal={setViewModal}
          checkAction={checkAction}
        />
      )}
    </>
  );
}
