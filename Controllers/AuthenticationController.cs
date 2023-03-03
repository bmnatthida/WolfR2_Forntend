using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Constants;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;
using WolfR2.RequestModels;
using WolfR2.WolfR2.Interface;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string _contactUrl;
        private readonly IMailService _mailService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private string module = "Authentication";
        public AuthenticationController(IConfiguration configuration, IHostingEnvironment hostingEnvironment, IMailService mailService)
        {
            _mailService = mailService;
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
            _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
            _hostingEnvironment = hostingEnvironment;
        }
        public class EmailModelByForgotPassword
        {
            public string email { get; set; }
        }
        public class UsernameModelByForgotPassword
        {
            public string Username { get; set; }
        }
        /// <summary>
        /// API ForgotPassword
        /// </summary>
        [HttpPost("ForgotPassword")]
        public async Task<ActionResult> ForgotPassword([FromBody] EmailModelByResetPassword requestModel)
        {
            try
            {
                //var decryptedString = Encryptions.DecryptString(EncryptionConstants.Key, requestModel.email.ToString());
                string contentRootPath = _hostingEnvironment.ContentRootPath;
                string webRootPath = _hostingEnvironment.WebRootPath;
                var requestLoginModel = new LoginModel
                {
                    TinyURL = requestModel.webUrl
                };
                var requestLoginModel2 = new LoginModel
                {
                    userPrincipalName = requestModel.email,
                };

                LogFile.WriteLogFile("AuthenticationController ResetPassword | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestLoginModel), module);
                var resultContactUs = await CoreAPI.post(_contactUrl + "api/Login/WOLFContactUS", null, requestLoginModel);
                var result = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
                var responeGetContact2 = JsonConvert.DeserializeObject<UserDataModel>(result);

                var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);
                if (responeGetContact == null)
                {
                    return Ok(false);
                }
                //var emp = new BaseBodyModel
                //{
                //    UserPrincipalName = decryptedString,
                //    ConnectionString = responeGetContact.ConnectionString,

                //};
                //var empList = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, emp);
                //var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(empList);

                //var empData = empListJson.FirstOrDefault(e => e.EmployeeId.ToString() == decryptedString);

                var resetPasswordModel = new UsernameModelByForgotPassword
                {
                    Username = requestModel.email
                };
                var pass = GeneratePassword.generatePassword(requestModel.newPassword.Trim());
                LogFile.WriteLogFile("AuthenticationController ResetPassword | resetPasswordModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(resetPasswordModel), module);

                var resultAccount = await CoreAPI.post(_contactUrl + "api/Login/WOLFAccountByUsername", null, resetPasswordModel);
                if (string.IsNullOrEmpty(resultAccount) || resultAccount == "null")
                {
                    return Ok(false);

                }
                else
                {
                    var responeResultAccount = JsonConvert.DeserializeObject<ResetPasswordModel>(resultAccount);
                    var resetPoasswordModel = new ResetPasswordModel
                    {
                        ID = responeResultAccount.ID,
                        Username = requestModel.email,
                        Password = GeneratePassword.generatePassword(requestModel.newPassword.Trim()),
                        IsVerify = responeResultAccount.IsVerify,
                        GuidVerify = responeResultAccount.GuidVerify,
                        Note = GeneratePassword.generatePassword(requestModel.newPassword.Trim()),
                        Remark = requestModel.webUrl,
                        Description = responeGetContact.ConnectionString,
                        CreatedDate = responeResultAccount.CreatedDate,
                        CreatedBy = responeResultAccount.CreatedBy,
                        ModifiedDate = responeResultAccount.ModifiedDate,
                        ModifiedBy = responeResultAccount.ModifiedBy,
                        ContactCode = responeResultAccount.ContactCode,
                        IsActive = responeResultAccount.IsActive,
                        userPrincipalName = requestModel.email,
                    };
                    LogFile.WriteLogFile("AuthenticationController ResetPassword | resetPoasswordModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(resetPoasswordModel), module);
                    var responseNewPassWord = await CoreAPI.post(_contactUrl + "/" + "api/Login/WOLFAccountResetPassword", null, resetPoasswordModel);
                    return Ok(responseNewPassWord);
                }

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ForgotPassword : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        public class EmailModelByResetPassword : EmailModelByForgotPassword
        {
            public string newPassword { get; set; }
            public string? oldPassword { get; set; }
            public string webUrl { get; set; }



        }
        public class ResetPasswordModel
        {
            public int ID { get; set; }
            public string ContactCode { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
            public Boolean IsVerify { get; set; }
            public string GuidVerify { get; set; }
            public string Note { get; set; }
            public string Remark { get; set; }
            public string Description { get; set; }
            public string CreatedDate { get; set; }
            public string CreatedBy { get; set; }
            public string ModifiedDate { get; set; }
            public string ModifiedBy { get; set; }
            public Boolean IsActive { get; set; }
            public string userPrincipalName { get; set; }


        }
        /// <summary>
        /// API ResetPassword
        /// </summary>
        [HttpPost("ResetPassword")]
        public async Task<ActionResult> ResetPassword([FromBody] EmailModelByResetPassword requestModel)
        {
            try
            {
                //var decryptedString = Encryptions.DecryptString(EncryptionConstants.Key, requestModel.email.ToString());
                string contentRootPath = _hostingEnvironment.ContentRootPath;
                string webRootPath = _hostingEnvironment.WebRootPath;
                var requestLoginModel = new LoginModel
                {
                    TinyURL = requestModel.webUrl
                };
                var requestLoginModel2 = new LoginModel
                {
                    userPrincipalName = requestModel.email,
                };

                LogFile.WriteLogFile("AuthenticationController ResetPassword | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestLoginModel), module);
                var resultContactUs = await CoreAPI.post(_contactUrl + "api/Login/WOLFContactUS", null, requestLoginModel);
                var result = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
                var responeGetContact2 = JsonConvert.DeserializeObject<UserDataModel>(result);

                var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);
                if (responeGetContact == null)
                {
                    return Ok(false);
                }
                //var emp = new BaseBodyModel
                //{
                //    UserPrincipalName = decryptedString,
                //    ConnectionString = responeGetContact.ConnectionString,

                //};
                //var empList = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, emp);
                //var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(empList);

                //var empData = empListJson.FirstOrDefault(e => e.EmployeeId.ToString() == decryptedString);

                var resetPasswordModel = new UsernameModelByForgotPassword
                {
                    Username = requestModel.email
                };
                var pass = GeneratePassword.generatePassword(requestModel.newPassword.Trim());
                LogFile.WriteLogFile("AuthenticationController ResetPassword | resetPasswordModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(resetPasswordModel), module);

                var resultAccount = await CoreAPI.post(_contactUrl + "api/Login/WOLFAccountByUsername", null, resetPasswordModel);
                if (string.IsNullOrEmpty(resultAccount) || resultAccount == "null")
                {
                    return Ok(false);

                }
                else
                {
                    var responeResultAccount = JsonConvert.DeserializeObject<ResetPasswordModel>(resultAccount);
                    if (responeResultAccount.Password != GeneratePassword.generatePassword(requestModel.oldPassword.Trim()))
                    {
                        return Ok(false);
                    }
                    var resetPoasswordModel = new ResetPasswordModel
                    {
                        ID = responeResultAccount.ID,
                        Username = requestModel.email,
                        Password = GeneratePassword.generatePassword(requestModel.newPassword.Trim()),
                        IsVerify = responeResultAccount.IsVerify,
                        GuidVerify = responeResultAccount.GuidVerify,
                        Note = GeneratePassword.generatePassword(requestModel.newPassword.Trim()),
                        Remark = requestModel.webUrl,
                        Description = responeGetContact.ConnectionString,
                        CreatedDate = responeResultAccount.CreatedDate,
                        CreatedBy = responeResultAccount.CreatedBy,
                        ModifiedDate = responeResultAccount.ModifiedDate,
                        ModifiedBy = responeResultAccount.ModifiedBy,
                        ContactCode = responeResultAccount.ContactCode,
                        IsActive = responeResultAccount.IsActive,
                        userPrincipalName = requestModel.email,
                    };
                    LogFile.WriteLogFile("AuthenticationController ResetPassword | resetPoasswordModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(resetPoasswordModel), module);
                    var responseNewPassWord = await CoreAPI.post(_contactUrl + "/" + "api/Login/WOLFAccountResetPassword", null, resetPoasswordModel);
                    return Ok(responseNewPassWord);
                }

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ResetPassword : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        public class ConfirmResetModel
        {

            public string GuidVerify { get; set; }
            public string Remark { get; set; }



        }
        /// <summary>
        /// API Confirm Reset
        /// </summary>
        [HttpPost("ConfirmResetPassword")]
        public async Task<ActionResult> ConfirmReset(ConfirmResetModel requestModel)
        {
            try
            {
                String sResults = String.Empty;
                var request = new ConfirmResetModel
                {
                    GuidVerify = requestModel.GuidVerify
                };
                LogFile.WriteLogFile("AuthenticationController ConfirmResetPassword | request : " + Newtonsoft.Json.JsonConvert.SerializeObject(request), module);

                var responseNewPassWord = await CoreAPI.post(_contactUrl + "/" + "api/Login/WOLFAccountByGuidVerifyIs0", null, request);
                var iResult = JsonConvert.DeserializeObject<UserDto>(responseNewPassWord);
                sResults = iResult.Remark;

                if (String.IsNullOrEmpty(sResults))
                {
                    iResult.IsVerify = true;
                    LogFile.WriteLogFile("AuthenticationController ConfirmResetPassword | iResult : " + Newtonsoft.Json.JsonConvert.SerializeObject(iResult), module);

                    var confirm = await CoreAPI.post(_contactUrl + "/" + "api/Login/WOLFAccountUpdateIsVerify", null, iResult);
                    var iResult2 = JsonConvert.DeserializeObject<UserDto>(confirm);
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|ConfirmReset : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// RegisterWolfAccount
        /// </summary>
        [HttpPost("RegisterWolfAccount")]
        public async Task<ActionResult> RegisterWolfAccount(RegisterWolfModel requestModel)
        {
            try
            {
                string webRootPath = _hostingEnvironment.WebRootPath;

                _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");

                var requestContactModel = new LoginModel
                {
                    TinyURL = requestModel.Remark
                };

                var resultContactUs = await CoreAPI.post(_contactUrl + "api/Login/WOLFContactUS", null, requestContactModel);
                var responeContactUS = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);
                var request = new RegisterWolfModel
                {
                    Username = requestModel.Username,
                    Password = GeneratePassword.generatePassword(requestModel.Password),
                    Remark = requestModel.Remark,
                    Note = GeneratePassword.generatePassword(requestModel.Note),
                    ContactCode = responeContactUS.ContactCode,
                    Description = responeContactUS.ConnectionString
                };
                Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(responeContactUS));
                Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(requestContactModel));
                Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(requestModel));
                Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(request));
                LogFile.WriteLogFile("RegisterWolfAccountModel : " + _contactUrl + "/" + "api/Login/WOLFAccountRegister" + Newtonsoft.Json.JsonConvert.SerializeObject(request), module);
                LogFile.WriteLogFile("RegisterWolfAccountModel resultContactUs : " + _contactUrl + "/" + "api/Login/WOLFAccountRegister" + Newtonsoft.Json.JsonConvert.SerializeObject(request), module);
                var responseNewPassWord = await CoreAPI.post(_contactUrl + "/" + "api/Login/WOLFAccountRegister", null, request);
                return Ok(responseNewPassWord);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|RegisterWolf: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
