import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import withPerMission from "../../../components/HOC/withPermission";
import DynamicTable from "../../../components/TableComponents/DynamicTableFix/DynamicTable";
import useLoading from "../../../hooks/useLoading";
import { GetAllDynamic } from "../../../Services/DynamicService";
import { ButtonComponents } from "../../../components/ButtonComponents/ButtonComponents";
import { TreeSelectNewRequest } from "../../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { Toast } from "primereact/toast";
import { SplitButton } from "primereact/splitbutton";
import { DialogListFix } from "../../../components/TableComponents/DynamicTableFix/DialogListFix";
import { useUserContext } from "../../../Context/UserContext";
import { GetAllApprovalMatrixItem } from "../../../Services/ApprovalMatrixService";
import { matrixItemToString } from "../../../Helper/matrixItemToString";
import DelegateListScreen from "../../DelegateListScreen/DelegateListScreen";
import DelegateScreen from "../../DelegateScreen/DelegateScreen";
import SimLineApproveScreen from "../SimLineApproveScreen/SimLineApproveScreen";
import { CheckRolePermission } from "../../../Services/AuthorizedService";
import { getVersionTempVC } from "../../../Services/MasterDataService";

const MasterDatascreenFixed = () => {
  const query = new URLSearchParams(useLocation().search);
  const [apiName, setApiName] = useState<any>();
  const { isLoad, setLoad } = useLoading();
  const [dynamicData, setDynamicData] = useState<any[]>();
  const [emp_data, setEmp_data] = useState<any>();
  const [subData, setSubData] = useState<any>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [_baseUrl, setbaseUrl] = useState<string>();
  const history = useHistory();
  const toast = useRef<any>(null);
  const [dataEdit, setDataEdit] = useState<any>({});
  const [displayFormDialog, setDisplayFormDialog] = useState<any>(false);
  const [userData] = useUserContext();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const _userData = JSON.parse(window.localStorage.getItem("userData") || "");

  useEffect(() => {
    setLoad(false);
    if (process.env.NODE_ENV !== "development") {
      setbaseUrl(window.location.hostname);
    }
  }, []);

  useEffect(() => {
    getQuery();
  }, [query]);

  const getQuery = () => {
    let eriei = "";

    if (query.get("name") !== null && query.get("name") !== undefined) {
      eriei = query.get("name") || "";
      if (eriei === "AuthorizedMenu") {
        eriei = eriei.replace("AuthorizedMenu", "Authorized");
      } else if (eriei === "Organization") {
        eriei = eriei.replace("Organization", "Department");
      } else if (eriei === "wolfaccount") {
        eriei = "Account";
      }
      if (eriei.indexOf("?") !== -1) {
        eriei = eriei.substring(0, eriei.indexOf("?"));
      }

      setApiName(eriei);
    }
    return eriei;
  };

  useEffect(() => {
    if (apiName) {
      console.log("table=>apiName", apiName);
      setLoad(true);
      fecthData(apiName);
    }
  }, [apiName]);

  // useEffect(() => {
  //   if (dynamicData) {
  //     setLoad(false);
  //   }
  // }, [dynamicData]);

  // useEffect(() => {
  //   if (displayFormDialog) {
  //     fecthData(apiName);
  //   }
  // }, [displayFormDialog]);

  const toggleMainDialog = (state: boolean, action: string) => {
    if (!state) {
      setDisplayFormDialog(state);
      if (action === "save") {
        setLoad(true);
        fecthData(apiName);
      }
    }
  };

  const fecthData = async (apiPath: string) => {
    try {
      let _dataDynamic: any;
      let _emp_data: any = emp_data;
      let _emp_dataFind: any = undefined;
      let _apiPath: string = apiPath ? apiPath : getQuery();
      if (!_emp_data) {
        _emp_data = await GetAllDynamic("Employee" + "/GetAll", undefined);
        setEmp_data(_emp_data);
      }
      const _isAdmin = await CheckRolePermission(
        _emp_dataFind ? _emp_dataFind?.EmployeeId : userData.EmployeeId
      );

      if (
        query.get("usrid") !== null &&
        query.get("usrid") !== undefined &&
        _isAdmin
      ) {
        _emp_dataFind = _emp_data.find(
          (item: any) => item.EmployeeId === Number(query.get("usrid"))
        );
      }

      let dataJsonn: any | undefined;
      if (apiName === "TemplateList") {
        let _usrid: number | undefined = undefined;
        dataJsonn = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CreatedBy: _emp_dataFind
              ? _emp_dataFind?.EmployeeId?.toString()
              : userData.EmployeeId.toString(),
            DepartmentId: _emp_dataFind
              ? _emp_dataFind?.DepartmentId
              : userData.DepartmentId,
            Username: _emp_dataFind
              ? _emp_dataFind?.Username
              : userData.Username,
            Email: _emp_dataFind ? _emp_dataFind?.Email : userData.Email,
          }),
        };
      } else if (apiName === "Account") {
        dataJsonn = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TinyURL: _userData.TinyURL,
          }),
        };
      }

      _dataDynamic = await GetAllDynamic(_apiPath + "/GetAll", dataJsonn);
      console.log("table=>_dataDynamic", _dataDynamic);

      let _dataVersionTempVC = await getVersionTempVC();

      for (let i = 0; i < _dataDynamic.length; i++) {
        const element = _dataDynamic[i];
        for (let j = 0; j < _dataVersionTempVC.length; j++) {
          const _element = _dataVersionTempVC[j];
          if (_element.value1 === element.DocumentCode) {
            _dataDynamic[i].isEditing =
              _element.value3 === "Editing" ? "true" : "false";
            _dataDynamic[i].isPublishVersion =
              _element.value3 === "Publish" ? "true" : "false";
          }
        }
      }

      if (apiPath === "ApprovalMatrix") {
        await fecthApprovalMatrixItem(_dataDynamic);
      }

      if (_dataDynamic) {
        if (_emp_data) {
          _dataDynamic.map((e: any) => {
            let emp = _emp_data?.find(
              (_emp: any) => _emp.EmployeeId.toString() === e.CreatedBy
            );
            if (emp) {
              e.CreatedBy = userData.Lang === "TH" ? emp?.NameTh : emp?.NameEn;
            } else {
              e.CreatedBy = "";
            }
          });
          _dataDynamic.map((e: any) => {
            let emp = _emp_data?.find(
              (_emp: any) => _emp.EmployeeId.toString() === e.ModifiedBy
            );
            if (emp) {
              e.ModifiedBy = userData.Lang === "TH" ? emp?.NameTh : emp?.NameEn;
            } else {
              e.ModifiedBy = "";
            }
          });
        }

        setIsAdmin(_isAdmin);

        setDynamicData([..._dataDynamic]);
        setLoad(false);
      }
    } catch (error) {
      console.log("table=>error", error);
      setLoad(false);
    }
  };

  const fecthApprovalMatrixItem = async (data: any[]) => {
    let matrixItems = await GetAllApprovalMatrixItem();
    if (matrixItems) {
      matrixItemToString(data, matrixItems);
      setSubData([...matrixItems]);
    }
  };

  const getTableName = () => {
    if (apiName === "ApprovalMatrix") {
      return "Approval Matrix";
    } else if (apiName === "MasterData") {
      return "Master Data";
    } else if (apiName === "PositionLevel") {
      return "Position Level";
    } else if (apiName === "MasterCompany") {
      return "Master Company";
    } else if (apiName.substring(0, apiName.indexOf("?")) === "TemplateList") {
      return "Template List";
    } else {
      return apiName;
    }
  };

  const actionBodyTemplate = (record: any) => {
    
    return (
      <React.Fragment>
        <SplitButton
        // index id
          id="DotMorebtn"
          className="p-button-secondary"
          model={[
            {
              label: "Edit",
              icon: "pi pi-pencil",
              command: () => {
                if (apiName === "TemplateList") {
                  history.push(
                    "/TemplateDetail?TemplateId=" + record.TemplateId
                  );
                } else {
                  setDataEdit(record);
                  setDisplayFormDialog(true);
                }
              },
            },
          ]}
          dropdownIcon="pi pi-ellipsis-v"
        />
      </React.Fragment>
    );
  };

  if (
    apiName !== "DelegateList" &&
    apiName !== "SimLineApprove" &&
    apiName !== "Delegate"
  ) {
    if (isLoad) {
      return <></>;
    } else {
      return (
        <div className="main-container">
          <div className="worklist-container" style={{ height: "100%" }}>
            <Toast ref={toast} baseZIndex={999999} />
            <div className="header-container">
              <div className="button-container">
                <TreeSelectNewRequest setDataTemplateTreeProps={null}  />
              </div>
              <div
                className="route-text-container"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {!isLoad && (
                  <p className="route-text">
                    {apiName === "ApprovalMatrix"
                      ? "Approval Matrix" + "(" + itemsCount + ")"
                      : apiName === "MasterData"
                      ? "Master Data" + "(" + itemsCount + ")"
                      : apiName === "PositionLevel"
                      ? "Position Level" + "(" + itemsCount + ")"
                      : apiName === "MasterCompany"
                      ? "Master Company" + "(" + itemsCount + ")"
                      : apiName === "MasterCompany"
                      ? "Authorized Menu" + "(" + itemsCount + ")"
                      : apiName === "Authorized"
                      ? "Authorized Menu" + "(" + itemsCount + ")"
                      : apiName === "TemplateList"
                      ? "Template List" + "(" + itemsCount + ")"
                      : apiName + "(" + itemsCount + ")"}
                  </p>
                )}
                {_baseUrl !== "lite.wolfapprove.com" && (
                  <>
                    <ButtonComponents
                      setLabelProps={
                        apiName === "TemplateList"
                          ? "Create Form"
                          : "Create " +
                            (apiName === "ApprovalMatrix"
                              ? "Approval Matrix"
                              : apiName === "MasterData"
                              ? "Master Data"
                              : apiName === "PositionLevel"
                              ? "Position Level"
                              : apiName === "MasterCompany"
                              ? "Master Company"
                              : apiName === "Authorized"
                              ? "Authorized Menu"
                              : apiName)
                      }
                      setStyleProps={{
                        height: "38px",
                        backgroundColor: "#282F6A",
                        color: "#FFFFFF",
                        border: "1px solid rgb(40, 47, 106)",
                      }}
                      onClickProps={() => {
                        if (apiName === "TemplateList") {
                          history.push("/TemplateDetail");
                        } else {
                          setDataEdit({});
                          setDisplayFormDialog(!displayFormDialog);
                        }
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            {dynamicData && (
              <>
                <DynamicTable
                  tableName={apiName}
                  dataSource={dynamicData}
                  canEdit={isAdmin || apiName === "TemplateList"}
                  setItemsCount={setItemsCount}
                  actionBodyTemplate={actionBodyTemplate}
                  reloadData={fecthData}
                  setLoad={setLoad}
                  toast={toast}
                  canExport={
                    apiName !== "ApprovalMatrix"
                      ? apiName !== "MasterData"
                        ? apiName !== "Roles"
                          ? apiName !== "Employee"
                            ? apiName !== "Department"
                              ? apiName !== "MasterCompany"
                                ? apiName !== "TemplateList"
                                  ? apiName !== "Authorized"
                                    ? true
                                    : false
                                  : false
                                : false
                              : false
                            : false
                          : false
                        : false
                      : false
                  }
                />
                {displayFormDialog && (
                  <DialogListFix
                    toast={toast}
                    tableName={getTableName()}
                    formData={dataEdit}
                    mainDialogVisible={displayFormDialog}
                    toggleMainDialog={toggleMainDialog}
                    tableData={dynamicData}
                    setTableData={setDynamicData}
                    subTableData={subData}
                    setSubTableData={setSubData}
                    apiName={apiName}
                  />
                )}
              </>
            )}
          </div>
        </div>
      );
    }
  } else {
    return (
      <>
        {apiName === "DelegateList" && <DelegateListScreen />}
        {apiName === "Delegate" && <DelegateScreen />}
        {apiName === "SimLineApprove" && <SimLineApproveScreen />}
      </>
    );
  }
};

export default withPerMission(MasterDatascreenFixed);
