import React, { useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./CheckboxComponent.css";
import { Controller } from "react-hook-form";
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
  errorValid: any;
  statusMemoDetail?: boolean;
  name: any;
  control: any;
}
export default function CheckboxComponent(props: Props) {
  const initialValues = {
    value: null,
    item: [],
  };

  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [dataRequest, setDataRequest] = useState<any>(
    props.data.item == undefined ? initialValues : props.data
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

  const onSelectedChange = (e: { value: any; checked: boolean }) => {
    let _selectedItems = [...selectedItems];

    if (e.checked) {
      _selectedItems.push(e.value);
    } else {
      for (let i = 0; i < _selectedItems.length; i++) {
        const selectedItem = _selectedItems[i];
        if (selectedItem.item === e.value.item) {
          _selectedItems.splice(i, 1);
          break;
        }
      }
    }

    let _request = dataRequest.item;
    _request.fill("N");
    for (let i = 0; i < _selectedItems.length; i++) {
      for (let j = 0; j < props.template.attribute.items.length; j++) {
        if (_selectedItems[i].item === props.template.attribute.items[j].item) {
          _request[j] = "Y";
        }
      }
    }
    setDataRequest((prevState: any) => ({
      ...prevState,
      item: [..._request],
    }));
    setSelectedItems(_selectedItems);
  };
  return (
    <Controller
      render={({
        field: { onChange, onBlur, value, name, ref },
        formState: { errors, isSubmitted },
      }) => {
        console.log({ ddddddddddasd: props.template });

        return (
          <>
            <ComponentLabel
              renderInTable={props.renderInTable}
              errors={errors}
              colText={props.colText}
              rowIdx={props.rowIdx}
              colIdx={props.rowIdx}
              template={props.template}
              isSubmitted={isSubmitted}
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
                className="set-layout"
                style={{
                  display: `${
                    props.template.attribute.multipleLine === "Y"
                      ? "flex"
                      : "initial"
                  }`,
                }}
              >
                {props.template.attribute.items.map(
                  (items: any, index: number) => {
                    return (
                      <div key={items.item} className="p-field-checkbox ">
                        <div className="row-gab">
                          <Checkbox
                            id={`${index}`}
                            className={`checkbox-gab ${
                              props.errorValid !== undefined &&
                              selectedItems.length == 0
                                ? "invalid-cb"
                                : ""
                            }`}
                            // style={{ borderColor: "rgb(40, 47, 106)" }}
                            // name="item"
                            value={items.item}
                            onChange={(e) => {
                              let _data = props.data.value.items;
                              console.log({ _data, e });
                              _data[Number(e.target.id)] = e.checked
                                ? "Y"
                                : "N";
                              onChange(_data);
                            }}
                            disabled={
                              props.template.attribute.readonly === "Y" ||
                              props.statusMemoDetail
                                ? true
                                : false
                            }
                            checked={props.data.value.items[index] === "Y"}
                          />
                          <label>{items.item}</label>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {isSubmitted &&
                errors?.items &&
                errors?.items[props.rowIdx] &&
                errors?.items[props.rowIdx].layout[props.colIdx] &&
                props.data.value.items.every(
                  (val: any) => val === "N" || !val
                ) && (
                  <small id="Name-help" className="p-error p-d-block">
                    {props.template.label} is required.
                  </small>
                )}
            </Col>
          </>
        );
      }}
      rules={{
        required: props.template.attribute.require === "Y" ? true : false,
      }}
      name={props.name}
      control={props.control}
      //   valueName={"value"}
    />

  );
}
