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
    public class MasterCompanyController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "MasterCompany";
        public MasterCompanyController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }

        /// <summary>
        /// ดึงข้อมูลของCompanyทั้งหมด
        /// </summary>
        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll()
        {
            var requestModel = new BaseBodyModel
            {
                UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
            };
            LogFile.WriteLogFile("MasterCompanyController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Company/CompanyListAll", null, requestModel);
            var companyDto = JsonConvert.DeserializeObject<List<CompanyDto>>(result, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(companyDto);
            return Ok(json);
        }

       
        /// <summary>
        /// เพิ่มข้อมูลของCompany
        /// </summary>
        [HttpPost("AddData")]
        public async Task<ActionResult> Add(CompanyRequestModel companyRequestModel)
        {
            try
            {
                var requestModel = new CompanyRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    CompanyCode = companyRequestModel.CompanyCode,
                    NameTh = companyRequestModel.NameTh,
                    NameEn = companyRequestModel.NameEn,
                    Tel = companyRequestModel.Tel,
                    Fax = companyRequestModel.Fax,
                    UrlWeb = companyRequestModel.UrlWeb,
                    UrlLogo = companyRequestModel.UrlLogo,
                    AddressTh = companyRequestModel.AddressTh,
                    AddressEn = companyRequestModel.AddressEn,
                    IsActive = companyRequestModel.IsActive,
                    CreatedBy = companyRequestModel.CreatedBy,
                    CreatedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss t"),
                    ModifiedBy = companyRequestModel.ModifiedBy,
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss t")
                };
                LogFile.WriteLogFile("MasterCompanyController AddData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Company/Save", null, requestModel);
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
                throw ex;
            }
         
        }
        /// <summary>
        /// อัพเดทข้อมูลของCompany
        /// </summary>
        [HttpPost("UpdateData")]
        public async Task<ActionResult> Update(CompanyRequestModel companyRequestModel)
        {
            try
            {
                var requestModel = new CompanyRequestModel
                {
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    CompanyId = companyRequestModel.CompanyId,
                    CompanyCode = companyRequestModel.CompanyCode,
                    NameTh = companyRequestModel.NameTh,
                    NameEn = companyRequestModel.NameEn,
                    Tel = companyRequestModel.Tel,
                    Fax = companyRequestModel.Fax,
                    UrlWeb = companyRequestModel.UrlWeb,
                    UrlLogo = companyRequestModel.UrlLogo,
                    AddressTh = companyRequestModel.AddressTh,
                    AddressEn = companyRequestModel.AddressEn,
                    IsActive = companyRequestModel.IsActive,
                    ModifiedBy = companyRequestModel.ModifiedBy,
                    ModifiedDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss t"),
                    CreatedBy = companyRequestModel.CreatedBy,
                    CreatedDate = companyRequestModel.CreatedDate,
                };
                LogFile.WriteLogFile("MasterCompanyController UpdateData | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Company/Save", null, requestModel);
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
                LogFile.WriteLogFile("Exception|UpdateData: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
           
        }

    }
}
