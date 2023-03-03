import { IUserModel } from "../IRequestModel/IUserModel";
import { GetMemoDetail, GetMemoDetailById } from "./MemoService";
import { GetTemplateById } from "./TemplateService";

export const GeneratePDF = async (
  memoId: any,
  userData: IUserModel,
  requestDetail?: any
) => {
  let _requestDetail: any = {};
  let dataJson: any = {};
  if (!requestDetail) {
    const responeMemoDetail = await GetMemoDetail({
      Memoid: memoId,
      SecretId: "",
      EmployeeId: userData.EmployeeId.toString(),
      TemplateId: 0,
      DocumentCode: "",
      DocumentNo: "",

      actor: userData,
    });

    _requestDetail = responeMemoDetail.requestDetails;
    console.log({ requestDetail, memoId, responeMemoDetail });
  } else {
    _requestDetail = requestDetail;
  }

  _requestDetail.memoDetail.actor = userData;
  const responePreviewPDF = await fetch(`api/PreviewPdf/PreviewPdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ MemoPage: _requestDetail }),
  });
  const respone = await responePreviewPDF.json();
  return respone;
};
