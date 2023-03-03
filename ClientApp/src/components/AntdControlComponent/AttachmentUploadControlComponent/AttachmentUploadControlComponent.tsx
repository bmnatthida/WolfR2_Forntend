import { Button, Form, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useState } from "react";
import { Col } from "react-bootstrap";
import ComponentLabel from "../../ControlComponents/ComponentLabel";
import AttachmentModalFix from "./AttachmentModalFix";
import { UploadOutlined } from "@ant-design/icons";
import { generateQuickGuid } from "../../../Helper/GenerateGuid";
import { useUserContext } from "../../../Context/UserContext";
import {
  UploadFileAttachFiles,
  UploadRequestAttachFiles,
} from "../../../Services/AttachFileService";
import { TableInputProps } from "../TableComponent/TableComponent";

type Props = {
  template: any;
  data: any;
  rowIdx: number;
  colIdx: number;
  col?: any;
  colText?: number;
  colAction?: number;
  // statusMemoDetail?: boolean;
  name: string;
  control: any;
};

type InputAttachmentProps = {
  ref?: any;
  template: any;
  value?: any;
  status?: any;
  onChange?: (value: any) => void;
};

export const AttachmentComponent: React.FC<InputAttachmentProps> = ({
  ref,
  template,
  value,
  status,
  onChange,
  ...props
}: InputAttachmentProps) => {
  const [userData] = useUserContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState<any>({
    attachName: null,
    attachmentLink: null,
    fileList: null,
  });
  const handhandleCancelModal = () => {
    setIsModalVisible(false);
  };
  const handleSubmitModal = async (
    view: any,
    data: { attachName: string; attachmentLink: string; fileList: any }
  ) => {
    try {
      // setIsModalVisible(false)
      if (view === "file") {
        let errors = { attachName: false, fileList: false };
        if (data.fileList.length > 0) {
          console.log("At=>data", data);

          console.log("At=>data", data.fileList[0]);
          const dd = data.fileList[0];
          const formData: any = {};
          formData["file_name"] = data.attachName;
          formData["files"] = dd;
          formData["document_lib"] = "TempAttachment";
          formData["document_set"] = generateQuickGuid();
          formData["file_desc"] = "renderControl";
          formData["actorId"] = userData.EmployeeId.toString();
          // formData.append("Doclib", "TempAttachment");
          // formData.append("docSet", generateQuickGuid());
          // formData.append("fileDesc", "renderControl");
          // formData.append("actorID", userData.EmployeeId.toString());
          console.log("At=>formData", { formData: formData });
          // console.log({ formData: formData.get("files") });
          const response = await UploadRequestAttachFiles(formData);
          console.log("At=>response", { response });
          if (response) {
            console.log(response);
          }
        } else {
          errors.fileList = true;
        }
        if (data.attachName.length > 0) {
        } else {
          errors.attachName = true;
        }
        if (errors.attachName || errors.fileList) {
          setErrors((prevState: any) => ({ ...prevState, ...errors }));
          return;
        }
      }
      console.log("At=>", { view, data });
    } catch (error) {
      console.log("At=>error", error);
    }
  };
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <AttachmentModalFix
        handleCancelModal={handhandleCancelModal}
        handleSubmitModal={handleSubmitModal}
        isModalVisible={isModalVisible}
      />
      <Button icon={<UploadOutlined />} onClick={handleOpenModal}>
        Click to Attach
      </Button>
    </>
  );
};

export const AttachmentControlComponent: React.FC<Props> = ({
  colIdx,
  rowIdx,
  control,
  name,
  data,
  template,
  col,
  colAction,
  colText,
  ...props
}) => {
  return (
    <>
      <ComponentLabel
        // renderInTable={props.renderInTable}
        col={col}
        colText={colText}
        rowIdx={rowIdx}
        colIdx={rowIdx}
        template={template}
      />
      <Col
        sm={col === undefined ? 12 : 12}
        md={col === undefined ? colAction : 12}
        xs={col === undefined ? 12 : 12}
        xl={col === undefined ? colAction : 12}
        className={"padding-controller"}
      >
        <div className={`input-component-container`}>
          <AttachmentComponent template={template} />
        </div>
      </Col>
    </>
  );
};

export const AttachmentTableComponent: React.FC<TableInputProps> = ({
  name,
  template,
  saveFunc,
  inputRef,
  isEditing,
  onEdit,
  value,
  children,
  ...props
}) => {
  if (!isEditing) {
    return (
      <>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture"
          //   defaultFileList={[...fileList]}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </>
    );
  }
  return (
    <>
      <Form.Item
        style={{ margin: 0 }}
        name={name}
        normalize={(value: any) => value}
        rules={[
          {
            required: template.attribute.require === "Y" ? true : false,
            message: `${template.label} is required.`,
          },
        ]}
      >
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture"
          //   defaultFileList={[...fileList]}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
    </>
  );
};

export default AttachmentControlComponent;
