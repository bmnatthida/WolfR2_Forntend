import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import { useHistory } from "react-router";
import { RegisterWolfAccount } from "../../Services/AuthorizedService";
import LogoLoading from "../../assets/LoadingWOLFmini.gif";
type Props = { PathLogo: any };

const RegisterWolfScreen = (props: Props) => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const [isPasswordCompared, setIsPasswordCompared] = useState<boolean>(true);
  const [checkLength, setCheckLength] = useState<boolean>(true);
  const [checkEmail, setCheckEmail] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);
  const [dataRemark, setDataRemark] = useState<string>("");
  const history = useHistory();

  async function onSubmit(data: any) {
    setCheckLength(true);
    setIsPasswordCompared(true);
    setCheckEmail(true);

    var validated = validateEmail(data.email);
    if (!validated) {
      setCheckEmail(false);
    }
    if (data.confirm_password.length < 8) {
      setCheckLength(false);
      return;
    } else if (data.confirm_password !== data.new_password) {
      setIsPasswordCompared(false);
      return;
    }
    setLoading(true);
    const _baseUrl = window.location.hostname;

    var dataRequest = {
      Username: data.email,
      Password: data.confirm_password,
      Note: data.new_password,
      // Remark: "https://qar2.wolfapprove.com",
      Remark:
        process.env.NODE_ENV === "development"
          ? "qar2.wolfapprove.com"
          : _baseUrl,
    };
    console.log({
      Regis: {
        Username: data.email,
        Remark:
          process.env.NODE_ENV === "development"
            ? "qar2.wolfapprove.com"
            : _baseUrl,
      },
    });

    const respone = await RegisterWolfAccount(dataRequest);
    if (respone.IsActive) {
      var replace = respone.Remark.replaceAll("([-EMAIL-])", data.email);
      replace = replace.replaceAll("<br/>", "\n");
      setDisplayPopup(true);
      setDataRemark(replace);
    } else {
      if (respone.Remark.includes("Your username is duplicate")) {
        setDisplayPopup(true);
        setDataRemark(respone.Remark);
      }
    }
    setLoading(false);
  }
  const validateEmail = (email: any) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  function popupRespone() {
    return (
      <div className="forget-password-container">
        <img src={props.PathLogo} alt="img" />
        <div className="text-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p className="text-header" style={{ fontSize: 18 }}>
              {dataRemark}
            </p>
            <button
              className="button-confirm-2"
              type="button"
              onClick={() => history.push("/login")}
            >
              ย้อนกลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    );
  }
  function form() {
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="forget-password-container">
            <FiChevronLeft
              size={40}
              onClick={() => history.push("/login")}
              className={"back-button"}
            />

            <img src={props.PathLogo} alt="img" />

            <div className="text-container">
              <p className="text-header">Register / สมัครใช้งาน</p>
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
                    className={`input-class ${errors.email ? "invalid" : ""}`}
                    placeholder="กรุณากรอกอีเมล"
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.email && <p className="text-error">กรุณากรอกอีเมลใหม่</p>}
              {!checkEmail && (
                <p className="text-error">รูปแบบอีเมลไม่ถูกต้อง</p>
              )}
            </div>
            <div className="input-container">
              <p className="text-label">รหัสผ่าน</p>
              <Controller
                name="new_password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
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
              {!checkLength && isPasswordCompared && (
                <p className="text-error">รหัสผ่านอย่างน้อย 8 ตัวอักษร</p>
              )}
              {!isPasswordCompared && (
                <p className="text-error">กรุณากรอกรหัสผ่านให้ตรงกัน</p>
              )}
            </div>
            <button className="button-confirm-2" type="submit">
              สมัคร
            </button>
          </div>
        </form>
      </>
    );
  }
  return (
    <div className="error-page-container without-nav">
      {!loading ? (
        <>{!displayPopup ? form() : popupRespone()}</>
      ) : (
        <img src={LogoLoading} alt="loading..." />
      )}
    </div>
  );
};

export default RegisterWolfScreen;
