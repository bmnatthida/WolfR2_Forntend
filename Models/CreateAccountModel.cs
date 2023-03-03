using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class CreateAccountModel:BaseBodyRequestModel
    {
        public int? ID { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; }
        public string Remark { get; set; }
        public string? NewPassword { get; set; }
        public string? ConfirmNewPassword { get; set; }
        public Boolean IsVerify { get; set; }
        public Boolean IsActive { get; set; }
    }
}
