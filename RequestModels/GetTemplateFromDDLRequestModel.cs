using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class GetTemplateFromDDLRequestModel : BaseBodyModel
    {
        public int? EmployeeId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public int? DepartmentId { get; set; }
        public string? ConditionForm { get; set; }
        public bool? selectAll { get; set; }
        public bool? DefultMode { get; set; }
        public bool? OnlyActive { get; set; }
    }
}
