using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.RequestModels;

namespace WolfR2.Models
{
    public class RequsePageModel:BaseBodyModel
    {
        public int memoid { get; set; }
        public string SecretId { get; set; }
        public string EmployeeId { get; set; }
        public EmployeeRequestModel actor { get; set; }
        public string? DocumentCode { get; set; }
        public int? TemplateId { get; set; }
        public string? DocumentNo { get; set; }

    }
}
