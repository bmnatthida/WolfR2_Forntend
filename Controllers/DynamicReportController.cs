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
using WolfR2.RequestModels;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DynamicReportController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "DynamicReport";
        public DynamicReportController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูลของReportTemplate
        /// </summary>
        [HttpPost("GetAll")]
        public async Task<ActionResult> GetAll(EmployeeIdRequestModel employee)
        {
            try
            {
               var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = employee.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("DynamicReportController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var reportTemplateList = await CoreAPI.post(_baseUrl + "api/ReportTemplate/ReportTemplateList", null, requestModel);

                LogFile.WriteLogFile("DynamicReportController GetAll | result: " + Newtonsoft.Json.JsonConvert.SerializeObject(reportTemplateList), module);

                var templateList = await CoreAPI.post(_baseUrl + "api/ReportTemplate/TemplateList", null, requestModel);
                var roleList = await CoreAPI.post(_baseUrl + "api/Role/RoleList", null, requestModel);
                var thisEmployee = await CoreAPI.post(_baseUrl + "api/Employee/GetEmployeeByUserPrincipalName", null, requestModel);
                var masterDataList = await CoreAPI.post(_baseUrl + "api/MasterData/MasterDataListAll", null, requestModel);
                var userPermissionList = await CoreAPI.post(_baseUrl + "api/UserPermission/UserPermissionList", null, requestModel);
                //api / UserPermission / UserPermissionList

                var reportListDto = JsonConvert.DeserializeObject<List<ReportListDto>>(reportTemplateList);
                var templateListDto = JsonConvert.DeserializeObject<List<TemplateDto>>(templateList);
                var roleDto = JsonConvert.DeserializeObject<List<RolesDto>>(roleList);
                //var thisEmployeeDto = JsonConvert.DeserializeObject<EmployeeDto>(thisEmployee);
                var masterDataListDtos = JsonConvert.DeserializeObject<List<MasterDataListDto>>(masterDataList);
                var listuserpermission = JsonConvert.DeserializeObject<List<userPermissionDto>>(userPermissionList);

                List<MasterDataListDto> permissType = new List<MasterDataListDto>();
                var listPermission = masterDataListDtos.Where(a => a.MasterType?.ToLower() == "permission" && a.Value1 != null).ToList();
                var TemplatePermiss = templateListDto.Select(s => (s.DocumentCode).ToString()).ToArray();
                string Permission = "";
                Permission = listPermission.Count > 0 ? listPermission.FirstOrDefault().Value1 : "";
                var lstReporttemplate = new List<ReportListDto>();
            
                listuserpermission = listuserpermission.Where(a => a.EmployeeId.ToString() == employee.EmployeeId).ToList();

                if (listuserpermission.FindAll(a => a.RoleId == 1).Count() == 0)
                {
                    lstReporttemplate.AddRange(reportListDto.FindAll(a => a.IsPrivate == false));
                    if (Permission == "T")
                    {
                        foreach (var item in reportListDto)
                        {
                            foreach (var iTemplate in item.TemplateId.Split('|'))
                            {
                                if (TemplatePermiss.Any(a => a == iTemplate))
                                {
                                    lstReporttemplate.Add(item);
                                    break;
                                }

                            }
                        }
                    }
                    else
                    {
                        lstReporttemplate = reportListDto;
                    }
                }
                else
                {
                    lstReporttemplate = reportListDto;
                }

                var result = Newtonsoft.Json.JsonConvert.SerializeObject(lstReporttemplate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
 
        }
        /// <summary>
        /// ดึงข้อมูลของReportTemplate จากReportTemplateId
        /// </summary>
        [HttpPost("GetReportDetailById")]
        public async Task<ActionResult> GetDetailById(ReportDetailModel reportDetailModel)
        {
            try
            {
                var requestDetailModel = new ReportDetailModel
                {
                    UserPrincipalName = reportDetailModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
                };
                if (String.IsNullOrEmpty(reportDetailModel.FavoritesItem))
                {
                    var reportDetail = await CoreAPI.post(_baseUrl + "api/ReportTemplate/ReportTemplateSelectByReportID", null, requestDetailModel);
                    ReportTemplateModel _reportDetail = JsonConvert.DeserializeObject<ReportTemplateModel>(reportDetail);

                    reportDetailModel.FavoritesItem = JsonConvert.SerializeObject(_reportDetail.Selectedfieldlistfilter);
                }

                var requestModel = new ReportDetailModel
                {
                    UserPrincipalName = reportDetailModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = "",
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
                    PageIndex = reportDetailModel.PageIndex,
                    FavoritesItem = reportDetailModel.FavoritesItem,
                    IsActive = false,
                    PageSize = reportDetailModel.PageSize,
                };
                LogFile.WriteLogFile("DynamicReportController GetReportDetailById | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Report/ViewReport", null, requestModel);

                return Ok(result);
            }
            catch(Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetReportDetailById: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
           
        }


        [HttpPost("ReportTemplateSelectByReportID")]
        public async Task<ActionResult> GetReportTemplateSelectByReportID(ReportDetailModel reportDetailModel)
        {
            try
            {
                var requestModel = new ReportDetailModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                 
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
               
                };
                LogFile.WriteLogFile("DynamicReportController GetReportTemplateSelectByReportID | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/ReportTemplate/ReportTemplateSelectByReportID", null, requestModel);
                 return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ReportTemplateSelectByReportID: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpPost("DeleteReport")]
        public async Task<ActionResult> DeleteReport(ReportDetailModel reportDetailModel)
        {
            try
            {
                var requestModel = new ReportDetailModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
                };
                LogFile.WriteLogFile("DynamicReportController DeleteReport | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/ReportTemplate/DeleteReporttemplate", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|DeleteReport: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }



        [HttpPost("ReportListTemplateSelect")]
        public async Task<ActionResult> ReportListTemplateSelect(ReportListTemplateSelectRequestModel reportDetailModel)
        {
            try
            {
                var requestModel = new ReportListTemplateSelectRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
                    TemplateID = reportDetailModel.TemplateID,
                    Templateversion = reportDetailModel.Templateversion,
                };
                LogFile.WriteLogFile("DynamicReportController ReportListTemplateSelect | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "Api/ReportTemplate/ReportListTemplateSelect", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ReportListTemplateSelect: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
            
        }



        [HttpPost("AddReport")]
        public async Task<ActionResult> AddReport(ReportRequestModel reportDetailModel)
        {
            try {
                var requestModel = new ReportRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
                    ReportName = reportDetailModel.ReportName,
                    TemplateId = reportDetailModel.TemplateId,
                    Selectedfieldlist = reportDetailModel.Selectedfieldlist,
                    ReportDescription = reportDetailModel.ReportDescription,
                    IsActive = reportDetailModel.IsActive,
                    IsPrivate = reportDetailModel.IsPrivate,
                    CreateBy = reportDetailModel.CreateBy,
                    CreatedByname = "",
                    CreatedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    ModifiedBy = reportDetailModel.ModifiedBy,
                    ModifiedByname = "",
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    Selectedfieldlistfilter = reportDetailModel.Selectedfieldlistfilter,
                    Columns = reportDetailModel.Columns,
                    Rows = reportDetailModel.Rows,
                    TemplateNewVersion = reportDetailModel.TemplateNewVersion,
                    Mode = reportDetailModel.Mode,
                    RoleEmp = reportDetailModel.RoleEmp,
                    RoleId = reportDetailModel.RoleId


                };
                LogFile.WriteLogFile("DynamicReportController requestModel | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/ReportTemplate/CreateReporttemplate", null, requestModel);
                var Json_ = Newtonsoft.Json.JsonConvert.SerializeObject(requestModel);
                    
                return Ok(result);


            }
            catch(Exception ex)
            {
                LogFile.WriteLogFile("Exception|AddReport: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        
        [HttpPost("UpdateData")]
        public async Task<ActionResult> UpdateData(ReportRequestModel reportDetailModel)
        {
            try
            {
                var requestModel = new ReportRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ReportTemplateId = reportDetailModel.ReportTemplateId,
                    ReportName = reportDetailModel.ReportName,
                    TemplateId = reportDetailModel.TemplateId,
                    Selectedfieldlist = reportDetailModel.Selectedfieldlist,
                    ReportDescription = reportDetailModel.ReportDescription,
                    IsActive = reportDetailModel.IsActive,
                    IsPrivate = reportDetailModel.IsPrivate,
                    CreateBy = reportDetailModel.CreateBy,
                    CreatedByname = "",
                    CreatedDate = reportDetailModel.CreatedDate,
                    ModifiedBy = reportDetailModel.ModifiedBy,
                    ModifiedByname = "",
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    Selectedfieldlistfilter = reportDetailModel.Selectedfieldlistfilter,
                    Columns = reportDetailModel.Columns,
                    Rows = reportDetailModel.Rows,
                    TemplateNewVersion = reportDetailModel.TemplateNewVersion,
                    RoleEmp = reportDetailModel.RoleEmp,
                    RoleId = reportDetailModel.RoleId,
                    Mode=reportDetailModel.Mode
                };
                LogFile.WriteLogFile("DynamicReportController requestModel | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/ReportTemplate/UpdateReporttemplate", null, requestModel);
                var Json_ = Newtonsoft.Json.JsonConvert.SerializeObject(requestModel);

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
