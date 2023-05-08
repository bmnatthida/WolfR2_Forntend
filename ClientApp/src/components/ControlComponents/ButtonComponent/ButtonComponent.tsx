import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";
import "./ButtonComponent.css";
import { useHistory } from "react-router";
import { confirmDialog } from "primereact/confirmdialog";
import ComponentLabel from "../ComponentLabel";
interface Props {
  template: any;
  data: any;
  col?: any;
  rowIdx: number;
  colIdx: number;
  onChangeEditForm?: (dataRequest: any, rowIdx: number, colIdx: number) => void;
  colText?: number;
  colAction?: number;
  documentNo: any;
  renderInTable?: boolean;
  errorValid?: any;
  statusMemoDetail?: boolean;
  name: any;
  control: any;
  canEditDoc: boolean;
}
export default function ButtonComponent(props: Props) {
  const [url, setUrl] = useState<string>("");
  const history = useHistory();
  const [doc_no, setDoc_no] = useState<string>("");

  useEffect(() => {
    if (props.template.URL) {
      let newUrl: string = props.template.URL;
      newUrl = newUrl.replace("TP", "template");
      if (newUrl.indexOf("/Memo?") !== -1) {
        newUrl = newUrl.replace("/Memo?", "MemoID=0&");
      }
      if (newUrl.startsWith("http")) {
        newUrl = newUrl;
      } else if (!newUrl.startsWith("?")) {
        newUrl = "?" + newUrl;
      }
      setUrl(newUrl);
    }
  }, []);

  // useEffect(() => {
  //   const document_no = props.documentNo;

  //   setDoc_no(document_no);
  // }, [props.requestDetail]);

  return (
    <>
      <ComponentLabel
        renderInTable={props.renderInTable}
        col={props.col}
        colText={props.colText}
        rowIdx={props.rowIdx}
        colIdx={props.rowIdx}
        template={props.template}
      />
      <Col
        sm={props.col === undefined ? 12 : 12}
        md={props.col === undefined ? props.colAction : 12}
        xs={props.col === undefined ? 12 : 12}
        xl={props.col === undefined ? props.colAction : 12}
        className={
          props.renderInTable === undefined ? "padding-controller" : ""
        }
      >
        <div>
          <Button
            label={props.template.alter}
            type={"button"}
            // disabled={
            //   !props.canEditDoc || props.template.attribute.readonly === "Y"
            // }
            onClick={() => {
              const temp = props.template;
              let str = "";
              if (props.documentNo !== "Auto Generate") {
                let param = "";
                let val = "";
                temp.attribute.items.map((item: any) => {
                  item.layout.map((_layout: any) => {
                    if (_layout.control.label === "Document No") {
                      val = props.documentNo;
                    }
                    param = _layout.paramiter.value;
                  });
                });
                str = "&" + param + "=" + val;
                if (!url.startsWith("https")){
                  window.open(`/Request${url + str}`, "_blank", "noreferrer");
                } else{
                  window.open(`${url}`, "_blank","noreferrer");
                }
              } else {
                confirmDialog({
                  message: "กรุณาบันทึกก่อนดำเดินการ",
                  header: "Alert",
                  icon: "pi pi-exclamation-triangle",
                  rejectClassName: "hide-component",
                });
              }
              // console.log(`button=>/Request${url + str}`);
            }}
          />
        </div>
      </Col>
    </>
  );
}
