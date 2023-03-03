import React, { useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { AiOutlineSave } from "react-icons/ai";
import { ConfirmDialogComponents } from "../ConfirmDialogComponent/ConfirmDialogComponents";
import { Toast } from "primereact/toast";
import CommentComponent from "../Input/CommentComponent";
import { useTranslation } from "react-i18next";
interface Props {
  type: string;
  // onUpdate: (
  //   data: any,
  //   comment?: any,
  //   waiting_for?: string,
  //   waiting_for_id?: number
  // ) => any;
  pageName: string;
  handleSubmit: any;
  onSubmit: any;
  buttonType: any;
  setButtonType: any;
  setSelectedView: any;
  setCurPage: any;
}

export const MemoSingleButton = (props: Props) => {
  const [commentStatus, setCommentStatus] = useState<boolean>(false);
  const [require, setRequire] = useState<boolean>(false);
  const { t } = useTranslation(["translation"]);
  return (
    <>
      {props.type === "submit" && (
        <button
          id="submitMemoSingle"
          className="memo-button submit"
          style={{
            width: "91px",
            height: "27px",
            paddingTop: "4px",
            display: "flex",
          }}
          onClick={() => {
            if (props.setSelectedView && props.setCurPage) {
              props.setSelectedView("2");
              props.setCurPage("2");
            }
            props.setButtonType("submit");
            setCommentStatus(true);
            setRequire(false);
          }}
        >
          <BiSend />
          <p style={{ marginLeft: "2px" }}> {t("Submit")}</p>
        </button>
      )}
      {props.type === "draft" && (
        <button
          id="draftMemoSingle"
          className="memo-button draft"
          style={{
            width: "110px",
            height: "27px",
            paddingTop: "4px",
            display: "flex",
          }}
          onClick={() => {
            if (props.setSelectedView && props.setCurPage) {
              props.setSelectedView("2");
              props.setCurPage("2");
            }

            props.setButtonType("draft");
            setCommentStatus(true);
            setRequire(false);
          }}
        >
          <AiOutlineSave />
          <p style={{ marginLeft: "2px" }}>{t("Save Draft")}</p>
        </button>
      )}
      {commentStatus === true && (
        <CommentComponent
          buttonType={props.buttonType}
          commentStatus={commentStatus}
          setCommentStatus={setCommentStatus}
          require={require}
          handleSubmit={props.handleSubmit}
          onSubmit={props.onSubmit}
          pageName={props.pageName}
        />
      )}
    </>
  );
};
