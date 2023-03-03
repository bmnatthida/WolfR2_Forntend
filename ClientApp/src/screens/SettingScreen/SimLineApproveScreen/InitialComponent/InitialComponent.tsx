import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React from "react";
import "../SimLineApproveScreen.css";
interface Props {}

export const InitialComponent = (props: Props) => {
  const dataAutoApprove = [
    { nameEn: "First Step Approve", nameTh: "อนุมัติเฉพาะขั้นแรก" },
    { nameEn: "Last Step Approve", nameTh: "อนุมัติเฉพาะขั้นสุดท้าย" },
  ];
  return (
    <>
      <div className="set-row-gap-css-sim-line">
        <div className="row">
          <div className="col-md-3">
            <div className="text-header">Requester (Username)</div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-header">Email (Ex. @xxx.com)</div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-header">Name</div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-header">Position Th</div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
        </div>
        <div className="row text-header-css-sim-line">Report To</div>
        <div className="row">
          <div className="col-md-12">
            <table className="table-layout-create-control">
              <thead className="thead-light">
                <tr className="set-bg-color-table-create-control">
                  <th style={{ width: "30%" }}>
                    <p className="row headtext">Control Label</p>
                    <p className="row subtext">ชื่อ</p>
                  </th>
                  <th style={{ width: "30%" }}>
                    <p className="row headtext">Type</p>
                    <p className="row subtext">ชนิด</p>
                  </th>
                  <th style={{ width: "30%" }}>
                    <p className="row headtext">Value</p>
                    <p className="row subtext">ค่า</p>
                  </th>
                  <th style={{ width: "10%" }}>
                    <p className="row headtext">Delete</p>
                    <p className="row subtext">ลบ</p>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="text-header-css-sim-line-component ">
              Template Name
            </div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-header-css-sim-line-component ">
              Template ID
            </div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-header-css-sim-line-component ">
              Total Amount
            </div>
            <div>
              <InputText className="set-input-component-css" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="text-header-css-sim-line-component ">
              Redundant Approver
            </div>
            <div>
              <Checkbox value="New York"></Checkbox>
              <label className="p-checkbox-label set-padding-css-left-sim-line">
                Auto Approve By System
              </label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-header-css-sim-line-component ">
              Auto Approve
            </div>
            <div className="set-css-head-auto-approve">
              {dataAutoApprove.map((_data, i) => {
                return (
                  <div
                    key={i}
                    className="field-radiobutton display-flex-sim-line "
                  >
                    <RadioButton name="category" value={_data} />
                    <label className="">
                      {_data.nameEn}
                      <br />
                      {_data.nameTh}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-6"></div>
        </div>
        <div className="row text-header-css-sim-line">Approval Matrix</div>
        <div className="row">
          <div className="col-md-12">
            <table className="table-layout-create-control">
              <thead className="thead-light">
                <tr className="set-bg-color-table-create-control">
                  <th style={{ width: "5%" }}>
                    <p className="row headtext">Seq</p>
                    <p className="row subtext">ลำดับ</p>
                  </th>
                  <th style={{ width: "30%" }}>
                    <p className="row headtext">Control Label</p>
                    <p className="row subtext">ชื่อ</p>
                  </th>
                  <th style={{ width: "27.5%" }}>
                    <p className="row headtext">Type</p>
                    <p className="row subtext">ชนิด</p>
                  </th>
                  <th style={{ width: "27.5%" }}>
                    <p className="row headtext">Value</p>
                    <p className="row subtext">ค่า</p>
                  </th>
                  <th style={{ width: "10%" }}>
                    <p className="row headtext">Delete</p>
                    <p className="row subtext">ลบ</p>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div className="row text-header-css-sim-line">
          Approval Matrix Detail
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table-layout-create-control">
              <thead className="thead-light">
                <tr className="set-bg-color-table-create-control">
                  <th style={{ width: "5%" }}>
                    <p className="row headtext">Seq</p>
                    <p className="row subtext">ลำดับ</p>
                  </th>
                  <th style={{ width: "21.25%" }}>
                    <p className="row headtext">Control Label</p>
                    <p className="row subtext">ชื่อ</p>
                  </th>
                  <th style={{ width: "21.25%" }}>
                    <p className="row headtext">Type</p>
                    <p className="row subtext">ชนิด</p>
                  </th>
                  <th style={{ width: "21.25%" }}>
                    <p className="row headtext">Value</p>
                    <p className="row subtext">ค่า</p>
                  </th>
                  <th style={{ width: "21.25%" }}>
                    <p className="row headtext">Value</p>
                    <p className="row subtext">ค่า</p>
                  </th>
                  <th style={{ width: "10%" }}>
                    <p className="row headtext">Delete</p>
                    <p className="row subtext">ลบ</p>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div className="row text-header-css-sim-line">Specific Approvals</div>
        <div className="row">
          <div className="col-md-12">
            <table className="table-layout-create-control">
              <thead className="thead-light">
                <tr className="set-bg-color-table-create-control">
                  <th style={{ width: "5%" }}>
                    <p className="row headtext">Seq</p>
                    <p className="row subtext">ลำดับ</p>
                  </th>
                  <th style={{ width: "30%" }}>
                    <p className="row headtext">Control Label</p>
                    <p className="row subtext">ชื่อ</p>
                  </th>
                  <th style={{ width: "27.5%" }}>
                    <p className="row headtext">Type</p>
                    <p className="row subtext">ชนิด</p>
                  </th>
                  <th style={{ width: "27.5%" }}>
                    <p className="row headtext">Value</p>
                    <p className="row subtext">ค่า</p>
                  </th>
                  <th style={{ width: "10%" }}>
                    <p className="row headtext">Delete</p>
                    <p className="row subtext">ลบ</p>
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
