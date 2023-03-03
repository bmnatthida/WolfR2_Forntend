using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ReportDetailDto
    {
        public long ReportTemplateId { get; set; }
        public string ReportName { get; set; }
        public string TemplateId { get; set; }
        public string FieldCollection { get; set; }
        public string ReportDescription { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsActive { get; set; }
        public long CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public long ModifiedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string FavoritesItem { get; set; }
        public object Columns { get; set; }
        public object Rows { get; set; }
        public object[] DtReport { get; set; }
        public long DtReportRowsize { get; set; }
        public bool TemplateNewVersion { get; set; }
        public long PageIndex { get; set; }
        public long PageSize { get; set; }
        public bool CanDelete { get; set; }
        public string RoleId { get; set; }
        public string RoleEmp { get; set; }
        public object UserPrincipalName { get; set; }
        public object ConnectionString { get; set; }
        public object SecretId { get; set; }
    }
}
