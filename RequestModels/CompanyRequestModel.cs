using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
	public class CompanyRequestModel : BaseBodyRequestModel
	{

		public int? CompanyId { get; set; }

		public string CompanyCode { get; set; }
		public string CompanyCodeWithName { get { return CompanyCode + " : " + NameTh; } }


		public string NameTh { get; set; }

		public string NameEn { get; set; }

		public string AddressTh { get; set; }

		public string AddressEn { get; set; }

		public string Tel { get; set; }

		public string Fax { get; set; }

		public string UrlWeb { get; set; }

		public string UrlLogo { get; set; }

		public bool? IsActive { get; set; }

		public string CreatedBy { get; set; }

		public string CreatedDate { get; set; }

		public string ModifiedBy { get; set; }

		public string ModifiedDate { get; set; }
	}
}
