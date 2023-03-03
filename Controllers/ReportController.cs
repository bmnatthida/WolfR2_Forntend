using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Entities.Extention;
using WolfR2.Helper;
using WolfR2.Models;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string _reportId;
        private static DataTable dt_Report;
        private string module = "Report";
        public ReportController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        public class BaseBodyRequestModel
        {
            public DataTable dt_Report { get; set; }
        }

        /// <summary>
        /// ดึงข้อมูลของ Report จาก IdReport
        /// </summary>
        [HttpGet("GetReportById/{id}")]
        public async Task<ActionResult> GetReportById(int id)
        {
            try
            {
                var requestModel = new ReportDetailModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = "",
                    ReportTemplateId = id,
                    PageIndex = 0,
                    PageSize = 10000,
                };
                LogFile.WriteLogFile("ReportController GetReportById/{id} | api/Report/ViewReport | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Report/ViewReport", null, requestModel);
                dynamic config = JsonConvert.DeserializeObject<ExpandoObject>(result, new ExpandoObjectConverter());

                IDictionary<string, List<string>> request = new Dictionary<string, List<string>>();
                var table = JsonConvert.DeserializeObject<BaseBodyRequestModel>(result);
                dt_Report = table.dt_Report;
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(table.dt_Report);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetReportById: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        public class FavoritesItemModel:BaseBodyModel
        {
            public string FavoritesItem { get; set; }
        }

        [HttpPost("FilterAdvanceSearch")]
        public async Task<ActionResult> FilterDashboard(FavoritesItemModel filterModel)
        {
            try
            {
                var reportId = _configuration.GetValue<string>("ReactConfiguration:Dashboard:ReportId");
                var requestModel = new ReportDetailModel
                {
                    UserPrincipalName = filterModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = "",
                    ReportTemplateId = Int32.Parse(reportId),
                    PageIndex = 0,
                    PageSize = 10000,
                    FavoritesItem = filterModel.FavoritesItem
                };
                LogFile.WriteLogFile("ReportController FilterAdvanceSearch  | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Report/ViewReport", null, requestModel);
                dynamic config = JsonConvert.DeserializeObject<ExpandoObject>(result, new ExpandoObjectConverter());

                IDictionary<string, List<string>> request = new Dictionary<string, List<string>>();
                var table = JsonConvert.DeserializeObject<BaseBodyRequestModel>(result);

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(table.dt_Report);
                LogFile.WriteLogFile("ReportController FilterAdvanceSearch  | response : " + Newtonsoft.Json.JsonConvert.SerializeObject(table.dt_Report), module);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|FilterAdvanceSearch: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }


    }
}
