using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class DelegateListController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "DelegateList";
        public DelegateListController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูลทั้งหมดของDelegate
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            try { 
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("DelegateListController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/List", null, requestModel);
            
                var ListdelegateDto = JsonConvert.DeserializeObject<List<DelegateDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                var resultDto = Newtonsoft.Json.JsonConvert.SerializeObject(ListdelegateDto);

                return Ok(resultDto);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }


        public class requestDelegateModel
        {
            public int? ApproverId { get; set; }
            public int? DelegateToId { get; set; }
            public string? DateFrom { get; set; }
            public string? DateTo { get; set; }
            public string? connectionString { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลWorkList ของ Delegate
        /// </summary>
        [HttpPost("GetDetailByValue")]
        public async Task<ActionResult> GetByValue(requestDelegateModel request)
        {
            try
            {
            var requestModel = new requestDelegateModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ApproverId = request.ApproverId,
                    DelegateToId = request.DelegateToId,
                    DateFrom = request.DateFrom,
                    DateTo = request.DateTo

                };
                LogFile.WriteLogFile("DelegateListController GetDetailByValue | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/WorkList", null, requestModel);


                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByValue: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
          
        }
        public class requestDelegateByIdModel
        {
            public int DelegateId { get; set; }
            public string? connectionString { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลDelegate จากDelegateId
        /// </summary>
        [HttpPost("GetByDelegateId")]
        public async Task<ActionResult> GetByDelegateId(requestDelegateByIdModel request)
        {
            try
            {
                var requestModel = new requestDelegateByIdModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    DelegateId = request.DelegateId,

                };
                LogFile.WriteLogFile("DelegateListController GetByDelegateId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/Id", null, requestModel);


                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByDelegateId: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
          
        }
        public class requestDelegateTemplateByApproverIdModel
        {
            public int ApproverId { get; set; }
            public string? connectionString { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลTemplate จากApproverId
        /// </summary>
        [HttpPost("GetByDelegateTemplateByApproverId")]
        public async Task<ActionResult> GetByDelegateTemplateByApproverId(requestDelegateTemplateByApproverIdModel request)
        {
            try
            {
                var requestModel = new requestDelegateTemplateByApproverIdModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ApproverId = request.ApproverId,

                };
                LogFile.WriteLogFile("DelegateListController GetByDelegateTemplateByApproverId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/Template", null, requestModel);


                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByDelegateTemplateByApproverId: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        public class requestDelegateAttachByDelegateIdModel
        {
            public int DelegateId { get; set; }
            public string? connectionString { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลDelegateAttach จากDelegateId
        /// </summary>
        [HttpPost("GetByDelegateAttachByDelegateId")]
        public async Task<ActionResult> GetByDelegateAttachByDelegateId(requestDelegateAttachByDelegateIdModel request)
        {
            try
            {
             var requestModel = new requestDelegateAttachByDelegateIdModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    DelegateId = request.DelegateId,

                };
                LogFile.WriteLogFile("DelegateListController GetByDelegateAttachByDelegateId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/Attachment", null, requestModel);


            return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByDelegateAttachByDelegateId: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        
        }
        public class DelegateList
        {
            public int ApproverId { get; set; }
            public int DelegateToId { get; set; }
            public string DateFrom { get; set; }
            public string DateTo { get; set; }
            public string Remark { get; set; }
            public string CreatedBy { get; set; }
            public string ModifiedBy { get; set; }

        }
        public class DelegateDetail
        {
            public int TemplateId { get; set; }

        }
        public class AttachDetail
        {
            public int sequence { get; set; }
            public EmployeeDto actor { get; set; }
            public string attach_date { get; set; }
            public string attach_path { get; set; }
            public string attach_file { get; set; }
            public string description { get; set; }


        }
        public class requestCreateDelegateFormReactModel
        {
            public DelegateList DelegateList { get; set; }
            public List<DelegateDetail> DelegateDetail { get; set; }
            public List<AttachDetail> AttachmentList { get; set; }

        }
        public class requestCreateDelegateModel
        {
            public string connectionString { get; set; }
            public DelegateList header { get; set; }
            public List<DelegateDetail> line { get; set; }
            public List<AttachDetail> attachment { get; set; }
        }
        /// <summary>
        /// เพิ่มข้อมูลDelegate
        /// </summary>
        [HttpPost("CreateDelegate")]
        public async Task<ActionResult> CreateDelegate(requestCreateDelegateFormReactModel request)
        {
            try
            {
                var requestModel = new requestCreateDelegateModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    header = request.DelegateList,
                    line = request.DelegateDetail,
                    attachment = request.AttachmentList

                };
                LogFile.WriteLogFile("DelegateListController CreateDelegate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/Create", null, requestModel);


                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CreateDelegate: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        public class requestDeleteDelegateModel
        {
            public string connectionString { get; set; }
            public int DelegateId { get; set; }
            public string ModifiedBy { get; set; }
        }
        /// <summary>
        /// ลบข้อมูลDelegate 
        /// </summary>
        [HttpPost("DeleteDelegate")]
        public async Task<ActionResult> DeleteDelegate(requestDeleteDelegateModel request)
        {
            try
            {
                var requestModel = new requestDeleteDelegateModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    DelegateId = request.DelegateId,
                    ModifiedBy = request.ModifiedBy

                };
                LogFile.WriteLogFile("DelegateListController DeleteDelegate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Delegate/Delete", null, requestModel);


                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|DeleteDelegate: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        public class requestUpdateModel: requestCreateDelegateModel
        {
            public string connectionString { get; set; }
            public int DelegateId { get; set; }
            public string ModifiedBy { get; set; }
        }
        public class requestUpdateAndDeleteModel: requestCreateDelegateFormReactModel
        {
            public int DelegateId { get; set; }
            public string ModifiedBy { get; set; }
        }
        /// <summary>
        /// อัพเดทข้อมูลDelegate 
        /// </summary>
        [HttpPost("UpdateDelegate")]
        public async Task<ActionResult> UpdateDelegate(requestUpdateAndDeleteModel request)
        {
            try
            {
                var requestDeleteModel = new requestUpdateModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    DelegateId = request.DelegateId,
                    ModifiedBy = request.ModifiedBy

                };
                var requestUpdateModel = new requestUpdateModel
                {
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    header = request.DelegateList,
                    line = request.DelegateDetail,
                    attachment = request.AttachmentList,

                };
                LogFile.WriteLogFile("DelegateListController UpdateDelegate | requestDeleteModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestDeleteModel), module);
                LogFile.WriteLogFile("DelegateListController UpdateDelegate | requestUpdateModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestUpdateModel), module);
                var resultDelete = await CoreAPI.post(_baseUrl + "api/Delegate/Delete", null, requestDeleteModel);

                var resultCreate = await CoreAPI.post(_baseUrl + "api/Delegate/Create", null, requestUpdateModel);
                var result = false;
                if(resultCreate == resultDelete)
                {
                    result = true;
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateDelegate: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
    
