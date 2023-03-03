using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WolfApprove.Model.ExternalConnection;
using Newtonsoft.Json;
using WolfR2.Models;
using WolfR2.DtoModels;
using WolfR2.RequestModels;
using WolfR2.Helper;


namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorizedController : Controller
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Authorized";
        public AuthorizedController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");

        }
        private class Respone
        {
            public string result { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลทั้งหมด AuthorizedMenu
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            try
            {
              var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("AuthorrizeController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/AuthorizedMenu/GetAuthorizedMenuAll", null, requestModel);
                var AuthMenuDto = JsonConvert.DeserializeObject<List<AuthMenuDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(AuthMenuDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|RegisterWolf: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
          
        }

    }
}
