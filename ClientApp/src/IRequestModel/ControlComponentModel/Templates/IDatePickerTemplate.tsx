export type IDateTemplate = {
  alter: string;
  attribute: IDateAttribute;
  label: string;
  type: string;
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
