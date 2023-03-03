using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DivisionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Division";
        public DivisionController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }


        /// <summary>
        /// ดึงข้อมูลทั้งหมดของDepartmentListActive
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
                LogFile.WriteLogFile("DevisionController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var divisionList = await CoreAPI.post(_baseUrl + "api/Division/DivisionList", null, requestModel);

                var divisionListtDto = JsonConvert.DeserializeObject<List<DivisionDto>>(divisionList);

                var result = Newtonsoft.Json.JsonConvert.SerializeObject(divisionListtDto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
          
        }
        /// <summary>
        /// ดึงข้อมูลทั้งหมดของDivisionListมีชื่อของพนักงานด้วย
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
                LogFile.WriteLogFile("DevisionController GetAllWithName | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var divisionList = await CoreAPI.post(_baseUrl + "api/Division/DivisionList", null, requestModel);
                var resultEmployee = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                var divisionListDto = JsonConvert.DeserializeObject<List<DivisionDto>>(divisionList);
                var EmployeeDto = JsonConvert.DeserializeObject<List<EmployeeWithNameDto>>(resultEmployee);

                foreach (var divisionDto in divisionListDto)
                {
                    foreach (var employeeDto in EmployeeDto)
                    {
                        if (divisionDto.CreatedBy == employeeDto.EmployeeId.ToString())
                        {
                            divisionDto.CreatedByName = employeeDto.NameEn;
                        }
                    }
                }
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(divisionListDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAllWithName: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
            
        }
        /// <summary>
        /// เพิ่มข้อมูลของAddDivision
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> Add(DivisionModel division)
        {
            try
            {
                var requestModel = new DivisionModel
                {
                    NameTh = division.NameTh,
                    NameEn = division.NameTh,
                    IsActive = division.IsActive,
                    DivisionCode= division.DivisionCode,
                    CreatedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    CreatedBy = "1",
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    ModifiedBy = "1",
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("DevisionController AddData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Division/Save", null, requestModel);
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
        /// อัพเดทข้อมูลของUpdateDivision
        /// </summary>
        [HttpPost("UpdateData")]
        public async Task<ActionResult> Update(DivisionModel division)
        {
            try
            {
                var requestModel = new DivisionModel
                {
                    DivisionId = division.DivisionId,
                    NameTh = division.NameTh,
                    NameEn = division.NameEn,
                    IsActive = division.IsActive,
                    DivisionCode = division.DivisionCode,
                    CreatedDate = division.CreatedDate,
                    CreatedBy = division.ModifiedDate,
                    ModifiedDate = division.ModifiedDate,
                    ModifiedBy = division.ModifiedBy,
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("DevisionController UpdateData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Division/Save", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateData: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }




    }


}
