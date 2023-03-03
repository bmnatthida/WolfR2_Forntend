import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { AiOutlineApartment, AiOutlineHistory } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { useTranslation } from "react-i18next";
interface Props {
  curPage: any;
  onSelectView: (text: string) => void;
  workList?: any;
}
const RequestSideBarElement = (props: Props) => {
  const [sidebar, setSidebar] = useState<any[]>([]);
  const [sidebarM, setSidebarM] = useState<any[]>([]);
  const { t } = useTranslation(["translation"]);
  useEffect(() => {
    const SideBarData = [
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            title={t("Requestor")}
            icon={<BsPerson />}
            page={1}
            curPage={props.curPage}
          />
        ),
      },
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            title={t("information")}
            icon={<IoNewspaperOutline />}
            page={2}
            curPage={props.curPage}
          />
        ),
      },
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            title={t("lineApprovals")}
            icon={<AiOutlineApartment />}
            page={3}
            curPage={props.curPage}
          />
        ),
      },
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            title={t("attachment")}
            icon={<ImAttachment />}
            page={4}
            curPage={props.curPage}
          />
        ),
      },
    ];

    const SideBarDataResponsive = [
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            icon={<BsPerson />}
            page={1}
            title={""}
            curPage={props.curPage}
          />
        ),
      },
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            icon={<IoNewspaperOutline />}
            title={""}
            page={2}
            curPage={props.curPage}
          />
        ),
      },
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            icon={<AiOutlineApartment />}
            page={3}
            title={""}
            curPage={props.curPage}
          />
        ),
      },
      {
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            icon={<ImAttachment />}
            page={4}
            title={""}
            curPage={props.curPage}
          />
        ),
      },
    ];
    if (props.workList !== undefined && props.workList !== 0) {
      SideBarData.push({
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            title={t("history")}
            icon={<AiOutlineHistory />}
            page={5}
            curPage={props.curPage}
          />
        ),
      });
      SideBarDataResponsive.push({
        component: (
          <Button
            onSelectView={(e) => props.onSelectView(e)}
            icon={<AiOutlineHistory />}
            page={5}
            curPage={props.curPage}
            title={""}
          />
        ),
      });
    }
    setSidebar([...SideBarData]);
    setSidebarM([...SideBarDataResponsive]);
  }, [props.workList, props.curPage, t]);

  return (
    <>
      <div className="Sidebar RequestSideBarElement-display-none">
        {sidebar.map((data, idx) => (
          <div key={idx}>{data.component}</div>
        ))}
      </div>
      <div className="Sidebar RequestSideBarElement-display-inline">
        {sidebarM.map((data, idx) => (
          <div key={idx} style={{ padding: " 0 10px 0px 0px" }}>
            {data.component}
          </div>
        ))}
      </div>
    </>
  );
};

export default RequestSideBarElement;
