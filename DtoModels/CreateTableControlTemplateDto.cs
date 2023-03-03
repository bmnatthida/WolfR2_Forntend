using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class CreateTableControlTemplateDto
    {
        public int? TemplateId { get; set; }
        public string TemplateName { get; set; }
        public string TemplateNameWithCode { get; set; }
        public string DocumentCode { get; set; }
    }
}
