import React, { useState, useEffect, useRef } from "react";
import { Divider, Input, Space } from "antd";
import "./RequestorComponent.css";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Toast } from "primereact/toast";
import {
  GetAllEmployee,
  GetAllEmployeeByLanguage,
} from "../../../Services/EmployeeService";
import { Col, Row } from "react-bootstrap";
import { InputTextComponents } from "../../InputTextComponents/InputTextComponents";
import { GetApprovalByTemplate } from "../../../Services/ApprovalService";
import { Tooltip } from "primereact/tooltip";
import { useUserContext } from "../../../Context/UserContext";
import { SelectDataDialog } from "../../Select/SelectionDataDialog/SelectDataDialog";

interface Props {
  setMemoDetail: any;
  memoDetail: any;
  canEditDoc: any;
  masterEmployee: any;
  setLineApproval: any;
  isADTitleToPosition: any;
  setRequestor: any;
  requestor: any;
  creator: any;
  jsonCondition: any;
  lineApproval: any;
  onLoadDataLiveApprove: any;
  userData: any;
  renderSelectedRequestor: any;
  t: any;
}

export const RequestorComponent = (props: Props) => {
  const toast = useRef<any>(null);
  const { Search } = Input;
  const [dialogVisible, setDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [actionAdd, setIsActionAdd] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(
    window.localStorage.getItem("isAdmin") === "true" ? true : false
  );
  useEffect(() => {
    mapData();
  }, []);
  const mapData = () => {
    setSearchData([...props.masterEmployee]);
    if (props.memoDetail.memoid !== 0) {
      setIsActionAdd(true);
    }
  };

  const onGlobalFilterChange = (e: any) => {
    const value = e;
    const dataEmp = props.masterEmployee;

    setGlobalFilterValue(value);
    const data = dataEmp.filter((data: any) => {
      if (props.userData.Lang === "EN") {
        if (
          data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.NameEn.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.PositionNameEn.toLowerCase().indexOf(value.toLowerCase()) !==
            -1 ||
          data.DepartmentNameEn.toLowerCase().indexOf(value.toLowerCase()) !==
            -1
        ) {
          return true;
        }
      } else {
        if (
          data.EmployeeCode.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.NameTh.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          data.PositionNameTh.toLowerCase().indexOf(value.toLowerCase()) !==
            -1 ||
          data.DepartmentNameTh.toLowerCase().indexOf(value.toLowerCase()) !==
            -1
        ) {
          return true;
        }
      }
    });
    setSearchData([...data]);
  };

  function showModal() {
    if (globalFilterValue != "") {
      setGlobalFilterValue("");
    }
    setDialogVisible(!dialogVisible);
  }

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-end">
        <InputTextComponents
          setClassNameProps={"set-input-search-dialog"}
          valueProps={globalFilterValue}
          onChangeProps={onGlobalFilterChange}
          placeholderProps={"Search"}
          setIconProps={<i className="pi pi-search" />}
          setClassNameSpanProps={"p-input-icon-left set-span-search-dialog"}
        />
      </div>
    );
  };

  const onRowSelect = async (event: any) => {
    props.setRequestor(event.data);
    props.setMemoDetail((prevState: any) => ({
      ...prevState,
      requestor: event.data,
    }));
    if (props.renderSelectedRequestor) {
      props.renderSelectedRequestor(event.data);
    }
    setDialogVisible(false);
  };

  function showSuccess() {
    return (
      <div>
        <p className="Col-text-header">{props.t("creator")}</p>
        <Row className="setrow-form-requestor">
          <Col sm={12} md={2} xs={12}>
            <tr>
              <th>
                <p className="row headtext-form-requestor">Employee Code</p>
                <p className="row subtext-form-requestor">รหัสพนักงาน</p>
              </th>
            </tr>
          </Col>
          <Col sm={12} md={4} xs={12}>
            <InputTextComponents
              placeholderProps={""}
              setClassNameProps={"requestor-height-input"}
              valueProps={
                props.userData.Lang === "EN"
                  ? props.creator.EmployeeCode
                  : props.creator.EmployeeCode
              }
              setStyleProps={{ width: "100%" }}
              disabledProps={true}
            />
          </Col>
          <Col sm={12} md={2} xs={12}>
            <tr>
              <th>
                <p className="row headtext-form-requestor">Name</p>
                <p className="row subtext-form-requestor">ชื่อ</p>
              </th>
            </tr>
          </Col>
          <Col sm={12} md={4} xs={12}>
            <InputTextComponents
              placeholderProps={""}
              setClassNameProps={"requestor-height-input"}
              valueProps={
                props.userData.Lang === "EN"
                  ? props.creator.NameEn
                  : props.creator.NameTh
              }
              disabledProps={true}
              setStyleProps={{ width: "100%" }}
            />
          </Col>
        </Row>

        <Row className="setrow-form-requestor">
          <Col sm={12} md={2} xs={12}>
            <tr>
              <th>
                <p className="row headtext-form-requestor">Position</p>
                <p className="row subtext-form-requestor">ตำแหน่ง</p>
              </th>
            </tr>
          </Col>
          <Col sm={12} md={4} xs={12}>
            <InputTextComponents
              placeholderProps={""}
              setClassNameProps={"requestor-height-input"}
              valueProps={
                props.isADTitleToPosition
                  ? props.creator.ADTitle
                  : props.userData.Lang === "EN"
                  ? props.creator.PositionNameEn
                  : props.creator.PositionNameTh
              }
              disabledProps={true}
              setStyleProps={{ width: "100%" }}
            />
          </Col>
          <Col sm={12} md={2} xs={12}>
            <tr>
              <th>
                <p className="row headtext-form-requestor">Division</p>
                <p className="row subtext-form-requestor">ฝ่ายงาน</p>
              </th>
            </tr>
          </Col>
          <Col sm={12} md={4} xs={12}>
            <InputTextComponents
              placeholderProps={""}
              setClassNameProps={"requestor-height-input"}
              valueProps={
                props.userData.Lang === "EN"
                  ? props.creator.DivisionNameEn
                  : props.creator.DivisionNameTh
              }
              disabledProps={true}
              setStyleProps={{ width: "100%" }}
            />
          </Col>
        </Row>
        <Row className="setrow-form-requestor">
          <Col sm={12} md={2} xs={12}>
            <tr>
              <th>
                <p className="row headtext-form-requestor">Department</p>
                <p className="row subtext-form-requestor">หน่วยงาน</p>
              </th>
            </tr>
          </Col>
          <Col sm={12} md={4} xs={12}>
            <InputTextComponents
              placeholderProps={""}
              setClassNameProps={"requestor-height-input"}
              valueProps={
                props.userData.Lang === "EN"
                  ? props.creator.DepartmentNameEn
                  : props.creator.DepartmentNameTh
              }
              disabledProps={true}
              setStyleProps={{ width: "100%" }}
            />
          </Col>
          <Col sm={12} md={2} xs={12}>
            <tr>
              <th>
                <p className="row headtext-form-requestor">Email</p>
                <p className="row subtext-form-requestor">อีเมล</p>
              </th>
            </tr>
          </Col>
          <Col sm={12} md={4} xs={12}>
            <InputTextComponents
              placeholderProps={""}
              setClassNameProps={"requestor-height-input"}
              valueProps={
                props.userData.Lang === "EN"
                  ? props.creator.Email
                  : props.creator.Email
              }
              disabledProps={true}
              setStyleProps={{ width: "100%" }}
            />
          </Col>
        </Row>
        <div className="set-margin-header-creator"></div>
      </div>
    );
  }
  useEffect(() => {
    console.log({ ss: props.userData });
  }, [props.userData]);

  return (
    <div>
      {actionAdd && showSuccess()}
      <Tooltip target=".showId" />
      <p className="Col-text-header"> {props.t("Requestor")}</p>
      <Row className="setrow-form-requestor">
        <Col sm={12} md={2} xs={12}>
          <tr>
            <th>
              <p className="row headtext-form-requestor">Employee Code</p>
              <p className="row subtext-form-requestor">รหัสพนักงาน</p>
            </th>
          </tr>
        </Col>
        <Col
          sm={12}
          md={4}
          xs={12}
          onClick={!props.canEditDoc ? undefined : showModal}
        >
          <Search
            disabled={!props.canEditDoc}
            readOnly
            value={
              props.userData.Lang === "EN"
                ? props.requestor.EmployeeCode
                : props.requestor.EmployeeCode
            }
            className="set-search-form-requestor"
            placeholder=""
          />
        </Col>
        <Col sm={12} md={2} xs={12}>
          <tr>
            <th>
              <p className="row headtext-form-requestor">Name</p>
              <p className="row subtext-form-requestor">ชื่อ</p>
            </th>
          </tr>
        </Col>
        <Col sm={12} md={4} xs={12}>
          <InputTextComponents
            placeholderProps={""}
            setClassNameProps={"requestor-height-input"}
            valueProps={
              props.userData.Lang === "EN"
                ? props.requestor.NameEn
                : props.requestor.NameTh
            }
            disabledProps={true}
            setStyleProps={{ width: "100%" }}
          />
        </Col>
      </Row>

      <Row className="setrow-form-requestor">
        <Col sm={12} md={2} xs={12}>
          <tr>
            <th>
              <p className="row headtext-form-requestor">Position</p>
              <p className="row subtext-form-requestor">ตำแหน่ง</p>
            </th>
          </tr>
        </Col>
        <Col sm={12} md={4} xs={12}>
          <InputTextComponents
            placeholderProps={""}
            setClassNameProps={"requestor-height-input"}
            valueProps={
              props.isADTitleToPosition
                ? props.requestor.ADTitle
                : props.userData.Lang === "EN"
                ? props.requestor.PositionNameEn
                : props.requestor.PositionNameTh
            }
            disabledProps={true}
            setStyleProps={{ width: "100%" }}
          />
        </Col>
        <Col sm={12} md={2} xs={12}>
          <tr>
            <th>
              <p className="row headtext-form-requestor">Division</p>
              <p className="row subtext-form-requestor">ฝ่ายงาน</p>
            </th>
          </tr>
        </Col>
        <Col sm={12} md={4} xs={12}>
          <InputTextComponents
            placeholderProps={""}
            setClassNameProps={"requestor-height-input"}
            valueProps={
              props.userData.Lang === "EN"
                ? props.requestor.DivisionNameEn
                : props.requestor.DivisionNameTh
            }
            disabledProps={true}
            setStyleProps={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row className="setrow-form-requestor">
        <Col sm={12} md={2} xs={12}>
          <tr>
            <th>
              <p className="row headtext-form-requestor">Department</p>
              <p className="row subtext-form-requestor">หน่วยงาน</p>
            </th>
          </tr>
        </Col>
        <Col sm={12} md={4} xs={12}>
          <InputTextComponents
            placeholderProps={""}
            setClassNameProps={"requestor-height-input"}
            valueProps={
              props.userData.Lang === "EN"
                ? props.requestor.DepartmentNameEn
                : props.requestor.DepartmentNameTh
            }
            disabledProps={true}
            setStyleProps={{ width: "100%" }}
          />
        </Col>
        <Col sm={12} md={2} xs={12}>
          <tr>
            <th>
              <p className="row headtext-form-requestor">Email</p>
              <p className="row subtext-form-requestor">อีเมล</p>
            </th>
          </tr>
        </Col>
        <Col sm={12} md={4} xs={12}>
          <InputTextComponents
            placeholderProps={""}
            setClassNameProps={"requestor-height-input"}
            valueProps={
              props.userData.Lang === "EN"
                ? props.requestor.Email
                : props.requestor.Email
            }
            disabledProps={true}
            setStyleProps={{ width: "100%" }}
          />
        </Col>
      </Row>
      <SelectDataDialog
        dialogKey={"Employee"}
        dataList={searchData}
        onSelectFunc={onRowSelect}
        columns={[
          {
            field: "EmployeeCode",
            headerEn: "EmployeeCode",
            headerTh: "รหัสพนักงาน",
          },
          {
            field: "NameEn",
            headerEn: "Name",
            headerTh: "ชื่อ",
          },
          {
            field: "PositionNameEn",
            headerEn: "Position",
            headerTh: "ตำแหน่ง",
          },
          {
            field: "DepartmentNameEn",
            headerEn: "Department",
            headerTh: "หน่วยงาน",
          },
        ]}
        dialogVisible={dialogVisible}
        setDialogVisible={showModal}
      />
      {/* <Dialog
        header={renderHeader}
        visible={dialogVisible}
        style={{ width: "60vw", borderRadius: "16px" }}
        onHide={showModal}
        className="requestor-dialog"
        // dismissableMask
        draggable={false}
        resizable={false}
        closable={true}
      >
        <DataTable
          paginator
          rows={5}
          value={searchData}
          selectionMode="single"
          tableStyle={{
            border: "1px solid #e6e6e6",
            outlineColor: "#e6e6e6",
          }}
          dataKey="id"
          responsiveLayout="scroll"
          onRowSelect={onRowSelect}
          sortField="EmployeeCode"
          sortOrder={1}
        >
          <Column
            field="EmployeeCode"
            header={
              <tr>
                <th>
                  <p className="row headtext">EmployeeCode</p>
                  <p className="row subtext">รหัสพนักงาน</p>
                </th>
              </tr>
            }
            className={"showId"}
            body={(rowData: any) => {
              return (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Tooltip target=".showId" />
                  {rowData.EmployeeCode}
                  {isAdmin && (
                    <i
                      className="showId pi pi-info-circle"
                      data-pr-tooltip={"EmployeeId:" + rowData.EmployeeId}
                      data-pr-position="top"
                      data-pr-at="right+5 top"
                      data-pr-my="left center-2"
                      style={{ fontSize: "1.5em", cursor: "pointer" }}
                    ></i>
                  )}
                </div>
              );
            }}
            sortable
          ></Column>
          <Column
            field={props.userData.Lang === "EN" ? "NameEn" : "NameTh"}
            header={
              <tr>
                <th>
                  <p className="row headtext">Name</p>
                  <p className="row subtext">ชื่อ</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field={
              props.userData.Lang === "EN" ? "PositionNameEn" : "PositionNameTh"
            }
            header={
              <tr>
                <th>
                  <p className="row headtext">Position</p>
                  <p className="row subtext">ตำแหน่ง</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field={
              props.userData.Lang === "EN"
                ? "DepartmentNameEn"
                : "DepartmentNameTh"
            }
            header={
              <tr>
                <th>
                  <p className="row headtext">Department</p>
                  <p className="row subtext">หน่วยงาน</p>
                </th>
              </tr>
            }
          ></Column>
        </DataTable>
      </Dialog> */}

      <Toast ref={toast} position="top-right"></Toast>
    </div>
  );
};
