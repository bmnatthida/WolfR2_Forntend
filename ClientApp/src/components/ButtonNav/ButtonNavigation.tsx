import React, { useState, useEffect, useMemo } from "react";
import {
  AiOutlineReconciliation,
  AiOutlineSetting,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { RiTodoLine } from "react-icons/ri";
import { Link, useHistory, useLocation } from "react-router-dom";
// import Popover from "react-bootstrap/Popover";
import { Popover } from "antd";
import "./ButtonNavigation.css";
import { log } from "console";
import { replaceSpecialChar } from "../../Helper/ReplaceSpecialChar";
interface Props {
  data: any[];
  setActive: any;
}

export const ButtonNavigation: React.FC<Props> = ({ data, setActive }) => {
  const [menuButton, setMenuButton] = useState<Object>({});
  const [sortableMenu, setSortableMenu] = useState<any[]>([]);
  const [toggleState, setToggleState] = useState<any[]>([]);
  const { t } = useTranslation(["translation"]);
  const history = useHistory();
  const location = useLocation();
  useMemo(() => {
    let result = data.reduce(function (r, a) {
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

    let sortableMenu = [];
    for (var menu in _res) {
      sortableMenu.push([menu, _res[menu]]);
    }

    sortableMenu.sort(function (a, b) {
      return a[1][0].OrderGroup - b[1][0].OrderGroup;
    });
    setSortableMenu([...sortableMenu]);

    setMenuButton({ ..._res });
    const toggleArray: any = [];
    Object.entries(menuButton).forEach(([key, value]) => {
      toggleArray.push(false);
    });
    console.log("toggleArray", toggleArray);
    setToggleState([...toggleArray]);
  }, [data]);
  useEffect(() => {
    console.log("nev=>menuButton", menuButton);
    console.log("nev=>location", location);

    console.log("nev=>toggleState", toggleState);

    Object.entries(menuButton).forEach(([key, value], _idx) => {
      if (location.pathname.indexOf(key) !== -1) {
        console.log("nev=>value", value[0].OrderGroup);

        let _toggleState = new Array(toggleState.length).fill(false);
        _toggleState[value[0].OrderGroup - 1] = true;
        setToggleState([..._toggleState]);
      }

      if (location.pathname !== `/${key}`) {
        value.forEach((_data: any) => {
          console.log("_data", _data);
          if (
            location.pathname === `/${_data.GroupMenu}` ||
            location.pathname.indexOf(_data.Url) !== -1
          ) {
            let _toggleState = new Array(toggleState.length).fill(false);

            _toggleState[value[0].OrderGroup - 1] = true;
            setToggleState([..._toggleState]);
          }
        });
      }
    });
  }, [location.pathname, menuButton]);
  useEffect(() => {
    const _toggleState = toggleState;
    if (location.pathname === "/Request") {
      setActive(true);
    }
    const res_every = _toggleState.every((b) => b === false);
    for (let i = 0; i < _toggleState.length; i++) {
      const state = _toggleState[i];
      if (state === true) {
        setActive(true);
      }
    }
    if (res_every && location.pathname !== "/Request") {
      setActive(false);
    }
  }, [toggleState]);
  const mapIcon = (key: string) => {
    if (key === "Worklist") {
      return <RiTodoLine />;
    }
    if (key === "Report") {
      return <AiOutlineReconciliation />;
    }
    if (key === "Settings") {
      return <AiOutlineSetting />;
    }
    if (key === "List and Documents") {
      return <AiOutlineUnorderedList />;
    }
  };

  return (
    <div className="button-navbar-container">
      {sortableMenu.map((menu, _idx) => {
        return (
          <div key={_idx}>
            {menu[1].length > 0 &&
            menu[1].every(
              (_data: any) => _data.SubMenu !== null && _data.SubMenu !== ""
            ) ? (
              <Popover
                key={_idx}
                placement="bottom"
                content={() => (
                  <>
                    {menu[1]
                      .sort(
                        (a: any, b: any) =>
                          Number(a.OrderSub) - Number(b.OrderSub)
                      )
                      .map((e: any, idx: any) => {
                        const subMenu = replaceSpecialChar(e.SubMenu);

                        return (
                          <>
                            {e.SubMenu !== "" &&
                            e.SubMenu !== null &&
                            e.GroupMenu !== "Settings" ? (
                              e.InternalUrl !== 0 ? (
                                <div key={idx}>
                                  <Link to={e.Url} className="a-button-submenu">
                                    <p key={idx} className="button-submenu">
                                      {t(e.SubMenu)}
                                    </p>
                                  </Link>
                                </div>
                              ) : (
                                <div key={idx}>
                                  <a
                                    key={idx}
                                    className="button-submenu"
                                    onClick={() => {
                                      // history.push(e.Url);
                                      window.open(e.Url);
                                    }}
                                    target="_blank"
                                  >
                                    {t(e.SubMenu)}
                                  </a>
                                </div>
                              )
                            ) : e.InternalUrl !== 0 ? (
                              <div key={idx}>
                                <Link
                                  className="a-button-submenu"
                                  to={
                                    "/Settings?name=" + e.Url.replace("/", "")
                                  }
                                >
                                  <p key={idx} className="button-submenu">
                                    {t(e.SubMenu)}
                                  </p>
                                </Link>
                              </div>
                            ) : (
                              <div key={idx}>
                                <p
                                  key={idx}
                                  className="button-submenu"
                                  onClick={() => {
                                    const _url = e.Url;
                                    window.open(_url, "blank");
                                  }}
                                >
                                  {t(e.SubMenu)}
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })}
                  </>
                )}
                trigger="hover"
              >
                <button
                  className={`button-nav ${toggleState[_idx] && `-active`}`}
                  id={replaceSpecialChar(menu[0] ?? "")}
                >
                  {mapIcon(menu[0])}
                  <p className="text-button">{t(menu[0])}</p>
                </button>
              </Popover>
            ) : menu[1]?.length < 2 &&
              `${menu[1][0]?.Url}` &&
              menu[1][0]?.InternalUrl === 0 ? (
              <a
                className={`button-nav ${toggleState[_idx] && `-active`}`}
                href={`${menu[1][0]?.Url}`}
                target={"_blank"}
                id={replaceSpecialChar(menu[0] ?? "")}
              >
                {mapIcon(menu[0])}
                <p className="text-button">{t(menu[0])}</p>
              </a>
            ) : (
              <Link
                className={`button-nav ${toggleState[_idx] && `-active`}`}
                to={menu[1].length < 2 ? `${menu[1][0].Url}` : ""}
              >
                {mapIcon(menu[0])}
                <p className="text-button">{t(menu[0])}</p>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
