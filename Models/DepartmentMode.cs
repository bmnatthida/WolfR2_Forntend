using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class DepartmentMode : BaseBodyRequestModel
    {
		public int? DepartmentId { get; set; }

		public int? ParentId { get; set; }

		public int? DivisionId { get; set; }

		public string DepartmentCode { get; set; }

		public string NameTh { get; set; }

		public string NameEn { get; set; }

		public string CreatedDate { get; set; }

		public string CreatedBy { get; set; }

		public string ModifiedDate { get; set; }

		public string ModifiedBy { get; set; }
		
			public string? CompanyCode { get; set; }
		public bool? IsActive { get; set; }

		public int? LeaderId { get; set; }

		//เพิ่มมาสำหรับ set report to ในหน้า Deaprtment
		public string ReportToId { get; set; }
		public string ReportToName { get; set; }
		public string ReportToOfManagerId { get; set; }
		public string ReportToOfManagerName { get; set; }
	}
}
