import React, { useState, useEffect } from "react";
import "./LoginScreen.css";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserTie, FaKey } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Divider, Carousel, Spin } from "antd";
import { AccountInfo } from "@azure/msal-browser";
import WolfSlideLeft from "../../assets/wolf-slide-left.png";
import WolfSlideRight from "../../assets/wolf-slide-right.png";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useHistory, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import WolfLogo from "../../assets/WOLF_lite_logo_TCB_Blue.png";
import {
  gapi,
  loadAuth2,
  loadAuth2WithProps,
  loadClientAuth2,
} from "gapi-script";
import { useForm, Controller } from "react-hook-form";
import { useSessionContext } from "../../Context/AuthContext";
import { loginAD, loginWolfAccount } from "../../Services/LoginService";
import { AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { GrLock } from "react-icons/gr";
import { MdOutlineLock } from "react-icons/md";
import { useTranslation } from "react-i18next";
interface Props {}
interface Emp {
  EmployeeCode: String;
  Username: String;
  Email: String;
}
export const LoginAD = (props: Props) => {
  const [currentUser, setCurrentUser] = useState<AccountInfo>();
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [remarkValid, setRemarkValid] = useState("");
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [sessionState, setSessionState] = useSessionContext();
  const clientId =
    "291102522660-q4vr7l3qsbt8amdkdbf7cil586lln2q1.apps.googleusercontent.com";
  const clientAzure = "217afefc-c4c6-4a5b-b4b8-982548d4e63f";
  const { i18n } = useTranslation(["translation"]);
  let location = useLocation();
  let history = useHistory();
  const cookies = new Cookies();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    setOnLoading(true);
    let _loginWolfAccount = await loginAD("POST", data);

    if (_loginWolfAccount.Remark === null) {
      const fav_storage = JSON.parse(localStorage.getItem("favorite"));
      localStorage.removeItem("userData");
      localStorage.removeItem("tinyUrl");
      cookies.remove("GuidVerify");
      cookies.set("GuidVerify", _loginWolfAccount.GuidVerify, {
        path: "/",
        expires: new Date(Date.now() + 86400000),
      });
      if (fav_storage !== null) {
        if (fav_storage.length > 0) {
          localStorage.setItem("favorite", JSON.stringify(fav_storage));
        }
      } else {
        localStorage.setItem("favorite", JSON.stringify([]));
      }
      if (_loginWolfAccount?.employeeData?.Lang === "TH") {
        i18n.changeLanguage("th");
      } else {
        i18n.changeLanguage("en");
      }
      localStorage.setItem("userData", JSON.stringify(_loginWolfAccount));
      localStorage.setItem(
        "employeeId",
        _loginWolfAccount.employeeData.EmployeeId
      );
      localStorage.setItem(
        "employeeCode",
        _loginWolfAccount.employeeData.EmployeeCode
      );
      localStorage.setItem("lang", _loginWolfAccount.employeeData.Lang);
      localStorage.setItem("nameEn", _loginWolfAccount.employeeData.NameEn);
      localStorage.setItem("nameTh", _loginWolfAccount.employeeData.NameTh);
      localStorage.setItem("email", _loginWolfAccount.employeeData.Email);
      localStorage.setItem(
        "positionNameTh",
        _loginWolfAccount.employeeData.PositionNameTh
      );
      localStorage.setItem(
        "positionNameEn",
        _loginWolfAccount.employeeData.PositionNameEn
      );
      localStorage.setItem(
        "departmentId",
        _loginWolfAccount.employeeData.DepartmentId
      );
      localStorage.setItem(
        "departmentNameTh",
        _loginWolfAccount.employeeData.DepartmentNameEn
      );
      localStorage.setItem("tinyUrl", _loginWolfAccount.TinyURL);

      setSessionState({ ...sessionState, isAuthenticated: true });

      history.push("/Default");
      // location.reload();
    }
    if (_loginWolfAccount.Remark !== null) {
      setRemarkValid(_loginWolfAccount.Remark);
    }
    setOnLoading(false);
  };
  useEffect(() => {
    if (sessionState.isAuthenticated) {
      history.push("/Default");
    }
  }, []);

  const submitAzure = async () => {
    if (accounts.length > 0) {
      const _accounts: any = accounts[0];
      await fetch("api/Login/AzureAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: accounts[0].username,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const _loginWolfAccount: any = data;

          const fav_storage = JSON.parse(localStorage.getItem("favorite"));
          localStorage.removeItem("userData");
          localStorage.removeItem("tinyUrl");
          cookies.remove("GuidVerify");
          cookies.set("GuidVerify", _accounts.idTokenClaims.aud, {
            path: "/",
            expires: new Date(Date.now() + _accounts.idTokenClaims.exp),
          });
          if (fav_storage !== null) {
            if (fav_storage.length > 0) {
              localStorage.setItem("favorite", JSON.stringify(fav_storage));
            }
          } else {
            localStorage.setItem("favorite", JSON.stringify([]));
          }

          localStorage.setItem("userData", JSON.stringify(_loginWolfAccount));
          localStorage.setItem(
            "employeeId",
            _loginWolfAccount.employeeData.EmployeeId
          );
          localStorage.setItem(
            "employeeCode",
            _loginWolfAccount.employeeData.EmployeeCode
          );
          localStorage.setItem("nameEn", _loginWolfAccount.employeeData.NameEn);
          localStorage.setItem("nameTh", _loginWolfAccount.employeeData.NameTh);
          localStorage.setItem("email", _loginWolfAccount.employeeData.Email);
          localStorage.setItem(
            "positionNameTh",
            _loginWolfAccount.employeeData.PositionNameTh
          );
          localStorage.setItem(
            "positionNameEn",
            _loginWolfAccount.employeeData.PositionNameEn
          );
          localStorage.setItem(
            "departmentId",
            _loginWolfAccount.employeeData.DepartmentId
          );
          localStorage.setItem(
            "departmentNameTh",
            _loginWolfAccount.employeeData.DepartmentNameEn
          );
          localStorage.setItem("tinyUrl", _loginWolfAccount.TinyURL);

          setSessionState({ ...sessionState, isAuthenticated: true });

          history.push("/Default");
        });
    }
  };
  async function signOutClickHandler(instance: any) {
    const logoutRequest = {
      account: instance.getAccountByHomeId(accounts[0].homeAccountId),
      postLogoutRedirectUri: "https://localhost:44334/login",
    };
    await instance.logoutRedirect(logoutRequest);
  }
  useEffect(() => {
    if (location.hash.indexOf("#scope=email%20profile%20") !== -1) {
      checkAuth();
      console.log("if");
    }
    console.log("dasdaseqweqeqwe");
  }, [location.hash]);

  const login = async () => {
    gapi.load("auth2", function () {
      const auth2 = gapi.auth2
        .init({
          client_id: clientId,
          cookie_policy: "single_host_origin",
          ux_mode: "redirect",
          redirect_uri: "https://localhost:44334/login",
          scope: "profile",
        })
        .then(function (auth: any) {
          auth.signIn();
        })
        .then((data: any) => console.log("dasdasdase", data));
    });
  };
  const checkAuth = async () => {
    const auth2 = await loadAuth2(gapi, clientId, "");

    if (auth2.isSignedIn.get()) {
      console.log(auth2.currentUser.get(), "user");
      setUser(auth2.currentUser.get());
    } else {
      login();
      console.log("dddAuth");
    }
  };
  const signOut = async () => {
    const auth2 = await gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setUser(null);
      location.reload();
      console.log("User signed out.");
    });
  };

  return (
    <div className="login-screens">
      <div className="login-container">
        <div
          className="image-slider-container"
          onClick={async () => {
            const auth2 = await loadAuth2(gapi, clientId, "");
            console.log(auth2.currentUser.get());
          }}
        >
          <Carousel autoplay className="img-carousel">
            <div className="slide-content">
              <img src={WolfSlideLeft} alt="slide" />
            </div>
            <div className="slide-content">
              <img src={WolfSlideRight} alt="slide" />
            </div>
          </Carousel>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {onLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p className="text-wait">กำลังเข้าสู่ระบบ</p>
            </div>
          ) : (
            <div className="right-card-container">
              <img src={WolfLogo} alt="logo-login" className="img-logo" />
              <div className="main-input-container">
                <p
                  className="login-p"
                  style={{
                    color: "#293774",

                    fontSize: "16px",
                  }}
                >
                  Email Address :
                </p>
                <div className="input-container">
                  <AiOutlineMail style={{ color: "#B4B4B4" }} />
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter Email Address"
                        className={`input-field ${
                          remarkValid || errors.username?.type === "required"
                            ? "input-invalid"
                            : ""
                        }`}
                      />
                    )}
                  />
                </div>
                <p className="text-invalid" style={{ position: "absolute" }}>
                  {errors.username?.type === "required" && "กรุณากรอกชื่อบัญชี"}
                </p>
              </div>
              <div className="main-input-container">
                <p
                  className="login-p"
                  style={{
                    color: "#293774",
                    fontSize: "16px",
                  }}
                >
                  Password :
                </p>
                <div className="input-container">
                  <MdOutlineLock
                    style={{ color: "#B4B4B4" }}
                    className="svg-password"
                  />
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        placeholder="Enter Password"
                        className={`input-field ${
                          remarkValid || errors.password?.type === "required"
                            ? "input-invalid"
                            : ""
                        }`}
                      />
                    )}
                  />
                  <p
                    className="text-forgot-password"
                    onClick={() => history.push("/forgotpassword")}
                  >
                    Forgot Password?
                  </p>
                </div>
                <p className="text-invalid" style={{ position: "absolute" }}>
                  {errors.password?.type === "required" && "กรุณากรอกรหัสผ่าน"}
                </p>
              </div>

              <div className="button-container">
                <button
                  className="login-button"
                  type="submit"
                  // onClick={() => {
                  //   signOutClickHandler(instance);
                  //   // console.log(accounts, "dd")
                  // }}
                >
                  Sign In
                </button>
                <p className="text-incorrect">{remarkValid}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
    // <div className="login-screen">
    //   <div className="login-logo-container">
    //     <img src={WolfLogo} alt="img-logo" className="img-logo" />
    //   </div>
    //   {isAuthenticated ? (
    //     <div>
    //       <p>กำลังเข้าสู่ระบบ</p>
    //     </div>
    //   ) : (
    //     <div className="login-container">
    //       <div
    //         className="text-header-container"
    //         onClick={() => console.log(sessionState)}
    //       >
    //         <p className="text-header">Welcome to WOLF R2</p>
    //         <p className="text-sub-header">
    //           ยินดีต้อนรับสู่ระบบอนุมัติเอกสารออนไลน์
    //         </p>
    //       </div>
    //       <form onSubmit={handleSubmit(onSubmit)}>
    //         <div className="login-input-container">
    //           <div className="input-main-container">
    //             <p className="input-label">Username / ชื่อบัญชี</p>
    //             <div className="input-container">
    //               <div className="img-input-container">
    //                 <FaUserTie />
    //               </div>
    //               <Controller
    //                 name="username"
    //                 control={control}
    //                 rules={{ required: true }}
    //                 render={({ field }) => (
    //                   <input
    //                     {...field}
    //                     type="text"
    //                     className={`input-field ${
    //                       remarkValid || errors.username?.type === "required"
    //                         ? "input-invalid"
    //                         : ""
    //                     }`}
    //                   />
    //                 )}
    //               />
    //             </div>
    //             <p className="text-invalid">
    //               {errors.username?.type === "required" && "กรุณากรอกชื่อบัญชี"}
    //             </p>
    //           </div>
    //           <div className="input-main-container">
    //             <p className="input-label">Password / รหัสผ่าน</p>
    //             <div className="input-container">
    //               <div className="img-input-container">
    //                 <FaKey />
    //               </div>
    //               <Controller
    //                 name="password"
    //                 control={control}
    //                 rules={{ required: true }}
    //                 render={({ field }) => (
    //                   <input
    //                     {...field}
    //                     type="password"
    //                     className={`input-field ${
    //                       remarkValid || errors.password?.type === "required"
    //                         ? "input-invalid"
    //                         : ""
    //                     }`}
    //                   />
    //                 )}
    //               />
    //             </div>
    //             <p className="text-invalid">
    //               {errors.password?.type === "required" && "กรุณากรอกรหัสผ่าน"}
    //             </p>
    //           </div>
    //         </div>
    //         <button
    //           className="login-button"
    //           type="submit"
    //           // onClick={() => {
    //           //   signOutClickHandler(instance);
    //           //   // console.log(accounts, "dd")
    //           // }}
    //         >
    //           Login / ลงชื่อเข้าใช้
    //         </button>
    //       </form>
    //       <p className="text-incorrect">{remarkValid}</p>
    //     </div>
    //   )}
    // </div>
  );
};
