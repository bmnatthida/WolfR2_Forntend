using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class LstCondition:BaseBodyRequestModel
    {
        public string? ColumnId { get; set; }
        public string? Column { get; set; }
        public string? Value { get; set; }
        public int? Seq { get; set; }
        public string? TemLineId { get; set; }
        public string? TempLineId { get; set; }
    }
}
