using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class FormRoleEmployeeRequestModel : BaseBodyRequestModel
    {
        public int RoleId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string NameThRole { get; set; }
        public string NameEnRole { get; set; }
        public bool IsActive { get; set; }
        public string Email { get; set; }
        public string NameThEmployee { get; set; }
        public string NameEnEmployee { get; set; }
        public bool IsDelete { get; set; }
        public int Seq { get; set; }

    }
}
