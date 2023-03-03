import { Moment } from "moment";
import { IAttachFile } from "./IAttachfile";
import { IApproval } from "./IListApprovalDetailsModel";
import { IWorklistHistory } from "./IListHistoryDetailsModel";
import { IUserModel } from "./IUserModel";
export type TodoType =
  | "todo"
  | "myrelate"
  | "inprocess"
  | "completed"
  | "cancelled"
  | "rejected";
export type WorklistHeaderType =
  | "To Do List"
  | "Related List"
  | "In Process"
  | "Completed"
  | "Cancelled"
  | "Rejected"
  | "All Task Group";
export type WorklistSerachType =
  | "company"
  | "date"
  | "department"
  | "form"
  | "keyword"
  | "status";
export type IGetWorklistRequest = {
  task: string;
  empId: string;
  iItemPerMore: number;
  CountMoreItem: number;
  FilterDateFrom: string;
  FilterDateTo: string;
  UserPrincipalName: string;
};
export type ITodo = {
  Requestor: IUserModel | null | any;
  MemoID: number;
  WaitingFor: IUserModel | null | any;
  Status: string;
  DocumentNo: string;
  TemplateName: string;
  RequestDate: string;
  CompanyName: string;
  DepartmentName: string;
  Subject: string;
  Amount: string;
  ModifiedDate: string;
  CountMoreItem: number;
  FilterText: string | null;
  FilterDateFrom: string | null;
  FilterDateTo: string | null;
  FilterAmountFrom: string | null;
  FilterAmountTo: string | null;
  IsReaded: boolean;
  iItemPerMore: number;
};
export type ISearchWorklist = {
  company: string[];
  date: [Moment?, Moment?];
  department: string[];
  form: string[];
  keyword: string;
  status: string[];
};

export type ITodoContent = {
  attachfiles: IAttachFile[];
};

export type IWorklistDetail = {
  attachfiles: IAttachFile[];
  approvals: IApproval[];
  requestor: IUserModel;
  MemoID: number;
  history: IWorklistHistory[];
};
