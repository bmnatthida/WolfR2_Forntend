export const GetAutoNumber = async (requestBody: any) => {
  const email = window.localStorage.getItem("email") || "";
  requestBody.UserPrincipalName = email;
  const respone = await fetch("api/RequestControl/GetAutoNumber", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const GetSaveRunningNumber = async (requestBody: any) => {
  const email = window.localStorage.getItem("email") || "";
  requestBody.UserPrincipalName = email;
  const respone = await fetch("api/RequestControl/SaveRunning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const GetRvsRunning = async (requestBody: any) => {
  const email = window.localStorage.getItem("email") || "";
  requestBody.UserPrincipalName = email;
  const respone = await fetch("api/RequestControl/GetRunning", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
