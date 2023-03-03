import { InputText } from "primereact/inputtext";
import React from "react";
import { BsTrash } from "react-icons/bs";
import { HiPlus } from "react-icons/hi";
import "./TableCreateComponents.css";
interface Props {
  advanceForm: any;
  setFooterTable: any;
  footerTable: any;
}

export default function FooterTableComponents(props: Props) {
  const footerData: any = {
    label: "",
    formula: "",
    symbol: "",
    value: "",
  };

  function deleteFooterTable(idx: any) {
    let _footerTable = props.footerTable?.rows;
    _footerTable.splice(idx, 1);
    props.setFooterTable((prevState: any) => ({
      ...prevState,
      rows: [..._footerTable],
    }));
  }

  return (
    <div>
      <div className="row set-margin-in-row-add-control">
        <div className="col-lg-2">
          <tr>
            <th>
              <div className="label-text-container">
                <span className="headtext-form">Conditions</span>
              </div>
              <p className="subtext-form">เงื่อนไข</p>
            </th>
          </tr>
        </div>
        <div className="col-lg-10">
          <div>
            <button
              onClick={() => {
                let rows = props.footerTable.rows;
                rows.push(footerData);
                props.setFooterTable((prevState: any) => ({
                  ...prevState,
                  rows: [...rows],
                }));
              }}
              type="button"
              className="set-color-css-button-add-column hover-color-css-282f6a set-margin-0-css"
            >
              <HiPlus /> Add Condition
            </button>
          </div>
        </div>
      </div>
      {props.footerTable.rows.length !== 0 && (
        <table className="table-layout-create-control">
          <thead className="thead-light">
            <tr className="set-bg-color-table-create-control">
              <th style={{ width: "30%" }}>
                <p className="row headtext">Label</p>
                <p className="row subtext">ชื่อ</p>
              </th>
              <th style={{ width: "30%" }}>
                <p className="row headtext">Formula</p>
                <p className="row subtext">สูตร</p>
              </th>
              <th style={{ width: "30%" }}>
                <p className="row headtext">Symbol</p>
                <p className="row subtext">สัญลักษณ์</p>
              </th>
              <th style={{ width: "10%" }}>
                <p className="row headtext">Delete</p>
                <p className="row subtext">ลบ</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.footerTable?.rows?.map((_data: any, idx: any) => (
              <>
                <tr key={idx}>
                  <td>
                    <InputText
                      style={{ width: "100%", maxHeight: "38.42px" }}
                      value={props.footerTable?.rows[idx]?.label}
                      onChange={(e: any) => {
                        props.setFooterTable((prevState: any) => ({
                          ...prevState,
                          rows: props.footerTable?.rows.map(
                            (_val: any, _idx: any) => {
                              return _idx === idx
                                ? {
                                    label: e.target.value,
                                    formula: _val.formula,
                                    symbol: _val.symbol,
                                    value: _val.value,
                                  }
                                : _val;
                            }
                          ),
                        }));
                      }}
                    />
                  </td>
                  <td>
                    <InputText
                      tooltip="Operators for use : Addition (+), Subtraction (-), Multiplication (*), Division (/) Ex. : total * 0.07"
                      tooltipOptions={{
                        position: "top",
                        className: "set-font-text-tooltip-css",
                        event: "focus",
                      }}
                      style={{ width: "100%", maxHeight: "38.42px" }}
                      value={props.footerTable?.rows[idx]?.formula}
                      onChange={(e: any) => {
                        props.setFooterTable((prevState: any) => ({
                          ...prevState,
                          rows: props.footerTable?.rows.map(
                            (_val: any, _idx: any) => {
                              return _idx === idx
                                ? {
                                    label: _val.label,
                                    formula: e.target.value,
                                    symbol: _val.symbol,
                                    value: _val.value,
                                  }
                                : _val;
                            }
                          ),
                        }));
                      }}
                    />
                  </td>
                  <td>
                    <InputText
                      style={{ width: "100%", maxHeight: "38.42px" }}
                      value={props.footerTable?.rows[idx]?.symbol}
                      onChange={(e: any) => {
                        props.setFooterTable((prevState: any) => ({
                          ...prevState,
                          rows: props.footerTable?.rows.map(
                            (_val: any, _idx: any) => {
                              return _idx === idx
                                ? {
                                    label: _val.label,
                                    formula: _val.formula,
                                    symbol: e.target.value,
                                    value: _val.value,
                                  }
                                : _val;
                            }
                          ),
                        }));
                      }}
                    />
                  </td>
                  <td>
                    <BsTrash
                      className="set-css-pointer-css-atn"
                      onClick={() => {
                        deleteFooterTable(idx);
                      }}
                    />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
