export interface IListFormNameModel {
  TemplateId: number;
  TemplateName: string;
  DepartmentId: number;
  DocumentCode: string;
  isPublic: boolean;
  ReportLang: string;
  TemplateDetail: string;
  ToId: string;
  CcId: string;
  TemplateSubject: string;
  AutoApprove: boolean;
  TextForm: string;
  AdvanceForm: string;
  IsTextForm: boolean;
  AutoApproveWhen: string;
  ApproverCanEdit: boolean;
  CreatedDate: string;
  CreatedBy: string;
  ModifiedDate: string;
  ModifiedBy: string;
  IsActive: boolean;
  isRequesterEditApproval: boolean;
  RefDocColumn: string;
  GroupTemplateName: string;
}
