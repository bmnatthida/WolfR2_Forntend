using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ApproveMatrixListDto
    {
        public long ApproveMatrixId { get; set; }
        public long ApproveMatrixItemId { get; set; }
        public long PositionLevelId { get; set; }
        public string NameTh { get; set; }
        public string NameEn { get; set; }
        public string AmountFrom_AmountTo { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public string ModifiedDate { get; set; }
        public long ApproverId { get; set; }
        public bool IsActive { get; set; }
        public bool AccountId { get; set; }
        
       
    }
}
