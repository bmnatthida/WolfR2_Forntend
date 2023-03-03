using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class DepartmentDto
    {
        public int? DepartmentId { get; set; } = 0;
        public int? ParentId { get; set; } = 0;
        public int? DivisionId { get; set; } = 0;
        public string DepartmentCode { get; set; } = "";
        public string NameTh { get; set; } = "";
        public string NameEn { get; set; } = "";
        public string CompanyCode { get; set; } = "";
        public bool? IsActive { get; set; }
        public string CreatedDate { get; set; } = "";
        public string CreatedBy { get; set; } = "";
        public string ModifiedDate { get; set; } = "";
        public string ModifiedBy { get; set; } = "";
        public string ModifiedName { get; set; } = "";
    }
}
