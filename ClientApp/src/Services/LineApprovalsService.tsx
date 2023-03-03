export const GetApprovalsByMemoIDs = async (memoIds: number[]) => {
  const respone = await fetch("api/LineApprove/GetByMemoIds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memoIds: memoIds }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("service=>error", err);
    });
  return respone;
};
