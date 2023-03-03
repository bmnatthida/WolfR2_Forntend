using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.RequestModels;

namespace WolfR2.Models
{
    public class ApproveMatrixUpdateModel
    {
       public ApprovalMatrixRequestModel approvalMatrix { get; set; }
        public List<ApproveMatrixItemRequestModel> approveMatrixItems { get; set; }
    }
}
