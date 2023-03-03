import React from "react";
import { AiOutlineApartment } from "react-icons/ai";
import { BsCalendar4, BsNewspaper, BsPerson } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";

import { IoAlertCircleOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Button } from "../../../components/Button/Button";

interface Props {
  curPage: any;
  onSelectView: (text: string) => void;
}

export const SimLineSideBar = (props: Props) => {
  const SideBarData = [
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Initial"}
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
          title={"Result"}
          icon={<BsNewspaper />}
          page={2}
          curPage={props.curPage}
        />
      ),
    },
  ];

  return (
    <div className="Sidebar">
      {SideBarData.map((data, idx) => (
        <div key={idx}>{data.component}</div>
      ))}
    </div>
  );
};
