import { IPaging } from "./IPaginationOptionModel";

export interface ITimeStampRespone {
  SearchDateTimeFrom?: string;
  SearchDateTimeTo?: string;
  Data: string;
  Paging: IPaging;
  UserPrincipalName?: string;
}

export interface ITimeStampRequest {
  SearchDateTimeFrom?: string;
  SearchDateTimeTo?: string;
  Paging: IPaging;
  UserPrincipalName?: string;
}
