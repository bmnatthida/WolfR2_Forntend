export const GetSignature = async () => {
  const respone = await fetch("/api/MasterData/GetSignature")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone.filter((e: any) => e.isActive === true);
};
export const GetReportSetting = async () => {
  const respone = await fetch("/api/MasterData/GetReportSetting")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone.filter((e: any) => e.isActive === true);
};
export const GetIsDocControl = async () => {
  const respone = await fetch("/api/MasterData/GetIsDocControl")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return respone;
};
export const getAuthorization = async () => {
  const respone = await fetch("/api/MasterData/getAuthorization")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
export const getVersion = async () => {
  const respone = await fetch("/api/MasterData/getVersion")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
export const getVersionTempVC = async () => {
  const respone = await fetch("/api/MasterData/getVersionTempVC")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const GetLeaveTemplate = async () => {
  const respone = await fetch("api/MasterData/GetLeaveTemplate")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  return respone;
};

export const GetLeaveTemplateByEmpId = async (empId: number) => {
  const respone = await fetch(`api/MasterData/GetLeaveTemplate/${empId}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  return respone;
};

export const GetMasterDataFieldInfo = async () => {
  const respone = await fetch("api/MasterData/FieldInfo")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  return respone;
};
