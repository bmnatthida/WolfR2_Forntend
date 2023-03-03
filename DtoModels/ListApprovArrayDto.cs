using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ListApprovArrayDto
    {
        public EmployeeDto approver { get; set; }
        public int emp_id { get; set; }
        public int lineid { get; set; }
        public string signature_en { get; set; }
        public int signature_id { get; set; }
        public string signature_th { get; set; }
    }
}
