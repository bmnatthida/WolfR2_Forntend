using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;


namespace WolfR2.RequestModels
{
    public class CheckAccessRequestModel: BaseBodyRequestModel
    {
        public string memoid { get; set; }
        public string? RequesterId { get; set; }
    }
}
