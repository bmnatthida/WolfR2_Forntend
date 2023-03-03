import React from "react";
import "./SearchFilterComponent.css";
import { BsSearch } from "react-icons/bs";
import { useTranslation } from "react-i18next";
interface Props {
  onFilterChange: (text: string) => void;
  searchKeyword?: string;
}

export const SearchFilterComponent = (props: Props) => {
  const { t } = useTranslation(["translation"]);
  return (
    <div className="search-filter-container">
      <div className="search-filter-input-component">
        <BsSearch />
        <input
          type="text"
          className="search-filter-input"
          value={props.searchKeyword || ""}
          onChange={(e) => props.onFilterChange(e.target.value)}
          placeholder={t("Search") || ""}
        />
      </div>
    </div>
  );
};
