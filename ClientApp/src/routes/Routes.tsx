import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Cookies from "universal-cookie";
import { useLocation, useHistory } from "react-router-dom";
import { useSessionContext } from "../Context/AuthContext";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen";
import { LoginScreenAzure } from "../screens/LoginScreen/LoginScreenAzure";
import { DynamicReport } from "../screens/Report/DynamicReport";
import ReportScreen from "../screens/Report/ReportScreen";
import WorkListScreen from "../screens/WorkList/WorkListScreen";
import PrivateRoute, { ProtectedRouteProps } from "./PrivateRoute";
import { ErrorPageComponent } from "../components/ErrorPageComponent/ErrorPageComponent";
import {
  CheckAppSetting,
  CheckCanDownloadPdf,
  CheckCanEditProfile,
} from "../Services/AppSettingService";
import TemplateDetailScreen from "../screens/TemplateDetailScreen/TemplateDetailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen/ForgotPasswordScreen";
import DelegateScreen from "../screens/DelegateScreen/DelegateScreen";
import EmailTemplateDetailScreen from "../screens/SettingsSpecScreen/EmailTemplateDetailScreen";
import SimLineApproveScreen from "../screens/SettingScreen/SimLineApproveScreen/SimLineApproveScreen";
import DashboardScreen from "../screens/DashboardScreen/DashboardScreen";
import { LogApi } from "../screens/LogApi/LogApi";
import EmailTemplateListScreen from "../screens/SettingsSpecScreen/EmailTemplateListScreen/EmailTemplateListScreen";
import { PreviewTemplateScreen } from "../screens/TemplateDetailScreen/PreviewTemplateScreen";
import { LoginGoogle } from "../screens/LoginScreen/LoginGoogle";
import UnAurthorization from "../screens/UnAuthorizePage/UnAurthorization";
import { useMsal } from "@azure/msal-react";

import RegisterWolfScreen from "../screens/RegisterWolfScreen/RegisterWolfScreen";
import "./switchRoute.css";
import RequestScreenFix from "../screens/Request/RequestScreenFix";
import MasterDatascreenFixed from "../screens/SettingScreen/MasterDataScreen/MasterDatascreenFixed";
import MasterDataScreen from "../screens/SettingScreen/MasterDataScreen/MasterDataScreen";
import ReportScreenFix from "../screens/Report/ReportScreenFix";
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from "react-transition-group";
import { NavigationBar } from "../components/NavigationBar/NavigationBar";
import TimeStampScreen from "../screens/TimeStamp/TimeStampScreen";
import PreviewAttachmentScreen from "../screens/PreviewAttachmentScreen/PreviewAttachmentScreen";
import RequestActionMemo from "../screens/RequestActionMemo/RequestActionMemo";
import { LoginConfiguration } from "../Services/ConfigurationService";

interface Props {
  responeConfig: any;
  isLoadPackage: boolean;
  setIsLoadPackage: any;
}

const Routes = (props: Props) => {
  const [responeConfig, setResponeConfig] = useState<any>();
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [initialPath, setInitialPath] = useState<string>("");
  const [Nav, setNav] = useState<any>([]);
  const [loginScreen, setLoginScreen] = useState<any>();
  const cookies = new Cookies();
  const history = useHistory();
  const [sessionContext, updateSessionContext] = useSessionContext();
  const { instance, inProgress, accounts } = useMsal();
  const location = useLocation();

  useEffect(() => {
    const guidVerify = cookies.get("GuidVerify");
    const userData = window.localStorage.getItem("userData");
    fetchApp().then(async (data) => {
      // const baseurl = window.location.origin.toString();
      if (!guidVerify || !data || userData == null) {
        cookies.remove("GuidVerify");

        updateSessionContext({ ...sessionContext, isAuthenticated: false });
      }
    });
  }, [location]);
  const setRedirectPath = (path: string) => {
    updateSessionContext({ ...sessionContext, redirectPath: path });
  };
  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: !!sessionContext.isAuthenticated,
    authenticationPath: "/login",
    redirectPath: sessionContext.redirectPath,
    setRedirectPath: setRedirectPath,
  };
  const fetchApp = async () => {
    const responseConfig = await LoginConfiguration();
    const response = await CheckAppSetting();
    const canEditProfile = await CheckCanEditProfile();
    const canDownLoadPdf = await CheckCanDownloadPdf();
    setResponeConfig(responseConfig);
    if (props.responeConfig?.type === "LoginAzure") {
      window.localStorage.setItem("isWolf", "false");

      setLoginScreen(<LoginScreenAzure />);
    } else if (props.responeConfig?.type === "LoginWolf") {
      window.localStorage.setItem("isWolf", "true");

      setLoginScreen(
        <LoginScreen
          {...{ setIsLoadPackage: props.setIsLoadPackage }}
          PathLogo={props.responeConfig.pathLogoLogin}
          IsMulti={props.responeConfig.isMulti}
          PathCarousel={props.responeConfig.pathCarousel}
        />
      );
    } else if (props.responeConfig?.type === "LoginGoogle") {
      window.localStorage.setItem("isWolf", "false");

      setLoginScreen(<LoginGoogle />);
    }

    window.localStorage.setItem(
      "canEditProfile",
      JSON.stringify(canEditProfile)
    );
    window.localStorage.setItem(
      "canDownLoadPdf",
      JSON.stringify(canDownLoadPdf)
    );
    return response;
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        addEndListener={(node, done) => {
          node.addEventListener("transitionend", done, false);
        }}
      >
        <Switch location={location}>
          <Route path="/login">{loginScreen}</Route>
          <Route path="/LoginAzure">
            <LoginScreenAzure />
          </Route>
          <Route path="/Verify">
            <ForgotPasswordScreen
              PathLogo={props.responeConfig.pathLogoLogin}
            />
          </Route>
          <Route path={"/RegisterWolfScreen"}>
            <RegisterWolfScreen
              PathLogo={props.responeConfig.pathLogoLogin}
              responeConfig={responeConfig}
            />
          </Route>
          <PrivateRoute
            {...defaultProtectedRouteProps}
            path="/RequestActionMemo"
          >
            <RequestActionMemo PathLogo={props.responeConfig.pathLogoLogin} />
          </PrivateRoute>
          <PrivateRoute
            {...defaultProtectedRouteProps}
            path="/previewAttachment"
          >
            <PreviewAttachmentScreen />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/request">
            <RequestScreenFix />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/TimeStamp">
            <TimeStampScreen />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/Default">
            <WorkListScreen responeConfig={responeConfig} />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/DynamicReport">
            <ReportScreenFix />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/TemplateDetail">
            <TemplateDetailScreen responeConfig={responeConfig} />
          </PrivateRoute>
          <PrivateRoute
            {...defaultProtectedRouteProps}
            path="/EmailTemplateList"
          >
            <EmailTemplateListScreen />
          </PrivateRoute>
          <PrivateRoute
            {...defaultProtectedRouteProps}
            path="/EmailTemplateDetail"
          >
            <EmailTemplateDetailScreen />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/request/copy">
            <ReportScreen responeConfig={responeConfig} />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="/PreviewTemplate">
            <PreviewTemplateScreen />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path={"/Delegate"}>
            <DelegateScreen responeConfig={responeConfig} />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path={"/Settings"}>
            <MasterDatascreenFixed />
          </PrivateRoute>
          <PrivateRoute
            {...defaultProtectedRouteProps}
            path={"/SimLineApprove"}
          >
            <SimLineApproveScreen responeConfig={responeConfig} />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path={"/Dashboard"}>
            <DashboardScreen responeConfig={responeConfig} />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path={"/UnAuthorize"}>
            <UnAurthorization />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path={"/Logapi"}>
            <LogApi />
          </PrivateRoute>
          <PrivateRoute {...defaultProtectedRouteProps} path="*">
            <ErrorPageComponent />
          </PrivateRoute>
          <Route component={DynamicReport} />
        </Switch>
      </CSSTransition>
    </SwitchTransition>
  );
};
export default Routes;
