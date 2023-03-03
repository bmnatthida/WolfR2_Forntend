using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.RequestModels
{
    public class ListApprovalDetailsRequestModel
    {
        public EmployeeRequestModel approver { get; set; }
        public int lineid { get; set; }
        public int memoid { get; set; }
        public int sequence { get; set; }
        public int emp_id { get; set; }
        public int signature_id { get; set; }
        public string signature_th { get; set; }
        public string signature_en { get; set; }
    }
}
