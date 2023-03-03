import React from "react";

interface Props {}

export const ResultComponent = (props: Props) => {
  return (
    <>
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
                <th style={{ width: "22.5%" }}>
                  <p className="row headtext">Control Label</p>
                  <p className="row subtext">ชื่อ</p>
                </th>
                <th style={{ width: "22.5%" }}>
                  <p className="row headtext">Type</p>
                  <p className="row subtext">ชนิด</p>
                </th>
                <th style={{ width: "60%" }}>
                  <p className="row headtext">Value</p>
                  <p className="row subtext">ค่า</p>
                </th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </>
  );
};
