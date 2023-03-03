using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class RefDocDetails
    {
        public int? refdoc_id { get; set; }
        public int? memoRefdoc_id { get; set; }
        public int? memoid { get; set; }
        public int? sequence { get; set; }
        public int? doc_id { get; set; }
        public string? doc_no { get; set; }
        public string? document_no { get; set; }
        public int? template_ID { get; set; }
        public string? template_Name { get; set; }
        public string? template_Subject { get; set; }
        public string? memoSubject { get; set; }
        public string? createdby { get; set; }
        public string? createddate { get; set; }
        public decimal? amount { get; set; }
    }
}
