using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ProjectController : Controller
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Project";
        public ProjectController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูลของ ProjectList ทั้งหมด
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
                LogFile.WriteLogFile("ProjectController GetAll | api/Project/ProjectList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Project/ProjectList", null, requestModel);
                var projectDto = JsonConvert.DeserializeObject<List<ProjectDto>>(result);

                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(projectDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลของ ProjectList ทั้งหมดที่มีชื่อคนสร้าง
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
                LogFile.WriteLogFile("ProjectController GetAllWithName | api/Project/ProjectList,api/Employee/EmployeeList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var projectList = await CoreAPI.post(_baseUrl + "api/Project/ProjectList", null, requestModel);
                var resultEmployee = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                var ProjectListDto = JsonConvert.DeserializeObject<List<ProjectDto>>(projectList);
                var EmployeeDto = JsonConvert.DeserializeObject<List<EmployeeWithNameDto>>(resultEmployee);

                foreach (var projectDto in ProjectListDto)
                {
                    foreach (var employeeDto in EmployeeDto)
                    {
                        if (projectDto.CreatedBy == employeeDto.EmployeeId.ToString())
                        {
                            projectDto.CreatedByName = employeeDto.NameEn;
                        }
                    }
                }
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(ProjectListDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAllWithName: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }



        /// <summary>
        /// เพิ่มข้อมูลของ Project
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> Add(ProjectModel project)
        {
            try
            {
                var requestModel = new ProjectModel
                {
                    ProjectCode = project.ProjectCode,
                    ProjectName = project.ProjectName,
                    IsActive = project.IsActive,
                 
                    CreatedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    CreatedBy = "1",
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    ModifiedBy = "1",
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("ProjectController AddData | api/Project/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Project/Save", null, requestModel);
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
        /// อัพเดทข้อมูลของ Project
        /// </summary>
        [HttpPost("UpdateData")]
        public async Task<ActionResult> Update(ProjectModel project)
        {
            try
            {
                var requestModel = new ProjectModel
                {
                    ProjectCode = project.ProjectCode,
                    ProjectName = project.ProjectName,
                    IsActive = project.IsActive,

                    CreatedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    CreatedBy = "1",
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    ModifiedBy = "1",
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("ProjectController UpdateData | api/Project/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Project/Save", null, requestModel);
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
