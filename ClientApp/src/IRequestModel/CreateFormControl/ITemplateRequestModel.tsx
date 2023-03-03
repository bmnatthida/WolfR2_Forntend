import {
  IAuthorization_manage_companyList,
  IAuthorization_manage_departmentList,
  IAuthorization_request_companyList,
  IAuthorization_request_departmentList,
  IAuthorization_viewList,
} from "./IAuthorizationList";
import {
  IcMSTApprovalMatrixList,
  IcMSTMasterData,
  IcMSTPositionLevelList,
  IcMSTTemplateLogicList,
} from "./IcMSTMasterData";
import { IListRefTemplateList } from "./IListRefTemplateList";
import { ILstMasterDataList } from "./ILstMasterDataList";
import {
  ISpecificApproversList,
  ISpecificTempApproversList,
} from "./ISpecificList";
import { ITemLineApproveList } from "./ITemLineApproveList";
import { ITemplateForm } from "./ITemplateForm";

export interface ITemplateRequestModel {
  Amount: number;
  JsonCondition: any;
  listRefTemplate: IListRefTemplateList[];
  templateForm: ITemplateForm;
  specificApprovers: ISpecificApproversList[];
  specificTempApprovers: ISpecificTempApproversList[];
  TemLineApprove: ITemLineApproveList[];
  VEmployee: any;
  lstTRNLineApprove: any;
  cMSTApprovalMatrix: IcMSTApprovalMatrixList[];
  cMSTPositionLevel: IcMSTPositionLevelList[];
  cMSTCompany: any;
  lstMasterData: any;
  ComCode: number;
  cMSTTemplateLogic: IcMSTTemplateLogicList[];
  cMSTMasterData: IcMSTMasterData | null;
  Authorization_manage_company?: IAuthorization_manage_companyList[];
  Authorization_manage_department?: IAuthorization_manage_departmentList[];
  Authorization_request_company?: IAuthorization_request_companyList[];
  Authorization_request_department?: IAuthorization_request_departmentList[];
  Authorization_view?: IAuthorization_viewList[];
}
