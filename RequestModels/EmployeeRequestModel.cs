using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class EmployeeRequestModel : BaseBodyRequestModel
	{
		public int? EmployeeId { get; set; }

		public string? EmployeeCode { get; set; }

		public string? Username { get; set; }

		public string? NameTh { get; set; }

		public string? NameEn { get; set; }

		public string? Email { get; set; }

		public bool? IsActive { get; set; }

		public int? PositionId { get; set; }
		public string? PositionNameTh { get; set; }
		public string? PositionNameEn { get; set; }

		public int? DepartmentId { get; set; }
		public string? DepartmentNameTh { get; set; }
		public string? DepartmentNameEn { get; set; }

		public string? Lang { get; set; } = "";
		public string? ADTitle { get; set; } = "";
		public string? AccountCode { get; set; } = "";
		public string? AccountName { get; set; } = "";
		public string? DefaultLang { get; set; }
		public string? RegisteredDate { get; set; }
		public string? ExpiredDate { get; set; }

		public string? CreatedDate { get; set; }

		public string? CreatedBy { get; set; }

		public string? ModifiedDate { get; set; }

		public string? ModifiedBy { get; set; }
		public string? ReportToEmpCode { get; set; }
		public int? DivisionId { get; set; }
		public string? DivisionNameTh { get; set; }
	}
}
