using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class UserDto
    {
        public int ID { get; set; }
        public bool IsActive { get; set; }

        public string username { get; set; }
        public string password { get; set; }
        public string ContactCode { get; set; }
        public bool IsVerify { get; set; }
        public string GuidVerify { get; set; }
        public string Remark { get; set; }
        public string SharepointSiteURL { get; set; }

        public string TinyURL { get; set; }
        public EmployeeDto employeeData { get; set; }
    }
}
