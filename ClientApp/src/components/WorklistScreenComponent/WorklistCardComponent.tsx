import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./WorklistCardComponent.css";
import { FaChevronRight } from "react-icons/fa";
import moment from "moment";
import { Badge } from "primereact/badge";
import CommentComponent from "../Input/CommentComponent";
import { IUserModel } from "../../IRequestModel/IUserModel";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  data: any;
  setContent: (
    memoId: number,
    status: string,
    index: number,
    requestor: IUserModel
  ) => void;
  index: number;
  onUpdate: (
    type: any,
    memoid: any,
    comment?: any,
    waiting_for?: string,
    waiting_for_id?: number
  ) => void;
  taskGourp: any;
  currentMemoId: number;
}

export const WorklistCardComponent = (props: Props) => {
  const [data, setData] = useState<any>(props.data || {});
  const [dataUrl, setDataUrl] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCommentActive, setIsCommentActive] = useState(false);
  useEffect(() => {
    setData(props.data);
    setDataUrl(`/Request?MemoID=${props.data.MemoID}`);
  }, [props.data]);
  const history = useHistory();
  const amount_label = "[Amount/day]";
  const { t } = useTranslation(["translation"]);
  useEffect(() => {
    if (props.currentMemoId === props.data.MemoID) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [props.currentMemoId]);

  const formatDate = () => {
    let momentObj = moment(data.ModifiedDate, "DD/MM/yyyy HH:mm:ss");
    // console.log("data.RequestDate", data);

    return moment(momentObj).format("DD MMM yyyy , HH:mm");
  };
  const resposeComment = (comment: any) => {
    console.log("data", props.data.MemoID, "comment", comment);
    props.onUpdate("approve", props.data.MemoID, comment);
  };
  return (
    <motion.div className={`card-container ${isActive ? "-active" : ""}`}>
      <div
        className="card-content-container desktop"
        onClick={() => {
          let _requestor = data.Requestor || {};
          console.log({ proppppppp: data.Status });

          props.setContent(data.MemoID, data.Status, props.index, _requestor);
          // } else if (screens["sm"] || screens["xs"]) {
          //   const memoid = { MemoID: data.MemoID };
          //   history.push("/request", memoid);
          // }
        }}
      >
        <div className="card-body-content-container">
          <div className="running-number-container">
            <Link className="text-form-running" to={dataUrl}>
              {data.DocumentNo}
            </Link>
            <p className="text-date">{formatDate()}</p>
          </div>
          <p className="text-format">
            {data.Amount == ".00" ? null : amount_label}
          </p>
        </div>
        <div className="text-subject-container">
          <span className="card-text-detail">{data.Subject}</span>
          <div className="result-container">
            <p className="text-result">
              {data.Amount == ".00" ? null : data.Amount}
            </p>
          </div>
        </div>
        <div className="card-topic-and-status-container">
          <p className="text-form-type">{data.TemplateName}</p>
          {/* <p className="text-status">{data.Status}</p> */}
          <Badge
            className="p-mr-2 worklist-badge"
            value={t(data.Status)}
            style={{
              color: "white",
              background:
                data.Status === "Wait for Approve"
                  ? "#282f6a"
                  : null || data.Status === "Recall"
                  ? "#F8A51C"
                  : null || data.Status === "Draft"
                  ? "#b4b4b4"
                  : null || data.Status === "Completed"
                  ? "#28a745"
                  : null || data.Status === "Rework"
                  ? "#F8A51C"
                  : null || data.Status === "Cancelled"
                  ? "#dc3545"
                  : null || data.Status === "Rejected"
                  ? "#dc3545"
                  : null || data.Status === "Wait for Comment"
                  ? "#06BEE1"
                  : null,
            }}
          ></Badge>
        </div>
      </div>
      <div className="card-footer-container desktop">
        <div className="list-aprroval-container">
          <div className="request-by-container">
            <p className="text-label">{t("Request By")}</p>
            <p className="text-name">
              {data.Requestor &&
                (data.Requestor.Lang === "EN"
                  ? data.Requestor.NameEn
                  : data.Requestor.NameTh)}
            </p>
          </div>
          <FaChevronRight />
          <div className="waiting-for-container">
            <p className="text-label">{t("Waiting for")}</p>
            <p className="text-name">
              {data.WaitingFor !== null
                ? data.WaitingFor.Lang === "EN"
                  ? data.WaitingFor.NameEn
                  : data.WaitingFor.NameTh
                : "-"}
            </p>
          </div>
        </div>
        {props.taskGourp === "todo" && (
          <>
            {data.Status === "Wait for Approve" && (
              <button
                className="approve-button"
                onClick={() => {
                  setIsCommentActive(true);
                  // props.onUpdate("approve", data.MemoID)
                }}
              >
                {t("Approve")}
              </button>
            )}
            {isCommentActive && (
              <CommentComponent
                buttonType={"approve"}
                commentStatus={isCommentActive}
                setCommentStatus={setIsCommentActive}
                require={false}
                onUpdate={resposeComment}
                // onUpdate={(upDateData: any, comment: any) =>
                //   props.onUpdate(upDateData, comment)
                // }
                pageName={"WorkList"}
              />
            )}
          </>
        )}
      </div>
      <div
        className="card-content-container mobile"
        onClick={() => {
          const memoid = { MemoID: data.MemoID };
          // history.push("/Request", memoid);
          history.push(`/Request?MemoID=${data.MemoID}`, memoid);
        }}
      >
        <div className="card-body-content-container">
          <div className="running-number-container">
            <p className="text-form-running">{data.DocumentNo}</p>
            <p className="text-date">{data.RequestDate}</p>
          </div>
          <div className="result-container">
            <p className="text-format">
              {data.Amount == ".00" ? null : amount_label}
            </p>
            <p className="text-result">
              {data.Amount == ".00" ? null : data.Amount}
            </p>
          </div>
        </div>
        <p className="card-text-detail">{data.Subject}</p>
        <div className="card-topic-and-status-container">
          <p className="text-form-type">{data.TemplateName}</p>
          <Badge
            className="p-mr-2 worklist-badge"
            value={data.Status}
            style={{
              color: "white",
              background:
                data.Status === "Wait for Approve"
                  ? "#282f6a"
                  : null || data.Status === "Recall"
                  ? "#F8A51C"
                  : null || data.Status === "Draft"
                  ? "#b4b4b4"
                  : null || data.Status === "Completed"
                  ? "#28a745"
                  : null || data.Status === "Rework"
                  ? "#F8A51C"
                  : null || data.Status === "Cancelled"
                  ? "#dc3545"
                  : null || data.Status === "Rejected"
                  ? "#dc3545"
                  : null,
            }}
          ></Badge>
        </div>
      </div>
      <div className="card-footer-container mobile">
        <div className="list-aprroval-container">
          <div className="request-by-container">
            <p className="text-label">{t("Request By")}</p>
            <p className="text-name">
              {data.Requestor && data.Requestor.NameTh}
            </p>
          </div>
          <FaChevronRight />
          <div className="waiting-for-container">
            <p className="text-label">{t("Waiting for")}</p>
            <p className="text-name">
              {data.WaitingFor && data.WaitingFor.NameTh}
            </p>
          </div>
        </div>
        {props.taskGourp === "todo" && (
          <>
            {data.Status === "Wait for Approve" && (
              <button
                className="approve-button"
                onClick={() => {
                  setIsCommentActive(true);
                  // props.onUpdate("approve", data.MemoID)
                }}
              >
                Approve
              </button>
            )}
            {isCommentActive && (
              <CommentComponent
                buttonType={"approve"}
                commentStatus={isCommentActive}
                setCommentStatus={setIsCommentActive}
                require={false}
                onUpdate={resposeComment}
                // onUpdate={(
                //   buttonType: string,
                //   comment: string,
                //   waiting_for: any,
                //   waiting_for_id: any
                // ) => props.onUpdate(buttonType, props.data.MemoID, comment)}
                pageName={"WorkList"}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
