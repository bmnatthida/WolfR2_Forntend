using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class AccountDto
    {
        public int ID { get; set; }
        public string ContactCode { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public Boolean IsVerify { get; set; }
        public string GuidVerify { get; set; }
        public string Note { get; set; }
        public string Remark { get; set; }
        public string Description { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Boolean IsActive { get; set; }
        public string userPrincipalName { get; set; }
    }
}
