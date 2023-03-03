using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class TaskGorupModel
    {
        public string task { get; set; }
        public string empId { get; set; }
        public int CountMoreItem { get; set; }
        public int iItemPerMore { get; set; }
        public string FilterText { get; set; }
        public string FilterDateFrom { get; set; }
        public string FilterDateTo { get; set; }

    }
}
