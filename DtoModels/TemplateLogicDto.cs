using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class TemplateLogicDto
    {
        public string Logicid { get; set; }
        public int TemplateId { get; set; }
        public int Seq { get; set; }
        public string Logictype { get; set; }
        public string Jsonvalue { get; set; }
        public LstConditionDto[] LstCondition { get; set; }
    }
}
