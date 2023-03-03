export type IAutoNumberAttibute = {
  formats: IAutoNumberFormat[];
  digit: number;
  showSymbol: boolean;
  rowIndex: number;
  colIndex: number;
  fisrtPreix?: string;
};

export type IAutoNumberFormat = {
  condition: any;
  format: IFormat[];
};

export type IFormat = {
  type: string;
  label: string;
};
