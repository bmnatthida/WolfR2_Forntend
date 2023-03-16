import {
  GetAttachmentFilesByMemoId,
  GetMemoById,
  GetRefDocFormTable,
} from "../Services/MemoService";
import { formatColumn } from "./formatColumn";

export type RefResult = {
  items: any[];
  listRefDocsDetail: any[];
  listFileAttachDetails: any[];
  errorMessage?: string;
};

export const onChanceRef = (
  refTempSelected: any,
  memoDetail: any,
  listFormNames: any,
  refAttribute: any,
  currentTemp: any,
  _onControlChange: (
    controlTemplate: any,
    controlValue: any,
    isInTable: boolean,
    isRef: boolean
  ) => void
) => {
  let result: RefResult = {
    items: [],
    listRefDocsDetail: [],
    listFileAttachDetails: [],
  };

  try {
    if (memoDetail) {
      if (
        refTempSelected !== undefined &&
        refTempSelected !== null &&
        refTempSelected.length > 0
      ) {
        let template_desc = currentTemp;
        let _listRefDocsDetail: any[] = [];
        let listFileAttachDetails: any[] = [];
        let docsCode: any[] = [];
        let refTemp: any;
        const refColumn = JSON.parse(listFormNames?.RefDocColumn);
        if (
          listFormNames?.RefTemplate !== "" &&
          listFormNames?.RefTemplate !== null
        ) {
          refTemp = JSON.parse(listFormNames?.RefTemplate);
          refTemp.map((temp: any) => {
            if (temp.DocumentCode !== "") {
              docsCode.push(temp.DocumentCode);
            }
          });
        }

        refTempSelected.map(async (refTems: any) => {
          let refDocDetail = {
            memoRefdoc_id: refTems.MemoId,
            doc_no: refTems.DocumentNo,
            template_ID: listFormNames?.template_id,
            template_Name: listFormNames?.template_name,
            memoSubject: listFormNames?.subject,
          };
          console.log("refTems", refDocDetail);
          console.log("listFormNames", listFormNames);
          const selectedColumn = JSON.parse(refTems.MAdvancveForm);
          let valibCol: any[] = [];
          _listRefDocsDetail.push(refDocDetail);
          // docsCode.map((code: any) => {
          refColumn.map((col: any) => {
            if (col.Value !== null && col.Value !== "") {
              if (col.Value === "_DocumentNo") {
                col.ControlValue = { value: refTems.DocumentNo };
              } else if (col.Value === "_DocumentAmount") {
                col.ControlValue = { value: refTems.Amount };
                // getLineApproveForAmount(refTems.Amount, "", "ref");
              } else {
                let selColLabel = "";
                if (col.Value.indexOf("_") !== -1) {
                  let colLabel = col.Value.split("_");
                  selColLabel = colLabel[1];
                } else {
                  selColLabel = col.Value;
                }
                if (col.TypeControl === "Table") {
                  let sourceRow: any = -1;
                  let sourceCols: any[] = [];
                  let targetPositions: any[] = [];
                  let originDefaultValue = "";
                  selectedColumn.items.map((selCol: any, rowIdx: number) => {
                    selCol.layout.map((_layout: any) => {
                      if (selColLabel === _layout.template.label) {
                        col.objTable?.map(
                          (objTable: any, tarColIdx: number) => {
                            if (objTable?.Value !== null) {
                              _layout.template.attribute.column.map(
                                (refTable: any, colIdx: number) => {
                                  if (refTable.label === objTable.Value) {
                                    // originDefaultValue =
                                    sourceRow = rowIdx;
                                    sourceCols.push({
                                      colIdx: colIdx,
                                    });
                                    targetPositions.push(tarColIdx);
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    });
                  });
                  if (sourceRow > -1) {
                    let tableRows: any[] = [];
                    if (refAttribute?.mode !== "Single") {
                      //adding if condition to check value of colcontrol
                      if (col.ControlValue) {
                        tableRows = col.ControlValue;
                      }
                    }
                    selectedColumn.items[sourceRow].layout[0]?.data?.row?.map(
                      (row: any) => {
                        let newRow: any[] = [];

                        for (let i = 0; i < col.objTable.length; i++) {
                          newRow.push({ value: null });
                        }

                        sourceCols.map((col: any, colIdx: number) => {
                          newRow[targetPositions[colIdx]] = row[col.colIdx];
                        });
                        if (newRow.length > 0) {
                          tableRows.push(newRow);
                        }
                      }
                    );
                    console.log("tableRows", tableRows);
                    col.ControlValue = tableRows;
                  }
                } else {
                  selectedColumn.items.map((selCol: any) => {
                    selCol.layout.map((_layout: any) => {
                      if (_layout.template.label === selColLabel) {
                        col.ControlValue = _layout.data;
                      }
                    });
                  });
                }
              }
              valibCol.push(col);
            }
          });
          // });
          // log
          console.log("ref=>valibCol", valibCol);
          template_desc.map((item: any, rowIdx: number) => {
            item.layout.map((_layout: any, colIdx: number) => {
              valibCol.map((col: any) => {
                if (col.ControlValue) {
                  if (
                    col.TypeControl === "Table" &&
                    _layout.template.type === "tb"
                  ) {
                    if (col.Key === _layout.template.label) {
                      if (
                        JSON.stringify(_layout.data.row) !==
                        JSON.stringify(col.ControlValue)
                      ) {
                        _layout.template.attribute.column.forEach(
                          (originCol: any, _colIdx: number) => {
                            col.ControlValue.map((refCol: any) => {
                              if (refCol[_colIdx].value === null) {
                                if (
                                  originCol.control.template.attribute
                                    .default !== ""
                                ) {
                                  refCol[_colIdx].value =
                                    originCol.control.template.attribute.default;
                                }
                              }
                            });
                          }
                        );

                        // if (col.ControlValue[colIdx] === null) {
                        //   console.log("ref=>_layout", _layout);
                        // }
                        // console.log("ref=>");
                        _layout.data.row = [...col.ControlValue];
                      }
                    }
                  }
                } else {
                  if (col.Key === _layout.template.label) {
                    if (_layout.data?.value !== col.ControlValue?.value) {
                      _layout.data = col.ControlValue;
                      console.log("col_ControlValue", col.ControlValue);
                    }
                  }
                }
              });
            });
          });
          if (
            listFormNames.RefDocDisplay.split(",")[5] &&
            listFormNames.RefDocDisplay.split(",")[5] === "Yes"
          ) {
            let _res: any[] = [];
            await getMemoForAttch(refTems.MemoId).then((e: any) => {
              if (e) {
                result.listFileAttachDetails = [...listFileAttachDetails, ...e];
              }
            });
          }
        });

        result.items = template_desc;
        result.listRefDocsDetail = _listRefDocsDetail;
        console.log("ref=>result", result);
      }
    }

    return result;
  } catch (error: any) {
    console.log("ref=>error", error);

    result.errorMessage = error;
    return result;
  }
};

const getMemoForAttch = async (memoId: number) => {
  const requestBody = {
    memoid: memoId,
  };
  let res: any[] = [];
  await GetAttachmentFilesByMemoId(requestBody).then((e: any) => {
    res = e;
  });
  return res;
};

export const fetchRefDocFormTable = async (memoDetail: any, template: any) => {
  let tempAtt = template.attribute;
  if (tempAtt !== undefined) {
    if (tempAtt.refdoc !== undefined) {
      const dataRequest = {
        PageIndex: 0,
        PageSize: 0,
        CUserID: memoDetail.creator.EmployeeId.toString(),
        RUserID: memoDetail.requestor.EmployeeId.toString(),
        ConditionRefdoc:
          tempAtt.conditionrefdoc.length > 0
            ? JSON.stringify(tempAtt.conditionrefdoc)
            : "",
        Search: "",
        docDataSource: tempAtt.refdoc.docDataSource,
        docReport: tempAtt.refdoc.docReport,
        docCancelDoc: tempAtt.refdoc.docCancelDoc,
        docEditDoc: tempAtt.refdoc.docEditDoc,
        docNewDoc: tempAtt.refdoc.docNewDoc,
        doccontrol: tempAtt.refdoc.doccontrol !== "N",
        docref: tempAtt.refdoc.docref,
      };

      const refDetails = await GetRefDocFormTable(dataRequest);

      if (refDetails) {
        if (refDetails?.dt_Report?.length > 0) {
          // let refColumn: any[] = [];
          // Object.keys(refDetails.dt_Report[0]).map((key: any) => {
          //   if (!key.includes("Memo_")) {
          //     refColumn.push({ key: key, header: key });
          //   }
          // });
          // setRefDocOptions([...refDetails.dt_Report]);
          return refDetails.dt_Report;
        } else {
          return [];
        }
      }
    }
  }
};
