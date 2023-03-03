using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class TemplateDto
    {
        public int? TemplateId { get; set; }
        public string GroupTemplateName { get; set; }
        public string TemplateName { get; set; }
        public string TemplateNameWithCode { get { return DocumentCode + " : " + TemplateName; } }
        public int? DepartmentId { get; set; }
        public string DocumentCode { get; set; }
        public bool? isPublic { get; set; }
        public string ReportLang { get; set; }
        public string TemplateDetail { get; set; }
        public string TemplateSubject { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? IsActive { get; set; }
        public string? isEditing { get; set; } = "false";
        public string? isPublishVersion { get; set; } = "false";


    }
}
