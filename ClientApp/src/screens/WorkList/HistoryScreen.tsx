import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { HistoryComponent } from "../../components/RequestComponents/HistoryComponent/HistoryComponent";
import { HistoryCardComponent } from "../../components/WorklistScreenComponent/HistoryCardComponent";
import { IWorklistHistory } from "../../IRequestModel/IListHistoryDetailsModel";
import "./HistoryScreen.css";
interface Props {
  historyData?: IWorklistHistory[];
}

export const HistoryScreen = (props: Props) => {
  const [historyData, setHistoryData] = useState<any[]>(
    props.historyData ? props.historyData : []
  );
  const { t } = useTranslation(["translation"]);

  return (
    <div className="history-group-container">
      <HistoryComponent
        // data={historyData}
        listHistoryDetails={props.historyData}
        t={t}
      />
      {/* {props.historyData.map((_data: any, idx: any) => (
        // <HistoryCardComponent key={idx} data={_data} />
        <HistoryComponent key={idx} getHistoryMethodProp={() => undefined} />
      ))} */}
    </div>
  );
};
