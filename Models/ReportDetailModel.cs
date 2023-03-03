using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ReportDetailModel : BaseBodyModel
    {
        public int ReportTemplateId { get; set; }
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; }
        public bool? IsActive { get; set; }
        public string? FavoritesItem { get; set; }
    }
}
