import React, { useState, useEffect } from "react";
import { useGoogleAuth, useGoogleUser } from "react-gapi-auth2";
import { useSessionContext } from "../../Context/AuthContext";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";

export const LoginGoogle = () => {
  // const [user, setUser] = useState<any>(null);
  // const [sessionState, setSessionState] = useSessionContext();
  // const { googleAuth } = useGoogleAuth();
  // const cookies = new Cookies();
  // const { currentUser } = useGoogleUser();
  // const history = useHistory();
  // useEffect(() => {
  //   console.log("user", user);
  //   if (!user && googleAuth) {
  //     //   googleAuth?.signIn();
  //     checkAuth();
  //   }
  // }, [user, googleAuth]);
  // const checkAuth = async () => {
  //   if (googleAuth?.isSignedIn.get()) {
  //     setUser(googleAuth?.currentUser.get().getBasicProfile().getName());
  //     submitGoogle();
  //   } else {
  //     console.log("dd", googleAuth?.isSignedIn.get());
  //     googleAuth?.signIn();
  //   }
  // };
  // const submitGoogle = async () => {
  //   if (googleAuth?.isSignedIn.get()) {
  //     const _accounts: any = googleAuth?.currentUser
  //       .get()
  //       .getBasicProfile()
  //       .getEmail();
  //     await fetch("api/Login/GoogleAccount", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username: _accounts,
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const _loginWolfAccount: any = data;
  //         console.log("datadatadata", data);

  //         if (data) {
  //           const fav_storage = JSON.parse(
  //             localStorage.getItem("favorite")
  //           );
  //           localStorage.removeItem("userData");
  //           localStorage.removeItem("tinyUrl");
  //           cookies.remove("GuidVerify");
  //           cookies.set(
  //             "GuidVerify",
  //             googleAuth?.currentUser.get().getAuthResponse().access_token,
  //             {
  //               path: "/",
  //               expires: new Date(
  //                 Date.now() +
  //                   googleAuth?.currentUser.get().getAuthResponse().expires_in
  //               ),
  //             }
  //           );
  //           if (fav_storage !== null) {
  //             if (fav_storage.length > 0) {
  //               localStorage.setItem(
  //                 "favorite",
  //                 JSON.stringify(fav_storage)
  //               );
  //             }
  //           } else {
  //             localStorage.setItem("favorite", JSON.stringify([]));
  //           }

  //           localStorage.setItem(
  //             "userData",
  //             JSON.stringify(_loginWolfAccount)
  //           );
  //           localStorage.setItem(
  //             "employeeId",
  //             _loginWolfAccount.employeeData.EmployeeId
  //           );
  //           localStorage.setItem(
  //             "employeeCode",
  //             _loginWolfAccount.employeeData.EmployeeCode
  //           );
  //           localStorage.setItem(
  //             "nameEn",
  //             _loginWolfAccount.employeeData.NameEn
  //           );
  //           localStorage.setItem(
  //             "nameTh",
  //             _loginWolfAccount.employeeData.NameTh
  //           );
  //           localStorage.setItem(
  //             "email",
  //             _loginWolfAccount.employeeData.Email
  //           );
  //           localStorage.setItem(
  //             "positionNameTh",
  //             _loginWolfAccount.employeeData.PositionNameTh
  //           );
  //           localStorage.setItem(
  //             "positionNameEn",
  //             _loginWolfAccount.employeeData.PositionNameEn
  //           );
  //           localStorage.setItem(
  //             "departmentId",
  //             _loginWolfAccount.employeeData.DepartmentId
  //           );
  //           localStorage.setItem(
  //             "departmentNameTh",
  //             _loginWolfAccount.employeeData.DepartmentNameEn
  //           );
  //           localStorage.setItem("tinyUrl", _loginWolfAccount.TinyURL);

  //           setSessionState({ ...sessionState, isAuthenticated: true });
  //           history.push("/Default");
  //         } else {
  //           console.log("ddddeee");
  //         }
  //       });
  //   }
  // };
  // //   if (googleAuth?.isSignedIn.get()) {
  // //     return (
  // //       <>
  // //         <p
  // //           onClick={() => {
  // //             console.log(
  // //               "googleAuth?.isSignedIn",
  // //               googleAuth?.currentUser.get().getBasicProfile().getName()
  // //             );
  // //           }}
  // //         >
  // //           Welcome user{" "}
  // //           {googleAuth?.currentUser.get().getBasicProfile().getName()}
  // //         </p>
  // //         <button
  // //           onClick={() => {
  // //             console.log("googleAuth?.isSignedIn", googleAuth?.isSignedIn.get());
  // //             googleAuth.signOut();
  // //             setUser(null);
  // //             location.reload();
  // //           }}
  // //         >
  // //           Sign Out
  // //         </button>
  // //       </>
  // //     );
  // //   }
  return (
    <div>
      {/* <p
        onClick={() => {
          console.log("googleAuth?.isSignedIn", googleAuth?.isSignedIn.get());
        }}
      >
        Click here to sign in:
      </p>
      <button
        onClick={() => {
          console.log("googleAuth?.isSignedIn", googleAuth?.isSignedIn);

          googleAuth?.signIn();
        }}
      >
        Sign In
      </button> */}
    </div>
  );
};
