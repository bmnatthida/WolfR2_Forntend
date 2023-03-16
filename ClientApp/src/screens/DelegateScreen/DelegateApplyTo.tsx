import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
type Props = {
  delegateData: any;
  setDelegateData: any;
};

const DelegateApplyTo = (props: Props) => {
  const [delegateTemplate, setDelegateTemplate] = useState<any[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
  useEffect(() => {
    fetchDelegateTemplate();
  }, [props.delegateData]);
  const fetchDelegateTemplate = async () => {
    const dataJson = {
      ApproverId: props.delegateData.DelegateList.ApproverId,
    };
    const dd = await fetch(
      "api/DelegateList/GetByDelegateTemplateByApproverId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataJson),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let templateData = data;
        const _delegateDetail = props.delegateData.DelegateDetail;
        let selected: any = [];
        let current_sorted_idx = 0;
        for (let i = 0; i < _delegateDetail.length; i++) {
          const detail = _delegateDetail[i];
          for (let j = 0; j < templateData.length; j++) {
            const template = templateData[j];
            if (detail.TemplateId === template.TemplateId) {
              const target = templateData[current_sorted_idx];
              const current = template;
              templateData[j] = target;
              templateData[current_sorted_idx] = current;
              current_sorted_idx += 1;
              selected.push(template);
            }
          }
        }
        setSelectedCustomers([...selected]);
        setDelegateTemplate([...templateData]);
      });
  };

  return (
    <div>
      DelegateApplyTo
      <div className="table-container">
        <DataTable
          paginator
          rows={10}
          value={delegateTemplate}
          filterDisplay="row"
          filters={{
            TemplateName: {
              value: null,
              matchMode: FilterMatchMode.CONTAINS,
            },
          }}
          tableStyle={{
            border: "1px solid #e6e6e6",
            outlineColor: "#e6e6e6",
          }}
          selection={selectedCustomers}
          onSelectionChange={(e) => {
            // const _delagateTemplate: any = e.value.map((data: any) => {
            //   const res = { TemplateId: data.TemplateId };
            //   return res;
            // });
            // console.log("_delagateTemplate", _delagateTemplate);
            props.setDelegateData((prevState: any) => ({
              ...prevState,
              DelegateDetail: [...e.value],
            }));
            setSelectedCustomers(e.value);
          }}
          dataKey="TemplateId"
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3em" }}
          ></Column>
          {/* doc code */}
            <Column
            field="DoccumentCode"
            filter
            filterPlaceholder="Search by Doccument Code"
            header={
              <tr>
                <th>
                  <p className="row headtext">DoccumentCode</p>
                  <p className="row subtext">รหัสเอกสาร</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="TemplateName"
            filter
            filterPlaceholder="Search by form name"
            header={
              <tr>
                <th>
                  <p className="row headtext">Form name</p>
                  <p className="row subtext">ชื่อแบบฟอร์ม</p>
                </th>
              </tr>
            }
          ></Column>
          <Column
            field="Total"
            header={
              <tr>
                <th>
                  <p className="row headtext">Total</p>
                  <p className="row subtext">ทั้งหมด</p>
                </th>
              </tr>
            }
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default DelegateApplyTo;
