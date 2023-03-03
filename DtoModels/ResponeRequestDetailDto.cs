using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace WolfR2.DtoModels
{
    public class ResponeRequestDetailDto
    {
        public MemoPageDto requestDetails { get; set; }

        public List<RefDocDto> refDocs { get; set; }

    }
    
}
