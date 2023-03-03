import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UnAurthorization from "../../screens/UnAuthorizePage/UnAurthorization";
import { GetNavbarMenu } from "../../Services/NavBarMenuService";
const withPerMission =
  (Component: any) =>
  ({ ...props }) => {
    const [isAuthorize, setIsAuthorizeo] = useState(false);
    const [onLoading, setOnLoading] = useState(true);
    const history = useHistory();
    const location = useLocation();
    const isAdmin =
      window.localStorage.getItem("isAdmin") === "true" ? true : false;
    const empData = JSON.parse(window.localStorage.getItem("userData"));
    const query = new URLSearchParams(useLocation().search);

    useEffect(() => {
      const fetchNav = async () => {
        const menus = await GetNavbarMenu(empData?.employeeData?.Email);
        const _query = query.get("name") || "";

        let _isAuthorize: boolean = isAuthorize;
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];

          if (
            menu?.Url?.toLowerCase() === location.pathname?.toLowerCase() ||
            menu?.Url?.toLowerCase() === `/${_query?.toLowerCase()}` ||
            location?.pathname
              ?.toLowerCase()
              .includes(menu?.Url?.toLowerCase()) ||
            isAdmin
          ) {
            _isAuthorize = true;
          }
        }
        setOnLoading(false);
        setIsAuthorizeo(_isAuthorize);
      };
      fetchNav();
    }, [query]);

    return onLoading ? (
      <div />
    ) : isAuthorize ? (
      <Component {...props} />
    ) : (
      <UnAurthorization />
    );
  };
export default withPerMission;
