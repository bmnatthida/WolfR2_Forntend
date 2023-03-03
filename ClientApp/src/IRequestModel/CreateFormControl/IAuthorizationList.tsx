export interface IAuthorization_manage_companyList {
  CompanyId: string;

  Name: string;
}
export interface IAuthorization_manage_departmentList {
  depID: string;
  depname: string;
  depaction: string;
}
export interface IAuthorization_request_companyList {
  CompanyId: string;

  Name: string;
}
export interface IAuthorization_request_departmentList {
  depID: string;
  depname: string;
  depaction: string;
}

export interface IAuthorization_viewList_Permission {
  Download: string;
  Print: string;
  View: string;
}

export interface IAuthorization_viewList_ids {
  id: string;
  name: string;
  action: string;
}
export interface IAuthorization_viewList_company {
  id: string;
  name: string;
}
export interface IAuthorization_viewList_formcontrol {
  label?: string;
  labelInformition?: string;
  labelaction?: string;
  labelcolumnname?: string;
  labeltype?: string;
  labelvalue?: string;
  labelvaluetype?: string;
}
export interface IAuthorization_viewList {
  Permission?: IAuthorization_viewList_Permission;
  id?: string;
  permissiontype?: string;
  ids?: IAuthorization_viewList_ids[];
  company?: IAuthorization_viewList_company[];
  formcontrol?: IAuthorization_viewList_formcontrol[];
}
