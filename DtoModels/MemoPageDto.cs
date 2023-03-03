using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class MemoPageDto
    {
        public MemoDetailDto? memoDetail { get; set; }
        public List<ListApprovalDetailDto>? listApprovalDetails { get; set; }
        public List<AttachFilesDto>? listFileAttachDetails { get; set; }
        public List<ListFormNameDto>? listFormNames { get; set; }
        public List<HistoryDto>? listHistoryDetails { get; set; }
        public List<RefDocDetails>? listRefDocDetails { get; set; }
    }
}
