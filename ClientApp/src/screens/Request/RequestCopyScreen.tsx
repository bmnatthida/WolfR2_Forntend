import React, { useRef, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { InformationComponent } from "../../components/RequestComponents/InformationComponent/InformationComponent";
import LineApprovalsComponent from "../../components/RequestComponents/LineApprovalsComponent/LineApprovalsComponent";
import { RequestorComponent } from "../../components/RequestComponents/RequestorComponent/RequestorComponent";
import AttachmentComponent from "../../components/RequestComponents/AttachmentComponent/AttachmentComponent";

import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./index.css";
import RequestSideBarElement from "./RequestSideBarElement";
import { HistoryComponent } from "../../components/RequestComponents/HistoryComponent/HistoryComponent";
import { MemoSingleButton } from "../../components/MemoButton/MemoSingleButton";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { IListFormNameModel } from "../../IRequestModel/IListFormNameModel";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import { Toast } from "primereact/toast";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import { ActionMemoPage, GetMemoDetailById } from "../../Services/MemoService";
import useAlert from "../../hooks/useAlert";
interface Props {
  // copyFunction: (respone: any) => void;
  copyMemo?: any;
}

export const RequestCopyScreen = (props: Props) => {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const [sidebarState, setSidebarState] = useState(true);
  const [selectedView, setSelectedView] = useState<string>("2");
  const [dataTreeSelectProps, setDataTreeSelectProps] = useState<any>({});
  const [curPage, setCurPage] = useState<any>("2");
  const [templateTree, setTemplateTree] = useState<any>([]);
  const [check, setCheck] = useState<string>("");
  const [requestDetail, setRequestDetail] = useState<any>();
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [errorTable, setErrorTable] = useState<any[]>([]);
  var empData = JSON.parse(localStorage.getItem("userData") || "");
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  var userData = empData.employeeData;
  const [errorResult, setErrorResult] = useState<any[]>([]);

  function toggleSideBar() {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setSidebarState(true);
    }
  }
  useEffect(() => {
    setOnLoading(true);
    fechMemoDetail();
    console.log("_respone");
  }, []);
  const fechMemoDetail = async () => {
    let _memoID = query.get("MemoID") ? query.get("MemoID") : "";
    var userData = empData.employeeData;
    const requestBody = {
      Memoid: _memoID,
      SecretId: "",
      EmployeeId: userData.EmployeeId.toString(),
    };
    let _respone = await GetMemoDetailById(requestBody);

    console.log("_respone", _respone);

    setMemoDetail(_respone);
    setCheck("edit");
    setOnLoading(false);
  };

  function setMemoDetail(data: any) {
    let editDataMemoDetail = data.memoDetail;
    editDataMemoDetail.memoid = 0;
    editDataMemoDetail.status = "New Request";
    editDataMemoDetail.document_no = "Auto Generate";
    editDataMemoDetail.copyInformation = "Y";
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: editDataMemoDetail,
      listApprovalDetails: data.listApprovalDetails,
      listFileAttachDetails: data.listFileAttachDetails,
      listHistoryDetails: data.listHistoryDetails,
    }));
  }
  function setListFormName(respone: IListFormNameModel) {
    let _listFormName: IListFormNameModel = {
      AdvanceForm: respone.AdvanceForm,
      ApproverCanEdit: respone.ApproverCanEdit,
      AutoApprove: respone.AutoApprove,
      AutoApproveWhen: respone.AutoApproveWhen,
      CcId: respone.CcId,
      CreatedBy: respone.CreatedBy,
      CreatedDate: respone.CreatedDate,
      DepartmentId: respone.DepartmentId,
      DocumentCode: respone.DocumentCode,
      GroupTemplateName: respone.GroupTemplateName,
      IsActive: respone.IsActive,
      IsTextForm: respone.IsTextForm,
      ModifiedBy: respone.ModifiedBy,
      ModifiedDate: respone.ModifiedDate,
      RefDocColumn: respone.RefDocColumn,
      ReportLang: respone.ReportLang,
      TemplateDetail: respone.TemplateDetail,
      TemplateId: respone.TemplateId,
      TemplateName: respone.TemplateName,
      TemplateSubject: respone.TemplateSubject,
      TextForm: respone.TextForm,
      ToId: respone.ToId,
      isPublic: respone.isPublic,
      isRequesterEditApproval: respone.isRequesterEditApproval,
    };
    setOnLoading(false);
    setRequestDetail((prevState: any) => ({
      ...prevState,
      listFormName: [_listFormName],
    }));
  }
  function setSummary(respone: any) {
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        amount: respone,
      },
    }));
  }
  function setRequestor(respone: any) {
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        requestor: {
          ...respone,
        },
      },
    }));
  }
  function setCreator(respone: any) {
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        creator: {
          ...respone,
        },
      },
    }));
  }
  function setInformation(respone: any) {
    setOnLoading(false);
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        template_desc: respone,
      },
    }));
  }
  function setLineApprove(respone: any) {
    respone.sort((a: any, b: any) => (a.sequence > b.sequence ? 1 : -1));
    setRequestDetail((prevState: any) => ({
      ...prevState,
      listApprovalDetails: [...respone],
    }));
  }
  function setFileAttach(respone: any) {
    setRequestDetail((prevState: any) => ({
      ...prevState,
      listFileAttachDetails: [...respone],
    }));
  }
  function setInformationTemplate_Desc(respone: any) {
    setOnLoading(false);
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        ...respone,
      },
    }));
  }
  function setInformationAdvanceForm(respone: any) {
    setOnLoading(false);

    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        ...respone,
      },
    }));
  }
  function getRequestor() {
    return requestDetail?.memoDetail;
  }
  function getInformation() {
    return requestDetail?.memoDetail;
  }
  function getLineAprove() {
    return requestDetail?.listApprovalDetails;
  }
  function getFileAttach() {
    return requestDetail;
  }
  function getHistory() {
    return requestDetail?.listHistoryDetails;
  }
  function getTemplateTree() {
    return templateTree;
  }
  const fechMemoButtonDefault = () => {
    return (
      <div className="memo-button-container">
        <MemoSingleButton
          onUpdate={onUpdateMemo}
          pageName={"Request"}
          type="submit"
        />
        <MemoSingleButton
          onUpdate={onUpdateMemo}
          pageName={"Request"}
          type="draft"
        />
      </div>
    );
  };
  const onSelectView = (text: string) => {
    setCurPage(text);
    setSelectedView(text);
  };
  const onUpdateMemo = async (
    type: string,
    inputComment: any,
    waiting_for?: string,
    waiting_for_id?: number
  ) => {
    setOnLoading(true);
    let _requestDetail: any = requestDetail;

    let error_result: any[] = [];
    let error_table: any[] = [];
    let ess_: any = [];
    const _template_desc: any = JSON.parse(
      _requestDetail.memoDetail.template_desc
    );

    _requestDetail.memoDetail.actor = userData;
    if (_requestDetail.memoDetail.memoid === undefined) {
      _requestDetail.memoDetail.memoid = 0;
    }
    if (inputComment !== undefined) {
      if (inputComment.length > 0) {
        _requestDetail.memoDetail.comment = inputComment;
        if (waiting_for != undefined || waiting_for_id != undefined) {
          _requestDetail.memoDetail.waiting_for = waiting_for;
          _requestDetail.memoDetail.waiting_for_id = waiting_for_id;
        }
      }
    }

    if (type === "draft" || type === "cancel") {
      if (_requestDetail.memoDetail.company_name === "") {
        ess_.push("Company");
      }
      if (_requestDetail.memoDetail.subject === "") {
        ess_.push("Subject");
      }
      if (ess_.length >= 1) {
        toggleAlert({
          description: `${ess_.join(" , ")} is require.`,
          message: `Require field warning`,
          type: "warning",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: "Please fill " + ess_.join(" , "),
        //   life: 7000,
        // });
        setOnLoading(false);
      } else {
        await fetch(`api/memo/ActionMemoPage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ MemoPage: _requestDetail, Type: type }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              history.push("/Default", {
                responeData: data,
                msg: `${type} success`,
              });
            } else {
              toggleAlert({
                description: `Server Error Please try again.`,
                message: `Error`,
                type: "error",
              });
              // toast.current.show({
              //   severity: "error",
              //   summary: "Error Message",
              //   detail: "Server Error Please try again",
              //   life: 7000,
              // });
              setOnLoading(false);
            }
          });
      }
    } else {
      for (let i = 0; i < _template_desc.items.length; i++) {
        const _layout = _template_desc.items[i].layout;
        const _layoutLength = _layout.length;
        for (let j = 0; j < _layout.length; j++) {
          const _template = _layout[j];
          if (_template.template.type === "l") {
          }
          if (_template.template.type === "c") {
          }

          if (_template.template.type === "cb") {
            if (_template.template.attribute.require === "Y") {
              if (
                _template.data.value === null ||
                _template.data.value.length === 0
              ) {
                error_result.push({
                  row: i,
                  col: j,
                  label: _template.template.label,
                });
              }
            }
          }

          if (_template.template.type === "bt") {
          }
          if (_template.template.type === "an") {
          }
          if (_template.template.type === "rvs") {
          }
          if (_template.template.type === "tb") {
            const column = _template.template.attribute.column;
            // let error_table: any = [];

            if (_template.data.row !== null) {
              for (let i = 0; i < column.length; i++) {
                const _column = column[i];
                if (_column.control.template.attribute.require === "Y") {
                  for (let j = 0; j < _template.data.row.length; j++) {
                    const _row = _template.data.row[j][i];
                    if (_row.value !== undefined) {
                      if (_row.value.length === 0) {
                        error_table.push({ table_row: j, table_col: i });
                      }
                    }
                    if (_row.item !== undefined) {
                      if (_row.item.length === 0) {
                        error_table.push({ table_row: j, table_col: i });
                      }
                    }
                  }
                }
              }
            }
          }
          if (_template.template.type === "ed") {
          }
          if (_template.template.type === "at") {
          }
          if (
            _template.template.type === "t" ||
            _template.template.type === "ta" ||
            _template.template.type === "d" ||
            _template.template.type === "r"
          ) {
            // if (_template.data.value === null) {
            // }
            if (_template.template.attribute.require === "Y") {
              if (_template.data.value === null) {
                error_result.push({
                  row: i,
                  col: j,
                  label: _template.template.label,
                });
              }
              if (_template.data.value !== null) {
                if (_template.data.value.length === 0) {
                  error_result.push({
                    row: i,
                    col: j,
                    label: _template.template.label,
                  });
                }
              }
            }
          }
          if (_template.template.type === "dd") {
            if (_template.template.attribute.require === "Y") {
              if (_template.data.value === null) {
                error_result.push({
                  row: i,
                  col: j,
                  label: _template.template.label,
                });
              }
              if (_template.data.value !== null) {
                if (
                  _template.data.item.length === 0 ||
                  _template.data.item === "--select--"
                ) {
                  error_result.push({
                    row: i,
                    col: j,
                    label: _template.template.label,
                  });
                }
              }
            }
          }
        }
      }
      if (_requestDetail.memoDetail.company_name === "") {
        ess_.push("Company");
      }
      if (_requestDetail.memoDetail.subject === "") {
        ess_.push("Subject");
      }
      if (_requestDetail.listApprovalDetails.length <= 0) {
        ess_.push("Line Approve");
      }
      if (ess_.length > 0) {
        toggleAlert({
          description: `${ess_.join(" , ")} is require.`,
          message: `Require field warning`,
          type: "warning",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: "Please fill " + ess_.join(" , "),
        //   life: 7000,
        // });
        setOnLoading(false);
      } else if (error_result.length === 0 && error_table.length === 0) {
        const dataJson = { MemoPage: _requestDetail, Type: type };
        let _respone = await ActionMemoPage(dataJson);
        console.log("_respone", _respone);

        if (_respone) {
          history.push("/Default", {
            responeData: _respone,
            msg: `${type} success`,
          });
        } else {
          // toast.current.show({
          //   severity: "error",
          //   summary: "Error Message",
          //   detail: "Server Error Please try again",
          //   life: 7000,
          // });
          toggleAlert({
            description: `Server Error Please try again.`,
            message: `Error`,
            type: "error",
          });
          setOnLoading(false);
        }
      } else if (error_result.length >= 1 || error_table.length >= 1) {
        ess_.join(" , ");
        toggleAlert({
          description: `${
            error_result.length >= 1 && error_result.join(" , ")
          }${error_table.length >= 1 && error_table.join(" , ")} is require.`,
          message: `Require field warning`,
          type: "warning",
        });
        // toast.current.show({
        //   severity: "error",
        //   summary: "Error Message",
        //   detail: "Please fill in all required fields.",
        //   life: 7000,
        // });
        setOnLoading(false);
      }
    }

    setErrorTable([...error_table]);
    setErrorResult([...error_result]);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="request-main-container">
        {onLoading && (
          <div className="logo-loading cursor-loading">
            <img src={LogoLoading} alt="loading..." />
          </div>
        )}
        <div className="request-container">
          <div className="header-request set-z-index">
            <div className="button-container">
              <Button
                type="text"
                icon={<MenuOutlined />}
                size="large"
                onClick={toggleSideBar}
              />
              <TreeSelectNewRequest
                setDataTemplateTreeProps={setDataTreeSelectProps}
              />
            </div>
            <div className="confirm-container">{fechMemoButtonDefault()}</div>
          </div>
          {sidebarState ? (
            <div className="show-tablet-navbar-request-min-1024">
              {fechMemoButtonDefault()}
            </div>
          ) : (
            <div></div>
          )}
          <div className="inner-content">
            <div className="worklist-items-container">
              {sidebarState ? (
                <div className="inner-content show-tablet-navbar-request-max-1024">
                  <div className="filter-container">
                    <RequestSideBarElement
                      onSelectView={onSelectView}
                      curPage={curPage}
                    />
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              {check == "edit" && (
                <div className="request-container-item">
                  {selectedView === "1" && (
                    <RequestorComponent
                      getRequestorMethodProp={getRequestor}
                      setRequestorMethodProp={setRequestor}
                      setCreatorMethodProp={setCreator}
                    />
                  )}
                  {selectedView === "2" && (
                    <InformationComponent
                      setOnLoading={setOnLoading}
                      onLoading={onLoading}
                      setInformationTemplate_Desc={setInformationTemplate_Desc}
                      setInformationAdvanceForm={setInformationAdvanceForm}
                      setLineApporve={setLineApprove}
                      setListFormName={setListFormName}
                      getInformationMethodProp={getInformation}
                      setInformationMethodProp={setInformation}
                      getInformationTemplateProp={getTemplateTree}
                      getLineApprove={getLineAprove}
                      errorResult={errorResult}
                      errorTable={setErrorTable}
                      getInformationTemplateSetDataProp={dataTreeSelectProps}
                      setSummary={setSummary}
                    />
                  )}
                  {selectedView === "3" && (
                    <LineApprovalsComponent
                      getLineAproveMethodProp={getLineAprove}
                      setLineApproveMethodProp={setLineApprove}
                      getRequestorDetailProp={requestDetail}
                      onLoading={onLoading}
                    />
                  )}
                  {selectedView === "4" && (
                    <AttachmentComponent
                      getFileAttachMethodProp={getFileAttach}
                      setFileAttachMethodProp={setFileAttach}
                      setRequestDetail={setRequestDetail}
                      requestDetail={requestDetail}
                    />
                  )}
                  {selectedView === "5" && (
                    <HistoryComponent listHistoryDetails={getHistory} />
                  )}
                </div>
              )}
            </div>
          </div>
          <FooterComponents />
        </div>
      </div>
    </>
  );
};
