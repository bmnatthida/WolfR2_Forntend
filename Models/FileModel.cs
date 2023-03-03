using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class FileModel
    {
        public int lastModified { get; set; }
        public DateTime lastModifiedDate { get; set; }
        public string name { get; set; }
        public int size { get; set; }
        public string type { get; set; }
        public string webkitRelativePath { get; set; } 
    }
}
