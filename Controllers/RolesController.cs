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

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        // GET: api/<RolesController>
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Roles";
        public RolesController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        private class Respone
        {
            public string result { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลของRole ทั้งหมด
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
                LogFile.WriteLogFile("RolesController GetAll | api/Role/AllRoleList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Role/AllRoleList", null, requestModel);
                var rolesDto = JsonConvert.DeserializeObject<List<RolesDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(rolesDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลของ RolePermission ทั้งหมด
        /// </summary>
        [HttpGet("GetRolePermission")]
        public async Task<ActionResult> GetRolePermissionById()
        {
            try
            {
                var requestModel = new
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("RolesController GetRolePermission | api/userpermission/userpermissionList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/userpermission/userpermissionList", null, requestModel);
                var permissionDto = JsonConvert.DeserializeObject<List<userPermissionDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(permissionDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetRolePermission: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// อัพเดทข้อมูลของRole 
        /// </summary>
        [HttpPost("UpdateRole")]
        public async Task<ActionResult> Update(RoleUpdateModel roleUpdateModel)
        {
            try
            {
                var result = "";
                var requestModel = new RolesRequestModel
                {
                    RoleId = roleUpdateModel.role.RoleId,
                    NameTh = roleUpdateModel.role.NameTh,
                    NameEn = roleUpdateModel.role.NameEn,
                    RoleDescription = roleUpdateModel.role.RoleDescription,
                    IsActive = roleUpdateModel.role.IsActive,
                    CreatedBy = roleUpdateModel.role.CreatedBy,
                    CreatedDate = roleUpdateModel.role.CreatedDate,
                    ModifiedBy = roleUpdateModel.role.ModifiedBy,
                    ModifiedDate = roleUpdateModel.role.ModifiedDate,
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("RolesController UpdateRole | api/Role/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                result = await CoreAPI.post(_baseUrl + "api/Role/Save", null, requestModel);
                var role = JsonConvert.DeserializeObject<RolesRequestModel>(result);

                if (roleUpdateModel.formRoleEmployee.Count > 0)
                {
                    List<FormRoleEmployeeRequestModel> items = new List<FormRoleEmployeeRequestModel>();
                    foreach (FormRoleEmployeeRequestModel formRoleEmployeeRequestModel in roleUpdateModel.formRoleEmployee)
                    {
                        if (roleUpdateModel.role.RoleId != -1)
                        {
                            var item = new FormRoleEmployeeRequestModel
                            {
                                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                                RoleId = roleUpdateModel.role.RoleId,
                                EmployeeId = formRoleEmployeeRequestModel.EmployeeId,
                                EmployeeCode = formRoleEmployeeRequestModel.EmployeeCode,
                                NameThRole = role.NameEn,
                                NameEnRole = role.NameTh,
                                IsActive = true,
                                Email = formRoleEmployeeRequestModel.Email,
                                NameThEmployee = formRoleEmployeeRequestModel.NameThEmployee,
                                NameEnEmployee = formRoleEmployeeRequestModel.NameEnEmployee,
                                IsDelete = formRoleEmployeeRequestModel.IsDelete,
                                Seq = formRoleEmployeeRequestModel.Seq,
                            };
                            items.Add(item);

                        }
                        else
                        {
                            var item = new FormRoleEmployeeRequestModel
                            {
                                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                                RoleId = role.RoleId,
                                EmployeeId = formRoleEmployeeRequestModel.EmployeeId,
                                EmployeeCode = formRoleEmployeeRequestModel.EmployeeCode,
                                NameThRole = role.NameEn,
                                NameEnRole = role.NameTh,
                                IsActive = true,
                                Email = formRoleEmployeeRequestModel.Email,
                                NameThEmployee = formRoleEmployeeRequestModel.NameThEmployee,
                                NameEnEmployee = formRoleEmployeeRequestModel.NameEnEmployee,
                                IsDelete = formRoleEmployeeRequestModel.IsDelete,
                                Seq = formRoleEmployeeRequestModel.Seq,
                            };
                            items.Add(item);

                        }

                        LogFile.WriteLogFile("RolesController UpdateRole | api/userpermission/Save | item : " + Newtonsoft.Json.JsonConvert.SerializeObject(items), module);

                        result = await CoreAPI.post(_baseUrl + "api/userpermission/save", null, items);

                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateRole: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                return Ok(ex);
            }

        }


        [HttpPost("GetPermissionByEmpId")]
        public async Task<ActionResult> Update(GetPermissionByEmpIdRequestModel requestModel)
        {
            var requestPermissionModel = new UserPermissionModel
            {
                UserPrincipalName = requestModel.UserPrincipalName,
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                EmployeeId = requestModel.EmployeeId
            };
            List<UserPermissionModel> list_UserPermission =
                                   JsonConvert.DeserializeObject<List<UserPermissionModel>>(await CoreAPI.post(_baseUrl + "api/RolePermission/GetRolePermissionListActive", null, requestPermissionModel));
            return Ok(list_UserPermission);
        }


    }
}
