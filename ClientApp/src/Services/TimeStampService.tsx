import { ITimeStampRequest } from "../IRequestModel/ITimeStamp";

export const GetTimeStamp = async (dataJson: ITimeStampRequest) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TimeStamp/GetTimeStamp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return respone;
};

export const UploadTimeStamp = async (fileData: FormData) => {
  const respone = await fetch("api/TimeStamp/UploadTimeStamp", {
    method: "POST",
    body: fileData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return respone;
};

export const ExportTimeStamp = async (dataJson: ITimeStampRequest) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TimeStamp/ExportTimeStamp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  return respone;
};
