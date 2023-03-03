import React, { useEffect } from "react";
interface Props {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
}
export default function HeadingComponent(props: Props) {
  return (
    <>
      {props.template.istext == "Y" ? (
        <pre
          style={{
            padding: "0 30px",
            // whiteSpace: "pre",
            paddingTop: props.rowIdx === 0 ? 16 : 0,
          }}
        >
          <span>{props.template.textvalue}</span>
        </pre>
      ) : (
        <div className="headtext-form">{props.template.textvalue}</div>
      )}
    </>
  );
}
