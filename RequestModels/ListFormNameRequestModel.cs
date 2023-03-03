using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.RequestModels
{
    public class ListFormNameRequestModel
    {
        public int TemplateId { get; set; }
        public string TemplateName { get; set; }
        public int DepartmentId { get; set; }
        public string DocumentCode { get; set; }
        public bool isPublic { get; set; }
        public string ReportLang { get; set; }
        public string TemplateDetail { get; set; }
        public string ToId { get; set; }
        public string CcId { get; set; }
        public string TemplateSubject { get; set; }
        public bool AutoApprove { get; set; }
        public string TextForm { get; set; }
        public string AdvanceForm { get; set; }
        public bool IsTextForm { get; set; }
        public string AutoApproveWhen { get; set; }
        public bool ApproverCanEdit { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsActive { get; set; }
        public bool isRequesterEditApproval { get; set; }
        public string RefDocColumn { get; set; }
        public string GroupTemplateName { get; set; }
    }
}

