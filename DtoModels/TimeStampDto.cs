using System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WolfR2.Models;

namespace WolfR2.DtoModels
{
    public class TimeStampDto
    {
        public string SearchDateTimeFrom { get; set; }  //format DD/MM/YYYY HH:mm
        public string SearchDateTimeTo { get; set; }    //format DD/MM/YYYY HH:mm
        public string Data { get; set; }
        //public List<string> SearchString { get; set; }
        [JsonProperty("Paging")]
        public PagingModel Paging { get; set; } = null;
    }
}
