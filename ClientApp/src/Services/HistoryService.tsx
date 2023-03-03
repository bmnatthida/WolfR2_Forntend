import { IWorklistHistory } from "../IRequestModel/IListHistoryDetailsModel";

export const GetAllHistory = async (
  dataJson: any
): Promise<IWorklistHistory[]> => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/History/GetByMemoId", {
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
