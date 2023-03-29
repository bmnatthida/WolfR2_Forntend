import moment from "moment";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import React, { useState, useEffect, useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BiUpload } from "react-icons/bi";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import { CheckboxCpmponents } from "../../components/CheckboxCpmponents/CheckboxCpmponents";
import { InputTextComponents } from "../../components/InputTextComponents/InputTextComponents";
import DescriptionConfigComponent from "../../components/RequestComponents/AttachmentComponent/DescriptionConfigComponent";
import { SelectDate } from "../../components/Select/SelectDate";
import { GetAllEmployee } from "../../Services/EmployeeService";
import { SelectDataDialog } from "../../components/Select/SelectionDataDialog/SelectDataDialog";
import {
  UploadRequestFiles,
  UploadTinyMce,
} from "../../Services/UploadFileService";
import { UploadFileAttachFiles } from "../../Services/AttachFileService";
import { generateQuickGuid } from "../../Helper/GenerateGuid";
import useAlert from "../../hooks/useAlert";

type Props = {
  delegateData: any;
  setDelegateData: any;
  setAttachmentData: any;
  attachmentData: any;
  usePeriod: boolean;
  setUsePeriod: any;
  errorState: any;
};

const DelegateInformation = (props: Props) => {
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  const ref = useRef<any>();
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [attachData, setAttachData] = useState<any[]>([]);
  const [fileData, setFileData] = useState<any>();
  const [requestFile, setRequestFile] = useState<any>(null);
  const [pathData, setPathData] = useState<any>();
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [description, setDescription] = useState("");
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [currentModal, setCurrentModal] = useState<string>("");
  const [index, setIndex] = useState<number>();
  const [isDialogApproverVisible, setIsDialogApproverVisible] =
    useState<boolean>(false);
  const [dates, setDates] = useState<any[]>([]);
  const [visibleStatus, setVisibleStatus] = useState(false);
  const [approverTextFilter, setApproverTextFilter] = useState<string>("");
  const [approver, setApprover] = useState<any>({ name: "", ApproverId: null });
  const [dateRange, setDateRange] = useState<number>(0);
  const [checked, setChecked] = useState<any[]>([]);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [descriptionRespone, setDescriptionRespone] = useState<string>();
  const [visibleConfirmProp, setVisibleConfirmProp] = useState(false);
  const [rowDeleted, setRowDeleted] = useState<any>();
  const [searchEmployee, setSearchEmployee] = useState<any[]>([]);

  const [delegater, setDelegater] = useState<any>({
    name: "",
    DelegateToId: null,
  });
  var respone = JSON.parse(localStorage.getItem("userData") || "");
  const _sharepointSiteURL = respone.SharepointSiteURL;

  var userData = respone.employeeData;
  useEffect(() => {
    fetchDataEmployee();
  }, []);
  // useEffect(() => {
  //   let _attachmentData = props.attachmentData;
  //   console.log("dasdasdasd", props.attachmentData);

  //   for (let i = 0; i < _attachmentData.length; i++) {
  //     const attachment = _attachmentData[i];
  //     for (let j = 0; j < employeeData.length; j++) {
  //       const emp = employeeData[j];
  //       if (attachment.ActorId === emp.EmployeeId) {
  //         _attachmentData[i].ActorId = emp;
  //       }
  //     }
  //   }

  //   setAttachData([..._attachmentData]);
  // }, [props.attachmentData, employeeData]);
  useEffect(() => {
    let _date = new Array(2);
    let _attachmentData = props.delegateData.AttachmentList;
    const _approver = employeeData.find(
      (data: any) =>
        data.EmployeeId === props.delegateData.DelegateList.ApproverId
    );
    const _delegater = employeeData.find(
      (data: any) =>
        data.EmployeeId === props.delegateData.DelegateList.DelegateToId
    );
    if (_approver.length > 0) {
      setApprover((prevState: any) => ({
        ...prevState,
        name: userData.Lang === "EN" ? approver.NameEn : approver.NameTh,
        ApproverId: _approver.EmployeeId,
      }));
    }
    if (_delegater.length > 0) {
      setDelegater((prevState: any) => ({
        ...prevState,
        name: userData.Lang === "EN" ? _delegater.NameEn : _delegater.NameTh,
        DelegateToId: _delegater.EmployeeId,
      }));
    }
    for (let i = 0; i < _attachmentData.length; i++) {
      const attachment = _attachmentData[i];
      for (let j = 0; j < employeeData.length; j++) {
        const emp = employeeData[j];
        if (attachment.ActorId === emp.EmployeeId) {
          _attachmentData[i].ActorId = emp;
        }
      }
    }
    setAttachData([..._attachmentData]);
    if (
      props.delegateData.DelegateList.DateFrom &&
      props.delegateData.DelegateList.DateTo
    ) {
      if (
        props.delegateData.DelegateList.DateFrom.length > 0 &&
        props.delegateData.DelegateList.DateTo.length > 0
      ) {
        _date[0] = formatDateTimeToMoment(
          props.delegateData.DelegateList.DateFrom
        );
        _date[1] = formatDateTimeToMoment(
          props.delegateData.DelegateList.DateTo
        );
      }
    }
    // console.log(
    //   "props.delegateData.DelegateList.DateTo",
    //   props.delegateData.DelegateList.DateTo.length
    // );

    // console.log(
    //   "DateFrom",
    //   moment(new Date(), "DD/MM/YYYY").format("DD/MM/yyyy HH:mm:ss")
    // );
    setDates([..._date]);
    console.log(approver, delegater, employeeData);
  }, [props.delegateData, employeeData]);

  const onApproverFilterChange = (e: any) => {
    const value = e;
    const dataEmp = employeeData;
    console.log("Dialog=>value ", value);
    setApproverTextFilter(value);

    const data = dataEmp.filter((data: any) => {
      if (
        data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        userData.Lang === "EN"
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
    setSearchEmployee([...data]);
  };
  const confirmDialogfunction = (rowDeleted: any) => {
    setVisibleConfirmProp(true);
    setRowDeleted(rowDeleted);
  };
  const onSelectCheckboxDelegate = (checked: any, keyProps: any) => {
    console.log(checked, keyProps);
  };
  const onSelectDate = (date: any, label: any) => {
    console.log("date", date);
    if (date !== null) {
      props.setDelegateData((prevState: any) => ({
        ...prevState,
        DelegateList: {
          ...props.delegateData.DelegateList,
          DateFrom: formatDateTimeWithSlash(date[0]),
          DateTo: formatDateTimeWithSlash(date[1]),
        },
      }));
      setDates([...date]);
    } else {
      props.setDelegateData((prevState: any) => ({
        ...prevState,
        DelegateList: {
          ...props.delegateData.DelegateList,
          DateFrom: null,
          DateTo: null,
        },
      }));
      setDates([]);
    }
  };
  const formatDateTimeWithSlash = (value: string) => {
    if (value == null) {
      return "";
    } else {
      let momentObj = moment(value, "DD/MM/yyyy HH:mm:ss");
      return moment(momentObj).format("DD/MM/yyyy");
    }
  };
  const formatDateTime = (value: string) => {
    if (value == null) {
      return "";
    } else {
      let momentObj = moment(value, "DD/MM/yyyy HH:mm:ss");
      return moment(momentObj).format("DD MMM yyyy");
    }
  };
  const formatDateTimeAttachment = (value: string) => {
    if (value == null) {
      return "";
    } else {
      let momentObj = moment(value, "yyy/mm/DD HH:mm:ss");
      return moment(momentObj).format("DD MMM yyyy");
    }
  };
  const formatDateTimeToMoment = (value: string) => {
    if (value == null) {
      return "";
    } else {
      let momentObj = moment(value, "DD/MM/yyyy HH:mm:ss");
      return momentObj;
    }
  };
  const convertDate = (data: any) => {
    return formatDateTime(data);
  };
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
  function showDeletedData() {
    toggleAlert({
      description: `Data delete success.`,
      message: `Success`,
      type: "success",
    });
    // toast.current.show({
    //   severity: "error",
    //   summary: "Deleted Data",
    //   detail: "",
    // });
  }
  function rowDelete(rowIndex: any) {
    let data = attachData;

    data.splice(rowIndex, 1);

    let reoderSequence = data.map((e: any, i: number) => {
      e.sequence = i + 1;
      return e;
    });
    console.log("reoderSequencereoderSequence", reoderSequence);
    props.setDelegateData((prevState: any) => ({
      ...prevState,
      AttachmentList: [...reoderSequence],
    }));
    setAttachData([...reoderSequence]);
    showDeletedData();
  }
  async function onUploadFile() {
    if (requestFile !== null) {
      setOnLoading(true);
      const attachWorkList = attachData;
      const lastFile = attachWorkList[attachWorkList.length - 1];
      const NewDate = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
      let newFile = Object.assign({}, lastFile);

      const formData = new FormData();
      formData.append(`files`, requestFile);
      formData.append("Doclib", "TempAttachment");
      formData.append("docSet", generateQuickGuid());
      formData.append("fileDesc", description);
      formData.append("actorID", userData.EmployeeId);
      var response: any = await UploadFileAttachFiles(formData);
      console.log({ response, requestFile });

      if (response.data?.result === true) {
        if (lastFile !== undefined) {
          // newFile.memo_id = checking.memoid;
          newFile.sequence = lastFile.sequence + 1;
          newFile.ActorId = userData;
          newFile.AttachedDate = NewDate;
          newFile.AttachFile = response.data?.fileName;

          newFile.ModifiedDate = NewDate;
          newFile.ModifiedBy = userData.EmployeeId.toString();
          newFile.FileName = description;
        } else if (lastFile === undefined) {
          // newFile.memo_id = checking.memoid;
          newFile.sequence = 1;
          newFile.ActorId = userData;
          newFile.AttachedDate = NewDate;
          newFile.AttachFile = fileData;
          newFile.ModifiedDate = NewDate;
          newFile.ModifiedBy = userData.EmployeeId.toString();
          newFile.FileName = description;
        }
        if (_sharepointSiteURL) {
          newFile.FilePath = _sharepointSiteURL + "" + response.data.pathUrl;
        } else {
          newFile.FilePath = response.data.pathUrl;
        }
        if (lastFile != undefined) {
          newFile.sequence = lastFile.sequence + 1;
        } else {
          newFile.sequence = 1;
        }

        attachWorkList.push(newFile);
        console.log({ attachWorkList });

        props.setDelegateData((prevState: any) => ({
          ...prevState,
          AttachmentList: [...attachWorkList],
        }));
        setAttachData([...attachWorkList]);
      } else {
        onError();
      }
      setOnLoading(false);
      setRequestFile(null);
      setDescriptionValue("");
      setDescription("");
      ref.current.value = null;
    } else {
      toggleAlert({
        description: `Please Select File.`,
        message: `Require field warning.`,
        type: "warning",
      });

      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: "Please Select File",
      //   life: 3000,
      // });
    }
    // setOnLoading(true);
    // const rawData = attachData;
    // const lastFile = attachData[attachData.length - 1];
    // const NewDate = moment(new Date()).format("yyy/mm/DD HH:mm:ss");
    // let newFile = Object.assign({}, lastFile);
    // if (requestFile !== null) {
    // if (lastFile !== undefined) {
    //   // newFile.memo_id = checking.memoid;
    //   newFile.sequence = lastFile.sequence + 1;
    //   newFile.ActorId = userData;
    //   newFile.AttachedDate = NewDate;
    //   newFile.AttachFile = fileData;

    //   newFile.ModifiedDate = NewDate;
    //   newFile.ModifiedBy = userData.EmployeeId.toString();
    //   newFile.FileName = description;
    // } else if (lastFile === undefined) {
    //   // newFile.memo_id = checking.memoid;
    //   newFile.sequence = 1;
    //   newFile.ActorId = userData;
    //   newFile.AttachedDate = NewDate;
    //   newFile.AttachFile = fileData;
    //   newFile.ModifiedDate = NewDate;
    //   newFile.ModifiedBy = userData.EmployeeId.toString();
    //   newFile.FileName = description;
    // }
    //   let base64: any = await convertBase64(requestFile);
    //   console.log("e.target", base64);
    //   for (let i = 0; i < base64.length; i++) {
    //     const text = base64[i];
    //     if (text === ",") {
    //       base64 = base64.substring(i + 1);
    //       break;
    //     }
    //   }
    //   const dataJson = {
    //     FileBytes: base64,
    //     FileName: requestFile.name,
    //   };

    //   console.log("dataJson", dataJson);

    //   const response = await UploadTinyMce(dataJson);
    //   console.log("response", response);
    //   if (response.imageUrl) {
    //     newFile.FilePath = response.imageUrl;

    //     rawData.push(newFile);
    //     setAttachData([...rawData]);
    // props.setDelegateData((prevState: any) => ({
    //   ...prevState,
    //   AttachmentList: [...rawData],
    // }));
    //     setRequestFile(null);
    //     setDescriptionValue("");
    //     ref.current.value = null;
    //   }
    // }
  }
  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const onUpload = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "File Uploaded",
      life: 3000,
    });
  };
  const onError = () => {
    toggleAlert({
      description: `Server Error Please try again.`,
      message: `Error`,
      type: "error",
    });
    // toast.current.show({
    //   severity: "error",
    //   summary: "Error Message",
    //   detail: "Server Error Please try again",
    //   life: 3000,
    // });
  };
  const onRemove = () => {
    toggleAlert({
      description: `File Remove success.`,
      message: `Success`,
      type: "success",
    });
    // toast.current.show({
    //   severity: "warn",
    //   summary: "Success",
    //   detail: "File Removed",
    //   life: 1000,
    // });
  };
  const onFileSelect = async (e: any) => {
    var filename = e.target.value;
    var userName = filename.split("\\").pop();
    setRequestFile(e.target.files[0]);

    setFileData(userName);
    setPathData(filename);
  };

  function deleteFile() {
    setAttachData(
      attachData.filter((val) => {
        return val.sequence !== index;
      })
    );

    onRemove();
  }
  async function fetchDataEmployee() {
    const employee = await GetAllEmployee();
    setSearchEmployee(employee);
    setEmployeeData(employee);
  }
  function showModalApprover(label: any) {
    if (approverTextFilter != "") {
      setApproverTextFilter("");
    }

    setCurrentModal(label);
    setIsDialogApproverVisible(!isDialogApproverVisible);
    // fetchDataEmployee();
  }
  const onEmployeeSelect = (event: any, label: any) => {
    console.log(userData.Lang === "EN" ? event.data.NameEn : event.data.NameTh);
    if (label === "approver") {
      setApprover((prevState: any) => ({
        ...prevState,
        name: userData.Lang === "EN" ? event.data.NameEn : event.data.NameTh,
        ApproverId: event.data.EmployeeId,
      }));
      props.setDelegateData((prevState: any) => ({
        ...prevState,
        DelegateList: {
          ...props.delegateData.DelegateList,
          ApproverId: event.data.EmployeeId,
        },
      }));
    }
    if (label === "delegate") {
      setDelegater((prevState: any) => ({
        ...prevState,
        name: userData.Lang === "EN" ? event.data.NameEn : event.data.NameTh,
        DelegateToId: event.data.EmployeeId,
      }));
      props.setDelegateData((prevState: any) => ({
        ...prevState,
        DelegateList: {
          ...props.delegateData.DelegateList,
          DelegateToId: event.data.EmployeeId,
        },
      }));
    }
    setIsDialogApproverVisible(!isDialogApproverVisible);
  };
  return (
    <div className="create-delagate-container">
      <Toast ref={toast}></Toast>
      <p className="text-header">Authorization for Manage</p>
      <div className="create-delegate-input-container">
        <Row className="input-row">
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
              onClick={() => {
                console.log(approver);
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

        <Row className="input-row">
          <Col lg={2}>
            <div
              className="checkboxCpmponents-checkbox-p-highlight"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Checkbox
                inputId="binary"
                checked={props.usePeriod}
                onChange={(e) => props.setUsePeriod(e.checked)}
              />
              <label
                style={{
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "13px",
                  lineHeight: "19px",
                  marginLeft: "5px",
                  color: "#000000",
                }}
                htmlFor="binary"
              >
                Delegate during Period.
              </label>
            </div>
            {/* <CheckboxCpmponents
              checkedProps={"Delegate Date Period : "}
              onChangeProps={onSelectCheckboxDelegate}
              keyProps={"isDuringPeriod"}
            /> */}
          </Col>
          {props.usePeriod && (
            <Col lg={10}>
              <div className="select-period-container">
                <div>
                  <div className="input-label">
                    <span className="text-header">Delegate Date Period : </span>
                    <span className="text-header star">*</span>
                  </div>
                  <p className="text-desc">ช่วงเวลา :</p>
                </div>
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
                    showIcon={false}
                    isFullWidth={true}
                  />
                </div>
              </div>
            </Col>
          )}
        </Row>
        <Row className="input-row">
          <Col lg={2}>
            <div className="input-label">
              <span className="text-header">Remark : </span>
              <span className="text-header star">*</span>
            </div>
            <p className="text-desc">หมายเหตุ :</p>
          </Col>
          <Col lg={10}>
            <InputTextComponents
              valueProps={props.delegateData?.DelegateList.Remark}
              setStyleProps={{
                width: "100%",
                height: "38px",
                borderRadius: "6px",
              }}
              onChangeProps={(e: any) =>
                props.setDelegateData((prevState: any) => ({
                  ...prevState,
                  DelegateList: {
                    ...props.delegateData.DelegateList,
                    Remark: e,
                  },
                }))
              }
            />
          </Col>
        </Row>
        <Row className="input-row">
          <Col lg={2}>
            <div className="input-label">
              <span className="text-header">Attach File : </span>
            </div>
            <p className="text-desc">ไฟล์แนบ :</p>
          </Col>
          <Col lg={10}>
            <div className="p-inputgroup">
              <Form.Control
                ref={ref}
                type="file"
                accept=".jpg, .jpeg, .png, .pdf, .xlsx, .PNG"
                onChange={(e) => onFileSelect(e)}
                multiple
                className="attachForm-border-fttach-file"
              />
            </div>
          </Col>
        </Row>
        <Row className="input-row">
          <Col lg={2}>
            <div className="input-label">
              <span className="text-header">File Description : </span>
            </div>
            <p className="text-desc">รายละเอียดไฟล์ :</p>
          </Col>
          <Col lg={10}>
            <div className="p-inputgroup">
              <InputText
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                  setDescription(e.target.value);
                }}
                className="p-d-block p-inputgroup attachForm-border-description-inputText"
              />

              <Button
                className="button-upload attachForm-border-description-button"
                onClick={onUploadFile}
              >
                <BiUpload />
                Upload
              </Button>
            </div>
          </Col>
        </Row>
        <div>
          {attachData.length > 0 && (
            <DataTable
              paginator
              rows={5}
              value={attachData}
              tableStyle={{
                border: "1px solid #e6e6e6",
                outlineColor: "#e6e6e6",
              }}
              // selection={selectedCustomers}
              // onSelectionChange={(e) => setSelectedCustomers(e.value)}
              dataKey="id"
              responsiveLayout="scroll"
            >
              <Column
                field="AttachedDate"
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Attach Date</p>
                      <p className="row subtext">วันที่แนบไฟล์</p>
                    </th>
                  </tr>
                }
                body={(row: any) => (
                  <span>{formatDateTimeAttachment(row.AttachedDate)}</span>
                )}
              ></Column>
              <Column
                field="AttachFile"
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Attached File</p>
                      <p className="row subtext">ไฟล์ที่แนบ</p>
                    </th>
                  </tr>
                }
                body={(row: any) => (
                  <a href={row.FilePath} target="_blank">
                    {row.AttachFile}
                  </a>
                )}
              ></Column>
              <Column
                field="FileName"
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Description</p>
                      <p className="row subtext">รายละเอียด</p>
                    </th>
                  </tr>
                }
              ></Column>
              <Column
                field={
                  userData.Lang === "En" ? "ActorId.NameEn" : "ActorId.NameTh"
                }
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Actor</p>
                      <p className="row subtext">ผู้ดำเนินการ</p>
                    </th>
                  </tr>
                }
              ></Column>
              <Column
                header={
                  <tr>
                    <th>
                      <p className="row headtext">Delete</p>
                      <p className="row subtext">ลบ</p>
                    </th>
                  </tr>
                }
                body={(row: any, options: any) => (
                  <ButtonComponents
                    setIconProps={"pi pi-trash"}
                    setClassNameProps={
                      " p-button-danger p-mr-2 set-icon-LineApprovalsComponent"
                    }
                    onClickProps={() => confirmDialogfunction(options.rowIndex)}
                  />
                )}
              ></Column>
            </DataTable>
          )}
        </div>
      </div>
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={employeeData}
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
        setDialogVisible={setIsDialogApproverVisible}
      />
      <ConfirmDialog
        visible={deleteVisible}
        onHide={() => setDeleteVisible(false)}
        message="Are you sure to Delete this File?"
        header="Delete Confirmation"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        accept={deleteFile}
        reject={() => setDeleteVisible(false)}
      />
      {visibleStatus == true && (
        <DescriptionConfigComponent
          worklist={undefined}
          visibleStatus={visibleStatus}
          setVisibleStatus={setVisibleStatus}
          sequenceIndex={index}
          description={descriptionRespone}
          setAttachData={setAttachData}
          attachData={attachData}
        />
      )}
      <ConfirmDialog
        visible={visibleConfirmProp}
        onHide={() => setVisibleConfirmProp(false)}
        message={"Do you want to delete this row?"}
        header="Confirmation"
        icon="pi pi-info-circle"
        className="z-index-confirm"
        acceptClassName="p-button-danger table-control-confirm-button p-button-accept-cancel"
        rejectClassName="p-button p-component p-confirm-dialog-reject p-button p-component p-button-outlined p-button-danger"
        position="top"
        accept={() => rowDelete(rowDeleted)}
        draggable={false}
      />
    </div>
  );
};

export default DelegateInformation;
