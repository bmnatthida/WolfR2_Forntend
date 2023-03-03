using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class RoleRequestModel : BaseBodyRequestModel
    {
        public int RoleId { get; set; }

        public string NameTh { get; set; }

        public string NameEn { get; set; }

        public string RoleDescription { get; set; }

        public bool IsActive { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedDate { get; set; }

        public string ModifiedBy { get; set; }

        public string ModifiedDate { get; set; }

    }
}
