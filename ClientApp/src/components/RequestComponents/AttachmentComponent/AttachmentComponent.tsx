import React, { useState, useEffect, useRef } from "react";
import "./AttachmentComponent.css";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import moment from "moment";

import { AiFillEye } from "react-icons/ai";
import LogoLoading from "../../../assets/LoadingWOLFmini.gif";
import { Checkbox } from "primereact/checkbox";
import { BiUpload } from "react-icons/bi";
import { InputText } from "primereact/inputtext";
import { Form } from "react-bootstrap";
import { SplitButton } from "primereact/splitbutton";
import { ConfirmDialog } from "primereact/confirmdialog";
import DescriptionConfigComponent from "./DescriptionConfigComponent";
import axios from "axios";
import { UploadFileAttachFiles } from "../../../Services/AttachFileService";
import { IoMdAlert } from "react-icons/io";
import { Dialog } from "primereact/dialog";
import useAlert from "../../../hooks/useAlert";
import { GetPermissionByEmpId } from "../../../Services/RoleServices";
import {
  CannotDowLoadPDFDefaultConfiguration,
  getUploadFileSettingConfiguration,
} from "../../../Services/ConfigurationService";
interface Props {
  listFileAttachDetails: any;
  setListFileAttachDetails: any;
  setMemoDetail: any;
  memoDetail: any;
  userData: any;
  canEditDoc: boolean;
  listFormNames: any;
  checkActionPage: string;
  masterATDLFT: any;
  t: any;
}

const AttachmentComponent: React.FC<Props> = ({
  t,
  listFileAttachDetails,
  setListFileAttachDetails,
  setMemoDetail,
  memoDetail,
  userData,
  canEditDoc,
  listFormNames,
  checkActionPage,
  masterATDLFT,
}) => {
  const { toggleAlert } = useAlert();
  const toast = useRef<any>(null);
  const ref = React.useRef<any>();
  var _localStorage = JSON.parse(localStorage.getItem("userData") || "");
  const _sharepointSiteURL = _localStorage.SharepointSiteURL;
  const _tinyURL = _localStorage.TinyURL;
  const [requestFile, setRequestFile] = useState<any>(null);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [value, setValue] = useState("");
  const [visibleStatus, setVisibleStatus] = useState(false);

  const [fileData, setFileData] = useState<any>();
  const [pathData, setPathData] = useState<any>();
  const [description, setDescription] = useState("");

  const [indexState, setIndexState] = useState<number>(0);
  const [descriptionRespone, setDescriptionRespone] = useState<string>();
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [configFile, setConfigFile] = useState<any>({});
  useEffect(() => {
    console.log(userData, "userData");
    console.log(_localStorage, "userData");
    console.log(memoDetail, "userData");
    console.log(listFileAttachDetails, "userData");
    fechData();
  }, []);
  async function fechData() {
    const config = await getUploadFileSettingConfiguration();
    setConfigFile(config);
  }
  const formatDateTime = (value: string) => {
    if (value == null) {
      return "";
    } else {
      let momentObj = moment(value, "DD/MM/yyyy HH:mm:ss");
      return moment(momentObj).format("DD MMM yyyy");
    }
  };
  const convertDate = (data: any) => {
    return formatDateTime(data);
  };

  const onError = () => {
    toggleAlert({
      description: `Server Error Please try again.`,
      message: `Server Error`,
      type: "error",
    });
  };
  useEffect(() => {
    console.log(masterATDLFT, "masterATDLFT");
  }, []);

  const onFileSelect = async (e: any) => {
    var filename = e.target.value;
    var userName = filename.split("\\").pop();
    const files = e.target.files;
    const maxLength = parseInt(configFile.limitFileSize);
    const maxMb = 20971520 / 1024 / 1024;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size >= maxLength) {
        toggleAlert({
          description: `Can not upload file size more than ${maxMb}.MB File name is ${files[i].name}`,
          message: `File size warning.`,
          type: "warning",
        });
        ref.current.value = null;
        return;
      }
    }

    setRequestFile(e.target.files);
    setFileData(userName);
    setPathData(filename);
  };

  function deleteFile() {
    setListFileAttachDetails(
      listFileAttachDetails.filter((_val: any, _idx: number) => {
        return _idx !== indexState;
      })
    );
  }

  async function onUploadFile() {
    if (requestFile !== null) {
      setOnLoading(true);
      for (let i = 0; i < requestFile.length; i++) {
        const attachWorkList = listFileAttachDetails;
        const lastFile = attachWorkList[attachWorkList.length - 1];
        const NewDate = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        let newFile = Object.assign({}, lastFile);
        const formData = new FormData();
        formData.append(`files`, requestFile[i]);
        formData.append("Doclib", "TempAttachment");
        formData.append("docSet", memoDetail.template_detail);
        formData.append("fileDesc", description);
        formData.append("actorID", userData.EmployeeId);
        console.log(formData, "formData");

        var response: any = await UploadFileAttachFiles(formData);
        if (response.data?.result === true) {
          if (_sharepointSiteURL) {
            newFile.attach_path =
              _sharepointSiteURL + "" + response.data.pathUrl;
          } else {
            newFile.attach_path = response.data.pathUrl;
          }
          if (lastFile != undefined) {
            newFile.sequence = lastFile.sequence + 1;
          } else {
            newFile.sequence = 1;
          }
          newFile.memo_id = memoDetail.memoid;
          newFile.actor = userData;
          newFile.attach_date = NewDate;
          newFile.attach_file = response.data.fileName;
          newFile.is_merge_pdf = false;
          newFile.modified_date = NewDate;
          newFile.modified_by = userData.EmployeeId.toString();
          newFile.description = description;
          attachWorkList.push(newFile);
          setListFileAttachDetails([...attachWorkList]);
        } else {
          onError();
        }
      }
      setOnLoading(false);
      setRequestFile(null);
      setValue("");
      setDescription("");
      ref.current.value = null;
    } else {
      toggleAlert({
        description: `Please Select File.`,
        message: `File select warning.`,
        type: "warning",
      });
    }
  }
  const footer = (
    <div>
      <Button
        label="OK"
        onClick={() => {
          setVisibleDialog(false);
        }}
      />
    </div>
  );

  function renderDialog() {
    return (
      <>
        <Dialog
          style={{ width: "29vw", fontSize: "15px" }}
          header="Information"
          visible={visibleDialog}
          modal
          footer={footer}
          draggable={false}
          position={"top"}
          onHide={() => {
            setVisibleDialog(false);
          }}
        >
          <label className="set-css-content-attachment">
            {configFile.limitFileInfo}
          </label>
        </Dialog>
      </>
    );
  }

  return (
    <div>
      {renderDialog()}
      <Toast ref={toast}></Toast>
      {onLoading && (
        <div className="logo-loading cursor-loading">
          <img src={LogoLoading} alt="loading..." />
        </div>
      )}
      <div>
        <p className="Col-text-header">{t("attachment")}</p>
        <div className="Attach">
          <>
            <div className="">
              <span className="p-d-block p-mt-2">{t("Attach File")} : </span>
              <div className="p-inputgroup set-layout-att-input">
                <Form.Control
                  ref={ref}
                  id="attach-file"
                  type="file"
                  accept="*"
                  onChange={(e) => onFileSelect(e)}
                  multiple
                  className="attachForm-border-fttach-file"
                  placeholder="fdfsd"
                />
                <IoMdAlert
                  onClick={() => {
                    setVisibleDialog(true);
                  }}
                  className="set-css-icon-alert-in-upload-file"
                />
              </div>
            </div>
            <div className="setting-display">
              <span className="p-d-block">{t("Description")} : </span>
              <div className="p-inputgroup">
                <InputText
                  disabled={!canEditDoc}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setDescription(e.target.value);
                  }}
                  className="p-d-block p-inputgroup attachForm-border-description-inputText"
                />
                <Button
                  id="upload"
                  className="button-upload attachForm-border-description-button"
                  onClick={onUploadFile}
                >
                  <BiUpload />
                  {t("Upload")}
                </Button>
              </div>
            </div>
          </>
        </div>
      </div>
      <div>
        <div>
          {listFileAttachDetails?.length > 0 && (
            <>
              <p className="Col-text-header p-mt-5">Attached File</p>
              <div className="attachForm ">
                <div className="HeadATT">
                  <div className="sequenceAtt">
                    <h4>#</h4>
                  </div>
                  <div className="DateAtt">
                    <h4>Date</h4>
                  </div>
                  <div className="FileAtt">
                    <h4>Attached File</h4>
                  </div>
                  <div className="DecripAtt">
                    <h4>Description</h4>
                  </div>
                  <div className=" mergeAtt">
                    <h4>Merge</h4>
                    <div className="checkboxAtt"></div>
                  </div>
                  <div className="ActionAtt">
                    <h4>Action</h4>
                  </div>
                </div>
                {listFileAttachDetails?.length > 0 &&
                  listFileAttachDetails.map((attachData: any, idx: number) => (
                    <div className="innerAtt">
                      <div className="sequenceAtt">
                        <p key={idx}>{idx + 1}</p>
                      </div>
                      <div className="detail-DateAtt">
                        <p>{convertDate(attachData.attach_date)}</p>
                      </div>
                      <div className="detail-FileAtt">
                        <p
                          className="set-pointer-css-attachment"
                          onClick={async () => {
                            var link = "";
                            const protocol = window.location.protocol;
                            const attachPath = attachData.attach_path
                              ? attachData.attach_path.charAt(0) !== "/"
                                ? "/" + attachData.attach_path
                                : attachData.attach_path
                              : "";
                            const splitPath =
                              attachData.attach_path.split("/") || [];
                            console.log(_sharepointSiteURL, "att=>");
                            const cannotDownloadPdfAppSetting =
                              await CannotDowLoadPDFDefaultConfiguration();
                            if (!_sharepointSiteURL) {
                              const rootPath = splitPath[1] || "";
                              const docPath = splitPath[2] || "";
                              const fullName = splitPath[3] || "";
                              const lastIndex = fullName.lastIndexOf(".");
                              let extension = fullName.substring(lastIndex + 1);
                              const name = fullName.substring(0, lastIndex);

                              link = `${protocol}//` + _tinyURL + attachPath;
                              console.log("att=>!_sharepointSiteURL", {
                                protocol,
                                _tinyURL,
                                attachPath,
                                splitPath,
                              });

                              const checkCanDownload =
                                listFormNames?.RefDocDisplay?.split(",");
                              const checkCanDownloadAttach =
                                checkCanDownload?.length >= 5
                                  ? checkCanDownload[5]
                                  : "";
                              const response = await GetPermissionByEmpId({
                                EmployeeId: userData.EmployeeId,
                              });
                              let checkRoleId = false;
                              for (let i = 0; i < response.length; i++) {
                                const element = response[i];
                                if (element?.roleId === 1) {
                                  checkRoleId = true;
                                  break;
                                } else {
                                  checkRoleId = false;
                                }
                              }
                              let checkDLAttach = false;
                              if (masterATDLFT) {
                                const downloadFileType =
                                  masterATDLFT.Value1.split(",");
                                if (downloadFileType?.length > 0) {
                                  downloadFileType.map((fileType: any) => {
                                    if (link.toLowerCase().endsWith(fileType)) {
                                      checkDLAttach = true;
                                    }
                                  });
                                }
                              }
                              if (checkRoleId) {
                                window.open(link, "_blank", "noreferrer");
                              } else if (checkDLAttach) {
                                window.open(link, "_blank", "noreferrer");
                              } else if (
                                memoDetail?.Permission?.AttachDownload === "F"
                              ) {
                                window.open(
                                  `${protocol}//${_tinyURL}/previewAttachment?rootPath=${rootPath}&docPath=${docPath}&ext=${extension}&name=${name}`,
                                  "_blank",
                                  "noreferrer"
                                );
                              } else if (
                                checkCanDownloadAttach?.toLowerCase() ===
                                  "yes" &&
                                checkActionPage === "add"
                              ) {
                                window.open(link, "_blank", "noreferrer");
                              } else if (
                                cannotDownloadPdfAppSetting?.cannotDowLoadPDFDefault
                              ) {
                                window.open(
                                  `${protocol}//${_tinyURL}/previewAttachment?rootPath=${rootPath}&docPath=${docPath}&ext=${extension}&name=${name}`,
                                  "_blank",
                                  "noreferrer"
                                );
                              } else {
                                window.open(link, "_blank", "noreferrer");
                              }
                              console.log(
                                cannotDownloadPdfAppSetting,
                                "cannotDownloadPdfAppSetting"
                              );
                            }
                            //_sharepointSiteURL
                            else {
                              const rootPath = splitPath[5] || "";
                              const docPath = splitPath[6] || "";
                              const fullName = splitPath[7] || "";
                              const lastIndex = fullName.lastIndexOf(".");
                              let extension = fullName.substring(lastIndex + 1);
                              const name = fullName.substring(0, lastIndex);
                              link = attachPath;
                              console.log("att=>", {
                                protocol,
                                _tinyURL,
                                attachPath,
                                splitPath,
                              });
                              console.log({
                                link,
                              });
                              link =
                                attachPath.charAt(0) === "/"
                                  ? attachPath.substring(1)
                                  : attachPath;
                              const checkCanDownload =
                                listFormNames?.RefDocDisplay?.split(",");
                              const checkCanDownloadAttach =
                                checkCanDownload?.length >= 5
                                  ? checkCanDownload[5]
                                  : "";
                              let checkDLAttach = false;
                              if (masterATDLFT) {
                                const downloadFileType =
                                  masterATDLFT.Value1.split(",");
                                if (downloadFileType?.length > 0) {
                                  downloadFileType.map((fileType: any) => {
                                    if (link.toLowerCase().endsWith(fileType)) {
                                      checkDLAttach = true;
                                    }
                                  });
                                }
                              }

                              const response = await GetPermissionByEmpId({
                                EmployeeId: userData.EmployeeId,
                              });
                              let checkRoleId = false;
                              for (let i = 0; i < response.length; i++) {
                                const element = response[i];
                                if (element?.roleId === 1) {
                                  checkRoleId = true;
                                  break;
                                } else {
                                  checkRoleId = false;
                                }
                              }

                              if (checkRoleId) {
                                window.open(link, "_blank", "noreferrer");
                              } else if (checkDLAttach) {
                                window.open(link, "_blank", "noreferrer");
                              } else if (
                                memoDetail?.Permission?.AttachDownload === "F"
                              ) {
                                window.open(
                                  `${protocol}//${_tinyURL}/previewAttachment?rootPath=${rootPath}&docPath=${docPath}&ext=${extension}&name=${name}`,
                                  "_blank",
                                  "noreferrer"
                                );
                              } else if (
                                checkCanDownloadAttach?.toLowerCase() ===
                                  "yes" &&
                                checkActionPage === "add"
                              ) {
                                window.open(link, "_blank", "noreferrer");
                              } else if (
                                cannotDownloadPdfAppSetting?.cannotDowLoadPDFDefault
                              ) {
                                window.open(
                                  `${protocol}//${_tinyURL}/previewAttachment?rootPath=${rootPath}&docPath=${docPath}&ext=${extension}&name=${name}`,
                                  "_blank",
                                  "noreferrer"
                                );
                              } else {
                                window.open(link, "_blank", "noreferrer");
                              }
                              console.log(
                                cannotDownloadPdfAppSetting,
                                "cannotDownloadPdfAppSetting"
                              );
                              console.log(response, "response");
                              console.log(checkDLAttach, "checkDLAttach");
                              console.log(masterATDLFT, "masterATDLFT");
                            }
                          }}
                          style={{ color: "#2769b2" }}
                        >
                          {attachData.attach_file}
                        </p>
                      </div>
                      <div className="detail-DecripAtt">
                        <p>{attachData.description}</p>
                      </div>

                      <div className="detail-mergeAtt">
                        {attachData?.attach_file
                          .toLowerCase()
                          .endsWith("pdf") ? (
                          <div className="set-checkbox">
                            <Checkbox
                              id={idx.toString()}
                              onChange={(e) => {
                                let _listAttach = listFileAttachDetails;
                                _listAttach[idx].is_merge_pdf = e.checked;
                                _listAttach[idx].modified_date = moment(
                                  new Date()
                                ).format("DD/MM/YYYY HH:mm:ss");
                                setListFileAttachDetails([..._listAttach]);
                              }}
                              checked={listFileAttachDetails[idx].is_merge_pdf}
                            ></Checkbox>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {canEditDoc ? (
                        <div className="detail-ActionAtt">
                          <SplitButton
                            model={[
                              {
                                label: "Edit Description",
                                icon: "pi pi-pencil",
                                command: () => {
                                  setIndexState(idx);
                                  setDescriptionRespone(attachData.description);
                                  setVisibleStatus(true);
                                },
                              },
                              {
                                label: "Delete",
                                icon: "pi pi-trash",
                                command: () => {
                                  setIndexState(idx);
                                  setDeleteVisible(true);
                                },
                              },
                            ]}
                            dropdownIcon="pi pi-ellipsis-v"
                          />
                        </div>
                      ) : (
                        listFormNames.ApproverCanEdit === false &&
                        userData.EmployeeId === attachData.actor.EmployeeId && (
                          <div className="detail-ActionAtt">
                            <SplitButton
                              model={[
                                {
                                  label: "Edit Description",
                                  icon: "pi pi-pencil",
                                  command: () => {
                                    setIndexState(idx);
                                    setDescriptionRespone(
                                      attachData.description
                                    );
                                    setVisibleStatus(true);
                                  },
                                },
                                {
                                  label: "Delete",
                                  icon: "pi pi-trash",
                                  command: () => {
                                    setIndexState(idx);
                                    setDeleteVisible(true);
                                  },
                                },
                              ]}
                              dropdownIcon="pi pi-ellipsis-v"
                            />
                          </div>
                        )
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      <ConfirmDialog
        visible={deleteVisible}
        onHide={() => setDeleteVisible(false)}
        message="Are you sure to Delete this File?"
        header="Delete Confirmation"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={deleteFile}
        reject={() => setDeleteVisible(false)}
      />
      {visibleStatus == true && (
        <DescriptionConfigComponent
          visibleStatus={visibleStatus}
          setVisibleStatus={setVisibleStatus}
          Index={indexState}
          description={descriptionRespone}
          listFileAttachDetails={listFileAttachDetails}
          setListFileAttachDetails={setListFileAttachDetails}
        />
      )}
    </div>
  );
};

export default AttachmentComponent;
