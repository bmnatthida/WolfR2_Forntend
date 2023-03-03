using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class TemLineApproveDto
    {
        public int TemLineId { get; set; }
        public int TemplateId { get; set; }
        public int Seq { get; set; }
        public int? MaxLevelId { get; set; }
        public int? ApprovalMatrixId { get; set; }
        public int ApproveType { get; set; }
        public int? CompanyCode { get; set; }
        public string Conditions { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? IsActive { get; set; }
        public List<LstConditionDto> LstCondition { get; set; }
    }
}
