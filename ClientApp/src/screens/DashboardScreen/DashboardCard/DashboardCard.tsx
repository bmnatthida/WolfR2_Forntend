import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { RiDatabase2Line } from "react-icons/ri";
import { useHistory } from "react-router";
interface Props {
  dashboard: any;
  statusCard: any;
  onLoading: any;
  endpoint: any;
}

export const DashboardCard = (props: Props) => {
  const history = useHistory();
  useEffect(() => {
    console.log(props.dashboard, "props.dashboard");
  }, []);

  const MapDataFromEndpoint = (_item: any) => {
    let result: any = [];
    for (let index = 3; index < props.endpoint.length; index++) {
      result.push(props.endpoint[index]);
    }
    return (
      <>
        {result.map((data: any) => {
          return (
            <>
              <div className="row">
                <div className="col-md-12">
                  <span className="set-font-css-text-in-card">
                    {TextAbstract(_item[data], 50)}
                  </span>
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };
  function TextAbstract(text: any, length: any) {
    if (text == null) {
      return "";
    }
    if (text.length <= length) {
      return text;
    }
    text = text.substring(0, length);
    var last = text.lastIndexOf(" ");
    text = text.substring(0, last);
    return text + "...";
  }
  return (
    <>
      <div className="set-css-card-dash-board">
        {props.dashboard?.length >= 1 ? (
          <>
            {props.dashboard?.map((_data: any, i: number) => {
              return (
                <div className="set-layout-css-flex">
                  <div className="set-bg-css-dash-board set-font-size-header-dashboard ">
                    {TextAbstract(_data.headData, 80)}
                  </div>
                  <div className="set-card-list-calendar set-min-width-dash">
                    {_data.items?.map((_item: any, j: number) => {
                      let colorValue = "";
                      let nameValue = "";
                      props.statusCard.map((_color: any) => {
                        const [status, color, name] = _color.split("||");
                        if (_item.Memo_StatusName === name) {
                          colorValue = color;
                        }
                      });

                      return (
                        <div
                          key={_item.Memo_MemoId}
                          className="set-css-in-card-list set-cursor-pointer-css"
                          onClick={() => {
                            window.open(
                              `/Request?MemoID=${_item[props.endpoint[0]]}`,
                              "_blank",
                              "noreferrer"
                            );
                          }}
                        >
                          <div className="row">
                            <div className="col-md-6">
                              <span className="set-font-css-text-in-card set-underline">
                                {_item[props.endpoint[1]]}
                              </span>
                            </div>

                            <div
                              className="col-md-5 set-css-card-like-a-button"
                              style={{ background: colorValue }}
                            >
                              <span className="set-font-css-dash-board">
                                {_item[props.endpoint[2]]}
                              </span>
                            </div>
                          </div>
                          {MapDataFromEndpoint(_item)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
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
      </div>
    </>
  );
};
