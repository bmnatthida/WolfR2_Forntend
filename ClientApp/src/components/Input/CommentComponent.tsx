import { InputTextarea } from "primereact/inputtextarea";
import React, { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import "./CommentComponent.css";
import { Dialog } from "primereact/dialog";
import { BiCommentDetail } from "react-icons/bi";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { GetAllEmployee } from "../../Services/EmployeeService";
import { Col, Row } from "react-bootstrap";
// import { Editor } from "primereact/editor";\
import "tinymce/tinymce";
// import tinymce from "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/table";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap";
import "tinymce/plugins/image";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/code";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";
import "tinymce/plugins/print";
import "tinymce/plugins/preview";
import "tinymce/plugins/hr";
import "tinymce/plugins/anchor";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/save";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/directionality";
import "tinymce/plugins/template";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/colorpicker";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
// import "./EditorComponent.css";
import { Editor } from "@tinymce/tinymce-react";
import useAlert from "../../hooks/useAlert";
interface Props {
  buttonType: any;
  commentStatus: boolean;
  setCommentStatus: any;
  require: boolean;
  onUpdate?: (
    // data: any,
    comment?: any,
    waiting_for?: string,
    waiting_for_id?: number
  ) => any;
  handleSubmit?: any;
  onSubmit?: any;
  pageName: any;
}

export default function CommentComponent(props: Props) {
  const { toggleAlert } = useAlert();
  const [comment, setComment] = useState<string>("");
  const [placeholder, setPlaceholder] = useState("แสดงความคิดเห็น...");
  const [isInvalid, setInvalid] = useState(true);
  const [dataEmployeeList, setDataEmployeeList] = useState<any>();
  const [dataEmployee, setDataEmployee] = useState<any>();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "");
  const toast = useRef<any>();
  useEffect(() => {
    fetchDataEmployee();
  }, []);
  async function fetchDataEmployee() {
    let _dataEmployee = await GetAllEmployee();
    setDataEmployeeList(_dataEmployee);
    setSearchData(_dataEmployee);
    setIsLoading(false);
    console.log(_dataEmployee, "_dataEmployee");
  }
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    const dataEmp = dataEmployeeList;
    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      if (
        data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        userData.employeeData.Lang === "EN"
          ? data.NameEn?.toLowerCase().indexOf(value?.toLowerCase()) !== -1
          : data.NameTh?.toLowerCase().indexOf(value?.toLowerCase()) !== -1 ||
            data.PositionNameEn.toLowerCase().indexOf(value.toLowerCase()) !==
              -1 ||
            data.DepartmentNameEn.toLowerCase().indexOf(value.toLowerCase()) !==
              -1
      ) {
        return true;
      }
    });
    setSearchData([...data]);
  };

  function showModal() {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    setDialogVisible(!isDialogVisible);
  }

  const showError = () => {
    toggleAlert({
      description: `Please insert comment.`,
      message: `Comment field warning.`,
      type: "warning",
    });
  };
  const EmployeeDialog = () => {
    return (
      <>
        <Dialog
          header={renderHeader}
          visible={isDialogVisible}
          style={{ width: "60vw", borderRadius: "16px" }}
          onHide={showModal}
          draggable={false}
          resizable={false}
          closable={true}
          blockScroll
        >
          <DataTable
            loading={isLoading}
            paginator
            rows={5}
            value={searchData}
            selectionMode="single"
            dataKey="id"
            responsiveLayout="scroll"
            onRowSelect={onRowSelect}
          >
            <Column
              field="EmployeeCode"
              header={
                <tr>
                  <th>
                    <p className="row headtext">EmployeeCode</p>
                    <p className="row subtext">รหัสพนักงาน</p>
                  </th>
                </tr>
              }
            ></Column>
            <Column
              field={userData.employeeData.Lang === "EN" ? "NameEn" : "NameTh"}
              header={
                <tr>
                  <th>
                    <p className="row headtext">Name</p>
                    <p className="row subtext">ชื่อ</p>
                  </th>
                </tr>
              }
            ></Column>
            <Column
              field={
                userData.employeeData.Lang === "EN"
                  ? "PositionNameEn"
                  : "PositionNameTh"
              }
              header={
                <tr>
                  <th>
                    <p className="row headtext">Position</p>
                    <p className="row subtext">ตำแหน่ง</p>
                  </th>
                </tr>
              }
            ></Column>
            <Column
              field={
                userData.employeeData.Lang === "EN"
                  ? "DepartmentNameEn"
                  : "DepartmentNameTh"
              }
              header={
                <tr>
                  <th>
                    <p className="row headtext">Department</p>
                    <p className="row subtext">หน่วยงาน</p>
                  </th>
                </tr>
              }
            ></Column>
          </DataTable>
        </Dialog>
      </>
    );
  };
  const onRowSelect = (event: any) => {
    setVisibleConfirmDialog(true);
    setDataEmployee(event);
  };
  const confirmUploadDialog = () => {
    return (
      <>
        <ConfirmDialog
          visible={visibleConfirmDialog}
          onHide={() => setVisibleConfirmDialog(false)}
          message="Do you want to confirm this action?"
          header="Confirmation"
          icon="p-confirm-dialog-icon pi pi-info-circle"
          acceptClassName="p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel"
          accept={() => {
            sentToMemo(
              comment,
              dataEmployee.data.EmployeeId,
              dataEmployee.data.NameEn
            );
          }}
          reject={() => {
            setVisibleConfirmDialog(false);
            setDataEmployee(null);
          }}
          draggable={false}
          resizable={false}
        />
      </>
    );
  };
  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <span className="p-input-icon-left set-span-search-dialog ">
          <i className="pi pi-search" />
          <InputText
            className="set-input-search-dialog"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };

  const HeaderDialogComment = () => {
    return (
      <div className="comment-header">
        <BiCommentDetail /> <p className="headtext-comment">Comment</p>
        {props.require === true && (
          <p className="headtext-form text-Is-require set-font-require-comment">
            *
          </p>
        )}
      </div>
    );
  };
  const Footer = () => {
    return (
      <div className="Button-line memo-button-padding">
        <Row>
          <Col xs={6} sm={6} xl={6}>
            <button
              className="Cancel-Button"
              onClick={() => {
                props.setCommentStatus(false);
                setComment("");
              }}
            >
              Cancel
            </button>
          </Col>
          <Col xs={6} sm={6} xl={6}>
            <button
              className="Confirm-Button"
              onClick={() => {
                ConfirmCheck();
              }}
            >
              Confirm
            </button>
          </Col>
        </Row>
      </div>
    );
  };

  function ConfirmCheck() {
    setSearchData(dataEmployeeList);
    if (
      props.buttonType === "submit" ||
      props.buttonType === "draft" ||
      props.buttonType === "approve"
    ) {
      setInvalid(true);
      sentToMemo(comment);
      props.setCommentStatus(false);
    } else if (
      props.buttonType === "cancel" ||
      props.buttonType === "recall" ||
      props.buttonType === "rework" ||
      props.buttonType === "reject" ||
      props.buttonType === "return" ||
      props.buttonType === "reply"
    ) {
      if (!comment) {
        setPlaceholder("กรุณากรอกความคิดเห็นก่อนยืนยัน..");
        setInvalid(false);
        showError();
      } else {
        sentToMemo(comment);
      }
    } else if (
      props.buttonType === "assign" ||
      props.buttonType === "request comment"
    ) {
      if (!comment) {
        setPlaceholder("กรุณากรอกความคิดเห็นก่อนยืนยัน..");
        setInvalid(false);
        showError();
      } else {
        showModal();
      }
    }
  }
  const sentToMemo = (
    inputComment: string,
    waiting_for_id?: number,
    waiting_for?: string
  ) => {
    console.log({ inputComment });

    if (props.pageName.trim() === "WorkList" && props.onUpdate) {
      props.onUpdate(inputComment, waiting_for, waiting_for_id);

      // props.handleSubmit((e: any) => {
      //   props.onSubmit(e, {
      //     buttonType: props.buttonType,
      //     inputComment: inputComment,
      //     waitingFor: waiting_for,
      //     waitingForId: waiting_for_id,
      //   });
      // })();
    } else if (props.pageName.trim() === "Request") {
      console.log("request=>", {
        buttonType: props.buttonType,
        inputComment: inputComment,
        waitingFor: waiting_for,
        waitingForId: waiting_for_id,
      });

      props.handleSubmit((e: any) => {
        console.log("request=>e", e);
        props.onSubmit(e, {
          buttonType: props.buttonType,
          inputComment: inputComment,
          waitingFor: waiting_for,
          waitingForId: waiting_for_id,
        });
      })();
    }
  };
  const headerEditor = () => {
    return <span className="ql-formats"></span>;
  };

  return (
    <>
      <Dialog
        className="commment-dialog-main"
        header={HeaderDialogComment}
        visible={props.commentStatus}
        style={{ width: "80vw", borderRadius: "16px", maxWidth: "1000px" }}
        dismissableMask
        draggable={false}
        resizable={false}
        closable={false}
        onHide={() => props.setCommentStatus(false)}
        footer={Footer}
      >
        <Toast ref={toast} />
        <div
          className="main-box-comment p-inputgroup  set-width-100-editor-css"
          onClick={() => console.log(props.buttonType)}
        >
          <Editor
            // apiKey={"85fg9kfbphp60afutbv4lcu2qfflxsprmzzidaqt9ctbxvkd"}
            onInit={() => {
              setIsLoading(false);
            }}
            tinymceScriptSrc={
              process.env.PUBLIC_URL + "/tinymce/js/tinymce/tinymce.min.js"
            }
            init={{
              // selector: "textarea#file-picker",
              statusbar: false,
              paste_data_images: false,
              menubar: "",
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
                "template textcolor colorpicker textpattern imagetools image paste",
                "link",
              ],
              toolbar: "",
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
            }}
            value={comment}
            onEditorChange={(content: any, editor: any) => {
              console.log({ content });

              setComment(content);
              // handleEditorChange(content, editor, onChange);
            }}
          />
        </div>
      </Dialog>
      {EmployeeDialog()}
      {confirmUploadDialog()}
    </>
  );
}
