using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;
using WolfR2.DtoModels;
using WolfR2.RequestModels;
using WolfR2.Helper;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestControlController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "RequestControl";
        public RequestControlController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูลของ AutoNumbe จาก RenderControl
        /// </summary>
        [HttpPost("GetAutoNumber")]
        public async Task<ActionResult> GetAutoNumber(RunningRequestModel runningModel)
        {
            try
            {
                var requestModel = new RunningRequestModel
                {
                    UserPrincipalName = runningModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = runningModel.TemplateId,
                    Prefix = runningModel.Prefix,
                    Digit = runningModel.Digit,
                    RunningNumber = runningModel.RunningNumber,
                };
                LogFile.WriteLogFile("RequestControlController GetAutoNumber | api/ControlRunning/GetControlRunning | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/ControlRunning/GetControlRunning", null, requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAutoNumber: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        /// <summary>
        /// ดึงข้อมูลของ ControlSaveRunning จาก RenderControl
        /// </summary>
        [HttpPost("SaveRunning")]
        public async Task<ActionResult> SaveRunning(RunningRequestModel runningModel)
        {
            try
            {
                var MemoAutoNumber = new MemoAutoNumberRequest
                {

                    UserPrincipalName = runningModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    MemoAutoNumber = runningModel

                };
                LogFile.WriteLogFile("RequestControlController GetRunning | api/ControlRunning/GetControlSaveRunning | MemoAutoNumber : " + Newtonsoft.Json.JsonConvert.SerializeObject(MemoAutoNumber), module);

                var result = await CoreAPI.post(_baseUrl + "api/ControlRunning/GetControlSaveRunning", null, MemoAutoNumber);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|SaveRunning: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpPost("GetRunning")]
        public async Task<ActionResult> GetRunning(RevisionRequestModel rvsRequestModel)
        {
            try
            {
                var requestModel = new RevisionRequestModel
                {

                    UserPrincipalName = rvsRequestModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = rvsRequestModel.TemplateId,
                    RefId = rvsRequestModel.RefId,
                    Digit = rvsRequestModel.Digit,
                    Alter = rvsRequestModel.Alter,
                    Itemlabel = rvsRequestModel.Itemlabel,
                    Labelrevision = rvsRequestModel.Labelrevision,
                    MemoId = 0,

                };
                LogFile.WriteLogFile("RequestControlController GetRunning | api/ControlRunning/GetRunning | MemoAutoNumber : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/ControlRevision/GetRunning", null, requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetRunning: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
