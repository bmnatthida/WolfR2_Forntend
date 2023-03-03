import moment from "moment";
import React, { useEffect, useState } from "react";
import "./DashboardTimeline.css";
import Timeline, {
  DateHeader,
  SidebarHeader,
  TimelineHeaders,
} from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import { RiDatabase2Line } from "react-icons/ri";
type Props = { dashboard: any; onLoading: any; statusCard: any; endpoint: any };

export const DashboardTimeline = (props: Props) => {
  const [dataTimeline, setDataTimeline] = useState<any>();
  const [dataGroups, setDataGroups] = useState<any>();
  var getUrl = window.location;
  var baseUrl = getUrl.protocol + "//" + getUrl.host;
  useEffect(() => {
    mapData();
  }, [props.dashboard]);

  async function mapData() {
    if (props.dashboard) {
      var array: any[] = [];
      var array2: any[] = [];
      console.log(props.dashboard, "props.statusCard");
      props.dashboard.map((_data: any, index: number) => {
        array2.push({
          id: index,
          title: _data["headData"],
          rightTitle: _data["headData"],
        });
        _data.items.map((_data2: any, index2: number) => {
          let colorValue = "";
          props.statusCard.map((_color: any) => {
            const [status, color, name] = _color.split("||");
            if (_data2[props.endpoint[2]] === name) {
              colorValue = color;
            }
          });

          array.push({
            id: _data2[props.endpoint[0]] + "",
            group: index + "",
            title: _data2[props.endpoint[3]],
            start: moment(
              new Date(
                moment(
                  moment(_data2[props.endpoint[5]], "DD MMMM yyyy")
                ).format("yyyy/MM/DD")
              )
            ),
            end: moment(
              new Date(
                moment(
                  moment(_data2[props.endpoint[5]], "DD MMMM yyyy").add(
                    1,
                    "days"
                  )
                ).format("yyyy/MM/DD")
              )
            ),
            bgColor: "rgba(225, 166, 244, 0.6)",
            itemProps: {
              "data-tip": _data2["Memo_MemoSubject"],
              onDoubleClick: () => {
                window.open(
                  `${baseUrl}/Request?MemoID=${_data2["Memo_MemoId"]}`,
                  "_blank",
                  "noreferrer"
                );
              },
              style: {
                background: colorValue,
              },
            },
          });
        });
      });
      console.log(array, "array");
      console.log(array2, "array2");
      setDataTimeline([...array]);
      setDataGroups([...array2]);
    } else {
    }
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

  function renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section set-layout-header-calendar">
          <div className="set-instructions-css-padding-flex">
            <>{renderStatusView()}</>
          </div>
        </div>
      </div>
    );
  }
  var keys = {
    groupIdKey: "id",
    groupTitleKey: "title",
    groupRightTitleKey: "rightTitle",
    itemIdKey: "id",
    itemTitleKey: "title",
    itemDivTitleKey: "title",
    itemGroupKey: "group",
    itemTimeStartKey: "start",
    itemTimeEndKey: "end",
    groupLabelKey: "title",
  };

  return (
    <div
      onClick={() => {
        console.log(dataTimeline);
        console.log(dataGroups);
      }}
    >
      {dataTimeline && dataGroups && props.onLoading == false && (
        <>
          {renderSidebar()}
          {props.dashboard.length !== 0 ? (
            <Timeline
              keys={keys}
              groups={dataGroups}
              items={dataTimeline}
              defaultTimeStart={moment().add(-12, "day")}
              defaultTimeEnd={moment().add(12, "day")}
              itemHeightRatio={0.75}
              canMove={false}
              canResize={false}
              stackItems
            >
              <TimelineHeaders className="sticky">
                <SidebarHeader>
                  {({ getRootProps }) => {
                    return (
                      <div className="set-body-in-calendar" {...getRootProps()}>
                        Group By
                      </div>
                    );
                  }}
                </SidebarHeader>
                <DateHeader unit="primaryHeader" />
                <DateHeader />
              </TimelineHeaders>
            </Timeline>
          ) : (
            <>
              {props.onLoading === false && (
                <div className="set-layout-no-data">
                  <div className="set-layout-icon-no-data-1">
                    <div className="set-layout-icon-no-data-2">
                      <RiDatabase2Line style={{ fontSize: "50px" }} />
                    </div>
                    <label className="set-font-size-no-data-card">
                      No Data Available
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
