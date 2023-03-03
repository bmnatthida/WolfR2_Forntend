using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class RevisionRequestModel:BaseBodyRequestModel
    {
        public int TemplateId { get; set; }
        public int RefId { get; set; }
        public int Digit { get; set; }
        public string Labelrevision { get; set; }
        public string Alter { get; set; }
        public int? MemoId { get; set; }
        public List<Itemlabel> Itemlabel { get; set; }
    }
    public  class Itemlabel
    {
        public string Label { get; set; }
        public string? Value { get; set; }
    }
}
