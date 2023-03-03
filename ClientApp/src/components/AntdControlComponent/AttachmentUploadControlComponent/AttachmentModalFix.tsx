import { Button, Modal, Upload, Segmented, Layout, Input } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState, FC } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import { SegmentedValue } from "antd/lib/segmented";
import { Controller, useForm } from "react-hook-form";

type AttachmentModalProps = {
  isModalVisible: boolean;
  handleCancelModal: () => void;
  handleSubmitModal: (view: any, data: any) => void;
};
const AttachmentModal: FC<AttachmentModalProps> = ({
  isModalVisible,
  handleCancelModal,
  handleSubmitModal,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "rc-upload-1656603708093-2",
      lastModified: 1655649146007,
      lastModifiedDate: new Date("2022-06-19T14:32:26.007Z"),
      name: "Import template.xlsx",
      size: 9606,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  ]);
  const { handleSubmit, control, reset, getValues } = useForm();
  const [attachmentLink, setAttachmentLink] = useState("");
  const [segmentView, setSegmentView] = useState("file");
  const [attachName, setAttachName] = useState("");
  const onSelectSegment = (value: SegmentedValue) => {
    setSegmentView(value.toString());
  };
  const onSubmit = (data: any) => console.log(data);
  //   const handleOk = () => {
  //     setIsModalVisible(false);
  //   };

  //   const handleCancel = () => {
  //     setIsModalVisible(false);
  //   };

  return (
    <>
      <Modal
        className="attachment-modal"
        visible={isModalVisible}
        onOk={() => {
          console.log("At=>", 5555555555555555555);

          handleSubmitModal(segmentView, {
            attachName,
            attachmentLink,
            fileList,
          });
        }}
        onCancel={handleCancelModal}
      >
        <Layout>
          <Segmented
            block
            value={segmentView}
            options={[
              { label: "Attach file", value: "file" },
              { label: "Attach link", value: "link" },
            ]}
            onChange={onSelectSegment}
          />

          {segmentView === "file" && (
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div className="link-name-container">
                <p className="label-header">Name </p>
                <Input
                  className="label-input"
                  value={attachName}
                  onChange={(e) => setAttachName(e.target.value)}
                />
              </div>
              <Upload
                className="file-upload-container"
                beforeUpload={() => false}
                listType="picture"
                defaultFileList={[...fileList]}
                onChange={(info: any) => setFileList([...info.fileList])}
                onRemove={() => setFileList([])}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <Button style={{ marginTop: 8 }} icon={<UploadOutlined />}>
                    Upload
                  </Button>
                )}
              </Upload>
            </Content>
          )}
          {segmentView === "link" && (
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div className="link-name-container" style={{ marginBottom: 8 }}>
                <p className="label-header">Name </p>

                <Input
                  className="label-input"
                  value={attachName}
                  onChange={(e) => setAttachName(e.target.value)}
                />
              </div>
              <div className="link-name-container">
                <p className="label-header">Link </p>

                <Input
                  className="label-input"
                  addonBefore="https://"
                  defaultValue="example.com"
                  value={attachmentLink}
                  onChange={(e) => setAttachmentLink(e.target.value)}
                />
              </div>
            </Content>
          )}
        </Layout>
      </Modal>
    </>
  );
};

export default AttachmentModal;
