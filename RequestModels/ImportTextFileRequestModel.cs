using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using WolfR2.Models;


namespace WolfR2.RequestModels
{
    public class ImportTextFileRequestModel : BaseBodyRequestModel
    {
        public byte[] formFile { get; set; }
        public string fileName { get; set; }
    }
}
