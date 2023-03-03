import { IApproval } from "../IRequestModel/IListApprovalDetailsModel";

export const GetApprovalByTemplate = async (dataJson: any) => {
  try {
    const email = window.localStorage.getItem("email") || "";
    dataJson.UserPrincipalName = email;
    const respone = await fetch("api/LineApprove/GetByTemplate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJson),
    })
      .then((response) => {
        response.json();
        console.log(response, "_responeListApproval");
      })
      .then((approvals) => {
        console.log(approvals, "_responeListApproval");
        return approvals;
      })
      .catch((err) => {});
    return respone;
  } catch (error) {
    console.log({ error });
  }
};
export const GetAllApprovals = async (dataJson: any): Promise<IApproval[]> => {
  const response = await fetch("api/Approvals/GetByMemoId", {
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
      console.log({ err });
    });
  return response;
};
