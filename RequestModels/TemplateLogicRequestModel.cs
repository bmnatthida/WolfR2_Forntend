using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class TemplateLogicRequestModel:BaseBodyRequestModel
    {
        public string Logicid { get; set; }
        public int TemplateId { get; set; }
        public int Seq { get; set; }
        public string Logictype { get; set; }
        public string Jsonvalue { get; set; }
        public List<LstCondition> LstCondition { get; set; }
     
    }
}
