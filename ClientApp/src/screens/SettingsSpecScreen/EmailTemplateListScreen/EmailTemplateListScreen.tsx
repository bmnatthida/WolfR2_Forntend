import React, { useState, useEffect } from "react";
import withPerMission from "../../../components/HOC/withPermission";
import { EmailTemplateList } from "../../../components/SettingsSpecComponents/EmailTemplateList/EmailTemplateList";
import { TreeSelectNewRequest } from "../../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { getAllEmailTemplate } from "../../../Services/EmailTemplateService";

type Props = {};

const EmailTemplateListScreen = (props: Props) => {
  const [emailTemplate, setEmailTemplate] = useState<any>([]);

  useEffect(() => {
    _EmailTemplate();
  }, []);

  async function _EmailTemplate() {
    let _getEmailTemplate = await getAllEmailTemplate();
    _getEmailTemplate.map((data: any) => {
      for (const [key, value] of Object.entries(data)) {
        if (value === null) {
          data[key] = "";
        }
      }
    });
    setEmailTemplate(_getEmailTemplate);
  }
  return (
    <>
      <div className="main-container">
        <div className="worklist-container">
          <div className="header-container">
            <div className="button-container">
              <TreeSelectNewRequest setDataTemplateTreeProps={null} />
            </div>
            <div
              className="route-text-container"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <p className="route-text">
                {"Email Template List" + "(" + emailTemplate.length + ")"}
              </p>
            </div>
          </div>

          <>
            <EmailTemplateList valueProps={emailTemplate} />
          </>
        </div>
      </div>
    </>
  );
};
export default withPerMission(EmailTemplateListScreen);
