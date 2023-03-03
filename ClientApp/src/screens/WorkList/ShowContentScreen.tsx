import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import "./ShowContentScreen.css";
import { Spin } from "antd";
import { ProgressSpinner } from "primereact/progressspinner";
import { Empty } from "antd";
interface Props {
  pdfData: string;
  onLoading: boolean;
  isShowPdfData: boolean;
}

export const ShowContentScreen = (props: Props) => {
  const viewerDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log({ pdfdff: props.pdfData });
  }, [props.pdfData]);

  // useEffect(() => {
  //   WebViewer(
  //     {
  //       path: "lib",
  //       initialDoc:
  //         "https://testwolf18.wolfapprove.com/TempAttachment/ee864f46a1f14a54bf26f8d281719eb1/preview_TEST00-2021-000001.pdf",
  //     },
  //     viewerDiv.current as HTMLDivElement
  //   ).then((instance: any) => {});
  // }, []);
  // return <div className="webviewer" ref={viewerDiv}></div>;
  return (
    <div className="pdf-container">
      {props.isShowPdfData ? (
        props.onLoading ? (
          <ProgressSpinner className="spinning" />
        ) : props.pdfData.length > 0 ? (
          <iframe
            src={props.pdfData + "#toolbar=0"}
            allowFullScreen={true}
            frameBorder={0}
            // scrolling="yyes"
          ></iframe>
        ) : (
          <Empty />
        )
      ) : (
        <div className="error-text-container">
          {/* <p className="text-404">404</p> */}
          <p className="error-text">Access denied!</p>
          <p className="not-found-text">
            You do not have permission to perform access this resource. Please
            check your profile with system admin again.
          </p>
        </div>
      )}
    </div>
  );
};
