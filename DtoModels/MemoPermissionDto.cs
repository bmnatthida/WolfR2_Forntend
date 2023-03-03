using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class MemoPermissionDto
    {
        public string View { get; set; }
        public string Print { get; set; }
        public string? Download { get; set; }
        public string? AttachDownload { get; set; }
    }
}
