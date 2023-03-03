using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ReportListDto
    {
        public int ReportTemplateId { get; set; }
        public string ReportName { get; set; }
        public string TemplateId { get; set; }
        public string ReportDescription { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public string ModifiedDate { get; set; }
    }
}
