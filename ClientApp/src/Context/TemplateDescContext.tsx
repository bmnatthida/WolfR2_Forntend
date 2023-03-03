import React from "react";
import { createContext, useContext, useState } from "react";
import {
  initialTableTemplate,
  ITableTemplate,
} from "../IRequestModel/ITemplateDescModel";

export const TemplateDescContext = createContext<any>([
  initialTableTemplate,
  () => {},
]);
export const useTemplateDescContext = () => useContext(TemplateDescContext);

export const TemplateDescContextProvider: React.FC = (props) => {
  const [templateState, setTemplateState] = useState(initialTableTemplate);
  const defaultSessionContext: [ITableTemplate, typeof setTemplateState] = [
    templateState,
    setTemplateState,
  ];
  return (
    <TemplateDescContext.Provider value={defaultSessionContext}>
      {props.children}
    </TemplateDescContext.Provider>
  );
};
