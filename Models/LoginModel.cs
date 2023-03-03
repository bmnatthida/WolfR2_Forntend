using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class LoginModel
    {
        public string ConnectionString { get; set; }
        public string TinyURL { get; set; }
        public string SharepointSiteURL { get; set; }
        public string ApiURL { get; set; }
        public string userPrincipalName { get; set; }
    }
}
