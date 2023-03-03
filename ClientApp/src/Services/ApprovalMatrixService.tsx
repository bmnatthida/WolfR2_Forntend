export const UpdateApprovalMatrix = async (formData: any, items: any) => {
  const data = {
    approvalMatrix: formData,
    approveMatrixItems: items.length > 0 ? items : null,
  };
  console.log("table=>UpdateApprovalMatrix", data);

  const email = window.localStorage.getItem("email") || "";
  items.UserPrincipalName = email;
  const respone = await fetch("api/ApprovalMatrix/updateApprovalMatrix", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return respone;
};

export const UpdateApprovalMatrixItems = async (items: any) => {
  const email = window.localStorage.getItem("email") || "";
  items.UserPrincipalName = email;
  const respone = await fetch(
    "api/ApprovalMatrix/updateApprovalMatrixItemsList",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};

export const GetAllApprovalMatrixItem = async () => {
  const respone = await fetch("api/ApprovalMatrix/GetAllApprovalMatrixItem")
    .then((response: any) => response.json())
    .then((data: any) => {
      return data;
    })
    .catch((ex: any) => {
      return false;
    });

  return respone;
};
