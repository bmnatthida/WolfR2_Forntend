using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;
using WolfR2.DtoModels;
using WolfR2.Helper;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Position";
        public PositionController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        private class Respone
        {
            public string result { get; set; }
        }
        /// <summary>
        /// ดึงข้อมูลPosition ทั้งหมด
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
                LogFile.WriteLogFile("PositionController GetAll | api/Position/AllPositionList | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Position/AllPositionList", null, requestModel);
                var PositionDto = JsonConvert.DeserializeObject<List<PositionDto>>(result);
                List<PositionFormatDto> PositionFormatList = new List<PositionFormatDto>();
                for (int i = 0; i < PositionDto.Count; i++)
                {
                    var pos = PositionDto[i];
                    var PositionFormat = new PositionFormatDto
                    {
                        CreatedBy = pos.CreatedBy,
                        CreatedDate = pos.CreatedDate,
                        IsActive = pos.IsActive,
                        ModifiedBy = pos.ModifiedBy,
                        ModifiedDate = pos.ModifiedDate,
                        NameEn = pos.NameEn,
                        NameTh = pos.NameTh,
                        CompanyCode = pos.CompanyCode,
                        PositionId = pos.PositionId,
                        PositionLevel = pos.PosotionLevel,
                        PositionLevelId = pos.PositionLevelId,
                        PositionLevelNameEn = pos.PositionLevelNameEn ,
                        PositionLevelNameTh = pos.PositionLevelNameTh
                    };
                    PositionFormatList.Add(PositionFormat);
                }
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(PositionFormatList);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAll: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// เพิ่มข้อมูลPosition
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> Add(PositionModel position)
        {
            try
            {
                var requestModel = new PositionModel
                {
                    NameTh = position.NameTh,
                    NameEn = position.NameEn,
                    PositionLevelId = position.PositionLevelId,
                    IsActive = position.IsActive,
                    PositionLevelNameTh = position.PositionLevelNameTh,
                    PositionLevelNameEn = position.PositionLevelNameEn,
                    CreatedDate = null,
                    CreatedBy = "1",
                    ModifiedDate = null,
                    ModifiedBy = "1",
                    PosotionLevel = position.PosotionLevel,
                    userPrincipalName = position.userPrincipalName,
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };
                LogFile.WriteLogFile("PositionController AddData | api/Position/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Position/Save", null, requestModel);

                var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
                {
                    return Ok(result);
                }
                else
                {
                    return Ok(result);
                }
               
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|AddData: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// อัพเดทข้อมูลPosition
        /// </summary>
        [HttpPost("UpdateData")]
        public async Task<ActionResult> Update( PositionModel position)
        {
            try
            {
                var requestModel = new PositionModel
                {
                    PositionId = position.PositionId,
                    NameTh = position.NameTh,
                    NameEn = position.NameEn,
                    PositionLevelId = position.PositionLevelId,
                    IsActive = position.IsActive,
                    PositionLevelNameTh = position.PositionLevelNameTh,
                    PositionLevelNameEn = position.PositionLevelNameEn,
                    CreatedDate = position.CreatedDate,
                    CreatedBy = position.CreatedBy,
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                    ModifiedBy = position.ModifiedBy,
                    PosotionLevel = position.PosotionLevel,
                    userPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = ""
                };

                LogFile.WriteLogFile("PositionController UpdateData | api/Position/Save | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Position/Save", null, requestModel);
                  var templateDto = JsonConvert.DeserializeObject<Respone>(result);

                if (templateDto.result == "success")
                {
                    return Ok(result);
                }
                else
                {
                    return Ok(result);
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
