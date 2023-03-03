using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ApprovalMatrixItemDto
    {
        public int ApproveMatrixId { get; set; }
        public int ApproveMatrixItemId { get; set; }
        public int? Seq { get; set; }
        public int? PositionLevelId { get; set; }
        public string NameTh { get; set; }
        public string NameEn { get; set; }
        public int? CreatedBy { get; set; }
        public string? CreatedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public string? ModifiedDate { get; set; }
        public int? ApproverId { get; set; }
        public bool IsActive { get; set; }
        public bool? AccountId { get; set; }
        public string? AmountFrom { get; set; }
        public string? AmountTo { get; set; }
        public string? ListcustomMatrixId { get; set; }
       
    }
}
