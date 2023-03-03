using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class RoleUpdateModel
    {
        public RoleRequestModel role { get; set; }
        public List<FormRoleEmployeeRequestModel> formRoleEmployee { get; set; }
    }
}
