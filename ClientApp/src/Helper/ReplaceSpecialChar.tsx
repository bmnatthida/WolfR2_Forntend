export function replaceSpecialChar(str: string) {
  if (str === "") return "";
  str = str.replace(/ /g, "_");
  str = str.replace("'", "_");
  str = str.replace(";", "_");
  str = str.replace(",", "_");
  str = str.replace("?", "_");
  str = str.replace("<", "_");
  str = str.replace(">", "_");
  str = str.replace("(", "_");
  str = str.replace(")", "_");
  str = str.replace("@", "_");
  str = str.replace("=", "_");
  str = str.replace("+", "_");
  str = str.replace("*", "_");
  str = str.replace("&", "_");
  str = str.replace("#", "_");
  str = str.replace("%", "_");
  str = str.replace("$", "_");
  str = str.replace("|", "_");
  str = str.replace("[", "_");
  str = str.replace("]", "_");
  str = str.replace("{", "_");
  str = str.replace("}", "_");
  str = str.replace(":", "_");
  str = str.replace("~", "_");
  return str;
}
