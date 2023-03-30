using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class TemLineApproveRequestModel:BaseBodyRequestModel
    {
        public int TemLineId { get; set; }
        public int TemplateId { get; set; }
        public int? Seq { get; set; }
        public int? MaxLevelId { get; set; }
        public int? ApprovalMatrixId { get; set; }
        public int ApproveType { get; set; }
        public int? CompanyCode { get; set; }
        public string? Conditions { get; set; }
        public string? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsParallel { get; set; }
        public bool? IsApproveAll { get; set; }
        public int? ApproveSlot { get; set; }


        //[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        //public List?<LstCondition> LstCondition { get; set; }
    }
}
