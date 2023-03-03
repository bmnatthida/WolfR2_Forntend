import React, { useState, useEffect } from "react";
import { DatePicker, Space } from "antd";
import { BsCalendarDate } from "react-icons/bs";
import moment from "moment";
import { GrFormNextLink } from "react-icons/gr";
import { useTranslation } from "react-i18next";
interface Props {
  id: string;
  title: string;
  name: string;
  disable?: boolean;
  dates: any;
  onSelectChange: (e: any, f: any) => void;
  isFullWidth: boolean;
  showIcon?: boolean;
}

export const SelectDate = (props: Props) => {
  const { t } = useTranslation(["translation"]);
  const [dates, setDates] = useState<any>(props.dates);
  const [isOpen, setIsOpen] = useState(false);
  const { RangePicker } = DatePicker;
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setDates(props.dates);
  }, [props.dates]);
  const handleScroll = (e: any) => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isOpen && dates !== props.dates) {
      props.onSelectChange(dates, props.name);
    }
  }, [isOpen]);

  return (
    <div
      className="filter-select-container"
      style={
        props.isFullWidth
          ? { paddingLeft: "0", width: "100%" }
          : { paddingLeft: "24px" }
      }
    >
      {props.showIcon === undefined && (
        <BsCalendarDate
          className={"date-icon"}
          style={props.isFullWidth ? { left: "15px" } : undefined}
        />
      )}
      {props.showIcon !== false && (
        <BsCalendarDate
          className={"date-icon"}
          style={props.isFullWidth ? { left: "15px" } : undefined}
        />
      )}
      <RangePicker
        open={isOpen}
        style={
          props.isFullWidth
            ? {
                height: "100%",
                width: "100%",
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6,
                borderColor: "#ced4da",
              }
            : undefined
        }
        onOpenChange={(e: any) => setIsOpen(e)}
        className={"custom-date"}
        value={props.dates}
        suffixIcon={null}
        placeholder={[t("Start date"), t("End date")]}
        separator={<GrFormNextLink />}
        onCalendarChange={(val) => setDates(val)}
        onChange={(date) => {
          if (!date && dates !== date) {
            props.onSelectChange(date, props.name);
          }
        }}
        ranges={{
          Today: [moment(), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "This Year": [moment().startOf("year"), moment().endOf("year")],
        }}
      />
    </div>
  );
};
