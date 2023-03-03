using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ProjectModel
    {
        public int? ProjectId { get; set; }

        public string ProjectCode { get; set; }

        public string ProjectNameWithCode
        {
            get
            {
                return ProjectCode + " : " + ProjectName;
            }
        }

        public string ProjectName { get; set; }

        public bool? IsActive { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedDate { get; set; }
        public string CreatedByName { get; set; }

        public string ModifiedBy { get; set; }

        public string ModifiedDate { get; set; }
        public string? userPrincipalName { get; set; }
        public string? connectionString { get; set; }
    }
}
