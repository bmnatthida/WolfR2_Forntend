export type IRvsAttribute = {
  conditions: IRvsCondition[];
  digit: string;
  rowIndex: number;
  colIndex: number;
};

export type IRvsCondition = {
  boxid: string;
  controltype: string;
  label: string;
};
