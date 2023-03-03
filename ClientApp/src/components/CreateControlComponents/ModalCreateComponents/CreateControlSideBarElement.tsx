import React, { useEffect } from "react";
import { Button } from "../../../components/Button/Button";
import { FaHeading, FaRegImage, FaRegListAlt } from "react-icons/fa";
import { BiText, BiTimeFive } from "react-icons/bi";
import { ImTextHeight } from "react-icons/im";
import { AiOutlineNumber } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { IoMdRadioButtonOn } from "react-icons/io";
import { MdOutlineCheckBox } from "react-icons/md";
import { CgPlayButtonO } from "react-icons/cg";
import {
  BsFileEarmarkRichtext,
  BsSortNumericDown,
  BsTable,
} from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";

interface Props {
  curPage: any;
  onSelectView: (text: string) => void;
  layoutLength?: any;
  renderIn?: string;
}

export default function CreateControlSideBarElement(props: Props) {
  const SideBarData = [
    {
      component: (
        <>
          {props.layoutLength === 1 && (
            <Button
              onSelectView={(e) => props.onSelectView(e)}
              title={"Heading"}
              icon={<FaHeading />}
              page={1}
              curPage={props.curPage}
            />
          )}
        </>
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"ShortText"}
          icon={<BiText />}
          page={2}
          curPage={props.curPage}
        />
      ),
    },

    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"MultiLine"}
          icon={<ImTextHeight />}
          page={3}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Number"}
          icon={<AiOutlineNumber />}
          page={4}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Calendar"}
          icon={<FiCalendar />}
          page={5}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Choice"}
          icon={<IoMdRadioButtonOn />}
          page={6}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"MultiChoice"}
          icon={<MdOutlineCheckBox />}
          page={7}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Dropdown"}
          icon={<FaRegListAlt />}
          page={8}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <>
          {props.layoutLength === 1 && (
            <Button
              onSelectView={(e) => props.onSelectView(e)}
              title={"Table"}
              icon={<BsTable />}
              page={9}
              curPage={props.curPage}
            />
          )}
        </>
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"RichText"}
          icon={<BsFileEarmarkRichtext />}
          page={10}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Attachment"}
          icon={<GrAttachment />}
          page={11}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Image"}
          icon={<FaRegImage />}
          page={12}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <>
          {props.layoutLength === 2 && (
            <Button
              onSelectView={(e) => props.onSelectView(e)}
              title={"Button"}
              icon={<CgPlayButtonO />}
              page={13}
              curPage={props.curPage}
            />
          )}
        </>
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Auto Number"}
          icon={<BsSortNumericDown />}
          page={14}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Revision"}
          icon={<BiTimeFive />}
          page={15}
          curPage={props.curPage}
        />
      ),
    },
  ];

  const SideBarDataInColumn = [
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"ShortText"}
          icon={<BiText />}
          page={1}
          curPage={props.curPage}
        />
      ),
    },

    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"MultiLine"}
          icon={<ImTextHeight />}
          page={2}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Number"}
          icon={<AiOutlineNumber />}
          page={3}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Calendar"}
          icon={<FiCalendar />}
          page={4}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Choice"}
          icon={<IoMdRadioButtonOn />}
          page={5}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"MultiChoice"}
          icon={<MdOutlineCheckBox />}
          page={6}
          curPage={props.curPage}
        />
      ),
    },
    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Dropdown"}
          icon={<FaRegListAlt />}
          page={7}
          curPage={props.curPage}
        />
      ),
    },

    {
      component: (
        <Button
          onSelectView={(e) => props.onSelectView(e)}
          title={"Attachment"}
          icon={<GrAttachment />}
          page={8}
          curPage={props.curPage}
        />
      ),
    },
  ];
  return (
    <>
      {props.renderIn === "control" && (
        <div
          className="Sidebar"
          style={{
            overflowY: "scroll",
            overflowX: "hidden",
            height: "39.938rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "0.625rem",
          }}
          onClick={() => {
            console.log(SideBarData, "SideBarData");
          }}
        >
          {SideBarData.map((data, idx) => {
            if (
              data?.component?.props?.title ||
              data?.component?.props?.children?.props?.title
            ) {
              return (
                <>
                  <div key={idx}>{data.component}</div>
                </>
              );
            }
          })}
        </div>
      )}
      {props.renderIn === "column" && (
        <div
          className="Sidebar"
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "0.625rem",
          }}
        >
          {SideBarDataInColumn.map((data, idx) => {
            if (
              data?.component?.props?.title ||
              data?.component?.props?.children?.props?.title
            ) {
              return (
                <>
                  <div key={idx}>{data.component}</div>
                </>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
