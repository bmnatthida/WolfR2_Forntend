import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import PrivateRoute, { ProtectedRouteProps } from "./PrivateRoute";
import { useSessionContext } from "../Context/AuthContext";
import { FooterComponents } from "../components/FooterComponents/FooterComponents";
import MasterDatascreenFixed from "../screens/SettingScreen/MasterDataScreen/MasterDatascreenFixed";
import MasterDataScreen from "../screens/SettingScreen/MasterDataScreen/MasterDataScreen";
interface Props {}

export const SettingRoutes = (props: Props) => {
  const location = useLocation();
  const [sessionContext, updateSessionContext] = useSessionContext();
  const [pathName, setPathName] = useState<string>("");
  const setRedirectPath = (path: string) => {
    updateSessionContext({ ...sessionContext, redirectPath: path });
  };
  const defaultProtectedRouteProps: ProtectedRouteProps = {
    isAuthenticated: !!sessionContext.isAuthenticated,
    authenticationPath: "/login",
    redirectPath: sessionContext.redirectPath,
    setRedirectPath: setRedirectPath,
  };
  useEffect(() => {
    // setPathName(`/Setting?name=${location.pathname}`);
  }, [location]);
  return (
    <div>
      <div style={{ minHeight: "100vh" }}>
        <PrivateRoute
          {...defaultProtectedRouteProps}
          path={"/Setting"}
          component={MasterDatascreenFixed}
        />
      </div>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          paddingRight: "40px",
          paddingLeft: "40px",
          paddingBottom: "20px",
          flex: "1 1",
          width: "100%",
        }}
      >
        <FooterComponents />
      </div>
    </div>
  );
};
