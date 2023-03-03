using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class AttachRequestModel : BaseBodyRequestModel
    {
        public byte[] file { get; set; }
        public string file_name { get; set; }
        public string file_desc { get; set; }
        public string document_lib { get; set; }
        public string document_set { get; set; }
        public string actorId { get; set; }
    }
}
