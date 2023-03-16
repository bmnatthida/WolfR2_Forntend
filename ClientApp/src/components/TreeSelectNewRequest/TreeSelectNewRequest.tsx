import React, { useState, useEffect } from "react";
import { Popover, Collapse } from "antd";
import Cookies from "universal-cookie";
import { BsPlusCircle } from "react-icons/bs";
import { useHistory, useLocation } from "react-router-dom";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { IoAdd, IoChevronForward } from "react-icons/io5";
import { IoChevronDownSharp } from "react-icons/io5";
import "./TreeSelectNewRequest.css";
import {
  GetAllTemplate,
  GetTemplateeBindFormNameDDL,
  GetTemplateFromDDL,
  GetTemplateTemplateListVersion,
} from "../../Services/TemplateService";
import { Button } from "primereact/button";
import { GetRolePermission } from "../../Services/RoleServices";
import { useUserContext } from "../../Context/UserContext";
import { useTranslation } from "react-i18next";

interface Props {
  setDataTemplateTreeProps?: any;
}

export const TreeSelectNewRequest = (props: Props) => {
  const [groupDataTemplate, setGroupDataTemplate] = useState<any>([]);
  const [searchTemplate, setSearchTemplate] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkActionFavorite, setCheckActionFavorite] =
    useState<boolean>(false);
  const [checkActionPanel, setCheckActionPanel] = useState<boolean>(false);
  const [checkFilter, setCheckFilter] = useState<boolean>(false);
  const [userData] = useUserContext();
  const { Panel } = Collapse;
  const cookies = new Cookies();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation(["translation"]);
  useEffect(() => {
    fetchDataTemplate();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleScroll = (e: any) => {
    setIsOpen(false);
  };

  async function fetchDataTemplate() {
    try {
      const empData = JSON.parse(window.localStorage.getItem("userData") || "");
      const empid = empData.employeeData.EmployeeId;
      const DepartmentId = empData.employeeData.DepartmentId;
      const dataJson = {
        Username: userData.Username,
        DepartmentId: Number(userData.DepartmentId),
        EmployeeId: Number(userData.EmployeeId),
        Email: userData.Email,
        selectAll: false,
        DefultMode: false,
        OnlyActive: true,
      };

      let _dataTemplate = await GetTemplateFromDDL(dataJson);
      let _groupDataTemplate: any = [{ header: "Favorite", data: [] }];
      let fav_cookie: any = window.localStorage.getItem("favorite");
      fav_cookie = JSON.parse(fav_cookie);
      let groupTemplate = _dataTemplate?.reduce(function (r: any, a: any) {
        r[a.GroupTemplateName] = r[a.GroupTemplateName] || [];
        r[a.GroupTemplateName].push(a);
        return r;
      }, Object.create(null));
      const roles = await GetRolePermission();
      for (const [key, value] of Object.entries(groupTemplate)) {
        let _value: any = value;
        for (let i = 0; i < _value.length; i++) {
          if (fav_cookie?.length > 0) {
            for (let k = 0; k < fav_cookie.length; k++) {
              if (
                fav_cookie[k]?.TemplateNameWithCode ===
                _value[i]?.TemplateNameWithCode
              ) {
                _value[i]["favorite"] = fav_cookie[k].favorite;
                _groupDataTemplate[0].data.push(_value[i]);
              }
            }
          }
        }

        _groupDataTemplate.push({ header: key, data: _value });
      }
      setGroupDataTemplate(_groupDataTemplate);
      setSearchTemplate(_groupDataTemplate);
    } catch (error) {}
  }
  const onClickStar = (groupIdx: any, templateIdx: any, idx: number) => {
    setCheckActionFavorite(true);
    let _groupDataTemplate = searchTemplate;
    for (let i = 0; i < _groupDataTemplate.length; i++) {
      if (groupIdx === _groupDataTemplate[i].header) {
        for (let j = 0; j < _groupDataTemplate[i].data.length; j++) {
          if (
            _groupDataTemplate[i].data[j].TemplateNameWithCode === templateIdx
          ) {
            _groupDataTemplate[i].data[j].favorite =
              !_groupDataTemplate[i].data[j].favorite;
          }
        }
      }
    }
    let fav_cookie: any = window.localStorage.getItem("favorite");
    fav_cookie = JSON.parse(fav_cookie);
    let checkUnClickStar: boolean = false;
    for (let i = 0; i < _groupDataTemplate.length; i++) {
      if (
        _groupDataTemplate[i].header === groupIdx &&
        _groupDataTemplate[i].header !== "Favorite"
      ) {
        for (let j = 0; j < fav_cookie.length; j++) {
          const element2 = fav_cookie[j];
          if (
            _groupDataTemplate[i].data[idx].TemplateId === element2.TemplateId
          ) {
            fav_cookie.splice(j, 1);
            checkUnClickStar = true;
          }
        }
        if (!checkUnClickStar) {
          fav_cookie.push(_groupDataTemplate[i].data[idx]);
        }
      }
    }
    let checkHasFavorite: boolean = false;
    for (let i = 0; i < _groupDataTemplate.length; i++) {
      const element = _groupDataTemplate[i];
      if (element.header === "Favorite") {
        checkHasFavorite = true;
      }
    }
    if (checkHasFavorite) {
      _groupDataTemplate[0].data.splice(
        0,
        _groupDataTemplate[0].data.length,
        ...fav_cookie
      );
    } else {
      let _groupDataTemplate2: any = [{ header: "Favorite", data: [] }];
      _groupDataTemplate2[0].data = fav_cookie;
      console.log(fav_cookie, "fav_cookieCheckHasFavorite");
      console.log(_groupDataTemplate2, "_groupDataTemplate2");
      _groupDataTemplate.splice(0, 0, _groupDataTemplate2[0]);
    }

    window.localStorage.setItem("favorite", JSON.stringify(fav_cookie));
    setSearchTemplate([..._groupDataTemplate]);
  };
  const onUnFavorite = (
    _groupTemplateName: any,
    _templateNameWithCode: any,
    idx: any
  ) => {
    setCheckActionFavorite(true);
    let _groupDataTemplate = groupDataTemplate;
    let fav_cookie: any = window.localStorage.getItem("favorite");
    fav_cookie = JSON.parse(fav_cookie);
    _groupDataTemplate[0].data = fav_cookie;
    for (let i = 0; i < _groupDataTemplate[0].data.length; i++) {
      _groupDataTemplate[0].data.splice(idx, 1);
      break;
    }
    for (let i = 0; i < _groupDataTemplate.length; i++) {
      if (_groupTemplateName === _groupDataTemplate[i].header) {
        for (let j = 0; j < _groupDataTemplate[i].data.length; j++) {
          if (
            _groupDataTemplate[i].data[j].TemplateNameWithCode ===
            _templateNameWithCode
          ) {
            _groupDataTemplate[i].data[j].favorite =
              !_groupDataTemplate[i].data[j].favorite;
          }
        }
      }
    }
    window.localStorage.setItem(
      "favorite",
      JSON.stringify(_groupDataTemplate[0].data)
    );
    setSearchTemplate([..._groupDataTemplate]);
  };
  const mapContent = () => {
    let _groupTemplate: any = [];
    let activeDefault = [...Array(_groupTemplate?.length).keys()];
    let _searchTemplate = searchTemplate;
    for (let i = 0; i < _searchTemplate.length; i++) {
      if (_searchTemplate[i].header !== "Favorite") {
        let _group: any = (
          <Panel
            key={i}
            header={<p className="panel-header">{_searchTemplate[i].header}</p>}
            className="group-template-panel "
          >
            {_searchTemplate[i].data.map((_data: any, idx: any) => {
              return (
                <div className="template-item-container" key={idx}>
                  <p
                    className="template-text"
                    onClick={() => {
                      if (
                        location.pathname === "/Request" &&
                        props.setDataTemplateTreeProps !== undefined
                      ) {
                        history.push(
                          `/Request?MemoID=0&template=${_data.TemplateId}`
                        );
                        props.setDataTemplateTreeProps(_data);
                      }
                      if (location.pathname !== "/Request") {
                        history.push(
                          `/Request?MemoID=0&template=${_data.TemplateId}`,
                          { listFormName: _data }
                        );
                      }
                      setIsOpen(false);
                    }}
                  >
                    {_data.TemplateNameWithCode}
                  </p>
                  {_data.favorite ? (
                    <AiFillStar
                      style={{ display: "initial" }}
                      onClick={() =>
                        onClickStar(
                          _data.GroupTemplateName,
                          _data.TemplateNameWithCode,
                          idx
                        )
                      }
                    />
                  ) : (
                    <AiOutlineStar
                      onClick={() =>
                        onClickStar(
                          _data.GroupTemplateName,
                          _data.TemplateNameWithCode,
                          idx
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
          </Panel>
        );
        _groupTemplate.push(_group);
      } else {
        let _group: any = (
          <Panel
            key={i}
            header={<p className="panel-header">{_searchTemplate[i].header}</p>}
            className="group-template-panel"
          >
            {_searchTemplate[i].data.map((_data: any, idx: any) => {
              return (
                <div className="template-item-container">
                  <p
                    className="template-text"
                    onClick={() => {
                      if (
                        location.pathname === "/Request" &&
                        props.setDataTemplateTreeProps !== undefined
                      ) {
                        history.push(
                          `/Request?MemoID=0&template=${_data.TemplateId}`
                        );
                        props.setDataTemplateTreeProps(_data);
                      }
                      if (location.pathname !== "/Request") {
                        history.push(
                          `/Request?MemoID=0&template=${_data.TemplateId}`,
                          { listFormName: _data }
                        );
                      }
                      setIsOpen(false);
                    }}
                  >
                    {_data.TemplateNameWithCode}
                  </p>

                  <AiFillStar
                    style={{ display: "initial" }}
                    onClick={() =>
                      onUnFavorite(
                        _data.GroupTemplateName,
                        _data.TemplateNameWithCode,
                        idx
                      )
                    }
                  />
                </div>
              );
            })}
          </Panel>
        );
        _groupTemplate.push(_group);
      }

      if (checkActionFavorite) {
        activeDefault = [0];
      }
    }

    return (
      <div className="collapse-container">
        <div className="search-template-container">
          <input
            className="input-custom"
            type="text"
            name="fil"
            placeholder="ค้นหา ประเภทแบบฟอร์ม / แบบฟอร์ม"
            style={{ paddingLeft: "35px" }}
            id="fil"
            onChange={(e) => onFilterChange(e.target.value)}
          />
          <BsSearch />
        </div>
        {checkFilter && (
          <Collapse
            className="group-template-collapse"
            defaultActiveKey={[...Array(_groupTemplate?.length).keys()]}
            expandIcon={({ isActive }) =>
              isActive ? (
                <IoChevronDownSharp size={18} />
              ) : (
                <IoChevronForward size={18} />
              )
            }
            expandIconPosition={"right"}
          >
            {_groupTemplate}
          </Collapse>
        )}
        {!checkFilter && !checkActionFavorite && (
          <Collapse
            defaultActiveKey={activeDefault}
            className="group-template-collapse"
            expandIcon={({ isActive }) =>
              isActive ? (
                <IoChevronDownSharp size={18} />
              ) : (
                <IoChevronForward size={18} />
              )
            }
            expandIconPosition={"right"}
          >
            {_groupTemplate}
          </Collapse>
        )}
        {!checkFilter && checkActionFavorite && (
          <Collapse
            defaultActiveKey={activeDefault}
            className="group-template-collapse"
            expandIcon={({ isActive }) =>
              isActive ? (
                <IoChevronDownSharp size={18} />
              ) : (
                <IoChevronForward size={18} />
              )
            }
            expandIconPosition={"right"}
          >
            {_groupTemplate}
          </Collapse>
        )}
      </div>
    );
  };
  const onFilterChange = (text: string) => {
    setCheckActionFavorite(false);
    if (groupDataTemplate) {
      if (groupDataTemplate.length > 0) {
        let _groupDataTemplate = groupDataTemplate;
        console.log(groupDataTemplate, "groupDataTemplate");

        if (!text) {
          setCheckFilter(false);
          let fav_cookie: any = window.localStorage.getItem("favorite");
          fav_cookie = JSON.parse(fav_cookie);
          _groupDataTemplate[0].data = fav_cookie;
          setSearchTemplate([..._groupDataTemplate]);
        } else {
          setCheckFilter(true);
        }
        const _searchTemplate = _groupDataTemplate.filter(
          (_data: any, idx: any) => {
            if (_data.header === "Favorite") {
              return true;
            }
            for (let i = 0; i < _data.data.length; i++) {
              if (
                _data.data[i]?.TemplateName?.toLowerCase().indexOf(
                  text.toLowerCase()
                ) !== -1 ||
                _data.data[i]?.TemplateNameWithCode?.toLowerCase().indexOf(
                  text.toLowerCase()
                ) !== -1 ||
                _data.header?.toLowerCase().indexOf(text.toLowerCase()) !== -1
              ) {
                return true;
              }
            }
          }
        );
        const filteredList: any = [];

        for (let i = 0; i < _searchTemplate.length; i++) {
          const filteredGroup = _searchTemplate[i];
          const filtered = filteredGroup.data.filter((_data: any, idx: any) => {
            if (
              _data?.TemplateName?.toLowerCase().indexOf(text.toLowerCase()) !==
                -1 ||
              _data?.TemplateNameWithCode?.toLowerCase().indexOf(
                text.toLowerCase()
              ) !== -1 ||
              _data?.GroupTemplateName?.toLowerCase().indexOf(
                text.toLowerCase()
              ) !== -1
            ) {
              return true;
            }
          });
          if (filtered.length > 0) {
            filteredList.push({
              header: filteredGroup.header,
              data: filtered,
            });
          }
        }
        setSearchTemplate([...filteredList]);
      }
    }
  };
  const onVisibleChange = (visible: boolean) => {
    setIsOpen(visible);
  };
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      content={mapContent}
      visible={isOpen}
      overlayInnerStyle={{ borderRadius: "6px" }}
      onVisibleChange={onVisibleChange}
    >
      {location.pathname !== "/Request" && (
        <button
          className="request-button-new TreeSelectNewRequest-media-department-display-none"
          id="NewRequest"
        >
          <BsPlusCircle />
          <p>{t("New Request")}</p>
        </button>
      )}

      {location.pathname === "/Request" && (
        <Button
          icon="pi pi-plus"
          className="p-button-rounded  TreeSelectNewRequest-media-department-display-initial TreeSelectNewRequest-background-color"
        />
      )}
      {location.pathname === "/Request" && (
        <button className="request-button-new TreeSelectNewRequest-media-department-display-none">
          <BsPlusCircle />
          <p>{t("New Request")}</p>
        </button>
      )}

      {location.pathname !== "/Request" && (
        <button
          className="request-button-new TreeSelectNewRequest-media-department-display-none-Request"
          style={{ width: "100%" }}
        >
          <BsPlusCircle />
          <p>{t("New Request")}</p>
        </button>
      )}
    </Popover>
  );
};
