using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;
using WolfR2.RequestModels;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailTemplateController : Controller
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "EmailTemplate";
        public EmailTemplateController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");

        }
        private class Respone
        {
            public string result { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลของEmail
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("EmailTemplateController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/EmailTemplate/EmailTemplateList", null, requestModel);
            return Ok(result);
        }

        /// <summary>
        /// ดึงข้อมูลของEmail จากEmailTemplateId
        /// </summary>
        [HttpPost("GetById")]
        public async Task<ActionResult> GetById(EmailTemplateRequestModel emailTemplateDto)
        {
            try
            {
                var requestModel = new EmailTemplateRequestModel
                {

                    UserPrincipalName = emailTemplateDto.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    EmailTemplateId = emailTemplateDto.EmailTemplateId
                    
                };
                LogFile.WriteLogFile("EmailTemplateController GetById | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/EmailTemplate/EmailTemplate", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetById: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        /// <summary>
        /// เพิ่มข้อมูลของEmailTemplate
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> AddData(EmailTemplateDto emailTemplate)
        {
            try
            {
                var requestModel = new EmailTemplateDto
                {
                    CreatedBy = emailTemplate.CreatedBy,
                    CreatedByName= emailTemplate.CreatedByName,
                    CreatedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    EmailBody=emailTemplate.EmailBody,
                    EmailCC=emailTemplate.EmailCC,
                    EmailSubject=emailTemplate.EmailSubject,
                    EmailTo=emailTemplate.EmailTo,
                    FormState=emailTemplate.FormState,
                    IsActive=emailTemplate.IsActive,
                    ModifiedBy=emailTemplate.ModifiedBy,
                    ModifiedByName=emailTemplate.ModifiedByName,
                    ModifiedDate= DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    TemplateDocumentCode=emailTemplate.TemplateDocumentCode,
                    TemplateId=emailTemplate.TemplateId,
                    TemplateName=emailTemplate.TemplateName,
                    SecretId=null,
                    UserPrincipalName = emailTemplate.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("EmailTemplateController AddData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/EmailTemplate/Save", null, requestModel);

                var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|AddData: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }




        }

        /// <summary>
        /// เพิ่มข้อมูลของEmailTemplate
        /// </summary>
        [HttpPost("updateData")]
        public async Task<ActionResult> updateData(EmailTemplateDto emailTemplate)
        {
            try
            {
                var requestModel = new EmailTemplateDto
                {
                    EmailTemplateId=emailTemplate.EmailTemplateId,
                    CreatedBy = emailTemplate.CreatedBy,
                    CreatedByName = emailTemplate.CreatedByName,
                    CreatedDate =emailTemplate.CreatedDate,
                    EmailBody = emailTemplate.EmailBody,
                    EmailCC = emailTemplate.EmailCC,
                    EmailSubject = emailTemplate.EmailSubject,
                    EmailTo = emailTemplate.EmailTo,
                    FormState = emailTemplate.FormState,
                    IsActive = emailTemplate.IsActive,
                    ModifiedBy = emailTemplate.ModifiedBy,
                    ModifiedByName = emailTemplate.ModifiedByName,
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    TemplateDocumentCode = emailTemplate.TemplateDocumentCode,
                    TemplateId = emailTemplate.TemplateId,
                    TemplateName = emailTemplate.TemplateName,
                    UserPrincipalName = emailTemplate.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("EmailTemplateController updateData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/EmailTemplate/Save", null, requestModel);

                var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }




        }

    }
}
