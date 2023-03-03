using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class FileUploadModel
    {
        public string FileName { get; set; }
        public byte[] FileBytes { get; set; }
        public string imageUrl { get; set; }

    }
}
