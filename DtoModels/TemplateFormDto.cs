using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class TemplateFormDto
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

        public string ToId { get; set; }

        public string CcId { get; set; }

        public string TemplateSubject { get; set; }

        public bool? AutoApprove { get; set; }

        public string TextForm { get; set; }

        public string AdvanceForm { get; set; }

        public bool? IsTextForm { get; set; }

        public string AutoApproveWhen { get; set; }

        public bool? ApproverCanEdit { get; set; }

        public string CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string ModifiedDate { get; set; }

        public string ModifiedBy { get; set; }

        public bool? IsActive { get; set; }

        public bool? IsEdit { get; set; }

        public bool? IsDelete { get; set; }

        public int? MemoId { get; set; }
        public bool? isPDFShowInfo { get; set; }
        public bool? isRequesterEditApproval { get; set; }
        public bool? isFormControl { get; set; }

        public Nullable<int> DepID { get; set; }

        public string DocTypeCode { get; set; }

        public string TemplateType { get; set; }

        public string PDFLanguage { get; set; }

        public string Location { get; set; }

        public string To { get; set; }

        public string CC { get; set; }

        public string Subject { get; set; }

        public string TemplateDesc { get; set; }

        public string LineOfCommand { get; set; }

        public Nullable<int> MaxLevelID { get; set; }

        public string SpecificApprover { get; set; }

        public string DOA { get; set; }

        public Nullable<int> ApprovalMatrixID { get; set; }

        public string CC_Viewer { get; set; }

        public string ApproverCanEditContent { get; set; }

        public Nullable<System.DateTime> Modified { get; set; }

        public string RoleID { get; set; }

        public string SpecificEmployeeId { get; set; }

        public string SpecificRoleID { get; set; }

        public string MultiDeptId { get; set; }

        public bool? ReqAttach { get; set; }
        public bool? IsCheckAccess { get; set; }
        public string RefTemplate { get; set; }
        public string RefDocColumn { get; set; }
        public String RefDocDisplay { get; set; }
    }
}
