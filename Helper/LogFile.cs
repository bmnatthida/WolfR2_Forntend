using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Constants;

namespace WolfR2.Helper
{
    public class LogFile
    {
        public static void WriteLogFile(String iText, String module)
        {
            var connString = Startup.StaticConfig.GetSection("AppSettings:LogPath");
            var baseDirectory = "";
            if (!connString.Value.Contains(':'))
            {
                baseDirectory = AppDomain.CurrentDomain.BaseDirectory + connString.Value;
            }
            else
            {
                baseDirectory = connString.Value;
            }
            if (!Directory.Exists(baseDirectory))
            {
                Directory.CreateDirectory(baseDirectory);
            }
            String LogFilePath = String.Format("{0}{1}_{2}_Log.txt", baseDirectory, DateTime.Now.ToString("dd-MM-yyyy"), module);
            try
            {
                using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(LogFilePath, true))
                {
                    System.Text.StringBuilder sbLog = new System.Text.StringBuilder();
                    String[] ListText = iText.Split('|').ToArray();

                    foreach (String s in ListText)
                    {
                        sbLog.AppendLine(s);
                    }

                    outfile.WriteLine(string.Format("{0} - {1}", DateTime.Now.ToString("HH:mm:ss tt"), sbLog.ToString()));
                }
            }
            catch { }
        }
        public static void WriteLogFileUAT(String iText)
        {
            String LogFilePath = String.Format("{0}{1}_Log.txt", LogPathConstants.PathUAT, DateTime.Now.ToString("ddMMyyyy"));
            try
            {
                using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(LogFilePath, true))
                {
                    System.Text.StringBuilder sbLog = new System.Text.StringBuilder();
                    String[] ListText = iText.Split('|').ToArray();

                    foreach (String s in ListText)
                    {
                        sbLog.AppendLine(s);
                    }

                    outfile.WriteLine(string.Format("{0} - {1}", DateTime.Now.ToString("HH:mm:ss"), sbLog.ToString()));
                }
            }
            catch { }
        }

    }
}
