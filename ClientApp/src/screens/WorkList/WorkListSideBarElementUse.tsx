import React, { useEffect } from "react";
import { SelectDate } from "../../components/Select/SelectDate";
import { MultiSelectDropdown } from "../../components/Select/MultiSelectDropdown";
import { Divider } from "antd";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsListTask } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { BiBuildings } from "react-icons/bi";
import { RiNodeTree, RiListCheck2 } from "react-icons/ri";
import { SearchFilterComponent } from "../../components/SearchFilterComponent/SearchFilterComponent";
import { SelectDropdown } from "../../components/Select/SelectDropdown";
import { Moment } from "moment";
import {
  ISearchWorklist,
  WorklistHeaderType,
  WorklistSerachType,
} from "../../IRequestModel/IWorklistModel";
import { useTranslation } from "react-i18next";
interface Props {
  searchObject?: ISearchWorklist;
  onSelectChange: (
    value: string | string[] | [Moment, Moment],
    formSelect: WorklistSerachType,
    _date?: any
  ) => void;
  onSelectTask: (text: WorklistHeaderType) => void;
  formType: any[];
  formStatus: any[];
  allCompany: any[];
  allDepartment: any[];
  defaultTask: string;
}
const WorkListSideBarElementUse = (props: Props) => {
  const { t } = useTranslation(["translation"]);
  const display = [
    {
      value: "To Do List",
      label: t("To Do List"),
    },
    {
      value: "In Process",
      label: t("In Process"),
    },
    {
      value: "Related List",
      label: t("Related List"),
    },
    {
      value: "Completed",
      label: t("Completed"),
    },
    {
      value: "Cancelled",
      label: t("Cancelled"),
    },
    {
      value: "Rejected",
      label: t("Rejected"),
    },
  ];
  return (
    <div className="Sidebar">
      <SearchFilterComponent
        onFilterChange={(e) => props.onSelectChange(e, "keyword")}
        searchKeyword={props.searchObject?.keyword}
      />

      <p style={{ margin: "15px 0 10px", color: "#f8a51c", fontSize: "18px" }}>
        {t("Task")}
      </p>
      <SelectDropdown
        alowClear={false}
        id="taskgroup"
        title="Task Group:"
        name="taskgroup"
        icon={<BsListTask className="select-icon" />}
        onSelectChange={(e: any) => props.onSelectTask(e)}
        defaultValue={props.defaultTask}
        values={display}
      />
      <p style={{ margin: "15px 0 10px", color: "#f8a51c", fontSize: "18px" }}>
        {t("Date")}
      </p>
      <SelectDate
        isFullWidth={false}
        id="date"
        title={t("Date")}
        name="date"
        disable={false}
        dates={props.searchObject?.date ? props.searchObject?.date : []}
        onSelectChange={(e: any, f: any) => props.onSelectChange(e, f)}
      />
      <p style={{ margin: "15px 0 10px", color: "#f8a51c", fontSize: "18px" }}>
        {t("Other")}
      </p>
      <MultiSelectDropdown
        id="status"
        name="status"
        title={t("Status")}
        icon={<RiListCheck2 className="select-icon" />}
        onSelectChange={(e: any, f: any) => props.onSelectChange(e, f)}
        values={props.formStatus}
        defaultVaue={
          props.searchObject?.status ? props.searchObject?.status : []
        }
      />
      <MultiSelectDropdown
        id="form"
        name="form"
        title={t("Form")}
        icon={<IoNewspaperOutline className="select-icon" />}
        onSelectChange={(e: any, f: any) => props.onSelectChange(e, f)}
        defaultVaue={props.searchObject?.form ? props.searchObject?.form : []}
        values={props.formType}
      />
      <MultiSelectDropdown
        id="company"
        name="company"
        title={t("Company")}
        icon={<BiBuildings className="select-icon" />}
        onSelectChange={(e: any, f: any) => props.onSelectChange(e, f)}
        defaultVaue={
          props.searchObject?.company ? props.searchObject?.company : []
        }
        values={props.allCompany}
      />
      <MultiSelectDropdown
        id="department"
        name="department"
        title={t("Department")}
        icon={<RiNodeTree className="select-icon" />}
        onSelectChange={(e: any, f: any) => props.onSelectChange(e, f)}
        defaultVaue={
          props.searchObject?.department ? props.searchObject?.department : []
        }
        values={props.allDepartment}
      />
    </div>
  );
};

export default WorkListSideBarElementUse;
