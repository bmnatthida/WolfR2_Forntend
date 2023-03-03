using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.RequestModels;

namespace WolfR2.Models
{
    public class GetLoadDataFormControlModel
    {
        public string LogicId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
       
    }
    public class GetLoadLineApproveFormControlModel
    {
        public string connectionString { get; set; }
        public string JsonCondition { get; set; }
        public int ComCode { get; set; }
        public MemoDetailRequestModel templateForm { get; set; }
        public EmployeeRequestModel employee { get; set; }
        public List<LstTrnLineApproveRequestModel> lstTRNLineApprove { get; set; }

        public decimal Amount { get; set; }

    }
    public class TemplateForm
    {
        public int TemplateId { get; set; }
        public bool AutoApprove { get; set; }
        public string AutoApproveWhen { get; set; }
        public int? TemplateApproveId { get; set; }
    }
}
