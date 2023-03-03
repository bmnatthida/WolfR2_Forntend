import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Select, Divider } from "antd";
import "./Select.css";
import { MdOutlineSelectAll } from "react-icons/md";

interface Props {
  id: string;
  title: string;
  name: string;
  icon: any;
  values: any;
  disable?: boolean;
  defaultValue?: string;
  alowClear?: boolean;
  onSelectChange: (text: string) => void;
}

export const SelectDropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);
  const handleScroll = (e: any) => {
    setIsOpen(false);
  };
  return (
    <div className="filter-select-container">
      <Select
        open={isOpen}
        onDropdownVisibleChange={(e: any) => setIsOpen(e)}
        value={props.defaultValue}
        allowClear={props.alowClear !== undefined ? false : true}
        style={{ width: "100%" }}
        placeholder="Please select"
        onChange={(e: string) => props.onSelectChange(e)}
        options={props.values}
      ></Select>
      {props.icon}
    </div>
  );
};
