import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DynamicTable from "../../components/TableComponents/DynamicTableFix/DynamicTable";
import { TreeSelectNewRequest } from "../../components/TreeSelectNewRequest/TreeSelectNewRequest";
import { IPaging } from "../../IRequestModel/IPaginationOptionModel";
import { Col, DatePicker, message, Row, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

import {
  ITimeStampRequest,
  ITimeStampRespone,
} from "../../IRequestModel/ITimeStamp";
import {
  ExportTimeStamp,
  GetTimeStamp,
  UploadTimeStamp,
} from "../../Services/TimeStampService";
import { TextHeaderComponents } from "../../components/TextHeaderComponents/TextHeaderComponents";
import moment from "moment";
import { ButtonComponents } from "../../components/ButtonComponents/ButtonComponents";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { GrDocumentTxt } from "react-icons/gr";
import { Dialog } from "primereact/dialog";
import { RcFile } from "antd/es/upload/interface";
import { Form } from "react-bootstrap";
import { exportExcel } from "../../Helper/ExportExcel";
import useAlert from "../../hooks/useAlert";
import { TiExport, TiExportOutline } from "react-icons/ti";
import { AiOutlineExport } from "react-icons/ai";

const TimeStampScreen = () => {
  const toast = useRef<any>(null);
  const [dataList, setDataList] = useState<any>([]);
  const [isLoadTable, setIsLoadTable] = useState<boolean>(false);
  const [paginationOption, setPaginationOption] = useState<IPaging>({
    PageNumber: 1,
    PageSize: 10,
  });
  const [timeStampRequest, setTimeStampRequest] = useState<ITimeStampRequest>({
    SearchDateTimeFrom: moment(new Date()).format("YYYY-MM-DD") + " 00:00:00",
    SearchDateTimeTo: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
    Paging: {
      PageNumber: 1,
      PageSize: 10,
    },
  });
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<FormData>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const { toggleAlert } = useAlert();

  const {
    control,
    formState: { errors },
    setError,
    getValues,
    handleSubmit,
    reset,
  } = useForm<ITimeStampRequest>({
    mode: "all",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: timeStampRequest,
  });

  const onPageChange = (paginationValue: IPaging) => {
    fecthTimeStamp(timeStampRequest, paginationValue);
  };

  const fecthTimeStamp = async (
    timeStampRequest: ITimeStampRequest,
    _paginationOption?: IPaging
  ) => {
    setIsLoadTable(true);
    if (_paginationOption) {
      timeStampRequest.Paging = _paginationOption;
    }
    const res: ITimeStampRespone = await ExportTimeStamp(timeStampRequest);
    if (res?.Data && res.Data !== "[]") {
      // if (res.Paging) {
      //   timeStampRequest?.Paging = _paginationOption;
      let value: IPaging = {
        PageNumber: res.Paging.PageNumber,
        PageSize: res.Paging.PageSize,
        PageCount: res.Paging.PageCount,
        RecordCount: res.Paging.RecordCount,
      };

      setPaginationOption(value);
      // }
      setDataList(JSON.parse(res.Data));
    } else {
      setDataList(JSON.parse(res.Data));
      toggleAlert({
        description:
          "ข้อมูลในช่วง " +
          moment(timeStampRequest.SearchDateTimeFrom).format("YYYY-MM-DD") +
          " ถึง " +
          moment(timeStampRequest.SearchDateTimeTo).format("YYYY-MM-DD") +
          " ไม่มีข้อมูล",
        message: `Alert`,
        type: "error",
      });
    }
    setIsLoadTable(false);
  };

  const fecthExportTimeStamp = async (timeStampRequest: ITimeStampRequest) => {
    setExporting(true);
    const res: ITimeStampRespone = await ExportTimeStamp(timeStampRequest);
    if (res?.Data && res.Data !== "[]") {
      exportExcel("TimeStamp ", JSON.parse(res.Data));
    } else {
      toggleAlert({
        description:
          "ข้อมูลในช่วง " +
          timeStampRequest.SearchDateTimeFrom +
          " ถึง " +
          timeStampRequest.SearchDateTimeTo +
          " ไม่มีข้อมูล",
        message: `Alert`,
        type: "error",
      });
    }
    setExporting(false);
  };

  const panelTemplate = (options: any, headText: string) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} pl-1`;
    return (
      <div className={className}>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
        <span className={titleClassName}>{headText}</span>
      </div>
    );
  };

  const onSubmit = (data: ITimeStampRequest) => {
    setTimeStampRequest(data);
    if (action === "get") {
      fecthTimeStamp(data);
    } else {
      fecthExportTimeStamp(data);
    }
  };

  const getFormErrorMessage = (name: string) => {
    if (name === "SearchDateTimeFrom") {
      return (
        errors.SearchDateTimeFrom && (
          <small className="p-error">{errors.SearchDateTimeFrom.message}</small>
        )
      );
    } else {
      return (
        errors.SearchDateTimeTo && (
          <small className="p-error">{errors.SearchDateTimeTo.message}</small>
        )
      );
    }
  };

  const filterComponent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={4}>
              <TextHeaderComponents
                textHeaderProps={"Datetime From"}
                textSubProps={"วันเวลาเริ่มต้น"}
                isRequir
              />
            </Col>
            <Col span={8}>
              <Controller
                name="SearchDateTimeFrom"
                control={control}
                rules={{ required: "SearchDateTimeFrom is required." }}
                render={({ field, fieldState }) => (
                  <DatePicker
                    size={"large"}
                    status={fieldState.invalid ? "error" : undefined}
                    value={field.value ? moment(field.value) : null}
                    format={"YYYY-MM-DD"}
                    onChange={(value) => {
                      let val: any = "";
                      if (value) {
                        val = value.format("YYYY-MM-DD") + " 00:00:00";
                      } else {
                        val = null;
                      }
                      field.onChange(val);
                    }}
                    allowClear
                  />
                )}
              />
              {getFormErrorMessage("SearchDateTimeFrom")}
            </Col>
            <Col span={4}>
              <TextHeaderComponents
                textHeaderProps={"Datetime To"}
                textSubProps={"วันเวลาที่สิ้นสุด"}
                isRequir
              />
            </Col>
            <Col span={8}>
              <Controller
                name="SearchDateTimeTo"
                control={control}
                rules={{ required: "SearchDateTimeTo is required." }}
                render={({ field, fieldState }) => (
                  <DatePicker
                    size={"large"}
                    status={fieldState.invalid ? "error" : undefined}
                    value={field.value ? moment(field.value) : null}
                    format={"YYYY-MM-DD"}
                    onChange={(value) => {
                      let val: any = null;
                      if (value) {
                        val = value.format("YYYY-MM-DD") + " 00:00:00";
                      } else {
                        val = null;
                      }
                      field.onChange(val);
                    }}
                    allowClear
                  />
                )}
              />
              {getFormErrorMessage("SearchDateTimeTo")}
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col>
              {" "}
              <Button
                label="Search"
                // icon="pi pi-file"
                loading={isLoadTable}
                onClick={() => {
                  setAction("get");
                }}
                type={"submit"}
                style={{
                  height: "38px",
                  backgroundColor: "#282F6A",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  border: "1px solid rgb(40, 47, 106)",
                }}
              />
            </Col>
            <Col>
              {" "}
              <Button
                label="Import File"
                icon="pi pi-file"
                type={"button"}
                onClick={() => {
                  setDialogVisible(true);
                }}
                style={{
                  height: "38px",
                  background: " #28a745",
                  border: "1px solid #28a745",
                  color: "#ffffff",
                  fontSize: "13px",
                  borderRadius: "6px",
                }}
              />
            </Col>
            <Col>
              {" "}
              <Button
                onClick={() => {
                  setAction("export");
                }}
                loading={exporting}
                icon="pi pi-file-excel"
                label="Export File"
                type={"submit"}
                style={{
                  height: "38px",
                  background: "#28a745",
                  border: "1px solid #28a745",
                  color: "#ffffff",
                  fontSize: "13px",
                  borderRadius: "6px",
                }}
              />
            </Col>
          </Row>
        </div>
      </form>
    );
  };

  const handleUpload = async (e: any) => {
    if (e.target.files[0].type === "text/plain") {
      const formData = new FormData();
      formData.append("File", e.target.files[0]);
      setFileSelected(formData);
    }
  };

  return (
    <div className="main-container">
      <div className="worklist-container" style={{ height: "100%" }}>
        <Toast ref={toast} baseZIndex={999999} />
        <div className="header-container">
          <div className="button-container">
            <TreeSelectNewRequest setDataTemplateTreeProps={null} />
          </div>
        </div>
        <div className="body-container">
          <Panel
            headerTemplate={(option: any) => panelTemplate(option, "Filter")}
            toggleable
          >
            {filterComponent()}
          </Panel>
          <Panel
            headerTemplate={(option: any) =>
              panelTemplate(option, "Time Stamp")
            }
            className={"table-panel"}
            toggleable
          >
            <>
              <DynamicTable
                tableName={"Time Stamp"}
                dataSource={dataList}
                canEdit={false}
                toast={toast}
                canExport={false}
                loading={isLoadTable}
                paginationOption={{
                  // position: ["bottomLeft"],
                  // size: "default",
                  // current: paginationOption.PageNumber,
                  // pageSize: paginationOption.PageSize,
                  // total: paginationOption.RecordCount,
                  showSizeChanger: false,
                  showTotal: (total: number, ranges: [number, number]) => {
                    console.log("table=>total", total, ranges);
                    return <p>Total Record: {total}</p>;
                  },
                  // onChange: (page, pageSize) => {
                  //   let value: IPaging = paginationOption;
                  //   value.PageNumber = page;
                  //   value.PageSize = pageSize;
                  //   onPageChange(value);
                  // },
                }}
                onPageChange={onPageChange}
              />
            </>
          </Panel>
        </div>
        <Dialog
          visible={dialogVisible}
          breakpoints={{}}
          style={{ width: "70vw", borderRadius: "16px" }}
          header={"Upload File"}
          modal
          className="p-fluid"
          onHide={() => {
            setDialogVisible(false);
          }}
          draggable={false}
          blockScroll
        >
          <div className="">
            <div className="setmagin-at">
              <Form.Group
                controlId="formFile"
                className="mb-3 file-input-container"
              >
                <Form.Control
                  type="file"
                  accept={"text/plain"}
                  onChange={handleUpload}
                />
              </Form.Group>
              <Button
                label="Upload"
                icon="pi pi-upload"
                type="button"
                loading={uploading}
                onClick={async () => {
                  if (fileSelected) {
                    setUploading(true);
                    const res = await UploadTimeStamp(fileSelected);
                    if (res) {
                      toggleAlert({
                        description: `Import file success.`,
                        message: `Success`,
                        type: "success",
                      });
                    }
                    setUploading(false);
                    setDialogVisible(false);
                  }
                }}
                style={{
                  height: "38px",
                  background: " #28a745",
                  border: "1px solid #28a745",
                  color: "#ffffff",
                  fontSize: "13px",
                  borderRadius: "6px",
                  width: 110,
                }}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TimeStampScreen;
