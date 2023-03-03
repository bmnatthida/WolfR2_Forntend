import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import "../../RequestComponents/InformationComponent/InformationComponent.css";
import { Col, Row } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { TextHeaderComponents } from "../../TextHeaderComponents/TextHeaderComponents";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import "../ReferenceDocumentComponents/ReferenceDocumentComponents.css";
interface Props {
  name: string;
  dataList: any;
  columns: any[];
  loading: boolean;
  setLoading: any;
  updateData: any;
}

function SelectDataFormTable(props: Props) {
  const [globalFilterValue1, setGlobalFilterValue1] = useState<any>("");
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const [filters1, setFilters1] = useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const dynamicColumns = props.columns.map((col: any) => {
    let field = "";
    if (userData.employeeData.Lang === "EN") {
      field = col.field.replace("Th", "En");
    } else {
      field = col.field.replace("En", "Th");
    }
    return <Column key={field} field={field} header={col.header} />;
  });

  return (
    <div>
      <Row>
        <Col className="row-formgroup">
          <Row>
            <Col xs={1} sm={1} xl={1}>
              <TextHeaderComponents
                textHeaderProps={"Search"}
                textSubProps={"ค้นหา"}
              />
            </Col>
            <Col xs={11} sm={11} xl={11}>
              <InputText
                onChange={(e: any) => {
                  const value = e.target.value;
                  let _filters1 = { ...filters1 };
                  _filters1["global"].value = value;

                  setFilters1(_filters1);
                  setGlobalFilterValue1(value);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <DataTable
                id={"table"}
                value={props.dataList}
                paginator
                size="small"
                filters={filters1}
                rows={5}
                rowHover
                onRowClick={(e: any) => {
                  props.updateData(e.data);
                }}
                responsiveLayout="scroll"
              >
                {dynamicColumns}
              </DataTable>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default SelectDataFormTable;
