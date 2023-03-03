using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class DelegateDto
    {
        public int? DelegateId { get; set; }
        public int? ApproverId { get; set; }
        public string? Approver { get; set; }
        public int? AssignedId { get; set; }
        public string? Delegate_To { get; set; }
        public DateTimeOffset? DateFrom { get; set; }
        public DateTimeOffset? DateTo { get; set; }
        public string? Remark { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
    }
}
