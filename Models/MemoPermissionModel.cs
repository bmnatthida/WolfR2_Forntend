using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class MemoPermissionModel
    {

        public string connectionString { get; set; }
        public int MemoId { get; set; }
        public int RequesterId { get; set; }
        public string RNameEn { get; set; }
    }
}
