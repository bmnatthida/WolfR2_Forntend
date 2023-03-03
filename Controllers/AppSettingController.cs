using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Helper;
using WolfR2.Models;


namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppSettingController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string _userPrincipalName;
        private string _connectionString;
        private string module = "AppSetting";
        public AppSettingController(IConfiguration configuration)
        {
            _configuration = configuration;
            

        }
        /// <summary>
        /// ดึงข้อมูล ApprovalsจากMemoId
        /// </summary>
        [HttpGet("CheckAppSetting")]
        public async Task<ActionResult> CheckAppSetting()
        {
            try
            {
                var correct = false;
                _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
                _userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                _connectionString = _configuration.GetValue<string>("AppSettings:BaseUrl");
                bool _baseUrlCheck = string.IsNullOrEmpty(_baseUrl);
                bool _userPrincipalNameCheck = string.IsNullOrEmpty(_userPrincipalName);
                bool _connectionStringCheck = string.IsNullOrEmpty(_connectionString);
                if(!_baseUrlCheck && !_userPrincipalNameCheck && !_connectionStringCheck)
                {
                    correct = true;
                }
         
                return  Ok(correct);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CheckAppSetting : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึง appsetting CanAdminEditCompletedMemo
        /// </summary>
        [HttpGet("CheckCanAdminEditCompletedMemo")]
        public async Task<ActionResult> CheckCanAdminEditCompletedMemo()
        {
            try
            {
                var CanAdminEditCompletedMemo = false;

                var _CanAdminEditCompletedMemo = _configuration.GetValue<string>("ReactConfiguration:CanAdminEditCompletedMemo");
                if (_CanAdminEditCompletedMemo.ToLower() == "true")
                {
                    CanAdminEditCompletedMemo = true;
                }
                return Ok(CanAdminEditCompletedMemo);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CheckCanAdminEditCompletedMemo : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        public class CanEditProfileSetting
        {
            public bool canEditProfile { get; set; }
            public bool canEditOnlySignature { get; set; }
            public string limitFileSize { get; set; }
            public string limitFileInfo { get; set; }
            public int EmployeeCodeSize { get; set; }
            
        };
        /// <summary>
        /// ตรวจสอบการเรียกใช่ Edit profile
        /// </summary>
        [HttpGet("CheckCanEditProfile")]
        public async Task<ActionResult> CheckCanEditProfile()
        {
            try
            {
                var editProfileSetting = new CanEditProfileSetting
                {
                    canEditProfile = true,
                    canEditOnlySignature = true,
                    EmployeeCodeSize = 10,
                    limitFileSize = "",
                    limitFileInfo = ""
                };
                string canEditProfile = _configuration.GetValue<string>("ReactConfiguration:CanEditProfile");
                string canEditOnlySignature = _configuration.GetValue<string>("ReactConfiguration:CanEditOnlySignature");
                editProfileSetting.limitFileInfo = _configuration.GetValue<string>("ReactConfiguration:UploadSignatureSetting:LimitFileInfo");
                editProfileSetting.limitFileSize = _configuration.GetValue<string>("ReactConfiguration:UploadSignatureSetting:LimitFileSize");
                editProfileSetting.EmployeeCodeSize = _configuration.GetValue<int>("ReactConfiguration:EmployeeCodeSize");

                if (canEditProfile.ToLower() == "false")
                {
                    editProfileSetting.canEditProfile = false; 
                }
                if (canEditOnlySignature.ToLower() == "false")
                {
                    editProfileSetting.canEditOnlySignature = false;
                }

                return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(editProfileSetting));
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CheckCanEditProfile : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ตรวจสอบการเรียกใช่ AutoReport
        /// </summary>
        [HttpGet("CheckAutoReport")]
        public async Task<ActionResult> CheckAutoReport()
        {
            try
            {
                bool enableAutoGenReport = _configuration.GetValue<bool>("ReactConfiguration:EnableAutoGenReport");

                return Ok(enableAutoGenReport);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CheckAutoReport : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ตรวจสอบการเรียกใช่ AutoReport
        /// </summary>
        [HttpGet("CheckCanDownloadPdf")]
        public async Task<ActionResult> CheckDownloadPdf()
        {
            bool enableDownloadPdf = _configuration.GetValue<bool>("ReactConfiguration:CanDownloadPdf");

            return Ok(enableDownloadPdf);
        }
        
    }
}
