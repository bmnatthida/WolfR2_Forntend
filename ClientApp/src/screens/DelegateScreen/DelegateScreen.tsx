import { Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import DelegateApplyTo from "./DelegateApplyTo";
import DelegateInformation from "./DelegateInformation";
import "./DelegateScreen.css";
import { useLocation, useHistory } from "react-router-dom";
import { DelegateSideBar } from "./DelegateSideBar";
import { BiSend } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import useLoading from "../../hooks/useLoading";
import useAlert from "../../hooks/useAlert";

type Props = {
  responeConfig: any;
};
interface DelegateList {
  ApproverId: number;
  CreatedBy: string;
  CreatedDate: string;
  DateFrom: string;
  DateTo: string;
  DelegateId: number;
  DelegateToId: number;
  FilterCreateDateFrom: string;
  FilterCreateDateTo: string;
  IsActive: string;
  ModifiedBy: string;
  ModifiedDate: string;
  Remark: string;
  SecretId: string;
  connectionString: string;
  dt_ExportLog: string;
  userPrincipalName: string;
}
const DelegateScreen = (props: Props) => {
  const { toggleAlert } = useAlert();
  const [selectView, setSelectView] = useState<any>("1");
  const [sidebarState, setSidebarState] = useState(true);
  const [attachmentData, setAttachmentData] = useState<any[]>([]);
  const [delegateData, setDelegateData] = useState<any>({
    DelegateDetail: [],
    DelegateList: {},
    AttachmentList: [],
  });
  const [errorState, setErrorState] = useState<any>([]);
  const [usePeriod, setUsePeriod] = useState(false);
  const [delegateId, setDelegateId] = useState<number>(0);
  const { isLoad, setLoad } = useLoading();
  const query = new URLSearchParams(useLocation().search);
  const userData = JSON.parse(localStorage.getItem("userData") || "");
  const empData = userData.employeeData;
  const history = useHistory();
  const toast = useRef<any>(null);

  useEffect(() => {
    if (query.get("delegateId") !== undefined) {
      // console.log("ddddddasd");
      setDelegateId(Number(query.get("delegateId")));
      // fetchDelegate(query.get("delegateId"));
    }
  }, [query]);
  useEffect(() => {
    if (delegateId !== 0) {
      fetchDelegate(delegateId);
      fetchAttachment(delegateId);
    }
    setLoad(false);
  }, [delegateId]);
  const fetchAttachment = async (delegateId: any) => {
    const dataJson = {
      DelegateId: delegateId,
    };
    const dd = await fetch("api/DelegateList/GetByDelegateAttachByDelegateId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJson),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setDelegateData((prevState: any) => ({
          ...prevState,
          AttachmentList: [...data],
        }));
        // setAttachmentData([...data]);
      });
  };
  const fetchDelegate = async (delegateId: any) => {
    const dataJson = {
      DelegateId: delegateId,
    };
    const dd = await fetch("api/DelegateList/GetByDelegateId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJson),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("delegate", data);
        setLoad(false);
        if (
          data.DelegateList.DateFrom &&
          data.DelegateList.DateTo &&
          data.DelegateList.DateTo.length > 0 &&
          data.DelegateList.DateFrom.length > 0
        ) {
          setUsePeriod(true);
        }
        setDelegateData((prevState: any) => ({
          ...prevState,
          DelegateDetail: data.DelegateDetail,
          DelegateList: data.DelegateList,
        }));
      });
  };
  const onSelectView = (e: any) => {
    setSelectView(e);
  };
  const toggleSideBar = () => {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setSidebarState(true);
    }
  };
  const onSubmit = async () => {
    let _delegateData: any = delegateData;
    let validation: any = [];
    // setOnLoading(true);
    // _delegateData.DelegateList["CreatedBy"] = empData.EmployeeId.toString();
    // _delegateData.DelegateList.DateFrom = usePeriod
    //   ? `${_delegateData.DelegateList.DateFrom} 00:00:00`
    //   : null;
    // _delegateData.DelegateList.DateTo = usePeriod
    //   ? `${_delegateData.DelegateList.DateTo} 00:00:00`
    //   : null;
    // console.log("_delegateData", _delegateData);
    const _attachList = _delegateData.AttachmentList.map(
      (data: any, idx: any) => {
        let _data: any = {};
        _data["sequence"] = idx;
        _data["attach_path"] = data.FilePath;
        _data["attach_file"] = data.AttachFile;
        _data["attach_date"] = data.AttachedDate;
        _data["description"] = data.FileName;
        _data["actor"] = data.ActorId;
        return _data;
        // _data.AttachFile = ""
        // _data.AttachedDate = ""
        // _data.FileName=""
      }
    );
    if (delegateData.DelegateList.DelegateToId === undefined) {
      validation.push({ label: "Delegate to" });
    }
    if (delegateData.DelegateList.ApproverId === undefined) {
      validation.push({ label: "Aprrover" });
    }
    if (delegateData.DelegateList.Remark === undefined) {
      validation.push({ label: "Remark" });
    } else {
      if (delegateData.DelegateList.Remark.length === 0) {
        validation.push({ label: "Remark" });
      }
    }
    if (delegateData.DelegateDetail.length === 0) {
      validation.push({ label: "Apply To" });
    }

    if (usePeriod) {
      if (
        delegateData.DelegateList.DateFrom === undefined &&
        delegateData.DelegateList.DateTo === undefined &&
        delegateData.DelegateList.DateTo === null &&
        delegateData.DelegateList.DateFrom === null &&
        delegateData.DelegateList.DateFrom === "" &&
        delegateData.DelegateList.DateTo === ""
      ) {
        validation.push({ label: "DateFrom" });
        validation.push({ label: "DateTo" });
      } else if (!delegateData.DelegateList.DateFrom) {
        validation.push({ label: "DateFrom" });
      } else if (!delegateData.DelegateList.DateTo) {
        validation.push({ label: "DateTo" });
      } else {
        _delegateData.DelegateList["CreatedBy"] = empData.EmployeeId.toString();
        _delegateData.DelegateList.DateFrom = usePeriod
          ? `${_delegateData.DelegateList.DateFrom} 00:00:00`
          : null;
        _delegateData.DelegateList.DateTo = usePeriod
          ? `${_delegateData.DelegateList.DateTo} 00:00:00`
          : null;
      }
    }

    if (validation.length > 0) {
      let text = "";
      for (let i = 0; i < validation.length; i++) {
        const valid = validation[i];
        if (i < validation.length - 1) {
          text = text + valid.label + ",";
        } else {
          text = text + valid.label;
        }
      }
      setErrorState([...validation]);
      toggleAlert({
        description: `${text} is require.`,
        message: `Require field warning`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: `${text}`,
      //   life: 7000,
      // });
    } else {
      setLoad(true);
      _delegateData.AttachmentList = _attachList;
      const dd = await fetch("api/DelegateList/CreateDelegate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_delegateData),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoad(false);
          toggleAlert({
            description: `Submit success.`,
            message: `Success`,
            type: "success",
          });
          // toast.current.show({
          //   severity: "success",
          //   summary: "Success",
          //   detail: `Submit complete!`,
          //   life: 7000,
          // });
          history.push("/Settings?name=DelegateList");
        });
    }
  };
  const onDelete = async () => {
    const _delegateData = delegateData;
    setLoad(true);
    const jsonData = {
      DelegateId: _delegateData.DelegateList.DelegateId,
      ModifiedBy: empData.EmployeeId.toString(),
    };

    const dd = await fetch("api/DelegateList/DeleteDelegate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoad(false);
        history.push("/Settings?name=DelegateList");
      });
  };
  const onUpdate = async () => {
    const _delegateData = delegateData;
    console.log("_delegateData_delegateData", _delegateData);
    const _attachList = _delegateData.AttachmentList.map(
      (data: any, idx: any) => {
        let _data: any = {};
        _data["sequence"] = idx;
        _data["attach_path"] = data.FilePath;
        _data["attach_file"] = data.AttachFile;
        _data["attach_date"] = data.AttachedDate;
        _data["description"] = data.FileName;
        _data["actor"] = data.ActorId;
        return _data;
        // _data.AttachFile = ""
        // _data.AttachedDate = ""
        // _data.FileName=""
      }
    );
    let validation: any = [];
    if (delegateData.DelegateList.ApproverId === undefined) {
      validation.push({ label: "Aprrover" });
    }
    if (delegateData.DelegateList.DelegateToId === undefined) {
      validation.push({ label: "Delegate to" });
    }
    if (delegateData.DelegateList.Remark === undefined) {
      validation.push({ label: "Remark" });
    } else {
      if (delegateData.DelegateList.Remark.length === 0) {
        validation.push({ label: "Remark" });
      }
    }
    if (delegateData.DelegateDetail.length === 0) {
      validation.push({ label: "Apply To" });
    }
    console.log("usePeriod", usePeriod);

    if (usePeriod) {
      if (
        delegateData.DelegateList.DateFrom === undefined ||
        delegateData.DelegateList.DateTo === undefined ||
        delegateData.DelegateList.DateTo === null ||
        delegateData.DelegateList.DateFrom === null ||
        delegateData.DelegateList.DateFrom === "" ||
        delegateData.DelegateList.DateTo === ""
      ) {
        validation.push({ label: "DateFrom" });
        validation.push({ label: "DateTo" });
      } else if (
        delegateData.DelegateList.DateFrom === undefined ||
        delegateData.DelegateList.DateFrom === null ||
        delegateData.DelegateList.DateFrom === ""
      ) {
        validation.push({ label: "DateFrom" });
      } else if (
        delegateData.DelegateList.DateTo === undefined ||
        delegateData.DelegateList.DateTo === null ||
        delegateData.DelegateList.DateTo === ""
      ) {
        validation.push({ label: "DateTo" });
      } else {
        _delegateData.DelegateList["CreatedBy"] = empData.EmployeeId.toString();
        _delegateData.DelegateList.DateFrom = usePeriod
          ? `${_delegateData.DelegateList.DateFrom} 00:00:00`
          : null;
        _delegateData.DelegateList.DateTo = usePeriod
          ? `${_delegateData.DelegateList.DateTo} 00:00:00`
          : null;
      }
    }
    console.log("_delegateData", _delegateData);

    if (validation.length > 0) {
      let text = "";
      for (let i = 0; i < validation.length; i++) {
        const valid = validation[i];
        if (i < validation.length - 1) {
          text = text + valid.label + ",";
        } else {
          text = text + valid.label;
        }
      }
      setErrorState([...validation]);
      toggleAlert({
        description: `${text} is require.`,
        message: `Require field warning`,
        type: "warning",
      });
      // toast.current.show({
      //   severity: "error",
      //   summary: "Error Message",
      //   detail: `${text}`,
      //   life: 7000,
      // });
    } else {
      setLoad(true);

      _delegateData.DelegateList["CreatedBy"] = empData.EmployeeId.toString();
      _delegateData.DelegateList.DateFrom = usePeriod
        ? `${_delegateData.DelegateList.DateFrom}`
        : null;
      _delegateData.DelegateList.DateTo = usePeriod
        ? `${_delegateData.DelegateList.DateTo}`
        : null;
      const jsonData = {
        DelegateId: _delegateData.DelegateList.DelegateId,
        ModifiedBy: empData.EmployeeId.toString(),
        DelegateList: _delegateData.DelegateList,
        DelegateDetail: _delegateData.DelegateDetail,

        AttachmentList: _attachList,
      };

      const dd = await fetch("api/DelegateList/UpdateDelegate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoad(false);
          // console.log(data);
          history.push("/Settings?name=DelegateList");
        });
    }
  };
  return (
    <div
      className="main-container delegater-screen"
      onClick={() => console.log(delegateData)}
    >
      <Toast ref={toast} />
      {isLoad && (
        <div className="logo-loading">
          <img src={props.responeConfig?.pathLoading} alt="loading..." />
        </div>
      )}
      <div className="worklist-container">
        <div className="header-container">
          <div className="button-container">
            <Button
              type="text"
              icon={<IoMenu size={28} />}
              size="large"
              onClick={() => toggleSideBar()}
              style={{ background: "transparent " }}
            />
            <TreeSelectNewRequest />
          </div>
          <div className="route-text-container">
            <p className="route-text">Delegation of Authority</p>
            <div className="button-delegate-container">
              {delegateId === 0 && (
                <button className="button-submit" onClick={() => onSubmit()}>
                  <BiSend /> Submit
                </button>
              )}
              {delegateId !== 0 && (
                <button className="button-update" onClick={() => onUpdate()}>
                  <FiSave />
                  Update
                </button>
              )}

              {delegateId !== 0 && (
                <button
                  className="button-delete"
                  onClick={() =>
                    confirmDialog({
                      message: "Do you want to delete this delegation ?",
                      header: "Delete",
                      icon: "p-confirm-dialog-icon pi pi-info-circle",
                      // rejectClassName:
                      //   "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
                      // acceptClassName:
                      //   "p-button p-component p-confirm-dialog-accept table-accept p-button-danger table-control-confirm-button p-button-accept-cancel",
                      accept: async () => {
                        const res = await onDelete();
                      },
                    })
                  }
                >
                  <MdDeleteOutline /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="worklist-items-container">
            {sidebarState && (
              <div className="desktop">
                <div className="content filter-content">
                  <div className="worklist-filter-container">
                    <DelegateSideBar
                      onSelectView={onSelectView}
                      curPage={selectView}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="request-container-item">
              {selectView === "1" && (
                <DelegateInformation
                  errorState={errorState}
                  delegateData={delegateData}
                  setDelegateData={setDelegateData}
                  attachmentData={attachmentData}
                  setAttachmentData={setAttachmentData}
                  usePeriod={usePeriod}
                  setUsePeriod={setUsePeriod}
                />
              )}
              {selectView === "2" && (
                <DelegateApplyTo
                  delegateData={delegateData}
                  setDelegateData={setDelegateData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegateScreen;
