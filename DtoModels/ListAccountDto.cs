
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class ListAccountDto
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; }
        public Boolean IsVerify { get; set; }
        public Boolean IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedDate { get; set; }

    }
}
