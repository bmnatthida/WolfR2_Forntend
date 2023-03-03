import { Row } from "antd";
import { Dialog } from "primereact/dialog";
import React, { FC, useState } from "react";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
interface Props {
  header: string;
  dataLength: number;
  refDocOptions: any[];
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  setLoading: (load: boolean) => void;
}

const RefDocTableDialog: FC<Props> = ({
  header,
  dataLength,
  isVisible,
  refDocOptions,
  setLoading,
  setIsVisible,
}) => {
  const [filterRefTempValue, setFilterRefTempValue] = useState<string>("");

  const renderHeaderRefTemplate = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps="set-input-search-dialog"
          valueProps={filterRefTempValue}
          onChangeProps={(e: any) => setFilterRefTempValue(e)}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog "}
        />
      </div>
    );
  };

  return (
    <>
      <Dialog
        onHide={() => {
          setIsVisible(false);
        }}
        header={renderHeaderRefTemplate}
        className="information-dialog"
        visible={isVisible}
        draggable={false}
        closable={true}
        resizable={false}
        blockScroll
      >
        <Row></Row>
      </Dialog>
    </>
  );
};

export default RefDocTableDialog;
