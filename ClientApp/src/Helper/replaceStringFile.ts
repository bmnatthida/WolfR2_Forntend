export const replaceSpecialChar =(str:string)=>
{
    if (str.length ===0)
        return str;
    str = str.replace(" ", "_");
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
    str = str.replace("/", "_");
    str = str.replace("[", "_");
    str = str.replace("]", "_");
    str = str.replace("{", "_");
    str = str.replace("}", "_");
    str = str.replace(":", "_");
    str = str.replace("~", "_");
    return str;
}