using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class ReportTemplateModel
    {
        public long ReporttemplateId { get; set; }
        public string TemplateId { get; set; }
        public List<Selectedfieldlistfilter> Selectedfieldlistfilter { get; set; }
    }

    public class Selectedfieldlistfilter
    {
        public int ID { get; set; }
        public string FieldCode { get; set; }
        public string FieldDisplay { get; set; }
        public bool IsExcludeBlankData { get; set; }
        public string FieldType { get; set; }
        public bool IsEquals { get; set; }
        public string FieldText { get; set; }
        public string FieldTextFrom { get; set; }
        public string FieldTextTo { get; set; }
        public bool? FieldBit { get; set; }
        public string FieldTypeFilterStatic { get; set; }
        public string FieldTypeFilterDynamic { get; set; }
        public Boolean IsTodayFrom { get; set; }
        public Boolean IsTodayTo { get; set; }
        public String FilterParameter { get; set; }
        public String indexHideColumn { get; set; }
    }   
}
