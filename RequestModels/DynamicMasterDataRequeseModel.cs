using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class DynamicMasterDataRequeseModel:BaseBodyModel
    {
        public string name { get; set; }
        public string model { get; set; }
    }
}
