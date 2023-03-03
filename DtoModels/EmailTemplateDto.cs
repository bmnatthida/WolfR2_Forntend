using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.DtoModels
{
    public class EmailTemplateDto: BaseBodyModel
	{
		public int EmailTemplateId { get; set; }

		public int? TemplateId { get; set; }

		//Temp Column
		public string TemplateName { get; set; }
		public string SecretId { get; set; }
		//Temp Column
		public string TemplateDocumentCode { get; set; }

		public string FormState { get; set; }

		public string EmailTo { get; set; }

		public string EmailCC { get; set; }

		public string EmailSubject { get; set; }

		public string EmailBody { get; set; }

		public string CreatedDate { get; set; }

		public string CreatedBy { get; set; }

		//Temp Column
		public string CreatedByName { get; set; }

		public string ModifiedDate { get; set; }

		public string ModifiedBy { get; set; }

		//Temp Column
		public string ModifiedByName { get; set; }

		public bool? IsActive { get; set; }
	}
}
