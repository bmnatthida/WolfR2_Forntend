import React, { useEffect, useState } from "react";
import "./forgotPassword.css";
import ReCAPTCHA from "react-google-recaptcha";
import WolfLogo from "../../assets/WOLF_lite_logo_TCB_Blue.png";
import { useLocation, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Spin, Space } from "antd";
import { FiChevronLeft } from "react-icons/fi";
type Props = {
  PathLogo: any;
};

const ForgotPasswordScreen = (props: Props) => {
  const query = new URLSearchParams(useLocation().search);
  const [haveKey, setHaveKey] = useState<string>(query.get("vkey") || "");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassWord, setConfirmPassWord] = useState<string>("");
  const [captcharVerify, setCaptcharVerify] = useState(false);
  const [isPasswordCompared, setIsPasswordCompared] = useState<boolean>(true);
  const [onLoading, setOnLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [remark, setRemark] = useState("");
  const history = useHistory();
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      new_password: "",
      confirm_password: "",
    },
  });
  useEffect(() => {
    if (query.get("PK") !== null && query.get("PK") !== undefined) {
      setHaveKey(query.get("PK") || "");
    }
  }, [query]);
  useEffect(() => {
    const checkKey = async () => {
      setOnLoading(true);
      if (haveKey.length > 0) {
        const respone = await fetch("api/Authentication/ConfirmResetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GuidVerify: haveKey }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              setOnLoading(false);
            } else {
              setRemark("มีบางอย่างไม่ถูกต้อง กรุณาตรวจสอบ");
            }
          });
      }
    };
    checkKey();
  }, [haveKey]);
  const onSubmit = async (data: any) => {
    const _baseUrl = window.location.hostname;
    if (data.new_password === data.confirm_password) {
      setIsPasswordCompared(true);
      const respone = await fetch("api/Authentication/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.new_password,
          webUrl:
            process.env.NODE_ENV === "development"
              ? "qar2.wolfapprove.com"
              : _baseUrl,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === false) {
            setRemark("มีบางอย่างไม่ถูกต้อง กรุณาตรวจสอบ");
          } else {
            setIsSuccess(true);
          }
        });
    } else {
      setIsPasswordCompared(false);
    }
  };
  const onSubmitReset = async () => {
    const respone = await fetch("api/Authentication/ResetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: haveKey, newPassword: newPassword }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };
  return (
    <div className="error-page-container without-nav">
      {!haveKey ? (
        <>
          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="forget-password-container">
                <FiChevronLeft
                  size={40}
                  className={"back-button"}
                  onClick={() => history.goBack()}
                />

                <img src={props.PathLogo} alt="img" />

                <div className="text-container">
                  <p className="text-header">Change your Password</p>
                </div>
                <div className="input-container">
                  <p className="text-label">อีเมล</p>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        type="text"
                        className={`input-class ${
                          errors.email ? "invalid" : ""
                        }`}
                        placeholder="กรุณากรอกอีเมล"
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-error">กรุณากรอกอีเมลใหม่</p>
                  )}
                </div>
                <div className="input-container">
                  <p className="text-label">รหัสผ่านใหม่</p>
                  <Controller
                    name="new_password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        autoComplete="new-password"
                        type="password"
                        className={`input-class ${
                          errors.new_password ? "invalid" : ""
                        }`}
                        placeholder="กรุณากรอกรหัสผ่าน"
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.new_password && (
                    <p className="text-error">กรุณากรอกรหัสผ่านใหม่</p>
                  )}
                </div>
                <div className="input-container">
                  <p className="text-label">ยืนยันรหัสผ่าน</p>
                  <Controller
                    name="confirm_password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        type="password"
                        className={`input-class ${
                          errors.confirm_password || !isPasswordCompared
                            ? "invalid"
                            : ""
                        }`}
                        placeholder="กรุณายืนยันรหัสผ่าน"
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.confirm_password && isPasswordCompared && (
                    <p className="text-error">กรุณากรอกยืนยันรหัสผ่าน</p>
                  )}
                  {!isPasswordCompared && (
                    <p className="text-error">กรุณากรอกรหัสผ่านให้ตรงกัน</p>
                  )}
                </div>
                <button className="button-confirm-2" type="submit">
                  เปลี่ยนรหัสผ่าน
                </button>
                {remark.length > 0 && (
                  <p className="text-error">ไม่พบผู้ใช้อีเมลในระบบ</p>
                )}
              </div>
            </form>
          ) : (
            <div className="forget-password-container">
              <img src={props.PathLogo} alt="img" />
              <div className="text-container">
                {onLoading ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p className="text-header" style={{ fontSize: 18 }}>
                      You can verify the request to use WOLF Approve via the
                      email {getValues().email} that you have entered.
                      ท่านสามารถยืนยันการขอใช้งานระบบผ่าน email (
                      {getValues().email}) ที่ท่านได้กรอกมา...
                    </p>
                    <button
                      className="button-confirm-2"
                      type="button"
                      onClick={() => history.push("/login")}
                    >
                      ย้อนกลับไปหน้าเข้าสู่ระบบ
                    </button>
                  </div>
                ) : (
                  <>
                    {remark.length > 0 ? (
                      <>
                        <p className="text-header">ยืนยันตนไม่ถูกต้อง</p>
                        <p className="text-label">{remark}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-header">ยืนยันตนเรียบร้อย</p>
                        <button
                          className="button-confirm-2"
                          type="button"
                          onClick={() => history.push("/login")}
                        >
                          ย้อนกลับไปหน้าเข้าสู่ระบบ
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="forget-password-container">
          <img src={props.PathLogo} alt="img" />
          <div className="text-container">
            {onLoading ? (
              <div>
                <p className="text-header">กำลังยืนยันสิทธิ์</p>

                <Spin size="large" />
              </div>
            ) : (
              <>
                {remark.length > 0 ? (
                  <>
                    <p className="text-header">ยืนยันตนไม่ถูกต้อง</p>
                    <p className="text-label">{remark}</p>
                  </>
                ) : (
                  <>
                    <p className="text-header">ยืนยันตนเรียบร้อย</p>
                    <button
                      className="button-confirm-2"
                      type="button"
                      onClick={() => history.push("/login")}
                    >
                      ย้อนกลับไปหน้าเข้าสู่ระบบ
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordScreen;
