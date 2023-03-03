 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
	public class NavbarMenuModel
	{
		public int? AuMenuID { get; set; }

		public string Process { get; set; }

		public string GroupMenu { get; set; }

		public string SubMenu { get; set; }

		public string ItemMenu { get; set; }

		public int OrderGroup { get; set; }

		public int OrderSub { get; set; }

		public string OrderItem { get; set; }
		public int InternalUrl { get; set; }

		public string Url { get; set; }

		public string RolesID { get; set; }

		public bool? IsActive { get; set; }

		public string CreatedBy { get; set; }

		public string CreatedDate { get; set; }

		public string ModifiedBy { get; set; }

		public string ModifiedDate { get; set; }
		public string userPrincipalName { get; set; }
		public string connectionString { get; set; }
		public string SecretId { get; set; }
	}

}