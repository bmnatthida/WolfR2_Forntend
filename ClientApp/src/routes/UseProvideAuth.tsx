import React, { useState } from "react";
import Cookies from "universal-cookie";
import { useHistory, useLocation } from "react-router-dom";
import { loginWolfAccount } from "../Services/LoginService";
export default function UseProvideAuth() {
  const [user, setUser] = useState<string>("");
  const [remarkValid, setRemarkValid] = useState<string>("");
  const cookies = new Cookies();
  let history = useHistory();

  const onSubmit = (data: any) => {
    let _loginWolfAccount = loginWolfAccount("POST", data);

    // if (_loginWolfAccount.Remark === null) {
    //   localStorage.clear();
    //   cookies.remove("favorite");
    //   cookies.remove("GuidVerify");
    //   cookies.set("GuidVerify", data.GuidVerify, {
    //     path: "/",
    //     expires: new Date(Date.now() + 86400000),
    //   });
    //   window.localStorage.setItem("favorite", JSON.stringify([]));

    //   window.localStorage.setItem("userData", JSON.stringify(data));
    //   window.localStorage.setItem(
    //     "employeeId",
    //     data.employeeData.EmployeeId
    //   );
    //   window.localStorage.setItem(
    //     "employeeCode",
    //     data.employeeData.EmployeeCode
    //   );
    //   window.localStorage.setItem("nameEn", data.employeeData.NameEn);
    //   window.localStorage.setItem("nameTh", data.employeeData.NameTh);
    //   window.localStorage.setItem("email", data.employeeData.Email);
    //   window.localStorage.setItem(
    //     "positionNameTh",
    //     data.employeeData.PositionNameTh
    //   );
    //   window.localStorage.setItem(
    //     "positionNameEn",
    //     data.employeeData.PositionNameEn
    //   );
    //   window.localStorage.setItem(
    //     "departmentId",
    //     data.employeeData.DepartmentId
    //   );
    //   window.localStorage.setItem("tinyUrl", data.TinyURL);
    //   window.localStorage.setItem(
    //     "departmentNameTh",
    //     data.employeeData.DepartmentNameEn
    //   );
    //   history.push("/Default");
    // }
    // if (data.Remark !== null) {
    //   setRemarkValid(data.Remark);
    // }
  };

  return {
    user,
    onSubmit,
    remarkValid,
  };
}
