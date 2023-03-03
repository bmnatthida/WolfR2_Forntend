import { Button, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRegCopy, FaRegSave } from "react-icons/fa";
import { IoArrowBackSharp, IoMenu } from "react-icons/io5";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import ModalCreateComponents from "../../components/CreateControlComponents/ModalCreateComponents/ModalCreateComponents";
import { MemoSingleButton } from "../../components/MemoButton/MemoSingleButton";
import FormSettingComponent from "../../components/TemplateDetailComponents/FormSettingComponent/FormSettingComponent";
import ApproveMatrix from "../../components/TemplateDetailComponents/ApproveMatrixComponent/ApproveMatrix";
import { InformationComponents } from "../../components/TemplateDetailComponents/InformationComponents/InformationComponents";
import { ReferenceDocumentComponents } from "../../components/TemplateDetailComponents/ReferenceDocumentComponents/ReferenceDocumentComponents";
import { TemplateDetailSideBarElement } from "./TemplateDetailSideBarElement";
import { ITemplateRequestModel as ITemplateRequestModel } from "../../IRequestModel/CreateFormControl/ITemplateRequestModel";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import "./TemplateDetailScreen.css";
import {
  AddTemplate as ActionTemplate,
  AddTemplate,
  AddTemplateAndVersion,
  DeleteTemplate,
  GetTemplate,
  GetTemplateByDocTypeCode,
  GetTemplateById,
  GetTemplateByIdDto,
  GetTemplateControlById,
  GetTemplateListVersionHistory,
  LoadLogic,
} from "../../Services/TemplateService";
import { generateQuickGuid } from "../../Helper/GenerateGuid";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import {
  getAuthorization,
  GetIsDocControl,
  GetSignature,
  getVersion,
  getVersionTempVC,
} from "../../Services/MasterDataService";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
import { GetAllDynamic, updateDynamic } from "../../Services/DynamicService";
import AuthorizationComponent from "../../components/TemplateDetailComponents/AuthorizationComponent/AuthorizationComponent";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { BiSave } from "react-icons/bi";
import { MdPreview } from "react-icons/md";
import { GetAllAuthorized } from "../../Services/AuthorizedService";
import withPerMission from "../../components/HOC/withPermission";
import VersionAndHistoryComponents from "../../components/TemplateDetailComponents/VersionAndHistoryComponents/VersionAndHistoryComponents";
import { ILstMasterDataList } from "../../IRequestModel/CreateFormControl/ILstMasterDataList";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from "moment";

import { dataCompany } from "../../Services/CompanyService";
import { GetDepartment } from "../../Services/DepartmentService";
import { GetAllEmployee } from "../../Services/EmployeeService";

import { useUserContext } from "../../Context/UserContext";
import { sorterFunc } from "../../Helper/SortingFunction";
import useAlert from "../../hooks/useAlert";
import { ReferenceDocumentComponentsFix } from "../../components/TemplateDetailComponents/ReferenceDocumentComponents/ReferenceDocumentComponentsFix";

interface Props {}
// ../../../assets/LoadingWOLFmini.gif
const createVersionMasterData: ILstMasterDataList = {
  createdBy: "",
  createdDate: "",
  isActive: true,
  masterId: "",
  masterType: "TempVC",
  modifiedBy: "",
  modifiedDate: "",
  seq: "",
  value1: "",
  value2: "",
  value3: "",
  value4: "",
  value5: "",
};

const createFormControl: ITemplateRequestModel = {
  Amount: 0,
  JsonCondition: "",
  listRefTemplate: [],
  templateForm: {
    TemplateId: 0,
    GroupTemplateName: "",
    TemplateName: "",
    TemplateNameWithCode: "",
    DepartmentId: 0,
    DocumentCode: "",
    isPublic: true,
    ReportLang: "",
    TemplateDetail: null,
    ToId: "",
    CcId: "",
    TemplateSubject: "",
    AutoApprove: false,
    TextForm: "",
    AdvanceForm: "",
    IsTextForm: false,
    AutoApproveWhen: "L",
    ApproverCanEdit: false,
    CreatedDate: "",
    CreatedBy: "",
    ModifiedDate: "",
    ModifiedBy: "",
    IsActive: true,
    IsEdit: null,
    IsDelete: null,
    MemoId: null,
    isPDFShowInfo: false,
    isRequesterEditApproval: true,
    isFormControl: false,
    DepID: null,
    DocTypeCode: null,
    TemplateType: null,
    PDFLanguage: null,
    Location: null,
    To: null,
    CC: null,
    Subject: null,
    TemplateDesc: null,
    LineOfCommand: null,
    MaxLevelID: null,
    SpecificApprover: null,
    DOA: null,
    ApprovalMatrixID: null,
    CC_Viewer: null,
    ApproverCanEditContent: null,
    Modified: null,
    RoleID: "",
    SpecificEmployeeId: "",
    SpecificRoleID: "",
    MultiDeptId: null,
    ReqAttach: null,
    AutoStartTemplate: "[]",
    AutoStartColumn: "[]",
    RefTemplate: "",
    RefDocColumn: "",
    RefDocDisplay: "",
    AdvanceRefCondition: null,
    IsCheckAccess: false,
    IsDefaultLineApprove: false,
  },
  specificApprovers: [],
  specificTempApprovers: [],
  TemLineApprove: [],
  VEmployee: null,
  lstTRNLineApprove: null,
  cMSTApprovalMatrix: [],
  cMSTPositionLevel: [],
  cMSTCompany: null,
  lstMasterData: [],
  ComCode: 0,
  cMSTTemplateLogic: [],
  cMSTMasterData: null,
  Authorization_manage_company: [],
  Authorization_manage_department: [],
  Authorization_request_company: [],
  Authorization_request_department: [],
  Authorization_view: [],
};

const TemplateDetailScreen: React.FC = (props: Props) => {
  const { toggleAlert } = useAlert();
  const [userData, setUserData] = useUserContext();
  const [groupDataTemplate, setGroupDataTemplate] = useState<any>([]);
  var getUrl = window.location;
  var baseUrl = getUrl.protocol + "//" + getUrl.host;
  const [selectView, setSelectView] = useState<string>("1");
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState<boolean>();
  const [controlModel, setControlModel] = useState<any>();
  const [controlVersionModel, setControlVersionModel] = useState<any>();
  const [createVersionMasterModel, setCreateVersionMasterModel] = useState<any>(
    createVersionMasterData
  );
  const [groupTemplateName, setGroupTemplateName] = useState<any>();
  const [templateNameWithCode, setTemplateNameWithCode] = useState<any>();
  // const [createVersionMasterModelVer, setCreateVersionMasterModel] = useState<any>(
  //   createVersionMasterData
  // );
  const toast = useRef<any>();
  let history = useHistory();
  const [imgLoading, setImgLoading] = useState<any>(LogoLoading);
  const { url } = useRouteMatch();
  const [sidebarState, setSidebarState] = useState(true);

  // query
  const query = new URLSearchParams(useLocation().search);
  const [templateId, setTemplateId] = useState<Number>();
  // check state edit ? add
  const [action, setAction] = useState<string>("add");
  const [isDelete, setIsDelete] = useState<boolean>(false);

  // FormSettingUseState
  const [textFromValue, setTextFromValue] = useState<any>("");
  const [isCopyValue, setIsCopyValue] = useState<boolean>(false);
  const [isVersion, setIsVersion] = useState<boolean>(false);
  const [advanceForm, setAdvanceForm] = useState<any>({ items: [] });
  const [viewManageComponent, setViewManageComponent] = useState<string>();
  // const [templateId, setTemplateId] = useState<Number>();

  ///isLoad
  const [isLoad, setIsLoad] = useState<any>(true);
  // DataList
  const [positonLevelList, setPositionLevelList] = useState<any[]>([]);
  const [matrixList, setMatrixList] = useState<any>([]);
  const [version, setVersion] = useState<any>({});
  const [versionStatus, setVersionStatus] = useState<boolean>(false);
  const [versionCheck, setVersionCheck] = useState<boolean>(false);

  const [sinatureOptions, setSinatureOptions] = useState<any>([]);
  const [versionTempVC, setVersionTempVC] = useState<any>([]);
  const [templateListVersionHistory, setTemplateListVersionHistory] =
    useState<any>([]);
  const [objectDataAuthorization, setObjectDataAuthorization] = useState<any>({
    Role: [],
    Company: [],
    Department: [],
    Employee: [],
    DepartmentManage: [],
    DepartmentRequest: [],
  });

  const [validationInformation, setValidationInformation] = useState<any>({
    DocumentCode: false,
    GroupTemplateName: false,
    TemplateName: false,
  });

  useEffect(() => {
    intiFunc();
  }, []);

  const intiFunc = () => {
    let _isCopyValue: boolean = false;
    // setSelectView("1");
    fetchPositionLevel();
    fetchMatrix();
    fetchMasterData();
    fetchDataAuthorization();
    fetchDataTemplate();
    let _templateVersionCode: string | null = "";
    let _versionTemplate: string | null = "";
    let _version: string | null = "";
    let _templateId: string = query.get("TemplateId") || "";

    if (_templateId) {
      if (query.get("isCopy") !== undefined && query.get("isCopy") !== null) {
        setIsCopyValue(true);
        _isCopyValue = true;
      } else {
        setAction("edit");
      }
      templateList(parseInt(_templateId), _isCopyValue);
      setTemplateId(parseInt(_templateId));
    } else {
      if (
        query.get("TemplateVersionCode") &&
        query.get("VersionTemplate") &&
        !query.get("isCopy")
      ) {
        _versionTemplate = query.get("VersionTemplate");
        _templateVersionCode = query.get("TemplateVersionCode");
        setIsVersion(true);
        templateList(
          parseInt(_templateId),
          _isCopyValue,
          _templateVersionCode,
          _versionTemplate
        );
      } else {
        setControlModel(createFormControl);
        setViewManageComponent("1");
        setIsLoad(false);
      }
    }
    if (!_isCopyValue && !_versionTemplate) {
      versionFunction(_templateId);
    }
    // versionFunction(_templateId, _isCopyValue);
  };

  async function fetchPositionLevel() {
    let _dataDynamic: any[] = await GetAllDynamic(
      "PositionLevel/GetAll",
      undefined
    );
    setPositionLevelList(_dataDynamic);
  }
  async function fetchDataAuthorization() {
    const roles = await GetAllDynamic("Roles/GetAll", undefined);
    const companies = await dataCompany();
    const _Department = await GetDepartment();
    const _employee = await GetAllEmployee();
    let _dataFilterDepartment = _Department.filter(
      (_department: any) =>
        _department.NameEn !== null &&
        _department.NameEn.length !== 0 &&
        _department.NameTh !== null &&
        _department.NameTh.length !== 0
    );

    // authorizationCompanyAndDepartmentData(props.controlModel);
    setObjectDataAuthorization((prevState: any) => ({
      ...prevState,
      Role: roles,
      Company: companies,
      Department: _dataFilterDepartment,
      Employee: _employee,
    }));
  }
  async function fetchMatrix() {
    let matrix = await GetAllDynamic("ApprovalMatrix/GetAll", undefined);
    console.log({ matrix });

    setMatrixList(matrix);
  }

  async function fetchMasterData() {
    let signatrue = await GetSignature();
    console.log("approval=>sig", signatrue);

    setSinatureOptions([...signatrue]);
  }

  async function templateList(
    template_id: Number,
    _isCopyValue: boolean,
    _templateVersionCode?: string | null,
    _versionTemplate?: string | null
  ) {
    if (
      _versionTemplate &&
      _versionTemplate !== null &&
      _versionTemplate !== ""
    ) {
      let _templateIdList = await GetTemplateControlById({
        TemplateVersionCode: _templateVersionCode,
        VersionTemplate: _versionTemplate,
      });
      _templateIdList.templateForm.versionTemplate = _versionTemplate;

      const dataLogic = await LoadLogic(
        _templateIdList.templateForm.TemplateId
      );

      setControlModel(_templateIdList);
      setControlVersionModel(_templateIdList);
      refTemplateByEditFunction(_templateIdList, dataLogic);
      advanceFormByEditFunction(_templateIdList);

      // _templateListVersionHistory[
      //   Number(_versionTemplate) - 1
      // ].versionTemplate = _versionTemplate;
      // const dataLogic = await LoadLogic(
      //   _templateListVersionHistory[Number(_versionTemplate) - 1].TemplateId
      // );
      // setControlModel(
      //   _templateListVersionHistory[Number(_versionTemplate) - 1]
      // );
      // refTemplateByEditFunction(
      //   _templateListVersionHistory[Number(_versionTemplate) - 1],
      //   dataLogic
      // );
      // advanceFormByEditFunction(
      //   _templateListVersionHistory[Number(_versionTemplate) - 1]
      // );
      // versionFunction(
      //   _templateListVersionHistory[Number(_versionTemplate) - 1].TemplateId
      // );
      setTemplateId(_templateIdList.templateForm.TemplateId);
      setIsLoad(false);
    } else {
      setIsLoad(true);

      const dataJson = {
        TemplateId: template_id,
      };
      let _templateIdList: any = await GetTemplateControlById(dataJson);
      const dataLogic = await LoadLogic(template_id);
      if (_isCopyValue) {
        _templateIdList.templateForm.TemplateId = 0;
        _templateIdList.templateForm.TemplateName =
          _templateIdList.templateForm.TemplateName + "-copy";
        _templateIdList.templateForm.DocumentCode =
          _templateIdList.templateForm.DocumentCode + "-copy";
      }
      setControlVersionModel(_templateIdList);
      setControlModel(_templateIdList);
      refTemplateByEditFunction(_templateIdList, dataLogic);
      advanceFormByEditFunction(_templateIdList);
      setTemplateNameWithCode(
        _templateIdList?.templateForm?.DocumentCode +
          " : " +
          _templateIdList?.templateForm?.TemplateName
      );
      setGroupTemplateName(_templateIdList?.templateForm?.GroupTemplateName);
      setIsLoad(false);
    }
  }

  async function versionFunction(templateId: any) {
    // console.log("templateId", templateId);
    const dataJson = {
      TemplateId:
        templateId !== undefined &&
        templateId !== null &&
        templateId.length !== 0
          ? Number(templateId)
          : null,
    };

    let _dataVersion = await getVersion();

    console.log("_dataVersion", _dataVersion);
    if (
      _dataVersion !== undefined &&
      _dataVersion !== null &&
      _dataVersion.length !== 0
    ) {
      let _arrayVersion = _dataVersion[0].value2.split("|");
      if (
        _arrayVersion[0] !== undefined &&
        _arrayVersion[0] !== null &&
        _arrayVersion[0].length !== 0 &&
        Boolean(_arrayVersion[0])
      ) {
        console.log("_dataVersion[0]", _dataVersion[0]);

        setVersion(_dataVersion[0]);
        console.log("dataJson", dataJson);
        let _templateIdList: any =
          dataJson.TemplateId !== null ? await GetTemplateById(dataJson) : {};
        console.log("_templateIdList", _templateIdList);

        let _dataVersionTempVC = await getVersionTempVC();
        setVersionTempVC(_dataVersionTempVC);

        if (
          _templateIdList !== undefined &&
          _templateIdList !== null &&
          Object.keys(_templateIdList).length !== 0
        ) {
          let dataFilter = _dataVersionTempVC.filter(
            (Item: any) => Item.value1 === _templateIdList.DocumentCode
            // &&
            // Item.value2 === "true"
          );

          let _templateListVersionHistory = await GetTemplateListVersionHistory(
            { DocumentCode: _templateIdList.DocumentCode }
          );

          _templateListVersionHistory.sort((a: any, b: any) =>
            sorterFunc(a, b, "TemplateId", "dec")
          );

          _templateListVersionHistory.splice(0, 1);
          setTemplateListVersionHistory(_templateListVersionHistory);
          if (dataFilter.length !== 0) {
            console.log("dataFilter", dataFilter);

            setCreateVersionMasterModel((prevState: any) => ({
              ...prevState,
              ...dataFilter[0],
            }));

            setVersionCheck(true);
          }
        }

        console.log("_arrayVersion[0]", _arrayVersion[0]);
        setVersionStatus(Boolean(_arrayVersion[0]));
      } else {
        setVersionCheck(false);
        setVersionStatus(false);
      }
    }
  }
  async function refTemplateByEditFunction(
    _templateIdList: any,
    dataLogic: any
  ) {
    try {
      let _RefTemplate =
        _templateIdList.templateForm.RefTemplate !== undefined
          ? _templateIdList.templateForm.RefTemplate !== null
            ? _templateIdList.templateForm.RefTemplate.length === 0
              ? []
              : JSON.parse(_templateIdList.templateForm.RefTemplate)
            : []
          : [];
      let _dataTemplatetMasterData = await GetIsDocControl();
      let _dataAuthorizationMasterData = await getAuthorization();

      if (
        _dataAuthorizationMasterData === undefined ||
        _dataAuthorizationMasterData === null
      ) {
      } else {
        let _manage_company = _dataAuthorizationMasterData.filter(
          (data: any) => {
            if (
              data.value1 ===
                _templateIdList.templateForm.TemplateId.toString() &&
              data.masterType === "Authmgcomp"
            )
              return true;
          }
        );
        let _manage_department = _dataAuthorizationMasterData.filter(
          (data: any) => {
            if (
              data.value1 ===
                _templateIdList.templateForm.TemplateId.toString() &&
              data.masterType === "Authmgdept"
            )
              return true;
          }
        );
        let _request_company = _dataAuthorizationMasterData.filter(
          (data: any) => {
            if (
              data.value1 ===
                _templateIdList.templateForm.TemplateId.toString() &&
              data.masterType === "Authrqcomp"
            )
              return true;
          }
        );
        let _request_department = _dataAuthorizationMasterData.filter(
          (data: any) => {
            if (
              data.value1 ===
                _templateIdList.templateForm.TemplateId.toString() &&
              data.masterType === "Authrqdept"
            )
              return true;
          }
        );
        let _Authorization_view = dataLogic.filter((data: any) => {
          if (data.logictype === "Permission") return true;
        });

        let _manage_companyArrayIndx0: any =
          _manage_company.length === 0
            ? null
            : _manage_company[0] === "[]"
            ? null
            : JSON.parse(_manage_company[0].value2);
        let _request_companyArrayIndx0: any =
          _request_company.length === 0
            ? null
            : _request_company[0] === "[]"
            ? null
            : JSON.parse(_request_company[0].value2);
        let _manage_departmentArrayIndx0: any =
          _manage_department.length === 0
            ? null
            : _manage_department[0] === "[]"
            ? null
            : JSON.parse(_manage_department[0].value2);

        let _request_departmentArrayIndx0: any =
          _request_department.length === 0
            ? null
            : _request_department[0] === "[]"
            ? null
            : JSON.parse(_request_department[0].value2);

        let Authorization_for_ViewIndx0: any =
          _Authorization_view.length === 0
            ? null
            : _Authorization_view[0] === "[]"
            ? null
            : JSON.parse(_Authorization_view[0].jsonvalue);

        // if(Authorization_manage_company!==null)
        // console.log("Authorization_manage_company", _manage_companyArrayIndx0);

        await setControlModel((prevState: any) => ({
          ...prevState,
          Authorization_manage_company:
            _manage_companyArrayIndx0 !== undefined
              ? _manage_companyArrayIndx0 !== null
                ? _manage_companyArrayIndx0.length === 0
                  ? null
                  : _manage_companyArrayIndx0
                : null
              : null,

          Authorization_manage_department:
            _manage_department !== undefined
              ? _manage_department !== null
                ? _manage_department.length === 0
                  ? null
                  : _manage_departmentArrayIndx0
                : null
              : null,

          Authorization_request_company:
            _request_companyArrayIndx0 !== undefined
              ? _request_companyArrayIndx0 !== null
                ? _request_companyArrayIndx0.length === 0
                  ? null
                  : _request_companyArrayIndx0
                : null
              : null,

          Authorization_request_department:
            _request_department !== undefined
              ? _request_department !== null
                ? _request_department.length === 0
                  ? null
                  : _request_departmentArrayIndx0
                : null
              : null,

          Authorization_view:
            _Authorization_view !== undefined
              ? _Authorization_view !== null
                ? _Authorization_view.length === 0
                  ? null
                  : Authorization_for_ViewIndx0
                : null
              : null,
        }));
      }
      console.log("ref=>_RefTemplate", _RefTemplate);

      await setControlModel((prevState: any) => ({
        ...prevState,
        listRefTemplate: _RefTemplate,
      }));
      lstMasterDataByEditFunction(_dataTemplatetMasterData, _templateIdList);
    } catch (error) {
      console.log("setRef=>error", error);
    }
  }
  async function lstMasterDataByEditFunction(
    _MasterData: any,
    _templateIdList: any
  ) {
    if (_MasterData !== null) {
      let _dataTemplatetMasterDatafilter = _MasterData.filter(
        (data: any) =>
          data.value1 === _templateIdList.templateForm.TemplateId.toString()
      );

      await setControlModel((prevState: any) => ({
        ...prevState,
        lstMasterData: _dataTemplatetMasterDatafilter,
      }));
    }
  }

  function advanceFormByEditFunction(_templateIdList: any) {
    try {
      let respone: any;
      if (_templateIdList.templateForm?.IsTextForm === false) {
        setViewManageComponent("1");
        if (_templateIdList.templateForm.AdvanceForm !== "") {
          respone = JSON.parse(_templateIdList.templateForm.AdvanceForm).items;
        } else {
          respone = [];
        }
        for (let i = 0; i < respone.length; i++) {
          const row = respone[i];
          for (let j = 0; j < row.layout.length; j++) {
            const _layout = row.layout[j];
            if (respone[i].layout[j].guid == undefined) {
              respone[i].layout[j]["guid"] = generateQuickGuid();
            }
          }
        }
        setAdvanceForm((prevState: any) => ({
          ...prevState,
          items: respone,
        }));
      } else {
        setViewManageComponent("2");
        setTextFromValue(_templateIdList.templateForm.TextForm);
      }
    } catch (error) {}
  }
  async function addTemplateDetail() {
    setVisibleConfirmDialog(true);
  }
  async function previewTemplate() {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host;

    window.open(
      `${baseUrl}/Request?MemoID=0&template=${templateId}&preview`,
      "_blank"
    );
  }
  const confirm = async () => {
    let control = controlModel;

    control.JsonCondition = "";
    if (viewManageComponent === "1") {
      control.templateForm.AdvanceForm = JSON.stringify(advanceForm);
      control.templateForm.IsTextForm = false;
      control.templateForm.TextForm = "";
    } else if (viewManageComponent === "2") {
      control.templateForm.AdvanceForm = "";
      control.templateForm.IsTextForm = true;
      control.templateForm.TextForm = textFromValue;
    }
    if (action === "add") {
      control.templateForm.ModifiedBy = userData.EmployeeId?.toString();
      control.templateForm.ModifiedDate = moment().format(
        "DD/MM/YYYY hh:mm:ss"
      );
      control.templateForm.CreatedBy = userData.EmployeeId?.toString();
      control.templateForm.CreatedDate = moment().format("DD/MM/YYYY hh:mm:ss");
    } else if (action === "edit") {
      control.templateForm.ModifiedBy = userData.EmployeeId?.toString();
      control.templateForm.ModifiedDate = moment().format(
        "DD/MM/YYYY hh:mm:ss"
      );
    }
    if (!isDelete) {
      if (
        control.templateForm.GroupTemplateName !== undefined &&
        control.templateForm.DocumentCode !== undefined &&
        control.templateForm.TemplateName !== undefined &&
        control.templateForm.GroupTemplateName !== null &&
        control.templateForm.DocumentCode !== null &&
        control.templateForm.TemplateName !== null &&
        control.templateForm.GroupTemplateName.length !== 0 &&
        control.templateForm.DocumentCode.length !== 0 &&
        control.templateForm.TemplateName.length !== 0
      ) {
        let _dataTemplateByDocTypeCode =
          action === "add"
            ? await GetTemplateByDocTypeCode({
                DocumentCode: controlModel.templateForm.DocumentCode,
              })
            : null;
        if (
          _dataTemplateByDocTypeCode !== undefined &&
          _dataTemplateByDocTypeCode !== null &&
          Object.keys(_dataTemplateByDocTypeCode).length !== 0 &&
          action === "add"
        ) {
          toggleAlert({
            description: `DocTypeCode is duplicate.`,
            message: `Dupplicate field warning.`,
            type: "warning",
          });
          return;
        } else {
          setIsLoad(true);
          let formData: any = {};
          let res: any;
          let _history = "";
          if (versionCheck) {
            if (
              createVersionMasterModel.value2 === "true" &&
              createVersionMasterModel.masterId.length === 0
            ) {
              formData.MasterId = null;
              formData.Value1 = controlModel.templateForm.DocumentCode;
              formData.Value2 = createVersionMasterModel.value2;
              formData.Value3 = createVersionMasterModel.value3;
              formData.Value4 = "0";
              formData.Value5 = (
                Number(createVersionMasterModel.value5) + 1
              ).toString();
              // (
              //   Number(createVersionMasterModel.value5) + 1
              // ).toString();
              formData.MasterType = createVersionMasterModel.masterType;
              formData.IsActive = createVersionMasterModel.isActive;
              formData.Seq = null;

              formData.CreatedBy = userData.EmployeeId.toString();
              formData.CreatedDate = moment().format("DD/MM/YYYY hh:mm:ss");
              formData.ModifiedBy = userData.EmployeeId.toString();
              formData.ModifiedDate = moment().format("DD/MM/YYYY hh:mm:ss");
            } else {
              formData.MasterId = Number(createVersionMasterModel.masterId);
              formData.Value1 = controlModel.templateForm.DocumentCode;
              formData.Value2 = createVersionMasterModel.value2;
              formData.Value3 =
                createVersionMasterModel.value3 === "Publish"
                  ? "Editing"
                  : "Editing";
              formData.Value4 = createVersionMasterModel.value4;
              formData.Value5 =
                createVersionMasterModel.value3 === "Publish"
                  ? (Number(createVersionMasterModel.value5) + 1).toString()
                  : createVersionMasterModel.value5;
              formData.MasterType = createVersionMasterModel.masterType;
              formData.IsActive = createVersionMasterModel.isActive;
              formData.Seq = createVersionMasterModel.seq;
              formData.ModifiedDate = moment().format("DD/MM/YYYY hh:mm:ss");
              formData.CreatedBy = createVersionMasterModel.createdBy;
              formData.CreatedDate = createVersionMasterModel.createdDate;
              formData.ModifiedBy = userData.EmployeeId.toString();
            }
            control.cMstMasterData = formData;

            control.templateForm.ModifiedBy = userData.EmployeeId.toString();
            control.templateForm.CreatedBy = userData.EmployeeId.toString();
            if (
              createVersionMasterModel.value3 === "Editing" &&
              Number(createVersionMasterModel.value5) + 1 > 1
            ) {
              res = await AddTemplate(control);
            } else {
              res = await AddTemplateAndVersion(control);
              let _templateListVersionHistory =
                await GetTemplateListVersionHistory({
                  DocumentCode: control.templateForm?.DocumentCode,
                });
              _templateListVersionHistory.sort((a: any, b: any) =>
                sorterFunc(a, b, "TemplateId", "dec")
              );

              _templateListVersionHistory.splice(0, 1);
              _history = `/TemplateDetail?TemplateVersionCode=${
                _templateListVersionHistory[
                  _templateListVersionHistory.length - 1
                ]?.DocumentCode
              }&VersionTemplate=${_templateListVersionHistory?.length}&Version`;
            }
          } else {
            control.templateForm.CreatedBy = userData.EmployeeId.toString();
            control.templateForm.CreatedDate = moment().format(
              "DD/MM/YYYY hh:mm:ss"
            );
            control.templateForm.ModifiedBy = userData.EmployeeId?.toString();
            control.templateForm.ModifiedDate = moment().format(
              "DD/MM/YYYY hh:mm:ss"
            );
            res = await AddTemplate(control);
          }

          if (res) {
            if (action === "add") {
              history.push("/Settings?name=TemplateList", {
                responeAddTemplate: "data",
                typeTemplate: "add",
              });
              setIsLoad(false);
            } else if (action === "edit" && versionCheck) {
              if (_history.length !== 0) {
                history.push(_history);
                history.go(0);
              }
              setIsLoad(false);
            } else if (action === "edit" && !versionCheck) {
              intiFunc();
            }
          } else {
            let _checkValidationOBJ: any = {
              GroupTemplateName:
                controlModel?.templateForm?.GroupTemplateName?.length !== 0
                  ? false
                  : true,
              DocumentCode:
                controlModel?.templateForm?.DocumentCode?.length !== 0
                  ? false
                  : true,
              TemplateName:
                controlModel?.templateForm?.TemplateName?.length !== 0
                  ? false
                  : true,
            };
            setValidationInformation(_checkValidationOBJ);
            const selected = selectView;
            setSelectView(selected);
            setIsLoad(false);
          }
        }
      } else {
        let _checkValidationOBJ: any = {
          GroupTemplateName:
            controlModel.templateForm?.GroupTemplateName !== null
              ? controlModel.templateForm?.GroupTemplateName?.length !== 0
                ? false
                : true
              : true,
          DocumentCode:
            controlModel.templateForm?.DocumentCode !== null
              ? controlModel.templateForm?.DocumentCode.length !== 0
                ? false
                : true
              : true,
          TemplateName:
            controlModel?.templateForm?.TemplateName !== null
              ? controlModel.templateForm?.TemplateName?.length !== 0
                ? false
                : true
              : true,
        };
        setValidationInformation(_checkValidationOBJ);
        const selected = selectView;
        setSelectView(selected);
      }
    } else if (isDelete) {
      control.templateForm.IsActive = false;
      control.templateForm.IsDelete = true;
      control.templateForm.ModifiedDate = moment().format(
        "DD/MM/YYYY hh:mm:ss"
      );
      control.templateForm.ModifiedBy = userData.EmployeeId?.toString();
      const res = await DeleteTemplate(control);
      if (res) {
        history.push("/Settings?name=TemplateList", {
          responeAddTemplate: "data",
          typeTemplate: "delete",
        });
        setIsLoad(false);
      } else {
        setIsLoad(false);
        toggleAlert({
          description: `Server Error Please try again.`,
          message: `Error`,
          type: "error",
        });
      }
    }
  };
  const confirmDialogButton = () => {
    return (
      <>
        <ConfirmDialog
          visible={visibleConfirmDialog}
          onHide={() => setVisibleConfirmDialog(false)}
          message="Are you sure you want to proceed?"
          header="Confirmation"
          icon="pi pi-exclamation-triangle"
          accept={confirm}
          reject={() => {
            setVisibleConfirmDialog(false);
            setIsDelete(false);
          }}
          blockScroll
          draggable={false}
          resizable={false}
        />
      </>
    );
  };
  const fechMemoButtonDefault = () => {
    return (
      <>
        <ButtonComponents
          setLabelProps="Back"
          setIconProps={
            <IoArrowBackSharp size={"16px"} style={{ marginRight: "3px" }} />
          }
          onClickProps={() => history.push("/Settings?name=" + "TemplateList")}
          setStyleProps={{
            height: "32px",
            borderRadius: "6px",
            border: "1px solid #F2F2F2",
            fontSize: "13px",
            background: "#F2F2F2",
            color: "#282F6A",
            width: "120px",
          }}
        />
        {action === "edit" && !isCopyValue && (
          <ButtonComponents
            setLabelProps="Copy"
            setIconProps={
              <FaRegCopy size={"16px"} style={{ marginRight: "3px" }} />
            }
            onClickProps={() => {
              window.open(
                `${baseUrl}/TemplateDetail?TemplateId=${templateId}&isCopy`,
                "_blank",
                "noreferrer"
              );
            }}
            setStyleProps={{
              borderRadius: "6px",
              border: "1px solid rgb(40, 47, 106)",
              fontSize: "13px",
              width: "120px",
              height: "32px",
            }}
          />
        )}
        {action === "edit" && !isCopyValue && (
          <ButtonComponents
            setLabelProps="Delete"
            setIconProps={
              <RiDeleteBin6Line size={"16px"} style={{ marginRight: "3px" }} />
            }
            onClickProps={() => {
              setVisibleConfirmDialog(true);
              setIsDelete(true);
            }}
            setStyleProps={{
              borderRadius: "6px",
              border: "1px solid rgb(255, 0, 0)",
              fontSize: "13px",
              width: "120px",
              backgroundColor: "red",
              height: "32px",
            }}
          />
        )}
        {action === "edit" && !isCopyValue && (
          <ButtonComponents
            setLabelProps="Preview"
            setIconProps={
              <MdPreview size={"16px"} style={{ marginRight: "3px" }} />
            }
            onClickProps={previewTemplate}
            setStyleProps={{
              borderRadius: "6px",
              border: "1px solid rgb(40, 47, 106)",
              fontSize: "13px",
              width: "120px",
              height: "32px",
            }}
          />
        )}

        <ButtonComponents
          setLabelProps="Save"
          setIconProps={<BiSave size={"16px"} style={{ marginRight: "3px" }} />}
          onClickProps={addTemplateDetail}
          setStyleProps={{
            borderRadius: "6px",
            border: "1px solid rgb(40, 47, 106)",
            fontSize: "13px",
            width: "120px",
            height: "32px",
          }}
        />
      </>
    );
  };
  const onSelectView = (text: string) => {
    setSelectView(text);
  };
  function toggleSideBar() {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setSidebarState(true);
    }
  }

  async function fetchDataTemplate() {
    let _dataTemplatee = await GetTemplate();

    const isActiveTemp = _dataTemplatee?.filter((e: any) => e.IsActive);

    let _groupDataTemplate: any = [];
    let groupTemplate = isActiveTemp?.reduce(function (r: any, a: any) {
      r[a.GroupTemplateName] = r[a.GroupTemplateName] || [];
      r[a.GroupTemplateName].push(a);
      return r;
    }, Object.create(null));

    for (const [key, value] of Object.entries(groupTemplate)) {
      let _value: any = value;
      _groupDataTemplate.push({ value: key });
    }
    setGroupDataTemplate(_groupDataTemplate);
  }

  return (
    <>
      <Toast ref={toast} />

      <>
        {confirmDialogButton()}
        <div className="request-main-container">
          <div className="request-container">
            <div
              className="header-request set-z-index"
              style={{ marginTop: "30px" }}
            >
              <div className="button-container set-min-width-td">
                <Button
                  type="text"
                  icon={<IoMenu size={28} />}
                  size="large"
                  onClick={toggleSideBar}
                  style={{ background: "transparent " }}
                />
                <TreeSelectNewRequest setDataTemplateTreeProps={{}} />
              </div>
              <div className="confirm-container-Create-Email">
                <div>
                  <p
                    className="p-Create-Email-Template"
                    style={{ display: "flex", columnGap: "10px" }}
                  >
                    {isVersion
                      ? "Form Template"
                      : action === "edit"
                      ? " Edit Form Template"
                      : "Create Form Template"}
                    {controlModel?.templateForm?.versionTemplate && (
                      <p style={{ fontSize: "24px", color: "red" }}>
                        (History Version{" "}
                        {controlModel?.templateForm?.versionTemplate})
                      </p>
                    )}
                  </p>
                  <div className="set-text-header-on-edit-form">
                    <div>{groupTemplateName}</div>
                    <div>{templateNameWithCode}</div>
                  </div>
                </div>
                <div className="button-container-Create-Email-Template">
                  {!controlModel?.templateForm?.versionTemplate &&
                    fechMemoButtonDefault()}
                </div>
              </div>
            </div>
            {isLoad ? (
              <>
                <div className="logo-loading cursor-loading">
                  <img src={imgLoading} alt="loading..." />
                </div>
              </>
            ) : (
              <>
                {sidebarState && (
                  <div className="show-tablet-navbar-request-min-1024-create-control">
                    <div className="filter-container">
                      <TemplateDetailSideBarElement
                        onSelectView={onSelectView}
                        curPage={selectView}
                        isCopy={isCopyValue}
                        isVersion={versionStatus}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="inner-content">
              <div className="worklist-items-container">
                {isLoad ? (
                  <>
                    <div className="logo-loading cursor-loading">
                      <img src={imgLoading} alt="loading..." />
                    </div>
                  </>
                ) : (
                  <>
                    {sidebarState && (
                      <motion.div
                        className="show-tablet-navbar-request-max-1024"
                        style={{
                          width: "25%",
                          maxWidth: "280px",
                          minWidth: "280px",
                        }}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -200 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="filter-container">
                          <TemplateDetailSideBarElement
                            onSelectView={onSelectView}
                            curPage={selectView}
                            isCopy={isCopyValue}
                            isVersion={versionStatus}
                          />
                        </div>
                      </motion.div>
                    )}
                    <AnimatePresence exitBeforeEnter>
                      <motion.div
                        layout
                        className="request-container-item set-css-images"
                        style={{ width: "100%" }}
                        key={selectView}
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectView === "1" && (
                          <InformationComponents
                            InformationDataProps={controlModel}
                            state={action}
                            groupDataTemplate={groupDataTemplate}
                            setGroupDataTemplate={setGroupDataTemplate}
                            setControlModelObj={setControlModel}
                            checkValidation={validationInformation}
                            isLoadProps={isLoad}
                          />
                        )}
                        {selectView === "2" && (
                          <FormSettingComponent
                            setTextFromValue={setTextFromValue}
                            setControlModel={setControlModel}
                            textFromValue={textFromValue}
                            setAdvanceForm={setAdvanceForm}
                            advanceForm={advanceForm}
                            setViewManageComponent={setViewManageComponent}
                            viewManageComponent={viewManageComponent}
                          />
                        )}
                        {selectView === "3" && (
                          <ReferenceDocumentComponentsFix
                            listRefTemplateProps={controlModel}
                            stateProps={action}
                            setControlModelObj={setControlModel}
                            controlModelObj={controlModel}
                            advanceForm={advanceForm}
                          />
                        )}
                        {selectView === "4" && (
                          <ApproveMatrix
                            setAdvanceForm={setAdvanceForm}
                            advanceForm={advanceForm}
                            controlModel={controlModel}
                            setControlModel={setControlModel}
                            positionList={positonLevelList}
                            matrixList={matrixList}
                            signatureList={sinatureOptions}
                          />
                        )}
                        {selectView === "5" && (
                          <AuthorizationComponent
                            setAdvanceForm={setAdvanceForm}
                            advanceForm={advanceForm}
                            controlModel={controlModel}
                            setControlModel={setControlModel}
                            actionProps={action}
                            objectDataAuthorizationProps={
                              objectDataAuthorization
                            }
                            setIsLoad={setIsLoad}
                          />
                        )}
                        {selectView === "6" && (
                          <VersionAndHistoryComponents
                            setAdvanceForm={setAdvanceForm}
                            advanceForm={advanceForm}
                            controlModel={controlModel}
                            setControlModel={setControlModel}
                            actionProps={action}
                            setVersionCheckProps={setVersionCheck}
                            VersionCheckProps={versionCheck}
                            VersionDataProps={createVersionMasterModel}
                            SetVersionDataProps={setCreateVersionMasterModel}
                            VersionTempVCProps={versionTempVC}
                            version={version}
                            templateListVersionHistoryProps={
                              templateListVersionHistory
                            }
                            ObjectDataAuthorizationProps={
                              objectDataAuthorization.Employee
                            }
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default withPerMission(TemplateDetailScreen);
