using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WolfR2.Helper;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private const string _string = "ReactConfiguration:Dashboard";
        private readonly IConfiguration _configuration;
        private string module = "Configuration";
        public ConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("Dashboard/Endpoint")]
        public string[] GetDashboardEndpoint()
        {
            try
            {
                var myArray = _configuration.GetSection($"{_string}:Endpoint").Get<string[]>();
                return myArray;
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetDashboardEndpoint: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpGet("Dashboard/FilterStatus")]
        public string[] GetDashboardFilterHeader()
        {
            try
            {
                var myArray = _configuration.GetSection($"{_string}:FilterStatus").Get<string[]>();
                return myArray;
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetDashboardFilterHeader: " + ex, module);
                throw;
            }

        }
        [HttpGet("Dashboard/AdvancedFilter")]
        public string[] GetDashboardFilterSelect()
        {
            try
            {
                var myArray = _configuration.GetSection($"{_string}:AdvancedFilter").Get<string[]>();
                return myArray;
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetDashboardFilterSelect: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("Dashboard/FilterGroupBy")]
        public string[] GetDashboardFilterGroupBy()
        {
            try
            {
                var myArray = _configuration.GetSection($"{_string}:FilterGroupBy").Get<string[]>();
                return myArray;
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetDashboardFilterGroupBy: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("Dashboard/StatusCard")]
        public string[] GetDashboardStatusCard()
        {
            try
            {
                var myArray = _configuration.GetSection($"{_string}:StatusCard").Get<string[]>();
                return myArray;
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetDashboardStatusCard: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("Dashboard/DefaultFilter")]
        public dynamic GetDashboardDefaultFilter()
        {
            try
            {
                var testUsers = _configuration.GetSection($"{_string}:DefaultFilter")
                           .GetChildren()
                           .ToList()
                           .Select(x => new
                           {
                               FieldCode = x.GetValue<string>("FieldCode"),
                               FieldDisplay = x.GetValue<string>("FieldDisplay"),
                               FieldText = x.GetValue<string>("FieldText"),
                               FieldType = x.GetValue<string>("FieldType"),
                               FieldTextFrom = x.GetValue<string>("FieldTextFrom"),
                               FieldTextTo = x.GetValue<string>("FieldTextTo"),
                           });

                return new { Data = testUsers };
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetDashboardStatusCard: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpGet("AzureConfig")]
        public ActionResult getAzureConfig()
        {
            try
            {
                var response = new
                {
                    c = _configuration.GetValue<string>("AppSettings:AzureClientId"),
                    s = _configuration.GetValue<string>("AppSettings:TenantId"),
                    w = _configuration.GetValue<string>("AppSettings:BaseUrl")
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|getAzureConfig: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpGet("LoginConfiguration")]
        public ActionResult LoginConfiguration()
        {
            try
            {
                var respone = new
                {
                    PathLogoNav = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:PathLogoNav"),
                    PathLogoLogin = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:PathLogoLogin"),
                    PathLoading = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:PathLoading"),
                    PathCarousel = _configuration.GetSection("ReactConfiguration:LoginSetting:PathCarousel").Get<string[]>(),
                    Type = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:Type"),
                    IsMulti = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:IsMulti"),
                    CssConfig = new
                    {
                        width = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:CssConfig:width"),
                        height = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:CssConfig:height"),
                    }
                };
                return Ok(respone);

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|LoginConfiguration: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("ADTitle")]
        public ActionResult ADTitleConfiguration()
        {
            try
            {
                var respone = new
                {
                    ActiveBranchFromADTitle = _configuration.GetValue<string>("ADTitle:ActiveBranchFromADTitle"),
                    ActiveADTitleToPosition = _configuration.GetValue<string>("ADTitle:ActiveADTitleToPosition"),
                };
                return Ok(respone);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ADTitleConfiguration: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("UploadFileSetting")]
        public ActionResult UploadFileSettingConfiguration()
        {
            try
            {
                var respone = new
                {
                    LimitFileSize = _configuration.GetValue<string>("ReactConfiguration:UploadFileSetting:LimitFileSize"),
                    LimitFileInfo = _configuration.GetValue<string>("ReactConfiguration:UploadFileSetting:LimitFileInfo"),
                };
                return Ok(respone);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UploadFileSettingConfiguration: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("CannotDowLoadPDFDefault")]
        public ActionResult CannotDowLoadPDFDefault()
        {
            try
            {
                var respone = new
                {
                    CannotDowLoadPDFDefault = _configuration.GetValue<bool>("ReactConfiguration:CannotDowLoadPDFDefault"),
                };
                return Ok(respone);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CannotDowLoadPDFDefault: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        [HttpGet("getDateDeploy")]
        public ActionResult getDateDeployConfiguration()
        {
            try
            {

                FileInfo fi = new FileInfo("WolfR2.dll");
                var created = fi.CreationTime;
                var lastmodified = fi.LastWriteTime;
                var respone = new
                {
                    created = created,
                    lastmodified = lastmodified,
                };
                return Ok(respone);
            }

            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|getDateDeploy: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
