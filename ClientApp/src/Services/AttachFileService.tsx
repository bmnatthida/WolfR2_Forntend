import axios from "axios";
import { IAttachFile } from "../IRequestModel/IAttachfile";

export const GetAllAttachFiles = async (
  dataJson: any
): Promise<IAttachFile[]> => {
  const respone = await fetch("api/AttachFiles/GetAll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });

      return data;
    });
  return respone;
};
export const UploadFileAttachFiles = async (dataJson: any) => {
  const respone = await axios({
    method: "post",
    url: "api/AttachFiles/AddFile",
    data: dataJson,
  })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      console.log({ errUploadAttach: err });
    });
  return respone;
};

export const UploadRequestAttachFiles = async (dataJson: any) => {
  const respone = await fetch("api/AttachFiles/AddRequestFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => {
      console.log({ errUpload: err });
    });
  return respone;
};
