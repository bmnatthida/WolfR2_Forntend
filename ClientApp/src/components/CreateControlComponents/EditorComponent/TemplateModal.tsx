import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
// import "tinymce/tinymce";
// import tinymce from "tinymce/tinymce";
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
import "./TemplateModal.css";
import { Editor } from "@tinymce/tinymce-react";
import { ProgressSpinner } from "primereact/progressspinner";
import { UploadTinyMce } from "../../../Services/UploadFileService";
import { IoSaveOutline } from "react-icons/io5";
import { BsX } from "react-icons/bs";
import { useUserContext } from "../../../Context/UserContext";
interface Props {
  setViewModal: any;
  viewModal: any;
  data: any;
  setRichText: any;
}

const TemplateModal = (props: Props) => {
  const initialValues = {
    value: null,
  };
  const [loading, setLoading] = useState(true);
  const [contentEditor, setContentEditor] = useState(
    props.data?.value == null ? initialValues : props.data
  );
  const [userData, setUserData] = useUserContext();
  var _userData = JSON.parse(window.localStorage.getItem("userData") || "");
  let _sharepointSiteURL = _userData.SharepointSiteURL;
  const _tinyURL = _userData.TinyURL;
  useEffect(() => {
    if (!props.data?.value) {
      props.setRichText(initialValues);
    } else {
      props.data.value = props.data.value
        .replace(/\{/g, "<")
        .replace(/\}/g, ">")
        .replace(/\'/g, "");
      props.setRichText((prevState: any) => ({
        ...prevState,
        value: props.data.value,
      }));
    }
  }, []);
  const handleEditorChange = (content: any, editor: any) => {
    setContentEditor((prevState: any) => ({
      ...prevState,
      value: content,
    }));
    props.setRichText((prevState: any) => ({
      ...prevState,
      value: content,
    }));
  };
  const footer = (
    <div>
      <button
        type="button"
        onClick={() => {
          props.setViewModal(false);
        }}
        className="hover-color-css-blue set-css-button-save-in-modal"
      >
        <IoSaveOutline /> Save
      </button>
    </div>
  );

  return (
    <Dialog
      header="Template"
      visible={props.viewModal}
      style={{ width: "70.20833333333333vw", borderRadius: "16px" }}
      onHide={() => props.setViewModal(false)}
      breakpoints={{ "960px": "75vw" }}
      blockScroll
      draggable={false}
      resizable={false}
      footer={footer}
    >
      <div className="row">
        <div className="col-sm-12">
          {loading && (
            <div className="spinner-load-core-spinner-tiny-mce">
              <ProgressSpinner className="set-spinner-tiny-mce" />
            </div>
          )}
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
              height: 300,
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
                    success(`${protocol}//` + _tinyURL + response.data.pathUrl);
                  }
                } else {
                  failure(response.data.pathUrl);
                }
              },
            }}
            value={contentEditor.value == null ? "" : contentEditor.value}
            onEditorChange={handleEditorChange}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default TemplateModal;
