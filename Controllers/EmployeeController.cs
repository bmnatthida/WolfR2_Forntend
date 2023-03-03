using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;
using WolfR2.Helper;
using WolfR2.Constants;
using WolfR2.DtoModels;
using WolfR2.RequestModels;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Employee";
        public EmployeeController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูลของEmployee
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("EmployeeController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
            var EmployeeDto = JsonConvert.DeserializeObject<List<EmployeeDto>>(result);

           
            var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(EmployeeDto);

            return Ok(resultJson);
        }
        /// <summary>
        /// ดึงข้อมูลของEmployee
        /// </summary>
        [HttpGet("GetWithoutPicture")]
        public async Task<ActionResult> GetWithoutPicture()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("EmployeeController GetWithoutPicture | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                var EmployeeDto = JsonConvert.DeserializeObject<List<EmployeeWithoutPic>>(result);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(EmployeeDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetWithoutPicture: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
   
        }

        /// <summary>
        /// ดึงข้อมูลของEmployee
        /// </summary>
        [HttpGet("GetByEmail")]
        public async Task<ActionResult> GetByEmail()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("EmployeeController GetByEmail | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                var EmployeeDto = JsonConvert.DeserializeObject<List<EmployeeWithoutPic>>(result);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(EmployeeDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByEmail: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลของEmployee ด้วย ID
        /// </summary>
        [HttpPost("GetById")]
        public async Task<ActionResult> GetByID(EmployeeIdRequestModel employeeRequestModel)
        {
            try
            {
                var requestModel = new EmployeeIdRequestModel
                {
                    EmployeeId = employeeRequestModel.EmployeeId,
                    UserPrincipalName = employeeRequestModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("EmployeeController GetByEmail | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Employee/Employee", null, requestModel);
                var EmployeeDto = JsonConvert.DeserializeObject<EmployeeDto>(result);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(EmployeeDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetByID: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// อัพเดทข้อมูลของEmployee
        /// </summary>
        [HttpPost("UpdateData")]
        public async  Task<ActionResult> UpdateData(EmployeeRequestModel employeeRequestModel)
        {
            try
            {
                var data = JsonConvert.DeserializeObject<Dictionary<string, string>>(Newtonsoft.Json.JsonConvert.SerializeObject(employeeRequestModel));
                data.Add("connectionString", _configuration.GetValue<string>("AppSettings:ConnectionString"));
                data.Add("userPrincipalName", _configuration.GetValue<string>("AppSettings:UserPrincipalName"));
                data.Add("secretId", "");
                var json = JsonConvert.SerializeObject(data);
                LogFile.WriteLogFile("EmployeeController UpdateData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(data), module);

                var result = await CoreAPI.postJson(_baseUrl + "api/Employee/Save", null, json);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateData: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        /// <summary>
        /// อับเดทข้อมูลของSignature
        /// </summary>
        [HttpPost("UpdateSignature")]
        public async Task<ActionResult> UpdateSignature(UpdateSignatureRequestModel signatureRequestModel)
        {
            try
            {
                UpdateSignatureRequestModel requestModel = new UpdateSignatureRequestModel
                {
                    UserPrincipalName = signatureRequestModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    EmployeeId = signatureRequestModel.EmployeeId,
                    SignPicPath = signatureRequestModel.SignPicPath,
                    ModifiedDate = signatureRequestModel.ModifiedDate,
                    ModifiedBy = signatureRequestModel.ModifiedBy,
                };

                LogFile.WriteLogFile("EmployeeController UpdateSignature | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var result = await CoreAPI.post(_baseUrl + "api/Employee/UpdateSignature", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateSignature: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }


    }
}
