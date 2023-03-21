declare const LogicType: [
  "datasourcerelated",
  "reference",
  "datasourceload",
  "datalineapprove",
  "datareladtoloaddata",
  "dataajaxloadtable",
  "Permission",
  "role"
];
declare const permissionType: ["Role", "Public", "Department", "FormControl"];
declare const ShowHideActionType: ["show", "hide"];
export type ILogic = {
  Seq: number;
  TemplateId: number;
  jsonvalue: string;
  logicid: string;
  logictype: typeof LogicType[number];
};
export type ILogicTypeShowHide = {
  action: typeof ShowHideActionType[number];
  fieldaction?: { lable: string }[];
  lineapproveids?: string;
  approvetypeids?: string;
  roleids?: { id: number }[];
  positionids?: { id: number }[];
};
export type ILogicTypeSourceLoad = {
  conditions: {
    action: string;
    condition: string;
    field: string;
    value: string;
    Objectkey?: string;
  }[];
  fields: { field: string };
  label: string;
  labelactionfield: string;
  table: string;
};
export type ILogicTypePermission = {
  Permission: ILogicPermission | null | undefined;
  id: string;
  permissiontype: typeof permissionType[number];
  ids:
    | {
        id: string;
        name: string;
        action: string | null;
      }[]
    | null
    | undefined;
  company:
    | {
        id: string;
        name: string;
      }
    | null
    | undefined;
  formcontrol:
    | {
        label: string;
        labelInformition: string;
        labelaction: string;
        labelcolumnname: string;
        labeltype: string;
        labelvalue: string;
        labelvaluetype: string;
      }
    | null
    | undefined;
};
export type ILogicTypeReladToLoadData = {
  conditions: {
    action: string;
    condition: string;
    field: string;
    label: string;
  }[];
  autoloadvaluelabel: {
    label: string;
    value: string;
  };
  fields: { field: string };
  labelactions: {
    label: string;
    labelintablestatus: string;
  }[];
  table: string;
};
export type ILogicTypeDataLineApprove = {
  Conditions: {
    field: string;
    label: string;
    action?: string;
  }[];
  InsertType: string;
  label: string;
  amountstatus: string;
  methodtype: string;
};
export type ILogicTypeSourceRelated = {
  conditions: {
    action: string;
    condition: string;
    field: string;
    label: string;
  }[];
  fields: { field: string }[];
  table: string;
  autoloadvaluelabel: { label: string; value: string };
  relatedvalue: { label: string; value: string }[];
  tablestatus: boolean;
  label: string;
  labelactions: labelAction[];
};
export type labelAction = {
  label: string;
  labelintablestatus: string;
};
export type ILogicTypeReference = {
  label: string;
  ColumnAll: string;
  Type: string;
  Mastertable: string;
  Filter: ILogicReferenceField[];
  Column: ILogicReferenceField[];
};
export type ILogicPermission = {
  Download: string;
  Print: string;
  View: string;
};
export type ILogicReferenceField = {
  TBColumn: string;
  MSTColumn: string;
};
