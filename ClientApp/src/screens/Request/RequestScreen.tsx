import React, { useRef, useState, useEffect, useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { InformationComponent } from "../../components/RequestComponents/InformationComponent/InformationComponent";
import LineApprovalsComponent from "../../components/RequestComponents/LineApprovalsComponent/LineApprovalsComponent";
import { RequestorComponent } from "../../components/RequestComponents/RequestorComponent/RequestorComponent";
import AttachmentComponent from "../../components/RequestComponents/AttachmentComponent/AttachmentComponent";

import { Button, Spin, Modal, Popover } from "antd";
import { BsPlusCircle } from "react-icons/bs";
import { MenuOutlined } from "@ant-design/icons";
import "./index.css";
import RequestSideBarElement from "./RequestSideBarElement";
import { HistoryComponent } from "../../components/RequestComponents/HistoryComponent/HistoryComponent";
import { MemoButtonComponent } from "../../components/MemoButton/MemoButtonComponent";
// import { MemoButtonetcComponent } from "../../components/MemoButton/MemoButtonetcComponent";
import { MemoSingleButton } from "../../components/MemoButton/MemoSingleButton";
import { Col, Row } from "react-bootstrap";
import { CoreControllerComponent } from "../../components/RequestComponents/CoreControllerComponent/CoreControllerComponent";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { IMemoPageModel } from "../../IRequestModel/IMemoPageModel";
import { IListApprovalDetailsModel } from "../../IRequestModel/IListApprovalDetailsModel";
import { IActorModel } from "../../IRequestModel/IActorModel";
import { IListFormNameModel } from "../../IRequestModel/IListFormNameModel";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import { IMemoButtonModel } from "../../IRequestModel/IMemoButtonModel";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import { on } from "events";
import {
  ActionMemoPage,
  GetButtonMemoByMemoId,
  GetMemoDetailById,
  GetRefDocTemp,
} from "../../Services/MemoService";

import {
  GetTemplateByDocTypeCode,
  GetTemplateById,
} from "../../Services/TemplateService";
import { GeneratePDF } from "../../Services/ReviewPdfService";

import { IoMenu } from "react-icons/io5";
import { json } from "stream/consumers";
import {
  GetAutoNumber,
  GetSaveRunningNumber,
} from "../../Services/RequestControlService";
import { GetMemoAuthorized } from "../../Services/AuthorizedService";
import {
  GetLeaveTemplate,
  GetLeaveTemplateByEmpId,
  GetMasterDataFieldInfo,
  GetSignature,
} from "../../Services/MasterDataService";
import { GetAllDynamic } from "../../Services/DynamicService";
import { GetRolePermission } from "../../Services/RoleServices";
import { GetAllEmployee } from "../../Services/EmployeeService";
import { GetApprovalByTemplate } from "../../Services/ApprovalService";
import { ADTitleConfiguration } from "../../Services/ConfigurationService";

interface Props {}

export const RequestScreen = (props: Props) => {
  const empData = JSON.parse(window.localStorage.getItem("userData") || "");
  const [templateId, setTtemplateId] = useState<number>();
  const [memoId, setMemoId] = useState<number>();
  const [sidebarState, setSidebarState] = useState(true);
  const [selectedView, setSelectedView] = useState<string>("2");
  const [menuButton, setMenuButton] = useState<any[]>([]);
  const [dataTreeSelectProps, setDataTreeSelectProps] = useState<any>({});
  const [curPage, setCurPage] = useState<any>("2");
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listFormNameState, setListFormNameState] = useState<any>();
  const location = useLocation<any>();
  const [isSetCanEdit, setIsSetCanEdit] = useState(false);
  // const query = new URLSearchParams(useLocation().search);
  const [templateTree, setTemplateTree] = useState<any>({});
  const [check, setCheck] = useState<string>("");
  const [requestDetail, setRequestDetail] = useState<IMemoPageModel>();
  const [imgLoading, setImgLoading] = useState<any>(null);
  const [errorResult, setErrorResult] = useState<any[]>([]);
  const [visibleComfirm, setVisibleComfirm] = useState<boolean>(false);
  const [errorTable, setErrorTable] = useState<any[]>([]);
  const [isInitialLogic, setIsInitialLogic] = useState<boolean>(false);
  const [showControl, setShowControl] = useState<any>([]);
  const [isActionPdf, setIsActionPdf] = useState<boolean>(false);
  const [textFromValue, setTextFromValue] = useState<any>("");
  const [isTextFromValue, setIsTextFromValue] = useState<boolean>();
  const [isCopyValue, setIsCopyValue] = useState<boolean>(false);
  const [isShowPdfButton, setIsShowPdfButton] = useState(true);
  const [requestorId, setRequestorId] = useState<any>();
  const [checkTypeLeave, setCheckTypeLeave] = useState<boolean>(false);
  const [dataEmployeeList, setDataEmployeeList] = useState<any[]>([]);
  const [sinatureOptions, setSinatureOptions] = useState<any>([]);
  const [allLogic, setAllLogic] = useState<any[]>([]);
  const [listLogicData, setListLogicData] = useState<any[]>([]);
  const [onLoadLineApprove, setOnLoadLineApprove] = useState(false);

  const [previewTemplate, setPreviewTemplate] = useState<boolean>(false);
  const [isHideProject, setIsHideProject] = useState<boolean>(false);
  const [branchFromADTitle, setBranchFromADTitle] = useState<any>();
  const [isBranchFromADTitle, setIsBranchFromADTitle] =
    useState<boolean>(false);
  const [activeADTitleToPosition, setActiveADTitleToPosition] = useState<any>();
  const [isActiveADTitleToPosition, setIsActiveADTitleToPosition] =
    useState<boolean>(false);
  const toast = useRef<any>(null);
  const { search } = useLocation();
  var respone = JSON.parse(localStorage.getItem("userData") || "");
  var userData = respone.employeeData;
  const [refTempSelected, setRefTempSelected] = useState<any>([]);
  const [refAttibute, setRefAttibute] = useState<any>();
  const [searchRefDocData, setSearchRefDocData] = useState<any[]>([]);
  let history = useHistory();
  let memoPageModel: IMemoPageModel = {
    listApprovalDetails: [],
    listFormName: [],
    listFileAttachDetails: [],
    listHistoryDetails: [],
    listControlRunning: [],
    listRefDocDetails: [],
    // HistoryView: [],
    // listActionButtonDetails: [],
    // listCompany: [],
    // listLogic: [],
    // listLogicloaddata: null,
    // listProject: [],
    // listSignatureWording: [],
    memoDetail: {
      GroupTemplateName: "",
      actor: userData,
      TemplateApproveId: "",
      requestor: userData,
      amount: "",
      memoid: 0,

      approver_can_edit: false,
      auto_approve: false,
      auto_approve_when: "",
      comment: "",
      company_id: 0,
      company_name: "",
      costcenter: "",
      created_by: "",
      created_date: "",
      creator: userData,
      current_approval_level: 0,
      department_id: 0,
      document_library: "",
      document_no: "",
      document_set: "",
      is_editable: false,
      is_public: false,
      is_text_form: false,
      last_action_by: "",
      last_status_id: 0,
      last_status_name: "",
      location: "",
      modified_by: "",
      modified_date: "",
      pass: "",
      project: "",
      project_id: 0,
      report_lang: "",
      request_date: "",
      status_id: 0,
      status: "",
      subject: "",
      template_code: "",
      template_desc: "",
      template_detail: "",
      template_id: 0,
      template_name: "",
      to: "",
      waiting_for: "",
      waiting_for_id: 0,
      copyInformation: "N",
    },
  };
  const [leaveTypeTable, setLeaveTypeTable] = useState<any>([]);

  useEffect(() => {
    setImgLoading(LogoLoading);
    fetchMasterData();
    fetchEmployee();
  }, []);
  useEffect(() => {
    if (
      requestDetail?.memoDetail?.amount &&
      requestDetail?.memoDetail?.amount !== "0.00" &&
      requestDetail?.memoDetail?.memoid === 0
    ) {
      fetchLineApproveWithSummary();
    }
  }, [requestDetail?.memoDetail?.amount]);

  function toggleSideBar() {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setSidebarState(true);
    }
  }
  const query = useMemo(() => new URLSearchParams(search), [search]);

  useEffect(() => {
    setShowControl([]);

    queryData();
  }, [query]);
  const fetchLineApproveWithSummary = async () => {
    const dataJson = {
      templateForm: requestDetail?.listFormName[0],
      lstTRNLineApprove: [],
      VEmployee: userData,
      Amount: requestDetail?.memoDetail?.amount,
    };

    let responeAprovaWithTemplate = await GetApprovalByTemplate(dataJson);

    let newData: IListApprovalDetailsModel[] = [];
    if (responeAprovaWithTemplate.length > 0) {
      newData = responeAprovaWithTemplate;
    } else {
      newData = requestDetail?.listApprovalDetails!;
    }
  };
  async function queryData() {
    let _templateId: any;
    if (query.get("DocTypeCode") && !query.get("template")) {
      _templateId = await fetchTemplateDocTypeCode(query.get("DocTypeCode"));
      console.log("_templateid", _templateId);
      setTtemplateId(_templateId);
    }
    if (query.get("template") && !query.get("DocTypeCode")) {
      _templateId = Number(query.get("template"));
      console.log("_templateid2", _templateId);
      setTtemplateId(_templateId);
    }
    if (query.get("MemoID") !== undefined && query.get("MemoID") !== null) {
      let memoid = Number(query.get("MemoID"));

      onCheckPermission(memoid);
      setMemoId(memoid);
    }
    if (query.get("isCopy") !== undefined && query.get("isCopy") !== null) {
      setIsCopyValue(true);
    }
    if (query.get("preview") !== undefined && query.get("preview") !== null) {
      setPreviewTemplate(true);
    }
  }
  const onCheckPermission = async (memoid: any) => {
    const request = {
      MemoId: memoid,
      RequesterId: userData.EmployeeId,
      RNameEn: userData.Email,
    };
    console.log("responseCheck", request);

    const response = await GetMemoAuthorized(request);
    if (response === false) {
      history.push("/UnAuthorize");
    }
    console.log("responseCheck", response);
  };
  useEffect(() => {
    if (memoId !== undefined) {
      let templateCode: any = "";
      setOnLoading(true);
      fetchTemplate().then(async (_listFormName) => {
        setListFormNameState(_listFormName);
        let _memoPageModel: any = memoPageModel;
        _memoPageModel.listFormName = [_listFormName];
        setIsSetCanEdit(false);
        setRequestorId(memoPageModel.memoDetail.requestor.EmployeeId);
        // if (_memoPageModel.listFormName[0] === null) {
        //   window.location.href = "/UnAuthorize";
        //   console.log(_memoPageModel, "_memoPageModel");
        // }
        if (memoId === 0) {
          setIsInitialLogic(false);

          const dataJson = {
            TemplateId: templateId,
          };
          let _template: any = await GetTemplateById(dataJson);
          await onLoadLogic(templateId);
          if (!_template) {
            return;
          }
          console.log(dataJson, "_templateid");
          console.log(_template, "_templateid");
          let empid: any = userData.EmployeeId;

          console.log("_respone_respone", _respone);
          const emp_authorize: any =
            _template?.SpecificEmployeeId?.length > 0
              ? _template?.SpecificEmployeeId?.split(",").map(Number)
              : [];
          const role_authorize: any =
            _template?.SpecificRoleID?.length > 0
              ? _template?.SpecificRoleID?.split(",").map(Number)
              : [];
          let isEmpAuthorize =
            emp_authorize.length > 0 || role_authorize.length > 0
              ? false
              : true;
          let isRoleAuthorize =
            role_authorize.length > 0 || emp_authorize.length > 0
              ? false
              : true;
          console.log(
            "role",
            isRoleAuthorize,
            role_authorize,
            _template,
            emp_authorize,
            isEmpAuthorize
          );
          for (let j = 0; j < emp_authorize.length; j++) {
            const _emp_authorize_id = emp_authorize[j];
            if (_emp_authorize_id === empid) {
              isEmpAuthorize = true;
            }
          }
          const roles = await GetRolePermission();
          for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            if (role.EmployeeId === empid) {
              for (let j = 0; j < role_authorize.length; j++) {
                const _role_authorize = role_authorize[j];
                if (_role_authorize === role.RoleId && !role.IsDelete) {
                  isRoleAuthorize = true;
                }
              }
            }
          }
          console.log(
            "role2",
            roles,
            isRoleAuthorize,
            role_authorize,
            _template,
            emp_authorize,
            isEmpAuthorize
          );
          if (!isEmpAuthorize && !isRoleAuthorize) {
            history.push("/UnAuthorize");
          }
          console.log("_memoPageModel", _memoPageModel);
          _memoPageModel.memoDetail.status =
            previewTemplate === true ? "New Request" : "";

          setSelectedView("2");
          setCurPage("2");
          setCheck("add");
          setErrorResult([]);
          setRequestDetail(_memoPageModel);
          setTemplateTree(_memoPageModel.listFormName[0]);
          setIsTextFromValue(_memoPageModel.listFormName[0].IsTextForm);
          setTextFromValue(_memoPageModel.listFormName[0].TextForm);
          // if (previewTemplate) {
          //   var editDataMemoDetail = _memoPageModel.memoDetail;
          //   editDataMemoDetail.memoid = 0;
          //   editDataMemoDetail.status = "New Request";
          //   editDataMemoDetail.document_no = "Auto Generate";
          //   editDataMemoDetail.copyInformation = "Y";

          //   console.log("editDataMemoDetail", editDataMemoDetail);

          //   setRequestDetail((prevState: any) => ({
          //     ...prevState,
          //     memoDetail: editDataMemoDetail,
          //   }));
          // }

          templateCode = _memoPageModel.listFormName[0].DocumentCode;
          replaceTitleInfo(_memoPageModel, "add");
        } else if (memoId !== 0) {
          setIsInitialLogic(true);

          var _respone: any = await fechMemoDetail();
          let empid: any = userData.EmployeeId;
          const dataJson = {
            TemplateId: _respone.memoDetail.template_id,
          };
          console.log("dataJson", dataJson);

          let _template: any = await GetTemplateById(dataJson);
          console.log("ddddddddddddddddddddddddddddddddddddd", _template);
          await onLoadLogic(_respone.memoDetail.template_id);
          setListFormNameState(_template);
          const emp_authorize: any =
            _template.SpecificEmployeeId !== undefined &&
            _template.SpecificEmployeeId !== null &&
            _template.SpecificEmployeeId?.length > 0
              ? _template.SpecificEmployeeId?.split(",").map(Number)
              : [];
          const role_authorize: any =
            _template.SpecificRoleID !== undefined &&
            _template.SpecificRoleID !== null &&
            _template.SpecificRoleID?.length > 0
              ? _template.SpecificRoleID?.split(",").map(Number)
              : [];
          let isEmpAuthorize = emp_authorize.length > 0 ? false : true;
          let isRoleAuthorize = role_authorize.length > 0 ? false : true;
          console.log(
            "role",
            isRoleAuthorize,
            role_authorize,
            _template,
            emp_authorize,
            isEmpAuthorize
          );
          for (let j = 0; j < emp_authorize.length; j++) {
            const _emp_authorize_id = emp_authorize[j];
            if (_emp_authorize_id === empid) {
              isEmpAuthorize = true;
            }
          }
          const roles = await GetRolePermission();
          for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            if (role.EmployeeId === empid) {
              for (let j = 0; j < role_authorize.length; j++) {
                const _role_authorize = role_authorize[j];
                if (_role_authorize === role.RoleId) {
                  isRoleAuthorize = true;
                }
              }
            }
          }
          console.log(
            "role2",
            isRoleAuthorize,
            role_authorize,
            _template,
            emp_authorize,
            isEmpAuthorize
          );
          if (!isEmpAuthorize && !isRoleAuthorize) {
            history.push("/UnAuthorize");
          }

          fechMemoButton();
          setSelectedView("2");
          setCurPage("2");
          setErrorResult([]);
          _respone["listFormName"] = [_template];
          _respone["listControlRunning"] = [];
          templateCode = _respone.memoDetail.template_code;

          if (_respone.memoDetail.Permission !== null) {
            const permission: any = _respone.memoDetail.Permission;
            if (permission.View === "F") {
              history.push("/UnAuthorize");
            }
            if (permission.Print === "F") {
              setIsShowPdfButton(false);
            }
          }
          console.log("_respone_respone_respone_respone_respone", _respone);
          // setRequestDetail(_respone);

          if (isCopyValue) {
            setCheck("add");
            var editDataMemoDetail = _respone.memoDetail;
            editDataMemoDetail.memoid = 0;
            editDataMemoDetail.status = "New Request";
            editDataMemoDetail.document_no = "Auto Generate";
            editDataMemoDetail.copyInformation = "Y";
            editDataMemoDetail.creator = empData.employeeData;
            editDataMemoDetail.requestor = empData.employeeData;
            console.log("editDataMemoDetail", editDataMemoDetail);

            setRequestDetail((prevState: any) => ({
              ...prevState,
              memoDetail: editDataMemoDetail,
              listHistoryDetails: [],
              listFileAttachDetails: _respone.listFileAttachDetails,
              listApprovalDetails: _respone.listApprovalDetails,
              listRefDocDetails: _respone.listRefDocDetails,
              listFormName: _respone.listFormName,
              listControlRunning: _respone.listControlRunning,
            }));
          } else if (!isCopyValue) {
            setRequestDetail(_respone);
            setCheck("edit");
            replaceTitleInfo(_respone, "edit");
          }
        }
        checkLeaveRequestTemplate(templateCode);
      });
    }
  }, [memoId, templateId]);

  useEffect(() => {
    if (
      requestDetail?.listFormName[0] !== undefined &&
      requestDetail?.listFormName[0] !== null
    ) {
      checkRefTemplate(requestDetail?.listFormName[0]);
    }
  }, [requestDetail?.listFormName]);

  async function checkRefTemplate(_template: any) {
    const temp = _template;
    try {
      if (temp !== undefined && temp !== null) {
        if (temp?.RefDocDisplay !== null) {
          console.log("ref=>temp", temp);
          let _refDoc: any[] = [];
          const dataRequest = {
            template_ID: temp?.TemplateId,
            ConnectionString: "",
            UserPrincipalName: "",
          };
          const display = temp?.RefDocDisplay.split(",");
          let refDoc = await GetRefDocTemp(dataRequest);
          console.log("ref=>refDoc", refDoc);
          refDoc.map((ref: any) => {
            if (ref !== null) {
              if (display[2] !== "Information DocumentNo") {
                let refTemp = JSON.parse(ref.MAdvancveForm);
                refTemp.items.map((col: any) => {
                  col.layout.map((_layout: any) => {
                    if (_layout.template.label === display[2]) {
                      if (
                        _layout.data.value !== null &&
                        _layout.data.value !== ""
                      ) {
                        ref[display[2]] = _layout.data.value;
                        _refDoc.push(ref);
                      }
                    }
                  });
                });
              } else {
                _refDoc.push(ref);
              }
            }
          });
          console.log("ref=>display", display);

          let refObject: any = {
            option: _refDoc,
            position: display[0],
            mode: display[1],
            optionLabel: display[2],
          };

          if (memoPageModel?.listRefDocDetails?.length > 0) {
            const refDocsDetail = memoPageModel?.listRefDocDetails;
            const results = refObject.option.filter((refDoc: any) =>
              refDocsDetail.some(
                (docDetail: any) => docDetail.doc_no === refDoc.DocumentNo
              )
            );
            setRefTempSelected(results);
          }
          setSearchRefDocData([..._refDoc]);
          setRefAttibute(refObject);
        } else {
          setRefTempSelected([]);
          setRefAttibute(undefined);
        }
      }
      setOnLoading(false);
    } catch (error) {
      console.log("ref=>error", error);
      setOnLoading(false);
    }
  }

  async function replaceTitleInfo(respone: any, action: any) {
    console.log(respone, "ADTitleConfiguration/");
    console.log(action, "ADTitleConfiguration/");
    var _responeADTitle = await ADTitleConfiguration();
    if (_responeADTitle.activeBranchFromADTitle?.toLowerCase() === "true") {
      if (action === "add") {
        setBranchFromADTitle(respone?.memoDetail?.requestor?.ADTitle);
      } else if (action === "edit") {
        setBranchFromADTitle(respone?.memoDetail?.requestor?.ADTitle);
      }
      setIsBranchFromADTitle(true);
    }
    if (_responeADTitle.activeADTitleToPosition.toLowerCase() === "true") {
      if (respone?.memoDetail?.requestor.ADTitle) {
        setIsActiveADTitleToPosition(true);
      }
    }
    var _respone = await GetMasterDataFieldInfo();
    console.log(_respone, "_respone");
    if (_respone.length > 0) {
      if (_respone[0].Value4?.toLowerCase() === "true") {
        if (_respone[0]?.Value3) {
          setIsHideProject(true);
          const _display = _respone[0].Value1.split("|");
          const _dataReplace = _respone[0].Value2.split("|");
          for (let index = 0; index < _display.length; index++) {
            const element = _display[index];
            const element2 = _dataReplace[index];
            var documentElement: any = document.getElementById(
              element
            ) as HTMLDivElement | null;
            if (documentElement) {
              documentElement.innerHTML = element2;
            }
          }
        }
      }
    }
  }
  async function checkLeaveRequestTemplate(templateCode: string) {
    var respone = await GetLeaveTemplate();
    let _leaveTemplate: any = respone;
    if (_leaveTemplate) {
      for (let index = 0; index < _leaveTemplate.length; index++) {
        if (_leaveTemplate[index].Value1 === templateCode) {
          setCheckTypeLeave(true);
        } else {
          setCheckTypeLeave(false);
        }
      }
    }
  }
  useEffect(() => {
    async function fetchLeaveTemplate() {
      console.log(checkTypeLeave, "checkTypeLeave");
      console.log(requestorId, "requestorId");
      if (checkTypeLeave) {
        var _responeData = await GetLeaveTemplateByEmpId(requestorId);
        console.log(_responeData, "_responeData");
        setLeaveTypeTable(_responeData);
      } else {
        setLeaveTypeTable([]);
      }
    }
    fetchLeaveTemplate();
  }, [requestorId, checkTypeLeave]);

  const onLoadLogic = async (templateID: any) => {
    const dataLogic = await fetch("api/TemplateList/TemplateByid/LoadLogic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ TemplateId: templateID }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Logic=> ", data);

        setAllLogic([...data]);
        return data;
      });
    return dataLogic;
  };
  const fetchTemplate = async () => {
    const dataJson = {
      TemplateId: templateId,
    };
    let _templateIdListFormName: any = await GetTemplateById(dataJson);
    console.log(_templateIdListFormName, "_memoPageModel");
    console.log(memoId, "_memoPageModel");
    checkRefTemplate(_templateIdListFormName);
    if (_templateIdListFormName === null && memoId === 0) {
      history.push("/UnAuthorize");
      return;
    }
    return _templateIdListFormName;
  };
  async function fetchTemplateDocTypeCode(DocumentCode: any) {
    let _data = await GetTemplateByDocTypeCode({
      DocumentCode: DocumentCode,
    });

    if (_data) {
      return _data.TemplateId;
    } else {
      history.push("/UnAuthorize");
    }
  }

  async function fetchMasterData() {
    let options: any[] = [];
    let signatrue = await GetSignature();
    signatrue.map((s: any) => {
      options.push({ id: s.masterId, value1: s.value1, value2: s.value2 });
    });
    setSinatureOptions([...options]);
  }

  const fechMemoDetail = async () => {
    setOnLoading(true);
    const requestBody = {
      Memoid: memoId,
      SecretId: "",
      EmployeeId: window.localStorage.getItem("employeeId"),
      actor: userData,
    };
    let _respone = await GetMemoDetailById(requestBody);
    setIsTextFromValue(_respone.memoDetail.is_text_form);
    setTextFromValue(_respone.memoDetail.template_desc);
    return _respone;
  };

  async function fetchEmployee() {
    let _dataEmployee = await GetAllEmployee();
    setDataEmployeeList(_dataEmployee);
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
    setIsLoading(false);
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        template_desc: respone,
      },
    }));
  }
  function setInformationTemplate_Desc(respone: any) {
    setIsLoading(false);
    setRequestDetail((prevState: any) => ({
      ...prevState,
      memoDetail: {
        ...prevState.memoDetail,
        ...respone,
      },
    }));
  }

  function setListFormName(respone: IListFormNameModel) {
    let _listFormName: IListFormNameModel = respone;
    setIsLoading(false);
    setRequestDetail((prevState: any) => ({
      ...prevState,
      listFormName: [_listFormName],
    }));
  }
  function setListRefDocsDetail(respone: any) {
    setRequestDetail((prevState: any) => ({
      ...prevState,
      listRefDocDetails: respone,
    }));
  }
  function setLineApprove(respone: any) {
    console.log("ddddddddddddereline", respone);

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

  function getRequestor() {
    return requestDetail?.memoDetail;
  }
  function getInformation() {
    return requestDetail?.memoDetail;
  }
  function getLineApprove() {
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

  const fechMemoButton = async () => {
    setOnLoading(true);
    let _memoId: any = memoId;
    let memoButton: IMemoButtonModel = {
      actor: {
        EmployeeId: empData.employeeData.EmployeeId,
      },
      memoid: _memoId,
    };
    let _dataDynamic = await GetButtonMemoByMemoId(memoButton);

    const menuButtonSort = _dataDynamic.sort(
      (x: any, y: any) => x.sequence - y.sequence
    );
    setMenuButton(menuButtonSort);
  };
  const actionNavContent = () => {
    return (
      <div className="action-button">
        {check == "edit" && (
          <MemoButtonComponent
            memoMenu={menuButton}
            memoDetail={requestDetail}
            onAdd={() => null}
            onUpdate={onUpdateMemo}
            pageName={"Request"}
          />
        )}
        {check == "add" && fechMemoButtonDefault()}
      </div>
    );
  };
  const fechMemoButtonDefault = () => {
    if (previewTemplate === false) {
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
    }
  };
  const onSelectView = (text: string) => {
    setCurPage(text);
    setSelectedView(text);
  };
  function toggleDialog() {
    setVisibleComfirm(!visibleComfirm);
  }

  const onUpdateMemo = async (
    type: string,
    comment: string,
    waiting_for?: string,
    waiting_for_id?: number
  ) => {
    setOnLoading(true);
    let _requestDetail: any = requestDetail;
    let error_result: any[] = [];
    let error_table: any[] = [];
    let ess_: any = [];
    console.log(_requestDetail, "_requestDetail");
    _requestDetail.memoDetail.actor = userData;
    if (_requestDetail.memoDetail.memoid === undefined) {
      _requestDetail.memoDetail.memoid = 0;
    }
    if (comment) {
      _requestDetail.memoDetail.comment = comment;
      if (waiting_for != undefined || waiting_for_id != undefined) {
        _requestDetail.memoDetail.waiting_for = waiting_for;
        _requestDetail.memoDetail.waiting_for_id = waiting_for_id;
      }
    }
    if (_requestDetail.listFormName[0]) {
      if (_requestDetail?.listFormName[0]?.IsTextForm === true) {
        _requestDetail.memoDetail.is_text_form = true;
        _requestDetail.memoDetail.template_desc = textFromValue;
      }
    }
    if (type === "draft" || type === "cancel") {
      if (_requestDetail.memoDetail.company_name === "") {
        ess_.push("Company");
      }
      if (
        _requestDetail.memoDetail.subject === undefined ||
        _requestDetail.memoDetail.subject === null ||
        _requestDetail.memoDetail.subject.length === 0
      ) {
        ess_.push("Subject");
      }
      if (ess_.length >= 1) {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "Please fill " + ess_.join(" , "),
          life: 7000,
        });
        setOnLoading(false);
      } else {
        let newRunning = "";
        const _template_desc: any = JSON.parse(
          _requestDetail?.memoDetail?.template_desc
        );
        for (let i = 0; i < _template_desc.items.length; i++) {
          const _layout = _template_desc.items[i].layout;
          const _layoutLength = _layout.length;
          for (let j = 0; j < _layout.length; j++) {
            const _template = _layout[j];
            if (_template.template.type === "an") {
              if (type === "draft") {
                let value: string = _template.data.value;
                if (value) {
                  let runControls = requestDetail?.listControlRunning;

                  const dd = value.split("-");
                  const gg = dd.slice(0, dd.length - 1);

                  const requestBody = {
                    Prefix: gg.join("-") + "-",
                    Digit: _template.template.digit,
                    TemplateId: templateId,
                    RunningNumber: dd.join("-"),
                  };

                  const checkAuto = await GetSaveRunningNumber(requestBody);

                  const checkNum = checkAuto.split("-");
                  if (checkNum[0] !== "") {
                    if (dd[dd.length - 1] !== checkNum[check.length - 1]) {
                      newRunning = checkNum[checkNum.length - 1];
                      dd[dd.length - 1] = newRunning;
                      _template.data.value = newRunning;
                      requestBody.RunningNumber = newRunning;
                    }
                    runControls.push(requestBody);
                  }

                  _requestDetail.listControlRunning = runControls;
                }
              }
            }
            if (_template.template.type === "rvs") {
              if (newRunning !== "") {
                _template.data.value = newRunning;
              }
            }
          }
        }
        const dataJson = { MemoPage: _requestDetail, Type: type };
        console.log("_requestDetail", _requestDetail);

        let _dataDynamic = await ActionMemoPage(dataJson);
        var checkAction: boolean = false;
        if (_dataDynamic.includes("done")) {
          checkAction = true;
        }
        if (checkAction && check === "add") {
          history.push("/Default", {
            responeData: _dataDynamic,
            msg: `${type} success`,
          });
        } else if (checkAction && check !== "add" && type !== "draft") {
          history.push("/Default", {
            responeData: checkAction,
            msg: `${type} success`,
          });
        } else if (checkAction && check !== "add" && type === "draft") {
          setIsActionPdf(!isActionPdf);

          setOnLoading(false);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error Message",
            detail: `${_dataDynamic}`,
            life: 7000,
          });
          setOnLoading(false);
        }
      }
    } else {
      if (_requestDetail?.listFormName[0]?.IsTextForm === false) {
        let newRunning = "";
        const _template_desc: any = JSON.parse(
          _requestDetail?.memoDetail?.template_desc
        );
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
              if (type === "draft" || type === "submit") {
                let value: string = _template.data.value;
                if (value) {
                  let runControls = requestDetail?.listControlRunning;

                  const dd = value.split("-");
                  const gg = dd.slice(0, dd.length - 1);

                  const requestBody = {
                    Prefix: gg.join("-") + "-",
                    Digit: _template.template.digit,
                    TemplateId: templateId,
                    RunningNumber: dd.join("-"),
                  };

                  const checkAuto = await GetSaveRunningNumber(requestBody);

                  const checkNum = checkAuto.split("-");
                  if (checkNum[0] !== "") {
                    if (dd[dd.length - 1] !== checkNum[check.length - 1]) {
                      newRunning = checkNum[checkNum.length - 1];
                      dd[dd.length - 1] = newRunning;
                      _template.data.value = newRunning;
                      requestBody.RunningNumber = newRunning;
                    }
                    runControls.push(requestBody);
                  }

                  _requestDetail.listControlRunning = runControls;
                }
              }
            }
            if (_template.template.type === "rvs") {
              if (newRunning !== "") {
                _template.data.value = newRunning;
              }
            }
            if (_template.template.type === "tb") {
              const column = _template.template.attribute.column;
              // let error_table: any = [];
              let isTableRequire = false;
              for (let i = 0; i < column.length; i++) {
                const _column = column[i];
                if (_column.control.template.attribute.require === "Y") {
                  if (
                    _template.data.row !== null &&
                    _template.data.row.length !== 0
                  ) {
                    for (let j = 0; j < _template.data.row.length; j++) {
                      const _row = _template.data.row[j][i];
                      if (_row.value !== undefined) {
                        if (_row.value === null || _row.value === "") {
                          error_table.push({ table_row: j, table_col: i });
                        } else if (Number(_row.value) === 0) {
                          error_table.push({ table_row: j, table_col: i });
                        } else {
                          if (
                            _column.control.template.attribute.items !==
                            undefined
                          ) {
                            if (
                              _row.value ===
                              _column.control.template.attribute?.items[0].item
                            ) {
                              error_table.push({ table_row: j, table_col: i });
                            }
                          }
                        }
                      }
                      if (_row.item !== undefined) {
                        if (_row.item === null || _row.item === "") {
                          if (_row.item.length === 0) {
                            error_table.push({ table_row: j, table_col: i });
                          }
                        }
                      }
                    }
                  } else {
                    isTableRequire = true;
                  }
                }
              }
              if (isTableRequire) {
                if (
                  _template.data.row === null ||
                  _template.data.row.length === 0
                ) {
                  error_result.push({
                    row: i,
                    col: j,
                    label: _template.template.label,
                  });
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
                    _template.data.value.length === 0 ||
                    _template.data.value === "--select--"
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
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "Please fill " + ess_.join(" , "),
          life: 7000,
        });
        setOnLoading(false);
      } else if (error_result.length === 0 && error_table.length === 0) {
        const dataJson = { MemoPage: _requestDetail, Type: type };
        let _respone = await ActionMemoPage(dataJson);
        if (_respone && check === "add") {
          history.push("/Default", {
            responeData: _respone,
            msg: `${type} success`,
          });
        } else if (_respone && check !== "add" && type !== "draft") {
          history.push("/Default", {
            responeData: _respone,
            msg: `${type} success`,
          });
        } else if (_respone && check !== "add" && type === "draft") {
          setIsActionPdf(true);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error Message",
            detail: "Server Error Please try again",
            life: 7000,
          });
        }
      } else if (error_result.length >= 1 || error_table.length >= 1) {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: `Please fill in all required fields. ${error_result.map(
            (_errpr) => _errpr.label
          )}`,
          life: 7000,
        });
        setOnLoading(false);
      }
    }
    setErrorTable([...error_table]);
    setErrorResult([...error_result]);
    console.log(_requestDetail, "_requestDetail");
  };

  return (
    <div
      className="request-main-container"
      onClick={() => {
        console.log(requestDetail);
      }}
    >
      <Toast ref={toast} />
      {onLoading && (
        <div
          className="logo-loading cursor-loading"
          onClick={() => console.log(onLoading, onLoadLineApprove)}
        >
          <img src={LogoLoading} alt="loading..." />
        </div>
      )}
      <div className="request-container">
        <div className="header-request set-z-index">
          <div className="button-container">
            <Button
              type="text"
              icon={<IoMenu size={28} />}
              size="large"
              onClick={toggleSideBar}
              style={{ background: "transparent " }}
            />
            <TreeSelectNewRequest
              setDataTemplateTreeProps={setDataTreeSelectProps}
            />
          </div>
          <div className="confirm-container">
            {check == "edit" && (
              <MemoButtonComponent
                memoMenu={menuButton}
                memoDetail={requestDetail}
                onAdd={() => null}
                onUpdate={onUpdateMemo}
                pageName={"Request"}
              />
            )}
            {check == "add" && fechMemoButtonDefault()}
            {check == "edit" && (
              <>
                {/* {isActionPdf === false && isShowPdfButton && (
                  <MemoButtonetcComponent
                    pdfData={location.state?.pdfData}
                    memoIDforcopy={
                      query.get("MemoID") ? query.get("MemoID") : ""
                    }
                  />
                )}
                {isActionPdf === true && isShowPdfButton && (
                  <MemoButtonetcComponent
                    memoIDforcopy={
                      query.get("MemoID") ? query.get("MemoID") : ""
                    }
                  />
                )} */}
              </>
            )}
          </div>
        </div>

        {sidebarState ? (
          <div className="show-tablet-navbar-request-min-1024">
            <RequestSideBarElement
              onSelectView={onSelectView}
              curPage={curPage}
              workList={memoId}
            />
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
                    workList={memoId}
                  />
                </div>
              </div>
            ) : (
              <div></div>
            )}
            {check === "add" && getInformation() !== undefined && (
              <div className="request-container-item">
                {selectedView === "1" && (
                  <RequestorComponent
                    getRequestorMethodProp={getRequestor}
                    setRequestorMethodProp={setRequestor}
                    setCreatorMethodProp={setCreator}
                    setLineApprove={setLineApprove}
                    setRequestorId={setRequestorId}
                    listFormNameState={listFormNameState}
                    listApprovalDetails={requestDetail?.listApprovalDetails}
                    setBranchFromADTitle={setBranchFromADTitle}
                    isBranchFromADTitle={isBranchFromADTitle}
                    isActiveADTitleToPosition={isActiveADTitleToPosition}
                  />
                )}
                {selectedView === "2" && (
                  <InformationComponent
                    onLoadLineApprove={onLoadLineApprove}
                    setOnLoadLineApprove={setOnLoadLineApprove}
                    listLogicData={listLogicData}
                    setListLogicData={setListLogicData}
                    logic={allLogic}
                    isSetCanEdit={isSetCanEdit}
                    setIsSetCanEdit={setIsSetCanEdit}
                    showControl={showControl}
                    setShowControl={setShowControl}
                    selectedView={selectedView}
                    isInitialLogic={isInitialLogic}
                    setIsInitialLogic={setIsInitialLogic}
                    onLoading={onLoading}
                    isLoading={isLoading}
                    setOnLoading={setOnLoading}
                    getInformationMethodProp={getInformation}
                    setListFormName={setListFormName}
                    setInformationMethodProp={setInformation}
                    getInformationTemplateProp={getTemplateTree}
                    getInformationTemplateSetDataProp={dataTreeSelectProps}
                    getLineApprove={getLineApprove}
                    setLineApporve={setLineApprove}
                    errorResult={errorResult}
                    errorTable={errorTable}
                    setListRefDocsDetail={setListRefDocsDetail}
                    setInformationTemplate_Desc={setInformationTemplate_Desc}
                    setSummary={setSummary}
                    requestDetail={requestDetail}
                    setRequestDetail={setRequestDetail}
                    setTextFromValue={setTextFromValue}
                    textFromValue={textFromValue}
                    isTextFromValue={isTextFromValue}
                    leaveTypeTable={leaveTypeTable}
                    checkTypeLeave={checkTypeLeave}
                    isCopyProps={isCopyValue}
                    isHideProject={isHideProject}
                    branchFromADTitle={branchFromADTitle}
                    isBranchFromADTitle={isBranchFromADTitle}
                    refAttibuteProps={refAttibute}
                    refTempSelectedProps={refTempSelected}
                  />
                )}
                {selectedView === "3" && (
                  <LineApprovalsComponent
                    getLineAproveMethodProp={getLineApprove}
                    getRequestorDetailProp={requestDetail}
                    setLineApproveMethodProp={setLineApprove}
                    dataEmployeeList={dataEmployeeList}
                    signature={sinatureOptions}
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
              </div>
            )}
            {check === "edit" && getInformation() !== undefined && (
              <div className="request-container-item">
                {selectedView === "1" && (
                  <RequestorComponent
                    getRequestorMethodProp={getRequestor}
                    setRequestorMethodProp={setRequestor}
                    setCreatorMethodProp={setCreator}
                    setRequestorId={setRequestorId}
                    setLineApprove={setLineApprove}
                    listFormNameState={listFormNameState}
                    listApprovalDetails={requestDetail?.listApprovalDetails}
                    setBranchFromADTitle={setBranchFromADTitle}
                    isBranchFromADTitle={isBranchFromADTitle}
                    isActiveADTitleToPosition={isActiveADTitleToPosition}
                  />
                )}
                {selectedView === "2" && (
                  <InformationComponent
                    onLoadLineApprove={onLoadLineApprove}
                    setOnLoadLineApprove={setOnLoadLineApprove}
                    listLogicData={listLogicData}
                    setListLogicData={setListLogicData}
                    logic={allLogic}
                    isSetCanEdit={isSetCanEdit}
                    setIsSetCanEdit={setIsSetCanEdit}
                    requestDetail={requestDetail}
                    setRequestDetail={setRequestDetail}
                    showControl={showControl}
                    setShowControl={setShowControl}
                    selectedView={selectedView}
                    isInitialLogic={isInitialLogic}
                    setIsInitialLogic={setIsInitialLogic}
                    setOnLoading={setOnLoading}
                    onLoading={onLoading}
                    setLineApporve={setLineApprove}
                    setListFormName={setListFormName}
                    getInformationMethodProp={getInformation}
                    setInformationMethodProp={setInformation}
                    getInformationTemplateProp={getTemplateTree}
                    getLineApprove={getLineApprove}
                    errorResult={errorResult}
                    errorTable={errorTable}
                    getInformationTemplateSetDataProp={dataTreeSelectProps}
                    setInformationTemplate_Desc={setInformationTemplate_Desc}
                    setSummary={setSummary}
                    setListRefDocsDetail={setListRefDocsDetail}
                    isLoading={false}
                    setTextFromValue={setTextFromValue}
                    textFromValue={textFromValue}
                    isTextFromValue={isTextFromValue}
                    leaveTypeTable={leaveTypeTable}
                    checkTypeLeave={checkTypeLeave}
                    isCopyProps={isCopyValue}
                    isHideProject={isHideProject}
                    branchFromADTitle={branchFromADTitle}
                    isBranchFromADTitle={isBranchFromADTitle}
                    refAttibuteProps={refAttibute}
                    refTempSelectedProps={refTempSelected}
                  />
                )}
                {selectedView === "3" && (
                  <LineApprovalsComponent
                    getLineAproveMethodProp={getLineApprove}
                    setLineApproveMethodProp={setLineApprove}
                    getRequestorDetailProp={requestDetail}
                    dataEmployeeList={dataEmployeeList}
                    signature={sinatureOptions}
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
                  <HistoryComponent
                    listHistoryDetails={getHistory}
                    userData={dataEmployeeList}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mobile-action-container">
          <Popover placement="top" content={actionNavContent} trigger="click">
            <button className="request-action-button">Action</button>
          </Popover>
        </div>
        <FooterComponents />
      </div>
    </div>
  );
};
