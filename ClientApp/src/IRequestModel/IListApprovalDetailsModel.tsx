import { IActorModelCamel } from "./IActorModel";
import { IApproverModel } from "./IApproverModel";

export interface IListApprovalDetailsModel {
  approver: IApproverModel;
  lineid: number;
  sequence: number;
  emp_id: number;
  signature_id: number;
  signature_th: string;
  signature_en: string;
}

export interface IApproval {
  approver: IActorModelCamel;
  memoid: number;
  lineid: number;
  sequence: number;
  emp_id: number;
  signature_id: number;
  signature_th: string;
  signature_en: string;
  UserPrincipalName?: string;
}
