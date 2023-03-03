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
    public class WorklistController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Worklist";
        public WorklistController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อูลของ WorkList
        /// </summary>
        [HttpPost("GetWorkListByTaskgroup")]
        public async Task<ActionResult> GetWorkListByTaskgroup(TaskGorupModel taskgroup)
        {
            try
            {
                var requestModel = new WorklistModel {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    CountMoreItem = taskgroup.CountMoreItem,
                    iItemPermore = taskgroup.iItemPerMore,
                    FilterText=taskgroup.FilterText,
                    FilterDateFrom=taskgroup.FilterDateFrom,
                    FilterDateTo= taskgroup.FilterDateTo

                };
                LogFile.WriteLogFile("WorklistController GetWorkListByTaskgroup | api/Worklist/GetWorkList/" + taskgroup.empId + "/"+ taskgroup.task + " | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Worklist/GetWorkList/"+taskgroup.empId+ "/" + taskgroup.task, null, requestModel);
                var memoDetailDto = JsonConvert.DeserializeObject<List<WorkListDto>>(result);
                memoDetailDto = memoDetailDto.OrderByDescending(x => x.ModifiedDate).ToList();
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(memoDetailDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetWorkListByTaskgroup: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
