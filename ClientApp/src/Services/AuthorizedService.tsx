import { GetAllDynamic } from "./DynamicService";
import { GetRolePermission } from "./RoleServices";

export const GetAllAuthorized = async () => {
  const respone = await fetch("api/Authorized/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
export const GetMemoAuthorized = async (request: any) => {
  console.log("request", request);

  const respone = await fetch("api/Memo/GetMemoPermission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};
export const GetMemoAuthorizedViewAndPrint = async (request: any) => {
  console.log("request", request);

  const respone = await fetch("api/Memo/GetMemoPermissionViewAndPrint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};
export const RegisterWolfAccount = async (request: any) => {
  console.log("request", request);

  const respone = await fetch("api/Authentication/RegisterWolfAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};

export const CheckRolePermission = async (EmployeeId: number) => {
  let isAdmin: boolean = false;
  let permissions: any[] = await GetRolePermission();
  let roles: any[] = await GetAllDynamic("Roles/GetAll", undefined);

  if (permissions) {
    let thispermiss = permissions.filter(
      (permiss: any) => permiss.EmployeeId === EmployeeId
    );

    roles?.forEach((role: any) => {
      thispermiss.forEach((permis: any) => {
        if (permis.IsDelete !== true) {
          if (permis.RoleId === role.RoleId) {
            if (role.RoleId === 1) {
              isAdmin = true;
            }
          }
        }
      });
    });
  }

  return isAdmin;
};
