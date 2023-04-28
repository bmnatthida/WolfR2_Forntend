export const GetAllTemplate = async () => {
  const respone = await fetch("api/TemplateList/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return respone;
};
export const GetTemplateFromDDL = async (dataJson: any) => {
  console.log("dataJson", dataJson);
  const respone = await fetch("api/TemplateList/GetTemplateFromDDL", {
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
export const GetTemplateTemplateListVersion = async (dataJson: any) => {
  console.log("dataJson", dataJson);
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetTemplateBindGroup", {
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
export const GetTemplateeBindFormNameDDL = async (dataJson: any) => {
  console.log("dataJson", dataJson);
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetTemplateBindFormNameDDL", {
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

export const GetTemplateTemplateList = async (dataJson: any) => {
  console.log("dataJson", dataJson);
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetTemplateListBindGroup", {
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
export const SearchTemplateListEditing = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  console.log("dataJson", dataJson);
  const respone = await fetch("api/TemplateList/SearchTemplateListEditing", {
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
export const GetTemplateListVersionHistory = async (dataJson: any) => {
  console.log("dataJson", dataJson);
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch(
    "api/TemplateList/GetTemplateListVersionHistory",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJson),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};
export const GetTemplateByDocTypeCode = async (dataJson: any) => {
  console.log("dataJson", dataJson);
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetTemplateByDocTypeCode", {
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
export const GetTemplateById = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetById", {
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

export const GetTemplate = async () => {
  const respone = await fetch("api/TemplateList/GetAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("table=>err", err);
    });
  return respone;
};

export const GetAllByCreateTemplate = async () => {
  const respone = await fetch("api/TemplateList/GetAllByCreateTemplate")
    .then((response) => response.json())
    .then((data) => {
      return data.filter((item: any) => {
        return item.IsActive === true;
      });
    })
    .catch((err) => {});
  return respone;
};

export const ReportTemplateList = async () => {
  const respone = await fetch("api/TemplateList/GetAllReportTemplateList")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  return respone;
};

export const GetTemplateByIdDto = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetTemplateByIdDto", {
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

export const GetTemplateControlById = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/GetTemplateControlById", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => {
      console.log("ddddddddddddddsadasdasdas", response);

      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    })
    .catch((err) => {});
  return respone;
};

export const AddTemplate = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/AddData", {
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
export const AddTemplateAndVersion = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/SaveTemplateAndVersion", {
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

export const DeleteTemplate = async (dataJson: any) => {
  const email = window.localStorage.getItem("email") || "";
  dataJson.UserPrincipalName = email;
  const respone = await fetch("api/TemplateList/DeleteTemplate", {
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

export const LoadLogic = async (template_id: any) => {
  const dataLogic = await fetch("api/TemplateList/TemplateByid/LoadLogic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ TemplateId: template_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Logic: ", data);

      return data;
    });
  return dataLogic;
};

export const ValidateRefTemplate = async (dataJson: any) => {
  const refValid = await fetch("api/TemplateList/ValidateRefTemplate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataJson),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Logic: ", data);

      return data;
    });
  return refValid;
};