import React, { useState, useEffect } from "react";
import "./MemoButtonComponent.css";
import { BiSend, BiCommentDetail } from "react-icons/bi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

import { AiOutlineSave } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import {
  IoMdCheckmarkCircleOutline,
  IoMdRefresh,
  IoMdArrowRoundBack,
} from "react-icons/io";
import { RiDeleteBinLine, RiFileForbidLine } from "react-icons/ri";
import { BsArrowRight } from "react-icons/bs";
import CommentComponent from "../Input/CommentComponent";
import { ConfirmDialogComponents } from "../ConfirmDialogComponent/ConfirmDialogComponents";
import { useTranslation } from "react-i18next";
interface Props {
  pageName: string;
  handleSubmit?: any;
  onSubmit?: any;
  memoMenu: any;
  buttonType?: string;
  setButtonType: any;
  setSelectedView?: any;
  setCurPage?: any;
  onUpdate?: (
    comment?: any,
    waiting_for?: string,
    waiting_for_id?: number
  ) => void;
}

export const MemoButtonComponent = (props: Props) => {
  const [memoMenuButton, setMemoMenuButton] = useState<any>();
  const [commentStatus, setCommentStatus] = useState<boolean>(false);
  const [require, setRequire] = useState<boolean>(false);
  const { t } = useTranslation(["translation"]);
  useEffect(() => {
    mapMemoButton(props.memoMenu);
    return memoMenuButton;
  }, [props.memoMenu]);

  const mapMemoButton = (menuData: any) => {
    if (typeof menuData !== "undefined") {
      const mapMenuData = menuData.map((data: any, idx: any) => {
        if (data.commandName === "reply") {
          return (
            <button
              key={idx}
              id="replyButton"
              className="memo-button comment"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }

                props.setButtonType("reply");
                setCommentStatus(true);
                setRequire(true);
              }}
            >
              <BiSend />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "submit") {
          return (
            <button
              key={idx}
              id="submitButton"
              className="memo-button submit"
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
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "approve") {
          return (
            <button
              key={idx}
              id="approveButton"
              className="memo-button approve"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                props.setButtonType("approve");
                setCommentStatus(true);
                setRequire(false);
              }}
            >
              <IoMdCheckmarkCircleOutline
                style={{ color: "white", width: "17px" }}
              />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "return") {
          return (
            <button
              key={idx}
              id="returnButton"
              className="memo-button return"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("return");
                setRequire(true);
              }}
            >
              <IoMdArrowRoundBack style={{ width: "17px" }} />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "discard") {
          return (
            <button
              key={idx}
              id="discardButton"
              className="memo-button discard"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("discard");
                setRequire(true);
              }}
            >
              <RiDeleteBinLine />
              {data.text}
            </button>
          );
        }
        if (data.commandName === "draft") {
          return (
            <button
              id="draftButton"
              key={idx}
              className="memo-button draft"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("draft");
                setRequire(false);
              }}
            >
              <AiOutlineSave />
              <p style={{ marginLeft: "2px" }}>{t("Save Draft")}</p>
            </button>
          );
        }
        if (data.commandName === "cancel") {
          return (
            <button
              key={idx}
              id="cancelButton"
              className="memo-button cancel"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("cancel");
                setRequire(true);
              }}
            >
              <MdOutlineCancel />
              <p style={{ marginLeft: "2px" }}>{t(data.text)} </p>
            </button>
          );
        }
        if (data.commandName === "recall") {
          return (
            <button
              key={idx}
              id="recallButton"
              className="memo-button recall"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("recall");
                setRequire(true);
              }}
            >
              <IoMdRefresh />
              <p style={{ marginLeft: "2px" }}>{t(data.text)} </p>
            </button>
          );
        }
        if (data.commandName === "rework") {
          return (
            <button
              key={idx}
              id="reworkButton"
              className="memo-button rework"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("rework");
                setRequire(true);
              }}
            >
              <IoMdRefresh />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "request comment") {
          return (
            <button
              key={idx}
              id="requestCommentButton"
              className="memo-button comment"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("request comment");
                setRequire(true);
              }}
            >
              <BiCommentDetail />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "assign") {
          return (
            <button
              key={idx}
              id="assignButton"
              className="memo-button assign"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("assign");
                setRequire(true);
              }}
            >
              <BsArrowRight />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        if (data.commandName === "reject") {
          return (
            <button
              key={idx}
              id="rejectButton"
              className="memo-button reject"
              onClick={() => {
                if (props.setSelectedView && props.setCurPage) {
                  props.setSelectedView("2");
                  props.setCurPage("2");
                }
                setCommentStatus(true);
                props.setButtonType("reject");
                setRequire(true);
              }}
            >
              <RiFileForbidLine />
              <p style={{ marginLeft: "2px" }}> {t(data.text)}</p>
            </button>
          );
        }
        return <></>;
      });
      setMemoMenuButton(mapMenuData);
    }
  };

  return (
    <>
      <div className="memo-button-container mobile">{memoMenuButton}</div>
      {commentStatus == true && (
        <CommentComponent
          onUpdate={props.onUpdate}
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
