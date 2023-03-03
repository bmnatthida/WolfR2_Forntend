using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class RefDocFormTableRequestModel: BaseBodyRequestModel
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string CUserID { get; set; }
        public string RUserID { get; set; }
        public string ConditionRefdoc { get; set; }
        public string Search { get; set; }
        public string docCancelDoc { get; set; }
        public string docDataSource { get; set; }
        public string docEditDoc { get; set; }
        public string docNewDoc { get; set; }
        public string docReport { get; set; }
        public bool doccontrol { get; set; }
        public List<DocRefModel> docRef { get; set; }

    }
}
