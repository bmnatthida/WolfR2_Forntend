using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.DtoModels;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class ListApprovaWithTemplateRequestModel : BaseBodyModel
    {

        public TemplateModel templateForm { get; set; }
        public List<ListApprovArrayDto> lstTRNLineApprove { get; set; }
        public EmployeeDto VEmployee { get; set; }

        public string SecretId { get; set; }
        public decimal Amount { get; set; }

        public int? ComCode { get; set; }
        public string JsonCondition { get; set; }


    }
}
