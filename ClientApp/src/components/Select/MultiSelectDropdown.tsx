import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Select, Divider } from "antd";
import "./Select.css";
import { MdOutlineSelectAll } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface Props {
  id: string;
  title: string;
  name: string;
  icon: any;
  values: any[];
  disable?: boolean;

  onSelectChange: (text: string[], formSelect: string) => void;
  defaultVaue?: string[];
}

export const MultiSelectDropdown = (props: Props) => {
  const { t } = useTranslation(["translation"]);
  const [selectValue, setSelectValue] = useState<string[]>(
    props.defaultVaue ? props.defaultVaue : []
  );
  const [isOpen, setIsOpen] = useState(false);
  const { Option } = Select;
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    console.log(props.values, "values");
  }, []);

  useEffect(() => {
    setSelectValue(props.defaultVaue ? props.defaultVaue : []);
  }, [props.defaultVaue]);
  const onSelectAll = () => {
    let selected = [];
    for (let i = 0; i < props.values.length; i++) {
      selected.push(props.values[i]);
    }
    setSelectValue([...selected]);
    props.onSelectChange(selected, props.name);
  };
  const handleScroll = (e: any) => {
    setIsOpen(false);
  };
  return (
    <div className="filter-select-container">
      <p className="filter-label"></p>
      <Select
        open={isOpen}
        onDropdownVisibleChange={(e: any) => setIsOpen(e)}
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder={props.title}
        defaultValue={selectValue}
        value={selectValue}
        dropdownStyle={{ width: "200px" }}
        onClear={() => setSelectValue([])}
        onDeselect={(value: string) => {
          let selected = selectValue;
          const _selected = selected.filter(
            (valueFilter: any) => value != valueFilter
          );
          setSelectValue([..._selected]);
        }}
        onSelect={(value: string) => {
          let selected = selectValue;
          selected.push(value);
          setSelectValue([...selected]);
        }}
        onChange={(e: string[]) => props.onSelectChange(e, props.name)}
        dropdownRender={(menu) => (
          <div>
            <div
              className="select-all-div"
              style={{ display: "flex", flexWrap: "nowrap", paddingLeft: 12 }}
              onClick={() => onSelectAll()}
            >
              <p>{t("All")}</p>
            </div>
            <Divider style={{ margin: "4px 0" }} />

            {menu}
          </div>
        )}
        options={props.values}
      ></Select>
      {props.icon}
    </div>
  );
};
