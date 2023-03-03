import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
type Props = {};

export const SettingsSpecScreen = (props: Props) => {
  let location = useLocation<any>();
  const query = new URLSearchParams(useLocation().search);
  useEffect(() => {
    console.log("location", location);
  }, [location]);
  useEffect(() => {
    console.log("query", query);
  }, [query]);

  return <div>SettingsSpecScreen</div>;
};
