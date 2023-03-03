import React, { useState, useEffect } from "react";
import { AttachmentCardComponent } from "../../components/WorklistScreenComponent/AttachmentCardComponent";
import { IAttachFile } from "../../IRequestModel/IAttachfile";
import "./AttachmentScreen.css";
interface Props {
  attachFiles?: IAttachFile[];
}

export const AttachmentScreen = (props: Props) => {
  // const [attachFile, setAttachFile] = useState<any[]>([]);
  // useEffect(() => {
  //   setAttachFile([...props.attachFiles]);
  // }, [props.attachFiles]);
  return (
    <div className="attachment-group-container">
      {props.attachFiles &&
        props.attachFiles.length > 0 &&
        props.attachFiles.map((data: any, idx: any) => (
          <AttachmentCardComponent key={idx} data={data} />
        ))}
    </div>
  );
};
