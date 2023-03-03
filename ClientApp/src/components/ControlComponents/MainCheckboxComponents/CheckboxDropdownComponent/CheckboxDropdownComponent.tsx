import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Col, Row } from "react-bootstrap";
import "./CheckboxDropdownComponent.css";
import ComponentLabel from "../../ComponentLabel";
interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  renderInTable?: boolean;
  colText?: number;
  colAction?: number;
  errorValid?: any;
  statusMemoDetail?: boolean;
  name: any;
  control: any;
}
export default function CheckboxDropdownComponent(props: Props) {
  const initialValues = {
    value: "",
    item: [],
  };
  const [selectedItems, setSelectedItems] = useState<any>();
  const [dataRequest, setDataRequest] = useState<any>(
    props.data.item == undefined || null ? initialValues : props.data
  );
  useEffect(() => {
    defaultValue();
  }, []);

  useEffect(() => {
    defaultValue();
  }, [props.data]);

  useEffect(() => {
    // props.onChangeEditForm(dataRequest, props.rowIdx, props.colIdx);
  }, [dataRequest]);

  function setValueRequestSelected(e: any) {
    setSelectedItems(e.value);
    let _request = dataRequest.item;
    let _item: any = [];

    _request.fill("N");
    for (let i = 0; i < e.value.length; i++) {
      for (let j = 0; j < props.template.attribute.items.length; j++) {
        if (e.value[i].item === props.template.attribute.items[j].item) {
          _item.push(j);
          _request[j] = "Y";
        }
      }
    }

    setDataRequest((prevState: any) => ({
      ...prevState,
      value: _item.sort().toString(),
      item: [..._request],
    }));
  }

  function defaultValue() {
    var dataResponse = [];
    var defaultData: any = [];
    dataResponse = props.data.item;
    for (const index in dataResponse) {
      if (dataResponse[index] === "Y") {
        defaultData.push(props.template.attribute.items[index]);
      }
    }
    setSelectedItems(defaultData);
  }

  return (
    <>
      <ComponentLabel
        renderInTable={props.renderInTable}
        colText={props.colText}
        rowIdx={props.rowIdx}
        colIdx={props.rowIdx}
        template={props.template}
      />
      <Col
        sm={12}
        md={props.colAction}
        xs={12}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        <div
          style={{
            display: `${
              props.template.attribute.multipleLine === "Y" ? "flex" : "initial"
            }`,
          }}
          className={`${
            props.errorValid !== undefined && !dataRequest.value
              ? "set-layout-required"
              : ""
          }`}
        >
          <MultiSelect
            placeholder="--Please Select --"
            className={`set-width-input-cbdd setlayout-control-checkboxdropdown ${
              props.errorValid !== undefined && !dataRequest.value
                ? "invalid"
                : ""
            }`}
            display="chip"
            optionLabel="item"
            value={selectedItems}
            disabled={
              props.template.attribute.readonly === "Y" ||
              props.statusMemoDetail
                ? true
                : false
            }
            options={props.template.attribute.items}
            onChange={setValueRequestSelected}
          />
          {props.errorValid !== undefined && !dataRequest.value ? (
            <small id="Name-help" className="p-error p-d-block">
              {props.template.label} is required.
            </small>
          ) : (
            ""
          )}
        </div>
      </Col>
    </>
  );
}
