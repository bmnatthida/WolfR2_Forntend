
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;
using WolfR2.DtoModels;
using Newtonsoft.Json;
using WolfR2.Helper;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NavbarMenuController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "NavbarMenu";
        public NavbarMenuController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        public class emailModel {
             public string mail { get; set; }

        }
        /// <summary>
        /// ดึงข้อมูลAuthorizedMenu ทั้งหมด
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                var request = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("NavbarMenuController GetAll | api/AuthorizedMenu/GetAuthorizedMenu | request : " + Newtonsoft.Json.JsonConvert.SerializeObject(request), module);

                var result = await CoreAPI.post(_baseUrl + "api/AuthorizedMenu/GetAuthorizedMenu", null, request);
                var AuthMenuDto = JsonConvert.DeserializeObject<List<AuthMenuDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(AuthMenuDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลAuthorizedMenu ทั้งหมด ด้วย Email
        /// </summary>
        [HttpPost("GetAllByEmail")]
        public async Task<ActionResult> GetAllByEmail(emailModel emailRequest)
        {
            try
            {
                var request = new BaseBodyModel
                {
                    UserPrincipalName = emailRequest.mail,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("NavbarMenuController GetAll | api/AuthorizedMenu/GetAuthorizedMenu | request : " + Newtonsoft.Json.JsonConvert.SerializeObject(request), module);

                var result = await CoreAPI.post(_baseUrl + "api/AuthorizedMenu/GetAuthorizedMenu", null, request);
                var AuthMenuDto = JsonConvert.DeserializeObject<List<AuthMenuDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(AuthMenuDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAllByEmail: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
       
    }
}
