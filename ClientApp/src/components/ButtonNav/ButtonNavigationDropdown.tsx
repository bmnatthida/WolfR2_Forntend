import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { Collapse } from "antd";
import { IoLogOutSharp, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { useSessionContext } from "../../Context/AuthContext";
import { BsFillFileEarmarkPersonFill, BsFillPersonFill } from "react-icons/bs";
import { EmployeeDialog } from "../SettingDialogComponents/EmployeeDialog/EmplyeeDialog";
import { useTranslation } from "react-i18next";
interface Props {
  data: any;
  closeDropdown: () => void;
}

export const ButtonNavigationDropdown = (props: Props) => {
  const [menuButton, setMenuButton] = useState<Object>({});
  const [toggleState, setToggleState] = useState<any[]>([]);
  const [nameUser, setNameUser] = useState<string>("");
  const [shortNameUser, setShortNameUser] = useState<string>("");
  const [emailUser, setEmailUser] = useState<string>("");
  const [empData, setEmpData] = useState<any>({});
  const [mainDialogVisible, setMainDialogVisible] = useState<boolean>(false);
  const cookies = new Cookies();
  const [sessionState, setSessionState] = useSessionContext();
  const { t } = useTranslation(["translation"]);
  useEffect(() => {
    const empData = JSON.parse(window.localStorage.getItem("userData") || "");
    if (empData !== null) {
      let name = empData.employeeData.NameEn || "";
      let email = empData.employeeData.Email || "";
      const fullName: any[] | ["", ""] = name.split(" ");
      let firstName = "";
      let lastName = "";
      for (let i = 0; i < fullName.length; i++) {
        if (i === 0) {
          firstName = fullName[i].slice(0, 1).toUpperCase();
        }
        if (i === 1) {
          lastName = fullName[i].slice(0, 1).toUpperCase();
        }
      }

      setEmailUser(email);
      setShortNameUser(firstName + lastName);
      setNameUser(name);
      setEmpData(empData.employeeData);
    }
  }, [sessionState.isAuthenticated]);
  useEffect(() => {
    let result = props.data.reduce(function (r: any, a: any) {
      r[a.GroupMenu] = r[a.GroupMenu] || [];
      r[a.GroupMenu].push(a);
      return r;
    }, Object.create(null));

    const { Request, ...newResult } = result;
    let _res: any = {};
    for (const [key, value] of Object.entries(newResult)) {
      const uniqueArray = newResult[key].filter((value: any, index: any) => {
        const _value = JSON.stringify(value.SubMenu);
        return (
          index ===
          newResult[key].findIndex((obj: any) => {
            return JSON.stringify(obj.SubMenu) === _value;
          })
        );
      });
      _res[key] = uniqueArray;
    }

    setMenuButton(_res);
    const toggleArray: any = [];
    Object.entries(menuButton).forEach(([key, value]) => {
      toggleArray.push(false);
    });

    setToggleState([...toggleArray]);
  }, [props.data]);
  const { Panel } = Collapse;
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    Object.entries(menuButton).forEach(([key, value], _idx) => {
      if (location.pathname === `/${key}`) {
        let _toggleState = new Array(toggleState.length).fill(false);
        _toggleState[_idx] = true;
        setToggleState([..._toggleState]);
      }
      if (location.pathname !== `/${key}`) {
        value.forEach((_data: any) => {
          if (location.pathname === `${_data.Url}`) {
            let _toggleState = new Array(toggleState.length).fill(false);
            _toggleState[_idx] = true;
            setToggleState([..._toggleState]);
          }
        });
      }
      if (location.pathname === `/Request`) {
        let _toggleState = new Array(toggleState.length).fill(false);
        setToggleState([..._toggleState]);
      }
    });
  }, [location.pathname, menuButton]);
  const userPopupContent = () => {
    return (
      <div
        className="main-user-popup-content"
        onClick={() => console.log(window.location.href)}
      >
        <div className="user-popup-content">
          <div className="user-popup-content-display">
            <IoPersonOutline className="icon-margin-top" />
            <p className="text-account-name icon-margin-left">{nameUser}</p>
          </div>
          <div className="user-popup-content-display">
            <IoMailOutline className="icon-margin-top " />
            <p className="text-account-mail icon-margin-left">{emailUser}</p>
          </div>
        </div>
        <div className="popup-button-box">
          <div
            className="popup-container"
            onClick={() => {
              setMainDialogVisible(true);
              // setPopOverClick(false);
            }}
          >
            <div className="circle">
              <BsFillFileEarmarkPersonFill />
            </div>
            <p className="text-logout">Profile</p>
          </div>
          <div
            className="popup-container"
            onClick={() => {
              // setVisible(true);
              // setPopOverClick(false);
            }}
          >
            <div className="circle">
              <svg
                width="13"
                height="13"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.375 0.515625C11.4374 0.515648 10.5124 0.731471 9.6716 1.14638C8.83081 1.56129 8.09679 2.16415 7.52639 2.90828C6.95599 3.65241 6.56452 4.51784 6.38229 5.43756C6.20005 6.35727 6.23195 7.30659 6.4755 8.212L0.515625 14.1719V18.4844H4.82812V16.3281H6.98438V14.1719H9.14062L10.7937 12.5188C11.3098 12.6596 11.8403 12.7315 12.375 12.7344C13.9953 12.7344 15.5493 12.0907 16.695 10.945C17.8407 9.79925 18.4844 8.24531 18.4844 6.625C18.4844 5.00469 17.8407 3.45075 16.695 2.30502C15.5493 1.15929 13.9953 0.515625 12.375 0.515625Z"
                  fill="black"
                  stroke="black"
                  stroke-width="0.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <p className="text-logout">{t("Change Password")}</p>
          </div>
          <div
            className="popup-container"
            onClick={() => {
              cookies.remove("GuidVerify");

              window.localStorage.removeItem("userData");
              window.localStorage.removeItem("employeeId");
              window.localStorage.removeItem("employeeCode");
              window.localStorage.removeItem("nameEn");
              window.localStorage.removeItem("nameTh");
              // setPopOverClick(false);

              setSessionState({ ...sessionState, isAuthenticated: false });
              // signOutClickHandler(instance);
            }}
          >
            <div className="circle">
              <IoLogOutSharp />
            </div>
            <p className="text-logout">{t("Logout")}</p>
          </div>
        </div>
      </div>
    );
  };
  const mapButton = () => {
    const map: any = [];
    map.push(
      <>
        <Panel
          header={
            <div className="profile-nav-container">
              <div className="profile-container mobile">
                <div className="profile-button">
                  <p className="profile-name">{shortNameUser}</p>
                </div>
                <div className="profile-text-container">
                  <div className="user-popup-content">
                    <div className="user-popup-content-display">
                      <IoPersonOutline className="icon-margin-top" />
                      <p className="text-account-name icon-margin-left">
                        {nameUser}
                      </p>
                    </div>
                    <div className="user-popup-content-display">
                      <IoMailOutline className="icon-margin-top " />
                      <p className="text-account-mail icon-margin-left">
                        {emailUser}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          key="sadsad"
        >
          <div className="popup-button-box">
            <div
              className="popup-container"
              onClick={() => {
                setMainDialogVisible(true);
                // setPopOverClick(false);
              }}
            >
              <div className="circle">
                <BsFillPersonFill />
              </div>
              <p className="text-logout">{t("Profile")}</p>
            </div>
            <div
              className="popup-container"
              onClick={() => {
                // setVisible(true);
                // setPopOverClick(false);
              }}
            >
              <div className="circle">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.375 0.515625C11.4374 0.515648 10.5124 0.731471 9.6716 1.14638C8.83081 1.56129 8.09679 2.16415 7.52639 2.90828C6.95599 3.65241 6.56452 4.51784 6.38229 5.43756C6.20005 6.35727 6.23195 7.30659 6.4755 8.212L0.515625 14.1719V18.4844H4.82812V16.3281H6.98438V14.1719H9.14062L10.7937 12.5188C11.3098 12.6596 11.8403 12.7315 12.375 12.7344C13.9953 12.7344 15.5493 12.0907 16.695 10.945C17.8407 9.79925 18.4844 8.24531 18.4844 6.625C18.4844 5.00469 17.8407 3.45075 16.695 2.30502C15.5493 1.15929 13.9953 0.515625 12.375 0.515625Z"
                    fill="black"
                    stroke="black"
                    stroke-width="0.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p className="text-logout">{t("Change Password")}</p>
            </div>
            <div
              className="popup-container"
              onClick={() => {
                cookies.remove("GuidVerify");

                window.localStorage.removeItem("userData");
                window.localStorage.removeItem("employeeId");
                window.localStorage.removeItem("employeeCode");
                window.localStorage.removeItem("nameEn");
                window.localStorage.removeItem("nameTh");
                // setPopOverClick(false);

                setSessionState({ ...sessionState, isAuthenticated: false });
                // signOutClickHandler(instance);
              }}
            >
              <div className="circle">
                <IoLogOutSharp />
              </div>
              <p className="text-logout">{t("Logout")}</p>
            </div>
          </div>
        </Panel>
      </>
    );
    Object.entries(menuButton).forEach(([key, value], _idx) => {
      if (key !== "Request") {
        map.push(
          <>
            {value.length > 1 ? (
              <Panel header={key} key={key}>
                {value.map((e: any, idx: any) => (
                  <p
                    key={idx}
                    className="button-submenu"
                    onClick={() => {
                      history.push(e.Url);
                      props.closeDropdown();
                    }}
                  >
                    {e.SubMenu}
                  </p>
                ))}
              </Panel>
            ) : (
              <button
                className={`button-nav ${toggleState[_idx] && `-active`}`}
                onClick={() => {
                  history.push(`${value[0].Url}`);
                  props.closeDropdown();
                }}
              >
                <p className="text-button">{key}</p>
              </button>
            )}
          </>
        );
      }
    });

    return (
      // <Accordion className="arrording-drop-container">
      //   <Accordion.Item eventKey="0">
      //     {/* <Accordion.Header>{key}</Accordion.Header> */}
      //     {/* <Accordion.Body className="arrording-drop-body">
      //             {value.map((e: any, idx: any) => (
      //               <p
      //                 key={idx}
      //                 className="button-submenu"
      //                 onClick={() => {
      //                   history.push(e.Url);
      //                   props.closeDropdown();
      //                 }}
      //               >
      //                 {e.SubMenu}
      //               </p>
      //             ))}
      //           </Accordion.Body> */}
      //     {map}
      //   </Accordion.Item>
      // </Accordion>
      <Collapse defaultActiveKey={["1"]}>{map}</Collapse>
    );
  };
  return (
    <div className="button-navbar-dropdown-container">
      <EmployeeDialog
        dialogHeader="Edit Profile"
        formData={empData}
        mainDialogVisible={mainDialogVisible}
        setMainDialogVisible={setMainDialogVisible}
      />
      {props.data.length > 0 ? mapButton() : null}
    </div>
  );
};
