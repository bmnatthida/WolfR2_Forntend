import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import {
  BsCalendar4,
  BsCalendarDate,
  BsCalendarRange,
  BsChevronDown,
  BsLayoutThreeColumns,
  BsPlusSquare,
} from "react-icons/bs";

import {
  FilterAdvanceSearch,
  MapGroupData,
  MapDataEndpoint,
} from "../../Services/ReportService";
import { DashboardCard } from "./DashboardCard/DashboardCard";
import "./DashboardScreen.css";
import { DashboardCalendar } from "./DashboardCalendar/DashboardCalendar";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  GetDashboardStatusCard,
  GetDashboardAdvancedFilter,
  GetDashboardFilterStatus,
  GetDashboardKeyEndpoint,
  GetDashboardFilterGroupBy,
  GetDashboardDefaultFilterConFig,
  LoginConfiguration,
} from "../../Services/ConfigurationService";
import { RiFilterOffLine } from "react-icons/ri";
import withPerMission from "../../components/HOC/withPermission";
import { FiFilter } from "react-icons/fi";
import { DashboardTimeline } from "./DashboardTimeline/DashboardTimeline";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { MultiSelect } from "primereact/multiselect";
import { DatePicker } from "antd";
import {
  GetAllEmployee,
  GetAllEmployeeByLanguage,
} from "../../Services/EmployeeService";
import { GrFormNextLink } from "react-icons/gr";
import { IoCalendarOutline } from "react-icons/io5";
import { useUserContext } from "../../Context/UserContext";
interface Props {
  responeConfig: any;
}

const DashboardScreen = (props: Props) => {
  const itemFilter: any = {
    dropdown: [],
    value: [],
  };

  const [responeConfig, setResponeConfig] = useState<any>();
  const op = useRef<OverlayPanel>(null);
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const isMounted = useRef<any>(false);
  const [filterGroupBy, setFilterGroupBy] = useState<any>([]);
  const [dataFilterGroupBy, setDataFilterGroupBy] = useState<any>();
  const [ItemsStatus, setItemsStatus] = useState<any>();
  const [dataAdvancedFilter, setDataAdvancedFilter] = useState<any>();
  const [dataAdvancedFilterList, setDataAdvancedFilterList] = useState<any>();
  const { RangePicker } = DatePicker;
  const [dashboard, setDashboard] = useState<any>();
  const [defaultValueDashboard, setDefaultValueDashboard] = useState<any>();
  const [data, setData] = useState<any>();
  const [filter, setFilter] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<any>();
  const [endpoint, setEndpoint] = useState<any>();
  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [onSelectView, onSetSelectView] = useState<string>("1");
  const [statusCard, setStatusCard] = useState<any>();
  const [employeeList, setEmployeeList] = useState<any>();
  const [selectedEmployee, setSelectedEmployee] = useState<any>();
  const [dates, setDates] = useState<any>();
  const [project, setProject] = useState<any>();
  const [selectedStatus, setSelectedStatus] = useState<any>();
  const [keyEnter, setKeyEnter] = useState<boolean>(false);
  const [onClickFilter, setOnClickFilter] = useState<boolean>(false);
  const [filterAttribute, setFilterAttribute] = useState<any>({ items: [] });
  const [userData, setUserData] = useUserContext();
  const [isOpenDateFilter, setIsOpenDateFilter] = useState(false);
  const [valueDropdownInCalendar, setValueDropdownInCalendar] = useState<any>();
  const [isFetchData, setIsFetchData] = useState<boolean>(false);
  useEffect(() => {
    isMounted.current = true;
    window.addEventListener("scroll", handleScroll);
    fetchData();
  }, []);
  async function fetchData() {
    setIsFetchData(true);
    var responseConfig = await LoginConfiguration();
    var _filter = await GetDashboardFilterStatus();
    // var _filterProject = await GetDashboardFilterProject();
    var _responeDefaultAdvanced = await defaultAdvancedFilter(_filter);
    var _endpoint = await GetDashboardKeyEndpoint();
    var _advancedFilter = await GetDashboardAdvancedFilter();
    var _filterGroupBy = await GetDashboardFilterGroupBy();
    var _statusCard = await GetDashboardStatusCard();
    var respone = await FilterAdvanceSearch({
      FavoritesItem: JSON.stringify(_responeDefaultAdvanced),
    });
    var _mapGroupData = await MapDataEndpoint(respone);
    var headData = await MapGroupData(_mapGroupData, _filterGroupBy[0]);
    setData(_mapGroupData);
    setDashboard(headData);
    fetchDataEmployee();
    setDataAdvancedFilter(_advancedFilter);
    setDataFilterGroupBy(_filterGroupBy);
    setStatusCard(_statusCard);
    setEndpoint(_endpoint);
    defaultFilterStatus(_filter);
    // defaultFilterProject(_filterProject);
    setSelectedFilter(_advancedFilter[0]);
    setFilterGroupBy(_filterGroupBy[0]);
    setOnLoading(false);
    setResponeConfig(responseConfig);
  }
  async function mapDataOptionFilter(_advancedFilter: any, _filter: any) {
    var _dataArray: any[] = [];
    _filter.map((_data: any, idx: any) => {
      _dataArray.push(_advancedFilter);
    });
    return _dataArray;
  }
  useEffect(() => {
    if (filterAttribute && dataAdvancedFilter) {
      var _dataArray: any[] = [];
      var _dataArray2: any = [];
      let _dataArray3: any[] = [];
      var _attribute = filterAttribute.items;
      var _advancedFilter = dataAdvancedFilter;
      _attribute.map((_data: any, idx: any) => {
        _dataArray.push(_advancedFilter);
      });
      for (let i = 0; i < _attribute.length; i++) {
        const element = _attribute[i];
        var response = _advancedFilter.filter((item: any) => {
          if (element.dropdown.name === item.name) {
            return item;
          }
        });
        _dataArray2.push(response[0]);
      }
      let ss: any[] = [];
      for (let i = 0; i < _dataArray.length; i++) {
        const options = _dataArray[i];
        let dd: any[] = [];
        for (let j = 0; j < _dataArray2?.length; j++) {
          const selected = _dataArray2[j];
          if (i !== j) {
            for (let k = 0; k < options.length; k++) {
              const option = options[k];
              if (option.name === selected?.name) {
                dd.push(k);
              }
            }
          }
        }
        ss.push({
          idx: i,
          data: dd,
        });
      }
      let zz = [];
      let isHas = false;
      for (let i = 0; i < _dataArray.length; i++) {
        const options = _dataArray[i];
        const element = ss[i];
        let jj: any[] = [];
        for (let k = 0; k < options?.length; k++) {
          const option = options[k];
          for (let j = 0; j < element?.data?.length; j++) {
            const qq = element?.data[j];
            if (qq === k) {
              isHas = true;
            }
          }
          if (!isHas) {
            jj.push(option);
          }
          isHas = false;
        }
        zz.push(jj);
      }
      setDataAdvancedFilterList(zz);
    }
  }, [filterAttribute, dataAdvancedFilter]);
  async function defaultAdvancedFilter(_filterStatus: any) {
    var _defaultFilter = await GetDashboardDefaultFilterConFig();
    var requestData: any[] = [];
    let dataMapping: any = [];
    let _dataItemFilter: any = [];
    _defaultFilter.map((_data: any, idx: any) => {
      let checkStatus: boolean = false;
      var _fieldText: any = null;
      var _fieldType: any = null;
      var _fieldTextFrom: any = null;
      var _fieldTextTo: any = null;
      var _filterParameter: string = "";
      _dataItemFilter.push(itemFilter);
      if (_data.fieldType === "date") {
        _filterParameter = "Equals";
        _fieldType = "d";
        _fieldText = null;
        _fieldTextFrom = moment()
          .add(parseInt(_data.fieldTextFrom), "days")
          .format("DD/MM/yyyy");
        _fieldTextTo = moment()
          .add(parseInt(_data.fieldTextTo), "days")
          .format("DD/MM/yyyy");
        setDates([
          moment(
            new Date(
              moment(
                moment().add(parseInt(_data.fieldTextFrom), "days")
              ).format("yyyy/MM/DD")
            )
          ),
          moment(
            new Date(
              moment(moment().add(parseInt(_data.fieldTextTo), "days")).format(
                "yyyy/MM/DD"
              )
            )
          ),
        ]);
        const _itemFilter: any = {
          dropdown: {
            display: _data.fieldDisplay,
            name: _data.fieldCode,
            type: _data.fieldType,
          },
          value: [
            moment(
              new Date(
                moment(
                  moment().add(parseInt(_data.fieldTextFrom), "days")
                ).format("yyyy/MM/DD")
              )
            ),
            moment(
              new Date(
                moment(
                  moment().add(parseInt(_data.fieldTextTo), "days")
                ).format("yyyy/MM/DD")
              )
            ),
          ],
        };
        let _items = filterAttribute.items;
        _items.push(_itemFilter);
        setFilterAttribute((prevState: any) => ({
          ...prevState,
          items: [..._items],
        }));
      } else if (_data.fieldType === "status") {
        _filterParameter = "Equals";
        _fieldType = "t";
        var fieldSpited = _data?.fieldText.split(";|;");
        const resultCard = _filterStatus.map((_data: any) => {
          const [value, display, defaultValue] = _data.split("||");
          return {
            value: value,
            display: display,
          };
        });
        for (let i = 0; i < fieldSpited.length; i++) {
          const element = fieldSpited[i];
          for (let j = 0; j < resultCard.length; j++) {
            const element2 = resultCard[j];
            if (element === element2.display) {
              checkStatus = true;
              dataMapping.push(element2.value);
            }
          }
        }
        if (checkStatus) {
          _fieldText = "";
          dataMapping?.map((_data: any) => (
            <>
              {dataMapping.length > 1
                ? dataMapping?.slice(-1)[0] == _data
                  ? `${(_fieldText = _fieldText + _data)}`
                  : `${(_fieldText = _fieldText + _data + ";|;")}`
                : (_fieldText = _fieldText + _data)}
            </>
          ));
        }
        const _itemFilter: any = {
          dropdown: {
            display: _data.fieldDisplay,
            name: _data.fieldCode,
            type: _data.fieldType,
          },
          value: [dataMapping],
        };
        let _items = filterAttribute.items;
        _items.push(_itemFilter);
        setFilterAttribute((prevState: any) => ({
          ...prevState,
          items: [..._items],
        }));
      } else {
        _filterParameter = "Like";
      }
      requestData.push({
        ID: 0,
        FieldCode: _data?.fieldCode,
        FieldDisplay: _data?.fieldCode,
        IsExcludeBlankData: true,
        FieldType: _fieldType,
        IsEquals: false,
        FieldText: _fieldText,
        FieldTextFrom: _fieldTextFrom,
        FieldTextTo: _fieldTextTo,
        FieldBit: null,
        FieldTypeFilterStatic: null,
        FieldTypeFilterDynamic: _fieldType,
        IsTodayFrom: false,
        IsTodayTo: false,
        FilterParameter: _filterParameter,
        indexHideColumn: null,
        userPrincipalName: null,
        connectionString: "",
        SecretId: null,
      });
    });

    return requestData;
  }
  async function fetchDataEmployee() {
    var _employee = await GetAllEmployee();
    var array: any[] = [];
    _employee.map((_data: any) => {
      array.push({
        NameEn: _data["NameEn"],
        NameTh: _data["NameTh"],
      });
    });

    setEmployeeList([...array]);
  }
  async function defaultFilterStatus(_filter: any) {
    let _filterStatus: any;
    const resultCard = _filter.map((_data: any) => {
      const [value, display, defaultValue] = _data.split("||");
      _filterStatus = {
        value: value,
        display: display,
      };
      return _filterStatus;
    });
    setItemsStatus(resultCard);
  }
  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function timeoutHandler() {
    await sleep(1);
  }
  // async function defaultFilterProject(_filter: any) {
  //   let _filterProject: any;
  //   const resultCard = _filter.map((_data: any) => {
  //     const [value, display, defaultValue] = _data.split("||");
  //     _filterProject = {
  //       value: value,
  //       display: display,
  //     };
  //     return _filterProject;
  //   });
  //   setItemsStatus(resultCard);
  // }
  function globalFilterInput(_data: any) {
    if (!filter) {
      return _data;
    }
    const result: any[] = [];
    endpoint.map((_endpoint: any) => {
      const res = _data.filter((item: any) => {
        return item[_endpoint]
          .toString()
          .toLowerCase()
          .includes(filter.toLowerCase());
      });
      if (res.length >= 1) {
        result.push(...res);
      }
    });
    return result;
  }
  async function advancedSearch(_data: any) {
    setOnLoading(true);
    if (filterAttribute?.items[0]?.value?.length === 0) {
      return _data;
    } else if (filterAttribute?.items[0]?.value?.length !== 0) {
      const result: any[] = [];
      let _isHasStatus: boolean = false;
      filterAttribute.items.map((_dropdown: any, index: number) => {
        if (_dropdown.value.length === 0) {
          return;
        }
        var _fieldText: any = null;
        var _fieldTextFrom: any = null;
        var _fieldTextTo: any = null;
        var _fieldType: any = "t";
        var _filterParameter: string = "";
        if (_dropdown.dropdown.type === "status") {
          _isHasStatus = true;
          _filterParameter = "Equals";
        }
        if (_dropdown.dropdown.type === "name") {
          _fieldText = selectedEmployee;
          _filterParameter = "Equals";
        } else if (_dropdown.dropdown.type === "status") {
          _filterParameter = "Equals";
          let statusValue: any = "";
          _dropdown.value[0].map((_data: any) => (
            <>
              {_dropdown.value[0]?.length > 1
                ? _dropdown.value[0]?.slice(-1)[0] == _data
                  ? `${(statusValue = statusValue + _data)}`
                  : `${(statusValue = statusValue + _data + ";|;")}`
                : (statusValue = statusValue + _data)}
            </>
          ));
          _fieldText = statusValue;
        } else if (_dropdown.dropdown.type === "date") {
          _filterParameter = "Equals";
          _fieldText = null;
          _fieldTextFrom = moment(_dropdown?.value[0]).format("DD/MM/yyyy");
          _fieldTextTo = moment(_dropdown?.value[1]).format("DD/MM/yyyy");
          _fieldType = "d";
        } else {
          _fieldText = _dropdown?.value[0];
          _filterParameter = "Like";
        }
        result.push({
          ID: 0,
          FieldCode: _dropdown?.dropdown?.name,
          FieldDisplay: _dropdown?.dropdown?.name,
          IsExcludeBlankData: true,
          FieldType: _fieldType,
          IsEquals: false,
          FieldText: _fieldText,
          FieldTextFrom: _fieldTextFrom,
          FieldTextTo: _fieldTextTo,
          FieldBit: null,
          FieldTypeFilterStatic: null,
          FieldTypeFilterDynamic: _fieldType,
          IsTodayFrom: false,
          IsTodayTo: false,
          FilterParameter: _filterParameter,
          indexHideColumn: null,
          userPrincipalName: null,
          connectionString: "",
          SecretId: null,
        });
      });

      var dd = await FilterAdvanceSearch({
        FavoritesItem: JSON.stringify(result),
      });
      var responeTest = await MapDataEndpoint(dd);
      return responeTest;
    }
  }

  useEffect(() => {
    async function fetchMyAPI() {
      if (!onLoading && !isFetchData) {
        let filteredData = await advancedSearch(data);
        filteredData = globalFilterInput(filteredData);
        var respone = await MapGroupData(filteredData, filterGroupBy);
        setDashboard(respone);
        setOnLoading(false);
        setIsFetchData(false);
      }
    }
    fetchMyAPI();
  }, [selectedFilter, filterGroupBy, keyEnter]);
  function handleKeyFilter(event: any) {
    setTimeout("1000");
    if (event.key === "Enter") {
      setFilter(ref.current?.value);
      setKeyEnter(!keyEnter);
      setIsFetchData(false);
    }
  }

  function getHeader() {
    return (
      <div className="set-css-filter-dashboard">
        <div className="set-css-filter-layout-display-flex">
          <div className="">
            <div className="p-input-icon-left">
              <div className="p-inputgroup">
                {/* <InputText
                  onChange={async (e: any) => {
                    setFilter(e.target.value);
                    // if (!e.target.value) {
                    //   let filteredData = globalFilterInput(data);
                    //   var respone = await MapGroupData(
                    //     filteredData,
                    //     filterGroupBy
                    //   );
                    //   setDashboard(respone);
                    // }
                  }}
                  className="set-input-global-dashboard"
                  placeholder="Global Search"
                  onKeyPress={handleKeyFilter}
                  ref={ref}
                /> */}
                {/* <Button
                  icon="pi pi-search"
                  className="set-css-button-view-dashboard-global"
                  onClick={() => {
                    setKeyEnter(!keyEnter);
                    setIsFetchData(false);
                  }}
                /> */}
              </div>
            </div>
          </div>
          <div
            className="set-padding-layout-css-filter"
            style={{ width: "100%" }}
          >
            <div
              onClick={(e: any) => {
                op?.current?.toggle(e, null);
                setOnClickFilter(true);
              }}
              aria-haspopup
              aria-controls="overlay_panel"
              className={`set-css-card-filter-adv set-border-css-filter ${
                onClickFilter ? "activeFilter" : ""
              }`}
            >
              <div className="set-css-layout-filter-3">
                <div>
                  <FiFilter style={{ fontSize: "19px" }} />
                </div>
                <div> Filter</div>
                <div className="set-css-display-flex-dashboard">
                  <BsChevronDown style={{ fontSize: "14px" }} />
                </div>
              </div>
            </div>
            {/* <RiFilterOffLine style={{ fontSize: "25px", cursor: "pointer" }} /> */}
          </div>
        </div>
        {(onSelectView === "1" || onSelectView === "3") && (
          <div className="set-css-filter-header">
            <div className="set-css-group-by-db-header">group by</div>
            <div className="">
              <Dropdown
                value={filterGroupBy}
                options={dataFilterGroupBy}
                onChange={(e: any) => {
                  setFilterGroupBy(e.value);
                  setIsFetchData(false);
                }}
                className="with-height-css-dd-calendar set-text-css-dashboard"
                optionLabel="display"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  const handleScroll = (e: any) => {
    setIsOpenDateFilter(false);
  };

  const OverlayPanelTemplate = () => {
    return (
      <div>
        <div className="card">
          <OverlayPanel
            ref={op}
            id="overlay_panel"
            onHide={() => {
              setOnClickFilter(false);
              op?.current?.hide();
            }}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "450px" }}
            className="overlaypanel-demo overlay-layout-show-css set-css-border-card-filter"
          >
            <div className="set-css-display-space-between-dashboard">
              <div className="set-css-display-hd-filter-db-1">
                Advanced filters
              </div>
              <div
                className="set-css-pointer-db set-css-display-hd-filter-db-2"
                onClick={() => {
                  let _data: any = [];
                  _data.push(itemFilter);
                  setFilterAttribute((prevState: any) => ({
                    ...prevState,
                    items: [..._data],
                  }));
                  // ref.current.value = "";
                  setKeyEnter(!keyEnter);
                  setFilter("");
                  op?.current?.hide();
                }}
              >
                Clear all
              </div>
            </div>
            <div className="set-row-gap-css-dash-board-sc">
              {filterAttribute.items.map((_items: any, idx: any) => (
                <>
                  <div className="row" onClick={() => {}}>
                    {filterAttribute && dataAdvancedFilterList && (
                      <div className="col-5">
                        <Dropdown
                          style={{ borderRadius: "6px" }}
                          value={filterAttribute.items[idx]?.dropdown}
                          options={dataAdvancedFilterList[idx]}
                          onChange={(e: any) => {
                            setTimeout(timeoutHandler, 10000);
                            setFilterAttribute((prevState: any) => ({
                              ...prevState,
                              items: filterAttribute.items.map(
                                (_val: any, _idx: any) => {
                                  return _idx === idx
                                    ? {
                                        dropdown: e.value,
                                        value: [],
                                      }
                                    : _val;
                                }
                              ),
                            }));
                          }}
                          className="set-layout-dd-filter-dashboard"
                          optionLabel="display"
                          placeholder="--Please Select--"
                        />
                      </div>
                    )}

                    <div className="col-6">
                      {filterAttribute?.items[idx]?.dropdown?.type ===
                        "status" && (
                        <MultiSelect
                          style={{ borderRadius: "6px" }}
                          display="chip"
                          optionLabel={"display"}
                          value={filterAttribute?.items[idx]?.value[0]}
                          options={ItemsStatus}
                          onChange={(e: any) => {
                            setTimeout(timeoutHandler, 10000);
                            setSelectedStatus(e.value);
                            setFilterAttribute((prevState: any) => ({
                              ...prevState,
                              items: filterAttribute.items.map(
                                (_val: any, _idx: any) => {
                                  return _idx === idx
                                    ? {
                                        dropdown: _val.dropdown,
                                        value: [e.value],
                                      }
                                    : _val;
                                }
                              ),
                            }));
                          }}
                          placeholder="Select Status"
                          filter
                          className="set-layout-dd-filter-dashboard width-100-multi-select"
                        />
                      )}
                      {(filterAttribute?.items[idx]?.dropdown?.type ===
                        "string" ||
                        filterAttribute?.items[idx]?.dropdown.length === 0) && (
                        <InputText
                          type="search"
                          style={{ borderRadius: "6px" }}
                          ref={ref2}
                          value={filterAttribute?.items[idx]?.value[0]}
                          className="set-with-100-dash-board-css"
                          onChange={(e: any) => {
                            setTimeout(timeoutHandler, 10000);
                            setFilterAttribute((prevState: any) => ({
                              ...prevState,
                              items: filterAttribute.items.map(
                                (_val: any, _idx: any) => {
                                  return _idx === idx
                                    ? {
                                        dropdown: _val.dropdown,
                                        value: [e.target.value],
                                      }
                                    : _val;
                                }
                              ),
                            }));
                          }}
                          placeholder="Value"
                        />
                      )}
                      {filterAttribute?.items[idx]?.dropdown?.type ===
                        "date" && (
                        <div
                          className="filter-select-container"
                          style={{ paddingLeft: "0", width: "100%" }}
                        >
                          <BsCalendarDate className="set-filter-select-container-date-icon-dashboard-css" />
                          <RangePicker
                            open={isOpenDateFilter}
                            onOpenChange={(e: any) => setIsOpenDateFilter(e)}
                            className={"custom-date"}
                            value={dates}
                            suffixIcon={null}
                            style={{ height: "38px" }}
                            separator={<GrFormNextLink />}
                            onCalendarChange={(val) => {
                              setDates(val);
                            }}
                            onChange={(e: any) => {
                              setFilterAttribute((prevState: any) => ({
                                ...prevState,
                                items: filterAttribute.items.map(
                                  (_val: any, _idx: any) => {
                                    return _idx === idx
                                      ? {
                                          dropdown: _val.dropdown,
                                          value: e,
                                        }
                                      : _val;
                                  }
                                ),
                              }));
                            }}
                            ranges={{
                              Today: [moment(), moment()],
                              "This Month": [
                                moment().startOf("month"),
                                moment().endOf("month"),
                              ],
                              "This Year": [
                                moment().startOf("year"),
                                moment().endOf("year"),
                              ],
                            }}
                          />
                        </div>
                      )}
                      {filterAttribute?.items[idx]?.dropdown?.type ===
                        "name" && (
                        <MultiSelect
                          className="width-100-multi-select"
                          optionLabel={
                            userData.Lang === "EN" ? "NameEn" : "NameTh"
                          }
                          display="chip"
                          value={filterAttribute?.items[idx]?.value[0]}
                          options={employeeList}
                          placeholder="Select Employee"
                          filter
                          onChange={(e: any) => {
                            setTimeout(timeoutHandler, 10000);
                            let nameValue: any = "";
                            e.value?.map((_data: any) => {
                              var _dataByLang: any;
                              if (userData.Lang === "EN") {
                                _dataByLang = _data.NameEn;
                              } else {
                                _dataByLang = _data.NameTh;
                              }
                              <>
                                {e.value?.length > 1
                                  ? e.value?.slice(-1)[0] == _dataByLang
                                    ? `${(nameValue = nameValue + _dataByLang)}`
                                    : `${(nameValue =
                                        nameValue + _dataByLang + ";|;")}`
                                  : (nameValue = nameValue + _dataByLang)}
                              </>;
                            });
                            setSelectedEmployee(nameValue);
                            setFilterAttribute((prevState: any) => ({
                              ...prevState,
                              items: filterAttribute.items.map(
                                (_val: any, _idx: any) => {
                                  return _idx === idx
                                    ? {
                                        dropdown: _val.dropdown,
                                        value: [e.value],
                                      }
                                    : _val;
                                }
                              ),
                            }));
                          }}
                        />
                      )}
                      {/* {filterAttribute?.items[idx]?.dropdown?.type ===
                        "project" && (
                        <MultiSelect
                          style={{ borderRadius: "6px" }}
                          display="chip"
                          optionLabel={"display"}
                          value={filterAttribute?.items[idx]?.value[0]}
                          options={project}
                          onChange={(e: any) => {
                            setTimeout(timeoutHandler, 10000);
                            setSelectedStatus(e.value);
                            setFilterAttribute((prevState: any) => ({
                              ...prevState,
                              items: filterAttribute.items.map(
                                (_val: any, _idx: any) => {
                                  return _idx === idx
                                    ? {
                                        dropdown: _val.dropdown,
                                        value: [e.value],
                                      }
                                    : _val;
                                }
                              ),
                            }));
                          }}
                          placeholder="Select Project"
                          filter
                          className="set-layout-dd-filter-dashboard width-100-multi-select"
                        />
                      )} */}
                    </div>

                    {idx !== 0 && (
                      <div className="col-1 set-icon-delete-column-select-hover">
                        <AiOutlineClose
                          className="set-icon-delete-column-select set-hover-dashboard-in-close"
                          onClick={() => {
                            let _data = filterAttribute.items;
                            _data.splice(idx, 1);
                            setFilterAttribute((prevState: any) => ({
                              ...prevState,
                              items: [..._data],
                            }));
                          }}
                        />
                      </div>
                    )}
                  </div>
                </>
              ))}
            </div>
            <div className="set-css-display-space-between-dashboard">
              {filterAttribute?.items.length < dataAdvancedFilter?.length ? (
                <div
                  className="set-css-display-hd-filter-db-3"
                  onClick={() => {
                    let _data = filterAttribute.items;
                    _data.push(itemFilter);
                    setFilterAttribute((prevState: any) => ({
                      ...prevState,
                      items: [..._data],
                    }));
                  }}
                >
                  + Add new filter
                </div>
              ) : (
                <div className="set-css-display-hd-filter-db-4"></div>
              )}
              <div className="set-css-db-apply-filter">
                <Button
                  className="set-css-dash-board-button-filter set-button-css-layout-db p-button-outlined set-css-dash-board-button-hover-2"
                  type="button"
                  label="Search"
                  onClick={(e: any) => {
                    setOnClickFilter(false);
                    op?.current?.hide();
                    setKeyEnter(!keyEnter);
                    setIsFetchData(false);
                  }}
                />
              </div>
            </div>

            {/* <div className="row">
              <div className="col-12 set-css-db-apply-filter"></div>
            </div> */}
          </OverlayPanel>
        </div>
      </div>
    );
  };
  return (
    <>
      {OverlayPanelTemplate()}
      <div className="main-container">
        <div className="worklist-container">
          <div className="header-container">
            <div className="route-text-container set-css-button-and-title">
              <span className="route-text">
                Dashboard {">"} Project Tracker
              </span>
              <span className="set-css-button-view-dashboard">
                <div
                  className={`${
                    onSelectView === "1"
                      ? "set-selected-in-current-view-dashboard set-margin-css-button-dashboard set-button-css-hover-dashboard"
                      : "set-margin-css-button-dashboard set-button-css-hover-dashboard"
                  }`}
                  onClick={() => {
                    onSetSelectView("1");
                  }}
                >
                  <BsLayoutThreeColumns style={{ fontSize: "19px" }} />
                </div>
                <div
                  className={`${
                    onSelectView === "2"
                      ? "set-selected-in-current-view-dashboard set-margin-css-button-dashboard set-button-css-hover-dashboard"
                      : "set-margin-css-button-dashboard set-button-css-hover-dashboard"
                  }`}
                  onClick={() => {
                    onSetSelectView("2");
                  }}
                >
                  <IoCalendarOutline style={{ fontSize: "24px" }} />
                </div>
                <div
                  className={`${
                    onSelectView === "3"
                      ? "set-selected-in-current-view-dashboard set-margin-css-button-dashboard set-button-css-hover-dashboard"
                      : "set-margin-css-button-dashboard set-button-css-hover-dashboard"
                  }`}
                  onClick={() => {
                    onSetSelectView("3");
                  }}
                >
                  <BsCalendarRange style={{ fontSize: "22px" }} />
                </div>
              </span>
            </div>
          </div>
          <div className="set-margin-css-dashboard">{getHeader()}</div>
          {onLoading ? (
            <div className="logo-loading cursor-loading">
              <img src={props.responeConfig?.pathLoading} alt="loading..." />
            </div>
          ) : (
            <div className="content">
              <div className="worklist-items-container">
                <div
                  className="set-css-container-dashboard"
                  style={{
                    overflowY: `${onSelectView === "1" ? "hidden" : "auto"}`,
                  }}
                >
                  {onSelectView === "1" && (
                    <DashboardCard
                      dashboard={dashboard}
                      statusCard={statusCard}
                      onLoading={onLoading}
                      endpoint={endpoint}
                    />
                  )}
                  {statusCard !== undefined &&
                    onSelectView === "2" &&
                    dashboard && (
                      <DashboardCalendar
                        dashboard={dashboard}
                        statusCard={statusCard}
                        onLoading={onLoading}
                        setValueDropdownInCalendar={setValueDropdownInCalendar}
                        valueDropdownInCalendar={valueDropdownInCalendar}
                        endpoint={endpoint}
                        responeConfig={responeConfig}
                      />
                    )}
                  {onSelectView === "3" && dashboard && (
                    <DashboardTimeline
                      dashboard={dashboard}
                      onLoading={onLoading}
                      statusCard={statusCard}
                      endpoint={endpoint}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )
    </>
  );
};
export default withPerMission(DashboardScreen);
