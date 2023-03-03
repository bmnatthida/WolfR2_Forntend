import moment from "moment";
import { GetAllDynamic, updateDynamic } from "../Services/DynamicService";

export const exportExcel = (
  fileName: string,
  data: any[],
  setLoad?: (val: boolean) => void
) => {
  const excelData = [...data];

  import("xlsx").then((xlsx: any) => {
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    if (setLoad) {
      setLoad(true);
    }
    saveAsExcelFile(
      excelBuffer,
      fileName + " : " + moment(new Date()).format("DD MMM YYYY")
    );
    if (setLoad) {
      setLoad(false);
    }
  });
};

const formatDate = (value: any) => {
  if (value != "") {
    let someDateString = moment(value, "DD/MM/YYYY HH:mm:ss");
    const NewDate = moment(someDateString).format("DD MMM yyyy");
    return NewDate;
  } else {
    return "";
  }
};

const saveAsExcelFile = async (buffer: any, fileName: any) => {
  await import("file-saver").then((FileSaver: any) => {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data = new Blob([buffer], {
      type: EXCEL_TYPE,
    });

    FileSaver.saveAs(data, fileName + "_export_" + EXCEL_EXTENSION);
  });
};

export const importExcel = async (e: any, apiName: string) => {
  try {
    const file = e.target.files[0];

    return import("xlsx").then((xlsx) => {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const wb = xlsx.read(e.target.result, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
        const cols: any = data[0];
        data.shift();
        let _importedData = data.map((d: any) => {
          return cols.reduce((obj: any, c: any, i: any) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });
        console.log("table=>_importedData", _importedData);

        if (_importedData.length !== 0) {
          for (let i = 0; i < _importedData.length; i++) {
            const element = _importedData[i];
            var apiNamereplace = apiName?.replace("/GetAll", "");
            let res = await updateDynamic(apiNamereplace, element);
            if (res.result === "success") {
              let _dataDynamic = await GetAllDynamic(apiName, undefined);
              return { respone: true, data: _dataDynamic };
            } else {
              return { respone: false };
            }
          }
        } else {
          return { respone: false };
        }
      };
      reader.readAsArrayBuffer(file);
    });
  } catch (error: any) {
    return { respone: false, data: error };
  }
};
