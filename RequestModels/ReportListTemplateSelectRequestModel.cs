using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class ReportListTemplateSelectRequestModel : BaseBodyModel
    {
             public int? ReportTemplateId { get; set; }
        
             public string TemplateID { get; set; }
     
             public string Templateversion { get; set; }
    }
}
