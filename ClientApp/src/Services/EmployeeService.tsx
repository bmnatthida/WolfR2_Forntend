export const GetAllEmployee = async () => {
  const respone = await fetch("api/Employee/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone.filter((e: any) => e.IsActive === true);
};

export const UpdateEmployee = async (dataJson: any) => {
  const respone = await fetch("api/Employee/UpdateData", {
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
    .catch((err) => {
      console.log("emp=>err", err);
      return err;
    });
  return respone;
};

export const UpdateSignature = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Employee/UpdateSignature", {
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
    .catch((err) => {
      console.log("emp=>err", err);
      return err;
    });
  return respone;
};

export const GetAllEmployeeByLanguage = async () => {
  const respone = await fetch("api/Employee/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone.filter((e: any) => e.IsActive === true);
};

export const GetUserData = async (empData: any) => {
  const email = window.localStorage.getItem("email") || "";
  empData.UserPrincipalName = email;
  const respone = await fetch("api/Employee/GetById", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empData),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });

  return respone;
};
