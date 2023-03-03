using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class SelectedfieldlistfilterRequestModel : BaseBodyModel
    {

        public string? FieldBit { get; set; }
        public string? FieldCode { get; set; }
        public string? FieldDisplay { get; set; }
        public string? FieldText { get; set; }
        public string? FieldTextFrom { get; set; }
        public string? FieldTextTo { get; set; }
        public string? FieldType { get; set; }
        public string? FieldTypeFilterDynamic { get; set; }
        public string? FieldTypeFilterStatic { get; set; }
        public string? FilterParameter { get; set; }
        public bool IsEquals { get; set; }
        public bool IsExcludeBlankData { get; set; }
        public bool IsTodayFrom { get; set; }

        public bool IsTodayTo { get; set; }
        public string? SecretId { get; set; }

        public string? indexHideColumn { get; set; }
        public int ID { get; set; } = 0;

       
    }
}
