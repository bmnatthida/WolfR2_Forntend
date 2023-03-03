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
namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController: ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Account";
        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }

        /// <summary>
        /// ดึงข้อมูลทั้งหมดของ WolfAccount
        /// </summary>
        [HttpPost("GetAll")]
        public async Task<ActionResult> GetAll(WolfAccountRequestModel accountRequestModel)
        {
            try
            {
                var resultContactUs = await CoreAPI.post(_baseUrl + "api/Login/WOLFContactUS", null, accountRequestModel);
                var responeContactUS = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);

                var wolfAccountRequest = new ListWolfAccountRequest
                {
                    Note = "",
                    Remark = "",
                    Description = "",
                    ContactCode = responeContactUS.ContactCode,
                    UserPrincipalName = accountRequestModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };

                var result = await CoreAPI.post(_baseUrl + "api/Login/ListWOLFAccount", null, wolfAccountRequest);
                var lstAccountDto = JsonConvert.DeserializeObject<List<ListAccountDto>>(result);

                return Ok(JsonConvert.SerializeObject(lstAccountDto));
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ListWOLFAccount : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
            
          
        }

        /// <summary>
        /// CreateWOLFAccount
        /// </summary>
        [HttpPost("CreateWOLFAccount")]
        public async Task<ActionResult> CreateWOLFAccount(CreateAccountModel createWolfAccountRequest)
        {
            try
            {
                var requestContactModel = new LoginModel
                {
                    TinyURL = createWolfAccountRequest.Remark
                };
                var resultContactUs = await CoreAPI.post(_baseUrl + "api/Login/WOLFContactUS", null, requestContactModel);
                
                var responeContactUS = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);

                var requestModel = new CreateWolfAccountRequestModel
                {
                    UserPrincipalName = createWolfAccountRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ID = createWolfAccountRequest.ID,
                    Username = createWolfAccountRequest.Username,
                    IsVerify = createWolfAccountRequest.IsVerify,
                    Password = createWolfAccountRequest.Password,
                    Note = createWolfAccountRequest.Password,
                    ContactCode = responeContactUS.ContactCode,
                    IsActive = createWolfAccountRequest.IsActive,
                    Remark = createWolfAccountRequest.Remark,
                    Description = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };

                if (!string.IsNullOrEmpty(createWolfAccountRequest.NewPassword))
                {
                    requestModel.Password = GeneratePassword.generatePassword(createWolfAccountRequest.NewPassword.Trim());
                    requestModel.Note = GeneratePassword.generatePassword(createWolfAccountRequest?.ConfirmNewPassword?.Trim());
                }

                var result = await CoreAPI.post(_baseUrl + "api/Login/CreateWOLFAccount", null, requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|CreateWOLFAccount : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                return Ok(ex);
            }
        }

        /// <summary>
        /// UpdateWOLFAccount
        /// </summary>
        [HttpPost("UpdateWOLFAccount")]
        public async Task<ActionResult> UpdateWOLFAccount(CreateAccountModel createWolfAccountRequest)
        {
            try
            {
                var requestContactModel = new LoginModel
                {
                    TinyURL = createWolfAccountRequest.Remark
                };
                var resultContactUs = await CoreAPI.post(_baseUrl + "api/Login/WOLFContactUS", null, requestContactModel);

                var responeContactUS = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);

                var requestModel = new CreateWolfAccountRequestModel
                {
                    UserPrincipalName = createWolfAccountRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    ID = createWolfAccountRequest.ID,
                    Username = createWolfAccountRequest.Username,
                    IsVerify = createWolfAccountRequest.IsVerify,
                    Password = createWolfAccountRequest.Password,
                    Note = createWolfAccountRequest.Password,
                    ContactCode = responeContactUS.ContactCode,
                    IsActive = createWolfAccountRequest.IsActive,
                    Remark = createWolfAccountRequest.Remark,
                    Description = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                };

                if (!string.IsNullOrEmpty(createWolfAccountRequest.NewPassword))
                {
                    requestModel.Password = GeneratePassword.generatePassword(createWolfAccountRequest.NewPassword.Trim());
                    requestModel.Note = GeneratePassword.generatePassword(createWolfAccountRequest?.ConfirmNewPassword?.Trim());
                }

                var result = await CoreAPI.post(_baseUrl + "api/Login/UpdateWOLFAccount", null, requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UpdateWOLFAccount : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                return Ok(ex);
            }
        }
    }
}
