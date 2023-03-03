export const getAllEmailTemplate = async () => {
  const respone = await fetch("api/EmailTemplate/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const getEmailTemplateById = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/EmailTemplate/GetById", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
export const AddEmailTemplate = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/EmailTemplate/AddData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};
export const updateEmailTemplate = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/EmailTemplate/updateData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};
