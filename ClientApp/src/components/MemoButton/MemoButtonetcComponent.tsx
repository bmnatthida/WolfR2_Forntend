import React, { useState, useEffect } from "react";
import "./MemoButtonComponent.css";
import { BiSend } from "react-icons/bi";
import { RiFileCopy2Line } from "react-icons/ri";
import { FaPrint } from "react-icons/fa";
import { Components } from "antd/lib/date-picker/generatePicker";
import { GeneratePDF } from "../../Services/ReviewPdfService";
import { Button } from "primereact/button";
import { useUserContext } from "../../Context/UserContext";
import { BsPencilSquare } from "react-icons/bs";
import { SetCheckAcces } from "../../Services/MemoService";
import useAlert from "../../hooks/useAlert";
import { useTranslation } from "react-i18next";
interface Props {
  memoIdForCopy: any;
  pdfData?: string;
  memoDetail?: any;
  isCheckAcces: boolean;
  canEdit: boolean;
  isControlLoading: boolean;
  setIsControlLoading: (value: boolean) => void;
  setCanEdit: (canEdit: boolean) => void;
  permission: any;
}
export const OtherButtonMemoComponent = (props: Props) => {
  const [userData, setUserData] = useUserContext();
  const [responeData, setResponeData] = useState<any>(props.pdfData);
  const [isCheckByOrigin, setIsCheckByOrigin] = useState<boolean>(false);
  const { t } = useTranslation(["translation"]);
  const { toggleAlert } = useAlert();

  var _localStorage = JSON.parse(localStorage.getItem("userData") || "");

  const _tinyURL = _localStorage.TinyURL;

  useEffect(() => {
    console.log("memo=>", props.pdfData);
    console.log("isShowPdf=>", props.permission);
    setData();
  }, []);
  var getUrl = window.location;
  var baseUrl = getUrl.protocol + "//" + getUrl.host;
  const buttonEdit = () => {
    if (IsCheckAccessEditing() || isCheckByOrigin) {
      return (
        <button
          className="memo-button copy"
          style={{
            width: "150px",
            height: "27px",
            paddingTop: "4px",
            display: "flex",
          }}
          onClick={() => {
            if (props.canEdit || isCheckByOrigin) {
              onSetCheckAccess(null);
            } else {
              props.setCanEdit(true);
            }
          }}
        >
          <BsPencilSquare />
          <p style={{ marginLeft: "2px" }}> Stop editing</p>
        </button>
      );
    } else {
      return (
        <button
          className="memo-button copy"
          style={{
            width: "91px",
            height: "27px",
            paddingTop: "4px",
            display: "flex",
          }}
          onClick={() => {
            if (props.canEdit) {
              props.setCanEdit(false);
            } else {
              onSetCheckAccess(userData.EmployeeId.toString());
            }
          }}
        >
          <BsPencilSquare />
          <p style={{ marginLeft: "2px" }}> isEditing</p>
        </button>
      );
    }
  };
  const buttonCopy = () => {
    return (
      <button
        id="copyButton"
        className="memo-button copy"
        style={{
          width: "91px",
          height: "27px",
          paddingTop: "4px",
          display: "flex",
        }}
        onClick={() => {
          window.open(
            `${baseUrl}/Request?MemoID=${props.memoIdForCopy}&isCopy`,
            "_blank",
            "noreferrer"
          );
        }}
      >
        <RiFileCopy2Line />
        <p style={{ marginLeft: "2px" }}> {t("Copy")}</p>
      </button>
    );
  };
  const buttonPreviewPdf = () => {
    return (
      <button
        id="preview--pdf-Button"
        className="memo-button print"
        style={{
          height: "27px",
          paddingTop: "4px",
          display: "flex",
        }}
        onClick={() => {
          var link = "";
          console.log({ responeData });

          const protocol = window.location.protocol;
          const attachPath = responeData?.replaceAll(
            `${protocol}//${_tinyURL}`,
            ""
          );
          console.log({ site: `${protocol}//${_tinyURL}/`, attachPath });

          const splitPath = attachPath.split("/") || [];
          if (splitPath.length >= 4) {
            const rootPath = splitPath[1] || "";
            const docPath = splitPath[2] || "";

            const fullName = splitPath[3] || "";
            const lastIndex = fullName.lastIndexOf(".");
            let extension = fullName.substring(lastIndex + 1);
            const name = fullName.substring(0, lastIndex);
            link = `${protocol}//` + _tinyURL + attachPath;
            console.log({
              protocol,
              _tinyURL,
              attachPath,
              splitPath,
            });
            // ${protocol}//${_tinyURL}
            window.open(
              `${protocol}//${_tinyURL}/previewAttachment?rootPath=${rootPath}&docPath=${docPath}&ext=${extension}&name=${name}`,
              "_blank",
              "noreferrer"
            );
          }
        }}
      >
        <RiFileCopy2Line />
        <p style={{ marginLeft: "2px" }}>{t("Preview Pdf")}</p>
      </button>
    );
  };
  const onOpenPdfLink = () => {
    window.open(`${responeData}`, "_blank", "noreferrer");
  };
  const buttonPrintPDF = () => {
    return (
      <button
        id="print-pdf-Button"
        className="memo-button print"
        style={{
          width: "91px",
          height: "27px",
          paddingTop: "4px",
          display: "flex",
        }}
        onClick={() => {
          onOpenPdfLink();
        }}
      >
        <FaPrint />

        <p style={{ marginLeft: "2px" }}>{t("Print")}</p>
      </button>
    );
  };

  const IsCheckAccessEditing = () => {
    let isCheck = false;
    if (
      props.memoDetail?.memoDetail?.actorCheckAccess?.EmployeeId ===
      userData.EmployeeId
    ) {
      isCheck = true;
    }
    return isCheck;
  };

  const onSetCheckAccess = async (RequesterId?: string | null) => {
    props.setIsControlLoading(true);
    const checkAccessRequestModel = {
      memoid: props.memoDetail.memoDetail.memoid.toString(),
      RequesterId: RequesterId,
    };
    console.log("memo=>checkAccessRequestModel", checkAccessRequestModel);
    const result = await SetCheckAcces(checkAccessRequestModel);
    console.log("memo=>result", result);
    if (result.result === "success") {
      if (RequesterId) {
        props.setCanEdit(true);
        setIsCheckByOrigin(true);
      } else {
        props.setCanEdit(false);
        setIsCheckByOrigin(false);
      }
    } else if (result.result === "NotAccess") {
      if (userData.Lang === "TH") {
        toggleAlert({
          description: `มีผู้อื่นกำลังแก้ไขเอกสารอยู่`,
          message: `Not Access.`,
          type: "error",
        });
      } else {
        toggleAlert({
          description: `You do not have edit memo.`,
          message: `Not Access.`,
          type: "error",
        });
      }
      props.setCanEdit(false);
    }
    props.setIsControlLoading(false);
  };

  async function setData() {
    let respone = await GeneratePDF(
      props.memoIdForCopy,
      userData,
      props.memoDetail
    );
    console.log("memo=>respone", respone);

    setResponeData(respone);
  }

  const checkIsAccessComponent = () => {
    if (userData.Lang === "TH") {
      return (
        <span>
          เอกสารฉบับนี้กำลังถูกแก้ไขอยู่โดย{" "}
          {props.memoDetail.memoDetail?.actorCheckAccess?.NameEn}
        </span>
      );
    } else {
      return (
        <span>
          This memo is editing by{" "}
          {props.memoDetail.memoDetail?.actorCheckAccess?.NameEn}
        </span>
      );
    }
  };

  return (
    <div className="memo-button-container">
      {props.memoDetail.memoDetail?.actorCheckAccess &&
      !IsCheckAccessEditing() ? (
        checkIsAccessComponent()
      ) : (
        <>
          {responeData ? (
            <>{buttonPreviewPdf()}</>
          ) : (
            <Button
              className="memo-button memo-loading dd ss set-preview-pdf"
              label={t("Preview Pdf") ?? ""}
              loading
            />
          )}
          {props.isCheckAcces && buttonEdit()}
          {buttonCopy()}
          {responeData ? (
            <>
              {(props.permission?.Print === "T" || props.permission === null) &&
                buttonPrintPDF()}
            </>
          ) : (
            <Button
              className="memo-button memo-loading dd ss"
              label={t("Print") ?? ""}
              loading
            />
          )}
        </>
      )}
    </div>
  );
};
