import React from "react";

interface Props {
  id: string;
  title: string;
  name: string;
  icon: any;
}

export const TextInput = (props: Props) => {
  return (
    <div className="filter-container">
      <p className="filter-label">{props.title}</p>
      {/* <BsLayoutTextWindowReverse className="select-icon" /> */}
      {props.icon}
      <input type="text" id={props.id} name={props.name} />
    </div>
  );
};
