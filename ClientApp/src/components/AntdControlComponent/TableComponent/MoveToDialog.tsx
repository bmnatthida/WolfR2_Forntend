import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import React, { useState } from "react";

type Props = {
  header: string;
  dataLength: number;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  moveFunc: (key: number) => void;
  setLoading: (load: boolean) => void;
};

const MoveToDialog = ({
  header,
  dataLength,
  isVisible,
  setLoading,
  setIsVisible,
  moveFunc,
}: Props) => {
  const [moveValue, setMoveValue] = useState<number>(1);
  const renderFooter = () => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setIsVisible(false)}
          style={{ height: "38px" }}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => {
            setLoading(true);
            moveFunc(moveValue - 1);
            setIsVisible(false);
          }}
          style={{ height: "38px" }}
          autoFocus
        />
      </div>
    );
  };
  return (
    <>
      <Dialog
        header={header}
        visible={isVisible}
        style={{ width: "25vw" }}
        onHide={() => {
          setIsVisible(false);
          setMoveValue(1);
        }}
        footer={renderFooter}
        className="information-dialog"
        draggable={false}
        closable={false}
        resizable={false}
        blockScroll
      >
        <Row>
          <InputNumber
            inputId="integeronly"
            min={1}
            max={dataLength}
            onValueChange={(e: any) => {
              if (e?.value <= dataLength) {
                setMoveValue(e?.value);
              }
            }}
          />
        </Row>
      </Dialog>
    </>
  );
};

export default MoveToDialog;
