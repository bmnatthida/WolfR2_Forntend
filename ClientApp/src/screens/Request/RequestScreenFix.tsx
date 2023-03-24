import moment from "moment";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import InformationComponentFix from "../../components/RequestComponents/InformationComponent/InformationComponentFix";
import { useUserContext } from "../../Context/UserContext";
import useLoading from "../../hooks/useLoading";
import { IMemoButtonModel } from "../../IRequestModel/IMemoButtonModel";
import { IMemoDetailModel } from "../../IRequestModel/IMemoDetailModel";
import { useTranslation } from "react-i18next";
import {
  GetMemoAuthorized,
  GetMemoAuthorizedViewAndPrint,
} from "../../Services/AuthorizedService";
import { dataCompany } from "../../Services/CompanyService";
import { GetAllDynamic } from "../../Services/DynamicService";
import { GetAllEmployee } from "../../Services/EmployeeService";
import { Button } from "antd";
import {
  ActionMemoPage,
  GetButtonMemoByMemoId,
  GetMemoDetail,
  GetMemoDetailOnlyById,
  GetMemoHistoryDetail,
  GetRefDocTemp,
  SetCheckAcces,
} from "../../Services/MemoService";
import {
  GetTemplateByDocTypeCode,
  GetTemplateById,
  GetTemplateFromDDL,
  LoadLogic,
  SearchTemplateListEditing,
} from "../../Services/TemplateService";
import { IoMenu } from "react-icons/io5";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import RequestSideBarElement from "./RequestSideBarElement";
import LineApprovalsComponentFix from "../../components/RequestComponents/LineApprovalsComponent/LineApprovalsComponentFix";
import AttachmentComponent from "../../components/RequestComponents/AttachmentComponent/AttachmentComponent";
import { HistoryComponent } from "../../components/RequestComponents/HistoryComponent/HistoryComponent";
import { RequestorComponent } from "../../components/RequestComponents/RequestorComponent/RequestorComponent";
import { useForm } from "react-hook-form";
import { GetAllProject } from "../../Services/ProjectService";
import { generateQuickGuid } from "../../Helper/GenerateGuid";
import { ADTitleConfiguration } from "../../Services/ConfigurationService";
import {
  GetLeaveTemplateByEmpId,
  getVersionTempVC,
} from "../../Services/MasterDataService";
import { OtherButtonMemoComponent } from "../../components/MemoButton/MemoButtonetcComponent";

import { formatKeyLogicData } from "../../Helper/formatKeyLogicData";
import {
  ILogic,
  ILogicPermission,
  ILogicReferenceField,
  ILogicTypePermission,
  ILogicTypeShowHide,
  ILogicTypeReference,
  ILogicTypeSourceLoad,
  ILogicTypeReladToLoadData,
} from "../../IRequestModel/ILogicModel";

import { MemoSingleButton } from "../../components/MemoButton/MemoSingleButton";
import { MemoButtonComponent } from "../../components/MemoButton/MemoButtonComponent";
import { IRequestOnSubmit } from "../../IRequestModel/CreateFormControl/IRequestOnSubmit";

import { Toast } from "primereact/toast";
import { ResponeValidation, Validation } from "../../Helper/Validation";
import { IUserModel } from "../../IRequestModel/IUserModel";
import { INumberFormula } from "../../IRequestModel/INumberFormula";
import { IAutoNumberAttibute } from "../../IRequestModel/IAutoNumberFormat";
import {
  GetRvsRunning,
  GetSaveRunningNumber,
} from "../../Services/RequestControlService";
import { GetRolePermission } from "../../Services/RoleServices";
import { onCheckMemoPermission } from "../../Helper/CheckMemoPermission";
import { IListApprovalDetailsModel } from "../../IRequestModel/IListApprovalDetailsModel";
import { GetApprovalsByMemoIDs } from "../../Services/LineApprovalsService";
import { sorterFunc } from "../../Helper/SortingFunction";
import { genAutoNum } from "../../Helper/RequestScreenHelper";
import useAlert from "../../hooks/useAlert";
import useAdminEditCompletedMemoPermissionContext from "../../hooks/useAdminEditCompletedMemo";
import { IRolePermission } from "../../IRequestModel/IRolePermission";
import { motion, AnimatePresence } from "framer-motion";
import { isEmptyObject } from "jquery";
import { tableSelectOption } from "../../components/AntdControlComponent/TableComponent/TableComponent";

const RequestScreenFix = () => {
  const { toggleAlert } = useAlert();
  //PageSetting
  const [userData, setUserData] = useUserContext();
  const location = useLocation<any>();
  const isFirstRun = useRef(true);
  const toast = useRef<any>(null);
  const { isLoad, setLoad } = useLoading();
  const { search } = useLocation();
  const history = useHistory();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [sidebarState, setSidebarState] = useState<boolean>(true);
  const [checkUseEffect, setCheckUseEffect] = useState<boolean>(false);
  const [checkActionPage, setCheckActionPage] = useState<string>("");
  const [checkedLeaveTemplate, setCheckedLeaveTemplate] = useState<boolean>();
  const [curPage, setCurPage] = useState<string>();
  const [selectedView, setSelectedView] = useState<string>();
  const [dataTreeSelectProps, setDataTreeSelectProps] = useState<any>({});
  const [isControlLoading, setIsControlLoading] = useState(false);
  const [empByUserId, setEmpByUserId] = useState<any>();
  const [templateDescrip, setTemplateDescrip] = useState<any[]>([]);

  //Check Can Edit
  const [canEditDoc, setCanEditDoc] = useState<boolean>(false);
  const [canEditLineApprove, setCanEditLineApprove] = useState<boolean>(false);
  const { canEditMemo } = useAdminEditCompletedMemoPermissionContext();
  const [isCheckAccess, setIsCheckAccess] = useState<boolean>(false);

  //MemoPage Value
  const [memoId, setMemoId] = useState<any>();
  const [memoDetail, setMemoDetail] = useState<any>();
  const [listFormNames, setListFormNames] = useState<any>();
  const [lineApproval, setLineApproval] = useState<any[]>([]);
  const [listHistoryDetails, setListHistoryDetails] = useState<any[]>([]);
  const [listFileAttachDetails, setListFileAttachDetails] = useState<any[]>([]);
  const [listRefDocDetails, setListRefDocDetails] = useState<any[]>([]);
  const [isTextFromValue, setIsTextFromValue] = useState<boolean>(false);
  const [textFromValue, setTextFromValue] = useState<any>();

  //RefDoc Value
  const [refTempSelected, setRefTempSelected] = useState<any>([]);
  const [refAttribute, setRefAttribute] = useState<any>();
  const [searchRefDocData, setSearchRefDocData] = useState<any[]>([]);
  const [refOptions, setRefOptions] = useState<any[]>([]);
  const [dialogVisibleInRefTemplate, setDialogVisibleInRefTemplate] =
    useState(false);
  const [refLoading, setRefLoading] = useState<boolean>(false);
  const previousRefTempSelected = useRef<any>(null);
  const [canEditRefDoc, setCanEditRefDoc] = useState<boolean>(false);
  const { t } = useTranslation(["translation"]);
  //MasterData Value
  const [masterSignature, setMasterSignature] = useState<any>([]);
  const [masterATDLFT, setMasterATDLFT] = useState<any>([]);
  const [masterDLAttach, setMasterDLAttach] = useState<any>();
  const [finFo, setFinFo] = useState<any>([]);
  const [lRTempCode, setLRTempCode] = useState<any>();
  const [masterProjects, setMasterProjects] = useState<any>([]);
  const [masterEmployee, setMasterEmployee] = useState<any>([]);
  const [masterCompanies, setMasterCompanies] = useState<any>([]);
  const [templateListVersion, setTemplateListVersion] = useState<any>([]);
  const [selectedTemplateVersion, setSelectedTemplateVersion] = useState<any>();
  const [isTemplateVersion, setIsTemplateVersion] = useState<boolean>(false);
  const [menuButton, setMenuButton] = useState<any[]>([]);
  const [allLogic, setAllLogic] = useState<any[]>([]);
  const [jsonConditions, setJsonConditions] = useState<string>();
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
  const [isShowPdf, setIsShowPdf] = useState(true);
  const [isShowSum, setIsShowSum] = useState<boolean>(false);
  const [permission, setPermission] = useState<any>();
  const [masterDataValidField, setMasterDataValidField] = useState<any[]>([]);
  //autoApprove
  const [requestActionMemo, setRequestActionMemo] = useState<boolean>(false);
  const [checkRequestActionMemo, setCheckRequestActionMemo] =
    useState<boolean>(false);
  //AutoControlAttibute
  const [numFormulas, setNumFormulas] = useState<INumberFormula[]>([]);
  const [autoNumFormat, setAutoNumFormat] = useState<IAutoNumberAttibute>({
    formats: [],
    showSymbol: false,
    digit: 0,
    rowIndex: -1,
    colIndex: -1,
  });

  const [buttonType, setButtonType] = useState<string>("");

  const [tableOptions, setTableOptions] = useState<tableSelectOption[]>([]);

  const previousView = useRef<any>(null);

  useEffect(() => {
    previousView.current = selectedView;
  }, [selectedView]);
  //Hook form
  const {
    handleSubmit,
    control,
    reset,
    register,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: memoDetail?.template_desc?.items,
    },
    mode: "onChange",
  });
  const [listInToAndPass, setListInToAndPass] = useState<any>({
    to: [],
    pass: [],
  });
  const [project, setProject] = useState<any>();
  const [isBranchFromADTitle, setIsBranchFromADTitle] =
    useState<boolean>(false);
  const [isADTitleToPosition, setIsADTitleToPosition] =
    useState<boolean>(false);
  const [leaveTypeTable, setLeaveTypeTable] = useState<any>([]);

  const [tableSummaries, setTableSummaries] = useState<any[]>();
  const prevRequestLineapprove = useRef<any>(null);
  //RequestorValue
  const [requestor, setRequestor] = useState<any>({});
  const [creator, setCreator] = useState<any>({});
  useEffect(() => {
    const fetchMasterData = async () => {
      setLoad(true);
      const masterData = await GetAllDynamic("MasterData/GetAll", undefined);
      const projects = await GetAllProject();
      const employee = await GetAllEmployee();
      const companies = await dataCompany();

      setMasterSignature([
        ...masterData
          .filter((e: any) => {
            return e.MasterType === "Signature";
          })
          .sort((a: any, b: any) => (Number(a.Seq) > Number(b.Seq) ? 1 : -1)),
      ]);
      setMasterDataValidField([
        ...masterData.filter((e: any) => {
          return e.MasterType === "ValidField";
        }),
      ]);
      setMasterDLAttach(
        masterData.filter((e: any) => {
          return e.MasterType === "DLAttach" && e.IsActive === true;
        })[0]
      );
      setFinFo(
        masterData.filter((e: any) => {
          return e.MasterType === "FINFO" && e.IsActive === true;
        })[0]
      );
      setMasterATDLFT(
        masterData.filter((e: any) => {
          return e.MasterType === "ATDLFT" && e.IsActive === true;
        })[0]
      );
      setLRTempCode(
        masterData.filter((e: any) => {
          return e.MasterType === "LRTempCode";
        })
      );
      setMasterEmployee([...employee]);
      setMasterProjects([...projects]);
      setMasterCompanies([...companies]);
      setCheckUseEffect(true);
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    detectLineApproval();
  }, [lineApproval]);
  useEffect(() => {
    //Check RefTemplate if have show
    if (listFormNames) {
      if (
        listFormNames.RefTemplate === "" ||
        listFormNames.RefTemplate === "[]"
      ) {
        setRefAttribute([]);
      } else {
        getAllRefDoc(listFormNames);
      }
    }
  }, [listFormNames]);

  const getAllRefDoc = async (listFormNames: any) => {
    if (!listFormNames?.RefDocDisplay) {
      return;
    }
    setRefLoading(true);
    let _RefID: string = "";
    if (query.get("RefID") !== undefined && query.get("RefID") !== null) {
      _RefID = query.get("RefID") || "";
    }
    const display = listFormNames?.RefDocDisplay?.split(",");
    if (!refAttribute && display.length > 0) {
      let refObject: any = {
        option: [],
        position: display[0],
        mode: display[1],
        optionLabel:
          display[2] !== "Information DocumentNo" ? display[2] : "DocumentNo",
        isDefaultLineApprove: listFormNames.IsDefaultLineApprove,
        refIdOnQuery: null,
      };
      setRefAttribute({ ...refObject });
    }

    const res = await GetRefDocTemp({ template_ID: listFormNames.TemplateId });

    if (res) {
      checkRefTemplate(listFormNames, listRefDocDetails, res, _RefID);
    }
    setRefLoading(false);
  };

  const detectLineApproval = () => {
    if (lineApproval) {
      lineApproval.map((line: IListApprovalDetailsModel) => {
        if (line.signature_id && line.signature_id !== 0) {
          let _signature = masterSignature.find(
            (sig: any) => sig.MasterId === line.signature_id
          );
          if (_signature) {
            line.signature_en = _signature.Value2;
            line.signature_th = _signature.Value1;
          }
        } else {
          let _signature = masterSignature.find((sig: any) => sig.Seq === "1");
          if (_signature) {
            line.signature_en = _signature.Value2;
            line.signature_id = _signature.MasterId;
            line.signature_th = _signature.Value1;
          }
        }
      });
    }
  };

  useEffect(() => {
    if (checkUseEffect) {
      checkQuery();
    }
  }, [checkUseEffect, query]);
  useEffect(() => {
    if (checkRequestActionMemo) {
      autoApprove();
    }
  }, [requestActionMemo]);

  function autoApprove() {
    console.log(memoDetail, "memoDetail3433333333333");

    var request: IRequestOnSubmit = {
      buttonType: "approve",
      inputComment: "",
      waitingFor: "",
      waitingForId: 0,
    };
    onSubmit(memoDetail.template_desc, request);
  }
  const checkQuery = async () => {
    setLoad(true);
    let canAccess = true;
    let _templateId: number = 0;
    let _memoId: number = 0;
    let _usrId: number = 0;
    let _docTypeCode: string | null = "";
    let _isCopy: boolean = false;
    let _isPreview: boolean = false;
    let _documentNo: string = "";
    let _RefID: string = "";

    if (query.get("DocTypeCode") && !query.get("template")) {
      const _response = await GetTemplateByDocTypeCode({
        DocumentCode: query.get("DocTypeCode"),
      });
      _docTypeCode = query.get("DocTypeCode");
      _templateId = _response.TemplateId;
    }

    if (query.get("template") && !query.get("DocTypeCode")) {
      _templateId = Number(query.get("template"));
    }
    if (query.get("MemoID") && !query.get("DocumentNo")) {
      setMemoId(Number(query.get("MemoID")));
      _memoId = Number(query.get("MemoID"));

      const jsonRequest = {
        memoid: _memoId,
        EmployeeId: userData.EmployeeId,
      };

      canAccess = await onCheckPermission(_memoId);
      if (
        query.get("checkRequestActionMemo") !== null &&
        query.get("checkRequestActionMemo") !== undefined
      ) {
        setCheckRequestActionMemo(true);
      }
    }
    if (!query.get("MemoID") && query.get("DocumentNo")) {
      _documentNo = query.get("DocumentNo") || "";
    }
    if (query.get("userId")) {
      _usrId = Number(query.get("userId"));
    }
    if (query.get("isCopy") !== undefined && query.get("isCopy") !== null) {
      _isCopy = true;
    }
    if (query.get("preview") !== undefined && query.get("preview") !== null) {
      _isPreview = true;
    }
    if (query.get("RefID") !== undefined && query.get("RefID") !== null) {
      _RefID = query.get("RefID") || "";
    }
    console.log("ref=>_RefID", _RefID);

    if (canAccess) {
      getInitialData(
        _memoId,
        _templateId,
        _docTypeCode,
        _isCopy,
        _isPreview,
        _usrId,
        _documentNo,
        _RefID
      );
    } else {
      history.push("/UnAuthorize");
    }
  };
  const onCheckPermission = async (memoid: number) => {
    const request = {
      MemoId: memoid,
      RequesterId: userData.EmployeeId,
      RNameEn: userData.Email,
    };
    const response = await GetMemoAuthorized(request);
    if (response === false) {
      return false;
    } else {
      return true;
    }
  };
  const getInitialData = async (
    _memoId: number,
    _templateId: number,
    _docTypeCode: string | null,
    _isCopy: boolean,
    _isPreview: boolean,
    _usrId: number,
    _documentNo: string,
    _RefID: string
    // _templateVersionCode: string | null,
    // _versionTemplate: string | null
  ) => {
    try {
      let userDataByQuery = null;
      setListInToAndPass({
        to: [],
        pass: [],
      });
      let hasQueryUserId: boolean = false;
      if (_usrId !== 0) {
        const _employee = await GetAllEmployee();

        userDataByQuery = _employee.find(
          (_emp: any) => _emp.EmployeeId === _usrId
        );
        if (userDataByQuery) {
          hasQueryUserId = true;
        }
      }

      const requestBody = {
        Memoid: _memoId,
        TemplateId: _templateId,
        DocumentCode: _docTypeCode,
        SecretId: "",
        DocumentNo: _documentNo,
        EmployeeId: userDataByQuery
          ? userDataByQuery.EmployeeId.toString()
          : userData.EmployeeId.toString(),
        actor: userDataByQuery ? userDataByQuery : userData,
      };
      let requestDetail = await GetMemoDetail(requestBody);

      const _isTextForm: boolean =
        requestDetail.requestDetails.listFormNames[0].IsTextForm;
      let logic = await LoadLogic(
        requestDetail?.requestDetails.memoDetail.template_id !== 0
          ? requestDetail?.requestDetails.memoDetail.template_id
          : _templateId
      );
      const canViewAndPrint =
        requestDetail?.requestDetails?.memoDetail?.Permission;
      if (canViewAndPrint?.View === "F") {
        history.push("/UnAuthorize");
      }
      if (canViewAndPrint?.Print === "F") {
        setIsShowPdf(false);
      }
      setPermission(canViewAndPrint);
      console.log(canViewAndPrint, "canViewAndPrint");
      console.log(requestDetail, "canViewAndPrint2");
      let memoButtons: any[] = [];
      if (_memoId !== 0) {
        let memoButton: IMemoButtonModel = {
          actor: {
            EmployeeId: userData.EmployeeId,
          },
          memoid: _memoId,
        };
        memoButtons = await GetButtonMemoByMemoId(memoButton);

        const menuButtonSort = memoButtons.sort(
          (x: any, y: any) => x.sequence - y.sequence
        );
        setMenuButton(menuButtonSort);
        setCheckActionPage("edit");
        if (_isTextForm) {
          setTextFromValue(
            requestDetail.requestDetails.memoDetail.template_desc
          );
          setIsTextFromValue(true);
        } else {
          requestDetail = {
            ...requestDetail,
            requestDetails: {
              ...requestDetail.requestDetails,
              memoDetail: {
                ...requestDetail.requestDetails.memoDetail,
                template_desc: requestDetail.requestDetails.memoDetail
                  .template_desc
                  ? {
                      items: JSON.parse(
                        requestDetail.requestDetails.memoDetail.template_desc
                      ).items.map((item: any) => {
                        return {
                          ...item,
                          layout: item.layout.map((_layout: any) => {
                            return {
                              ..._layout,
                              isShow: true,
                            };
                          }),
                        };
                      }),
                    }
                  : {},
              },
            },
          };
          console.log({
            templateDesc: requestDetail.requestDetails.memoDetail,
          });
          let templateDescWithLogic =
            requestDetail.requestDetails.memoDetail.template_desc;
          // if (requestDetail.requestDetails.memoDetail.status === "Draft") {
          templateDescWithLogic = await prepareInitialLogic(
            logic,
            requestDetail.requestDetails.memoDetail.template_desc,
            requestDetail.requestDetails.memoDetail.status
          );
          // }

          const _template = await detechRevisionControl(
            _templateId,
            templateDescWithLogic
          );
          const autoNum = detechAutonumberFormula(_template);

          console.log("auto=>autoNum", autoNum);

          if (_isCopy) {
            if (autoNum.rowIndex !== -1) {
              const _control = await genAutoNum(
                _template.items,
                autoNum,
                requestDetail.requestDetails.memoDetail.template_id
              );
              if (_control) {
                setDefaultTemplateDesc(_control);

                // reset({
                //   items: _control,
                // });
              }
            } else {
              setDefaultTemplateDesc(_template.items);
            }
          }
          // reset({
          //   items: _template.items,
          // });
          setDefaultTemplateDesc(_template.items);
          setIsTextFromValue(false);
        }
        if (_isCopy) {
          requestDetail = {
            ...requestDetail,
            requestDetails: {
              ...requestDetail.requestDetails,
              memoDetail: {
                ...requestDetail.requestDetails.memoDetail,
                memoid: 0,
                status: "New Request",
                document_no: "Auto Generate",
                copyInformation: "Y",
                creator: userData,
                requestor: userData,
                current_approval_level: 0,
                request_date: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                modified_date: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                created_date: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                modified_by: userData.EmployeeId.toString(),
                created_by: userData.EmployeeId.toString(),
              },
              listHistoryDetails: [],
            },
          };

          setCheckActionPage("add");
        }
      }
      //add
      else if (_memoId === 0) {
        const dataJson = {
          Username: userData.Username,
          DepartmentId: Number(userData.DepartmentId),
          EmployeeId: Number(userData.EmployeeId),
          Email: userData.Email,
          selectAll: false,
          DefultMode: false,
          OnlyActive: true,
        };

        dataGetInformationMethodMemoProp(
          requestDetail.requestDetails.listFormNames[0],
          requestDetail.requestDetails.memoDetail
        );
        setCheckActionPage("add");

        if (_isTextForm) {
          setTextFromValue(
            requestDetail.requestDetails.listFormNames[0].TextForm
          );
          setIsTextFromValue(true);
        } else {
          requestDetail = {
            ...requestDetail,
            requestDetails: {
              ...requestDetail.requestDetails,
              memoDetail: {
                ...requestDetail.requestDetails.memoDetail,
                template_desc: requestDetail.requestDetails.listFormNames[0]
                  .AdvanceForm
                  ? {
                      items: JSON.parse(
                        requestDetail.requestDetails.listFormNames[0]
                          .AdvanceForm
                      ).items.map((item: any) => {
                        return {
                          ...item,
                          layout: item.layout.map((_layout: any) => {
                            return {
                              ..._layout,
                              isShow: true,
                            };
                          }),
                        };
                      }),
                    }
                  : {},
              },
            },
          };
          console.log({
            requestDetail,
          });

          const templateDescWithLogic = await prepareInitialLogic(
            logic,
            requestDetail.requestDetails.memoDetail.template_desc
          );

          const _template = await detechRevisionControl(
            _templateId,
            templateDescWithLogic
          );
          const autoNum = detechAutonumberFormula(_template);

          if (
            requestDetail.requestDetails.memoDetail.status === "New Request" ||
            _isCopy
          ) {
            console.log("auto=>autoNum", autoNum);

            if (autoNum.rowIndex !== -1) {
              const _control = await genAutoNum(
                _template.items,
                autoNum,
                requestDetail.requestDetails.memoDetail.template_id
              );
              if (_control) {
                setDefaultTemplateDesc(_control);
              }
            } else {
              setDefaultTemplateDesc(_template.items);
            }
          }
          setIsTextFromValue(false);
        }
      }

      detechFormulas(requestDetail.requestDetails.memoDetail.template_desc);
      if (_isPreview) {
        setCheckActionPage("preview");
      }
      if (hasQueryUserId) {
        requestDetail.requestDetails.memoDetail.creator = userDataByQuery;
        requestDetail.requestDetails.memoDetail.requestor = userDataByQuery;
      }
      checkTemplateVersion(
        requestDetail.requestDetails.listFormNames[0],
        requestDetail.requestDetails.memoDetail
      );
      checkState(
        requestDetail.requestDetails.memoDetail.status,
        requestDetail.requestDetails.listFormNames[0],
        memoButtons
      );

      checkLeaveRequestTemplate(
        requestDetail.requestDetails.memoDetail.template_code
      );
      checkDataAndSetFunction(requestDetail.requestDetails.memoDetail);
      replaceTitleInfo(requestDetail.requestDetails.memoDetail);
      getLineApproveAtFirsts(requestDetail.requestDetails.memoDetail, _isCopy);
      setMemoDetail(requestDetail.requestDetails.memoDetail);
      setRequestor(requestDetail.requestDetails.memoDetail.requestor);
      setCreator(requestDetail.requestDetails.memoDetail.creator);

      setLineApproval([...requestDetail.requestDetails.listApprovalDetails]);
      setListHistoryDetails([
        ...requestDetail.requestDetails.listHistoryDetails,
      ]);
      setListFileAttachDetails([
        ...requestDetail.requestDetails.listFileAttachDetails,
      ]);

      setListRefDocDetails([...requestDetail.requestDetails.listRefDocDetails]);
      setListFormNames(requestDetail.requestDetails.listFormNames[0]);

      createTableSums(requestDetail.requestDetails.memoDetail.template_desc);
      // setRefTempSelected([]);
      setAllLogic([...logic]);
      setSelectedView("2");
      setCurPage("2");

      setLoad(false);
      if (isFirstRun.current) {
        isFirstRun.current = false;
        console.log("Effect was run 1");
      }
      console.log("finfo", finFo);
    } catch (error) {
      setLoad(false);
      console.log("Request=>error", error);
    }
    setRequestActionMemo(true);
  };
  const setDefaultTemplateDesc = (template: any) => {
    let templateItems = template;

    if (templateItems) {
      for (let i = 0; i < templateItems.length; i++) {
        const item = templateItems[i];
        for (let j = 0; j < item.layout.length; j++) {
          const layout = item.layout[j];
          const templateType = layout.template.type;
          console.log({ layout });

          if (
            templateType === "t" ||
            templateType === "ta" ||
            templateType === "c"
          ) {
            if (!layout.data.value) {
              templateItems[i].layout[j].data.value =
                layout.template.attribute.default;
            }
          } else if (templateType === "dd") {
            if (
              !layout.data.value &&
              templateItems[i].layout[j].template.attribute.items &&
              templateItems[i].layout[j].template.attribute.items.length > 0
            ) {
              templateItems[i].layout[j].data.value =
                layout.template.attribute.items[0].item;
            }
          }
        }
      }
    }
    console.log({ templateItems });

    reset({
      items: templateItems,
    });
  };

  const getLineApproveForAmount = async (
    amount: number,
    jsonCondition?: string,
    logicType?: string,
    template?: any,
    _requestor?: any
  ) => {
    try {
      console.log("logic=>", { logicType, jsonCondition, amount, memoDetail });

      if (logicType === "ref") {
        setMemoDetail((prevState: any) => ({
          ...prevState,
          amount: Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        }));
      } else if (!isNaN(amount) && !logicType && logicType !== "ref") {
        setMemoDetail((prevState: any) => ({
          ...prevState,
          amount: Number(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        }));
      }

      if (
        (memoDetail &&
          (template?.type === "c" ||
            template?.type === "tb" ||
            ((template?.type === "t" ||
              template?.type === "dd" ||
              template?.type === "r" ||
              template?.type === "cb") &&
              logicType === "datalineapprove"))) ||
        logicType === "requestor"
      ) {
        setIsControlLoading(true);

        let doa: any;
        let loc: any;
        let spc: any;
        let dtp: any;
        const dataJson = {
          employee: _requestor ? _requestor : memoDetail.requestor,
          ComCode: memoDetail.company_id,
          JsonCondition: jsonCondition ? jsonCondition : jsonConditions,
          templateForm: {
            ...memoDetail,
            TemplateApproveId: 0,
            template_desc: JSON.stringify(memoDetail.template_desc),
          },
          lstTRNLineApprove: [],
          Amount: amount,
        };
        const dataJsonApproverType = {
          TemplateId: memoDetail.template_id,
        };
        console.log("ref=>", {
          dataJsonApproverType,
          jsonCondition,
          jsonConditions,
          dataJson,
        });
        const approverType = await onLoadLiveApproveType(dataJsonApproverType);
        const responseDataLineApprove = await onLoadDataLiveApprove(dataJson);

        if (approverType) {
          doa = approverType.find((line: any) => line.ApproveType === 21);
          loc = approverType.find((line: any) => line.ApproveType === 19);
          spc = approverType.find((line: any) => line.ApproveType === 20);
          dtp = approverType.find((line: any) => line.ApproveType === 22);
        }

        if (responseDataLineApprove) {
          if (doa || loc || spc || dtp) {
            setLineApproval([...responseDataLineApprove]);
          } else if (!(doa || loc || spc || dtp) && jsonCondition) {
            setLineApproval([...responseDataLineApprove]);
          }
        }
        console.log("dddddddddddd");

        setIsControlLoading(false);
      }
      if (jsonCondition) {
        setJsonConditions(jsonCondition);
      }

      console.log("isSum=>amount", amount);
    } catch (error) {
      console.log("LineApprove=>error", error);
    }
  };

  const getLineApproveAtFirsts = async (_memoDetail: any, _isCopy: boolean) => {
    try {
      if (_memoDetail.memoid === 0 && !_isCopy) {
        const dataJson = {
          employee: _memoDetail.requestor,
          ComCode: _memoDetail.company_id,
          JsonCondition: jsonConditions,
          templateForm: {
            ..._memoDetail,
            TemplateApproveId: 0,
            template_desc: JSON.stringify(_memoDetail.template_desc),
          },
          lstTRNLineApprove: [],
          Amount: 0,
        };

        const responseDataLineApprove = await onLoadDataLiveApprove(dataJson);
        console.log("line=>getLineApproveAtFirsts", responseDataLineApprove);

        setLineApproval([...responseDataLineApprove]);
      }
    } catch (error) {
      console.log("LineApprove=>error", error);
    }
  };

  const onLoadDataLiveApprove = async (dataJson: any) => {
    const respone = await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadLineApproveFormControl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((response) => response.json())
      .then(
        (data) => {
          return data;
        }
        // console.log("load", data)
      )
      .catch((err: any) => console.log({ errerrerr: err }));
    return respone;
  };
  const onLoadLiveApproveType = async (dataJson: any) => {
    const respone = await fetch("api/LineApprove/GetLineApproveType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJson),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err: any) => console.log({ errerrerr: err }));
    return respone;
  };
  const detechFormulas = (templateDesc: any) => {
    let _formulas: any[] = [];
    let isSummary: boolean = false;
    let total = 0;
    for (let i = 0; i < templateDesc?.items?.length; i++) {
      const templateItems = templateDesc?.items[i];
      for (let j = 0; j < templateItems.layout.length; j++) {
        const layout = templateItems.layout[j];
        let formu: INumberFormula;
        if (layout.template.type === "c") {
          if (
            layout.template.attribute.formula !== "" &&
            layout.template.attribute.formula !== null
          ) {
            formu = {
              formula: layout.template.attribute.formula,
              rowIndex: i,
              colIndex: j,
            };
            _formulas.push(formu);
          }
          if (layout.template.attribute.summary === "Y") {
            isSummary = true;
          }
        } else if (layout.template.type === "tb") {
          layout.template.attribute.column.forEach(
            (col: any, colIndex: number) => {
              if (col.control.template.type === "c") {
                if (col.control.template.attribute.summary === "Y") {
                  isSummary = true;
                }
              }
            }
          );
        }
      }
    }

    setIsShowSum(isSummary);
    setNumFormulas([..._formulas]);
  };

  const detechAutonumberFormula = (templateDesc: any) => {
    let _autoFormats: IAutoNumberAttibute = {
      formats: [],
      showSymbol: true,
      digit: 0,
      rowIndex: -1,
      colIndex: -1,
    };

    try {
      templateDesc.items.forEach((item: any, rowIdx: number) => {
        item.layout.forEach((layout: any, colIdx: number) => {
          if (layout.template.type === "an") {
            _autoFormats.formats = layout.template.attribute.formats;
            _autoFormats.showSymbol = !layout.template.alter.includes("|");
            _autoFormats.digit = layout.template.digit;
            _autoFormats.rowIndex = rowIdx;
            _autoFormats.colIndex = colIdx;
          }
        });
      });

      setAutoNumFormat(_autoFormats);
      return _autoFormats;
    } catch (error) {
      console.log("auto=>error", error);
      return _autoFormats;
    }
  };

  const detechRevisionControl = async (_templateId: any, templateDesc: any) => {
    try {
      let requestBody: any = {};
      let items: any[] = [];
      let rowIndex = -1;
      let colIndex = -1;

      templateDesc.items.forEach((item: any, rowIdx: number) => {
        item.layout.forEach((layout: any, colIdx: number) => {
          if (layout.template.type === "rvs") {
            requestBody.TemplateId = _templateId;
            requestBody.RefId = 0;
            requestBody.Digit = layout.template.attribute.digit;
            requestBody.Labelrevision = layout.template.label;
            requestBody.Alter = layout.template.alter;

            if (layout.template.attribute.conditions.length > 0) {
              layout.template.attribute.conditions.map((con: any) => {
                templateDesc.items.map((item: any, rowIdx: number) => {
                  item.layout.map((layout: any, colIdx: number) => {
                    if (con.label === layout.template.label) {
                      items.push({
                        Label: con.label,
                        value: layout.data.value,
                      });
                    }
                  });
                });
              });
            }

            requestBody.MemoId = null;
            requestBody.Itemlabel = items;
            rowIndex = rowIdx;
            colIndex = colIdx;
          }
        });
      });

      if (rowIndex !== -1 && colIndex !== -1) {
        const revision = await GetRvsRunning(requestBody);
        if (
          revision.item >
          templateDesc.items[rowIndex].layout[colIndex].data.value
        ) {
          templateDesc.items[rowIndex].layout[colIndex].data.value =
            revision.item;
        }
      }

      return templateDesc;
    } catch (error) {
      console.log("rvs=>error", error);
    }
  };

  const prepareInitialLogic = async (
    logics: ILogic[],
    templateDesc: any,
    memoStatus?: string
  ) => {
    let dataGroup: any = [];
    let dataSourceLoadGroup: any[] = [];
    let dataSourceRelatedToLoadGroup: any[] = [];
    let showTemplate: {
      isShow: boolean;
      pos: { row: number; col: number }[];
    } = { isShow: true, pos: [] };
    let eiei = JSON.stringify(templateDesc);
    console.log({ templateDesctemplateDesc: templateDesc });

    let _templateDesc = JSON.parse(eiei);
    _templateDesc = {
      items: _templateDesc.items.map((item: any) => {
        return {
          ...item,
          layout: item.layout.map((_layout: any) => {
            return {
              ..._layout,
              isShow: true,
            };
          }),
        };
      }),
    };
    for (let i = 0; i < logics?.length; i++) {
      const logic = logics[i];
      console.log("logic=>", logic);

      if (logic.logictype === "datasourceload") {
        const jsonValue: any =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue);

        for (let i = 0; i < _templateDesc.items.length; i++) {
          const templateItems = _templateDesc.items[i];
          for (let j = 0; j < templateItems.layout.length; j++) {
            const _layout = templateItems.layout[j];
            if (_layout.template.type !== "tb") {
              if (_layout.template.label === jsonValue.label) {
                dataSourceLoadGroup.push({
                  isInTable: false,
                  col: j,
                  row: i,
                  data: logic.logicid,
                  jsonValue: logic.jsonvalue,
                });
              }
            } else {
              for (
                let k = 0;
                k < _layout.template.attribute.column.length;
                k++
              ) {
                const column = _layout.template.attribute.column[k];
                if (column.label === jsonValue.label) {
                  console.log({ logic });

                  dataSourceLoadGroup.push({
                    isInTable: true,
                    col: j,
                    row: i,
                    tableColumn: k,
                    data: logic.logicid,
                    jsonValue: logic.jsonvalue,
                  });
                }
              }
            }
          }
        }
      } else if (logic.logictype === "role") {
        const jsonValue: ILogicTypeShowHide =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue);

        if (jsonValue.roleids && jsonValue.roleids.length > 0) {
          let userRole: IRolePermission[] = [];
          const roles: IRolePermission[] = await GetRolePermission();
          for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            if (role.EmployeeId === userData.EmployeeId) {
              userRole.push(role);
            }
          }
          const isShow = onCheckUserRolePermissionInLogic(
            userRole,
            jsonValue.roleids
          );
          showTemplate.isShow = isShow;
          console.log({ roles, isShow });
        }
        if (jsonValue.fieldaction) {
          for (let i = 0; i < _templateDesc.items.length; i++) {
            const templateItems = _templateDesc.items[i];
            for (let j = 0; j < templateItems.layout.length; j++) {
              const templateLayouts = templateItems.layout[j];
              for (let k = 0; k < jsonValue.fieldaction.length; k++) {
                const field = jsonValue.fieldaction[k];

                if (field.lable == templateLayouts.template.label) {
                  showTemplate.pos.push({
                    row: i,
                    col: j,
                  });
                }
              }
            }
          }
        }
      } else if (logic.logictype === "reference") {
        let responseData: {
          loadTo: any[];
          data: any[];
          row: number;
          col: number;
        } | null = null;
        JSON.parse(logic.jsonvalue);

        for (let i = 0; i < _templateDesc.items.length; i++) {
          const templateItems = _templateDesc.items[i];

          for (let j = 0; j < templateItems.layout.length; j++) {
            const _layout = templateItems.layout[j];
            responseData = await onProcessLogicReference(
              logic,
              _layout.template,
              _layout.data.value,
              _templateDesc.items
            );
            if (responseData) {
              const permittedValues = responseData.data.map(function (
                value: any
              ) {
                let res: any = {};
                for (let i = 0; i < responseData!.loadTo.length; i++) {
                  const field = responseData!.loadTo[i];
                  res[field["TBColumn"]] = value[field["MSTColumn"]];
                }
                return res;
              });
              let resRow: any[] = [];
              if (permittedValues) {
                for (let i = 0; i < permittedValues.length; i++) {
                  const perValue = permittedValues[i];
                  let colData = new Array(
                    templateDesc?.items[responseData.row].layout[
                      responseData.col
                    ].template.attribute.column.length
                  ).fill({ value: "" });
                  for (const [key, value] of Object.entries(perValue)) {
                    for (
                      let j = 0;
                      j <
                      templateDesc?.items[responseData.row].layout[
                        responseData.col
                      ].template.attribute.column.length;
                      j++
                    ) {
                      const _tableCol =
                        templateDesc?.items[responseData.row].layout[
                          responseData.col
                        ].template.attribute.column[j];

                      if (_tableCol.label === key) {
                        colData[j] = { value };
                      }
                    }
                  }
                  resRow.push(colData);
                }
                console.log({
                  memoStatus,
                  rowLength:
                    _templateDesc.items[responseData.row].layout[
                      responseData.col
                    ].data.row,
                });

                if (
                  resRow.length > 0 &&
                  (!_templateDesc.items[responseData.row].layout[
                    responseData.col
                  ].data.row ||
                    _templateDesc.items[responseData.row].layout[
                      responseData.col
                    ].data?.row?.length === 0)
                ) {
                  _templateDesc.items[responseData.row].layout[
                    responseData.col
                  ].data.row = [...resRow];
                }
              }
            }
            console.log({ responseData });
          }
        }
      } else if (logic.logictype === "datareladtoloaddata") {
        const jsonValue: ILogicTypeReladToLoadData =
          logic.jsonvalue &&
          logic.jsonvalue.length > 0 &&
          JSON.parse(logic.jsonvalue);
        let newTableOptions: {
          loadtoLabel: string;
          options: any[];
        } = { loadtoLabel: jsonValue.autoloadvaluelabel.label, options: [] };
        for (let i = 0; i < _templateDesc.items.length; i++) {
          const templateItems = _templateDesc.items[i];
          for (let j = 0; j < templateItems.layout.length; j++) {
            const _layout = templateItems.layout[j];
            if (_layout.template.type === "tb") {
              for (
                let l = 0;
                l < _layout.template.attribute.column.length;
                l++
              ) {
                const tbCol = _layout.template.attribute.column[l];
                if (
                  tbCol.control.template.label === newTableOptions.loadtoLabel
                ) {
                  if (_layout.data) {
                    if (_layout.data.row) {
                      console.log(
                        "newTableOptions=>",
                        newTableOptions,
                        _layout.data
                      );
                      newTableOptions.options = new Array(
                        _layout.data.row?.length
                      ).fill([]);
                    }
                  }
                }
              }
            }
          }
        }
        // if (newTableOptions.options.length > 0) {
        //   setTableOptions({ ...newTableOptions });
        // }
      }
    }
    if (dataSourceLoadGroup.length > 0) {
      dataGroup.push({
        type: "datasourceload",
        dataGroup: dataSourceLoadGroup,
      });
    }
    console.log({ dataGroup });

    const initialLogicData: any[] = await getInitialLogicData(dataGroup);

    for (let i = 0; i < initialLogicData.length; i++) {
      const logicData = initialLogicData[i];
      const processData = formatKeyLogicData(logicData);
      if (!logicData.isInTable) {
        _templateDesc.items[processData.row].layout[
          processData.col
        ].template.attribute.items = processData.data;
      } else {
        _templateDesc.items[processData.row].layout[
          processData.col
        ].template.attribute.column[
          processData.tableColumn
        ].control.template.attribute.items = processData.data;
      }
    }

    if (!showTemplate.isShow && showTemplate.pos.length > 0) {
      for (let i = 0; i < showTemplate.pos.length; i++) {
        const pos = showTemplate.pos[i];

        _templateDesc.items[pos.row].layout[pos.col].isShow = false;
      }
    }
    console.log({ _templateDesc });
    return _templateDesc;
  };
  const getInitialLogicData = async (dataGroup: any) => {
    let dataSourceLoad: any = [];
    const dataSourceLoadGroup: any[] = dataGroup.filter(
      (group: any) => group.type === "datasourceload"
    );
    console.log({ dataSourceLoadGroup });

    if (dataSourceLoadGroup.length > 0) {
      dataSourceLoad = await onDataSourceLoad(dataSourceLoadGroup);
    }
    return [...dataSourceLoad];
  };

  const onDatareladToLoadData = async (dataJson: any) => {
    const response = await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadDataFormControl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch(() => false);
    return response;
  };

  const onCheckUserRolePermissionInLogic = (
    userRoles: IRolePermission[],
    accessRoles: {
      id: number;
    }[]
  ): boolean => {
    for (let i = 0; i < userRoles.length; i++) {
      const userRole = userRoles[i];
      for (let j = 0; j < accessRoles.length; j++) {
        const accessRole = accessRoles[j];
        if (userRole.RoleId === Number(accessRole.id)) {
          return true;
        }
      }
    }
    return false;
  };
  const onFilterLoadtoField = (label: string, templateDesc: any) => {
    for (let i = 0; i < templateDesc.length; i++) {
      const item = templateDesc[i];
      for (let j = 0; j < item.layout.length; j++) {
        const layout = item.layout[j];
        if (layout.template.label === label) {
          return { row: i, col: j };
        }
      }
    }
  };
  const onFilterRefFilterField = (
    refFilter: ILogicReferenceField[],
    currentFieldValue: any
  ) => {
    let _refFilter: ILogicReferenceField[] = [];

    for (let i = 0; i < currentFieldValue.length; i++) {
      const item = currentFieldValue[i];
      for (let j = 0; j < item.layout.length; j++) {
        const layout = item.layout[j];
        for (let i = 0; i < refFilter.length; i++) {
          const _ref = refFilter[i];
          if (_ref.TBColumn === layout.template.label) {
            _refFilter.push({
              MSTColumn: _ref.MSTColumn,
              TBColumn: layout.data.value,
            });
          }
        }
      }
    }
    return _refFilter;
  };
  const onLoadReferenceData = async (dataJson: {
    jsonValue: ILogicTypeReference;
    refFilter: ILogicReferenceField[];
  }) => {
    let orCondition = "";
    const refFilterValueEqualComlumAll = dataJson.refFilter.filter(
      (_ref) => _ref.MSTColumn === dataJson.jsonValue.ColumnAll
    );
    if (refFilterValueEqualComlumAll.length > 0) {
      for (let i = 0; i < refFilterValueEqualComlumAll.length; i++) {
        const ref = refFilterValueEqualComlumAll[i];
        orCondition = `(${ref.MSTColumn}='${ref.TBColumn}' OR ${dataJson.jsonValue.ColumnAll}='All')`;
      }
    }

    let condition = "";

    let refFilterValue: ILogicReferenceField[] = dataJson.refFilter;

    for (let i = 0; i < refFilterValue.length; i++) {
      const ref = refFilterValue[i];
      if (i !== refFilterValue.length - 1) {
        condition = condition + ref.MSTColumn + "='" + ref.TBColumn + "' AND ";
      } else {
        condition = condition + ref.MSTColumn + "='" + ref.TBColumn + "'";
      }
    }

    const _dataJson = {
      ...dataJson.jsonValue,
      orCondition,
      condition,
    };
    console.log({
      dataJson,
      refFilterValue,
      orCondition,
      condition,
      refFilterValueEqualComlumAll,
    });

    const dataSource = await fetch(
      "api/TemplateList/TemplateByid/LoadLogic/GetLoadDataFormControlRef",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_dataJson),
      }
    )
      .then((response) => response.json())
      .then((data: any) => {
        return data;
      });
    return dataSource;
  };
  const onProcessLogicReference = async (
    logic: ILogic,
    controlTemplate: any,
    controlValue: any,
    control: any
  ) => {
    let responseDataReference: {
      loadTo: any[];
      data: any[];
      row: number;
      col: number;
    } | null = {
      loadTo: [],
      data: [],
      row: -1,
      col: -1,
    };
    const jsonValue: ILogicTypeReference =
      logic.jsonvalue &&
      logic.jsonvalue.length > 0 &&
      JSON.parse(logic.jsonvalue);
    console.log({ control, jsonValue, controlTemplate });

    const loadTo = onFilterLoadtoField(jsonValue.label, control);
    const refFilter = onFilterRefFilterField(jsonValue.Filter, control);

    if (
      refFilter.length > 0 &&
      loadTo &&
      jsonValue.Filter.filter((_ref) => _ref.TBColumn === controlTemplate.label)
        .length > 0
    ) {
      const dataJson = {
        jsonValue,
        refFilter,
      };
      const refData: { DT: any[] } = await onLoadReferenceData(dataJson);
      responseDataReference.data = refData.DT;
      responseDataReference.col = loadTo.col;
      responseDataReference.row = loadTo.row;
      responseDataReference.loadTo = jsonValue.Column;
      return responseDataReference;
    }
    return null;
  };
  const onControlChange = async (
    controlName: any,
    controlValue: any,
    controlUpdate: any
  ) => {
    if (controlValue === "FA | Financial and Accounting") {
      const _controlString = JSON.stringify(getValues("items"));
      let _control = JSON.parse(_controlString);
      _control[1].layout[1].data.value = "100";
      controlUpdate(1, {
        ..._control[1],
        layout: [..._control[1].layout],
      });
      console.log({ controlName, controlValue, _control });
    }
  };
  const onDataSourceLoad = async (dataGroup: any) => {
    let responseGroup: any[] = [];

    for (let i = 0; i < dataGroup.length; i++) {
      const dataSource: any = dataGroup[i].dataGroup;
      let dataJson: any[] = [];

      for (let j = 0; j < dataSource.length; j++) {
        let jsonValue: any = JSON.parse(dataSource[j].jsonValue);

        await fetch(
          "api/TemplateList/TemplateByid/LoadLogic/GetLoadDataFormControl",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              logicid: dataSource[j].data,
              Key: jsonValue.SQLCommand ? "Requestor id" : "",
              Value: jsonValue.SQLCommand ? userData.EmployeeId.toString() : "",
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("logic=>data", data);

            if (!dataSource[j].isInTable) {
              responseGroup.push({
                isInTable: dataSource.isInTable,
                data: data,
                row: dataSource[j].row,
                col: dataSource[j].col,
              });
            } else {
              responseGroup.push({
                isInTable: dataSource[j].isInTable,
                tableColumn: dataSource[j].tableColumn,
                data: data,
                row: dataSource[j].row,
                col: dataSource[j].col,
              });
            }
          });
      }

      console.log("logic=>dataJson", dataJson);
    }
    console.log("logic=>responseGroup", responseGroup);

    return responseGroup;
  };
  useEffect(() => {
    if (!isEmptyObject(requestor)) {
      checkedLeaveTemplateLogic(requestor);
    }
  }, [requestor]);
  async function checkedLeaveTemplateLogic(_requestor: any) {
    console.log("leave=>", _requestor);

    if (checkedLeaveTemplate) {
      var _responeData = await GetLeaveTemplateByEmpId(_requestor.EmployeeId);
      console.log(_responeData, "_responeData");

      setLeaveTypeTable(_responeData);
    }
  }
  async function renderSelectedRequestor(_requestor: any) {
    try {
      if (
        checkActionPage &&
        (checkActionPage === "add" || checkActionPage === "preview")
      ) {
        getLineApproveForAmount(
          Number(memoDetail.amount.replaceAll(",", "")),
          undefined,
          "requestor",
          undefined,
          _requestor
        );
      }
    } catch (error) {
      console.log("renderSelectedRequestor=>error", error);
    }
  }

  async function checkTemplateVersion(listFormName: any, memoDetail: any) {
    if (listFormName.IsFormControl) {
      const _templateApproveId = Number(memoDetail.TemplateApproveId);
      let _listTemplate = await SearchTemplateListEditing({
        TemplateId: null,
        CreatedBy: userData.EmployeeId.toString(),
      });
      let _dataVersionTempVC = await getVersionTempVC();
      let arrayEditingVersion = [];
      let arrayEditing = [];
      for (let i = 0; i < _listTemplate.length; i++) {
        const element = _listTemplate[i];
        for (let j = 0; j < _dataVersionTempVC.length; j++) {
          const _element = _dataVersionTempVC[j];
          if (_element.value1 === element.DocumentCode) {
            if (_element.value3 === "Editing")
              arrayEditingVersion.push(element);
          }
        }
      }

      setTemplateListVersion(arrayEditingVersion);
      let _responseTemplate: any;
      if (memoDetail.TemplateApproveId) {
        _responseTemplate = await SearchTemplateListEditing({
          TemplateId: _templateApproveId,
        });
        if (_responseTemplate) {
          _responseTemplate = await GetTemplateById({
            TemplateId: _templateApproveId,
          });
        }
        console.log("_responseTemplate", _responseTemplate);

        if (_responseTemplate[0]) {
          setSelectedTemplateVersion(_responseTemplate[0]);
        } else {
          setSelectedTemplateVersion(_responseTemplate);
        }
      }
      setIsTemplateVersion(true);
    }
  }

  const checkLeaveRequestTemplate = async (template_code: string) => {
    var _lRTempCode = lRTempCode;
    if (_lRTempCode) {
      for (let index = 0; index < _lRTempCode.length; index++) {
        if (_lRTempCode[index].Value1 === template_code) {
          setCheckedLeaveTemplate(true);
        } else {
          setCheckedLeaveTemplate(false);
        }
      }
    }
  };
  const replaceTitleInfo = async (memoDetail: IMemoDetailModel) => {
    var _responeADTitle = await ADTitleConfiguration();
    if (_responeADTitle?.activeBranchFromADTitle?.toLowerCase() === "true") {
      setIsBranchFromADTitle(true);
    }
    if (_responeADTitle?.activeADTitleToPosition?.toLowerCase() === "false") {
      if (memoDetail?.requestor?.ADTitle) {
        setIsADTitleToPosition(true);
      }
    }
  };
  const checkDataAndSetFunction = async (memoDetail: IMemoDetailModel) => {
    if (!memoDetail.template_detail || !memoDetail.document_set) {
      const _guid = generateQuickGuid();
      memoDetail.template_detail = _guid;
      memoDetail.document_set = _guid;
    }

    if (memoDetail.memoid === 0) {
      if (masterCompanies.length === 1) {
        let com_name = masterCompanies[0].CompanyCode + " : ";
        if (userData.Lang === "EN") {
          com_name = com_name + masterCompanies[0].NameEn;
        } else {
          com_name = com_name + masterCompanies[0].NameTh;
        }
        memoDetail.company_name = com_name;
        memoDetail.company_id = masterCompanies[0].CompanyId;
      }
    }

    if (memoDetail.project_id !== 0) {
      masterProjects.map((_item: any) => {
        if (memoDetail.project_id === _item.ProjectId) {
          setProject(_item);
        }
      });
    }
    if (memoDetail.to) {
      const _spited = memoDetail.to.split(",");
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        to: _spited,
      }));
    }
    if (memoDetail.pass) {
      const _spited = memoDetail.pass.split(",");
      setListInToAndPass((prevState: any) => ({
        ...prevState,
        pass: _spited,
      }));
    }
  };
  const checkState = (
    memoStatus: string,
    listFormName: any,
    memoButtons: any[]
  ) => {
    if (
      memoStatus === "Draft" ||
      memoStatus === "New Request" ||
      memoStatus === "Rework" ||
      memoStatus === "Recall"
    ) {
      setCanEditDoc(true);
      setCanEditRefDoc(true);
      if (listFormName.IsRequesterEditApproval) {
        setCanEditLineApprove(listFormName.IsRequesterEditApproval);
      }
    } else if (
      memoStatus === "Completed" ||
      memoStatus === "Reject" ||
      memoStatus === "Cancel"
    ) {
      console.log({ memoButtons });
      if (memoButtons.length > 0) {
        setCanEditDoc(true);
      }
      setCanEditLineApprove(false);
    } else {
      if (listFormName.ApproverCanEdit) {
        setCanEditDoc(true);
        if (listFormName.IsRequesterEditApproval) {
          setCanEditLineApprove(listFormName.IsRequesterEditApproval);
        }
      } else {
        setCanEditDoc(false);
      }
      if (listFormName.IsCheckAccess) {
        setIsCheckAccess(true);
      }
    }
  };

  async function checkRefTemplate(
    template: any,
    listRefDocDetails: any,
    refDocs: any,
    _RefID: string
  ) {
    const temp = template;

    try {
      if (temp) {
        if (temp?.RefDocDisplay && temp.RefTemplate) {
          let _refDoc: any[] = [];
          const display = temp?.RefDocDisplay.split(",");
          const _refTemplate = JSON.parse(temp.RefTemplate);
          console.log("ref=>refDocs", refDocs);

          if (display[2] !== "Information DocumentNo") {
            refDocs.map((ref: any) => {
              if (ref !== null) {
                if (display[2] !== "Information DocumentNo") {
                  let refTemp = JSON.parse(ref.MAdvancveForm);
                  refTemp.items.forEach((col: any, rowIdx: number) => {
                    col.layout.forEach((_layout: any, colIdx: number) => {
                      if (_layout.template.label === display[2]) {
                        if (_layout.template.type === "c") {
                          ref[display[2]] = Number(
                            _layout.data.value
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: Number(
                              _layout.template.attribute.decimal
                            ),
                          });
                        } else {
                          if (_layout.data.value) {
                            ref[display[2]] = _layout.data.value;
                          } else {
                            ref[display[2]] = "";
                          }
                        }
                      }
                    });
                  });

                  if (typeof ref[display[2]] === "string") {
                    _refDoc.push(ref);
                  }
                }
              }
            });
          } else {
            _refDoc = refDocs;
          }

          let refObject: any = {
            option: [],
            position: display[0],
            mode: display[1],
            optionLabel:
              display[2] !== "Information DocumentNo"
                ? display[2]
                : "DocumentNo",
            isDefaultLineApprove: _refTemplate[0].IsDefaultLineApprove,
            refIdOnQuery: null,
          };
          setRefOptions([..._refDoc.filter((e: any) => e)]);
          setRefAttribute({ ...refObject });
          console.log("ref=>listRefDocDetails", listRefDocDetails);
          if (_RefID !== "") {
            const results = refObject.option.filter(
              (refDoc: any) => refDoc.DocumentNo === _RefID
            );
            refObject.refIdOnQuery = _RefID;
            previousRefTempSelected.current = results;
            setRefTempSelected(results);
          } else if (listRefDocDetails?.length > 0) {
            const refDocsDetail: any[] = listRefDocDetails;
            // DAR-EDIT-2022-000001
            console.log("ref=>refObject.option", refObject.option);

            let results = refDocs.filter(
              (refDoc: any) =>
                refDocsDetail.find(
                  (docDetail: any) => docDetail.memoRefdoc_id === refDoc.MemoId
                ) || refDoc.DocumentNo === _RefID
              // refDocsDetail.some((docDetail: any) => {
              //   console.log("ref=>docDetail", docDetail);

              //   return docDetail.Document_no === refDoc.DocumentNo;
              // }) || refDoc.DocumentNo === _RefID
            );

            if (results.length === 0) {
              let dataJson: any[] = [];
              listRefDocDetails.forEach((e: any) => {
                userData.SignPicPath = "";
                dataJson.push({
                  memoid: e.memoid,
                  EmployeeId: userData.EmployeeId.toString(),
                  actor: userData,
                });
              });
              results = await GetMemoDetailOnlyById(dataJson);
              console.log(
                "results",
                display,
                results,
                display[2] !== "Information DocumentNo"
              );
              if (display[2] !== "Information DocumentNo") {
                results = results.map((ref: any) => {
                  if (ref !== null) {
                    if (display[2] !== "Information DocumentNo") {
                      let refTemp = JSON.parse(ref.template_desc);
                      refTemp.items.forEach((col: any, rowIdx: number) => {
                        col.layout.forEach((_layout: any, colIdx: number) => {
                          if (_layout.template.label === display[2]) {
                            if (_layout.template.type === "c") {
                              ref[display[2]] = Number(
                                _layout.data.value
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: Number(
                                  _layout.template.attribute.decimal
                                ),
                              });
                            } else {
                              if (_layout.data.value) {
                                ref[display[2]] = _layout.data.value;
                              } else {
                                ref[display[2]] = "";
                              }
                            }
                          }
                        });
                      });
                      console.log("results", results, ref, refDocsDetail);
                      if (typeof ref[display[2]] === "string") {
                        let res: any = {
                          MemoId: ref.memoid,
                          เลขที่เอกสาร: ref.document_no,
                          TemplateName: ref.template_name,
                          MemoSubject: ref.subject,
                        };
                        res[display[2]] = ref[display[2]];
                        return res;
                      }
                    }
                  }
                });
              }
            }

            previousRefTempSelected.current = results;

            setRefTempSelected(results);
          }

          setSearchRefDocData([..._refDoc]);
        } else {
          setRefTempSelected([]);
          setRefAttribute(undefined);
        }
      }
    } catch (error) {
      console.log("ref=>error", error);
    }
  }

  const print = () => {
    // console.log("---------------------MemoPage Value-----------------------");
    console.log("memoDetail=>", memoDetail);
    // console.log("checkActionPage=>", checkActionPage);
    // console.log({ errors });
    // console.log("lineApproval=>", lineApproval);
    console.log("listFormNames=>", listFormNames);
    // console.log("listHistoryDetails=>", listHistoryDetails);
    // console.log("listFileAttachDetails=>", listFileAttachDetails);
    // console.log("listRefDocDetails=>", listRefDocDetails);
    // console.log("---------------------RefDoc Attibute-----------------------");
    console.log("refAttibute=>", refAttribute);
    console.log("refTempSelected=>", refTempSelected);
    console.log("searchRefDocData=>", searchRefDocData);

    // console.log("---------------------MasterData-----------------------");
    // console.log("masterSignature=>", masterSignature);
    // console.log("validField", masterDataValidField);
    // console.log("masteProjects=>", masteProjects);
    // console.log("masteEmployee=>", masteEmployee);
    // console.log("masteCompanies=>", masteCompanies);
    // console.log("searchTemplateListEditing=>", searchTemplateListEditing);
    // console.log("menuButton=>", menuButton);
    console.log("allLogic=>", allLogic);
    // console.log("finFo=>", finFo);
    // console.log("listRefDocs=>", listRefDocs);
    // console.log("---------------------Can Edit-----------------------");
    // console.log("canEditDoc=>", canEditDoc);
    // console.log("table=>tableSummaries", tableSummaries);
    // console.log("autoNumFormat=>", autoNumFormat);
  };
  function dataGetInformationMethodMemoProp(
    listFormName: any,
    memoDetail: IMemoDetailModel
  ) {
    memoDetail.memoid = 0;
    memoDetail.request_date = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    memoDetail.created_date = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    memoDetail.status = "New Request";
    memoDetail.modified_date = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    memoDetail.modified_by = userData.EmployeeId.toString();
    memoDetail.created_by = userData.EmployeeId.toString();
    memoDetail.creator = userData;
    memoDetail.requestor = userData;
    memoDetail.report_lang = listFormName.ReportLang;
    memoDetail.auto_approve = listFormName.AutoApprove;
    memoDetail.auto_approve_when = listFormName.AutoApproveWhen;
    memoDetail.GroupTemplateName = listFormName.GroupTemplateName;
    memoDetail.template_id = listFormName.TemplateId;
    memoDetail.template_name = listFormName.TemplateName;
    memoDetail.template_code = listFormName.DocumentCode;
    memoDetail.document_no = "Auto Generate";
    memoDetail.waiting_for = userData.NameTh;
    memoDetail.waiting_for_id = userData.EmployeeId;
    memoDetail.company_name = "";
    memoDetail.company_id = 0;
    memoDetail.project_id = 0;
    memoDetail.project = "";
    memoDetail.subject = listFormName.TemplateSubject;
    memoDetail.amount = "";
    memoDetail.to = listFormName.ToId;
    memoDetail.pass = listFormName.CcId;
  }

  function toggleSideBar() {
    setSidebarState(!sidebarState);
  }

  const onSelectView = (text: string) => {
    console.log(text, "props.curPage");

    setCurPage(text);
    setSelectedView(text);
  };

  const createTableSums = (templateDesc: any) => {
    let sumIntable: any[] = [];
    templateDesc?.items?.forEach((item: any, rowIdx: number) => {
      item.layout.forEach((layout: any) => {
        if (layout.template.type === "tb") {
          const cols = layout.template.attribute.column;
          let sum: any = {};
          cols.forEach((e: any) => {
            if (e.control.template.type === "c") {
              sum[e.label] = 0;
            }
          });
          sumIntable.push({ tableTemp: layout.template, AllCol: sum });
        }
      });
    });

    setTableSummaries([...sumIntable]);
  };

  function CheckValidField(formData: any) {
    const getCheckValid = [];
    let datepicker1: any;
    let datepicker2: any;
    let datepickerLabel1: any;
    let datepickerLabel2: any;
    // console.log("ValidG", formData, masterDataValidField);
    formData.items.map((item: any) => {
      item.layout.map((layout: any) => {
        if (layout.template.label === "กำหนดระยะเวลายืม ต่อ ตั้งแต่วันที่") {
          datepicker1 = layout;
          datepickerLabel1 = datepicker1.template.label;
        }
        if (layout.template.label === "ถึงวันที่") {
          datepicker2 = layout;
          datepickerLabel2 = datepicker2.template.label;
        }
      });
    });

    if (masterDataValidField) {
      try {
        const rr = masterDataValidField[0];
        if (rr) {
          const masterDataValid = rr.Value2.split("|");
          const masterDataLabel1 = masterDataValid[0].toString();
          const masterDataLabel2 = masterDataValid[1].toString();

          if (
            datepickerLabel1 === masterDataLabel1 &&
            datepickerLabel2 === masterDataLabel2
          ) {
            const newDate1 = new Date(datepicker1.data.value);
            const newDate2 = new Date(datepicker2.data.value);
            getCheckValid.push(newDate1, newDate2);
          }
        }
      } catch (error) {
        console.log("masterDataValid=>error", error);
      }
    }
    return getCheckValid;
  }

  const onSubmit = async (formData: any, data: IRequestOnSubmit) => {
    // variables RequestScreen
    console.log(formData, "formData");
    console.log(data, "formData");
    console.log("template", templateDescrip);
    console.log("val=>templateDescrip", templateDescrip);

    const _submitType = data.buttonType;
    let _memoDetail: IMemoDetailModel = memoDetail;
    let _lineApproval: any[] = lineApproval;
    let _listHistoryDetails: any[] = listHistoryDetails;
    let _listFileAttachDetails: any[] = listFileAttachDetails;
    let _listRefDocDetails: any[] = listRefDocDetails;
    let _listControlRunning: any[] = [];
    let _listFormNames = listFormNames;
    let _userData: IUserModel = userData;
    // variables Information
    let _listInToAndPass: any = listInToAndPass;
    let _project: any = project;
    let _tempVersion: any = selectedTemplateVersion;
    const rr = masterDataValidField[0];

    const _validation = Validation(_submitType, memoDetail, lineApproval);

    if (_validation.length >= 1) {
      toggleAlert({
        description: `Please fill ${_validation.join(" , ")}`,
        message: `Require field warning.`,
        type: "warning",
      });
      return;
    }
    setLoad(true);

    if (!isTextFromValue) {
      if (CheckValidField(formData)) {
        if (CheckValidField(formData)[0] > CheckValidField(formData)[1]) {
          toggleAlert({
            type: "error",
            message: "Require field error",
            description: rr.Value4,
            duration: 6,
          });
        }
      }

      formData.items.map((item: any) => {
        item.layout.map((layout: any) => {
          if (layout.data.value === null) {
            layout.data.value = layout.template?.attribute?.default;
          }
        });
      });

      const formatFormData = formData?.items?.map((item: any, idx: number) => {
        return {
          ...item,
          layout: item.layout?.map((_layout: any, idx2: number) => {
            if (_layout.template.type === "l") {
              return {
                ..._layout,
                template: {
                  ..._layout.template,
                  ["attribute"]: null,
                },
              };
            } else {
              return _layout;
            }
          }),
        };
      });

      _memoDetail.template_desc = JSON.stringify({ items: formatFormData });
    } else {
      _memoDetail.is_text_form = true;
      _memoDetail.template_desc = textFromValue;
    }

    //set Value
    _memoDetail.comment = data?.inputComment || "";
    _memoDetail.waiting_for = data?.waitingFor || _userData.NameTh;
    _memoDetail.waiting_for_id = data?.waitingForId || _userData.EmployeeId;
    _memoDetail.to = _listInToAndPass.to.join(",");
    _memoDetail.pass = _listInToAndPass.pass.join(",");
    _memoDetail.project_id = _project?.ProjectId || 0;
    _memoDetail.project = _project?.ProjectName || "";
    _memoDetail.TemplateApproveId = _tempVersion?.TemplateId || null;
    _memoDetail.actor = _userData;

    if (autoNumFormat.rowIndex !== -1 && _memoDetail.status === "New Request") {
      const runningNumber = await CheckSaveAutonumber(formData);
      if (runningNumber) {
        _listControlRunning.push(runningNumber);
      }
    }
    if (_listFormNames.IsCheckAccess) {
      if (_memoDetail?.actorCheckAccess) {
        const checkAccessRequestModel = {
          memoid: _memoDetail.memoid?.toString(),
          RequesterId: null,
        };

        const result = await SetCheckAcces(checkAccessRequestModel);
        if (canEditDoc) {
          setCanEditDoc(false);
        }
      }
    }

    const _requestMemoPage = {
      MemoPage: {
        listApprovalDetails: _lineApproval,
        listFileAttachDetails: _listFileAttachDetails,
        listFormName: [_listFormNames],
        listHistoryDetails: _listHistoryDetails,
        listRefDocDetails: _listRefDocDetails,
        memoDetail: _memoDetail,
        listControlRunning: _listControlRunning,
        UserPrincipalName: userData.Email,
      },
      Type: _submitType,
    };
    console.log("memo=>_requestMemoPage", _requestMemoPage);
    let _respone = await ActionMemoPage(_requestMemoPage);

    const _checkRespone = ResponeValidation(_respone);

    if (checkRequestActionMemo) {
      history.push("/RequestActionMemo");
    }
    //success
    else if (_checkRespone) {
      if (checkActionPage === "edit" && _submitType === "draft") {
        if (_memoDetail?.actorCheckAccess) {
          checkQuery();
        } else {
          const history = await GetMemoHistoryDetail({
            memoid: memoId,
            actor: userData,
          });
          setListHistoryDetails([...history]);
        }
        setLoadingPDF(!loadingPDF);
      } else {
        history.push("/Default", {
          responeData: _respone,
          msg: `${_submitType} Success`,
        });
      }
      setLoad(false);
    }
    // something is wrong
    else {
      toggleAlert({
        description: `${_respone.Message}`,
        message: `Submit error.`,
        type: "error",
      });
    }
    setLoad(false);
  };

  const IsCheckAccessEditing = () => {
    let isCheck = false;
    if (memoDetail?.actorCheckAccess?.EmployeeId === userData.EmployeeId) {
      isCheck = true;
    }
    return isCheck;
  };

  const CheckSaveAutonumber = async (template_desc: any) => {
    try {
      const rowIndex = autoNumFormat.rowIndex;
      const colIndex = autoNumFormat.colIndex;
      if (template_desc) {
        let value =
          template_desc?.items[rowIndex]?.layout[colIndex]?.data?.value;
        const autoTemp = template_desc?.items[rowIndex]?.layout[colIndex];
        if (value) {
          let requestBody = null;
          let newRunning = -1;
          if (autoNumFormat.showSymbol) {
            const dd = value.split("-");
            const gg = dd.slice(0, dd.length - 1);
            requestBody = {
              Prefix: gg.join("-") + "-",
              Digit: autoTemp.template.digit,
              TemplateId: memoDetail.template_id,
              RunningNumber: dd.join("-"),
            };

            const checkAuto = await GetSaveRunningNumber(requestBody);
            const checkNum = checkAuto.split("-");
            if (checkNum[0] !== "") {
              newRunning = checkNum[checkNum.length - 1];
              dd[dd.length - 1] = newRunning;
              requestBody.RunningNumber = gg.join("-") + "-" + newRunning;
            }
          } else {
            requestBody = {
              Prefix: autoNumFormat.fisrtPreix,
              Digit: autoTemp.template.digit,
              TemplateId: memoDetail.template_id,
              RunningNumber: value,
            };
            const checkAuto = await GetSaveRunningNumber(requestBody);
            const checkNum = checkAuto.replaceAll(autoNumFormat.fisrtPreix, "");
            let dd = value.replaceAll(autoNumFormat.fisrtPreix, "");
            if (checkNum !== "") {
              newRunning = checkNum;
              dd = newRunning;
              if (autoNumFormat?.fisrtPreix) {
                requestBody.RunningNumber =
                  autoNumFormat?.fisrtPreix + newRunning;
              }
            }
          }

          return requestBody;
        }
      }
    } catch (error) {
      console.log("auto=>CheckSaveAutonumber=>error", error);
    }
  };

  return (
    <div className="request-main-container">
      <div className="request-container">
        <Toast ref={toast} />
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
          {!isLoad && (
            <div
              className={
                memoDetail?.actorCheckAccess
                  ? IsCheckAccessEditing()
                    ? "confirm-container"
                    : "checkaccess-container"
                  : "confirm-container"
              }
            >
              {checkActionPage === "add" && (
                <div className="memo-button-container">
                  <MemoSingleButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    pageName={"Request"}
                    type="submit"
                    buttonType={buttonType}
                    setButtonType={setButtonType}
                    setSelectedView={setSelectedView}
                    setCurPage={setCurPage}
                  />
                  <MemoSingleButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    pageName={"Request"}
                    type="draft"
                    buttonType={buttonType}
                    setButtonType={setButtonType}
                    setSelectedView={setSelectedView}
                    setCurPage={setCurPage}
                  />
                </div>
              )}

              {((checkActionPage === "edit" && !memoDetail?.actorCheckAccess) ||
                IsCheckAccessEditing()) && (
                <MemoButtonComponent
                  setSelectedView={setSelectedView}
                  memoMenu={menuButton}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  pageName={"Request"}
                  buttonType={buttonType}
                  setButtonType={setButtonType}
                  setCurPage={setCurPage}
                />
              )}
              {checkActionPage === "edit" && (
                <>
                  {loadingPDF && (
                    <OtherButtonMemoComponent
                      pdfData={location.state?.pdfData}
                      memoIdForCopy={
                        query.get("MemoID") ? query.get("MemoID") : ""
                      }
                      isCheckAcces={isCheckAccess}
                      memoDetail={{
                        listApprovalDetails: lineApproval,
                        listFileAttachDetails: listFileAttachDetails,
                        listFormNames: [listFormNames],
                        listHistoryDetails: listHistoryDetails,
                        listRefDocDetails: listRefDocDetails,

                        memoDetail: {
                          ...memoDetail,
                          template_desc: memoDetail.template_desc
                            ? JSON.stringify(memoDetail.template_desc)
                            : null,
                        },
                      }}
                      canEdit={canEditDoc}
                      setCanEdit={setCanEditDoc}
                      isControlLoading={isControlLoading}
                      setIsControlLoading={setIsControlLoading}
                      permission={permission}
                    />
                  )}
                  {!loadingPDF && (
                    <OtherButtonMemoComponent
                      memoDetail={{
                        listApprovalDetails: lineApproval,
                        listFileAttachDetails: listFileAttachDetails,
                        listFormNames: [listFormNames],
                        listHistoryDetails: listHistoryDetails,
                        listRefDocDetails: listRefDocDetails,
                        memoDetail: {
                          ...memoDetail,
                          template_desc: JSON.stringify(
                            memoDetail.template_desc
                          ),
                        },
                      }}
                      pdfData={location.state?.pdfData}
                      memoIdForCopy={
                        query.get("MemoID") ? query.get("MemoID") : ""
                      }
                      isCheckAcces={isCheckAccess}
                      canEdit={canEditDoc}
                      setCanEdit={setCanEditDoc}
                      isControlLoading={isControlLoading}
                      setIsControlLoading={setIsControlLoading}
                      permission={permission}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {!isLoad && (
          <>
            {sidebarState ? (
              <div className="show-tablet-navbar-request-min-1024">
                <RequestSideBarElement
                  onSelectView={onSelectView}
                  curPage={curPage}
                  workList={memoDetail?.memoid}
                />
              </div>
            ) : (
              <div></div>
            )}

            <div className="inner-content">
              <div className="worklist-items-container">
                {sidebarState && (
                  <motion.div
                    className="inner-content show-tablet-navbar-request-max-1024"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="filter-container">
                      <RequestSideBarElement
                        onSelectView={onSelectView}
                        curPage={curPage}
                        workList={memoDetail?.memoid}
                      />
                    </div>
                  </motion.div>
                )}
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    layout
                    className="request-container-item"
                    style={{ width: sidebarState ? "82%" : "100%" }}
                    onClick={() => print()}
                    key={selectedView}
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedView === "1" && (
                      <RequestorComponent
                        userData={userData}
                        renderSelectedRequestor={renderSelectedRequestor}
                        onLoadDataLiveApprove={onLoadDataLiveApprove}
                        lineApproval={lineApproval}
                        jsonCondition={jsonConditions}
                        memoDetail={memoDetail}
                        setMemoDetail={setMemoDetail}
                        canEditDoc={canEditDoc}
                        masterEmployee={masterEmployee}
                        setLineApproval={setLineApproval}
                        isADTitleToPosition={isADTitleToPosition}
                        requestor={requestor}
                        creator={creator}
                        setRequestor={setRequestor}
                        t={t}
                      />
                    )}
                    {selectedView === "2" && (
                      <InformationComponentFix
                        listFormNames={listFormNames}
                        setListRefDocDetails={setListRefDocDetails}
                        numFormulas={numFormulas}
                        canEditRefDoc={canEditRefDoc}
                        refLoading={refLoading}
                        setLineApproval={setLineApproval}
                        setListFileAttachDetails={setListFileAttachDetails}
                        {...{
                          tableOptions,
                          setTableOptions,
                          onProcessLogicReference,
                          refOptions,
                          prepareInitialLogic,
                          isFirstRun,
                          previousRefTempSelected,
                          isShowSum,
                          previousView,
                          buttonType,
                          control,
                          register,
                          handleSubmit,
                          onSubmit,
                          errors,
                          onControlChange,
                          allLogic,
                          reset,
                          memoDetail,
                          jsonConditions,
                          setJsonConditions,
                          setValue,
                          canEditDoc,
                          checkActionPage,
                          isControlLoading,
                          setIsControlLoading,
                          tableSummaries,
                          setTableSummaries,
                        }}
                        memoDetail={memoDetail}
                        setMemoDetail={setMemoDetail}
                        masterCompanies={masterCompanies}
                        masterEmployee={masterEmployee}
                        setListInToAndPass={setListInToAndPass}
                        listInToAndPass={listInToAndPass}
                        masterProjects={masterProjects}
                        setProject={setProject}
                        project={project}
                        finFo={finFo}
                        isBranchFromADTitle={isBranchFromADTitle}
                        checkedLeaveTemplate={checkedLeaveTemplate}
                        leaveTypeTable={leaveTypeTable}
                        isTextFromValue={isTextFromValue}
                        setTextFromValue={setTextFromValue}
                        textFromValue={textFromValue}
                        refTempSelected={refTempSelected}
                        setRefTempSelected={setRefTempSelected}
                        setSearchRefDocData={setSearchRefDocData}
                        searchRefDocData={searchRefDocData}
                        refAttribute={refAttribute}
                        setSelectedTemplateVersion={setSelectedTemplateVersion}
                        selectedTemplateVersion={selectedTemplateVersion}
                        templateListVersion={templateListVersion}
                        isTemplateVersion={isTemplateVersion}
                        dialogVisibleInRefTemplate={dialogVisibleInRefTemplate}
                        setDialogVisibleInRefTemplate={
                          setDialogVisibleInRefTemplate
                        }
                        getLineApproveForAmount={getLineApproveForAmount}
                        autoNumFormat={autoNumFormat}
                        lineApproval={lineApproval}
                        t={t}
                      />
                    )}
                    {selectedView === "3" && (
                      <LineApprovalsComponentFix
                        lineApproval={lineApproval}
                        setLineApproval={setLineApproval}
                        employeeList={masterEmployee}
                        signatureList={masterSignature}
                        canEditLineApproval={canEditLineApprove}
                        currentLevel={memoDetail.current_approval_level}
                        t={t}
                      />
                    )}
                    {selectedView === "4" && (
                      <AttachmentComponent
                        masterATDLFT={masterATDLFT}
                        listFileAttachDetails={listFileAttachDetails}
                        setListFileAttachDetails={setListFileAttachDetails}
                        setMemoDetail={setMemoDetail}
                        memoDetail={memoDetail}
                        userData={userData}
                        canEditDoc={canEditDoc}
                        listFormNames={listFormNames}
                        checkActionPage={checkActionPage}
                        t={t}
                      />
                    )}
                    {checkActionPage === "edit" && selectedView === "5" && (
                      <HistoryComponent
                        listHistoryDetails={listHistoryDetails}
                        t={t}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestScreenFix;
