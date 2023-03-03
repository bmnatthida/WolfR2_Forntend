using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ResponseModel
    {
        public string result { get; set; }
        public string errorMessage { get; set; }
        public string errorCode { get; set; }
        public string data { get; set; }
    }
}
