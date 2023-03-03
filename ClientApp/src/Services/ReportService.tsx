import moment from "moment";
import {
  GetDashboardKeyEndpoint,
  GetDashboardStatusCard,
} from "./ConfigurationService";

export const GetDashboardReportById = async () => {
  const configuration = await fetch("/api/Configuration/Dashboard/Endpoint")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      return data;
    })
    .catch((err) => {
      console.log(err);
      return;
    });

  const respone = await fetch("api/Report/GetReportById/1201")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  let data: any = [];
  var _endpoint = await GetDashboardEndpoint();

  for (let i = 0; i < respone.length; i++) {
    let row: any = {};

    for (let j = 0; j < configuration.length; j++) {
      for (const [key, value] of Object.entries(respone[i])) {
        const [keyConfig, typeConfig, formatConfig] =
          configuration[j]?.split("|");
        if (keyConfig === key) {
          if (typeConfig === "date") {
            row[_endpoint[j]] = moment(
              new Date(moment(respone[i][keyConfig]).format("yyyy/MM/DD"))
            ).format(formatConfig);
          } else {
            row[_endpoint[j]] = value;
          }
        }
      }
    }
    data.push(row);
  }
  console.log(data, "GetDashboardReportById");
  return data;
};
export const MapDataEndpoint = async (respone: any) => {
  const configuration = await fetch("/api/Configuration/Dashboard/Endpoint")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);

      return;
    });

  let data: any = [];
  var _endpoint = await GetDashboardEndpoint();
  for (let i = 0; i < respone?.length; i++) {
    let row: any = {};
    for (let j = 0; j < _endpoint.length; j++) {
      for (const [key, value] of Object.entries(respone[i])) {
        const [keyConfig, typeConfig, formatConfig] =
          configuration[j]?.split("||");
        if (keyConfig === key) {
          if (typeConfig === "date") {
            console.log(respone[i][keyConfig], "respone[i][keyConfig]");
            row[_endpoint[j]] = moment(
              new Date(moment(respone[i][keyConfig]).format("yyyy/MM/DD"))
            ).format(formatConfig);
          } else {
            row[_endpoint[j]] = value;
          }
        }
      }
    }
    data.push(row);
  }

  var _statusCard = await GetDashboardStatusCard();
  let _priorities = _statusCard.map((_data: any) => {
    const [keyConfig, typeConfig, displayConfig, priority] = _data.split("||");
    return {
      statusName: keyConfig,
      displayStatusName: displayConfig,
      priority: priority,
    };
  });
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    for (let j = 0; j < _priorities.length; j++) {
      const _priority = _priorities[j];
      if (element[_endpoint[2]] === _priority.statusName) {
        data[i]["priority"] = _priority.priority;
        data[i][_endpoint[2]] = _priority.displayStatusName;
      }
    }
  }

  return data;
};
export const MapGroupData = async (data: any, _name: any) => {
  var _endpoint = await GetDashboardKeyEndpoint();
  console.log(data, "data");
  console.log(_name, "_name");

  let result: any[] = data?.reduce(function (r: any, a: any) {
    r[a[_name.name]] = r[a[_name.name]] || [];
    r[a[_name.name]].push(a);
    return r;
  }, Object.create(null));
  let mapData: any[] = [];
  for (const [key, value] of Object.entries(result)) {
    mapData.push({
      headData: key,
      items: value.sort((a: any, b: any) => {
        return a.priority - b.priority;
      }),
    });
  }
  const sortDate = mapData.sort((a: any, b: any) => {
    const aa = moment(a.headData, "DD/MMMM/YYYY");
    const bb = moment(b.headData, "DD/MMMM/YYYY");
    return moment(aa).diff(bb);
  });
  return sortDate;
};

export const GetDashboardEndpoint = async () => {
  const configuration = await fetch("/api/Configuration/Dashboard/Endpoint")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  const card = configuration.map((_data: any) => {
    const [keyConfig, typeConfig] = _data.split("||");
    return keyConfig;
  });
  return card;
};

export const GetFilterHeaderDashboard = async () => {
  const configuration = await fetch("/api/Configuration/Dashboard/FilterHeader")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  let data: any = [];
  configuration.map((_data: any) => {
    const [keyConfig, typeConfig] = _data.split("||");
    data.push({
      name: keyConfig,
    });
    return data;
  });
  return data;
};
export const GetFilterSelectDashboard = async () => {
  const configuration = await fetch("/api/Configuration/Dashboard/FilterSelect")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  let data: any = [];
  configuration.map((_data: any) => {
    const [keyConfig, typeConfig] = _data.split("||");
    data.push({
      name: keyConfig,
    });
    return data;
  });
  return data;
};

export const GetReportById = async (reportId: number) => {
  const respone = await timeout(
    1800000,
    fetch("api/DynamicReport/GetReportDetailById", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ReportTemplateId: reportId,
        PageIndex: 0,
        PageSize: 10000,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {})
  );

  return respone;
};
export const ReportTemplateSelectByReportID = async (reportId: number) => {
  const respone = await fetch(
    "api/DynamicReport/ReportTemplateSelectByReportID",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReportTemplateId: reportId,
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

export const DeleteReport = async (reportId: number) => {
  const respone = await fetch("api/DynamicReport/DeleteReport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ReportTemplateId: reportId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});

  return respone;
};

export const ReportListTemplateSelect = async (dataJson: any) => {
  const respone = await fetch("api/DynamicReport/ReportListTemplateSelect", {
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
    .catch((err) => {});

  return respone;
};

export const AddReport = async (dataJson: any) => {
  // console.log("dataJson", dataJson);

  const respone = await fetch("api/DynamicReport/AddReport", {
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
    .catch((err) => {});

  return respone;
};
export const UpdateReport = async (dataJson: any) => {
  // console.log("dataJson", dataJson);

  const respone = await fetch("api/DynamicReport/UpdateData", {
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
    .catch((err) => {});

  return respone;
};

export const FilterAdvanceSearch = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Report/FilterAdvanceSearch", {
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
      return err;
    });
  console.log(respone, "dashboard");
  return respone;
};
