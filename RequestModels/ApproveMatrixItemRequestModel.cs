using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ApproveMatrixItemRequestModel : BaseBodyRequestModel
    {
        public int? ApproveMatrixId { get; set; }
        public int? ApproveMatrixItemId { get; set; }
        public int? Seq { get; set; }
        public string? AmountFrom { get; set; }
        public string? AmountTo { get; set; }
        public int? PositionLevelId { get; set; }
        public string? PositionLevelName { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsTypePosition { get; set; }
        public int? ApproverId { get; set; }
        public string? ApproverName { get; set; }

    }
    
}
