import { IRequestOnSubmit } from "../IRequestModel/CreateFormControl/IRequestOnSubmit";
import { IMemoDetailModel } from "../IRequestModel/IMemoDetailModel";

export const Validation = (
  _submitType: string,
  memoDetail: IMemoDetailModel,
  lineApproval: any
) => {
  let error_result: any[] = [];

  if (_submitType === "draft" || _submitType === "cancel") {
    if (memoDetail.company_id === 0 && _submitType === "draft") {
      error_result.push("Company");
    }
  } else {
    if (memoDetail.company_id === 0) {
      error_result.push("Company");
    }
    if (!memoDetail.subject) {
      error_result.push("Subject");
    }
    if (lineApproval.length <= 0) {
      error_result.push("Line Approve");
    }
  }
  return error_result;
};

export const ResponeValidation = (_respone: any) => {
  var _checkRespone: boolean = false;
  try {
    if (_respone.includes("done")) {
      _checkRespone = true;
    }
    return _checkRespone;
  } catch (error) {
    _checkRespone = false;
    return _checkRespone;
  }
};
