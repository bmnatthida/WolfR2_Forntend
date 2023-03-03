import moment from "moment";
import { IDateAttribute } from "../IRequestModel/ITemplateDescModel";

export const formatDateTime = (value: any, originFormat?: string) => {
  if (value != "") {
    let someDateString = moment(
      value,
      originFormat ? originFormat : "DD/MM/YYYY HH:mm:ss"
    );
    const NewDate = moment(someDateString).format("DD MMM yyyy");
    return NewDate;
  } else {
    const NewDate = "";
    return NewDate;
  }
};

export const getTimeFormat = (format: IDateAttribute) => {
  const symbol =
    format.time.symbol !== ":" && format.time.symbol !== ""
      ? format.time.symbol
      : ":";
  const timeFormat =
    format.time.use === "Y"
      ? `HH${symbol}mm${format.time.useSecond === "Y" ? `${symbol}ss` : ""}`
      : "";
  return timeFormat;
};

export const getDateFormat = (format: IDateAttribute) => {
  const dateFormat =
    "DD" +
    (format.date.symbol !== "" ? format.date.symbol : " ") +
    "MMM" +
    (format.date.symbol !== "" ? format.date.symbol : " ") +
    `YYYY${getTimeFormat(format)}`;

  return dateFormat;
};
