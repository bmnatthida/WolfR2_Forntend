export const GetDepartment = async () => {
  const respone = await fetch("api/Department/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const UpdateDepartment = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const data = {
    name: "Department",
    model: JSON.stringify(dataJson),
  };
  const respone = await fetch("api/Department/AddDepartment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    });
  return respone;
};
