export interface ITemLineApproveList {
  TemLineId: number;
  TemplateId: number;
  Seq: number;
  MaxLevelId: number;
  ApprovalMatrixId: any;
  ApproveType: number;
  CompanyCode: any;
  Conditions: string;
  CreatedDate: string;
  CreatedBy: any;
  ModifiedDate: any;
  ModifiedBy: any;
  IsActive: boolean;
  lstCondition: LstConditionList[];
}

export interface LstConditionList {
  ColumnID: string;
  Column: string;
  Value: string;
  Seq: number;
  TemLineId: any;
  Temp_LineId: string;
}
