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
    public class MasterDataController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "MasterData";
        public MasterDataController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        private class Respone
        {
            public string result { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลของ MasterDataทั้งหมด
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
                LogFile.WriteLogFile("MasterDataController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataListAll", null, requestModel);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(masterDataDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
       
        /// <summary>
        /// ดึงข้อมูลของ Signature ของข้อมูลMasterData
        /// </summary>
        [HttpGet("GetSignature")]
        public async Task<ActionResult> GetSignature()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("MasterDataController GetSignature | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestModel);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result);
                var masterDatas = masterDataDto.Where(w => w.MasterType == "Signature").ToList();
                return Ok(masterDatas);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetSignature: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลของ RTCON ของข้อมูลMasterData
        /// </summary>
        [HttpGet("GetReportSetting")]
        public async Task<ActionResult> GetReportSetting()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("MasterDataController GetSignature | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestModel);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result);
                var masterDatas = masterDataDto.Where(w => w.MasterType == "RTCON").ToList();
                return Ok(masterDatas);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetReportSetting: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// ดึงข้อมูลของที่มีเงือนไขตาม MasterType ของข้อมูลMasterData
        /// </summary>
        [HttpGet("GetIsDocControl")]
        public async Task<ActionResult> GetIsDocControl()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("MasterDataController GetIsDocControl | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestModel);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result);
                var masterDatas = masterDataDto.Where(w => w.MasterType == "D_NewTpl" || w.MasterType == "D_EditTpl" || w.MasterType == "D_CanTpl").ToList();
                return Ok(masterDatas);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetIsDocControl: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }



        [HttpGet("getAuthorization")]
        public async Task<ActionResult> GetAuthorization()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("MasterDataController getAuthorization | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestModel);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result);
                var masterDatas = masterDataDto.Where(w => w.MasterType == "Authmgcomp" || w.MasterType == "Authmgdept" || w.MasterType == "Authrqcomp" || w.MasterType == "Authrqdept" || w.MasterType == "Permission").ToList();
                return Ok(masterDatas);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAuthorization: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        [HttpGet("getVersion")]
        public async Task<ActionResult> GetVersion()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("MasterDataController getVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestModel);
                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result);
                var masterDatas = masterDataDto.Where(w => w.MasterType == "TempVer").ToList();
                return Ok(masterDatas);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetVersion: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }


        [HttpGet("getVersionTempVC")]
        public async Task<ActionResult> GetVersionTempVC()
        {
            try
            {
                var requestModel = new BaseBodyModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("MasterDataController getVersion | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestModel);

                var masterDataDto = JsonConvert.DeserializeObject<List<MasterDataListDto>>(result);
                var masterDatas = masterDataDto.Where(w => w.MasterType == "TempVC").ToList();
                return Ok(masterDatas);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|getVersionTempVC: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }


        [HttpPost("updateData")]
        public async Task<ActionResult> Add(DynamicMasterDataRequeseModel dynamicRequest)
        {
            try
            {
                var data = JsonConvert.DeserializeObject<Dictionary<string, string>>(dynamicRequest.model);
                data.Add("connectionString", _configuration.GetValue<string>("AppSettings:ConnectionString"));
                data.Add("userPrincipalName", _configuration.GetValue<string>("AppSettings:UserPrincipalName"));
                data.Add("secretId", "");
                var json = JsonConvert.SerializeObject(data);
                LogFile.WriteLogFile("MasterDataController updateData | data +  dynamicRequest.name : " + Newtonsoft.Json.JsonConvert.SerializeObject(data), module);

                var result = await CoreAPI.postJson(_baseUrl + "api/" + dynamicRequest.name + "/Save", null, json);
                //Respone respone = JsonConvert.DeserializeObject<Respone>(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|getVersionTempVC: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }

        /// <summary>
        /// ดึงข้อมูลของ LeaveRequestByTemplateCodeทั้งหมด
        /// </summary>
        [HttpGet("GetLeaveTemplate")]
        public async Task<ActionResult> GetLeaveTemplateByTemplateCode()
        {
            var requestModel = new LeaveTemplateByEmpIdRequestModel
            {
                userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                SecretId = "",
            };
            LogFile.WriteLogFile("MasterDataController GetLeaveTemplate | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/MasterData/MasterDataListLeaveRequestTemplateCode", null, requestModel);
            return Ok(result);
        }

        /// <summary>
        /// ดึงข้อมูลของ GetLeaveTemplateRequestByEmpId
        /// </summary>
        [HttpGet("GetLeaveTemplate/{EmpId}")]
        public async Task<ActionResult> GetLeaveTemplateRequestByEmpId(string EmpId)
        {
            var requestApi = new LeaveTemplateByEmpIdRequestModel
            {
                userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                SecretId = "",
                Value1 = EmpId,
                Seq = DateTime.Now.Year
        };
            LogFile.WriteLogFile("MasterDataController GetLeaveTemplate/{EmpId} | requestApi : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestApi), module);

            var result = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataListLeaveRequest", null, requestApi);
            return Ok(result);
        }

        /// <summary>
        /// ดึงข้อมูลของ GetLeaveTemplateRequestByEmpId
        /// </summary>
        [HttpGet("FieldInfo")]
        public async Task<ActionResult> GetMasterDataFieldInfo()
        {
            var requestApi = new LeaveTemplateByEmpIdRequestModel
            {
                userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
        

            var result = await CoreAPI.post(_baseUrl + "api/MasterData/FieldInfo", null, requestApi);
            return Ok(result);
        }

    }
}
