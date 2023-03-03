import moment from "moment";
import React, { useEffect, useState } from "react";
import "./FooterComponents.css";
import preval from "preval.macro";
import { getDateDeployConfiguration } from "../../Services/ConfigurationService";
import { useTranslation } from "react-i18next";
interface Props {}

export const FooterComponents = (props: Props) => {
  const { t } = useTranslation(["translation"]);

  const buildTimestamp = preval`module.exports = new Date().getTime();`;
  const [dateDeploy, setDateDeploy] = useState<any>();
  useEffect(() => {
    fechDateDeploy();
  }, []);
  const fechDateDeploy = async () => {
    const response = await getDateDeployConfiguration();
    setDateDeploy(moment(response.lastmodified).format("DDMMYYYY"));
    console.log(response, "dateDeploy");
  };

  return (
    <div className="footerComponents-padding-div">
      <p className="footerComponents-border"></p>
      <div className="footerComponents-padding">
        <p>
          We recommend using{" "}
          <label className="footerComponents-color-a">Microsoft Edge</label> or{" "}
          <label className="footerComponents-color-a">Google Chrome</label> at
          this time.
        </p>
        <p>© WOLF R2 {dateDeploy}</p>
      </div>
    </div>
  );
};
