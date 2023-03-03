import React from "react";

interface Props {
  leaveTypeTable: any;
}

export default function LeaveTypeComponents(props: Props) {
  return (
    <div style={{ display: "flex", padding: "17px 0px 30px 0px" }}>
      <table className="table-layout-create-control table-striped">
        <thead className="thead-light">
          <tr className="set-bg-color-table-create-control">
            <th style={{ width: "5%" }}>
              <p className="row headtext"></p>
              <p className="row subtext">#</p>
            </th>
            <th style={{ width: "50%" }}>
              <p className="row headtext">Leave Type</p>
              <p className="row subtext">ประเภทของการขอลา</p>
            </th>
            <th style={{ width: "15%" }}>
              <p className="row headtext">Package</p>
              <p className="row subtext">จำนวนวันลาตั้งต้น</p>
            </th>
            <th style={{ width: "15%" }}>
              <p className="row headtext">Used</p>
              <p className="row subtext">จำนวนวันลาที่ใช้ไป</p>
            </th>
            <th style={{ width: "15%" }}>
              <p className="row headtext">Balance</p>
              <p className="row subtext">จำนวนวันลาที่เหลืออยู่</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.leaveTypeTable?.map((_data: any, idx: any) => (
            <>
              <tr>
                <td>{idx + 1}</td>
                <td>{_data.Value2}</td>
                <td>{parseFloat(_data.Value3).toFixed(2)}</td>
                <td>{parseFloat(_data.Value4).toFixed(2)}</td>
                <td>{parseFloat(_data.Value5).toFixed(2)}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
