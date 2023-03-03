import { IActorModel } from "./IActorModel";
import { IUserModel } from "./IUserModel";

export interface IListHistoryDetailsModel {
  actor: IActorModel;

  action_id: number;
  memo_id: number;
  action: string;
  status: string;
  comment: string;
  action_date: string;
  signature_id: number;
  platform: string;
  IPAddress: string;
}

export type IWorklistHistory = {
  actor: IUserModel;
  action_id: number;
  memo_id: number;
  action: string;
  status: string;
  comment: string;
  action_date: string;
  signature_id: number;
  platform: string;
  ip_address: string;
  list_file_path: string | null;
  actor_id: number;
  actor_name_th: string;
  actor_name_en: string;
  actor_position_id: number;
  actor_position_name_th: string;
  actor_position_name_en: string;
  actor_department_id: number;
  actor_department_name_th: string;
  actor_department_name_en: string;
  UserPrincipalName: string;
  // delegate_actor_id: null;
  // delegate_actor_name_th: null;
  // delegate_actor_name_en: null;
  // delegate_actor_position_id: null;
  // delegate_actor_position_name_th: null;
  // delegate_actor_position_name_en: null;
  // delegate_actor_department_id: null;
  // delegate_actor_department_name_th: null;
  // delegate_actor_department_name_en: null;
  HAdvancveForm: string;
};
