using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;
using WolfR2.RequestModels;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApprovalMatrixController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "ApprovalMatrix";
        public ApprovalMatrixController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }

        /// <summary>
        /// ดึงข้อมูล ApprovalMatrixแยยList
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            try
            {  
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var result = await CoreAPI.post(_baseUrl + "api/ApprovalMatrix/ApprovalMatrixListAll", null, requestModel);
                var approvalMatrixList = JsonConvert.DeserializeObject<List<ApproveMatrixListDto>>(result);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(approvalMatrixList);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ApprovalMatrixListAll : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
          

        }

        [HttpGet("GetAllApprovalMatrixItem")]
        public async Task<ActionResult> GetAllApprovalMatrixItem()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("ApprovalMatrix GetAllApprovalMatrixItem | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var approvalMatrixItem = await CoreAPI.post(_baseUrl + "api/ApprovalMatrix/ApprovalMatrixItemListALL", null, requestModel);
                var approvalMatrixItemList = JsonConvert.DeserializeObject<List<ApprovalMatrixItemDto>>(approvalMatrixItem);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(approvalMatrixItemList);
                return Ok(resultJson);
            }
            catch(Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAllApprovalMatrixItem : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
            
        }
     
        [HttpPost("updateApprovalMatrix")]
        public async Task<ActionResult> Add(ApproveMatrixUpdateModel CsApproveMatrix)
        {
            try
            {
                var approveMatrix = CsApproveMatrix.approvalMatrix;
                var result = "";
                ApprovalMatrixRequestModel requestModel = new ApprovalMatrixRequestModel
                {
                    UserPrincipalName = approveMatrix.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ApproveMatrixId = approveMatrix.ApproveMatrixId,
                    NameTh = approveMatrix.NameTh,
                    NameEn = approveMatrix.NameEn,
                    CreatedBy = approveMatrix.CreatedBy,
                    CreatedDate = approveMatrix.CreatedDate,
                    ModifiedBy = approveMatrix.ModifiedBy,
                    ModifiedDate = approveMatrix.ModifiedDate,
                    IsActive = approveMatrix.IsActive

                };
                LogFile.WriteLogFile("ApprovalMatrix updateApprovalMatrix | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var resultApprovalMatrix = await CoreAPI.post(_baseUrl + "api/ApprovalMatrix/Save", null, requestModel);
                var approvalMatrixItemList = JsonConvert.DeserializeObject<ApprovalMatrixRequestModel>(resultApprovalMatrix);
                if (CsApproveMatrix.approveMatrixItems != null)
                {
                    foreach (ApproveMatrixItemRequestModel approveMatrixItem in CsApproveMatrix.approveMatrixItems)
                    {
                        var item = new ApproveMatrixItemRequestModel
                        {
                            UserPrincipalName = approveMatrixItem.UserPrincipalName,
                            ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                            ApproveMatrixId = approvalMatrixItemList.ApproveMatrixId,
                            ApproveMatrixItemId = approveMatrixItem.ApproveMatrixItemId,
                            AmountFrom = approveMatrixItem.AmountFrom,
                            AmountTo = approveMatrixItem.AmountTo,
                            ApproverId = approveMatrixItem.ApproverId,
                            ApproverName = approveMatrixItem.ApproverName,
                            IsActive = approveMatrixItem.IsActive,
                            IsTypePosition = approveMatrixItem.IsTypePosition,
                            PositionLevelId = approveMatrixItem.PositionLevelId,
                            PositionLevelName = approveMatrixItem.PositionLevelName,
                            Seq = approveMatrixItem.Seq,
                        };
                        LogFile.WriteLogFile("ApprovalMatrix updateApprovalMatrix , ApproveMatrixItemRequestModel | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(item), module);
                        result = await CoreAPI.post(_baseUrl + "api/ApprovalMatrixItem/Save", null, item);
                    }
                }
                else
                {
                    result = "success";
                }
                return Ok(result);

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateApprovalMatrix : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        [HttpPost("updateApprovalMatrixItems")]
        public async Task<ActionResult> Add(ApproveMatrixItemRequestModel CsApproveMatrixitems)
        {
            try {
                var item = new ApproveMatrixItemRequestModel
                {
                    UserPrincipalName = CsApproveMatrixitems.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ApproveMatrixId = CsApproveMatrixitems.ApproveMatrixId,
                    ApproveMatrixItemId = CsApproveMatrixitems.ApproveMatrixItemId,
                    AmountFrom = CsApproveMatrixitems.AmountFrom,
                    AmountTo = CsApproveMatrixitems.AmountTo,
                    ApproverId = CsApproveMatrixitems.ApproverId,
                    ApproverName = CsApproveMatrixitems.ApproverName,
                    IsActive = CsApproveMatrixitems.IsActive,
                    IsTypePosition = CsApproveMatrixitems.IsTypePosition,
                    PositionLevelId = CsApproveMatrixitems.PositionLevelId,
                    PositionLevelName = CsApproveMatrixitems.PositionLevelName,
                    Seq = CsApproveMatrixitems.Seq,

                };
                LogFile.WriteLogFile("ApprovalMatrix updateApprovalMatrixItems | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(item), module);
                var dd = JsonConvert.SerializeObject(item);
                
                var resule = await CoreAPI.post(_baseUrl + "api/ApprovalMatrixItem/Save", null, item);


            return Ok(resule);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateApprovalMatrixItems : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        [HttpPost("updateApprovalMatrixItemsList")]
        public async Task<ActionResult> updateApprovalMatrixItemsList(List<ApproveMatrixItemRequestModel> CsApproveMatrixitemsList)
        {
            try
            {
                string result = "";
                foreach (ApproveMatrixItemRequestModel approveMatrixItem in CsApproveMatrixitemsList)
                {
                    var item = new ApproveMatrixItemRequestModel
                    {
                        UserPrincipalName = approveMatrixItem.UserPrincipalName,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        ApproveMatrixId = approveMatrixItem.ApproveMatrixId,
                        ApproveMatrixItemId = approveMatrixItem.ApproveMatrixItemId,
                        AmountFrom = approveMatrixItem.AmountFrom,
                        AmountTo = approveMatrixItem.AmountTo,
                        ApproverId = approveMatrixItem.ApproverId,
                        ApproverName = approveMatrixItem.ApproverName,
                        IsActive = approveMatrixItem.IsActive,
                        IsTypePosition = approveMatrixItem.IsTypePosition,
                        PositionLevelId = approveMatrixItem.PositionLevelId,
                        PositionLevelName = approveMatrixItem.PositionLevelName,
                        Seq = approveMatrixItem.Seq,
                    };
                    LogFile.WriteLogFile("ApprovalMatrix updateApprovalMatrixItemsList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(item), module);
                    result = await CoreAPI.post(_baseUrl + "api/ApprovalMatrixItem/Save", null, item);

                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|updateApprovalMatrixItemsList : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
    }
}
