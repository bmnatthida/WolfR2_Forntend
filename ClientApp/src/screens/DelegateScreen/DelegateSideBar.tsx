import React from "react";
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
}

export const DelegateSideBar = (props: Props) => {
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
          title={"Apply to Form"}
          icon={<BsNewspaper />}
          page={2}
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
      }}
    >
      {SideBarData.map((data, idx) => (
        <div key={idx}>{data.component}</div>
      ))}
    </div>
  );
};
