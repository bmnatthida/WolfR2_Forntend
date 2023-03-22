import React, { useEffect, useState, useRef } from "react";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  useRouteMatch,
  useLocation,
  useHistory,
} from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";

import Routes from "./routes/Routes";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import "./index.css";
import "./App.css";
import {
  SessionContextProvider,
  useSessionContext,
} from "./Context/AuthContext";
import { Provider } from "react-redux";
import { GoogleApiProvider } from "react-gapi";
import { FooterComponents } from "./components/FooterComponents/FooterComponents";
import { GApiProvider } from "react-gapi-auth2";
import {
  getAzureConfig,
  LoginConfiguration,
} from "./Services/ConfigurationService";
import { LogLevel } from "@azure/msal-browser";
import { useIdleTimer } from "react-idle-timer";
import { Col, Row } from "antd";
import Cookies from "universal-cookie";
import { UserContextProvider } from "./Context/UserContext";
import { LoadProvider } from "./Context/LoadContext";
import LoadComponent from "./components/LoadComponent/LoadComponent";
import withPerMission from "./components/HOC/withPermission";
import withProcessPackage from "./components/HOC/withProcessPackage";
import LoadPackageComponent from "./components/LoadComponent/LoadPackageComponent";
import { AlertContextProvider } from "./Context/AlertContext";
import { AdminEditCompletedMemoProvider } from "./Context/AdminEditCompletedMemoPermissionContext";
import { useTranslation } from "react-i18next";
interface AzureConfig {
  c: string;
  s: string;
  w: string;
}
interface Props {}
const App = (props: Props) => {
  const [responeConfig, setResponeConfig] = useState<any>();
  const [sessionState, setSessionState] = useSessionContext();
  const [auzreConfig, setAuzreConfig] = useState<AzureConfig>();
  const [isLoadPackage, setIsLoadPackage] = useState(false);
  const { url } = useRouteMatch();
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf("MSIE ");
  const msie11 = ua.indexOf("Trident/");
  const msedge = ua.indexOf("Edge/");
  const firefox = ua.indexOf("Firefox");
  const [timer, setTimer] = useState<any>("");
  const [isCountDown, setIsCountDown] = useState(false);
  const isIE = msie > 0 || msie11 > 0;
  const isEdge = msedge > 0;
  const isFirefox = firefox > 0;
  let intervalId: any = useRef(null);
  let timeout: any = useRef(null);
  const location = useLocation();
  const lang: any = localStorage.getItem("lang") ?? "EN";
  const history = useHistory();
  const { i18n } = useTranslation(["translation"]);
  const cookies = new Cookies();
  useEffect(() => {
    fetchCon();
  }, []);

  const baseUrl = window.location.origin.toString();
  const fetchCon = async () => {
    if (lang === "TH") {
      i18n.changeLanguage("th");
    } else {
      i18n.changeLanguage("en");
    }
    var responeConfig = await LoginConfiguration();
    const reponseAzureConfig = await getAzureConfig();
    setAuzreConfig(reponseAzureConfig);
    setResponeConfig(responeConfig);
  };

  const onIdle = () => {
    // Close Modal Prompt
    // Do some idle action like log out your user
    // alert("timeout1");
    // const millisec = getRemainingTime();
    // let delay = 10000;
    if (location.pathname !== "/" && location.pathname !== "/login") {
      setIsCountDown(true);
      localStorage.setItem("timer", "600000");
      localStorage.setItem("onIdle", "true");

      let countDown = Number(localStorage.getItem("timer"));
      intervalId.current = setInterval(() => {
        const _timer = Number(localStorage.getItem("timer"));
        const onIdle = localStorage.getItem("onIdle");

        if (countDown > 0 && onIdle === "true") {
          const time = msToTime(countDown);
          if (countDown < _timer) {
            localStorage.setItem("timer", _timer.toString());
            countDown = _timer;
          }
          if (countDown === _timer) {
            countDown -= 1000;
            localStorage.setItem("timer", countDown.toString());
          }
          if (countDown > _timer) {
            countDown -= 1000;
            localStorage.setItem("timer", countDown.toString());
          }
          setTimer(time);
        } else if (countDown <= 0) {
          setIsCountDown(false);
          window.location.reload();
          localStorage.setItem("onIdle", "false");
          setSessionState({ ...sessionState, isAuthenticated: false });
          cookies.remove("GuidVerify");
          clearInterval(intervalId.current);
          clearTimeout(timeout.current);
          setTimer(0);
        } else if (onIdle === "false") {
          clearInterval(intervalId.current);
          clearTimeout(timeout.current);
          setTimer(0);
          setIsCountDown(false);
          reset();
        }
      }, 1000);
    }
  };
  const msToTime = (s: any) => {
    const pad = (n: any, z?: any) => {
      z = z || 2;
      return ("00" + n).slice(-z);
    };

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;

    const _time = {
      min: pad(mins),
      sec: pad(secs),
    };
    return _time;
  };
  const onAction = (event: any) => {
    clearInterval(intervalId.current);
    clearTimeout(timeout.current);
    setTimer(0);
    setIsCountDown(false);
    localStorage.setItem("onIdle", "false");
  };
  const formatKey = (key: any) => {
    if (key === "min") {
      return "Minutes";
    } else if (key === "sec") {
      return "Seconds";
    }
  };

  const clientConfig = {
    client_id:
      "291102522660-q4vr7l3qsbt8amdkdbf7cil586lln2q1.apps.googleusercontent.com",
    cookie_policy: "single_host_origin",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
    ux_mode: "redirect",
    redirect_uri: "https://localhost:44334/login",
  };
  const { reset } = useIdleTimer({
    onIdle,
    onAction,
    timeout: 1000 * 60 * 20,
    // timeout: 10000,
    promptTimeout: 1000,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: false,
    syncTimers: 0,
  });
  // const clientId =
  //   "291102522660-q4vr7l3qsbt8amdkdbf7cil586lln2q1.apps.googleusercontent.com";
  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: auzreConfig?.c || "",
      authority: `https://login.microsoftonline.com/${auzreConfig?.s}`,
      redirectUri: "/",
      postLogoutRedirectUri: `/`,
    },
    cache: {
      cacheLocation: "localStorage",
      secureCookies: false,
      storeAuthStateInCookie: isIE || isEdge || isFirefox,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: any, message: any, containsPii: any) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              // console.error(message);
              return;
            case LogLevel.Info:
              // console.info(message);
              return;
            case LogLevel.Verbose:
              // console.debug(message);
              return;
            case LogLevel.Warning:
              // console.warn(message);
              return;
            default:
              return;
          }
        },
      },
    },
  });
  return (
    <LoadProvider>
      <UserContextProvider>
        <MsalProvider instance={publicClientApplication}>
          <AlertContextProvider>
            <SessionContextProvider>
              <AdminEditCompletedMemoProvider>
                <LoadComponent />
                <LoadPackageComponent
                  {...{ isLoadPackage, setIsLoadPackage }}
                />
                <Router>
                  <NavigationBar responeConfig={responeConfig} />

                  {responeConfig !== undefined && (
                    <>
                      <Routes
                        {...{ isLoadPackage, setIsLoadPackage }}
                        responeConfig={responeConfig}
                      />
                    </>
                  )}
                </Router>
                {isCountDown && (
                  <div className="timeout-screen">
                    <Row>
                      <Col span={24}>
                        <p className="timeout-header">
                          System will automatically logout in
                        </p>
                      </Col>
                    </Row>
                    <Row className="timeout-row">
                      {Object.entries(timer).map(([key, value], idx) => {
                        // toggleArray.push(false);
                        return (
                          <>
                            <Col span={12} className="timer-container">
                              <p className="time-timeout-text">
                                {formatKey(key)}
                              </p>

                              <p className="time-timeout">{timer[key]}</p>
                            </Col>
                            {idx % 2 !== 0 && <p className="dot">:</p>}
                          </>
                        );
                      })}
                    </Row>
                  </div>
                )}
              </AdminEditCompletedMemoProvider>
            </SessionContextProvider>
          </AlertContextProvider>
        </MsalProvider>
      </UserContextProvider>
    </LoadProvider>
  );
};
export default App;
