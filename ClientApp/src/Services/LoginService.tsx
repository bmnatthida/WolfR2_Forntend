export const loginWolfAccount = async (method: any, data: any) => {
  const respone = await fetch("api/Login/WolfAccount", {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      TmpUrl: data.TmpUrl,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return respone;
};
export const loginWolfBD = async (method: any, data: any) => {
  const email = window.localStorage.getItem("email") || "";
  data.UserPrincipalName = email;
  const respone = await fetch("api/Login/LoginBD", {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      TmpUrl: data.TmpUrl,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return respone;
};
export const loginAD = async (method: any, data: any) => {
  const respone = await fetch("api/Login/ADAccount", {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return respone;
};
