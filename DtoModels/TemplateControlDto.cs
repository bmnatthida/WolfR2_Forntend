using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.DtoModels
{
    public class TemplateControlDto
    {
        public string JsonCondition;

        public int ComCode { get; set; }

        public decimal Amount { get; set; }

        public List<TemplateFormDto> listRefTemplate { get; set; }

        public TemplateFormDto templateForm { get; set; }

        public List<SpecificApproverDto> specificApprovers { get; set; }

        public List<SpecificApproverDto> specificTempApprovers { get; set; }

        public List<TemLineApproveDto> TemLineApprove { get; set; }

        public EmployeeDto VEmployee { get; set; }

        public List<LstTrnLineApproveDto> lstTRNLineApprove { get; set; }

        public List<ApprovalMatrixDto> cMstApprovalMatrix { get; set; }

        public List<PositionLevelDto> cMstPositionLevel { get; set; }

        public List<CompanyDto> cMstCompany { get; set; }

        public List<MasterDataListDto>? lstMasterData { get; set; }

        public List<TemplateLogicDto> cMSTTemplateLogic { get; set; }

        public MasterDataListDto cMstMasterData { get; set; }

        public string? Authorization_manage_company { get; set; }

        public string? Authorization_manage_department { get; set; }

        public string? Authorization_request_company { get; set; }

        public string? Authorization_request_department { get; set; }

        public string? Authorization_view { get; set; }
    }
}
