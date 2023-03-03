import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { DynamicTable } from "../../../components/TableComponents/Dynamic/DynamicTable";
import { TreeSelectNewRequest } from "../../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { useHistory } from "react-router-dom";
import "../SettingScreen.css";
import LogoLoading from "../../../assets/LoadingWOLFmini.gif";
import { FooterComponents } from "../../../components/FooterComponents/FooterComponents";
import { ButtonComponents } from "../../../components/ButtonComponents/ButtonComponents";
import { SplitButton } from "primereact/splitbutton";
import DelegateListScreen from "../../DelegateListScreen/DelegateListScreen";
import DelegateScreen from "../../DelegateScreen/DelegateScreen";
import { Toast } from "primereact/toast";
import SimLineApproveScreen from "../SimLineApproveScreen/SimLineApproveScreen";
import withPerMission from "../../../components/HOC/withPermission";
import useAlert from "../../../hooks/useAlert";
interface Props {}

const MasterDataScreen: React.FC<Props> = () => {
  const [apiName, setApiName] = useState<any>();
  const query = new URLSearchParams(useLocation().search);
  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [imgLoading, setImgLoading] = useState<any>(LogoLoading);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [_baseUrl, setbaseUrl] = useState<string>();
  const history = useHistory();
  const [displayFormDialog, setDisplayFormDialog] = useState<any>(false);
  const toast = useRef<any>(null);
  const { toggleAlert } = useAlert();
  let location = useLocation<any>();

  useEffect(() => {
    if (location.state?.responeAddTemplate != undefined) {
      if (location.state?.responeAddTemplate) {
        if (location.state?.typeTemplate === "add") {
          toggleAlert({
            description: `Create Template Success.`,
            message: `Success`,
            type: "success",
          });
          // toast.current.show({
          //   severity: "success",
          //   summary: "Success Message",
          //   detail: "Create Template Success",
          //   life: 7000,
          // });
        } else if (location.state?.typeTemplate === "delete") {
          toggleAlert({
            description: `Delete Template Success.`,
            message: `Success`,
            type: "success",
          });
          // toast.current.show({
          //   severity: "success",
          //   summary: "Success Message",
          //   detail: "Delete Template Success",
          //   life: 7000,
          // });
        }
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
      }
      history.replace({ ...location, state: undefined });
    }
    if (process.env.NODE_ENV !== "development") {
      setbaseUrl(window.location.hostname);
    }
  }, []);

  useEffect(() => {
    if (query.get("name") !== null && query.get("name") !== undefined) {
      let eriei = query.get("name") || "";
      if (eriei === "AuthorizedMenu") {
        eriei = eriei.replace("AuthorizedMenu", "NavbarMenu");
      } else if (eriei === "Organization") {
        eriei = eriei.replace("Organization", "Department");
      }
      setApiName(eriei);
    }
  }, [query]);

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <SplitButton
          className="p-button-secondary"
          model={[
            {
              label: "Edit",
              icon: "pi pi-pencil",
              command: () => {
                history.push(
                  "/TemplateDetail?TemplateId=" + rowData.TemplateId
                );
              },
            },
          ]}
          dropdownIcon="pi pi-ellipsis-v"
        />
      </React.Fragment>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      {apiName !== "DelegateList" &&
      apiName !== "SimLineApprove" &&
      apiName !== "Delegate" ? (
        <>
          {onLoading && (
            <div className="logo-loading cursor-loading">
              <img src={imgLoading} alt="loading..." />
            </div>
          )}
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
                  {!onLoading && (
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
                        : apiName === "NavbarMenu"
                        ? "Authorized Menu" + "(" + itemsCount + ")"
                        : apiName === "TemplateList"
                        ? "Template List" + "(" + itemsCount + ")"
                        : apiName + "(" + itemsCount + ")"}
                    </p>
                  )}
                  {_baseUrl !== "lite.wolfapprove.com" && (
                    <>
                      {" "}
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
                                : apiName === "NavbarMenu"
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
                            setDisplayFormDialog(!displayFormDialog);
                          }
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
              <div>
                <DynamicTable
                  apiName={apiName + "/GetAll"}
                  tableName={
                    apiName === "ApprovalMatrix"
                      ? "Approval Matrix"
                      : apiName === "MasterData"
                      ? "Master Data"
                      : apiName === "PositionLevel"
                      ? "Position Level"
                      : apiName === "MasterCompany"
                      ? "Master Company"
                      : apiName === "TemplateList"
                      ? "Template List"
                      : apiName
                  }
                  canAction={_baseUrl !== "lite.wolfapprove.com"}
                  onLoading={onLoading}
                  actionBody={
                    apiName === "TemplateList" ? actionBodyTemplate : undefined
                  }
                  rowHover={true}
                  displayFormDialog={displayFormDialog}
                  setDisplayFormDialog={setDisplayFormDialog}
                  setOnLoading={setOnLoading}
                  setItemsCount={setItemsCount}
                  canExport={
                    apiName !== "ApprovalMatrix"
                      ? apiName !== "MasterData"
                        ? apiName !== "Roles"
                          ? apiName !== "Employee"
                            ? apiName !== "Department"
                              ? apiName !== "MasterCompany"
                                ? apiName !== "TemplateList"
                                  ? apiName !== "NavbarMenu"
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
        </>
      ) : (
        <>
          {apiName === "DelegateList" && <DelegateListScreen />}
          {apiName === "Delegate" && <DelegateScreen />}
          {apiName === "SimLineApprove" && <SimLineApproveScreen />}
        </>
      )}
    </div>
  );
};
export default withPerMission(MasterDataScreen);
