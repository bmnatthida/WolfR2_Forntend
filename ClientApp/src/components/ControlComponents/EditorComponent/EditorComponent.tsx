import React, { useEffect, useState } from "react";
// import "tinymce/tinymce";
// // import tinymce from "tinymce/tinymce";
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
import "./EditorComponent.css";
import { Editor } from "@tinymce/tinymce-react";
import { ProgressSpinner } from "primereact/progressspinner";
import { UploadTinyMce } from "../../../Services/UploadFileService";
import { Controller } from "react-hook-form";
import ComponentLabel from "../ComponentLabel";
import { Col, Row } from "react-bootstrap";
import { useUserContext } from "../../../Context/UserContext";

interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  colText: any;
  col?: any;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  errorValid?: any;
  statusMemoDetail?: boolean;
  name: string;
  control: any;
  buttonType: any;
  canEditDoc: boolean;
  colAction: any;
}

export const EditorComponent = (props: Props) => {
  const initialValues = {
    value: null,
  };
  const [contentEditor, setContentEditor] = useState(
    !props.data.value ? initialValues : props.data
  );
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useUserContext();
  var _userData = JSON.parse(window.localStorage.getItem("userData") || "");
  const _sharepointSiteURL = _userData.SharepointSiteURL;
  const _tinyURL = _userData.TinyURL;
  async function defaultValue() {
    if (props.data.value) {
      props.data.value = props.data.value
        .replace(/\{/g, "<")
        .replace(/\}/g, ">")
        .replace(/\'/g, "");
      setContentEditor((prevState: any) => ({
        ...prevState,
        value: props.data.value,
      }));
    } else {
      props.data.value = "";
    }
  }
  const handleEditorChange = (content: any, editor: any, onChange: any) => {
    onChange(content);
  };
  function convertHtml(_comment: any) {
    return (
      <div
        style={{ padding: "0.8rem 5rem" }}
        dangerouslySetInnerHTML={{ __html: _comment }}
      />
    );
  }
  return (
    <Controller
      render={({
        field: { onChange, value, onBlur, name, ref },
        formState: { errors, isSubmitted },
      }) => {
        const _value =
          value?.replace(/\{/g, "<").replace(/\}/g, ">").replace(/\'/g, "") ||
          "";
        return (
          <>
            <Col
              sm={props.col === undefined ? 12 : 12}
              md={props.col === undefined ? props.colAction : 12}
              xs={props.col === undefined ? 12 : 12}
              xl={props.col === undefined ? props.colAction : 12}
              className={`padding-controller ${
                isSubmitted &&
                errors?.items &&
                errors?.items[props.rowIdx] &&
                errors?.items[props.rowIdx].layout[props.colIdx]
                  ? "editor-invalid"
                  : ""
              } ${
                props.template.attribute.readonly == "Y" || !props.canEditDoc
                  ? "display-none-editor"
                  : ""
              }`}
            >
              <Editor
                disabled={
                  props.template.attribute.readonly == "Y" || !props.canEditDoc
                }
                // apiKey={"85fg9kfbphp60afutbv4lcu2qfflxsprmzzidaqt9ctbxvkd"}
                tinymceScriptSrc={
                  process.env.PUBLIC_URL + "/tinymce/js/tinymce/tinymce.min.js"
                }
                init={{
                  statusbar: false,
                  paste_data_images: false,
                  menubar: "edit",
                  content_css: true,
                  object_resizing: true,
                  // auto_focus: "elm1",
                  default_link_target: "_blank",
                  height: 117 + Number(props.template.height),
                  fullscreen_native: true,
                  remove_script_host: false,
                  relative_urls: false,
                  image_title: true,
                  automatic_uploads: true,
                  image_sourcetab: false,
                  image_advtab: false,
                  plugins: [
                    "image code",
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount  code fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "template textcolor colorpicker textpattern imagetools image paste",
                  ],
                  toolbar: "paste pastetext",
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
                    var file = new File(
                      [blobInfo.blob()],
                      blobInfo.filename(),
                      {
                        lastModified: Date.now(),
                      }
                    );
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
                        success(
                          _sharepointSiteURL + "/" + response.data.pathUrl
                        );
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
                value={_value}
                onEditorChange={(content: any, editor: any) => {
                  handleEditorChange(content, editor, onChange);
                }}
              />
            </Col>
          </>
        );
      }}
      name={props.name}
      rules={{
        required:
          props.template.attribute.require !== "" &&
          props.template.attribute.require === "Y" &&
          props.buttonType !== "draft" &&
          props.buttonType !== "cancel"
            ? true
            : false,
      }}
      control={props.control}
    />
  );
};
