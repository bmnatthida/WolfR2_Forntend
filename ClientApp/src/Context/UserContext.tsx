import React from "react";
import { createContext, useContext, useState } from "react";
import { IUserModel } from "../IRequestModel/IUserModel";
const _userData = JSON.parse(
  localStorage.getItem("userData") ||
    '{"ID":0,"IsActive":false,"username":null,"password":null,"ContactCode":null,"IsVerify":false,"GuidVerify":null,"Remark":null,"SharepointSiteURL":null,"TinyURL":"techconsbiz.wolfapprove.com","employeeData":{"EmployeeId":123,"EmployeeCode":"T-0152","Username":"Supaporn.h","NameTh":"สุภาภรณ์เฮียงโฮม","NameEn":"SupapornHeanghom","Email":"Supaporn.h@techconsbiz.com","IsActive":true,"PositionId":13,"PositionNameTh":"Developer","PositionNameEn":"Developer","DepartmentId":3,"DepartmentNameTh":"Operation","DepartmentNameEn":"Operation","DivisionId":null,"DivisionNameTh":null,"DivisionNameEn":"-","ReportToEmpCode":"20","SignPicPath":"","Lang":"EN","AccountCode":"TCB","AccountName":"TechConsBiz","DefaultLang":"EN","CreatedDate":"","CreatedBy":null,"ModifiedDate":"21/06/202214:25:09","ModifiedBy":"123","ADTitle":""}}'
);
const employeeData = _userData.employeeData;
const initialSession: IUserModel = employeeData;

export const UserContext = createContext<
  [IUserModel, (session: IUserModel) => void]
>([initialSession, () => {}]);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider: React.FC = (props) => {
  const [userData, setUserData] = useState(initialSession);
  const defaultUserContext: [IUserModel, typeof setUserData] = [
    userData,
    setUserData,
  ];

  return (
    <UserContext.Provider value={defaultUserContext}>
      {props.children}
    </UserContext.Provider>
  );
};
