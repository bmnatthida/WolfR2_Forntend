export const onCheckMemoPermission = (memoPermission: any) => {
  let canAccess = {
    view: true,
    showPdf: true,
  };
  if (memoPermission !== null) {
    const permission: any = memoPermission;
    console.log({ memoPermission });

    if (permission.View === "F") {
      canAccess.view = false;
    }
    if (permission.Print === "F") {
      canAccess.showPdf = false;
    }
  }
  return canAccess;
};
