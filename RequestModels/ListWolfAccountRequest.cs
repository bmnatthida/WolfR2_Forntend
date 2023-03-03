using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ListWolfAccountRequest:BaseBodyRequestModel
    {
        public string ContactCode { get; set; }
        public string Note { get; set; }
        public string Remark { get; set; }
        public string Description { get; set; }
    }
}
