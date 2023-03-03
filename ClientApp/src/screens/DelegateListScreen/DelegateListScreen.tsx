import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Button } from "../../components/Button/Button";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import { FooterComponents } from "../../components/FooterComponents/FooterComponents";
import { InputTextComponents } from "../../components/InputTextComponents/InputTextComponents";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { RiUserSearchLine } from "react-icons/ri";
import { AiFillPlusCircle } from "react-icons/ai";

import "./DelegateScreen.css";
import { SelectDate } from "../../components/Select/SelectDate";
import { GetAllEmployee } from "../../Services/EmployeeService";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { GetAllDynamic } from "../../Services/DynamicService";
import { GetDepartment } from "../../Services/DepartmentService";
import { Toast } from "primereact/toast";
import DynamicTable from "../../components/TableComponents/DynamicTableFix/DynamicTable";
import useAlert from "../../hooks/useAlert";
import { CheckRolePermission } from "../../Services/AuthorizedService";
import { useUserContext } from "../../Context/UserContext";
import { SelectDataDialog } from "../../components/Select/SelectionDataDialog/SelectDataDialog";
function DelegateListScreen() {
  const { toggleAlert } = useAlert();
  const [isShowApproverModal, setIsShowApproverModal] = useState(false);
  const [isDialogApproverVisible, setIsDialogApproverVisible] = useState(false);
  const [approverData, setApproverData] = useState<any[]>([]);
  const [approverTextFilter, setApproverTextFilter] = useState("");
  const [approver, setApprover] = useState<any>({ name: "", ApproverId: null });
  const [delegater, setDelegater] = useState<any>({
    name: "",
    DelegateToId: null,
  });
  const [searchDelegateData, setSearchDelegateData] = useState<any[]>([]);
  const [delegateData, setDelegateData] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<any>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentModal, setCurrentModal] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [defaultDateRange, setDefaultDateRange] = useState<any>();
  const [dateRange, setDateRange] = useState<number>(0);
  const [dates, setDates] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [filterEmployee, setFilterEmployee] = useState<any>([]);
  const history = useHistory();
  const [userData] = useUserContext();

  const toast = useRef<any>(null);
  useEffect(() => {
    fetchDepartment();
    checkIsAdmin();
    fetchDataEmployee().then((emp: any) => fetchDelegateList(emp));
  }, []);

  const checkIsAdmin = async () => {
    const _isAdmin = await CheckRolePermission(userData.EmployeeId);

    setIsAdmin(_isAdmin);
  };

  const onSelectView = (e: any) => {};
  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={approverTextFilter}
          onChangeProps={onApproverFilterChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };
  const fetchDepartment = async () => {
    const department = await GetDepartment();
    setDepartmentData([...department]);
  };
  async function fetchDataEmployee() {
    const employee = await GetAllEmployee();
    setEmployeeData(employee);
    setFilterEmployee(employee);
    return employee;
  }
  const fetchDelegateList = async (emp: any) => {
    const _dataDynamic = await GetAllDynamic("DelegateList/GetAll", undefined);

    if (emp) {
      const _delegate = _dataDynamic.map((delegate: any) => {
        const approverData =
          emp.filter((_emp: any) => _emp.EmployeeId === delegate.ApproverId) ||
          [];
        const assignedData =
          emp.filter((_emp: any) => _emp.EmployeeId === delegate.AssignedId) ||
          [];
        return {
          ...delegate,
          Approver:
            approverData.length > 0
              ? userData.Lang === "EN"
                ? approverData[0].NameEn
                : approverData[0].NameTh
              : "Not found.",
          ["Delegate_To"]:
            assignedData.length > 0
              ? userData.Lang === "EN"
                ? assignedData[0].NameEn
                : assignedData[0].NameTh
              : "Not found.",
        };
      });
      setSearchDelegateData([..._delegate]);
      setDelegateData([..._delegate]);
    }
  };
  const onSelectDate = (date: any, label: any) => {
    if (date !== null && label === "List") {
      const result = delegateData.filter((_data: any, idx: any) => {
        let momentWorklistFrom = moment(_data.DateFrom, "DD MMM yyyy");
        let momentWorklistTo = moment(_data.DateTo, "DD MMM yyyy");
        let formatWorklistFrom = new Date(
          moment(momentWorklistFrom).format("yyyy/MM/DD")
        );
        let formatWorklistTo = new Date(
          moment(momentWorklistTo).format("yyyy/MM/DD")
        );
        let formatDateTo = new Date(moment(date[1]).format("yyyy/MM/DD"));
        let formatDateFrom = new Date(moment(date[0]).format("yyyy/MM/DD"));

        if (
          formatWorklistFrom >= formatDateFrom &&
          formatWorklistTo <= formatDateTo
        ) {
          return true;
        }
      });

      setSearchDelegateData([...result]);
      setDates([...date]);
    } else if (date !== null && label === "Detail") {
      setSearchDelegateData([...delegateData]);
      setDates([...date]);
    } else if (date === null) {
      setSearchDelegateData([...delegateData]);
      setDates([]);
    }
  };
  const onResetFilter = () => {
    setApprover({ name: "", ApproverId: null });
    setDelegater({
      name: "",
      DelegateToId: null,
    });
    setDates([]);
  };
  const onInputFilterChange = (e: any) => {
    const raw = delegateData;

    const data = raw.filter((data: any) => {
      if (data.CreatedBy !== null) {
        if (
          data.CreatedBy.toUpperCase().indexOf(e.toUpperCase()) !== -1 ||
          data.Remark.toUpperCase().indexOf(e.toUpperCase()) !== -1
        ) {
          return true;
        }
      }
    });

    setSearchDelegateData([...data]);
    setFilterText(e);
  };
  const onSelectDateRange = (range: string) => {
    if (range === undefined) {
      setDateRange(0);
    }
    if (range === "7 day") {
      setDateRange(7);
    }
    if (range === "1 month") {
      setDateRange(31);
    }
    if (range === "3 month") {
      setDateRange(91);
    }
    if (range === "1 year") {
      setDateRange(366);
    }

    setDefaultDateRange(range);
    setDates([]);
  };
  const onTemplateClick = (e: any) => {
    history.push(`/Delegate?delegateId=${e.DelegateId}`);
  };
  const onApproverFilterChange = (e: any) => {
    const value = e;
    const dataEmp: any = employeeData;
    console.log("value", value);
    setApproverTextFilter(value);
    const data = dataEmp.filter((data: any) => {
      if (
        data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.NameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.PositionNameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        data.DepartmentNameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1
      ) {
        return true;
      }
    });
    setFilterEmployee([...data]);
  };
  function showModalApprover(label: any) {
    if (approverTextFilter != "") {
      setApproverTextFilter("");
    }
    setCurrentModal(label);
    setIsDialogApproverVisible(!isDialogApproverVisible);
  }
  const onEmployeeSelect = (event: any, label: any) => {
    if (label === "approver") {
      setApprover((prevState: any) => ({
        ...prevState,
        name: event.data.NameTh,
        ApproverId: event.data.EmployeeId,
      }));
    }
    if (label === "delegate") {
      setDelegater((prevState: any) => ({
        ...prevState,
        name: event.data.NameTh,
        DelegateToId: event.data.EmployeeId,
      }));
    }
    setIsDialogApproverVisible(!isDialogApproverVisible);
  };

  const onDelegateRowSelect = (event: any) => {};
  const onClickSearch = async () => {
    let momentWorklist;
    let formatDate: any[] = [];
    if (dates.length > 0) {
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        //  momentWorklist = moment(_data.ModifiedDate, "DD/MM/yyyy");
        formatDate.push(moment(date).format("dd/MM/yyyy"));
      }
    }
    if (approver.ApproverId !== null || delegater.DelegateToId !== null) {
      const dataJson = {
        ApproverId: approver.ApproverId !== null ? approver.ApproverId : 0,
        DelegateToId:
          delegater.DelegateToId !== null ? delegater.DelegateToId : 0,
        // DateFrom: formatDate.length > 0 ? formatDate[0] : "",
        // DateTo: formatDate.length > 0 ? formatDate[1] : "",
        DateFrom: "",
        DateTo: "",
      };
      console.log("formatDate", formatDate);

      const dataLogic = await fetch("api/DelegateList/GetDetailByValue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          if (data) {
            const startDate =
              formatDate.length > 0 ? moment(formatDate[0]) : undefined;
            const endDate =
              formatDate.length > 0 ? moment(formatDate[1]) : undefined;
            const test = moment(data[0]?.RequestDate);

            const newData = data.filter((delegate: any) =>
              moment(delegate.RequestDate).isBetween(startDate, endDate)
            );
            console.log({ startDate, endDate, newData, test });
          }
          setApproverData([...data]);
        });
    } else {
      toggleAlert({
        description: `Please select Approver or Delegate To`,
        message: `Require field warning.`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Please select Approver or Delegate To",
      //   life: 7000,
      // });
    }
  };
  return (
    <div>
      {/* {onLoading && (
        <div className="logo-loading cursor-loading">
          <img src={imgLoading} alt="loading..." />
        </div>
      )} */}
      <Toast ref={toast} />
      <div className="main-container">
        <div className="worklist-container">
          <div className="header-container">
            <div className="button-container">
              <TreeSelectNewRequest setDataTemplateTreeProps={null} />
            </div>
            <div
              className="route-text-container"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <p className="route-text">Delegate List</p>
            </div>
            <button
              className={`create-delegate-button`}
              style={{ alignSelf: "flex-end" }}
              onClick={() => history.push("/Settings?name=Delegate")}
            >
              <AiFillPlusCircle />
              <span>Create Delegate</span>
            </button>
          </div>
          <div className="delagate-container">
            <Row>
              <div className="button-group">
                <button
                  className={`button-select-view ${
                    currentPage === 1 ? "-active" : ""
                  }`}
                  onClick={() => {
                    setCurrentPage(1);
                    onResetFilter();
                  }}
                >
                  <MdOutlineFormatListBulleted />
                  <span>Delegate List</span>
                </button>
                <button
                  className={`button-select-view ${
                    currentPage === 2 ? "-active" : ""
                  }`}
                  onClick={() => {
                    setCurrentPage(2);
                    onResetFilter();
                  }}
                >
                  <RiUserSearchLine />
                  <span>Delegate Detail</span>
                </button>
              </div>
            </Row>
            {currentPage === 2 && (
              <>
                <Row>
                  <Col lg={2}>
                    <div className="input-label">
                      <span className="text-header">Approver : </span>
                      <span className="text-header star">*</span>
                    </div>
                    <p className="text-desc">ผู้อนุมัติงาน :</p>
                  </Col>
                  <Col lg={4}>
                    <div
                      className="p-inputgroup"
                      style={{
                        height: "38px",
                        width: "100% ",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <InputTextComponents
                        setClassNameProps="information-inputTexta-width-inputText-company"
                        setStyleDivProps={{ flex: "1" }}
                        valueProps={approver.name}
                        placeholderProps={"Select"}
                        disabledProps={false}
                        setStyleProps={{
                          height: "38px",
                          width: "100% ",
                          fontSize: "13px",
                        }}
                        onClickProps={() => showModalApprover("approver")}
                        readOnlyProps={true}
                      />
                      <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        onClickProps={() => showModalApprover("approver")}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "38px",
                        }}
                        disabledProps={false}
                      />
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="input-label">
                      <span className="text-header">Delegate to : </span>
                      <span className="text-header star">*</span>
                    </div>
                    <p className="text-desc">ผู้อนุมัติงานแทน :</p>
                  </Col>
                  <Col lg={4}>
                    <div
                      className="p-inputgroup"
                      style={{
                        height: "38px",
                        width: "100% ",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <InputTextComponents
                        setClassNameProps="information-inputTexta-width-inputText-company"
                        setStyleDivProps={{ flex: "1" }}
                        valueProps={delegater.name}
                        placeholderProps={"Select"}
                        disabledProps={false}
                        setStyleProps={{
                          height: "38px",
                          width: "100% ",
                          fontSize: "13px",
                        }}
                        onClickProps={() => showModalApprover("delegate")}
                        readOnlyProps={true}
                      />
                      <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        onClickProps={() => showModalApprover("delegate")}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "38px",
                        }}
                        disabledProps={false}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={2}>
                    <div className="input-label">
                      <span className="text-header">
                        Delegated Date Period :
                      </span>
                    </div>
                    <p className="text-desc">ช่วงเวลา :</p>
                  </Col>
                  <Col lg={10}>
                    <div
                      className="p-inputgroup"
                      style={{
                        height: "38px",
                        width: "100% ",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <SelectDate
                        id="start"
                        title="From"
                        name="trip-start"
                        disable={false}
                        dates={dates}
                        onSelectChange={(e: any) => onSelectDate(e, "Detail")}
                        dateRange={dateRange}
                        isFullWidth={true}
                      />
                      {/* <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                          height: "38px",
                        }}
                        disabledProps={false}
                      /> */}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className="button-group">
                    <ButtonComponents
                      setIconProps={"pi pi-search"}
                      setLabelProps={"Search"}
                      setClassNameProps={"button-delegate-search"}
                      onClickProps={() => onClickSearch()}
                      setStyleProps={{
                        backgroundColor: "#282f6a",
                        border: "1px solid #282f6a",
                        borderTopRightRadius: "6px",
                        borderBottomRightRadius: "6px",
                        boxShadow: "none",
                        height: "32px",
                        padding: "0 30px",
                      }}
                      disabledProps={false}
                    />
                    <ButtonComponents
                      setIconProps={"pi pi-refresh"}
                      setLabelProps={"Reset"}
                      setClassNameProps={"button-delegate-reset"}
                      onClickProps={() => onResetFilter()}
                      setStyleProps={{
                        backgroundColor: "#FB3A3A",
                        border: "1px solid #FB3A3A",
                        borderTopRightRadius: "6px",
                        borderBottomRightRadius: "6px",
                        boxShadow: "none",
                        height: "32px",
                        padding: "0 30px",
                      }}
                      disabledProps={false}
                    />
                  </Col>
                </Row>
                <DataTable
                  paginator
                  rows={5}
                  value={approverData}
                  selectionMode="single"
                  tableStyle={{
                    border: "1px solid #e6e6e6",
                    outlineColor: "#e6e6e6",
                  }}
                  dataKey="id"
                  responsiveLayout="scroll"
                  onRowSelect={onDelegateRowSelect}
                >
                  <Column
                    field="DocumentNo"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Document No.</p>
                        </th>
                      </tr>
                    }
                    body={(row: any, options: any) => (
                      <p
                        onClick={() =>
                          history.push(`Request?MemoID=${row.MemoId}`)
                        }
                      >
                        {row.DocumentNo}
                      </p>
                    )}
                  ></Column>
                  <Column
                    field="TemplateName"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Form Name</p>
                        </th>
                      </tr>
                    }
                  ></Column>
                  <Column
                    field="RequestDate"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Date</p>
                        </th>
                      </tr>
                    }
                    body={(value: any) => {
                      if (value.RequestDate != "") {
                        let someDateString = moment(
                          value.RequestDate,
                          "YYYY-MM-DD"
                        );
                        console.log("value", value.RequestDate, someDateString);

                        const NewDate =
                          moment(someDateString).format("DD MMM yyyy");
                        return NewDate;
                      } else {
                        return "";
                      }
                    }}
                  ></Column>
                  <Column
                    field="RequesterId"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Requestor</p>
                        </th>
                      </tr>
                    }
                    body={(row: any, options: any) =>
                      employeeData.map((data: any) => {
                        if (data.EmployeeId === row.RequesterId) {
                          return <p>{data.NameTh}</p>;
                        }
                      })
                    }
                  ></Column>
                  <Column
                    field="RequesterDeptId"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Department</p>
                        </th>
                      </tr>
                    }
                    body={(row: any, options: any) =>
                      departmentData.map((data: any) => {
                        if (data.DepartmentId === row.RequesterDeptId) {
                          return <p>{data.NameTh}</p>;
                        }
                      })
                    }
                  ></Column>
                  <Column
                    field="Status"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Status</p>
                        </th>
                      </tr>
                    }
                  ></Column>
                  <Column
                    field="ActionId"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Last Action By</p>
                        </th>
                      </tr>
                    }
                    body={(row: any, options: any) =>
                      employeeData.map((data: any) => {
                        if (data.EmployeeId == row.ActionId) {
                          return <p>{data.NameTh}</p>;
                        }
                      })
                    }
                  ></Column>
                  <Column
                    field="WaitingId"
                    header={
                      <tr>
                        <th>
                          <p className="row headtext">Waiting For</p>
                        </th>
                      </tr>
                    }
                    body={(row: any, options: any) =>
                      employeeData.map((data: any) => {
                        if (data.EmployeeId === row.WaitingId) {
                          return <p>{data.NameTh}</p>;
                        }
                      })
                    }
                  ></Column>
                </DataTable>
              </>
            )}
            {currentPage === 1 && (
              <>
                {/* <Row>
                  <Col lg={2}>
                    <div className="input-label">
                      <span className="text-header">Search : </span>
                    </div>
                    <p className="text-desc">ค้นหา :</p>
                  </Col>
                  <Col lg={4}>
                    <div
                      className="p-inputgroup"
                      style={{
                        height: "38px",
                        width: "100% ",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ paddingBottom: "3px", width: "100%" }}>
                        <InputTextComponents
                          setStyleProps={{
                            width: "100%",
                            height: "38px",
                            borderRadius: "6px 0px 0px 6px",
                          }}
                          onChangeProps={onInputFilterChange}
                          keyProps={"Search"}
                          valueProps={filterText}
                        />
                      </div>
                      <ButtonComponents
                        setIconProps={"pi pi-search"}
                        setClassNameProps={"p-button-text-position"}
                        setStyleProps={{
                          backgroundColor: "#282f6a",
                          border: "1px solid #282f6a",
                          borderTopRightRadius: "6px",
                          borderBottomRightRadius: "6px",
                          boxShadow: "none",
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={2}>
                    <div className="input-label">
                      <span className="text-header">
                        Delegated Date Period :{" "}
                      </span>
                    </div>
                    <p className="text-desc">ช่วงเวลา :</p>
                  </Col>
                  <Col lg={4}>
                    <div
                      className="p-inputgroup"
                      style={{
                        height: "38px",
                        width: "100% ",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <SelectDate
                        id="start"
                        title="From"
                        name="trip-start"
                        disable={false}
                        dates={dates}
                        onSelectChange={(e: any) => onSelectDate(e, "List")}
                        dateRange={dateRange}
                        isFullWidth={true}
                      />
                    </div>
                  </Col>
                </Row> */}

                <DynamicTable
                  tableName={"Delegate List"}
                  dataSource={searchDelegateData}
                  setDataSource={setSearchDelegateData}
                  rowClickAction={onTemplateClick}
                  canExport={isAdmin}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          paddingRight: "40px",
          paddingLeft: "40px",
          paddingBottom: "20px",
          flex: "1 1",
          width: "100%",
        }}
      >
        <FooterComponents />
      </div>
      <SelectDataDialog
        dataList={employeeData}
        dialogKey={"employee"}
        onSelectFunc={(e: any) => onEmployeeSelect(e, currentModal)}
        columns={[
          {
            field: "EmployeeCode",
            headerEn: "EmployeeCode",
            headerTh: "รหัสพนักงาน",
          },
          {
            field: "NameEn",
            headerEn: "Name",
            headerTh: "ชื่อ",
          },
          {
            field: "PositionNameEn",
            headerEn: "Position",
            headerTh: "ตำแหน่ง",
          },
          {
            field: "DepartmentNameEn",
            headerEn: "Department",
            headerTh: "หน่วยงาน",
          },
        ]}
        dialogVisible={isDialogApproverVisible}
        setDialogVisible={() => showModalApprover(currentModal)}
      />
      {/* <Dialog
        header={renderHeader}
        visible={isDialogApproverVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={() => showModalApprover(currentModal)}
        className="information-dialog"
        dismissableMask
        draggable={false}
        resizable={false}
        closable={false}
      >
        <DataTable
          paginator
          rows={5}
          value={filterEmployee}
          selectionMode="single"
          tableStyle={{ border: "1px solid #e6e6e6", outlineColor: "#e6e6e6" }}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={(e: any) => onEmployeeSelect(e, currentModal)}
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
            field="NameEn"
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
            field="PositionNameEn"
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
            field="DepartmentNameEn"
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
      </Dialog> */}
    </div>
  );
}

export default DelegateListScreen;
