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


namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "History";
        public HistoryController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");

        }
        /// <summary>
        /// ดึงข้อมูลของHistories ของMemoDetail
        /// </summary>
        [HttpPost("GetByMemoId")]
        public async Task<ActionResult> GetByMemoId(HistoryModel historyModel)
        {
            try
            {
                var actor = new ActorModel();
                actor.EmployeeId = historyModel.actor.EmployeeId;
                var requestModel = new HistoryModel
                {
                    UserPrincipalName = historyModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    memoid = historyModel.memoid,
                    SecretId = "",
                    actor = actor
                };
                LogFile.WriteLogFile("HistoryController GetByMemoId | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var history = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Histories", null, requestModel);
                var historyDto = JsonConvert.DeserializeObject<List<HistoryDto>>(history);
                historyDto = historyDto.OrderByDescending(x => x.action_date).ToList();
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(historyDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByMemoId: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
