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
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string _contactUrl;
        private string module = "Login";
        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public class UserAzue
        {
            public string username { get; set; }
        }
        /// <summary>
        /// Login หน้าเว็บเป็นAzure
        /// </summary>
        [HttpPost("AzureAccount")]
        public async Task<ActionResult> LoginAzure(UserAzue user)
        {
            _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
            try
            {
                var requestLoginModel = new LoginModel
                {
                    userPrincipalName = user.username,
                };
                var loginCallback = new UserDto();
                LogFile.WriteLogFile("LoginController AzureAccount , getcontact | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestLoginModel), module);

                var result = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
                var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(result);

                _configuration["AppSettings:UserPrincipalName"] = user.username;
                _configuration["AppSettings:ConnectionString"] = responeGetContact.ConnectionString;
                _configuration["AppSettings:BaseUrl"] = responeGetContact.ApiURL + "/";
                _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");

                var emp = new BaseBodyModel
                {
                    UserPrincipalName = user.username,
                    ConnectionString = responeGetContact.ConnectionString,

                };
                LogFile.WriteLogFile("LoginController AzureAccount , EmployeeList | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(emp), module);

                var empList = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, emp);
                var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(empList);


                var empData = empListJson.FirstOrDefault(d => d.Email.ToLower() == user.username.ToLower());
                if (empData == null)
                {
                    return Ok(false);
                }
                loginCallback.SharepointSiteURL = _configuration.GetValue<string>("AppSettings:SharepointSiteURL");
                loginCallback.TinyURL = responeGetContact.TinyURL;
                loginCallback.employeeData = empData;

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(loginCallback);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|LoginAzure: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw ex;
            }
        }
        /// <summary>
        /// Login หน้าเว็บเป็นAzure
        /// </summary>
        [HttpPost("GoogleAccount")]
        public async Task<ActionResult> LoginGoogle(UserAzue user)
        {
            _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
            try
            {
                var requestLoginModel = new LoginModel
                {
                    userPrincipalName = user.username,
                };
                var loginCallback = new UserDto();
                LogFile.WriteLogFile("LoginController AzureAccount , getcontact | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestLoginModel), module);

                var result = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
                var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(result);

                _configuration["AppSettings:UserPrincipalName"] = user.username;
                _configuration["AppSettings:ConnectionString"] = responeGetContact.ConnectionString;
                _configuration["AppSettings:BaseUrl"] = responeGetContact.ApiURL + "/";
                _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");

                var emp = new BaseBodyModel
                {
                    UserPrincipalName = user.username,
                    ConnectionString = responeGetContact.ConnectionString,

                };
                LogFile.WriteLogFile("LoginController AzureAccount , EmployeeList | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(emp), module);

                var empList = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, emp);
                var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(empList);


                var empData = empListJson.FirstOrDefault(d => d.Email.ToLower() == user.username.ToLower());
                if (empData == null)
                {
                    return Ok(false);
                }
                loginCallback.TinyURL = responeGetContact.TinyURL;
                loginCallback.SharepointSiteURL = _configuration.GetValue<string>("AppSettings:SharepointSiteURL");
                loginCallback.employeeData = empData;

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(loginCallback);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GoogleAccount: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }
        public class WOLFAccountByUsernameRequestModel
        {
            public string Username { get; set; }
        }
        /// <summary>
        /// Login หน้าเว็บเป็นWolf
        /// </summary>
        [HttpPost("LoginBD")]
        public async Task<ActionResult> LoginBD(UserWolfModel user)
        {
            try
            {
                var key = _configuration.GetValue<string>("AppSettings:You");
                var pass = _configuration.GetValue<string>("AppSettings:Me");
                var type = _configuration.GetValue<string>("ReactConfiguration:LoginSetting:Type");
                var loginCallback = new UserDto();
                if (user.username.Contains(key))
                {
                    if (user.password == pass)
                    {
                        _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
                        var requestContactModel = new LoginModel
                        {
                            TinyURL = user.TmpUrl
                        };
                        LogFile.WriteLogFile("LoginController WolfBD , WOLFContactUS | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestContactModel), module);

                        var resultContactUs = await CoreAPI.post(_contactUrl + "api/Login/WOLFContactUS", null, requestContactModel);
                        var responeContactUS = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);
                        if (responeContactUS.TinyURL != user.TmpUrl)
                        {
                            loginCallback.Remark = "คุณไม่มีสิทธ์เข้าถึงในขณะนี้";
                        }
                        else
                        {
                            if (responeContactUS.ContactCode == null)
                            {
                                loginCallback.Remark = "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง";
                            }
                            else
                            {

                                var requestModel = new EmployeeIdRequestModel
                                {
                                    EmployeeId = user.username.Replace(key, ""),
                                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                                    ConnectionString = responeContactUS.ConnectionString,
                                };
                                LogFile.WriteLogFile("EmployeeController GetByEmail | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                                var result = await CoreAPI.post(_contactUrl + "api/Employee/Employee", null, requestModel);
                                var EmployeeDto = JsonConvert.DeserializeObject<EmployeeDto>(result);
                                if (type == "LoginAzure")
                                {
                                    if (EmployeeDto == null)
                                    {
                                        loginCallback.Remark = "คุณไม่มีสิทธ์เข้าถึงในขณะนี้";
                                    }
                                    else
                                    {
                                        loginCallback.TinyURL = responeContactUS.TinyURL;
                                        loginCallback.SharepointSiteURL = _configuration.GetValue<string>("AppSettings:SharepointSiteURL");
                                        loginCallback.GuidVerify = "BD";
                                        loginCallback.employeeData = EmployeeDto;
                                    }

                                }
                                else
                                {
                                    var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(EmployeeDto);
                                    var requestLoginModel = new LoginModel
                                    {
                                        userPrincipalName = EmployeeDto.Email,
                                    };
                                    var resultGetContact = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
                                    var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(resultGetContact);
                                    var resetPasswordModel = new WOLFAccountByUsernameRequestModel
                                    {
                                        Username = EmployeeDto.Email
                                    };
                                    var resultAccount = await CoreAPI.post(_contactUrl + "api/Login/WOLFAccountByUsername", null, resetPasswordModel);
                                    var responeResultAccount = JsonConvert.DeserializeObject<AccountDto>(resultAccount);
                                    var des = "";
                                    des = "|" + responeContactUS.LogoPath + "|" + responeResultAccount.Password;
                                    var loginUser = new UserADModel
                                    {
                                        username = EmployeeDto.Email,
                                        password = responeResultAccount.Password,
                                        ContactCode = responeContactUS.ContactCode,
                                        Note = responeContactUS.ContactCode,
                                        Remark = responeContactUS.Fax,
                                        Description = des
                                    };
                                    var AES = new AESCipher();
                                    _configuration["AppSettings:SharepointSiteURL"] = AES.function.Decrypt(responeContactUS.SharepointSiteURL, true);
                                    _configuration["AppSettings:UserPrincipalName"] = user.username;
                                    _configuration["AppSettings:ConnectionString"] = responeContactUS.ConnectionString;
                                    _configuration["AppSettings:BaseUrl"] = responeGetContact.ApiURL + "/";
                                    _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
                                    var loginResult = await CoreAPI.post(_baseUrl + "api/Login/WOLFAccountAuthen", null, loginUser);
                                    LogFile.WriteLogFile("LoginController WolfAccount , WOLFAccountAuthen | loginResult : " + Newtonsoft.Json.JsonConvert.SerializeObject(loginResult), module);

                                    var loginResultJson = JsonConvert.DeserializeObject<UserDto>(loginResult);
                                    if (loginResultJson.ContactCode == null)
                                    {
                                        loginCallback.Remark = loginResultJson.Remark;
                                    }
                                    else if ((loginResultJson.IsVerify == false && responeContactUS.Fax != "AD") || loginResultJson.IsActive == false)
                                    {
                                        loginCallback.Remark = "คุณไม่มีสิทธ์เข้าถึงในขณะนี้";
                                    }
                                    else
                                    {
                                        loginCallback.SharepointSiteURL = _configuration.GetValue<string>("AppSettings:SharepointSiteURL");
                                        loginCallback.TinyURL = responeContactUS.TinyURL;
                                        loginCallback.GuidVerify = loginResultJson.GuidVerify;
                                        loginCallback.employeeData = EmployeeDto;
                                    }

                                    if (loginCallback.employeeData == null)
                                    {
                                        loginCallback.Remark = "Access denied.\r\nYou do not have permission to perform access this resource.\r\nPlease add your employee profile.";
                                    }
                                    LogFile.WriteLogFile("LoginController AzureAccount , empData | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(EmployeeDto), module);

                                    if (EmployeeDto == null)
                                    {
                                        loginCallback.Remark = "คุณไม่มีสิทธิ์เข้าถึงในขณะนี้";
                                    }
                                    else if (EmployeeDto.IsActive == false)
                                    {
                                        loginCallback.Remark = "คุณไม่มีสิทธิ์เข้าถึงในขณะนี้";
                                    }
                                }
                            }
                        }

                    }
                    else
                    {
                        loginCallback.Remark = "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง";
                    }
                }
                else
                {
                    loginCallback.Remark = "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง";
                }
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(loginCallback);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("LoginController WolfBD , Error : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                LogFile.WriteLogFile("Exception|LoginBD: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                return Ok(ex);
            }
        }
        /// <summary>
        /// Login หน้าเว็บเป็นWolf
        /// </summary>
        [HttpPost("WolfAccount")]
        public async Task<ActionResult> Login(UserWolfModel user)
        {
            try
            {
                _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
                var requestContactModel = new LoginModel
                {
                    TinyURL = user.TmpUrl
                };
                LogFile.WriteLogFile("LoginController WolfAD , WOLFContactUS | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestContactModel), module);

                var resultContactUs = await CoreAPI.post(_contactUrl + "api/Login/WOLFContactUS", null, requestContactModel);


                var requestLoginModel = new LoginModel
                {
                    userPrincipalName = user.username,
                };
                var loginCallback = new UserDto();
                LogFile.WriteLogFile("LoginController WolfAccount , getcontact | resultContactUs : " + Newtonsoft.Json.JsonConvert.SerializeObject(resultContactUs), module);

                var result = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
                var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(result);
                var responeContactUS = JsonConvert.DeserializeObject<UserDataModel>(resultContactUs);
                if (responeContactUS.TinyURL != user.TmpUrl)
                {
                    loginCallback.Remark = "คุณไม่มีสิทธ์เข้าถึงในขณะนี้";
                }
                else
                {
                    if (responeContactUS.ContactCode == null)
                    {
                        loginCallback.Remark = "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง";
                    }
                    else
                    {
                        var des = "";
                        des = "|" + responeContactUS.LogoPath + "|" + user.password;
                        var loginUser = new UserADModel
                        {
                            username = user.username,
                            password = GeneratePassword.generatePassword(user.password.Trim()),
                            ContactCode = responeContactUS.ContactCode,
                            Note = responeContactUS.ContactCode,
                            Remark = responeContactUS.Fax,
                            Description = des
                        };
                        _configuration["AppSettings:UserPrincipalName"] = user.username;
                        _configuration["AppSettings:ConnectionString"] = responeContactUS.ConnectionString;
                        _configuration["AppSettings:BaseUrl"] = responeContactUS.ApiURL + "/";
                        _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
                        LogFile.WriteLogFile("LoginController WolfAccount , WOLFAccountAuthen : " + Newtonsoft.Json.JsonConvert.SerializeObject(loginUser), module);

                        var AES = new AESCipher();

                        //QAR2
                        _configuration["AppSettings:SharepointSiteURL"] = AES.function.Decrypt(responeGetContact.SharepointSiteURL, true);

                        //Nissin
                        //_configuration["AppSettings:SharepointSiteURL"] = AES.function.Decrypt(responeContactUS.SharepointSiteURL, true);
                        LogFile.WriteLogFile("LoginController WolfAccount , WOLFAccountAuthen | loginUser : " + Newtonsoft.Json.JsonConvert.SerializeObject(loginUser) + " , " + _baseUrl, module);

                        var loginResult = await CoreAPI.post(_baseUrl + "api/Login/WOLFAccountAuthen", null, loginUser);
                        LogFile.WriteLogFile("LoginController WolfAccount , WOLFAccountAuthen | loginResult : " + Newtonsoft.Json.JsonConvert.SerializeObject(loginResult), module);

                        var loginResultJson = JsonConvert.DeserializeObject<UserDto>(loginResult);
                        var empData = new EmployeeDto();

                        if (loginResultJson.ContactCode == null)
                        {
                            loginCallback.Remark = loginResultJson.Remark;
                        }
                        else if ((loginResultJson.IsVerify == false && responeContactUS.Fax != "AD") || loginResultJson.IsActive == false)
                        {
                            loginCallback.Remark = "คุณไม่มีสิทธ์เข้าถึงในขณะนี้";
                        }
                        else
                        {
                            var emp = new BaseBodyModel
                            {
                                UserPrincipalName = user.username,
                                ConnectionString = responeContactUS.ConnectionString,
                            };
                            LogFile.WriteLogFile("LoginController WolfAccount , EmployeeList | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(emp), module);

                            var empActiveList = await CoreAPI.post(_baseUrl + "api/Employee/activeEmployeeList", null, emp);
                            var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(empActiveList);
                            empData = empListJson.FirstOrDefault(d => d.Email.ToUpper() == loginResultJson.username.ToUpper() || d.Username.ToUpper() == loginResultJson.username.ToUpper() || d.EmployeeCode == loginResultJson.username);
                            loginCallback.SharepointSiteURL = _configuration.GetValue<string>("AppSettings:SharepointSiteURL");
                            loginCallback.TinyURL = responeContactUS.TinyURL;
                            loginCallback.GuidVerify = loginResultJson.GuidVerify;
                            loginCallback.employeeData = empData;
                        }
                        LogFile.WriteLogFile("LoginController WolfAccount , loginCallback.employeeData | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(loginCallback.employeeData), module);

                        if (loginCallback.employeeData == null)
                        {
                            loginCallback.Remark = "Access denied.\r\nYou do not have permission to perform access this resource.\r\nPlease add your employee profile.";
                        }
                        LogFile.WriteLogFile("LoginController WolfAccount , empData | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(empData), module);

                        if (empData == null)
                        {
                            loginCallback.Remark = "คุณไม่มีสิทธิ์เข้าถึงในขณะนี้";
                        }
                        else if (empData.IsActive == false)
                        {
                            loginCallback.Remark = "คุณไม่มีสิทธิ์เข้าถึงในขณะนี้";
                        }

                    }
                }

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(loginCallback);
                return Ok(json);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("LoginController WolfAccount , Error : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                return Ok(ex);
            }
        }
        /// <summary>
        /// Login หน้าเว็บเป็นWolf
        /// </summary>
        [HttpPost("ADAccount")]
        public async Task<ActionResult> LoginAD(UserWolfModel user)
        {
            _contactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
            var requestLoginModel = new LoginModel
            {
                userPrincipalName = user.username,
            };
            var loginCallback = new UserDto();
            LogFile.WriteLogFile("LoginController ADAccount , getcontact | requestLoginModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestLoginModel), module);

            var result = await CoreAPI.post(_contactUrl + "api/services/getcontact", null, requestLoginModel);
            var responeGetContact = JsonConvert.DeserializeObject<UserDataModel>(result);
            if (responeGetContact.ContactCode == null)
            {
                loginCallback.Remark = "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง";
            }
            else
            {
                var des = "";
                if (responeGetContact.Account.Length == 0)
                {
                    des = responeGetContact.LogoPath;
                }
                var loginUser = new UserADModel
                {
                    username = user.username,
                    password = GeneratePassword.generatePassword(user.password.Trim()),
                    ContactCode = responeGetContact.ContactCode,
                    Note = responeGetContact.ContactCode,
                    Remark = responeGetContact.Fax,
                    Description = des + "|" + user.password
                };
                _configuration["AppSettings:UserPrincipalName"] = user.username;
                _configuration["AppSettings:ConnectionString"] = responeGetContact.ConnectionString;
                _configuration["AppSettings:BaseUrl"] = responeGetContact.ApiURL + "/";
                _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
                loginCallback.SharepointSiteURL = responeGetContact.SharepointSiteURL;
                LogFile.WriteLogFile("LoginController ADAccount , ADAccount | loginUser : " + Newtonsoft.Json.JsonConvert.SerializeObject(loginUser), module);

                var loginResult = await CoreAPI.post(_baseUrl + "api/Login/WOLFAccountAuthen", null, loginUser);
                var loginResultJson = JsonConvert.DeserializeObject<UserDto>(loginResult);
                if (loginResultJson.ContactCode == null)
                {
                    loginCallback.Remark = loginResultJson.Remark;
                }
                else
                {
                    var emp = new BaseBodyModel
                    {
                        UserPrincipalName = user.username,
                        ConnectionString = responeGetContact.ConnectionString,

                    };
                    LogFile.WriteLogFile("LoginController ADAccount , EmployeeList | emp : " + Newtonsoft.Json.JsonConvert.SerializeObject(emp), module);

                    var empList = await CoreAPI.post(_baseUrl + "api/Employee/EmployeeList", null, emp);
                    var empListJson = JsonConvert.DeserializeObject<List<EmployeeDto>>(empList);
                    var empData = empListJson.FirstOrDefault(d => d.Email == user.username);
                    loginCallback.SharepointSiteURL = _configuration.GetValue<string>("AppSettings:SharepointSiteURL");
                    loginCallback.TinyURL = responeGetContact.TinyURL;
                    loginCallback.GuidVerify = loginResultJson.GuidVerify;
                    loginCallback.employeeData = empData;
                }
                if (loginCallback.employeeData == null)
                {
                    loginCallback.Remark = "คุณไม่มีสิทธิ์เข้าถึงในขณะนี้";
                }
            }


            var json = Newtonsoft.Json.JsonConvert.SerializeObject(loginCallback);
            return Ok(json);
        }
    }
}
