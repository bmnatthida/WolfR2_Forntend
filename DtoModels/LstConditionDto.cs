using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class LstConditionDto
    {
        public string ColumnId { get; set; }
        public string Column { get; set; }
        public string Value { get; set; }
        public int Seq { get; set; }
        public string TemLineId { get; set; }
        public string TempLineId { get; set; }
    }
}
