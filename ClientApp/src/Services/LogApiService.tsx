export const GetLogApi = async (dataJson: any) => {
  const respone = await fetch(
    "api/log/getlogtextfile",

    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        PostedDate: dataJson,
      }),
    }
  )
    .then((response) => response.json())

    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};
