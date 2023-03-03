using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class MasterDataTemplateRequest : BaseBodyModel
    {
        public string MasterType { get; set; }
    }
}
