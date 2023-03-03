using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class TemplateRequestModel : BaseBodyRequestModel
    {

        public string JsonCondition { get; set; }

        public int ComCode { get; set; }

        public decimal Amount { get; set; }

        public List<TemplateFormRequestModel> listRefTemplate { get; set; }

        public TemplateFormRequestModel templateForm { get; set; }

        public List<SpecificApproverRequestModel> specificApprovers { get; set; }

        public List<SpecificApproverRequestModel> specificTempApprovers { get; set; }

        public List<TemLineApproveRequestModel> TemLineApprove { get; set; }

        public EmployeeRequestModel VEmployee { get; set; }

        public List<LstTrnLineApproveRequestModel> lstTRNLineApprove { get; set; }

        public List<ApprovalMatrixRequestModel> cMSTApprovalMatrix { get; set; }

        public List<PositionLevelRequestModel> cMSTPositionLevel { get; set; }

        public List<CompanyRequestModel> cMSTCompany { get; set; }

        public List<MasterDataRequestModel> lstMasterData { get; set; }

        public List<TemplateLogicRequestModel> cMSTTemplateLogic { get; set; }

        public MasterDataRequestModel cMSTMasterData { get; set; }


        public List<Authorization_manage_companyRequestModel> Authorization_manage_company { get; set; }
        public List<Authorization_manage_departmentRequestModel> Authorization_manage_department { get; set; }
        public List<Authorization_manage_companyRequestModel> Authorization_request_company { get; set; }
        public List<Authorization_manage_departmentRequestModel> Authorization_request_department { get; set; }
        public List<Authorization_viewRequestModel> Authorization_view { get; set; }
    }
    public class TemplateLineApproveRequestModel : BaseBodyRequestModel
    {

        public string JsonCondition { get; set; }

        public int ComCode { get; set; }

        public decimal Amount { get; set; }

        public List<TemplateFormRequestModel> listRefTemplate { get; set; }

        public TemplateForm templateForm { get; set; }

        public List<SpecificApproverRequestModel> specificApprovers { get; set; }

        public List<SpecificApproverRequestModel> specificTempApprovers { get; set; }

        public List<TemLineApproveRequestModel> TemLineApprove { get; set; }

        public EmployeeRequestModel VEmployee { get; set; }

        public List<LstTrnLineApproveRequestModel> lstTRNLineApprove { get; set; }

        public List<ApprovalMatrixRequestModel> cMSTApprovalMatrix { get; set; }

        public List<PositionLevelRequestModel> cMSTPositionLevel { get; set; }

        public List<CompanyRequestModel> cMSTCompany { get; set; }

        public List<MasterDataRequestModel> lstMasterData { get; set; }

        public List<TemplateLogicRequestModel> cMSTTemplateLogic { get; set; }

        public MasterDataRequestModel cMSTMasterData { get; set; }


        public List<Authorization_manage_companyRequestModel> Authorization_manage_company { get; set; }
        public List<Authorization_manage_departmentRequestModel> Authorization_manage_department { get; set; }
        public List<Authorization_manage_companyRequestModel> Authorization_request_company { get; set; }
        public List<Authorization_manage_departmentRequestModel> Authorization_request_department { get; set; }
        public List<Authorization_viewRequestModel> Authorization_view { get; set; }
    }
}
