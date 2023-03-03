using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class TimeStampRequestModel: BaseBodyModel
    {
        public string SearchDateTimeFrom { get; set; }  //format DD/MM/YYYY HH:mm
        public string SearchDateTimeTo { get; set; }    //format DD/MM/YYYY HH:mm
        //public List<string> SearchString { get; set; }
        [JsonProperty("Paging")]
        public PagingModel Paging { get; set; } = null;
     
    }
}
