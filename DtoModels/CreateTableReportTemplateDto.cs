using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class CreateTableReportTemplateDto
    {
        public int? ReportTemplateId { get; set; }
        public string ReportName { get; set; }
        public string TemplateId { get; set; }
    }
}
