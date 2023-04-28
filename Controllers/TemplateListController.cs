using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.ExternalConnection;
using WolfR2.Helper;
using WolfR2.Models;
using WolfR2.RequestModels;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateListController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "TemplateList";
        public TemplateListController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }

        private class Respone
        {
            public string result { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูล Template ทั้งหมด
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> Get()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("RolesController | api/Template/TemplateList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var templateList = await CoreAPI.post(_baseUrl + "api/Template/TemplateList", null, requestModel);
            List<TemplateModel> resultJson = JsonConvert.DeserializeObject<List<TemplateModel>>(templateList);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(resultJson);
            return Ok(result);
        }

        /// <summary>
        /// ดึงข้อมูล Template ทั้งหมด
        /// </summary>

        [HttpPost("GetTemplateBindGroup")]
        public async Task<ActionResult> GetTemplateBindGroup(SearchTemplateListVersionRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = requestOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),


                };
                var requestPermissionModel = new UserPermissionModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    EmployeeId = int.Parse(requestOBJRequest.CreatedBy)


                };
                LogFile.WriteLogFile("RolesController | api/Template/TemplateList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/TemplateList", null, requestModel);
                List<TemplateModel> resultJson = JsonConvert.DeserializeObject<List<TemplateModel>>(await CoreAPI.post(_baseUrl + "api/Template/TemplateList", null, requestModel));
                List<TemplateModel> ResultTemplates = new List<TemplateModel>();

                foreach (var _OtherDto in resultJson)
                {
                    if (string.IsNullOrEmpty(_OtherDto.GroupTemplateName))
                    {
                        _OtherDto.GroupTemplateName = "Other";
                    }

                }



                if (resultJson.Count > 0)
                {


                    List<UserPermissionModel> list_UserPermission =
                        JsonConvert.DeserializeObject<List<UserPermissionModel>>(await CoreAPI.post(_baseUrl + "api/RolePermission/GetRolePermissionListActive", null, requestPermissionModel));
                    if (list_UserPermission != null && list_UserPermission.Count > 0)
                        list_UserPermission = list_UserPermission.Where(x => x.IsDelete != true).GroupBy(a => a.RoleId).Select(a => a.First()).ToList();

                    resultJson = resultJson.Where(x =>
                        (
                            (String.IsNullOrEmpty(x.SpecificEmployeeId) && String.IsNullOrEmpty(x.SpecificRoleID)) ?
                                (x.isPublic == true || x.DepartmentId == requestOBJRequest.DepartmentId) :
                                (
                                    (Array.FindIndex(x.SpecificEmployeeId.Split(','), y => y.ToString() == requestOBJRequest.CreatedBy) != -1)
                                    ||
                                    (Array.FindIndex(x.SpecificRoleID.Split(','), y =>
                                      Array.FindIndex(list_UserPermission.ToArray(), z => z.RoleId.ToString().ToUpper() == y.ToString().ToUpper()) != -1
                                    ) != -1)
                                    ||
                                    (x.DepartmentId == requestOBJRequest.DepartmentId)
                                )
                       )
                           //Benz
                           &&
                             (
                                true ? x.IsActive == true : x.IsActive == x.IsActive
                             )
                    //    &&
                    //(
                    //    x.IsActive == true
                    //)
                    ).ToList();
                    resultJson = resultJson.OrderBy(x => x.DocumentCode).ToList();
                }
                var _resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(resultJson);
                return Ok(_resultJson);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        /// <summary>
        /// ดึงข้อมูล Template ทั้งหมด
        /// </summary>

        [HttpPost("GetAll")]
        public async Task<ActionResult> GetTemplateBindFormNameDDL(SearchTemplateListVersionRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new SearchTemplateListVersionGetAllRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    CreatedBy = requestOBJRequest.CreatedBy,
                    DepartmentId = "",
                };
                LogFile.WriteLogFile("TemplateFromDDL |api/Template/SearchTemplateListVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var resultJson = await CoreAPI.post(_baseUrl + "api/Template/SearchTemplateListVersion", null, requestModel);
                var templateDto = JsonConvert.DeserializeObject<List<TemplateDto>>(resultJson);
                var templateJson = Newtonsoft.Json.JsonConvert.SerializeObject(templateDto);
                return Ok(templateJson);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// ดึงข้อมูล Template ตามสิทธิ์
        /// </summary>

        [HttpPost("GetTemplateFromDDL")]
        public async Task<ActionResult> GetTemplateFromDDL(GetTemplateFromDDLRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new GetTemplateFromDDLRequestModel
                {
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    Username = requestOBJRequest.Username,
                    DepartmentId = requestOBJRequest.DepartmentId,
                    EmployeeId = requestOBJRequest.EmployeeId,
                    Email = requestOBJRequest.Email,
                    ConditionForm = "",
                    selectAll = requestOBJRequest.selectAll,
                    DefultMode = requestOBJRequest.DefultMode,
                    OnlyActive = requestOBJRequest.OnlyActive
                };
                LogFile.WriteLogFile("GetTemplateFromDDL | api/Template/TemplateFromDDL | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var resultJson = await CoreAPI.post(_baseUrl + "api/Template/TemplateFromDDL", null, requestModel);
                var templateDto = JsonConvert.DeserializeObject<List<TemplateDto>>(resultJson);
                var templateJson = Newtonsoft.Json.JsonConvert.SerializeObject(templateDto);
                return Ok(templateJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("GetTemplateFromDDL | api/Template/TemplateFromDDL | ex : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);

                throw ex;
            }
        }


        [HttpPost("GetTemplateBindFormNameDDL")]
        public async Task<ActionResult> GetAllTemplateBindFormNameDDL(SearchTemplateListVersionRequestModel requestOBJRequest)
        {
            try
            {

                var requestModel = new SearchTemplateListVersionGetAllRequestModel
                {
                    UserPrincipalName = requestOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    CreatedBy = requestOBJRequest.CreatedBy,
                    DepartmentId = "",
                };
                LogFile.WriteLogFile("TemplateFromDDL |api/Template/SearchTemplateListVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var resultJson = await CoreAPI.post(_baseUrl + "api/Template/SearchTemplateListVersion", null, requestModel);




                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }



        /// <summary>
        /// ดึงข้อมูล TemplateList 
        /// </summary>

        [HttpPost("GetTemplateListBindGroup")]
        public async Task<ActionResult> GetTemplateListBindGroup(SearchTemplateListVersionRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = requestOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),


                };
                var requestPermissionModel = new UserPermissionModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    EmployeeId = int.Parse(requestOBJRequest.CreatedBy)
                };
                LogFile.WriteLogFile("RolesController | api/Template/TemplateList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/TemplateList", null, requestModel);
                List<TemplateModel> resultJson = JsonConvert.DeserializeObject<List<TemplateModel>>(await CoreAPI.post(_baseUrl + "api/Template/TemplateList", null, requestModel));
                List<TemplateModel> ResultTemplates = new List<TemplateModel>();

                foreach (var _OtherDto in resultJson)
                {
                    if (string.IsNullOrEmpty(_OtherDto.GroupTemplateName))
                    {
                        _OtherDto.GroupTemplateName = "Other";

                    }

                }



                if (resultJson.Count > 0)
                {


                    List<UserPermissionModel> list_UserPermission =
                        JsonConvert.DeserializeObject<List<UserPermissionModel>>(await CoreAPI.post(_baseUrl + "api/RolePermission/GetRolePermissionListActive", null, requestPermissionModel));
                    if (list_UserPermission != null && list_UserPermission.Count > 0)
                        list_UserPermission = list_UserPermission.Where(x => x.IsDelete != true).GroupBy(a => a.RoleId).Select(a => a.First()).ToList();

                    resultJson = resultJson.Where(x =>
                        (
                            (String.IsNullOrEmpty(x.SpecificEmployeeId) && String.IsNullOrEmpty(x.SpecificRoleID)) ?
                                (x.isPublic == true || x.DepartmentId == requestOBJRequest.DepartmentId) :
                                (
                                    (Array.FindIndex(x.SpecificEmployeeId.Split(','), y => y.ToString() == requestOBJRequest.CreatedBy) != -1)
                                    ||
                                    (Array.FindIndex(x.SpecificRoleID.Split(','), y =>
                                      Array.FindIndex(list_UserPermission.ToArray(), z => z.RoleId.ToString().ToUpper() == y.ToString().ToUpper()) != -1
                                    ) != -1)
                                    ||
                                    (x.DepartmentId == requestOBJRequest.DepartmentId)
                                )
                       )
                           //Benz
                           &&
                             (
                                true ? x.IsActive == true : x.IsActive == x.IsActive
                             )
                    //    &&
                    //(
                    //    x.IsActive == true
                    //)
                    ).ToList();
                    resultJson = resultJson.OrderBy(x => x.DocumentCode).ToList();
                }
                var _resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(resultJson);
                List<TemplateDto> _res = JsonConvert.DeserializeObject<List<TemplateDto>>(_resultJson);
                return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(_res));
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }







        /// <summary>
        /// ดึงข้อมูล Template ทั้งหมด แบบกำหนด Model
        /// </summary>
        [HttpPost("GetTemplateByDocTypeCode")]
        public async Task<ActionResult> GetTemplateByDocTypeCode(TemplateByDocTypeCodeRequestModel request)
        {
            var requestModel = new TemplateByDocTypeCodeRequestModel
            {
                UserPrincipalName = request.UserPrincipalName,
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                DocumentCode = request.DocumentCode
            };
            LogFile.WriteLogFile("RolesController GetTemplateByDocTypeCod | api/Template/TemplateByDocTypeCode | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Template/TemplateByDocTypeCode", null, requestModel);

            return Ok(result);

        }


        /// <summary>
        /// ดึงข้อมูล Template ตาม สิตธิ
        /// </summary>
        [HttpPost("GetAllVersion")]
        public async Task<ActionResult> GetAllVersion(SearchTemplateListVersionRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new SearchTemplateListVersionRequestModel
                {
                    UserPrincipalName = requestOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    CreatedBy = requestOBJRequest.CreatedBy,
                    DepartmentId = requestOBJRequest.DepartmentId,
                };
                LogFile.WriteLogFile("RolesController GetAllVersion | api/Template/SearchTemplateListVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/SearchTemplateListVersion", null, requestModel);

                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(result);

                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        [HttpPost("SearchTemplateListEditing")]
        public async Task<ActionResult> SearchTemplateListEditing(TemplateOBJRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new TemplateOBJRequestModel
                {
                    UserPrincipalName = requestOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = requestOBJRequest.TemplateId,
                    CreatedBy = requestOBJRequest.CreatedBy

                };
                LogFile.WriteLogFile("RolesController GetAllVersion | api/Template/SearchTemplateListVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/SearchTemplateListVersion", null, requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        [HttpPost("GetTemplateListVersionHistory")]
        public async Task<ActionResult> GetTemplateListVersionHistory(VersionHistoryRequestModel requestOBJRequest)
        {
            try
            {
                var requestModel = new VersionHistoryRequestModel
                {
                    UserPrincipalName = requestOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    DocumentCode = requestOBJRequest.DocumentCode

                };
                LogFile.WriteLogFile("RolesController GetAllVersion | api/Template/GetTemplateListVersionHistory | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/GetTemplateListVersionHistory", null, requestModel);



                return Ok(result);


            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        /// <summary>
        /// ดึงข้อมูล Template ตาม ID
        /// </summary>
        [HttpPost("GetById")]
        public async Task<ActionResult> GetById(TemplateOBJRequestModel templateOBJRequest)
        {
            try
            {
                var requestModel = new TemplateOBJRequestModel
                {
                    UserPrincipalName = templateOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = templateOBJRequest.TemplateId
                };
                LogFile.WriteLogFile("RolesController GetById | api/Template/TemplateByid | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/TemplateByid", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// ดึงข้อมูลของ LoadLogic
        /// </summary>
        [HttpPost("TemplateByid/LoadLogic")]
        public async Task<ActionResult> LoadLogic(TemplateOBJRequestModel templateOBJRequest)
        {
            try
            {
                var requestModel = new TemplateOBJRequestModel
                {
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = templateOBJRequest.TemplateId
                };
                LogFile.WriteLogFile("RolesController TemplateByid/LoadLogic | api/Template/loadlogic | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/loadlogic", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// ดึงข้อมูลของ loaddataformcontrol
        /// </summary>
        [HttpPost("TemplateByid/LoadLogic/GetLoadDataFormControl")]
        public async Task<ActionResult> GetLoadDataFormControl(GetLoadDataFormControlModel requesetModel)
        {
            try
            {
                IDictionary<string, string> request = new Dictionary<string, string>();

                request.Add(new KeyValuePair<string, string>("Connection", _configuration.GetValue<string>("AppSettings:ConnectionString")));
                request.Add(new KeyValuePair<string, string>("userPrincipalName", _configuration.GetValue<string>("AppSettings:UserPrincipalName")));
                request.Add(new KeyValuePair<string, string>("logicid", requesetModel.LogicId));
                request.Add(new KeyValuePair<string, string>(requesetModel.Key, requesetModel.Value));


                string MyDictionaryToJson(IDictionary<string, string> dict)
                {
                    var entries = dict.Select(d =>
                        string.Format("\"{0}\": \"{1}\"", d.Key, string.Join(",", d.Value)));
                    return "{" + string.Join(",", entries) + "}";
                }
                var resultJson = MyDictionaryToJson(request);
                LogFile.WriteLogFile("RolesController TemplateByid/LoadLogic/GetLoadDataFormControl | api/Template/getloaddataformcontrol | resultJson : " + Newtonsoft.Json.JsonConvert.SerializeObject(resultJson), module);

                var result = await CoreAPI.postJson(_baseUrl + "api/Template/getloaddataformcontrol", null, resultJson);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// ดึงข้อมูลของ loaddataformcontrol
        /// </summary>
        [HttpPost("TemplateByid/LoadLogic/GetLoadDataFormControl2")]
        public async Task<ActionResult> GetLoadDataFormControl2(List<GetLoadDataFormControlModel> requesetModel)
        {
            try
            {
                IDictionary<string, string> request = new Dictionary<string, string>();
                request.Add(new KeyValuePair<string, string>("Connection", _configuration.GetValue<string>("AppSettings:ConnectionString")));
                request.Add(new KeyValuePair<string, string>("userPrincipalName", _configuration.GetValue<string>("AppSettings:UserPrincipalName")));
                request.Add(new KeyValuePair<string, string>("logicid", requesetModel[0].LogicId));
                foreach (var item in requesetModel)
                {
                    if (item.Key != "" && item.Value != "")
                    {
                        request.Add(new KeyValuePair<string, string>(item.Key, item.Value));

                    }
                }

                string MyDictionaryToJson(IDictionary<string, string> dict)
                {
                    var entries = dict.Select(d =>
                        string.Format("\"{0}\": \"{1}\"", d.Key, string.Join(",", d.Value)));
                    return "{" + string.Join(",", entries) + "}";
                }
                var resultJson = MyDictionaryToJson(request);
                LogFile.WriteLogFile("RolesController TemplateByid/LoadLogic/GetLoadDataFormControl | api/Template/getloaddataformcontrol | resultJson : " + Newtonsoft.Json.JsonConvert.SerializeObject(resultJson), module);

                var result = await CoreAPI.postJson(_baseUrl + "api/Template/getloaddataformcontrol", null, resultJson);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// ดึงข้อมูลของ loaddataformcontrol
        /// </summary>
        [HttpPost("TemplateByid/LoadLogic/GetLoadLineApproveFormControl")]
        public async Task<ActionResult> GetLoadLineApproveFormControl(GetLoadLineApproveFormControlModel requesetModel)
        {
            try

            {
                var template = new TemplateForm
                {
                    AutoApprove = requesetModel.templateForm.auto_approve,
                    AutoApproveWhen = requesetModel.templateForm.auto_approve_when,
                    TemplateId = requesetModel.templateForm.template_id,
                };

                var requestModel = new TemplateLineApproveRequestModel
                {
                    lstTRNLineApprove = requesetModel.lstTRNLineApprove,
                    templateForm = template,
                    Amount = requesetModel.Amount,
                    VEmployee = requesetModel.employee,
                    JsonCondition = requesetModel.JsonCondition,
                    ComCode = requesetModel.ComCode,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString")
                };
                LogFile.WriteLogFile("RolesController TemplateByid/LoadLogic/GetLoadLineApproveFormControl | api/LineApprove/LineApproveWithTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var stringfy = Newtonsoft.Json.JsonConvert.SerializeObject(requestModel);
                var result = await CoreAPI.post(_baseUrl + "api/LineApprove/LineApproveWithTemplate", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("RolesController TemplateByid/LoadLogic/GetLoadLineApproveFormControl | api/LineApprove/LineApproveWithTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw ex;
            }
        }
        public class GetLoadDataRef
        {
            public string query { get; set; }
            public string ConnectionString { get; set; }
        }
        public class RefFilter
        {
            public string mstColumn { get; set; }
            public string tbColumn { get; set; }

        }
        public class LoadField
        {
            public string MSTColumn { get; set; }
            public string TBColumn { get; set; }

        }
        public class GetLoadDataRefJson
        {
            public string label { get; set; }
            public string Mastertable { get; set; }
            public string Type { get; set; }
            public string ColumnAll { get; set; }
            public List<LoadField> Column { get; set; }
            public List<LoadField> Filter { get; set; }
            public string orCondition { get; set; }

            public string condition { get; set; }


        }
        /// <summary>
        /// ดึงข้อมูลของ DynamicTB
        /// </summary>
        [HttpPost("TemplateByid/LoadLogic/GetLoadDataFormControlRef")]
        public async Task<ActionResult> GetLoadDataFormControlRef(GetLoadDataRefJson requesetModel)
        {
            try
            {
                var query = "SELECT * FROM " + requesetModel.Mastertable + " WHERE ";

                if (requesetModel.orCondition.Length > 0)
                {
                    query = query + requesetModel.orCondition;
                }
                if (requesetModel.condition.Length > 0 && requesetModel.orCondition.Length > 0)
                {
                    query = query + " AND " + requesetModel.condition;
                }
                if (requesetModel.condition.Length > 0 && requesetModel.orCondition.Length == 0)
                {
                    query = query + " " + requesetModel.condition;
                }
                if (requesetModel.Mastertable == "MSTMasterData" && requesetModel.Type.Length > 0)
                {
                    query = query + " AND MasterType = '" + requesetModel.Type + "'";
                }
                //var query = "SELECT * FROM "+ requesetModel.mstTable + " WHERE ";

                //for (var i = 0; i < requesetModel.refFilter.Count; i++)
                //{
                //    var refFilter = requesetModel.refFilter[i];
                //    if (i == 0 && requesetModel.refFilter.Count > 1)
                //    {
                //        query = query + refFilter.mstColumn+"='"+ refFilter.tbColumn+ "' AND ";
                //    }
                //    if (i % 2 == 0)
                //    {
                //        query = query + refFilter.mstColumn + "='" + refFilter.tbColumn+"'";


                //    }
                //    if (i % 2 != 0 && i != 0)
                //    {
                //        query = query + " AND "+ refFilter.mstColumn + "='" + refFilter.tbColumn+"'";

                //    }
                //}
                //if (requesetModel.mstTable == "MSTMasterData" && requesetModel.mstType.Length > 0)
                //{
                //    query = query + " AND MasterType = '"+ requesetModel.mstType+"'";
                //}
                //if (requesetModel.mColumn.Length > 0)
                //{
                //    query = query + " AND " + requesetModel.mColumn+ "='"+ requesetModel.mstType+"'";
                //}
                //if (requesetModel.columnAll.Length > 0)
                //{
                //    query = query + " AND "+ requesetModel.columnAll+ "='All'";
                //}
                var requestModel = new GetLoadDataRef
                {
                    query = query,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString")
                };
                LogFile.WriteLogFile("RolesController TemplateByid/LoadLogic/GetLoadDataFormControlRef | api/Table/GetDynamicTB | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Table/GetDynamicTB", null, requestModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// ดึงข้อมูล CreateTemplate 
        /// </summary>
        [HttpGet("GetAllByCreateTemplate")]
        public async Task<ActionResult> GetAllByCreateTemplate()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("RolesController GetAllByCreateTemplate | api/Template/TemplateList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Template/TemplateList", null, requestModel);
            var templateDto = JsonConvert.DeserializeObject<List<CreateTableControlTemplateDto>>(result);

            var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(templateDto);
            return Ok(result);
        }
        /// <summary>
        /// ดึงข้อมูล ReportTemplate 
        /// </summary>
        [HttpGet("GetAllReportTemplateList")]
        public async Task<ActionResult> ReportTemplateList()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("RolesController GetAllReportTemplateList | api/ReportTemplate/ReportTemplateList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/ReportTemplate/ReportTemplateList", null, requestModel);
            var reportDto = JsonConvert.DeserializeObject<List<CreateTableReportTemplateDto>>(result);
            var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(reportDto);
            return Ok(resultJson);

        }

        [HttpGet("ReportTemplateListWithTemplate")]
        public async Task<ActionResult> ReportTemplateListWithTemplate()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("RolesController GetAllReportTemplateList | api/ReportTemplate/ReportTemplateList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/ReportTemplate/ReportTemplateList", null, requestModel);
            return Ok(result);

        }



        /// <summary>
        /// ดึงข้อมูล Template ตาม ID แบบกำหนด Model 
        /// </summary>
        [HttpPost("GetTemplateByIdDto")]
        public async Task<ActionResult> GetTemplateByIdDto(TemplateOBJRequestModel templateOBJRequest)
        {
            try
            {
                var requestModel = new TemplateOBJRequestModel
                {

                    UserPrincipalName = templateOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = templateOBJRequest.TemplateId
                };
                LogFile.WriteLogFile("RolesController GetTemplateByIdDto | api/Template/TemplateByid | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/TemplateByid", null, requestModel);
                var templateDto = JsonConvert.DeserializeObject<CreateTableControlTemplateDto>(result);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(templateDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        /// <summary>
        /// เพิ่ม Template ที่สร้าง
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> AddTemplate(TemplateRequestModel template)
        {
            try
            {
                var requestModel = new TemplateRequestModel
                {
                    UserPrincipalName = template.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    Amount = template.Amount,
                    JsonCondition = template.JsonCondition,
                    listRefTemplate = template.listRefTemplate,
                    templateForm = template.templateForm,
                    specificApprovers = template.specificApprovers,
                    specificTempApprovers = template.specificTempApprovers,
                    TemLineApprove = template.TemLineApprove,
                    VEmployee = template.VEmployee,
                    lstTRNLineApprove = template.lstTRNLineApprove,
                    cMSTApprovalMatrix = template.cMSTApprovalMatrix,
                    cMSTPositionLevel = template.cMSTPositionLevel,
                    cMSTCompany = template.cMSTCompany,
                    lstMasterData = template.lstMasterData,
                    ComCode = template.ComCode,
                    cMSTTemplateLogic = template.cMSTTemplateLogic,
                    cMSTMasterData = template.cMSTMasterData,
                    Authorization_manage_company = template.Authorization_manage_company,
                    Authorization_manage_department = template.Authorization_manage_department,
                    Authorization_request_company = template.Authorization_request_company,
                    Authorization_request_department = template.Authorization_request_department,
                    Authorization_view = template.Authorization_view,
                };
                LogFile.WriteLogFile("TemplateListController AddData | api/Template/SaveTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/SaveTemplate", null, requestModel);

                var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
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
                throw ex;
            }

        }

        [HttpPost("SaveTemplateAndVersion")]
        public async Task<ActionResult> SaveTemplateAndVersion(TemplateRequestModel template)
        {
            try
            {
                var requestModel = new TemplateRequestModel
                {
                    UserPrincipalName = template.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    Amount = template.Amount,
                    JsonCondition = template.JsonCondition,
                    listRefTemplate = template.listRefTemplate,
                    templateForm = template.templateForm,
                    specificApprovers = template.specificApprovers,
                    specificTempApprovers = template.specificTempApprovers,
                    TemLineApprove = template.TemLineApprove,
                    VEmployee = template.VEmployee,
                    lstTRNLineApprove = template.lstTRNLineApprove,
                    cMSTApprovalMatrix = template.cMSTApprovalMatrix,
                    cMSTPositionLevel = template.cMSTPositionLevel,
                    cMSTCompany = template.cMSTCompany,
                    lstMasterData = template.lstMasterData,
                    ComCode = template.ComCode,
                    cMSTTemplateLogic = template.cMSTTemplateLogic,
                    cMSTMasterData = template.cMSTMasterData,
                    Authorization_manage_company = template.Authorization_manage_company,
                    Authorization_manage_department = template.Authorization_manage_department,
                    Authorization_request_company = template.Authorization_request_company,
                    Authorization_request_department = template.Authorization_request_department,
                    Authorization_view = template.Authorization_view,
                };
                LogFile.WriteLogFile("TemplateListController AddData | api/Template/SaveTemplateAndVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/SaveTemplateAndVersion", null, requestModel);

                var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
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
                throw ex;
            }

        }

        [HttpPost("DeleteTemplate")]
        public async Task<ActionResult> DeleteTemplate(TemplateRequestModel template)
        {
            try
            {
                var requestModel = new TemplateRequestModel
                {
                    UserPrincipalName = template.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    Amount = template.Amount,
                    JsonCondition = template.JsonCondition,
                    listRefTemplate = template.listRefTemplate,
                    templateForm = template.templateForm,
                    specificApprovers = template.specificApprovers,
                    specificTempApprovers = template.specificTempApprovers,
                    TemLineApprove = template.TemLineApprove,
                    VEmployee = template.VEmployee,
                    lstTRNLineApprove = template.lstTRNLineApprove,
                    cMSTApprovalMatrix = template.cMSTApprovalMatrix,
                    cMSTPositionLevel = template.cMSTPositionLevel,
                    cMSTCompany = template.cMSTCompany,
                    lstMasterData = template.lstMasterData,
                    ComCode = template.ComCode,
                    cMSTTemplateLogic = template.cMSTTemplateLogic,
                    cMSTMasterData = template.cMSTMasterData,
                    Authorization_manage_company = template.Authorization_manage_company,
                    Authorization_manage_department = template.Authorization_manage_department,
                    Authorization_request_company = template.Authorization_request_company,
                    Authorization_request_department = template.Authorization_request_department,
                    Authorization_view = template.Authorization_view,
                };
                LogFile.WriteLogFile("TemplateListController AddData | api/Template/SaveTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Template/DeleteTemplate", null, requestModel);

                var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
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
                throw ex;
            }

        }

        /// <summary>
        /// ดึงข้อมูล Template ที่สร้าง ตาม ID
        /// </summary>
        [HttpPost("GetTemplateControlById")]
        public async Task<ActionResult> GetTemplateControlById(TemplateOBJRequestModel templateOBJRequest)
        {
            try
            {
                var requestTemplateModel = new TemplateOBJRequestModel
                {
                    UserPrincipalName = templateOBJRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = templateOBJRequest.TemplateId
                };
                LogFile.WriteLogFile("TemplateListController GetTemplateControlById | api/Template/TemplateByid | requestTemplateModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestTemplateModel), module);
                var Template = "";

                List<ListFormNameDto> arrayTemplate = new List<ListFormNameDto>();
                if (templateOBJRequest.TemplateVersionCode != null && templateOBJRequest.TemplateVersionCode != "")
                {
                    var requestModel = new VersionHistoryRequestModel
                    {
                        UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        DocumentCode = templateOBJRequest.TemplateVersionCode

                    };
                    LogFile.WriteLogFile("RolesController GetAllVersion | api/Template/GetTemplateListVersionHistory | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                    Template = await CoreAPI.post(_baseUrl + "api/Template/GetTemplateListVersionHistory", null, requestModel);

                    var jsonConvertResult = JsonConvert.DeserializeObject<ListFormNameDto[]>(Template, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                    Array.Reverse(jsonConvertResult);
                    foreach (var std in jsonConvertResult)
                        arrayTemplate.Add(std);
                    arrayTemplate.RemoveAt(0);
                    Template = JsonConvert.SerializeObject(arrayTemplate[int.Parse(templateOBJRequest.VersionTemplate) - 1]);

                }
                else
                {
                    Template = await CoreAPI.post(_baseUrl + "api/Template/TemplateByid", null, requestTemplateModel);
                }

                var templateModel = JsonConvert.DeserializeObject<TemplateFormRequestModel>(Template);
                templateModel.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                templateModel.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                LogFile.WriteLogFile("TemplateListController GetTemplateControlById | api/Template/TemLineApproveListByTemplate | templateModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(templateModel), module);

                var templateResult = await CoreAPI.post(_baseUrl + "api/Template/TemLineApproveListByTemplate", null, templateModel);

                var temLineApprove = JsonConvert.DeserializeObject<List<TemLineApproveRequestModel>>(templateResult);

                List<SpecificApproverDto> spcApporvals = new List<SpecificApproverDto>();

                foreach (TemLineApproveRequestModel temApprove in temLineApprove)
                {
                    if (temApprove.ApproveType == 20)
                    {
                        temApprove.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                        temApprove.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                        LogFile.WriteLogFile("TemplateListController GetTemplateControlById | api/Template/TemSpecificApproverListByTemLineApprove | temApprove : " + Newtonsoft.Json.JsonConvert.SerializeObject(temApprove), module);

                        var scpApproval = await CoreAPI.post(_baseUrl + "api/Template/TemSpecificApproverListByTemLineApprove", null, temApprove);
                        var approvals = JsonConvert.DeserializeObject<List<SpecificApproverDto>>(scpApproval);
                        var requestModel = new BaseBodyModel
                        {
                            UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                            ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        };
                        LogFile.WriteLogFile("TemplateListController GetTemplateControlById | api/Employee/EmployeeList,api/Role/AllRoleList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);


                        var employeeResult = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, requestModel);
                        var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(employeeResult);
                        var rolesResult = await CoreAPI.post(_baseUrl + "api/Role/AllRoleList", null, requestModel);
                        var rolesJson = JsonConvert.DeserializeObject<List<RolesDto>>(rolesResult);
                        EmployeeDto user = empListJson.Find(x => x.Email.ToLower() == _configuration.GetValue<string>("AppSettings:UserPrincipalName").ToLower());
                        foreach (SpecificApproverDto approval in approvals)
                        {
                            if (approval.SpecificTypeId == 874)
                            {
                                var empData = empListJson.FirstOrDefault(e => e.EmployeeId == approval.EmployeeId);
                                if (empData != null)
                                {
                                    if (user?.Lang == "EN")
                                    {
                                        approval.EmployeeName = empData.NameEn;
                                        approval.Position = empData.PositionNameEn;
                                    }
                                    else
                                    {
                                        approval.EmployeeName = empData.NameTh;
                                        approval.Position = empData.PositionNameTh;
                                    }
                                }
                            }
                            else if (approval.SpecificTypeId == 875)
                            {
                                var roleData = rolesJson.FirstOrDefault(e => e.RoleId == approval.EmployeeId);
                                if (roleData != null)
                                {
                                    if (user?.Lang == "EN")
                                    {
                                        approval.EmployeeName = roleData.NameEn;
                                    }
                                    else
                                    {
                                        approval.EmployeeName = roleData.NameTh;
                                    }
                                }
                            }
                            else
                            {
                                approval.EmployeeName = "(Requetor)";
                            }
                            spcApporvals.Add(approval);
                        }
                    }
                }

                var _templateForm = JsonConvert.DeserializeObject<TemplateFormDto>(Template);
                var _temLineApprove = JsonConvert.DeserializeObject<List<TemLineApproveDto>>(templateResult);
                List<TemplateFormDto> listRefTemplateDto = new List<TemplateFormDto>();
                List<SpecificApproverDto> specificeDto = new List<SpecificApproverDto>();
                List<ApprovalMatrixDto> cMSTApprovalMatrixDto = new List<ApprovalMatrixDto>();
                List<PositionLevelDto> cMSTPositionLevelDto = new List<PositionLevelDto>();
                List<MasterDataListDto> masterDataListDto = new List<MasterDataListDto>();
                List<TemplateLogicDto> templateLogicDto = new List<TemplateLogicDto>();
                var temcontrl = new TemplateControlDto
                {
                    templateForm = _templateForm,
                    TemLineApprove = _temLineApprove,
                    specificApprovers = spcApporvals,
                    listRefTemplate = listRefTemplateDto,
                    specificTempApprovers = specificeDto,
                    cMstApprovalMatrix = cMSTApprovalMatrixDto,
                    cMstPositionLevel = cMSTPositionLevelDto,
                    lstMasterData = masterDataListDto,
                    cMSTTemplateLogic = templateLogicDto,
                };
                //var templateResult = await CoreAPI.post(_baseUrl + "api/Template/TemLineApproveListByTemplate", null, templateModel);
                var temcontrlResult = Newtonsoft.Json.JsonConvert.SerializeObject(temcontrl);
                return Ok(temcontrlResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("ValidateRefTemplate")]
        public async Task<ActionResult> ValidateRefTemplate(TemplateRefValidateRequestModel requestRefValidRequest)
        {
            try
            {
                var requestModel = new TemplateRefValidateRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    TemplateId = requestRefValidRequest.TemplateId,
                    DocNo = requestRefValidRequest.DocNo,
                    Label = requestRefValidRequest.Label
                };
                LogFile.WriteLogFile("RolesController GetAllVersion | api/Memo/ValidateRefTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Memo/ValidateRefTemplate", null, requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }
    }
}
