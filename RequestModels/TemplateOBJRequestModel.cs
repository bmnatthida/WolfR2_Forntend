using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class TemplateOBJRequestModel:BaseBodyModel
    {
        public int? TemplateId { get; set; }
      
            public string? CreatedBy { get; set; }

        public string? TemplateVersionCode { get; set; }
        public string? VersionTemplate { get; set; }
    }
}
