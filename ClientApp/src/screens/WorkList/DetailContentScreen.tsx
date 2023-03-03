import React, { useState, useEffect, FC } from "react";
import "./DetailContentScreen.css";
import { BsFileEarmarkRuledFill, BsClockHistory } from "react-icons/bs";
import { RiNodeTree } from "react-icons/ri";
import { GrAttachment } from "react-icons/gr";
import { useHistory } from "react-router-dom";
import { ShowContentScreen } from "./ShowContentScreen";
import { FlowScreen } from "./FlowScreen";
import { HistoryScreen } from "./HistoryScreen";
import { AttachmentScreen } from "./AttachmentScreen";
import { IoDocumentText, IoOpenOutline } from "react-icons/io5";
import { MemoButtonComponent } from "../../components/MemoButton/MemoButtonComponent";
import { MemoSingleButton } from "../../components/MemoButton/MemoSingleButton";
import { GeneratePDF } from "../../Services/ReviewPdfService";
import { useUserContext } from "../../Context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { IWorklistDetail } from "../../IRequestModel/IWorklistModel";

interface Props {
  data?: IWorklistDetail;
  menuButton: any;
  onUpdate: (
    type: any,
    memoId: any,
    comment: any,
    waiting_for?: string,
    waiting_for_id?: number
  ) => void;
  isShowPdfData: boolean;
  setButtonType: any;
  buttonType: string;
}

export const DetailContentScreen: FC<Props> = ({
  data,
  menuButton,
  onUpdate,
  isShowPdfData,
  setButtonType,
  buttonType,
}) => {
  const [userData] = useUserContext();
  const [page, setPage] = useState<Number>(1);
  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [pdfData, setPdfData] = useState<string>("");
  const [memoMenu, setMemoMenu] = useState<any>();
  useEffect(() => {
    setOnLoading(true);
    onFetchPdf(data?.MemoID);
  }, [data]);
  useEffect(() => {
    const menuButtonSort = menuButton.sort(
      (x: any, y: any) => x.sequence - y.sequence
    );
    setMemoMenu(menuButtonSort);
  }, [menuButton]);
  const history = useHistory();

  async function onFetchPdf(memoId: any) {
    let responeData = await GeneratePDF(memoId, userData);

    setOnLoading(false);

    setPdfData(responeData);
  }
  return (
    <motion.div
      className="content-container"
      transition={{ duration: 0.35 }}
      animate={{ x: [1000, 0] }}
      exit={{ x: [0, 1000] }}
    >
      <div className="header-container">
        <div
          className={`header-content-button${page === 1 ? " -active" : ""}`}
          onClick={() => {
            setPage(1);
          }}
        >
          <IoDocumentText />
          <p className="text-content-button">Content</p>
        </div>
        <div
          className={`header-content-button${page === 2 ? " -active" : ""}`}
          onClick={() => setPage(2)}
        >
          <RiNodeTree />
          <p className="text-content-button">Flow</p>
        </div>
        <div
          className={`header-content-button${page === 3 ? " -active" : ""}`}
          onClick={() => setPage(3)}
        >
          <BsClockHistory />
          <p className="text-content-button">History</p>
        </div>
        <div
          className={`header-content-button${page === 4 ? " -active" : ""}`}
          onClick={() => setPage(4)}
        >
          <GrAttachment />
          <p className="text-content-button">Attachment</p>
        </div>
        <div className={"to-request-screen-button"}>
          <IoOpenOutline
            onClick={() => {
              const _data = {
                MemoID: data?.MemoID,
                pdfData: pdfData,
              };
              history.push(`/Request?MemoID=${_data.MemoID}`, _data);
            }}
          />
        </div>
      </div>
      {/* <MemoSingleButton type="submit" onClick={onMemoClick} /> */}
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className={`content ${onLoading ? "on-loading" : ""}`}
          key={page.toString()}
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {page === 1 && (
            <ShowContentScreen
              pdfData={pdfData}
              onLoading={onLoading}
              isShowPdfData={isShowPdfData}
            />
          )}
          {page === 2 && (
            <FlowScreen
              approvals={data?.approvals}
              requestor={data?.requestor}
            />
          )}
          {page === 3 && <HistoryScreen historyData={data?.history} />}
          {page === 4 && <AttachmentScreen attachFiles={data?.attachfiles} />}
        </motion.div>
      </AnimatePresence>

      <div className="detail-content-footer">
        <MemoButtonComponent
          setButtonType={setButtonType}
          buttonType={buttonType}
          memoMenu={memoMenu}
          onUpdate={(
            comment: any,
            waiting_for?: string,
            waiting_for_id?: number
          ) =>
            onUpdate(
              buttonType,
              data?.MemoID,
              comment,
              waiting_for,
              waiting_for_id
            )
          }
          pageName={"WorkList"}
        />
      </div>
    </motion.div>
  );
};
