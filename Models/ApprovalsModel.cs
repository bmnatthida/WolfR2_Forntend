using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ApprovalsModel : BaseBodyRequestModel
    {

        public int memoid { get; set; }
        public string SecretId { get; set; }

    }
}
