using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class UserWolfModel
    {
        public string username { get; set; }
        public string password { get; set; }
        public string? ContactCode { get; set; }
        public string TmpUrl { get; set; }

    }
}
