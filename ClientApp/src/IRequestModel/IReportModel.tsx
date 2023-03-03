export interface IReportModel {
  ReporttemplateID?: number;
  ReportName?: string;
  TemplateId?: string;
  Selectedfieldlist?: any[];
  ReportDescription?: string;
  IsPrivate: boolean;
  IsActive: boolean;
  CreatedBy?: string;
  CreatedByname?: string;
  CreatedDate?: string;
  ModifiedBy?: string;
  ModifiedByname?: string;
  ModifiedDate?: string;
  Selectedfieldlistfilter?: any[];
  Columns?: any[];
  Rows?: any[];
  TemplateNewVersion: boolean;
  PageIndex?: number;
  PageSize?: number;
  CanDelete?: boolean;
  RoleId?: string;
  RoleEmp?: string;
  Mode: boolean;
}
