using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class ReportRequestModel : BaseBodyModel
    {
        public int? ReportTemplateId { get; set; } 

        public string? ReportName { get; set; }

        public string? TemplateId { get; set; }

        public List<SelectedfieldlistRequestModel> Selectedfieldlist { get; set; }

        public string? ReportDescription { get; set; }

        public bool? IsPrivate { get; set; }

        public bool? IsActive { get; set; }
   
             public bool? Mode { get; set; }
        public string? CreateBy { get; set; }
        public string? CreatedByname { get; set; }

        public string? CreatedDate { get; set; }

        public string? ModifiedBy { get; set; }
        public string? ModifiedByname { get; set; }

        public string? ModifiedDate { get; set; }
        
        public List<SelectedfieldlistfilterRequestModel> Selectedfieldlistfilter { get; set; }

        public List<string> Columns { get; set; }

        public List<List<string>> Rows { get; set; }

       
        

        public bool TemplateNewVersion { get; set; } = false;
        public int PageIndex { get; set; } = 0;
        public int PageSize { get; set; } = 10;

        public bool CanDelete { get; set; } = false;
        public string? RoleId { get; set; }
        public string? RoleEmp { get; set; }

    }
}
