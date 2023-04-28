using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class TemplateRefValidateRequestModel:BaseBodyModel
    {
        public int? TemplateId { get; set; }
      
        public string? DocNo { get; set; }

        public string? Label { get; set; }
    }
}
