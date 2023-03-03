import { AutoComplete } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { BsTrash, BsX } from "react-icons/bs";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";

interface Props {
  control: any;
  errors: any;
  template: any;
  setItemsList: any;
  itemsList: any;
  fromRender?: string;
}

export default function ChoiceComponent(props: Props) {
  const dataRequest = {
    label: props.template.label || "",
    alter: props.template.alter || "",
    description: props.template.attribute?.description || "",
    item: props.template.attribute?.item || "",
    multipleLine: props.template.attribute?.multipleLine === "Y" ? true : false,
    require: props.template.attribute?.require === "Y" ? true : false,
    readonly: props.template.attribute?.readonly === "Y" ? true : false,
    widthInTable: parseInt(props.template.attribute?.widthInTable) || 0,
    hideInPdf: props.template.attribute?.hideInPdf === "Y" || "" ? true : false,
  };
  const [input, setInput] = useState<string>("");
  const [checkBoxRequire, setCheckBoxRequire] = useState<any>();
  useEffect(() => {
    if (props.template.attribute?.items !== undefined) {
      props.setItemsList((prevState: any) => ({
        ...prevState,
        items: [...props.template.attribute.items],
      }));
    }
  }, []);
  // useEffect(() => {
  //   if (checkBoxRequire === true) {
  //     let _components = props.itemsList.items;
  //     const requestData: any = {
  //       item: "--select--",
  //       checked: "N",
  //     };
  //     _components.splice(0, 0, requestData);
  //     props.setItemsList((prevState: any) => ({
  //       ...prevState,
  //       items: [..._components],
  //     }));
  //   } else if (
  //     checkBoxRequire == false &&
  //     props.itemsList.items[0]?.item == "--select--"
  //   ) {
  //     let _components = props.itemsList.items;
  //     _components.splice(0, 1);
  //     props.setItemsList((prevState: any) => ({
  //       ...prevState,
  //       items: [..._components],
  //     }));
  //   }
  // }, [checkBoxRequire]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && event.target.value !== "") {
      let _components = props.itemsList.items;
      let value = event.target.value;
      if (value.includes(",")) {
        var array = value.split(",");
        if (array[array.length - 1] === "") {
          array.pop();
        }
        for (let index = 0; index < array.length; index++) {
          const requestData: any = {
            item: array[index],
            checked: "N",
          };
          _components.splice(_components.length, 0, requestData);
        }
      } else {
        const requestData: any = {
          item: value,
          checked: "N",
        };
        _components.splice(_components.length, 0, requestData);
      }
      props.setItemsList((prevState: any) => ({
        ...prevState,
        items: [..._components],
      }));
      setInput("");
    }
  };
  function onRowReorder(e: any) {
    props.setItemsList((prevState: any) => ({
      ...prevState,
      items: e.value,
    }));
  }
  function cellEditor(options: any) {
    return textEditor(options);
  }
  function textEditor(options: any) {
    return (
      <InputText
        style={{ width: "100%" }}
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  }
  const onCellEditComplete = (e: any) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    if (newValue.trim().length > 0) rowData[field] = newValue;
    else event.preventDefault();
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <BsTrash
          className="set-cursor-pointer hover-color-css-red-3"
          onClick={() => {
            console.log(rowData, "rowData");
            let _components = props.itemsList.items.filter(
              (data: any) => data.item !== rowData.item
            );
            props.setItemsList((prevState: any) => ({
              ...prevState,
              items: _components,
            }));
          }}
        />
      </>
    );
  };
  return (
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
          <p className="headtext-form-requestor">Description: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="description"
            control={props.control}
            defaultValue={dataRequest.description}
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
      {props.fromRender === "table" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">Width: </p>
          </div>
          <div className="col-md-10">
            <div className="p-inputgroup set-height-input">
              <Controller
                name="widthInTable"
                control={props.control}
                defaultValue={dataRequest.widthInTable}
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
              <span className="p-inputgroup-addon set-font-pixel">%</span>
            </div>
          </div>
        </div>
      )}
      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Inline: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="multipleLine"
            control={props.control}
            defaultValue={dataRequest.multipleLine}
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
                  <span className="set-text-check-box-create-control">Yes</span>
                </>
              </div>
            )}
          />
        </div>
      </div>

      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input">
          <p className="headtext-form-requestor">Required: </p>
        </div>
        <div className="col-md-10">
          <Controller
            name="require"
            control={props.control}
            defaultValue={dataRequest.require}
            render={({ field, fieldState }) => (
              <div className={"set-layout-check-box-create-control"}>
                <>
                  <Checkbox
                    className="set-css-checkbox-in-create-control"
                    inputId={field.name}
                    onChange={(e) => {
                      field.onChange(e.checked);
                      setCheckBoxRequire(e.checked);
                    }}
                    checked={field.value}
                  />
                  <span className="set-text-check-box-create-control">Yes</span>
                </>
              </div>
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
                  <span className="set-text-check-box-create-control">Yes</span>
                </>
              </div>
            )}
          />
        </div>
      </div>
      {props.fromRender === "table" && (
        <div className="row set-margin-in-row-add-control">
          <div className="col-md-2 set-layout-text-input">
            <p className="headtext-form-requestor">HideInPdf: </p>
          </div>
          <div className="col-md-10">
            <Controller
              name="hideInPdf"
              control={props.control}
              defaultValue={dataRequest.hideInPdf}
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
      )}
      <div className="row set-margin-in-row-add-control">
        <div className="col-md-2 set-layout-text-input-2-input">
          <p className="headtext-form-requestor">Items :</p>
          <p className="headtext-form-requestor set-color-red">*</p>
        </div>
        <div className="col-md-10">
          <Controller
            name="item"
            defaultValue={input}
            control={props.control}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
                {...field}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                value={input}
                onKeyDown={handleKeyDown}
                className={`set-input-component-css ${classNames({
                  "p-invalid": fieldState.invalid,
                })}`}
              />
            )}
          />
          <p className="set-font-size">
            put 1 word (Enter) or multi word put (,) (Enter)
          </p>
        </div>
      </div>
      {props.itemsList.items.length !== 0 && (
        <div className="row set-margin-in-row-add-control set-padding-db">
          <DataTable
            value={props.itemsList.items}
            onRowReorder={onRowReorder}
            scrollable
            className="set-css-tss"
            scrollHeight="15.75rem"
          >
            <Column rowReorder style={{ maxWidth: "3em" }} />
            <Column
              field="item"
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              rowEditor
              header={"Items"}
            />
            <Column style={{ maxWidth: "6em" }} body={actionBodyTemplate} />
          </DataTable>
        </div>
      )}
    </div>
  );
}
