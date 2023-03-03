import React, { useState, useEffect, useRef } from "react";
import { BsList } from "react-icons/bs";
import { ButtonNavigation } from "../ButtonNav/ButtonNavigation";
import { ButtonNavigationDropdown } from "../ButtonNav/ButtonNavigationDropdown";
// import { Dropdown } from "react-bootstrap";
// import { useGoogleAuth, useGoogleUser } from "react-gapi-auth2";

// import WolfLogo from "../../assets/WOLF_lite_logo.png";
import WolfLogo from "../../assets/wolfLogo.png";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
import { IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { FaKey } from "react-icons/fa";
import "./NavigationBar.css";
import { Dropdown } from "antd";
import { Popover, Modal } from "antd";
import { IoLogOutSharp } from "react-icons/io5";
import Cookies from "universal-cookie";
import { useSessionContext } from "../../Context/AuthContext";
import { GetNavbarMenu } from "../../Services/NavBarMenuService";
import { BsFillPersonFill } from "react-icons/bs";
import { EmployeeDialog } from "../SettingDialogComponents/EmployeeDialog/EmplyeeDialog";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Controller, useForm } from "react-hook-form";
import { LoginConfiguration } from "../../Services/ConfigurationService";
import { Toast } from "primereact/toast";
import useAlert from "../../hooks/useAlert";
import ChangePasswordModal from "./ChangePasswordModal";
import { IChangePasswordRequest } from "../../IRequestModel/IChangePasswordModel";
import { useUserContext } from "../../Context/UserContext";
import { INavigationMenu } from "../../IRequestModel/INavagationModel";
import EmployeeDialogFix from "../SettingDialogComponents/EmployeeDialog/EmployeeDialogFixed";
import { useTranslation } from "react-i18next";
interface Props {
  responeConfig: any;
}

export const NavigationBar = (props: Props) => {
  const { toggleAlert } = useAlert();
  const [userData, setUserData] = useUserContext();
  const [navigationMenu, setNavigationMenu] = useState<INavigationMenu[]>([]);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [popOverClick, setPopOverClick] = useState<boolean>(false);
  const [popOverHover, setPopOverHover] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(false);
  const [nameUser, setNameUser] = useState<string>("");
  const [shortNameUser, setShortNameUser] = useState<string>("");
  const [emailUser, setEmailUser] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mainDialogVisible, setMainDialogVisible] = useState<boolean>(false);
  const [empData, setEmpData] = useState<any>({});
  const { instance, inProgress, accounts } = useMsal();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isPasswordCompared, setIsPasswordCompared] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState(false);
  const { t } = useTranslation(["translation"]);
  // const { googleAuth } = useGoogleAuth();

  let location = useLocation();
  let history = useHistory();
  const cookies = new Cookies();
  const [sessionState, setSessionState] = useSessionContext();
  const { url } = useRouteMatch();
  const toast = useRef<any>(null);

  const [isWolf, setIsWolf] = useState<boolean>(false);
  const [canEditProfile, setCanEditProfile] = useState<boolean>(true);
  const [canEditOnlySignature, setCanEditOnlySignature] =
    useState<boolean>(true);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      comfirm_password: "",
    },
  });
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (userData) {
      console.log({ userData });
      initialNameUser();
      fetchNav();
      checkState();
    }
  }, [userData]);
  useEffect(() => {
    console.log({ sessionState });
  }, [sessionState]);
  const initialNameUser = () => {
    if (userData) {
      let name = userData.NameEn || "";
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
      setShortNameUser(firstName + lastName);
    }
  };

  const fetchNav = async () => {
    const _navigationMenu = await GetNavbarMenu(userData?.Email);

    setNavigationMenu([..._navigationMenu]);
  };

  const checkState = () => {
    const _isWolf = window.localStorage.getItem("isWolf");
    const _canEditProfile = window.localStorage.getItem("canEditProfile");

    if (_isWolf == "true") {
      setIsWolf(true);
    } else {
      setIsWolf(false);
    }

    if (
      _canEditProfile &&
      _canEditProfile.length > 2 &&
      _canEditProfile !== "undefined"
    ) {
      const editProfileSetting: {
        canEditOnlySignature: boolean;
        canEditProfile: boolean;
      } = JSON.parse(_canEditProfile);
      if (editProfileSetting) {
        setCanEditOnlySignature(editProfileSetting.canEditOnlySignature);
        setCanEditProfile(editProfileSetting.canEditProfile);
      }
    }
  };

  const handleScroll = () => {
    setPopOverClick(false);
  };
  const handleCancel = () => {
    reset();
    setVisible(false);
  };

  const closeDropdown = () => {
    setToggleDropdown(false);
  };

  const handleClickChange = (visible: boolean) => {
    setPopOverHover(false);
    setPopOverClick(visible);
  };
  const signOutClickHandler = async (instance: any) => {
    var respone = await LoginConfiguration();
    const baseurl = window.location.origin.toString();
    cookies.remove("GuidVerify");
    setSessionState({ ...sessionState, isAuthenticated: false });
    //AzureLogout
    if (respone.type === "LoginAzure") {
      const logoutRequest = {
        account: instance.getAccountByHomeId(accounts[0]?.homeAccountId),
        postLogoutRedirectUri: `${baseurl}/login`,
      };
      await instance.logoutRedirect(logoutRequest);
    }
    setPopOverClick(false);

    //GoogleLogout
    // googleAuth?.signOut();
  };
  const handleOpenEditProfileModal = () => {
    setMainDialogVisible(true);
    setPopOverClick(false);
  };
  const handleOpenChangePasswordModal = () => {
    setVisible(true);
    setPopOverClick(false);
  };
  const userPopupContent = () => {
    return (
      <div className="main-user-popup-content">
        <div className="user-popup-content">
          <div className="user-popup-content-display">
            <IoPersonOutline className="icon-margin-top" />
            <p className="text-account-name icon-margin-left">
              {userData?.NameEn}
            </p>
          </div>
          <div className="user-popup-content-display">
            <IoMailOutline className="icon-margin-top " />
            <p className="text-account-mail icon-margin-left">
              {userData?.Email}
            </p>
          </div>
        </div>
        <div className="popup-button-box">
          {/* change Pass */}
          {canEditProfile && (
            <div
              className="popup-container"
              onClick={handleOpenEditProfileModal}
            >
              <div className="circle">
                <BsFillPersonFill />
              </div>
              <p className="text-logout">{t("Edit Profile")}</p>
            </div>
          )}
          {isWolf && (
            <div
              className="popup-container"
              onClick={handleOpenChangePasswordModal}
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
          )}
          <div
            className="popup-container"
            onClick={() => signOutClickHandler(instance)}
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
  const NavbarDesktop = () => {
    return (
      <>
        <div
          className="logo-container desktop"
          onClick={() => history.push("/Default")}
        >
          <img
            style={{
              width: `${props.responeConfig?.cssConfig?.width}`,
              height: `${props.responeConfig?.cssConfig?.height}`,
            }}
            className="img-logo"
            src={props.responeConfig?.pathLogoNav}
            alt="logo"
          />
        </div>
        <div className="button-navbar-container desktop">
          <ButtonNavigation data={navigationMenu} setActive={setIsActive} />
        </div>
        <div className="profile-container desktop">
          <Popover
            placement="bottomRight"
            content={userPopupContent}
            trigger="click"
            visible={popOverClick}
            onVisibleChange={handleClickChange}
            overlayInnerStyle={{ borderRadius: "6px" }}
          >
            <div className="profile-button">
              <p className="profile-name">{shortNameUser}</p>
            </div>
          </Popover>
        </div>
      </>
    );
  };
  const NavbarMobile = () => {
    return (
      <>
        <div className="logo-container mobile">
          <img
            className="img-logo"
            style={{
              width: `${props.responeConfig?.cssConfig?.width}`,
              height: `${props.responeConfig?.cssConfig?.height}`,
            }}
            src={props.responeConfig?.pathLogoNav}
            alt="logo"
          />
        </div>

        {/* <div className="profile-container mobile">
          <Popover
            placement="bottomRight"
            content={userPopupContent}
            trigger="click"
          >
            <div className="profile-button">
              <p className="profile-name">{shortNameUser}</p>
            </div>
          </Popover>
        </div> */}
      </>
    );
  };
  const onSubmitPassword = async (res: IChangePasswordRequest) => {
    console.log(res);
    const _baseUrl = window.location.hostname;
    if (res.new_password !== res.comfirm_password) {
      setIsPasswordCompared(false);
    } else {
      // setVisible(false);
      const respone = await fetch("api/Authentication/ResetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.Email,
          newPassword: res.new_password,
          oldPassword: res.current_password,
          webUrl:
            process.env.NODE_ENV === "development"
              ? "nissin-uat.wolfapprove.com"
              : _baseUrl,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("reset", data);
          if (data) {
            toggleAlert({
              description: `${data.Remark}`,
              message: `Success`,
              type: "success",
            });
            cookies.remove("GuidVerify");
            setPopOverClick(false);
            setSessionState({ ...sessionState, isAuthenticated: false });
            signOutClickHandler(instance);
          } else {
            toggleAlert({
              description: `Incorrect current password.`,
              message: `Error`,
              type: "error",
            });
          }
          handleCancel();
        });
      setIsPasswordCompared(true);
    }
  };
  const menu = (
    <div className="dropdown-submenu-container">
      <ButtonNavigationDropdown
        data={navigationMenu}
        closeDropdown={closeDropdown}
      />
    </div>
  );

  const toggleMainDialog = (state: boolean, action: string) => {
    if (!state) {
      setMainDialogVisible(state);
    }
  };

  const dialogEmployee = () => {
    return (
      <EmployeeDialogFix
        dialogHeader="Edit Profile"
        rowData={userData}
        canEditOnlySignature={canEditOnlySignature}
        mainDialogVisible={mainDialogVisible}
        toggleMainDialog={toggleMainDialog}
        isEditProfile={true}
      />
    );
  };
  return (
    <>
      {sessionState.isAuthenticated && (
        <>
          {mainDialogVisible && dialogEmployee()}
          <ChangePasswordModal
            {...{
              control,
              errors,
              handleCancel,
              handleSubmit,
              isPasswordCompared,
              onSubmitPassword,
              visible,
            }}
          />
          <Toast ref={toast} />
          <div className={`navbar-container ${isActive ? "-active" : ""}`}>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              visible={toggleDropdown}
              placement="bottomCenter"
              className="dropdown-navbar"
            >
              <div
                className="submenu-container"
                onClick={() => setToggleDropdown(!toggleDropdown)}
              >
                <BsList />
              </div>
            </Dropdown>
            {navigationMenu.length > 0 && (
              <>
                {NavbarDesktop()}
                {NavbarMobile()}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
