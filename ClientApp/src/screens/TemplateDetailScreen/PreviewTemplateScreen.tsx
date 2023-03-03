import { Button, Popover } from "antd";
import { Toast } from "primereact/toast";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { MemoSingleButton } from "../../components/MemoButton/MemoSingleButton";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { IListFormNameModel } from "../../IRequestModel/IListFormNameModel";
import {
  ActionMemoPage,
  GetButtonMemoByMemoId,
  GetMemoDetailById,
} from "../../Services/MemoService";
import { MenuOutlined } from "@ant-design/icons";
import RequestSideBarElement from "../Request/RequestSideBarElement";
import { RequestorComponent } from "../../components/RequestComponents/RequestorComponent/RequestorComponent";

import LineApprovalsComponent from "../../components/RequestComponents/LineApprovalsComponent/LineApprovalsComponent";
import AttachmentComponent from "../../components/RequestComponents/AttachmentComponent/AttachmentComponent";
import { HistoryComponent } from "../../components/RequestComponents/HistoryComponent/HistoryComponent";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import { IMemoPageModel } from "../../IRequestModel/IMemoPageModel";
import { IMemoButtonModel } from "../../IRequestModel/IMemoButtonModel";
import { MemoButtonComponent } from "../../components/MemoButton/MemoButtonComponent";
import { OtherButtonMemoComponent } from "../../components/MemoButton/MemoButtonetcComponent";
import { IoMenu } from "react-icons/io5";
import { InformationComponent } from "../../components/RequestComponents/InformationComponent/InformationComponent";
import { GetTemplateById } from "../../Services/TemplateService";
import { RequestScreen } from "../Request/RequestScreen";
interface Props {
  // copyFunction: (respone: any) => void;
  copyMemo?: any;
}

export const PreviewTemplateScreen = (props: Props) => {
  return <RequestScreen />;
  //   const empData = JSON.parse(window.localStorage.getItem("userData") || "");
  //   const [templateId, setTtemplateId] = useState<number>();
  //   const [memoId, setMemoId] = useState<number>();
  //   const [sidebarState, setSidebarState] = useState(true);
  //   const [selectedView, setSelectedView] = useState<string>("2");
  //   const [menuButton, setMenuButton] = useState<any[]>([]);
  //   const [dataTreeSelectProps, setDataTreeSelectProps] = useState<any>({});
  //   const [curPage, setCurPage] = useState<any>("2");
  //   const [onLoading, setOnLoading] = useState<boolean>(false);
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const location = useLocation<any>();
  //   const query = new URLSearchParams(useLocation().search);
  //   const [templateTree, setTemplateTree] = useState<any>({});
  //   const [check, setCheck] = useState<string>("");
  //   const [requestDetail, setRequestDetail] = useState<any>();
  //   const [imgLoading, setImgLoading] = useState<any>(null);
  //   const [errorResult, setErrorResult] = useState<any[]>([]);
  //   const [visibleComfirm, setVisibleComfirm] = useState<boolean>(false);
  //   const [errorTable, setErrorTable] = useState<any[]>([]);
  //   const toast = useRef<any>(null);
  //   const [showControl, setShowControl] = useState<any>([]);
  //   const [textFromValue, setTextFromValue] = useState<any>("");
  //   var respone = JSON.parse(localStorage.getItem("userData") || "");
  //   const [isTextFromValue, setIsTextFromValue] = useState<boolean>();
  //   var userData = respone.employeeData;
  //   let history = useHistory();
  //   const [isInitialLogic, setIsInitialLogic] = useState<boolean>(false);
  //   let memoPageModel: IMemoPageModel = {
  //     listApprovalDetails: [],
  //     listFormName: [],
  //     listFileAttachDetails: [],
  //     listHistoryDetails: [],
  //     memoDetail: {
  //       GroupTemplateName: "",
  //       actor: userData,
  //       requestor: userData,
  //       amount: "",
  //       memoid: 0,

  //       approver_can_edit: false,
  //       auto_approve: false,
  //       auto_approve_when: "",
  //       comment: "",
  //       company_id: 0,
  //       company_name: "",
  //       costcenter: "",
  //       created_by: "",
  //       created_date: "",
  //       creator: userData,
  //       current_approval_level: 0,
  //       department_id: 0,
  //       document_library: "",
  //       document_no: "",
  //       document_set: "",
  //       is_editable: false,
  //       is_public: false,
  //       is_text_form: false,
  //       last_action_by: "",
  //       last_status_id: 0,
  //       last_status_name: "",
  //       location: "",
  //       modified_by: "",
  //       modified_date: "",
  //       pass: "",
  //       project: "",
  //       project_id: 0,
  //       report_lang: "",
  //       request_date: "",
  //       status_id: 0,
  //       status: "",
  //       subject: "",
  //       template_code: "",
  //       template_desc: "",
  //       template_detail: "",
  //       template_id: 0,
  //       template_name: "",
  //       to: "",
  //       // toId:0,
  //       waiting_for: "",
  //       waiting_for_id: 0,
  //       copyInformation: "N",
  //     },
  //   };
  //   useEffect(() => {
  //     async function fetchLeaveTemplate() {
  //       console.log(checkTypeLeave, "checkTypeLeave");

  //       if (checkTypeLeave) {
  //         var _responeData = await GetLeaveTemplateByEmpId(requestorId);
  //         console.log(_responeData, "_responeData");
  //         setLeaveTypeTable(_responeData);
  //       } else {
  //         setLeaveTypeTable([]);
  //       }
  //     }
  //     fetchLeaveTemplate();
  //   }, [requestorId, checkTypeLeave]);
  //   function toggleSideBar() {
  //     if (sidebarState) {
  //       setSidebarState(false);
  //     } else {
  //       setSidebarState(true);
  //     }
  //   }
  //   useEffect(() => {
  //     setImgLoading(LogoLoading);
  //   }, []);
  //   useEffect(() => {
  //     if (query.get("MemoID") !== undefined && query.get("MemoID") !== null) {
  //       let memoid = Number(query.get("MemoID"));
  //       setMemoId(memoid);
  //     }
  //     if (query.get("template") !== undefined && query.get("template") !== null) {
  //       let templateid = Number(query.get("template"));
  //       setTtemplateId(templateid);
  //     }
  //   }, [query]);
  //   useEffect(() => {
  //     if (memoId !== undefined) {
  //       fetchTemplate().then((_listFormName) => {
  //         let _memoPageModel = memoPageModel;
  //         _memoPageModel.listFormName = [_listFormName];
  //         if (memoId !== 0) {
  //           fechMemoDetail();
  //           fechMemoButton();
  //           setSelectedView("2");
  //           setCurPage("2");
  //           setErrorResult([]);
  //           _memoPageModel.memoDetail.status = "Draft";
  //           setRequestDetail(_memoPageModel);
  //         }
  //         if (memoId === 0) {
  //           setSelectedView("2");
  //           setCurPage("2");
  //           setCheck("add");
  //           setErrorResult([]);
  //           _memoPageModel.memoDetail.status = "Draft";
  //           setRequestDetail(_memoPageModel);
  //           setTemplateTree(_memoPageModel.listFormName[0]);
  //           setIsTextFromValue(_memoPageModel.listFormName[0].IsTextForm);

  //           setTextFromValue(_memoPageModel.listFormName[0].TextForm);
  //         }
  //       });
  //     }
  //   }, [memoId, templateId]);

  //   const fetchTemplate = async () => {
  //     const dataJson = {
  //       TemplateId: templateId,
  //     };
  //     let _templateIdListFormName: any = await GetTemplateById(dataJson);
  //     // console.log("_templateIdListFormName", _templateIdListFormName);

  //     return _templateIdListFormName;
  //   };
  //   const fechMemoDetail = async () => {
  //     setOnLoading(true);
  //     const requestBody = {
  //       Memoid: memoId,
  //       SecretId: "",
  //       EmployeeId: window.localStorage.getItem("employeeId"),
  //     };
  //     let _respone = await GetMemoDetailById(requestBody);
  //     //"Completed"
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       memoDetail: _respone.memoDetail,
  //       listHistoryDetails: _respone.listHistoryDetails,
  //       listFileAttachDetails: _respone.listFileAttachDetails,
  //       listApprovalDetails: _respone.listApprovalDetails,
  //     }));
  //     setCheck("edit");
  //     setOnLoading(false);
  //   };

  //   function setSummary(respone: any) {
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       memoDetail: {
  //         ...prevState.memoDetail,
  //         amount: respone,
  //       },
  //     }));
  //   }
  //   function setRequestor(respone: any) {
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       memoDetail: {
  //         ...prevState.memoDetail,
  //         requestor: {
  //           ...respone,
  //         },
  //       },
  //     }));
  //   }
  //   function setCreator(respone: any) {
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       memoDetail: {
  //         ...prevState.memoDetail,
  //         creator: {
  //           ...respone,
  //         },
  //       },
  //     }));
  //   }

  //   function setInformation(respone: any) {
  //     setIsLoading(false);
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       memoDetail: {
  //         ...prevState.memoDetail,
  //         template_desc: respone,
  //       },
  //     }));
  //   }
  //   function setInformationTemplate_Desc(respone: any) {
  //     setIsLoading(false);
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       memoDetail: {
  //         ...prevState.memoDetail,
  //         ...respone,
  //       },
  //     }));
  //   }

  //   function setListFormName(respone: IListFormNameModel) {
  //     let _listFormName: IListFormNameModel = respone;
  //     setIsLoading(false);
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       listFormName: [_listFormName],
  //     }));
  //   }

  //   function setLineApprove(respone: any) {
  //     respone.sort((a: any, b: any) => (a.sequence > b.sequence ? 1 : -1));
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       listApprovalDetails: [...respone],
  //     }));
  //   }
  //   function setFileAttach(respone: any) {
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       listFileAttachDetails: [...respone],
  //     }));
  //   }

  //   function getRequestor() {
  //     return requestDetail?.memoDetail;
  //   }
  //   function getInformation() {
  //     return requestDetail?.memoDetail;
  //   }
  //   function getLineAprove() {
  //     return requestDetail?.listApprovalDetails;
  //   }
  //   function getFileAttach() {
  //     return requestDetail;
  //   }
  //   function getHistory() {
  //     return requestDetail?.listHistoryDetails;
  //   }
  //   function getTemplateTree() {
  //     return templateTree;
  //   }
  //   function setListActionButtonDetails(respone: any) {
  //     // console.log("eeeeeeeeeeeee", respone);
  //     // fetch("/api/Company/companyWithName")
  //     //   .then((response) => response.json())
  //     //   .then((data) => {
  //     //     console.log("compa", data);
  //     //     setRequestDetail((prevState: any) => ({
  //     //       ...prevState,
  //     //       listActionButtonDetails: respone,
  //     //       listCompany: data,
  //     //     }));
  //     //   });
  //   }
  //   const fechMemoButton = async () => {
  //     setOnLoading(true);
  //     let _memoId: any = memoId;
  //     let memoButton: IMemoButtonModel = {
  //       actor: {
  //         EmployeeId: empData.employeeData.EmployeeId,
  //       },
  //       memoid: _memoId,
  //     };
  //     let _dataDynamic = await GetButtonMemoByMemoId(memoButton);

  //     const menuButtonSort = _dataDynamic.sort(
  //       (x: any, y: any) => x.sequence - y.sequence
  //     );
  //     setListActionButtonDetails(_dataDynamic);
  //     setMenuButton(menuButtonSort);
  //   };
  //   const actionNavContent = () => {
  //     return (
  //       <div className="action-button">
  //         {check == "edit" && (
  //           <MemoButtonComponent
  //             memoMenu={menuButton}
  //             memoDetail={requestDetail}
  //             onAdd={() => null}
  //             onUpdate={onUpdateMemo}
  //             pageName={"Request"}
  //           />
  //         )}
  //         {check == "add" && fechMemoButtonDefault()}
  //       </div>
  //     );
  //   };
  //   function setListRefDocsDetail(respone: any) {
  //     // console.log("eeeeeeeeeeeee", respone);
  //     setRequestDetail((prevState: any) => ({
  //       ...prevState,
  //       listRefDocDetails: respone,
  //     }));
  //   }
  //   const fechMemoButtonDefault = () => {};
  //   const onSelectView = (text: string) => {
  //     setCurPage(text);
  //     setSelectedView(text);
  //   };
  //   const onUpdateMemo = async (
  //     type: string,
  //     comment: any,
  //     waiting_for?: string,
  //     waiting_for_id?: number
  //   ) => {
  //     setOnLoading(true);
  //     let _requestDetail: any = requestDetail;

  //     let error_result: any[] = [];
  //     let error_table: any[] = [];
  //     let ess_: any = [];
  //     const _template_desc: any = JSON.parse(
  //       _requestDetail.memoDetail.template_desc
  //     );

  //     _requestDetail.memoDetail.actor = userData;
  //     if (_requestDetail.memoDetail.memoid === undefined) {
  //       _requestDetail.memoDetail.memoid = 0;
  //     }
  //     if (comment !== undefined) {
  //       if (comment.length > 0) {
  //         _requestDetail.memoDetail.comment = comment;
  //         if (waiting_for != undefined || waiting_for_id != undefined) {
  //           _requestDetail.memoDetail.waiting_for = waiting_for;
  //           _requestDetail.memoDetail.waiting_for_id = waiting_for_id;
  //         }
  //       }
  //     }
  //     if (type === "draft" || type === "cancel") {
  //       if (_requestDetail.memoDetail.company_name === "") {
  //         ess_.push("Company");
  //       }
  //       if (_requestDetail.memoDetail.subject === "") {
  //         ess_.push("Subject");
  //       }
  //       if (ess_.length >= 1) {
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Error Message",
  //           detail: "Please fill " + ess_.join(" , "),
  //           life: 7000,
  //         });
  //         setOnLoading(false);
  //       } else {
  //         const dataJson = { MemoPage: _requestDetail, Type: type };
  //         let _dataDynamic = await ActionMemoPage(dataJson);

  //         if (_dataDynamic && check === "add") {
  //           history.push("/Default", {
  //             responeData: _dataDynamic,
  //             msg: `${type} success`,
  //           });
  //         } else if (_dataDynamic && check !== "add" && type !== "draft") {
  //           history.push("/Default", {
  //             responeData: _dataDynamic,
  //             msg: `${type} success`,
  //           });
  //         } else if (_dataDynamic && check !== "add" && type === "draft") {
  //           toast.current.show({
  //             severity: "success",
  //             summary: "Success Message",
  //             detail: `${type} success`,
  //             life: 3000,
  //           });
  //           setOnLoading(false);
  //         } else {
  //           toast.current.show({
  //             severity: "error",
  //             summary: "Error Message",
  //             detail: "Server Error Please try again",
  //             life: 7000,
  //           });
  //           setOnLoading(false);
  //         }
  //       }
  //     } else {
  //       for (let i = 0; i < _template_desc.items.length; i++) {
  //         const _layout = _template_desc.items[i].layout;
  //         const _layoutLength = _layout.length;
  //         for (let j = 0; j < _layout.length; j++) {
  //           const _template = _layout[j];
  //           if (_template.template.type === "l") {
  //           }
  //           if (_template.template.type === "c") {
  //           }

  //           if (_template.template.type === "cb") {
  //             if (_template.template.attribute.require === "Y") {
  //               if (
  //                 _template.data.value === null ||
  //                 _template.data.value.length === 0
  //               ) {
  //                 error_result.push({
  //                   row: i,
  //                   col: j,
  //                   label: _template.template.label,
  //                 });
  //               }
  //             }
  //           }

  //           if (_template.template.type === "bt") {
  //           }
  //           if (_template.template.type === "an") {
  //           }
  //           if (_template.template.type === "rvs") {
  //           }
  //           if (_template.template.type === "tb") {
  //             const column = _template.template.attribute.column;
  //             // let error_table: any = [];

  //             if (_template.data.row !== null) {
  //               for (let i = 0; i < column.length; i++) {
  //                 const _column = column[i];
  //                 if (_column.control.template.attribute.require === "Y") {
  //                   for (let j = 0; j < _template.data.row.length; j++) {
  //                     const _row = _template.data.row[j][i];
  //                     if (_row.value !== undefined) {
  //                       if (_row.value.length === 0) {
  //                         error_table.push({ table_row: j, table_col: i });
  //                       }
  //                     }
  //                     if (_row.item !== undefined) {
  //                       if (_row.item.length === 0) {
  //                         error_table.push({ table_row: j, table_col: i });
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //           if (_template.template.type === "ed") {
  //           }
  //           if (_template.template.type === "at") {
  //           }
  //           if (
  //             _template.template.type === "t" ||
  //             _template.template.type === "ta" ||
  //             _template.template.type === "d" ||
  //             _template.template.type === "r"
  //           ) {
  //             // if (_template.data.value === null) {
  //             // }
  //             if (_template.template.attribute.require === "Y") {
  //               if (_template.data.value === null) {
  //                 error_result.push({
  //                   row: i,
  //                   col: j,
  //                   label: _template.template.label,
  //                 });
  //               }
  //               if (_template.data.value !== null) {
  //                 if (_template.data.value.length === 0) {
  //                   error_result.push({
  //                     row: i,
  //                     col: j,
  //                     label: _template.template.label,
  //                   });
  //                 }
  //               }
  //             }
  //           }
  //           if (_template.template.type === "dd") {
  //             if (_template.template.attribute.require === "Y") {
  //               if (_template.data.value === null) {
  //                 error_result.push({
  //                   row: i,
  //                   col: j,
  //                   label: _template.template.label,
  //                 });
  //               }

  //               if (_template.data.value !== null) {
  //                 // console.log("_template: ", _template);

  //                 if (
  //                   _template.data.value.length === 0 ||
  //                   _template.data.value === "--select--"
  //                 ) {
  //                   error_result.push({
  //                     row: i,
  //                     col: j,
  //                     label: _template.template.label,
  //                   });
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       if (_requestDetail.memoDetail.company_name === "") {
  //         ess_.push("Company");
  //       }
  //       if (_requestDetail.memoDetail.subject === "") {
  //         ess_.push("Subject");
  //       }
  //       if (_requestDetail.listApprovalDetails.length <= 0) {
  //         ess_.push("Line Approve");
  //       }
  //       if (ess_.length > 0) {
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Error Message",
  //           detail: "Please fill " + ess_.join(" , "),
  //           life: 7000,
  //         });
  //         setOnLoading(false);
  //       } else if (error_result.length === 0 && error_table.length === 0) {
  //         const dataJson = { MemoPage: _requestDetail, Type: type };
  //         let _respone = await ActionMemoPage(dataJson);
  //         console.log("type", type);

  //         if (_respone && check === "add") {
  //           history.push("/Default", {
  //             responeData: _respone,
  //             msg: `${type} success`,
  //           });
  //         } else if (_respone && check !== "add" && type !== "draft") {
  //           history.push("/Default", {
  //             responeData: _respone,
  //             msg: `${type} success`,
  //           });
  //         } else if (_respone && check !== "add" && type === "draft") {
  //           toast.current.show({
  //             severity: "success",
  //             summary: "Success Message",
  //             detail: `${type} success`,
  //             life: 3000,
  //           });
  //           setOnLoading(false);
  //         } else {
  //           toast.current.show({
  //             severity: "error",
  //             summary: "Error Message",
  //             detail: "Server Error Please try again",
  //             life: 7000,
  //           });
  //         }
  //       } else if (error_result.length >= 1 || error_table.length >= 1) {
  //         toast.current.show({
  //           severity: "error",
  //           summary: "Error Message",
  //           detail: "Please fill in all required fields.",
  //           life: 7000,
  //         });
  //         setOnLoading(false);
  //       }
  //     }

  //     setErrorTable([...error_table]);
  //     setErrorResult([...error_result]);
  //   };

  //   return (
  //     <div
  //       className="request-main-container"
  //       onClick={() => {
  //         console.log(requestDetail);
  //       }}
  //     >
  //       <Toast ref={toast} />

  //       {onLoading && (
  //         <div className="logo-loading cursor-loading">
  //           <img src={LogoLoading} alt="loading..." />
  //         </div>
  //       )}
  //       <div className="request-container">
  //         <div className="header-request set-z-index">
  //           <div className="button-container">
  //             <Button
  //               type="text"
  //               icon={<IoMenu size={28} />}
  //               size="large"
  //               onClick={toggleSideBar}
  //               style={{ background: "transparent " }}
  //             />
  //             <TreeSelectNewRequest
  //               setDataTemplateTreeProps={setDataTreeSelectProps}
  //             />
  //           </div>
  //         </div>

  //         {sidebarState ? (
  //           <div className="show-tablet-navbar-request-min-1024">
  //             <RequestSideBarElement
  //               onSelectView={onSelectView}
  //               curPage={curPage}
  //               workList={memoId}
  //             />
  //           </div>
  //         ) : (
  //           <div></div>
  //         )}

  //         <div className="inner-content">
  //           <div className="worklist-items-container">
  //             {sidebarState ? (
  //               <div className="inner-content show-tablet-navbar-request-max-1024">
  //                 <div className="filter-container">
  //                   <RequestSideBarElement
  //                     onSelectView={onSelectView}
  //                     curPage={curPage}
  //                     workList={memoId}
  //                   />
  //                 </div>
  //               </div>
  //             ) : (
  //               <div></div>
  //             )}
  //             {check == "add" && (
  //               <div className="request-container-item">
  //                 {selectedView === "1" && (
  //                   <RequestorComponent
  //                     getRequestorMethodProp={getRequestor}
  //                     setRequestorMethodProp={setRequestor}
  //                     setCreatorMethodProp={setCreator}
  //                   />
  //                 )}
  //                 {selectedView === "2" && (
  //                  <InformationComponent
  //                  requestDetail={requestDetail}
  //                  setRequestDetail={setRequestDetail}
  //                  showControl={showControl}
  //                  setShowControl={setShowControl}
  //                  selectedView={selectedView}
  //                  isInitialLogic={isInitialLogic}
  //                  setIsInitialLogic={setIsInitialLogic}
  //                  setOnLoading={setOnLoading}
  //                  onLoading={onLoading}
  //                  setLineApporve={setLineApprove}
  //                  setListFormName={setListFormName}
  //                  getInformationMethodProp={getInformation}
  //                  setInformationMethodProp={setInformation}
  //                  getInformationTemplateProp={getTemplateTree}
  //                  getLineApprove={getLineAprove}
  //                  errorResult={errorResult}
  //                  errorTable={errorTable}
  //                  getInformationTemplateSetDataProp={dataTreeSelectProps}
  //                  setInformationTemplate_Desc={setInformationTemplate_Desc}
  //                  setSummary={setSummary}
  //                  setListRefDocsDetail={setListRefDocsDetail}
  //                  isLoading={false}
  //                  setTextFromValue={setTextFromValue}
  //                  textFromValue={textFromValue}
  //                  isTextFromValue={isTextFromValue}
  //                  leaveTypeTable={leaveTypeTable}
  //                  checkTypeLeave={checkTypeLeave}
  //                />
  //                 )}
  //                 {selectedView === "3" && (
  //                   <LineApprovalsComponent
  //                     getLineAproveMethodProp={getLineAprove}
  //                     getRequestorDetailProp={requestDetail}
  //                     setLineApproveMethodProp={setLineApprove}
  //                     onLoading={onLoading}
  //                   />
  //                 )}
  //                 {selectedView === "4" && (
  //                   <AttachmentComponent
  //                     getFileAttachMethodProp={getFileAttach}
  //                     setFileAttachMethodProp={setFileAttach}
  //                     setRequestDetail={setRequestDetail}
  //                     requestDetail={requestDetail}
  //                   />
  //                 )}
  //                 {selectedView === "5" && (
  //                   <HistoryComponent getHistoryMethodProp={getHistory} />
  //                 )}
  //               </div>
  //             )}
  //             {check == "edit" && (
  //               <div className="request-container-item">
  //                 {selectedView === "1" && (
  //                   <RequestorComponent
  //                     getRequestorMethodProp={getRequestor}
  //                     setRequestorMethodProp={setRequestor}
  //                     setCreatorMethodProp={setCreator}
  //                   />
  //                 )}
  //                 {selectedView === "2" && (
  //                   <InformationComponent
  //                     requestDetail={requestDetail}
  //                     setRequestDetail={setRequestDetail}
  //                     showControl={showControl}
  //                     setShowControl={setShowControl}
  //                     selectedView={selectedView}
  //                     isInitialLogic={isInitialLogic}
  //                     setIsInitialLogic={setIsInitialLogic}
  //                     setOnLoading={setOnLoading}
  //                     onLoading={onLoading}
  //                     setLineApporve={setLineApprove}
  //                     setListFormName={setListFormName}
  //                     getInformationMethodProp={getInformation}
  //                     setInformationMethodProp={setInformation}
  //                     getInformationTemplateProp={getTemplateTree}
  //                     getLineApprove={getLineAprove}
  //                     errorResult={errorResult}
  //                     errorTable={errorTable}
  //                     getInformationTemplateSetDataProp={dataTreeSelectProps}
  //                     setInformationTemplate_Desc={setInformationTemplate_Desc}
  //                     setSummary={setSummary}
  //                     setListRefDocsDetail={setListRefDocsDetail}
  //                     isLoading={false}
  //                     setTextFromValue={setTextFromValue}
  //                     textFromValue={textFromValue}
  //                     isTextFromValue={isTextFromValue}
  //                   />
  //                 )}
  //                 {selectedView === "3" && (
  //                   <LineApprovalsComponent
  //                     getLineAproveMethodProp={getLineAprove}
  //                     setLineApproveMethodProp={setLineApprove}
  //                     getRequestorDetailProp={requestDetail}
  //                     onLoading={onLoading}
  //                   />
  //                 )}
  //                 {selectedView === "4" && (
  //                   <AttachmentComponent
  //                     getFileAttachMethodProp={getFileAttach}
  //                     setFileAttachMethodProp={setFileAttach}
  //                     setRequestDetail={setRequestDetail}
  //                     requestDetail={requestDetail}
  //                   />
  //                 )}
  //                 {selectedView === "5" && (
  //                   <HistoryComponent getHistoryMethodProp={getHistory} />
  //                 )}
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //         <div className="mobile-action-container">
  //           <Popover placement="top" content={actionNavContent} trigger="click">
  //             <button className="request-action-button">Action</button>
  //           </Popover>
  //         </div>
  //         <FooterComponents />
  //       </div>
  //     </div>
  //   );
};
