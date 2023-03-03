import React, { useState, useRef, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import AutoCompleteComponents from "../../AutoCompleteComponents/AutoCompleteComponents";
import { ButtonComponents } from "../../ButtonComponents/ButtonComponents";
import { CheckboxCpmponents } from "../../CheckboxCpmponents/CheckboxCpmponents";
import { DropdownComponents } from "../../DropdownComponents/DropdownComponents";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import "./EmailTemplateDetail.css";
// import "tinymce/icons/default";
// import "tinymce/themes/silver";
// import "tinymce/plugins/paste";
// import "tinymce/plugins/link";
// import "tinymce/plugins/table";
// import "tinymce/plugins/fullscreen";
// import "tinymce/plugins/autolink";
// import "tinymce/plugins/autosave";
// import "tinymce/plugins/charmap";
// import "tinymce/plugins/image";
// import "tinymce/plugins/imagetools";
// import "tinymce/plugins/textpattern";
// import "tinymce/plugins/code";
// import "tinymce/plugins/advlist";
// import "tinymce/plugins/lists";
// import "tinymce/plugins/print";
// import "tinymce/plugins/preview";
// import "tinymce/plugins/hr";
// import "tinymce/plugins/anchor";
// import "tinymce/plugins/pagebreak";
// import "tinymce/plugins/searchreplace";
// import "tinymce/plugins/wordcount";
// import "tinymce/plugins/insertdatetime";
// import "tinymce/plugins/media";
// import "tinymce/plugins/nonbreaking";
// import "tinymce/plugins/save";
// import "tinymce/plugins/contextmenu";
// import "tinymce/plugins/directionality";
// import "tinymce/plugins/template";
// import "tinymce/plugins/textcolor";
// import "tinymce/plugins/colorpicker";
// import "tinymce/skins/ui/oxide/skin.min.css";
// import "tinymce/skins/ui/oxide/content.min.css";
// import "./TemplateModal.css";
import { Editor } from "@tinymce/tinymce-react";
// import { Editor } from "primereact/editor";

import { Toast } from "primereact/toast";

import { UploadTinyMce } from "../../../Services/UploadFileService";
import { getAllEmailTemplate } from "../../../Services/EmailTemplateService";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
import { useUserContext } from "../../../../Context/UserContext";
interface Props {
  clickSelectProps: any;
  dataProps: any;
  setDataProps: any;
}
// import { Editor } from "primereact/editor";
export const EmailTemplateDetail = (props: Props) => {
  const [userData, setUserData] = useUserContext();
  var _userData = JSON.parse(window.localStorage.getItem("userData") || "");
  let _sharepointSiteURL = _userData.SharepointSiteURL;
  const _tinyURL = _userData.TinyURL;
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    _EmailTemplate();
    _clickSelectText();
  }, [props.clickSelectProps]);
  useEffect(() => {
    console.log("props.dataProps", props.dataProps);
  }, [props.dataProps]);

  function _Dropdown(data: any, key: any) {
    if (data === undefined || data === null) {
    } else {
      props.setDataProps((prevState: any) => ({
        ...prevState,
        [key]: data[key],
      }));
    }
  }
  function _CheckboxCpmponents(data: any, key: any) {
    props.setDataProps((prevState: any) => ({
      ...prevState,
      [key]: data,
    }));
  }
  function _InputText(data: any, key: any) {
    props.setDataProps((prevState: any) => ({
      ...prevState,
      EmailSubject: data,
    }));
  }
  async function _EmailTemplate() {
    let _getEmailTemplate = await getAllEmailTemplate();
    console.log("_getEmailTemplate", _getEmailTemplate);
  }
  function _clickSelectText() {
    let _textEditor = props.dataProps.EmailBody;
    let _clickSelectProps =
      props.clickSelectProps === undefined ? "" : props.clickSelectProps;
    let _textEditoPropsr = _textEditor + _clickSelectProps;

    props.setDataProps((prevState: any) => ({
      ...prevState,
      EmailBody: _textEditoPropsr,
    }));
  }

  const handleEditorChange = (content: any, editor?: any) => {
    props.setDataProps((prevState: any) => ({
      ...prevState,
      EmailBody: content,
    }));
  };

  return (
    <>
      <Toast ref={toast}></Toast>
      <Row className="0">
        <Col xs={12} md={7} lg={9} xl={9} style={{ alignItems: "center" }}>
          <p className="Col-text-header-Inform">Email Template</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12} xl={12}>
          <p className="EmailTemplateDetail-line-border"></p>
        </Col>
      </Row>
      <Row className="gutter-row-Reference">
        <Col xs={12} sm={1} xl={1} className="Col-display-align-items">
          <TextHeaderComponents textHeaderProps={"To :"} />
        </Col>
        <Col xs={12} sm={5} xl={5}>
          <DropdownComponents
            placeholderProps={
              props.dataProps === undefined || props.dataProps === null
                ? "-- Please Select --"
                : props.dataProps.EmailTo !== null
                ? props.dataProps.EmailTo.length !== 0
                  ? props.dataProps.EmailTo
                  : "-- Please Select --"
                : "-- Please Select --"
            }
            styleProps={{
              width: "100%",
              borderRadius: "6px 6px 6px 6px",
            }}
            optionLabelProps="EmailTo"
            optionsProps={[
              { EmailTo: "Requester" },
              { EmailTo: "Approve" },
              { EmailTo: "Advisor" },
              { EmailTo: "Creator" },
            ]}
            onChangeProps={_Dropdown}
            valueProps={props.dataProps.EmailTo}
            keyProps={"EmailTo"}
          />
        </Col>
        <Col xs={12} sm={1} xl={1} className="Col-display-align-items">
          <TextHeaderComponents textHeaderProps={"Form Status :"} />
        </Col>
        <Col xs={12} sm={5} xl={5}>
          <DropdownComponents
            placeholderProps={
              props.dataProps !== undefined
                ? props.dataProps.FormState.length !== 0
                  ? props.dataProps.FormState
                  : "-- Please Select --"
                : "-- Please Select --"
            }
            styleProps={{
              width: "100%",
              borderRadius: "6px 6px 6px 6px",
            }}
            optionLabelProps="FormState"
            optionsProps={[
              { FormState: "Wait for Approve" },
              { FormState: "Wait for Comment" },
              { FormState: "Wait for Requestor" },
              { FormState: "ReplyComment" },
              { FormState: "Completed" },
              { FormState: "Rework" },
              { FormState: "Reject" },
            ]}
            onChangeProps={_Dropdown}
            valueProps={props.dataProps.FormState}
            keyProps={"FormState"}
          />
        </Col>
      </Row>
      <Row className="gutter-row-Reference">
        <Col xs={12} sm={1} xl={1} className="Col-display-align-items">
          <TextHeaderComponents textHeaderProps={"CC :"} />
        </Col>
        <Col xs={12} sm={5} xl={5}>
          <DropdownComponents
            placeholderProps={
              props.dataProps === undefined || props.dataProps === null
                ? "-- Please Select --"
                : props.dataProps.EmailCC !== null
                ? props.dataProps.EmailCC.length !== 0
                  ? props.dataProps.EmailCC
                  : "-- Please Select --"
                : "-- Please Select --"
            }
            styleProps={{
              width: "100%",
              borderRadius: "6px 6px 6px 6px",
            }}
            optionLabelProps="EmailCC"
            optionsProps={[
              { EmailCC: "Requester" },
              { EmailCC: "Approve" },
              { EmailCC: "Advisor" },
              { EmailCC: "Creator" },
            ]}
            onChangeProps={_Dropdown}
            valueProps={props.dataProps.EmailCC}
            keyProps={"EmailCC"}
          />
        </Col>
        <Col xs={12} sm={1} xl={1} className="Col-display-align-items">
          <TextHeaderComponents textHeaderProps={"Active :"} />
        </Col>
        <Col xs={12} sm={5} xl={5} className="Col-display-align-items">
          <CheckboxCpmponents
            checkedProps={props.dataProps.IsActive}
            onChangeProps={_CheckboxCpmponents}
            keyProps={"IsActive"}
          />
        </Col>
      </Row>
      <Row className="gutter-row-Reference">
        <Col xs={12} sm={1} xl={1} className="Col-display-align-items">
          <TextHeaderComponents textHeaderProps={"Subject :"} />
        </Col>
        <Col
          xs={12}
          sm={11}
          xl={11}
          className="informationComponents-media-FormCategory"
        >
          <div style={{ paddingBottom: "3px" }}>
            <InputTextComponents
              setStyleProps={{ height: 38 }}
              setClassNameProps={"information-inputTexta-width"}
              placeholderProps={
                props.dataProps.EmailSubject.length === 0
                  ? "Subject"
                  : props.dataProps.EmailSubject
              }
              keyProps={"EmailSubject"}
              valueProps={props.dataProps.EmailSubject}
              onChangeProps={_InputText}
            />
          </div>
        </Col>
      </Row>

      <Row className="gutter-row-Reference">
        <Col xs={12} sm={12} xl={12} className="Col-display-align-items">
          <div className="Editor-width">
            <Editor
              onInit={() => {
                setLoading(false);
              }}
              init={{
                // selector: "textarea#file-picker",
                statusbar: false,
                paste_data_images: false,
                menubar: false,
                content_css: false,
                // auto_focus: "elm1",
                height: "70vh",
                fullscreen_native: true,
                remove_script_host: false,
                relative_urls: false,
                image_title: true,
                automatic_uploads: true,
                image_sourcetab: false,
                image_advtab: false,
                plugins: [
                  "image code",
                  "advlist autolink lists image charmap print preview hr anchor pagebreak",
                  "searchreplace wordcount  code fullscreen",
                  "insertdatetime media nonbreaking save table contextmenu directionality",
                  "emoticons template paste textcolor colorpicker textpattern imagetools  image",
                  "link",
                ],
                toolbar1:
                  "insertfile undo redo | styleselect | fontselect | fontsizeselect | bold italic underline |  forecolor backcolor | alignleft aligncenter alignright alignjustify | searchreplace | bullist numlist outdent indent | pagebreak | link table | image | fullscreen",
                fontsize_formats:
                  "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 36pt",
                font_formats:
                  "Angsana New=angsana new,times;" +
                  "Arial=arial,helvetica,sans-serif;" +
                  "Arial Black=arial black,avant garde;" +
                  "Book Antiqua=book antiqua,palatino;" +
                  "Comic Sans MS=comic sans ms,sans-serif;" +
                  "Courier New=courier new,courier;" +
                  "DB Sathorn X=DB Sathorn X;" +
                  "Georgia=georgia,palatino;" +
                  "Helvetica=helvetica;" +
                  "Impact=impact,chicago;" +
                  "Symbol=symbol;" +
                  "Tahoma=tahoma,arial,helvetica,sans-serif;" +
                  "Terminal=terminal,monaco;" +
                  "Times New Roman=times new roman,times;" +
                  "Trebuchet MS=trebuchet ms,geneva;" +
                  "Verdana=verdana,geneva;" +
                  "Webdings=webdings;" +
                  "TH Sarabun=sarabun;" +
                  "Leelawadee=Leelawadee;" +
                  "Wingdings=wingdings,zapf dingbats",
                content_style:
                  "@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap'); body { font-family: 'Sarabun', sans-serif; }" +
                  "@import url('https://fonts.cdnfonts.com/css/leelawadee'); body { font-family: 'Leelawadee', sans-serif; }",

                images_upload_handler: async function (
                  blobInfo,
                  success,
                  failure
                ) {
                  var file = new File([blobInfo.blob()], blobInfo.filename(), {
                    lastModified: Date.now(),
                  });
                  const formData = new FormData();
                  const protocol = window.location.protocol;
                  formData.append("file", file);
                  formData.append("Doclib", "TempAttachment");
                  formData.append("docSet", "TinyImages");
                  formData.append("fileDesc", "");
                  formData.append("actorID", userData.EmployeeId.toString());
                  var response: any = await UploadTinyMce(formData);
                  console.log(response, "response");
                  if (response.data.result) {
                    if (_sharepointSiteURL) {
                      _sharepointSiteURL =
                        _sharepointSiteURL.charAt(0) === "/"
                          ? _sharepointSiteURL.substring(1)
                          : _sharepointSiteURL;
                      success(_sharepointSiteURL + "/" + response.data.pathUrl);
                    } else {
                      success(
                        `${protocol}//` + _tinyURL + response.data.pathUrl
                      );
                    }
                  } else {
                    failure(response.data.pathUrl);
                  }
                },
              }}
              value={props.dataProps.EmailBody}
              onEditorChange={handleEditorChange}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};
