using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;


namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionLevelController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "PositionLevel";
        public PositionLevelController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูลPositionLevel
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            try
            {
                var requestModel = new 
                {
                    IsActive = false,
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("PositionLevelController GetAll | api/PositionLevel/positionLevelList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/PositionLevel/positionLevelList", null, requestModel);
                var PositionLevelDto = JsonConvert.DeserializeObject<List<PositionLevelDto>>(result);

                var resultDto = Newtonsoft.Json.JsonConvert.SerializeObject(PositionLevelDto);
                return Ok(resultDto);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลPositionLevel
        /// </summary>
        [HttpGet("GetAllWithName")]
        public async Task<ActionResult> GetAllWithName()
        {

            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("PositionLevelController GetAllWithName | api/PositionLevel/positionLevelList,api/Employee/EmployeeList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var positionList = await CoreAPI.post(_baseUrl + "api/PositionLevel/positionLevelList", null, requestModel);
                var resultEmployee = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                var PositionLevelDto = JsonConvert.DeserializeObject<List<PositionLevelDto>>(positionList);
                var EmployeeDto = JsonConvert.DeserializeObject<List<EmployeeWithNameDto>>(resultEmployee);

                var result = Newtonsoft.Json.JsonConvert.SerializeObject(PositionLevelDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAllWithName: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        
        /// <summary>
        /// เพิ่มข้อมูลPositionLevel
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> Add(PositionLevelRequestModel positionLevel)
        {
            try
            {
                var requestModel = new PositionLevelRequestModel
                {
                    AccountId = positionLevel.AccountId,
                    NameTh = positionLevel.NameTh,
                    NameEn = positionLevel.NameEn,
                    IsActive = positionLevel.IsActive,
                    PositionLevel = positionLevel.PositionLevel,
                    CreatedBy = positionLevel.CreatedBy,
                    ModifiedDate = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss"),
                    ModifiedBy = positionLevel.ModifiedBy,
                    CreatedDate = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss"),
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = ""
                };
                LogFile.WriteLogFile("PositionLevelController AddData | api/PositionLevel/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/PositionLevel/Save", null, requestModel);
                if (result == "success")
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
        /// อัพเดทข้อมูลPositionLevel
        /// </summary>
        [HttpPost("UpdateData")]
        public async Task<ActionResult> Update(PositionLevelRequestModel positionLevel)
        {
            try
            {
                var requestModel = new PositionLevelRequestModel
                {
                    PositionLevelId = positionLevel.PositionLevelId,
                    AccountId = positionLevel.AccountId,
                    NameTh = positionLevel.NameTh,
                    NameEn = positionLevel.NameEn,
                    IsActive = positionLevel.IsActive,
                    CreatedDate = positionLevel.CreatedDate,
                    CreatedBy = positionLevel.CreatedBy,
                    ModifiedDate = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss"),
                    ModifiedBy = positionLevel.ModifiedBy,
                    PositionLevel = positionLevel.PositionLevel,
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = ""
                };
                LogFile.WriteLogFile("PositionLevelController UpdateData | api/PositionLevel/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/PositionLevel/Save", null, requestModel);
                if (result == "success")
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
                LogFile.WriteLogFile("Exception|UpdateData: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }


    }
}
