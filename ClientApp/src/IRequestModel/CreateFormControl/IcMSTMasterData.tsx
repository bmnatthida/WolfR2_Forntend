export interface IcMSTMasterData {
  MasterId: any;
  MasterType: any;
  Value1: any;
  Value2: any;
  Value3: any;
  Value4: any;
  Value5: any;
  IsActive: any;
  CreatedDate: any;
  CreatedBy: any;
  ModifiedDate: any;
  ModifiedBy: any;
  Seq: any;
}
export interface IcMSTPositionLevelList {
  PositionLevelId: number;
  NameTh: string;
  NameEn: string;
  AccountId: number;
  PositionLevel: number;
  IsActive: boolean;
  CreatedDate: any;
  CreatedBy: any;
  ModifiedDate: string;
  ModifiedBy: string;
}
export interface IcMSTApprovalMatrixList {
  ApproveMatrixId: number;
  NameTh: string;
  NameEn: string;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
  IsActive: boolean;
}
export interface IcMSTTemplateLogicList {
  logicid: string;
  TemplateId: number;
  Seq: number;
  logictype: string;
  jsonvalue: string;
  lstCondition: any;
}
