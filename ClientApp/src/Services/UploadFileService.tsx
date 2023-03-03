import axios from "axios";

export const UploadTinyMce = async (dataJson: any) => {
  const respone = await axios({
    method: "post",
    url: "api/UploadFile/AddTinyMce",
    data: dataJson,
  })
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      console.log("AddTinyMce", err);
    });
  return respone;
};

export const UploadRequestFiles = async (dataJson: any) => {
  const respone = await fetch("api/UploadFile/AddFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "data");
      return data;
    })
    .catch((err) => {});
  return respone;
};
export const UploadFileRenderControl = async (dataJson: any) => {
  const respone = await axios({
    method: "post",
    url: "api/UploadFile/UpLoadFileRenderControl",
    data: dataJson,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (response) {
      return response;
    });
  return respone;
};
