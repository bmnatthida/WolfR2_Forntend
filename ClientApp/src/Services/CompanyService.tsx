export const dataCompany = async () => {
  const respone = await fetch("/api/MasterCompany/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone.filter((e: any) => e.IsActive === true);
};
export const AddCompany = async (dataJson: any) => {
  const respone = await fetch("api/MasterCompany/AddCompany", {
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
export const UpdateCompany = async (dataJson: any) => {
  const respone = await fetch("api/MasterCompany/UpdateCompany", {
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
