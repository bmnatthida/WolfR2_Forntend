using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class UpdateSignatureRequestModel : BaseBodyRequestModel
    {
        public int? EmployeeId { get; set; }
        public string? SignPicPath { get; set; }

        public string? ModifiedDate { get; set; }

        public string? ModifiedBy { get; set; }
    }
}
