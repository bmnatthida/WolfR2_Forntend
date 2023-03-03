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
using WolfR2.Models;
using WolfR2.RequestModels;
using System.Data;
using Newtonsoft.Json.Linq;
using WolfR2.Helper;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Department";
        public DepartmentController(IConfiguration configuration)
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
                LogFile.WriteLogFile("DepartmentController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Department/DepartmentListActive", null, requestModel);
                var departmentDto = JsonConvert.DeserializeObject<List<DepartmentDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(departmentDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        /// <summary>
        /// ดึงข้อมูลทั้งหมดของDepartmentListActiveมีชื่อของพนักงานด้วย
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
                LogFile.WriteLogFile("DepartmentController GetAllWithName | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var resultDepartment = await CoreAPI.post(_baseUrl + "api/Department/DepartmentListActive", null, requestModel);
                var resultEmployee = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                var departmentDto = JsonConvert.DeserializeObject<List<DepartmentDto>>(resultDepartment);
                var employeeDto = JsonConvert.DeserializeObject<List<EmployeeWithNameDto>>(resultEmployee); 

                var departments = departmentDto.Where(w => w.IsActive == true).ToList();

                foreach (var department in departments)
                {
                    foreach (var employee in employeeDto)
                    {
                        if (department.ModifiedBy == employee.EmployeeId.ToString())
                        {
                            department.ModifiedName = employee.NameEn; 
                        }
                    }
                }
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(departments);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAllWithName: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
           
        }
        /// <summary>
        /// เพิ่มข้อมูลของDepartment
        /// </summary>
        [HttpPost("AddDepartment")]
        public async Task<ActionResult> Add(DynamicMasterDataRequeseModel dynamicRequest)
        {
            try
            {
                var data = JsonConvert.DeserializeObject<Dictionary<string, string>>(dynamicRequest.model);
                data.Add("connectionString", _configuration.GetValue<string>("AppSettings:ConnectionString"));
                data.Add("userPrincipalName", _configuration.GetValue<string>("AppSettings:UserPrincipalName"));
                data.Add("secretId", "");
                var json = JsonConvert.SerializeObject(data);
                LogFile.WriteLogFile("DepartmentController AddDepartment | data : " + Newtonsoft.Json.JsonConvert.SerializeObject(data), module);

                var result = await CoreAPI.postJson(_baseUrl + "api/"+ dynamicRequest.name+ "/Save", null, json);
                return Ok(result);
            }
            catch(Exception ex)
            {
                LogFile.WriteLogFile("Exception|AddDepartment: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        /// <summary>
        /// อัพเดทข้อมูลของDepartment
        /// </summary>
        [HttpPost("")]
        public async Task<ActionResult> Update(DepartmentRequestModel organizeRequestModel)
        {
            try
            {
                var requestModel = new DepartmentRequestModel
                {
                    UserPrincipalName = organizeRequestModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    DepartmentCode = organizeRequestModel.DepartmentCode,
                    NameTh = organizeRequestModel.NameTh,
                    NameEn = organizeRequestModel.NameEn,
                    CreatedDate = organizeRequestModel.CreatedDate,
                    CreatedBy = organizeRequestModel.CreatedBy,
                    ModifiedDate = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss"),
                    ModifiedBy = organizeRequestModel.ModifiedBy,
                    IsActive = organizeRequestModel.IsActive,
                    SecretId = organizeRequestModel.SecretId
                };
                LogFile.WriteLogFile("DepartmentController  | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Department/Save", null, requestModel);
                if (result == "success")
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch(Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateDepartment: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw ex;
            }
        }
    }
}
