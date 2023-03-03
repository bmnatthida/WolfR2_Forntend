using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.RequestModels
{
    public class ListHistoryDetailsRequestModel
    {
        public EmployeeRequestModel? actor { get; set; }
        public int? action_id { get; set; }
        public int? memo_id { get; set; }
        public string? action { get; set; }
        public string? status { get; set; }
        public string? comment { get; set; }
        public string? action_date { get; set; }
        public int? signature_id { get; set; }
        public string? platform { get; set; }
        public string? IPAddress { get; set; }
    }
}
