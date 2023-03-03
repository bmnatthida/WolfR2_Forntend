export const CheckAppSetting = async () => {
  const respone = await fetch("api/AppSetting/CheckAppSetting")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const CheckCanEditProfile = async () => {
  const respone = await fetch("api/AppSetting/CheckCanEditProfile")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const CheckCanAdminEditCompletedMemo = async () => {
  const respone = await fetch("api/AppSetting/CheckCanAdminEditCompletedMemo")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("app=>CheckCanAdminEditCompletedMemo", err);
    });
  return respone;
};

export const CheckAutoReport = async () => {
  const respone = await fetch("api/AppSetting/CheckAutoReport")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const CheckCanDownloadPdf = async () => {
  const respone = await fetch("api/AppSetting/CheckCanDownloadPdf")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
