import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { TreeSelectNewRequest } from "../../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { SimLineSideBar } from "./SimLineSideBar";
import { InitialComponent } from "./InitialComponent/InitialComponent";
import { ResultComponent } from "./ResultComponent/ResultComponent";
import { Button } from "antd";
import { IoMenu } from "react-icons/io5";
import withPerMission from "../../../components/HOC/withPermission";
interface Props {
  responeConfig: any;
}

const SimLineApproveScreen = (props: Props) => {
  const [selectView, setSelectView] = useState<string>("1");
  const [sidebarState, setSidebarState] = useState<boolean>(true);
  const toast = useRef<any>(null);
  const [onLoading, setOnLoading] = useState(false);

  const toggleSideBar = () => {
    if (sidebarState) {
      setSidebarState(false);
    } else {
      setSidebarState(true);
    }
  };

  return (
    <div className="main-container">
      <Toast ref={toast} />
      {onLoading && (
        <div className="logo-loading">
          <img src={props.responeConfig?.pathLoading} alt="loading..." />
        </div>
      )}
      <div className="worklist-container">
        <div className="header-container">
          <div className="button-container">
            <Button
              type="text"
              icon={<IoMenu size={28} />}
              size="large"
              onClick={() => toggleSideBar()}
              style={{ background: "transparent " }}
            />
            <TreeSelectNewRequest />
          </div>
          <div className="route-text-container">
            <p className="route-text">Approval Matrix Simulator</p>
            <div className="button-delegate-container"></div>
          </div>
        </div>
        <div className="content">
          <div className="worklist-items-container">
            {sidebarState && (
              <div className="desktop">
                <div className="content filter-content">
                  <div className="worklist-filter-container">
                    <SimLineSideBar
                      onSelectView={(e) => {
                        setSelectView(e);
                      }}
                      curPage={selectView}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="request-container-item">
              {selectView === "1" && <InitialComponent />}
              {selectView === "2" && <ResultComponent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withPerMission(SimLineApproveScreen);
