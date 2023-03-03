using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class SpecificApproverRequestModel :BaseBodyRequestModel
    {
        public int TemSpecificId { get; set; }
        public int TemLineId { get; set; }
        public int Seq { get; set; }
        public int SpecificTypeId { get; set; }
        public int? EmployeeId { get; set; }
        public int? RoleId { get; set; }
        public string Detail { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public string ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public int SpecificId { get; set; }
        public int? TemplateId { get; set; }
        public string? EmpId { get; set; }
        public string? EmployeeName { get; set; }
        public string? GroupName { get; set; }
        public int SignatureId { get; set; }
    }
}
