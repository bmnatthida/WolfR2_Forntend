using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class AuthMenuDto
    {
        public int? AuMenuId { get; set; }
        public string Process { get; set; }
        public string GroupMenu { get; set; }
        public string SubMenu { get; set; }
        public string ItemMenu { get; set; }
        public int? OrderGroup { get; set; }
        public string OrderSub { get; set; }
        public string OrderItem { get; set; }
        public int? InternalUrl { get; set; }
        public string Url { get; set; }
        public string RolesId { get; set; }
        public bool? IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public string ModifiedDate { get; set; }
    
    }
}
