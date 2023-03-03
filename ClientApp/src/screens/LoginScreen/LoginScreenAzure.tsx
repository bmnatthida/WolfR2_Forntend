import React, { useEffect, useState } from "react";
import {
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react";
import {
  InteractionStatus,
  InteractionType,
  InteractionRequiredAuthError,
  AccountInfo,
} from "@azure/msal-browser";

import { useHistory, useLocation } from "react-router-dom";
import { useSessionContext } from "../../Context/AuthContext";
import Cookies from "universal-cookie";
import WolfSlideLeft from "../../assets/wolf-slide-left.png";
import WolfSlideRight from "../../assets/wolf-slide-right.png";
import { Carousel, Spin } from "antd";
import WolfLogo from "../../assets/WolfR2LogoLogin.png";
import { useUserContext } from "../../Context/UserContext";
import { Dialog } from "primereact/dialog";
import { MdOutlineLock } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { loginWolfBD } from "../../Services/LoginService";
import { AiOutlineMail } from "react-icons/ai";
import { deleteAllCookies } from "../../Helper/DeleteAllCookie";
import AzureAuthenticationContext from "../../azure/azure-authentication-context";
import { useTranslation } from "react-i18next";
interface Props {}

export const LoginScreenAzure = (props: Props) => {
  const [currentUser, setCurrentUser] = useState<AccountInfo>();
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const [userData, setUserData] = useUserContext();
  const [dialogBD, setDialogBD] = useState<boolean>(false);
  const [remarkValid, setRemarkValid] = useState("");
  const [errorMassage, setErrorMassage] = useState("");
  const { instance, inProgress, accounts } = useMsal();
  const { i18n } = useTranslation(["translation"]);
  const isAuthenticated = useIsAuthenticated();
  const authenticationModule: AzureAuthenticationContext =
    new AzureAuthenticationContext();
  const [sessionState, setSessionState] = useSessionContext();
  const request = {
    scopes: ["User.Read"],
  };
  const { login, result, error } = useMsalAuthentication(
    InteractionType.Silent,
    request
  );
  const cookies = new Cookies();
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);

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

  useEffect(() => {
    if (sessionState.isAuthenticated && isAuthenticated) {
      history.push("/Default");
    }
  }, []);
  useEffect(() => {
    if (query.get("mode") === "BD") {
      setDialogBD(true);
    }
  }, [query]);
  useEffect(() => {
    console.log(
      " : ",
      isAuthenticated,
      InteractionStatus.None,
      accounts,
      " inProgress: ",
      inProgress,
      "Result:",
      result
    );
  }, [isAuthenticated, inProgress, instance, result]);
  useEffect(() => {
    submitAzure();
  }, [accounts]);

  const onSubmitBD = async (data: any) => {
    const _baseUrl = window.location.hostname;
    const key = "28@ycG3ou@BVl9";
    const _loginBody = {
      username: data.username,
      password: data.password,
      TmpUrl:
        process.env.NODE_ENV === "development"
          ? "techconsbiz.wolfapprove.com"
          : _baseUrl,
    };
    console.log("login=>data", data.username.includes(key));

    if (data.username.includes(key)) {
      let _loginWolfAccount = await loginWolfBD("POST", _loginBody);
      console.log("login=>_loginWolfAccount", _loginWolfAccount);

      if (_loginWolfAccount.Remark === null) {
        localStorage.removeItem("userData");
        localStorage.removeItem("tinyUrl");
        cookies.remove("GuidVerify");
        cookies.set("GuidVerify", _loginWolfAccount.GuidVerify, {
          path: "/",
          expires: new Date(Date.now() + 86400000),
        });
        ActionPassLogin(_loginWolfAccount);
      }
      if (_loginWolfAccount.Remark !== null) {
        setRemarkValid(_loginWolfAccount.Remark);
      }
    }
  };

  const submitAzure = async () => {
    if (accounts.length > 0) {
      const _accounts: any = accounts[0];
      setOnLoading(true);
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
          localStorage.removeItem("userData");
          localStorage.removeItem("tinyUrl");
          cookies.remove("GuidVerify");
          cookies.set("GuidVerify", _accounts.idTokenClaims.aud, {
            path: "/",
            expires: new Date(Date.now() + _accounts.idTokenClaims.exp),
          });
          ActionPassLogin(_loginWolfAccount);
        });
    }
  };

  const ActionPassLogin = async (_loginWolfAccount: any) => {
    console.log(_loginWolfAccount, "_loginWolfAccount");
    if (_loginWolfAccount === false) {
      localStorage.clear();
      deleteAllCookies();
      // history.push("/login");
      setRemarkValid("ไม่พบผู้ใช้ในระบบกรุณาลองใหม่อีกครั้ง");
      setOnLoading(false);
      authenticationModule.logout(user);
      return;
    }
    const fav_storage = localStorage.getItem("favorite")
      ? JSON.parse(localStorage.getItem("favorite") || "")
      : "";
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
    setUserData(_loginWolfAccount?.employeeData);
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
    setOnLoading(false);
    history.push("/Default");
  };

  return (
    <div className="login-screens">
      <div className="login-container">
        <div className="image-slider-container">
          <Carousel autoplay className="img-carousel">
            <div className="slide-content">
              <img src={WolfSlideLeft} alt="slide" />
            </div>
            <div className="slide-content">
              <img src={WolfSlideRight} alt="slide" />
            </div>
          </Carousel>
        </div>

        <div className="main-azure-container">
          {onLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p className="text-wait">กำลังเข้าสู่ระบบ</p>
            </div>
          ) : (
            <div className="right-card-container">
              <img src={WolfLogo} alt="logo-login" className="img-logo" />

              <div className="button-container">
                <button
                  className="login-button"
                  onClick={() => {
                    instance.loginPopup(request).catch((e) => {
                      console.error(e);
                    });
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog
        visible={dialogBD}
        style={{ width: "30vw", borderRadius: "16px" }}
        header="AzureBD"
        onHide={() => {
          history.push("/login");
          setDialogBD(false);
        }}
        className="requestor-dialog"
        draggable={false}
        blockScroll
        resizable={false}
        closable={true}
      >
        <div className="login-bddialog">
          <form onSubmit={handleSubmit(onSubmitBD)}>
            {onLoading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p className="text-wait">กำลังเข้าสู่ระบบ</p>
              </div>
            ) : (
              <div className="right-card-container">
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
                    {errors.username?.type === "required" &&
                      "กรุณากรอกชื่อบัญชี"}
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
                      className="text-invalid"
                      style={{ position: "absolute" }}
                    >
                      {errors.password?.type === "required" &&
                        "กรุณากรอกรหัสผ่าน"}
                    </p>
                  </div>
                </div>
                <div className="button-container">
                  <button className="login-button" type="submit">
                    Sign In
                  </button>
                  <p className="text-incorrect">{remarkValid}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </Dialog>
    </div>
  );
};
