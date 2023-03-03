import React, { FC, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import MSDocRenderer from "../../utils/plugins/msdoc";

import "./index.css";
type Props = {};

const PreviewAttachmentScreen: FC<Props> = ({}) => {
  const [selectedDoc, setSelectedDoc] = useState<string>();
  const [fileExt, setFileExt] = useState<"image" | "pdf" | "ms">();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  var _localStorage = JSON.parse(localStorage.getItem("userData") || "");
  const imageType = [
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "gif",
    "png",
    "svg",
    "sharepoint",
  ];
  const pdfType = ["pdf", "txt"];
  const msType = ["doc", "docx", "csv", "xls", "xlsx", "pot", "potx", "pptx"];
  const _userData = JSON.parse(window.localStorage.getItem("userData") || "");
  const _sharepointSiteURL = _userData.SharepointSiteURL;

  useEffect(() => {
    checkQuery();
  }, [query]);
  useEffect(() => {
    // const iframEl = document.getElementById("iframePdf");
    // if (iframEl) {
    //   console.log({ iframEl });
    //   iframEl.addEventListener("contextmenu ", function () {
    //     console.log("Right Click");
    //     return false;
    //   });
    // }
    // document.addEventListener("contextmenu", (event) => event.preventDefault());
  }, []);

  const checkQuery = async () => {
    let rootPath: string | null = null;
    let docPath: string | null = null;
    let fileName: string | null = null;
    let ext: string | null = null;
    const protocol = window.location.protocol;
    const _tinyURL = _localStorage.TinyURL;

    let link = "";
    if (query.get("rootPath")) {
      rootPath = query.get("rootPath");
    }
    if (query.get("docPath")) {
      docPath = query.get("docPath");
    }
    if (query.get("name")) {
      fileName = query.get("name");
    }
    if (query.get("ext")) {
      ext = query.get("ext");
    }
    console.log("link=>", { ext });

    if (rootPath && docPath && fileName && ext) {
      link = "";
      if (_sharepointSiteURL) {
        link = `${_sharepointSiteURL}/${fileName}.${ext}`;
      } else {
        link = `${protocol}//${_tinyURL}/${rootPath}/${docPath}/${fileName}.${ext}`;
      }
      console.log({ link });
      getTypeOfFile(ext.toLowerCase());
      setSelectedDoc(link);
    }
  };
  const getTypeOfFile = (ext: string) => {
    const _imageType = imageType.includes(ext);
    const _pdfType = pdfType.includes(ext);
    const _msType = msType.includes(ext);

    if (_imageType) {
      setFileExt("image");
    } else if (_pdfType) {
      setFileExt("pdf");
    } else if (_msType) {
      setFileExt("ms");
    }
    console.log({ _imageType, _pdfType, _msType });
  };
  return (
    <div
      className="request-main-container"
      style={{ height: "calc(100vh - 75px)" }}
    >
      <div className="request-container">
        <div
          className="request-container-item"
          style={{ width: "auto", height: "100%", position: "relative" }}
        >
          {/* <p>PreviewAttachmentScreen</p> */}
          {selectedDoc && fileExt?.toLowerCase() === "ms" && (
            <>
              <div
                style={{
                  width: "calc(100% - 50px)",
                  height: "calc(100% - 105px)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              ></div>
              <MSDocRenderer uri={selectedDoc} />
              <div
                style={{
                  width: "30%",
                  height: "60px",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              ></div>
            </>
          )}
          {selectedDoc && fileExt === "pdf" && (
            <>
              <div
                className="block-div"
                style={{
                  width: "calc(100% - 50px)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              ></div>

              <iframe
                // aria-disabled={true}
                id="iframePdf"
                contentEditable={false}
                src={selectedDoc + "#toolbar=0"}
                allowFullScreen={true}
                frameBorder={0}
                width="100%"
                height="100%"
                // scrolling="yyes"
              ></iframe>
            </>
          )}
          {selectedDoc && fileExt === "image" && (
            <>
              <div
                className="block-div"
                style={{
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              ></div>

              <img
                src={selectedDoc}
                alt="image-preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewAttachmentScreen;
