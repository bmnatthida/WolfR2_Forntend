using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class UserPermissionModel : BaseBodyModel
	{
		public int? EmployeeId { get; set; }

		public int RoleId { get; set; }

		public bool? IsCreate { get; set; }

		public bool? IsEdit { get; set; }

		public bool? IsDelete { get; set; }

		public bool? IsView { get; set; }

		public int? Seq { get; set; }
	}
}
