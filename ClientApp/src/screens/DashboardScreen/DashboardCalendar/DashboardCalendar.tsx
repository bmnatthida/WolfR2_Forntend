import FullCalendar, { EventContentArg } from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { MultiSelect } from "primereact/multiselect";
import { GetDashboardFilterStatus } from "../../../Services/ConfigurationService";
interface Props {
  dashboard: any;
  statusCard: any;
  onLoading: any;
  setValueDropdownInCalendar: any;
  valueDropdownInCalendar: any;
  endpoint: any;
  responeConfig: any;
}

export const DashboardCalendar = (props: Props) => {
  const [dataCalendar, setDataCalendar] = useState<any>();
  const [defaultValueDashboard, setDefaultValueDashboard] = useState<any>();
  const [onLoading, setOnLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log(props.dashboard, "props.dashboard");
    if (props.dashboard !== undefined) {
      // mapDataDropDown();
      mapData();
    }
  }, [props.dashboard]);
  async function mapData() {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host;
    const array: any[] = [];
    props.dashboard.map((_data: any, index: number) => {
      _data.items.map((_data2: any, index2: number) => {
        let colorValue = "";
        props.statusCard.map((_color: any) => {
          const [status, color, name] = _color.split("||");
          if (_data2[props.endpoint[2]] === name) {
            colorValue = color;
          }
        });
        array.push({
          id: _data2[props.endpoint[0]],
          status: _data2[props.endpoint[2]],
          title: _data2[props.endpoint[3]],
          date: new Date(
            moment(moment(_data2[props.endpoint[5]], "DD MMMM yyyy")).format(
              "yyyy/MM/DD"
            )
          ),
          url: `${baseUrl}/Request?MemoID=${_data2["Memo_MemoId"]}`,
          allDay: true,
          color: colorValue,
        });
      });
    });
    setDataCalendar([...array]);
    setDefaultValueDashboard([...array]);
    setOnLoading(false);
  }
  const renderStatusView = () => {
    let ss: any = props.statusCard;
    let dd: any = [];
    for (let i = 0; i < ss.length; i++) {
      const _status = ss[i];
      const [status, color, displayName] = _status.split("||");
      console.log('_status.split("||")', ss.length);

      for (let j = i + 1; j < ss.length; j++) {
        const element = ss[j];
        const [status2, color2, displayName2] = element.split("||");
        if (displayName === displayName2) {
          console.log("ssssss : ", j, element, ",", _status, ": ", i);
          dd.push(j);
        }
      }
    }
    var tt = props.statusCard;
    let _dd = [...new Set(dd)];

    let zz = [];
    let isHas = false;
    for (let i = 0; i < tt.length; i++) {
      const aa = tt[i];
      for (let j = 0; j < _dd.length; j++) {
        const element = _dd[j];
        if (i === element) {
          isHas = true;
          console.log("aaaaaaaaaaaaaaa", aa);
        }
      }
      if (!isHas) {
        zz.push(aa);
      }
      isHas = false;
    }

    console.log("ssssss", zz, ",", [...new Set(dd)]);
    console.log("ssssss", zz);
    let zz15: any = [];
    const l2 = zz.map((_color: any) => {
      const [status, color, displayName, priority] = _color.split("||");
      zz15.push({
        displayName: displayName,
        color: color,
        priority: priority,
      });
    });
    var dd321 = zz15.sort((a: any, b: any) => {
      return a.priority - b.priority;
    });
    const l = dd321.map((_data: any) => {
      return (
        <>
          <label
            className="with-css-instructions"
            style={{ backgroundColor: _data.color }}
          ></label>
          <label className="font-css-instructions">{_data.displayName}</label>
        </>
      );
    });

    return l;
  };
  // async function mapDataDropDown() {
  //   var _filter = await GetDashboardFilterStatus();
  //   const arrayDropDown: any[] = [];
  //   const arrayValueDropdown: any[] = [];
  //   _filter.map((_data: any) => {
  //     const [value, name, status] = _data.split("||");
  //     arrayDropDown.push({
  //       value: value,
  //       name: name,
  //     });
  //     if (status) {
  //       arrayValueDropdown.push(value);
  //     }
  //   });
  //   props.setValueDropdownInCalendar([...arrayValueDropdown]);
  //   setOptionDropdown([...arrayDropDown]);
  // }

  // function globalFilterDropDown(_data: any) {
  //   if (props.valueDropdownInCalendar.length === 0) {
  //     return [];
  //   }
  //   const _filtered = _data.filter((item: any) => {
  //     for (let i = 0; i < props.valueDropdownInCalendar.length; i++) {
  //       var _dataSpilt = props.valueDropdownInCalendar[i].split(";|;");
  //       for (let j = 0; j < _dataSpilt.length; j++) {
  //         if (item.status?.includes(_dataSpilt[j])) {
  //           return true;
  //         }
  //       }
  //     }
  //   });
  //   return _filtered;
  // }
  // useEffect(() => {
  //   if (defaultValueDashboard !== undefined) {
  //     let filteredData = globalFilterDropDown(defaultValueDashboard);
  //     setDataCalendar(filteredData);
  //     setOnLoading(false);
  //   }
  // }, [props.valueDropdownInCalendar]);

  function renderSidebar() {
    return (
      <div
        className="demo-app-sidebar"
        onClick={() => {
          console.log(props.valueDropdownInCalendar);
        }}
      >
        <div className="demo-app-sidebar-section set-layout-header-calendar">
          {/* <div>
            {optionDropdown?.length !== 0 && optionDropdown !== undefined && (
              <MultiSelect
                className="with-height-css-dd-calendar"
                value={props.valueDropdownInCalendar}
                options={optionDropdown}
                optionLabel="name"
                onChange={(e: any) => {
                  props.setValueDropdownInCalendar(e.value);
                }}
              />
            )}
          </div> */}
          <div className="set-instructions-css-padding-flex">
            <>{renderStatusView()}</>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      {onLoading || props.dashboard === undefined ? (
        <div className="logo-loading cursor-loading">
          <img src={props.responeConfig?.pathLoading} alt="loading..." />
        </div>
      ) : (
        <div className="demo-app">
          {props.statusCard !== undefined &&
            props.dashboard !== undefined &&
            renderSidebar()}
          <div className="set-height-css-calendar set-header-calendar-view set-header-calendar-view-in-button display-none-in-focus-button demo-app-main">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              eventClick={(info: any) => {
                info.jsEvent.preventDefault();
                if (info.event.url) {
                  window.open(info.event.url, "noreferrer");
                }
              }}
              headerToolbar={{
                left: "prev",
                center: "title",
                right: "next",
              }}
              dayMaxEvents={true}
              // eventContent={renderEventContent}
              events={dataCalendar}
              editable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
