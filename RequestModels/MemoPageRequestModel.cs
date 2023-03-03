using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class MemoPageRequestModel : BaseBodyRequestModel
    {
        public MemoRequestModel MemoPage { get; set; }
        public string Type { get; set; }
        public bool IsPreview { get; set; }
        
    }
}
