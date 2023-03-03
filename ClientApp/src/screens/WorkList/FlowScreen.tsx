import React from "react";
import { useTranslation } from "react-i18next";
import { FlowCardComponent } from "../../components/WorklistScreenComponent/FlowCardComponent";
import { IApproval } from "../../IRequestModel/IListApprovalDetailsModel";
import { IUserModel } from "../../IRequestModel/IUserModel";
import "./FlowScreen.css";
interface Props {
  approvals?: IApproval[];
  requestor?: IUserModel;
}

export const FlowScreen = (props: Props) => {
  const { t } = useTranslation(["translation"]);

  return (
    <div className="flow-container">
      <p className="Col-text-header">Flow</p>
      <div className="flow-group-container">
        <p className="text-header">{t("Request By")}</p>
        <FlowCardComponent requestor={props.requestor} />
      </div>
      <div className="flow-group-container">
        <p className="text-header">Approvals</p>
        {props.approvals &&
          props.approvals.map((data: any, idx: any) => {
            return <FlowCardComponent approvals={data} key={idx} />;
          })}
      </div>
    </div>
  );
};
