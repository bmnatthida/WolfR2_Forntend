using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.RequestModels;

namespace WolfR2.Models
{
    public class MemoModel : BaseBodyModel
    {
        public int memoid { get; set; }
        public string? EmployeeId { get; set; }
        public EmployeeRequestModel? actor { get; set; }

    }
}
