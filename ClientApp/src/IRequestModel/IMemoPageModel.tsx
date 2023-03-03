import { IListApprovalDetailsModel } from "./IListApprovalDetailsModel";
import { IListFileAttachDetailsModel } from "./IListFileAttachDetailsModel";
import { IListFormNameModel } from "./IListFormNameModel";
import { IListHistoryDetailsModel } from "./IListHistoryDetailsModel";
import { IListRefDocDetails } from "./IListRefDocsDetailModel";
import { IMemoDetailModel } from "./IMemoDetailModel";

export interface IMemoPageModel {
  memoDetail: IMemoDetailModel;
  listApprovalDetails: Array<IListApprovalDetailsModel>;
  listFileAttachDetails: Array<IListFileAttachDetailsModel>;
  listHistoryDetails: Array<IListHistoryDetailsModel>;
  listFormName: Array<IListFormNameModel>;
  listRefDocDetails: Array<IListRefDocDetails>;
  //   listActionButtonDetails: any[];
  //   listCompany: any[];
  //   listProject: any[];
  //   listSignatureWording: any;
  //   listLogic: any;
  //   listLogicloaddata: any;
  //   HistoryView: any;
  listControlRunning: any;
}
