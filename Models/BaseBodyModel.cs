using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class BaseBodyModel
    {
        public string? UserPrincipalName { get; set; }
        public string ConnectionString { get; set; }
        public string? SecretId { get; set; }
    }
}
