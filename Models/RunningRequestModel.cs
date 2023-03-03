using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class RunningRequestModel : BaseBodyRequestModel
    {
        public int TemplateId { get; set; }
        public string Prefix { get; set; }
        public string Digit { get; set; }
        public string? RunningNumber { get; set; }

    }
}
