export const UpdateRole = async (formData: any, items: any) => {
  const data = {
    role: formData,
    formRoleEmployee: items,
  };
  const respone = await fetch("api/Roles/UpdateRole", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};

export const GetRolePermission = async () => {
  const respone = await fetch("api/Roles/GetRolePermission")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};

export const GetPermissionByEmpId = async (data: any) => {
  const email = window.localStorage.getItem("email") || "";
  data.UserPrincipalName = email;
  const respone = await fetch("api/Roles/GetPermissionByEmpId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
