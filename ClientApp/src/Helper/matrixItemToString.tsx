export const matrixItemToString = async (
  approvalMatrixes: any[],
  matrixItems: any[]
) => {
  if (matrixItems) {
    approvalMatrixes.forEach((approvalMatrix: any, index: number) => {
      let mainStr = "";
      let data = matrixItems.filter(
        (item: any) =>
          item.ApproveMatrixId === approvalMatrix.ApproveMatrixId &&
          item.IsActive === true &&
          (item.ApproverId !== 0 || item.PositionLevelId !== 0)
      );
      console.log("table=>data", data);

      data.sort((a: any, b: any) => (a.Seq > b.Seq ? 1 : -1));
      data.forEach((e: any, idx: number) => {
        if (idx < 3) {
          let subStr = "";
          subStr =
            Number(e.AmountFrom).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }) +
            "-" +
            Number(e.AmountTo).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }) +
            ": ";
          mainStr = mainStr + subStr;
        } else if (idx <= 4) {
          let subStr = "";
          subStr =
            Number(e.AmountFrom).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }) +
            "-" +
            Number(e.AmountTo).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            }) +
            ": ";
          mainStr = mainStr + subStr;
        }
      });
      approvalMatrix.AmountFrom_AmountTo = mainStr;
    });
  }
};
