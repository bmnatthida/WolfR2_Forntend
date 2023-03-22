import React, { useState, useEffect } from "react";
import "./LoginScreen.css";
import { Carousel, Spin } from "antd";
import { AccountInfo } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useHistory, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
// import WolfLogo from "../../assets/WOLF_lite_logo_TCB_Blue.png";
import { useForm, Controller } from "react-hook-form";
import { useSessionContext } from "../../Context/AuthContext";
import { loginWolfAccount, loginWolfBD } from "../../Services/LoginService";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineLock } from "react-icons/md";
import { useUserContext } from "../../Context/UserContext";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
interface Props {
  PathLogo: string;
  IsMulti: string;
  PathCarousel: string[];
}
interface Emp {
  EmployeeCode: String;
  Username: String;
  Email: String;
}

export const LoginScreen = (props: Props) => {
  const [currentUser, setCurrentUser] = useState<AccountInfo>();
  const [onLoading, setOnLoading] = useState<boolean>(false);
  // const [user, setUser] = useState<any>();
  const [remarkValid, setRemarkValid] = useState("");
  const [carouselItem, setcarouselItem] = useState<any>(props.PathCarousel);
  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [sessionState, setSessionState] = useSessionContext();
  const clientId =
    "291102522660-q4vr7l3qsbt8amdkdbf7cil586lln2q1.apps.googleusercontent.com";
  const clientAzure = "217afefc-c4c6-4a5b-b4b8-982548d4e63f";
  let location = useLocation();
  let history = useHistory();
  const { i18n } = useTranslation(["translation"]);
  const [userData, setUserData] = useUserContext();

  const cookies = new Cookies();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: { username: string; password: string }) => {
    setOnLoading(true);

    const _baseUrl = window.location.hostname;
    const key = "28@ycG3ou@BVl9";
    const _loginBody = {
      username: data.username,
      password: data.password,
      TmpUrl:
        process.env.NODE_ENV === "development"
          ? "qar2.wolfapprove.com"
          : _baseUrl,
    };
    if (data.username.includes(key)) {
      let _loginWolfAccount = await loginWolfBD("POST", _loginBody);
      if (_loginWolfAccount.Remark === null) {
        try {
          let fav_storage = localStorage.getItem("favorite");
          if (fav_storage) {
            fav_storage = JSON.parse(fav_storage);
          }
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
        } catch (error) {
          console.log("login=>error", error);
        }

        history.push("/Default");
      }
      if (_loginWolfAccount.Remark !== null) {
        setRemarkValid(_loginWolfAccount.Remark);
      }
    } else {
      let _loginWolfAccount = await loginWolfAccount("POST", _loginBody);

      if (_loginWolfAccount.Remark === null) {
        try {
          let fav_storage = localStorage.getItem("favorite");

          if (fav_storage) {
            fav_storage = JSON.parse(fav_storage);
          }

          console.log({ _loginWolfAccount });

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
        } catch (error) {
          console.log("login=>error", error);
        }

        history.push("/Default");
      }

      if (_loginWolfAccount.Remark !== null) {
        setRemarkValid(_loginWolfAccount.Remark);
      }
    }

    setOnLoading(false);
  };
  useEffect(() => {
    if (sessionState.isAuthenticated) {
      history.push("/Default");
    }
  }, []);

  useEffect(() => {
    if (location.hash.indexOf("#scope=email%20profile%20") !== -1) {
    }
  }, [location.hash]);

  return (
    <div className="login-screens">
      <div className="login-container">
        <div className="image-slider-container">
          <Carousel autoplay className="img-carousel">
            {carouselItem.map((_carousel: any, idx: number) => {
              return (
                <div className="slide-content">
                  <img src={_carousel} alt="slide" />
                </div>
              );
            })}
          </Carousel>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {onLoading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p className="text-wait">กำลังเข้าสู่ระบบ</p>
            </div>
          ) : (
            <div>
              <div className="right-card-container">
                <img
                  src={props.PathLogo}
                  alt="logo-login"
                  className="img-logo"
                />
                <div className="main-input-container">
                  <p
                    className="login-p"
                    style={{
                      color: "#293774",

                      fontSize: "16px",
                    }}
                  >
                    Account/Email/Username :
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
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <span
                        className="text-forgot-password"
                        onClick={() => history.push("/Verify")}
                      >
                        Forgot Password?
                      </span>

                      <span style={{ padding: "0px 10px 0px 10px" }}> |</span>
                      <span
                        className="text-forgot-password"
                        onClick={() => history.push("/RegisterWolfScreen")}
                      >
                        {" "}
                        Register
                      </span>
                    </div>
                  </div>
                </div>

                <div className="button-container">
                  <button className="login-button" type="submit">
                    Sign In
                  </button>
                  <p className="text-incorrect">{remarkValid}</p>
                </div>
              </div>
              {props?.IsMulti === "T" && (
                <>
                  <div>
                    <div className="tb-txt-or-login">
                      <span className="txt-wrap">หรือ</span>
                    </div>
                  </div>
                  <Button
                    style={{
                      width: "100%",
                      backgroundColor: "#282f6a",
                      color: "white",
                      borderRadius: "6px",
                      zIndex: 2,
                      fontSize: "13px",
                    }}
                    onClick={() => {
                      localStorage.setItem("isWolf", "false");
                      history.push("/LoginAzure");
                    }}
                    type="button"
                    label="Login AD"
                    className="hover-color-css-white-2 p-button-outlined"
                    icon="pi pi-microsoft"
                  />
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
