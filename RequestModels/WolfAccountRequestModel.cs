using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;


namespace WolfR2.RequestModels
{
    public class WolfAccountRequestModel: BaseBodyModel
    {
        public string TinyURL { get; set; }
    }
}
