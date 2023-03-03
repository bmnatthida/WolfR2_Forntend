export const GetAllProject = async () => {
  const respone = await fetch("api/Project/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
