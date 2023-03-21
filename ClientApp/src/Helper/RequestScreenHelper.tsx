import {
  IAutoNumberAttibute,
  IAutoNumberFormat,
  IFormat,
} from "../IRequestModel/IAutoNumberFormat";
import { GetAutoNumber } from "../Services/RequestControlService";

export async function genAutoNum(
  _control: any,
  autoNumFormat: IAutoNumberAttibute,
  template_id: any
) {
  try {
    if (autoNumFormat.formats.length > 0) {
      let autoNumberAttibute: IAutoNumberAttibute = autoNumFormat;
      let str: string[] = [];
      let isCheck: boolean = false;
      let requestBody: any = {};
      let formats: IAutoNumberFormat[] = autoNumberAttibute.formats;
      let choiceFormat = null;
      for (let i = 0; i < formats.length; i++) {
        if (formats[i].condition.length > 0) {
          const con = formats[i].condition;
          let dd = null;
          for (let j = 0; j < con.length; j++) {
            _control.forEach((item: any, rowIdx: number) => {
              item.layout.forEach((layout: any) => {
                if (con[j].label === layout.template.label) {
                  if (con[j].value === layout.data.value) {
                    dd = formats[i];
                  }
                }
              });
            });
          }
          if (dd) {
            choiceFormat = dd;
            break;
          }
        } else {
          choiceFormat = formats[i];
          break;
        }
      }
      if (choiceFormat !== null) {
        choiceFormat.format.map((format: any) => {
          _control.forEach((item: any, rowIdx: number) => {
            item.layout.forEach(async (layout: any) => {
              if (format.type === "pf") {
                if (!str.includes(format.label)) {
                  str.push(format.label);
                }
              } else if (layout.template.label === format.label) {
                let value: string = layout.data.value;
                if (value !== null) {
                  if (value.indexOf("(") > 0 && value.indexOf(")")) {
                    str.push(
                      value.substring(
                        value.indexOf("(") + 1,
                        value.indexOf(")")
                      )
                    );
                  } else {
                    str.push(value);
                  }
                }
              }
            });
          });
        });
        console.log("auto=>str", { str, choiceFormat });
        console.log("auto=>strlength",str.length);
        if (str.length === choiceFormat.format.length) {
          if (!str.includes("--Select--") && !str.includes("--select--") 
          && !str.includes("-- Please Select --") && !str.includes("-- Please Select --") ) {
            isCheck = true;
          }
        }
      }
      if (isCheck) {
        const showSymbol = autoNumFormat.showSymbol;
        let prefix = "";
        if (showSymbol) {
          prefix = str.join("-") + "-";
        } else {
          prefix = str.join("");
        }
        autoNumFormat.fisrtPreix = prefix;
        requestBody.Prefix = prefix;
        requestBody.Digit = autoNumFormat.digit;
        requestBody.TemplateId = template_id;
        const dd = await GetAutoNumber(requestBody);
        if (dd.Message !== undefined) {
        } else {
          _control[autoNumberAttibute.rowIndex].layout[
            autoNumberAttibute.colIndex
          ].data.value = dd;
        }
      } else if (!isCheck) {
        _control[autoNumberAttibute.rowIndex].layout[
          autoNumberAttibute.colIndex
        ].data.value = "";
      }

      return _control;
    }
  } catch (error) {
    console.log("auto=>error", error);
  }
}

const genStringForAutoNumber = (formats: IFormat[]) => {
  console.log("auto=>formats", formats);
  return formats;
};

const checkIsAutoHavePF = (
  templateLabel: string,
  formats: IAutoNumberFormat[]
) => {
  let isTrue: boolean = false;

  formats.forEach((formats: IAutoNumberFormat) => {
    formats.format.forEach((fm: IFormat) => {
      if (fm.type !== "pf") {
        if (fm.label === templateLabel) {
          isTrue = false;
        }
      }
    });
  });

  return isTrue;
};
