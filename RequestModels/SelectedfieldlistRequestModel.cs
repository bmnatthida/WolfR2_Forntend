using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class SelectedfieldlistRequestModel : BaseBodyModel
    {

        public int? reportTemplateId { get; set; } = null;
        public string? label { get; set; }
        public string? alter { get; set; }
        public string? type { get; set; }
        public string? isChecked { get; set; }
        public string? isFilter { get; set; }
        public string isEnabled { get; set; }
        public string? templateId { get; set; } = null;
        public string? templateName { get; set; }
        public string? documentCode { get; set; }
        public string? value { get; set; }
        public bool CheckedSequence { get; set; }
        public string? key { get; set; }
        public string? Layout { get; set; }
        public string? dispalyLebelAndAlter { get; set; }
        public bool TemplateNewVersion { get; set; }
        public string? FieldTypeFilterStatic { get; set; }
        public string? FieldTypeFilterDynamic { get; set; }
        public string? description { get; set; }
        public string? indexGroupBy { get; set; }
        public string? indexOrderBy { get; set; }
        public string? indexHideColumn { get; set; }
        public string? indexSortingBy { get; set; }
        public string? groupCount { get; set; }
        public string? SecretId { get; set; }
        public string? symbol { get; set; }

    }
}
