import React, { useEffect, ReactNode } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router";

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  redirectPath: string;
  setRedirectPath: (path: string) => void;
  children?: ReactNode;
} & RouteProps;

export default function PrivateRoute({
  isAuthenticated,
  authenticationPath,
  redirectPath,
  setRedirectPath,
  children,
  ...routeProps
}: ProtectedRouteProps) {
  const currentLocation = useLocation();

  useEffect(() => {
    // console.log(currentLocation);

    if (!isAuthenticated) {
      setRedirectPath("/login");
    }
  }, [isAuthenticated, setRedirectPath, currentLocation]);
  if (
    isAuthenticated &&
    redirectPath !== currentLocation.pathname &&
    currentLocation.pathname === "/"
  ) {
    return <Redirect to={"/login"} />;
  } else if (
    isAuthenticated &&
    redirectPath !== currentLocation.pathname &&
    currentLocation.pathname !== "/login"
  ) {
    return (
      <Route {...routeProps} path={routeProps.path}>
        {children}
      </Route>
    );
  } else {
    return (
      <Redirect
        to={{ pathname: isAuthenticated ? redirectPath : authenticationPath }}
      />
    );
  }
}
