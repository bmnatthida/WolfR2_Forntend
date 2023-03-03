export type ISelectDropdownTemplate = {
  alter: string;
  attribute: ISelectDropdownAttribute;
  label: string;
  type: string;
  readonly: string;
};
export type IDateTemplate = {
  alter: string;
  attribute: IDateAttribute;
  label: string;
  type: string;
};
export type ISelectDropdownAttribute = {
  items: { item: string }[];
  require: string;
};
export type IDateAttribute = {
  date: {
    fullYear: string;
    symbol: string;
    use: string;
    useDate: string;
  };
  description: string;
  readonly: string;
  require: string;
  time: {
    symbol: string;
    use: string;
    useSecond: string;
  };
};

export type ITableTemplate = {
  alter: string;
  attribute: ITableTemplateAttribute | any;
  label: string;
  type: string;
  readonly: string;
};
export type ITableTemplateAttribute = {
  autoRowNumber: string;
  conditionrefdoc: any[];
  enabledpopupdefdoc: any;
  mergecolumnrefdoc: any[];
  formula: string;
  label: string;
  type: string;
  column: ITableTemplateColumn[];
};
export type ITableTemplateColumn = {
  alter: string;
  control: any;
  label: string;
};
export const initialTableTemplate: ITableTemplate = {
  alter: "",
  attribute: null,
  label: "",
  readonly: "",
  type: "",
};
