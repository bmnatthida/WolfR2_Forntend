import { IActorModel } from "./IActorModel";
import { IRequestorModel } from "./IRequestorModel";
import { IUserModel } from "./IUserModel";

export interface IMemoDetailModel {
  creator: IUserModel;
  requestor: IUserModel;
  actorCheckAccess?: IUserModel | null;
  TemplateApproveId?: string;
  actor: IUserModel;
  copyInformation: string;
  memoid?: number;
  current_approval_level: number;
  waiting_for: string;
  status: string;
  document_no: string;
  template_id: number;
  template_name: string;
  request_date: string;
  company_id: number;
  company_name: string;
  location: string;
  to: string;

  pass: string;
  subject: string;
  project_id: number;
  project: string;

  template_desc: string;

  costcenter: string;
  amount: string;
  comment: string;
  document_set: string;
  document_library: string;
  is_editable: boolean;
  department_id: number;
  is_public: boolean;
  report_lang: string;
  template_detail: string;
  auto_approve: boolean;
  auto_approve_when: string;
  approver_can_edit: boolean;
  status_id: number;
  created_date: string;
  created_by: string;
  modified_date: string;
  modified_by: string;
  last_action_by: string;
  last_status_id: number;
  last_status_name: string;
  waiting_for_id: number;
  is_text_form: boolean;
  template_code: string;
  GroupTemplateName: string;
}
