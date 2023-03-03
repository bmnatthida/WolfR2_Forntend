import React, { useEffect } from "react";
import "./WorklistScreenComponent.css";
interface Props {
  approvals?: any;
  requestor?: any;
}

export const FlowCardComponent = (props: Props) => {
  // const [flowCardData, setFlowCardData] = useState()

  return (
    <div className="flow-card-container">
      <div className="img-flow-card">
        <div className="circle-text">
          {props.approvals && (
            <p className="text-profile">
              {props.approvals.approver &&
                props.approvals.approver.nameEn.substring(0, 2).toUpperCase()}
            </p>
          )}
          {props.requestor && (
            <p className="text-profile">
              {props.requestor &&
                props.requestor.NameEn.substring(0, 2).toUpperCase()}
            </p>
          )}
        </div>
        {/* <img
          src="https://source.unsplash.com/100x100/?protrait"
          alt="flow-img"
        /> */}
      </div>
      <div className="flow-card-detail">
        <div className="text-user-name">
          {props.approvals && (
            <>
              <p className="user-name">{props.approvals.approver.nameEn}</p>
              <p className="user-role">
                {props.approvals.approver.positionNameEn}
              </p>
            </>
          )}
          {props.requestor && (
            <>
              <p className="user-name">{props.requestor.NameEn}</p>
              <p className="user-role">{props.requestor.PositionNameEn}</p>
            </>
          )}
        </div>
        <p className="text-status">
          {props.approvals && props.approvals.approver.departmentNameEn}
          {props.requestor && props.requestor.DepartmentNameEn}
        </p>
      </div>
      {props.approvals && (
        <div className="status-badge">
          <span>{props.approvals.signature_en}</span>
        </div>
      )}
    </div>
  );
};
