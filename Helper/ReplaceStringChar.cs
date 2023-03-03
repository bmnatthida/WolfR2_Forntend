using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace WolfR2.Helper
{
    public class ReplaceStringChar
    {


            public static string ReplaceSpecialChar(string str)
            {
                if (str == String.Empty)
                    return String.Empty;
                str = str.Replace(" ", "_");
                str = str.Replace("'", "_");
                str = str.Replace(";", "_");
                str = str.Replace(",", "_");
                str = str.Replace("?", "_");
                str = str.Replace("<", "_");
                str = str.Replace(">", "_");
                str = str.Replace("(", "_");
                str = str.Replace(")", "_");
                str = str.Replace("@", "_");
                str = str.Replace("=", "_");
                str = str.Replace("+", "_");
                str = str.Replace("*", "_");
                str = str.Replace("&", "_");
                str = str.Replace("#", "_");
                str = str.Replace("%", "_");
                str = str.Replace("$", "_");
                str = str.Replace("|", "_");
                str = str.Replace("/", "_");
                str = str.Replace("[", "_");
                str = str.Replace("]", "_");
                str = str.Replace("{", "_");
                str = str.Replace("}", "_");
                str = str.Replace(":", "_");
                str = str.Replace("~", "_");
                return str;
            }

    }
}