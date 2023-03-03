import moment from "moment";

export const GetDashboardEndpoint = async () => {
  const result = await fetch("/api/Configuration/Dashboard/Endpoint")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};
export const GetDashboardKeyEndpoint = async () => {
  const result = await fetch("/api/Configuration/Dashboard/Endpoint")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  const resultCard = result.map((_data: any) => {
    const [keyConfig] = _data.split("||");
    return keyConfig;
  });
  return resultCard;
};

export const GetDashboardFilterStatus = async () => {
  const result = await fetch("/api/Configuration/Dashboard/FilterStatus")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};
export const GetDashboardAdvancedFilter = async () => {
  const configuration = await fetch(
    "/api/Configuration/Dashboard/AdvancedFilter"
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  let data: any = [];
  configuration.map((_data: any) => {
    const [keyConfig, typeConfig, displayConfig] = _data.split("||");
    data.push({
      name: keyConfig,
      type: typeConfig,
      display: displayConfig,
    });
    return data;
  });
  return data;
};
export const GetDashboardFilterGroupBy = async () => {
  const configuration = await fetch(
    "/api/Configuration/Dashboard/FilterGroupBy"
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  let data: any = [];
  configuration.map((_data: any) => {
    const [keyConfig, typeConfig, displayConfig] = _data.split("||");
    data.push({
      name: keyConfig,
      type: typeConfig,
      display: displayConfig,
    });
    return data;
  });
  return data;
};

export const GetDashboardStatusCard = async () => {
  const result = await fetch("/api/Configuration/Dashboard/StatusCard")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};
export const LoginConfiguration = async () => {
  const result = await fetch("/api/Configuration/LoginConfiguration")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};
export const getAzureConfig = async () => {
  const result = await fetch("/api/Configuration/AzureConfig")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};
export const GetDashboardDefaultFilterConFig = async () => {
  const result = await fetch("/api/Configuration/Dashboard/DefaultFilter")
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    })
    .catch((err) => {});
  return result;
};

export const ADTitleConfiguration = async () => {
  const result = await fetch("/api/Configuration/ADTitle")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};

export const getDateDeployConfiguration = async () => {
  const result = await fetch("/api/Configuration/getDateDeploy")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};

export const getUploadFileSettingConfiguration = async () => {
  const result = await fetch("/api/Configuration/UploadFileSetting")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};

export const CannotDowLoadPDFDefaultConfiguration = async () => {
  const result = await fetch("/api/Configuration/CannotDowLoadPDFDefault")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return result;
};
