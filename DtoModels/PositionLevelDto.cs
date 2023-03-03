using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.DtoModels
{
    public class PositionLevelDto 
	{
		public int PositionLevelId { get; set; }

		public string NameTh { get; set; }

		public string NameEn { get; set; }
	public int? AccountId { get; set; }

	public double? PositionLevel { get; set; }

		public bool? IsActive { get; set; }

	public string CreatedDate { get; set; }

	public string CreatedBy { get; set; }

	public string ModifiedDate { get; set; }

		public string ModifiedBy { get; set; }







	}
}
