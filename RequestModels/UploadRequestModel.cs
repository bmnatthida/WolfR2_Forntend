using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class UploadRequestModel : BaseBodyRequestModel
    {

        public IEnumerable file { get; set; }
        public string docLib { get; set; }
        public string docSet { get; set; }
        public string fileDesc { get; set; }
        public string actorID { get; set; }
    }
}
