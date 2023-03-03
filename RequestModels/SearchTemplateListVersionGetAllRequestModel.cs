using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class SearchTemplateListVersionGetAllRequestModel : BaseBodyModel
    {
        public string DepartmentId { get; set; }
        public string? CreatedBy { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
    }
}
