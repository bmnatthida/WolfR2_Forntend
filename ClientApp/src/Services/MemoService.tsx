export const GetButtonMemoByMemoId = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/GetButtonMemoByMemoId", {
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
export const ActionMemoPage = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/ActionMemoPage", {
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

  return respone;
};
export const GetMemoDetailById = async (dataJson: any) => {
  const respone = await fetch("api/Memo/GetMemoDetailById", {
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

export const GetMemoDetail = async (dataJson: any) => {
  const respone = await fetch("api/Memo/GetMemoDetail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("GetMemoDetail=>err", err);
    });
  return respone;
};
export const GetMemoById = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/GetMemoById", {
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

export const GetAttachmentFilesByMemoId = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/GetAttachmentFilesByMemoId", {
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

export const GetMemoDetailOnlyById = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/GetMemoDetailOnlyById", {
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

export const GetRefDocTemp = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/GetRefDocTemp", {
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

export const GetAllMemo = async (dataJson: any) => {
  const respone = await fetch("api/Memo/GetMemoById", {
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

export const GetRefDocFormTable = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/GetRefDocFormTable", {
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

export const GetMemoHistoryDetail = async (dataJson: any) => {
  const respone = await fetch("api/Memo/GetMemoHistoryDetail", {
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

export const SetCheckAcces = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/Memo/SetCheckAccess", {
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
      // window.location.href = "/UnAuthorize";
    });

  return respone;
};

// const formatDateTimeDataReQuest = (value: any) => {
//   if (value != "") {
//     let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
//     const NewDate = moment(someDateString).format("DD/MM/YYYY HH:mm:ss");
//     return NewDate;
//   } else {
//     const NewDate = "";
//     return NewDate;
//   }
// };

// function setdefaultMemoDetail(data: any) {
//   let _memo: IMemoDetailModel = data.requestDetails.memoDetail;
//   const _listFormName = data.requestDetails.listFormNames[0];
//   const newDate = new Date();
//   let _dataSetInformation: any = {
//     request_date: formatDateTimeDataReQuest(newDate),
//     created_date: formatDateTimeDataReQuest(newDate),
//     status:
//       location.pathname === "/PreviewTemplate"
//         ? _listFormName.status
//         : "New Request",
//     modified_date: formatDateTimeDataReQuest(newDate),
//     modified_by: window.localStorage.getItem("employeeId"),
//     created_by: window.localStorage.getItem("employeeId"),
//     report_lang: _listFormName.ReportLang,
//     auto_approve_when: _listFormName.AutoApproveWhen,
//     GroupTemplateName: _listFormName.GroupTemplateName,
//     template_id: _listFormName.TemplateId,
//     template_name: _listFormName.TemplateName,
//     template_code: _listFormName.DocumentCode,
//     document_no: "Auto Generate",
//     template_detail: uuidv4().replace(/-/g, ""),
//     waiting_for: window.localStorage.getItem("nameTh"),
//     waiting_for_id: window.localStorage.getItem("employeeId"),
//   };
// }
