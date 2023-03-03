using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WolfR2.Helper
{
    public class GeneratePassword
    {
        public static String generatePassword(String sPassword)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] bytes = Encoding.Default.GetBytes(sPassword);
            byte[] encoded = md5.ComputeHash(bytes);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < encoded.Length; i++)
                sb.Append(encoded[i].ToString("x2"));
            return sb.ToString();
        }
    }
}
