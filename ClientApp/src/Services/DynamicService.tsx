export const GetAllDynamic = async (apiName: any, requestBody: any) => {
  try {
    if (!requestBody && window.localStorage.getItem("email")) {
      const email = window.localStorage.getItem("email") || "";
      requestBody = { UserPrincipal: email, ConnectionString: "" };
    }
    const respone = await fetch("/api/" + apiName, requestBody)
      .then((response: any) => response.json())
      .then((data: any) => {
        return data;
      })
      .catch((ex: any) => {
        return ex;
      });

    return respone;
  } catch (error) {
    console.log("service=>GetAllDynamic=>error", error);
  }
};

export const updateDynamic = async (apiName: any, formBody: any) => {
  if (apiName.endsWith("s")) {
    apiName = apiName.substring(0, apiName.length - 1);
  }

  const data = {
    name: apiName !== "MasterData" ? apiName.replace("Master", "") : apiName,
    model: JSON.stringify(formBody),
  };
  const respone = await fetch("/api/MasterData/UpdateData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return respone;
};
