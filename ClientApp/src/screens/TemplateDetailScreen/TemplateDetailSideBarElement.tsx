import React, { useEffect } from "react";
import { AiOutlineApartment } from "react-icons/ai";
import { BsCalendar4, BsNewspaper, BsPerson } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import {
  IoDocumentTextOutline,
  IoNewspaperOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { Button } from "../../components/Button/Button";

import { IoAlertCircleOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface Props {
  curPage: any;
  onSelectView: (text: string) => void;
  workList?: any;
  isCopy?: any;
  isVersion?: any;
}

export const TemplateDetailSideBarElement = (props: Props) => {
  useEffect(() => {}, [props.isVersion]);

  const SideBarData = [
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Information"}
          icon={<IoAlertCircleOutline />}
          page={1}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Form Design"}
          icon={<BsNewspaper />}
          page={2}
          curPage={props.curPage}
        />
      ),
    },

    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Reference Document"}
          icon={<IoDocumentTextOutline />}
          page={3}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Approval Matrix"}
          icon={<IoMdCheckmarkCircleOutline />}
          page={4}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Authorization"}
          icon={<IoShieldCheckmarkOutline />}
          page={5}
          curPage={props.curPage}
        />
      ),
    },

    {
      component: !props.isCopy && props.isVersion === true && (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Version and History"}
          icon={<IoShieldCheckmarkOutline />}
          page={6}
          curPage={props.curPage}
        />
      ),
    },
  ];

  return (
    <div
      className="Sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "0.625rem",
        width: "100%",
      }}
    >
      {SideBarData.map((data, idx) => (
        <div key={idx}>{data.component}</div>
      ))}
    </div>
  );
};
