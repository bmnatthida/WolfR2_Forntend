using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class LeaveTemplateByEmpIdRequestModel 
    {
        public string userPrincipalName { get; set; }
        public string connectionString { get; set; }
        public string? Value1 { get; set; }
        public string? SecretId { get; set; }
        public int? Seq { get; set; }
    }
}
