using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;
using WolfR2.DtoModels;
using Newtonsoft.Json;
using WolfR2.RequestModels;
using WolfR2.Helper;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApprovalsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Approvals";
        public ApprovalsController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูล ApprovalsจากMemoId
        /// </summary>
        [HttpPost("GetByMemoId")]
        public async Task<ActionResult> GetByMemoId([FromBody] ApprovalsModel memo)
        {
            try
            {
                var requestModel = new ApprovalsModel
                {
                    UserPrincipalName = memo.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId="",
                    memoid = memo.memoid,
                };

                var requestMasterDataModel = new BaseBodyModel
                {
                    UserPrincipalName = memo.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("ApprovalsController GetByMemoId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                LogFile.WriteLogFile("ApprovalsController GetByMemoId | requestMasterDataModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestMasterDataModel), module);


                var result = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Approvals", null, requestModel);
                var masterDatas = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestMasterDataModel);

                var listApprovalDetailDto = JsonConvert.DeserializeObject<List<ListApprovalDetailDto>>(result);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(masterDatas);

                foreach (var approval in listApprovalDetailDto)
                {
                    foreach (var sinature in masterDataDto)
                    {
                        if (approval.signature_id == sinature.MasterId)
                        {
                            approval.signature_th = sinature.Value1;
                            approval.signature_en = sinature.Value2;
                        }
                        else if (approval.signature_id == 0)
                        {
                            if (sinature.MasterId == 2019)
                            {
                                approval.signature_id = sinature.MasterId;
                                approval.signature_th = sinature.Value1;
                                approval.signature_en = sinature.Value2;
                            }
                        }
                    }
                }

                return Ok(listApprovalDetailDto);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByMemoId : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
           
        }
    }
}
