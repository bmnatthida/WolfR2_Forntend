import { Button } from "primereact/button";
import React, { useState, useEffect, useRef } from "react";
import { TableInputProps } from "../TableComponent/TableComponent";
import { Form as AntForm } from "antd";
import { Toast } from "primereact/toast";
import "./AttachmentComponent.css";
import { AiOutlineClose } from "react-icons/ai";
import { ConfirmDialog } from "primereact/confirmdialog";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import { Col } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { AttachmentModal } from "./AttachmentModal";

type Props = {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  col?: any;
  colText?: number;
  colAction?: number;
  // statusMemoDetail?: boolean;
  name: string;
  control: any;
  canEditDoc: boolean;
  checkActionPage: string;
  buttonType: string;
};

type InputAttachmentProps = {
  ref?: any;
  template: any;
  value?: any;
  status?: any;
  rowIdx?: number;
  colIdx?: number;
  onChange: (value: any) => void;
  canEditDoc: boolean;
  checkActionPage: string;
  id?: string;
};

export const AttachmentComponent: React.FC<InputAttachmentProps> = ({
  ref,
  rowIdx,
  colIdx,
  template,
  value,
  status,
  onChange,
  id,
  canEditDoc,
  checkActionPage,
  ...props
}: InputAttachmentProps) => {
  const toast = useRef<any>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [checkHasValue, setCheckHasValue] = useState<boolean>(false);
  const [link, setLink] = useState<any>();
  const [nameFile, setNameFile] = useState<string>("");
  const _userData = JSON.parse(window.localStorage.getItem("userData") || "");
  const [visibleConfirmDialog, setVisibleConfirmDialog] =
    useState<boolean>(false);
  const [selected, setSelected] = useState<any>();
  const [uploadType, setUploadType] = useState<string>("");
  const _sharepointSiteURL = _userData.SharepointSiteURL;

  useEffect(() => {
    console.log("att=>", { value });

    deFaultValue();
  }, [value]);

  const deFaultValue = () => {
    if (value === "" || value === undefined || value === null) {
      setCheckHasValue(false);
    } else {
      const [nameFile, linkFile] = value.split("|");
      const linkUrl = linkFile;

      setLink(linkUrl);
      setNameFile(nameFile);
      setCheckHasValue(true);
    }
  };

  // function openWindow() {
  // var pathArray = link.split("/");
  // console.log("at=>link", link);
  // console.log("at=>pathArray", pathArray);
  //   console.log({ link });
  //   const _baseUrl = window.location.hostname;

  //   const TmpUrl =
  //     process.env.NODE_ENV === "development"
  //       ? "qar2.wolfapprove.com"
  //       : _baseUrl;
  //   console.log({ ddd: `https://${TmpUrl}/${link}` });

  //   window.open(`https://${TmpUrl}/${link}`, "_blank", "noreferrer");
  // }
  function openWindow() {
    var pathArray = link.split("/");
    const _link = link
      ? link.charAt(0) !== "/" && !_sharepointSiteURL
        ? "/" + link
        : link
      : "";

    const protocol = window.location.protocol;
    if (_sharepointSiteURL) {
      if (_link.startsWith(_sharepointSiteURL)) {
        console.log("att=>", _link);

        window.open(`${_link}`, "_blank", "noreferrer");
      } else {
        console.log("att=>", `${_sharepointSiteURL}${_link}`);

        window.open(`${_sharepointSiteURL}${_link}`, "_blank", "noreferrer");
      }
    } else if (_userData.TinyURL) {
      if (
        _link.includes("www") ||
        _link.includes(".com") ||
        _link.includes(".tv") ||
        _link.includes(".net") ||
        _link.includes("https") ||
        _link.includes("http") ||
        _link.includes(".com") ||
        _link.includes(".co.th")
      ) {
        if (_link.includes("https")) {
          window.open(
            `https://${_link.replaceAll("https://", "")}`,
            "_blank",
            "noreferrer"
          );
        } else if (_link.includes("http")) {
          window.open(
            `http://${_link.replaceAll("http://", "")}`,
            "_blank",
            "noreferrer"
          );
        } else {
          window.open(`https://${_link}`, "_blank", "noreferrer");
        }
      } else {
        window.open(
          `${protocol}//${_userData.TinyURL}${_link}`,
          "_blank",
          "noreferrer"
        );
      }
    } else if (!_userData.TinyURL) {
      window.open(`${_link}`, "_blank", "noreferrer");
    }
  }

  const confirmUploadDialog = () => {
    return (
      <>
        <ConfirmDialog
          visible={visibleConfirmDialog}
          onHide={() => setVisibleConfirmDialog(false)}
          message="Are you sure you want to proceed?"
          header="Confirmation"
          icon="pi pi-exclamation-triangle"
          position="top"
          accept={acceptUpload}
          acceptClassName="p-button p-component p-button-raised p-button-success"
          rejectClassName="p-button p-component p-button-outlined p-button-danger"
          draggable={false}
        />
      </>
    );
  };

  const acceptUpload = () => {
    if (uploadType === "Attach file") {
      setCheckHasValue(true);
      setIsModalVisible(false);
    } else if (uploadType === "Attach link") {
      setCheckHasValue(true);
      setIsModalVisible(false);
    } else {
      setCheckHasValue(false);
      setSelected(undefined);
      setLink("");
      setNameFile("");
      setUploadType("Attach file");
      onChange("");
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <Toast ref={toast}></Toast>
      {confirmUploadDialog()}
      <div className="set-button-close">
        <Button
          // fixed issue readonly
          disabled={!canEditDoc || template.attribute.readonly === "Y"}
          //  id
          id={rowIdx + "_" + colIdx + "_" + template.label}
          label={checkHasValue ? nameFile : "Upload"}
          onClick={() => {
            if (checkHasValue) {
              openWindow();
            } else {
              setIsModalVisible(true);
            }
          }}
          className="r"
          type="button"
          style={{
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            borderTopRightRadius:
              checkHasValue && canEditDoc && template.attribute.readonly
                ? undefined
                : "6px",
            borderBottomRightRadius:
              checkHasValue && canEditDoc && template.attribute.readonly
                ? undefined
                : "6px",
            backgroundColor: "rgb(40, 47, 106)",
            border: "1px solid rgb(40, 47, 106)",
            boxShadow: "none",
            width: "100%",
            height: "38px",
          }}
        />
        {checkHasValue && (
          <div
            className="border-icon"
            style={{
              display:
                status || !canEditDoc || template.attribute.readonly === "Y"
                  ? "none"
                  : "",
            }}
            onClick={() => {
              setUploadType("Clear");

              setVisibleConfirmDialog(true);
            }}
          >
            <AiOutlineClose />
          </div>
        )}
      </div>
      <AttachmentModal
        visibleDialog={isModalVisible}
        setVisibleDialog={setIsModalVisible}
        setCheckHasValue={setCheckHasValue}
        toast={toast}
        template={template}
        onChange={onChange}
        nameFile={nameFile}
        setNameFile={setNameFile}
        link={link}
        setLink={setLink}
        SharepointSiteURL={_userData.SharepointSiteURL}
        TinyURL={_userData.TinyURL}
        selected={selected}
        setSelected={setSelected}
        visibleConfirmDialog={visibleConfirmDialog}
        setVisibleConfirmDialog={setVisibleConfirmDialog}
        value={uploadType}
        setValue={setUploadType}
      />
    </>
  );
};

export const AttachmentControlComponent: React.FC<Props> = ({
  colIdx,
  rowIdx,
  control,
  name,
  data,
  template,
  col,
  colAction,
  colText,
  canEditDoc,
  checkActionPage,
  buttonType,
  ...props
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required:
            template.attribute.require === "Y" &&
            buttonType !== "draft" &&
            buttonType !== "cancel"
              ? true
              : false,
        }}
        render={({
          field: { onChange, value, onBlur, name, ref },
          formState: { errors, isSubmitted },
        }) => (
          <>
            <ComponentLabel
              // renderInTable={props.renderInTable}
              col={col}
              colText={colText}
              rowIdx={rowIdx}
              colIdx={rowIdx}
              template={template}
            />
            <Col
              sm={col === undefined ? 12 : 12}
              md={col === undefined ? colAction : 12}
              xs={col === undefined ? 12 : 12}
              xl={col === undefined ? colAction : 12}
              className={"padding-controller"}
            >
              <div className={`input-component-container`}>
                <AttachmentComponent
                  {...{ canEditDoc, checkActionPage }}
                  template={template}
                  onChange={onChange}
                  value={value}
                />
              </div>
            </Col>
          </>
        )}
      />
    </>
  );
};

export const AttachmentTableComponent: React.FC<TableInputProps> = ({
  name,
  template,
  saveFunc,
  inputRef,
  isEditing,
  onEdit,
  value,
  children,
  canEditDoc,
  checkActionPage,
  buttonType,

  ...props
}) => {
  if (!isEditing) {
    return (
      <div style={{ width: "100%" }} onMouseEnter={onEdit}>
        <AttachmentComponent
          {...{ canEditDoc, checkActionPage }}
          template={template}
          onChange={saveFunc}
          value={children[1]}
        />
      </div>
    );
  }
  return (
    <>
      <AntForm.Item
        style={{ margin: 0 }}
        name={name}
        normalize={(value: any) => value}
        rules={[
          {
            required:
              template.attribute.require === "Y" &&
              buttonType !== "draft" &&
              buttonType !== "cancel"
                ? true
                : false,
            message: `${template.label} is required.`,
          },
        ]}
      >
        <AttachmentComponent
          {...{ canEditDoc, checkActionPage }}
          template={template}
          onChange={saveFunc}
          value={value}
        />
      </AntForm.Item>
    </>
  );
};
