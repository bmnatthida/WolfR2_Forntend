using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class MemoRequestModel : BaseBodyRequestModel
    {
        public MemoDetailRequestModel memoDetail { get; set; }
        public List<ListApprovalDetailsRequestModel> listApprovalDetails { get; set; }
        public List<ListFileAttachDetailsRequestModel> listFileAttachDetails { get; set; }
        public List<ListHistoryDetailsRequestModel> listHistoryDetails { get; set; }
        public List<ListControlRunning>? listControlRunning { get; set; }
        public List<ListFormNameRequestModel> listFormName { get; set; }
        public List<listRefDocDetailsRequestModels>? listRefDocDetails { get; set; }
        public string SecretId { get; set; }
    }
}
