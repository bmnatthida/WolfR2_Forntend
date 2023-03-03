export const GetAllPosition = async () => {
  const respone = await fetch("api/Position/AllPositionList")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return respone.filter((e: any) => e.IsActive === true);
};

export const AddPosition = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Position/AddData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    })
    .catch((err) => {});
  return respone;
};

export const UpdatePosition = async (dataJson: any) => {
  const respone = await fetch("api/Position/UpdatePosition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    });

  return respone;
};
