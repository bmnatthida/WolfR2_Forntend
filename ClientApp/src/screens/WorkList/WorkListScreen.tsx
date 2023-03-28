import React, { useState, useEffect, useMemo, Profiler } from "react";
import "./WorkListScreen.css";
import { IoMenu } from "react-icons/io5";
import { Button, InputNumber, Pagination } from "antd";
import { DetailContentScreen } from "./DetailContentScreen";
import WorkListSideBarElementUse from "./WorkListSideBarElementUse";
import { WorklistCardComponent } from "../../components/WorklistScreenComponent/WorklistCardComponent";
// import Pagination from "react-bootstrap/Pagination";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import moment, { Moment } from "moment";
import { IMemoButtonModel } from "../../IRequestModel/IMemoButtonModel";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import { GetWorkListByTaskGroup } from "../../Services/WorklistService";
import { AnimatePresence, motion } from "framer-motion";
import {
  ActionMemoPage,
  GetButtonMemoByMemoId,
  GetAllMemo,
  GetMemoDetail,
} from "../../Services/MemoService";
import { GetAllHistory } from "../../Services/HistoryService";
import { GetAllAttachFiles } from "../../Services/AttachFileService";
import { GetAllApprovals } from "../../Services/ApprovalService";
import withPerMission from "../../components/HOC/withPermission";
import { IAutoNumberAttibute } from "../../IRequestModel/IAutoNumberFormat";
import { GetAutoNumber } from "../../Services/RequestControlService";
import useAlert from "../../hooks/useAlert";
import { useUserContext } from "../../Context/UserContext";
import {
  IGetWorklistRequest,
  ISearchWorklist,
  ITodo,
  IWorklistDetail,
  TodoType,
  WorklistHeaderType,
  WorklistSerachType,
} from "../../IRequestModel/IWorklistModel";
import { IUserModel } from "../../IRequestModel/IUserModel";
import { getDateDeployConfiguration } from "../../Services/ConfigurationService";
import { useTranslation } from "react-i18next";

interface Props {
  responeConfig: any;
}
const WorkListScreen = (props: Props) => {
  const [userData] = useUserContext();
  const { toggleAlert } = useAlert();

  //Worklist Data
  const [workListData, setWorkListData] = useState<ITodo[]>();

  //Filter Option
  const [formTypeOptions, setFormTypeOptions] = useState<string[]>([]);
  const [companiesOptions, setCompaniesOptions] = useState<string[]>([]);
  const [departmentsOptions, setDepartmentsOptions] = useState<string[]>([]);
  const [formStatusOptions, setFormStatusOptions] = useState<string[]>([]);

  //Filter data
  const [searchObject, setSearchObject] = useState<ISearchWorklist>({
    company: [],
    date: [],
    department: [],
    form: [],
    keyword: "",
    status: [],
  });
  const { t } = useTranslation(["translation"]);
  //Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(5);
  const [buttonType, setButtonType] = useState("");

  //Toggle
  const [isShowPdfData, setIsShowPdfData] = useState(true);
  const [isCardLoading, setIsCardLoading] = useState<boolean>(false);
  const [toggleDetail, setToggleDetail] = useState<Boolean>(false);
  const [sidebarState, setSidebarState] = useState(false);

  const [currentMemoId, setCurrentMemoId] = useState<number>(0);
  const [taskHeader, setTaskHeader] = useState<string>("To Do List");
  const [currentIndex, setCurrentIndex] = useState<Number>(-1);
  const [selectedCard, setSelectedCard] = useState<IWorklistDetail>();
  const [menuButton, setMenuButton] = useState<any[]>([]);
  const [defaultTask, setDefaultTask] =
    useState<WorklistHeaderType>("To Do List");
  const [taskGourp, setTaskGourp] = useState<string>("todo");

  //Default item per page
  const _itemPerPage = itemPerPage ? Number(itemPerPage) : 1;
  const indexOfLastPost = currentPage * _itemPerPage;
  const indexOfFirstPost = indexOfLastPost - _itemPerPage;

  useEffect(() => {
    fetchWorklist();
  }, [t]);
  const fetchWorklist = async (
    task: TodoType = "todo",
    date?: [Moment?, Moment?] | null
  ) => {
    setIsCardLoading(true);
    const dateFrom =
      task === "myrelate"
        ? date
          ? date[0]
          : date === null
          ? undefined
          : moment(new Date()).subtract(1, "M")
        : undefined;

    const dateTo =
      task === "myrelate"
        ? date
          ? date[1]
          : date === null
          ? undefined
          : moment(new Date())
        : undefined;

    const dataJson: IGetWorklistRequest = {
      task: task,
      empId: userData?.EmployeeId?.toString(),
      iItemPerMore: 10000,
      CountMoreItem: 1,
      FilterDateFrom: dateFrom ? dateFrom.format("DD/MM/YYYY hh:mm:ss") : "",
      FilterDateTo: dateTo ? dateTo.format("DD/MM/YYYY hh:mm:ss") : "",
      UserPrincipalName: userData.Email,
    };
    const dataWorklist = await GetWorkListByTaskGroup(dataJson);
    if (task === "myrelate") {
      console.log({ dateFrom, dateTo });
      setSearchObject({
        form: [],
        status: [],
        company: [],
        department: [],
        keyword: "",
        date: dateFrom || dateTo ? [dateFrom, dateTo] : [],
      });
    } else {
      setSearchObject({
        date: [],
        form: [],
        status: [],
        company: [],
        department: [],
        keyword: "",
      });
    }
    setTaskGourp(task);
    initialWorklistOption(dataWorklist);
    setWorkListData([...dataWorklist]);
    setIsCardLoading(false);
  };
  // useEffect(() => {
  //   console.log(formStatusOptions, "formStatusOptions");
  //   const formStatus = formStatusOptions;
  //   let aa: any[] = [];
  //   formStatus.map((item: any) => {
  //     aa.push({
  //       label: t(item.label),
  //       value: item.value,
  //     });
  //   });
  //   if (aa.length > 0) {
  //     setFormStatusOptions([...aa]);
  //     console.log(aa, "formStatusformStatus");
  //   }
  // }, [t]);

  const initialWorklistOption = (worklist: ITodo[]) => {
    let _formTypeOption: any[] = [];
    let _formStatusOption: any[] = [];
    let _companiesOption: any[] = [];
    let _departmentsOption: any[] = [];

    const resultFormTypeOption = worklist.reduce((r, a) => {
      r[a.TemplateName] = r[a.TemplateName] || [];
      return r;
    }, Object.create(null));
    const resultFormStatusOption = worklist.reduce((r, a) => {
      r[a.Status] = r[a.Status] || [];
      return r;
    }, Object.create(null));
    const resultAllCompanyOption = worklist.reduce((r, a) => {
      r[a.CompanyName] = r[a.CompanyName] || [];
      return r;
    }, Object.create(null));
    const resultAllDepartmentOption = worklist.reduce((r, a) => {
      r[a.DepartmentName] = r[a.DepartmentName] || [];
      return r;
    }, Object.create(null));
    for (const [key, value] of Object.entries(resultFormStatusOption)) {
      _formStatusOption.push({
        label: t(key),
        value: key,
      });
    }
    for (const [key, value] of Object.entries(resultFormTypeOption)) {
      _formTypeOption.push({
        label: t(key),
        value: key,
      });
    }
    for (const [key, value] of Object.entries(resultAllCompanyOption)) {
      _companiesOption.push({
        label: t(key),
        value: key,
      });
    }
    for (const [key, value] of Object.entries(resultAllDepartmentOption)) {
      _departmentsOption.push({
        label: t(key),
        value: key,
      });
    }
    console.log({
      _formStatusOption,
      _formTypeOption,
      _companiesOption,
      _departmentsOption,
    });
    setDepartmentsOptions([..._departmentsOption]);
    setCompaniesOptions([..._companiesOption]);
    setFormStatusOptions([..._formStatusOption]);
    setFormTypeOptions([..._formTypeOption]);
    setWorkListData(worklist);
  };
  function toggleSideBar() {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setToggleDetail(false);
      setSidebarState(true);
    }
  }
  const onUpdateMemo = async (
    type: any,
    memoId: any,
    comment: string,
    waiting_for?: string,
    waiting_for_id?: number
  ) => {
    setIsCardLoading(true);
    // const _empData = empData.employeeData;
    let ddd = document.getElementsByTagName("body");
    ddd[0].style.overflow = "none";
    const requestBody = {
      Memoid: memoId,
      TemplateId: null,
      DocumentCode: null,
      SecretId: "",
      EmployeeId: userData.EmployeeId.toString(),
      actor: userData,
    };
    let _getMemoDetailById = await GetMemoDetail(requestBody);
    if (_getMemoDetailById) {
      let requestDetail = _getMemoDetailById.requestDetails;
      let listControlRunning = [];
      //set value
      requestDetail.memoDetail.comment = comment;
      requestDetail.memoDetail.actor = userData;
      requestDetail.memoDetail.waiting_for = waiting_for
        ? waiting_for
        : requestDetail.memoDetail.waiting_for;
      requestDetail.memoDetail.waiting_for_id = waiting_for_id
        ? waiting_for_id
        : requestDetail.memoDetail.waiting_for_id;

      //check control running
      if (requestDetail.memoDetail.template_desc) {
        let autoNumFormat: IAutoNumberAttibute = {
          formats: [],
          digit: 0,
          rowIndex: -1,
          colIndex: -1,
          showSymbol: false,
        };
        const templateDescJson = JSON.parse(
          requestDetail.memoDetail.template_desc
        );
        autoNumFormat = detechAutonumberFormula(templateDescJson);

        if (autoNumFormat?.rowIndex !== -1) {
          const runningNumber = await CheckSaveAutonumber(
            requestDetail.memoDetail.template_id,
            templateDescJson,
            autoNumFormat
          );
          console.log("an=>runningNumber", runningNumber);

          if (runningNumber) {
            listControlRunning.push(runningNumber);
          }
        }
      }
      requestDetail["listControlRunning"] = listControlRunning;

      // updateMemo
      let _ActionMemoPage = await ActionMemoPage({
        MemoPage: {
          listApprovalDetails: requestDetail.listApprovalDetails,
          listFileAttachDetails: requestDetail.listFileAttachDetails,
          listFormName: requestDetail.listFormNames,
          listHistoryDetails: requestDetail.listHistoryDetails,
          listRefDocDetails: requestDetail.listRefDocDetails,
          memoDetail: requestDetail.memoDetail,
          listControlRunning: requestDetail.listControlRunning,
          // listFormName: requestDetail.listFormNames,
          // listRefDocDetails: _getMemoDetailById.refDocs,
        },
        Type: type,
      });
      if (_ActionMemoPage && !_ActionMemoPage.Message) {
        fetchWorklist();
        toggleAlert({
          description: `${type} Success.`,
          message: `Success`,
          type: "success",
          // duration: 100000000,
        });

        let ddd = document.getElementsByTagName("body");
        ddd[0].style.overflow = "none";
        setIsCardLoading(false);
        setToggleDetail(false);
      } else {
        toggleAlert({
          description: `${_ActionMemoPage.message}`,
          message: `Error`,
          type: "error",
        });
        setIsCardLoading(false);
      }
    }
  };
  const detechAutonumberFormula = (templateDesc: any) => {
    try {
      let _autoFormats: IAutoNumberAttibute = {
        formats: [],
        showSymbol: true,
        digit: 0,
        rowIndex: -1,
        colIndex: -1,
      };

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

      return _autoFormats;
    } catch (error) {
      console.log("auto=>error", error);

      return {
        formats: [],
        showSymbol: true,
        digit: 0,
        rowIndex: -1,
        colIndex: -1,
      };
    }
  };
  const CheckSaveAutonumber = async (
    templateId: Number,
    template_desc: any,
    autoNumFormat: IAutoNumberAttibute
  ) => {
    try {
      const rowIndex = autoNumFormat.rowIndex;
      const colIndex = autoNumFormat.colIndex;
      if (template_desc) {
        let value = template_desc.items[rowIndex].layout[colIndex].data.value;
        const autoTemp = template_desc.items[rowIndex].layout[colIndex];
        if (value) {
          const dd = value.split("-");
          const gg = dd.slice(0, dd.length - 1);
          let newRunning = -1;
          const requestBody = {
            Prefix: gg.join("-") + "-",
            Digit: autoTemp.template.digit,
            TemplateId: templateId,
            RunningNumber: dd.join("-"),
          };
          const checkAuto = await GetAutoNumber(requestBody);
          const checkNum = checkAuto.split("-");
          if (checkNum[0] !== "") {
            newRunning = checkNum[checkNum.length - 1];
            dd[dd.length - 1] = newRunning;
            requestBody.RunningNumber = newRunning;
          }
          return requestBody;
        }
      }
    } catch (error) {
      console.log("auto=>CheckSaveAutonumber=>error", error);
    }
  };
  const setContent = async (
    memoId: number,
    status: string,
    index: number,
    requestor: IUserModel
  ) => {
    // const _empData = empData.employeeData;

    const _memoDetail = await GetAllMemo({
      memoid: memoId,
      EmployeeId: requestor?.EmployeeId?.toString(),
      SecretId: "",
      actor: userData.EmployeeId,
    });
    if (_memoDetail.length > 0) {
      if (_memoDetail[0].Permission !== null) {
        if (_memoDetail[0].Permission.View === "F") {
          setIsShowPdfData(false);
        }
      }
    }

    const actor = {
      EmployeeId: userData.EmployeeId,
    };
    setToggleDetail(false);
    let _dataAttachfiles = await GetAllAttachFiles({ memoid: memoId });

    let _dataApprovals = await GetAllApprovals({ memoid: memoId });

    if (status !== "Draft") {
      let memoButton: IMemoButtonModel = {
        actor: {
          EmployeeId: userData.EmployeeId,
        },
        memoid: memoId,
      };
      let _dataMemobutton = await GetButtonMemoByMemoId(memoButton);
      setMenuButton(_dataMemobutton);
    } else {
      setMenuButton([]);
    }

    let _dataHistory = await GetAllHistory({
      Memoid: memoId,
      SecretId: "",
      actor: actor,
    });

    console.log({ _dataHistory });

    setSelectedCard((prevState) => ({
      ...prevState,
      approvals: _dataApprovals,
      attachfiles: _dataAttachfiles,
      requestor,
      MemoID: memoId,
      history: _dataHistory,
    }));

    setSidebarState(false);
    if (currentIndex !== index) {
      setCurrentMemoId(Number(memoId));
      setCurrentIndex(index);
      setToggleDetail(true);
    } else {
      setCurrentIndex(index);

      if (toggleDetail) {
        setCurrentMemoId(0);
        setToggleDetail(false);
      } else {
        setCurrentMemoId(Number(memoId));
        setToggleDetail(true);
      }
    }
  };

  const onSelectTask = (text: WorklistHeaderType) => {
    setTaskHeader(text);
    let task: TodoType = "todo";
    if (text === "All Task Group") {
      task = "todo";
    } else if (text === "To Do List") {
      task = "todo";
    } else if (text === "Related List") {
      task = "myrelate";
    } else if (text === "In Process") {
      task = "inprocess";
    } else if (text === "Completed") {
      task = "completed";
    } else if (text === "Cancelled") {
      task = "cancelled";
    } else if (text === "Rejected") {
      task = "rejected";
    }
    fetchWorklist(task);
    setCurrentPage(1);
    setDefaultTask(text);
  };
  const onSelectChange = async (
    value: any | any[],
    formSelect: WorklistSerachType
  ) => {
    let rawObject = searchObject;
    console.log({ value, formSelect, rawObject, defaultTask });

    if (formSelect) {
      rawObject[formSelect] = value;

      if (defaultTask === "Related List" && formSelect === "date") {
        fetchWorklist("myrelate", value);
      } else {
        setSearchObject((prevState: any) => ({
          ...prevState,
          ...rawObject,
        }));
      }

      setCurrentPage(1);
    }
  };
  const clearFilter = () => {
    if (defaultTask !== "Related List") {
      setSearchObject({
        date: [],
        form: [],
        status: [],
        company: [],
        department: [],
        keyword: "",
      });
    } else {
      fetchWorklist("myrelate", null);
    }
  };
  const paginate = (page: number) => {
    setCurrentPage(page);
  };
  const onSetItemPerPage = (numItem: any) => {
    console.log({ numItem, numItem2: Number(numItem) });
    setItemPerPage(numItem);
  };
  const filterStatusWorklistCard = (todo: ITodo, idx: number) => {
    return searchObject.status.length > 0
      ? searchObject.status.includes(todo.Status)
      : true;
  };
  const filterFormWorklistCard = (todo: ITodo, idx: number) => {
    return searchObject.form.length > 0
      ? searchObject.form.includes(todo.TemplateName)
      : true;
  };
  const filterCompanyWorklistCard = (todo: ITodo, idx: number) => {
    return searchObject.company.length > 0
      ? searchObject.company.includes(todo.CompanyName)
      : true;
  };
  const filterDepartmentWorklistCard = (todo: ITodo, idx: number) => {
    return searchObject.department.length > 0
      ? searchObject.department.includes(todo.DepartmentName)
      : true;
  };
  const filterKeywordWorklistCard = (todo: ITodo) => {
    const _keyword = searchObject.keyword?.toUpperCase();
    const waitingFor: IUserModel = todo?.WaitingFor;
    const requestor: IUserModel = todo?.Requestor;
    // console.log({ todo, waitingFor, requestor });

    return _keyword.length > 0
      ? todo.DepartmentName?.toUpperCase().includes(_keyword) ||
          todo.TemplateName?.toUpperCase().includes(_keyword) ||
          todo.CompanyName?.toUpperCase().includes(_keyword) ||
          todo.Status?.toUpperCase().includes(_keyword) ||
          todo.DocumentNo?.toUpperCase().includes(_keyword) ||
          todo.Subject?.toUpperCase().includes(_keyword) ||
          (waitingFor &&
            waitingFor?.NameEn?.toUpperCase().includes(_keyword)) ||
          waitingFor?.NameTh.toUpperCase().includes(_keyword) ||
          (requestor && requestor?.NameEn?.toUpperCase().includes(_keyword)) ||
          requestor?.NameTh?.toUpperCase().includes(_keyword)
      : true;
  };
  const filterDateWorklistCard = (todo: ITodo, idx: number) => {
    let momentWorklist = moment(todo.ModifiedDate, "DD/MM/yyyy");
    if (searchObject.date?.length > 0) {
      let formatWorklist = new Date(
        moment(momentWorklist).format("yyyy/MM/DD")
      );
      let formatDateTo = new Date(
        moment(searchObject.date[1]).format("yyyy/MM/DD")
      );
      let formatDateFrom = new Date(
        moment(searchObject.date[0]).format("yyyy/MM/DD")
      );
      if (formatWorklist >= formatDateFrom && formatWorklist <= formatDateTo) {
        return true;
      }
    } else {
      return true;
    }
  };

  const mapWorklistCard = (todo: ITodo, idx: number) => {
    return (
      <WorklistCardComponent
        // id={idx}
        key={idx}
        data={todo}
        onUpdate={onUpdateMemo}
        currentMemoId={currentMemoId}
        setContent={setContent}
        index={idx}
        taskGourp={taskGourp}
      />
    );
  };
  const spring = {
    type: "spring",
    damping: 10,
    stiffness: 100,
  };
  return (
    <div className="main-worklist">
      <AnimatePresence>
        <div className="main-container">
          {isCardLoading && (
            <div className="logo-loading">
              <img src={props.responeConfig?.pathLoading} alt="loading..." />
            </div>
          )}
          <div className="worklist-container">
            <div className="header-container">
              {sidebarState ? (
                <div className="mobile">
                  <div className="content filter-content">
                    <div className="worklist-filter-container">
                      <p className="clear-all-button" onClick={clearFilter}>
                        {t("Clear all")}
                      </p>
                      <div className="all-filter-container">
                        <WorkListSideBarElementUse
                          searchObject={searchObject}
                          onSelectChange={onSelectChange}
                          onSelectTask={onSelectTask}
                          formStatus={formStatusOptions}
                          allCompany={companiesOptions}
                          allDepartment={departmentsOptions}
                          formType={formTypeOptions}
                          defaultTask={defaultTask}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div className="button-container">
                <Button
                  type="text"
                  icon={<IoMenu size={28} />}
                  size="large"
                  onClick={toggleSideBar}
                  style={{ background: "transparent " }}
                />
                <TreeSelectNewRequest />
              </div>
              <div className="route-text-container">
                <p className="route-text">
                  {t("Worklist")} / {t(taskHeader)} (
                  {
                    workListData
                      ?.filter(filterStatusWorklistCard)
                      .filter(filterFormWorklistCard)
                      .filter(filterCompanyWorklistCard)
                      .filter(filterDepartmentWorklistCard)
                      .filter(filterKeywordWorklistCard)
                      .filter(filterDateWorklistCard)
                      .map(mapWorklistCard).length
                  }
                  )
                </p>
              </div>
            </div>
            <div className="content">
              <div className="worklist-items-container">
                {sidebarState && (
                  <motion.div
                    className="desktop"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="content filter-content">
                      <div className="worklist-filter-container">
                        <p className="clear-all-button" onClick={clearFilter}>
                          {t("Clear all")}
                        </p>
                        <div className="all-filter-container">
                          <WorkListSideBarElementUse
                            searchObject={searchObject}
                            onSelectChange={onSelectChange}
                            onSelectTask={onSelectTask}
                            formStatus={formStatusOptions}
                            allCompany={companiesOptions}
                            allDepartment={departmentsOptions}
                            formType={formTypeOptions}
                            defaultTask={defaultTask}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div className="worklist-cards-container">
                  <div className="item-per-page-container">
                    <span className="text-show">{t("Show")}</span>
                    <InputNumber
                      type={"number"}
                      size="small"
                      max={100000}
                      value={itemPerPage}
                      onChange={onSetItemPerPage}
                    />
                    <span className="text-items-per-page">
                      {t("items per page")}
                    </span>
                  </div>
                  <div className="cards-container">
                    {workListData
                      ?.filter(filterStatusWorklistCard)
                      .filter(filterFormWorklistCard)
                      .filter(filterCompanyWorklistCard)
                      .filter(filterDepartmentWorklistCard)
                      .filter(filterKeywordWorklistCard)
                      .filter(filterDateWorklistCard)
                      .slice(indexOfFirstPost, indexOfLastPost)
                      .map(mapWorklistCard)}
                  </div>
                  <Pagination
                    defaultCurrent={1}
                    current={currentPage}
                    pageSize={itemPerPage ? Number(itemPerPage) : 1}
                    total={
                      workListData
                        ?.filter(filterStatusWorklistCard)
                        .filter(filterFormWorklistCard)
                        .filter(filterCompanyWorklistCard)
                        .filter(filterDepartmentWorklistCard)
                        .filter(filterKeywordWorklistCard)
                        .filter(filterDateWorklistCard)
                        .map(mapWorklistCard).length
                    }
                    onChange={paginate}
                  />
                </div>
              </div>
            </div>
            <div style={{marginTop: "10px"}}></div>
            <FooterComponents />
          </div>
          {/* <AnimatePresence> */}
          {toggleDetail && (
            <DetailContentScreen
              setButtonType={setButtonType}
              buttonType={buttonType}
              data={selectedCard}
              isShowPdfData={isShowPdfData}
              menuButton={menuButton}
              onUpdate={onUpdateMemo}
            />
          )}
          {/* </AnimatePresence> */}
        </div>
      </AnimatePresence>

    </div>
  );
};
export default withPerMission(WorkListScreen);
