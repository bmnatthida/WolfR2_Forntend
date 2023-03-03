using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WolfApprove.Model.ExternalConnection;
using WolfR2.RequestModels;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;
using Newtonsoft.Json;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LineApproveController : Controller
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "LineApprove";
        public LineApproveController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");

        }
        /// <summary>
        /// ดึงข้อมูลของTemplate ของLineApprove
        /// </summary>
        [HttpPost("GetByTemplate")]
        public async Task<ActionResult> GetByTemplate(ListApprovaWithTemplateRequestModel listApprovaWithTemplateRequest)
        {
            try
            {
                var requestModel = new ListApprovaWithTemplateRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    templateForm = listApprovaWithTemplateRequest.templateForm,
                    lstTRNLineApprove = listApprovaWithTemplateRequest.lstTRNLineApprove,
                    VEmployee = listApprovaWithTemplateRequest.VEmployee,
                    ComCode = null,
                    SecretId = "",
                    JsonCondition = "",
                    Amount = listApprovaWithTemplateRequest.Amount
                };
                LogFile.WriteLogFile("LineApproveController GetByTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/LineApprove/LineApproveWithTemplate", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByTemplate: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpPost("GetByMemoId")]
        public async Task<ActionResult> GetByMemoId(MemoModel memoModel)
        {
            try
            {
                var requestModel = new MemoModel
                {
                    UserPrincipalName = memoModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = "",
                    memoid = memoModel.memoid,

                };
                LogFile.WriteLogFile("LineApproveController GetByMemoId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var approvals = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Approvals", null, requestModel);
                return Ok(approvals);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByMemoId: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpPost("GetByMemoIds")]
        public async Task<ActionResult> GetByMemoIds(LineApproveByMemosRequestModel lineApproveByMemosRequestModel)
        {
            try
            {
                List<ListApprovalDetailDto> listApprovalDetails = new List<ListApprovalDetailDto>();

                foreach (int memoId in lineApproveByMemosRequestModel.memoIDs)
                {
                    var requestModel = new MemoModel
                    {
                        UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        SecretId = "",
                        memoid = memoId,

                    };
                    LogFile.WriteLogFile("LineApproveController GetByMemoId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                    var approvals = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Approvals", null, requestModel);

                    List<ListApprovalDetailDto> listApprovalDetailDto = JsonConvert.DeserializeObject<List<ListApprovalDetailDto>>(approvals, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                    foreach (ListApprovalDetailDto approval in listApprovalDetailDto)
                    {
                        listApprovalDetails.Add(approval);
                    }
                }

                return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(listApprovalDetails));
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByMemoIds: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลของTemplate ของLineApprove
        /// </summary>
        [HttpPost("GetLineApproveType")]
        public async Task<ActionResult> GetLineApproveType(TemplateOBJRequestModel templateOBJRequest)
        {
            try

            {
                var requestTemplateModel = new TemplateOBJRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = templateOBJRequest.TemplateId
                };
                var Template = "";

                List<ListFormNameDto> arrayTemplate = new List<ListFormNameDto>();
                if (templateOBJRequest.TemplateVersionCode != null && templateOBJRequest.TemplateVersionCode != "")
                {
                    var requestModel = new VersionHistoryRequestModel
                    {
                        UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        DocumentCode = templateOBJRequest.TemplateVersionCode

                    };
                    LogFile.WriteLogFile("RolesController GetAllVersion | api/Template/GetTemplateListVersionHistory | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                    Template = await CoreAPI.post(_baseUrl + "api/Template/GetTemplateListVersionHistory", null, requestModel);

                    var jsonConvertResult = JsonConvert.DeserializeObject<ListFormNameDto[]>(Template, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                    Array.Reverse(jsonConvertResult);
                    foreach (var std in jsonConvertResult)
                        arrayTemplate.Add(std);
                    arrayTemplate.RemoveAt(0);
                    Template = JsonConvert.SerializeObject(arrayTemplate[int.Parse(templateOBJRequest.VersionTemplate) - 1]);

                }
                else
                {
                    Template = await CoreAPI.post(_baseUrl + "api/Template/TemplateByid", null, requestTemplateModel);
                }

                var templateModel = JsonConvert.DeserializeObject<TemplateFormRequestModel>(Template);
                templateModel.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                templateModel.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");

                var templateResult = await CoreAPI.post(_baseUrl + "api/Template/TemLineApproveListByTemplate", null, templateModel);


                return Ok(templateResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
