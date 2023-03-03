using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class MasterDataRequestModel:BaseBodyRequestModel
    {
        
        public int? MasterId { get; set; }

        public string? MasterType { get; set; }

        public string? Value1 { get; set; }

        public string? Value2 { get; set; }

        public string? Value3 { get; set; }

        public string? Value4 { get; set; }

        public string? Value5 { get; set; }

        public bool? IsActive { get; set; }

        public string? CreatedDate { get; set; }

        public string? CreatedBy { get; set; }

        public string? ModifiedDate { get; set; }

        public string? ModifiedBy { get; set; }

        public int? Seq { get; set; }



    }
}
