using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ListLineApproveWithTemplateDto
    {
        public EmployeeDto approver { get; set; }
        public int lineid { get; set; }
        public int memoid { get; set; }
        public int sequence { get; set; }
        public int emp_id { get; set; }
        public int signature_id { get; set; }
        public string signature_th { get; set; }
        public string signature_en { get; set; }
        public int modifiedby { get; set; }
        public string modifieddate { get; set; }
        public int TemLineId { get; set; }
        public int ApproveType { get; set; }
        public string userPrincipalName { get; set; }
        public string connectionString { get; set; }
        public string SecretId { get; set; }



    }
}
