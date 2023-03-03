using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class ListFileAttachDetailsRequestModel : BaseBodyRequestModel
    {
        public int sequence { get; set; }
        public int attach_id { get; set; }
        public int memo_id { get; set; }
        public string attach_file { get; set; }
        public string description { get; set; }
        public string attach_path { get; set; }
        public string attach_date { get; set; }

        public int? delegate_id { get; set; }
        public string modified_date { get; set; }
        public string modified_by { get; set; }
        public bool is_merge_pdf { get; set; }
        public string? SecretId { get; set; }

        public EmployeeRequestModel actor { get; set; }
    }
}
