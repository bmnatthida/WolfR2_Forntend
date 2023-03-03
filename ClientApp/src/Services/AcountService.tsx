export const UpdateWOLFAccount = async (data: any) => {
  const email = window.localStorage.getItem("email") || "";
  data.UserPrincipalName = email;
  const respone = await fetch("/api/Account/UpdateWOLFAccount", {
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

export const CreateWOLFAccount = async (data: any) => {
  const email = window.localStorage.getItem("email") || "";
  data.UserPrincipalName = email;
  const respone = await fetch("/api/Account/CreateWOLFAccount", {
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
