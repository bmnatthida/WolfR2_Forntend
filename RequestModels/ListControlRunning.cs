using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.RequestModels
{
    public class ListControlRunning
    {
        public int TemplateId { get; set; }
        public int? CreateBy { get; set; }
        public string Prefix { get; set; }
        public string Digit { get; set; }
        public string? RunningNumber { get; set; }
    }
}
