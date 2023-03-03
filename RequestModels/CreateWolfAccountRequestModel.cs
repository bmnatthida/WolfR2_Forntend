using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class CreateWolfAccountRequestModel:BaseBodyRequestModel
    {
        public int? ID { get; set; }
        public string ContactCode { get; set; }
        public string Username { get; set; }
        public string Remark { get; set; }
        public string Description { get; set; }
        public string? Password { get; set; }
        public string? Note { get; set; }
        public Boolean IsVerify { get; set; }
        public Boolean IsActive { get; set; }

    }
}
