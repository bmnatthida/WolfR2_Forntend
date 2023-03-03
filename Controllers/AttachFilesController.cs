using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Helper;
using WolfR2.Models;
using WolfR2.RequestModels;

namespace WolfR2.Controllersf
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttachFilesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "AttachFiles";
        public AttachFilesController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// ดึงข้อมูล AttachFilesของMemo
        /// </summary>
        [HttpPost("GetAll")]
        public async Task<ActionResult> GetAll(AttachFilesModel memo)
        {
            var requestModel = new AttachFilesModel
            {
                UserPrincipalName = memo.UserPrincipalName,
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                SecretId = "",
                memoid = memo.memoid,

            };
            LogFile.WriteLogFile("AttachFilesController GetAll | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/AttachFiles", null, requestModel);
            return Ok(result);
        }

        private class ResponeModel
        {
            public bool result { get; set; }
            public string pathUrl { get; set; }
            public string fileName { get; set; }

        }
        /// <summary>
        /// อัพโหลดไฟล์ของ AttachFiles
        /// </summary>
        [HttpPost("AddFile")]
        public async Task<ActionResult> Uploadfile()
        {
            try
            {
                var requestFrom = new AttachRequestModel();
                requestFrom.file = await ConvertFormFile.GetBytes(Request.Form.Files[0]);
                requestFrom.document_lib = HttpContext.Request.Form["docLib"].ToString();
                requestFrom.document_set = HttpContext.Request.Form["docSet"].ToString();
                requestFrom.file_desc = HttpContext.Request.Form["fileDesc"].ToString();
                requestFrom.file_name = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + ReplaceStringChar.ReplaceSpecialChar(Request.Form.Files[0].FileName);
                requestFrom.actorId = HttpContext.Request.Form["actorID"];
                requestFrom.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                requestFrom.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                LogFile.WriteLogFile("AttachFilesController AddFile | requestFrom : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestFrom), module);

                var result = await CoreAPI.postMultipartAPI(_baseUrl, requestFrom);
                ResponeModel resModel = new ResponeModel();

                resModel.result = result;
                resModel.pathUrl = "/" + requestFrom.document_lib + "/" + requestFrom.document_set + "/" + ReplaceStringChar.ReplaceSpecialChar(requestFrom.file_name);
                string[] subs = requestFrom.file_name.Split("_");
                string cps = "";
                var arrayList = new ArrayList();
                for (int i = 1; i < subs.Length; i++)
                {
                    cps += subs[i] + "_";
                }
                string ordw = cps.Substring(0, cps.Length - 1);
                resModel.fileName = ordw;
                if (result)
                {
                    return Ok(resModel);
                }
                else
                {
                    return Ok(false);
                }
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("ExceptionAttach" + ex, module);
                throw ex;
            }
        }

        [HttpPost("AddRequestFile")]
        public async Task<ActionResult> UploadRequestfile(AttachRequestModel attachRequestModel)
        {
            try
            {
                var requestFrom = new AttachRequestModel();
                requestFrom.file = attachRequestModel.file;
                requestFrom.document_lib = attachRequestModel.document_lib;
                requestFrom.document_set = attachRequestModel.document_set;
                requestFrom.file_desc = attachRequestModel.file_desc;
                requestFrom.file_name = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + attachRequestModel.file_name;
                requestFrom.actorId = attachRequestModel.actorId;
                requestFrom.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                requestFrom.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                LogFile.WriteLogFile("AttachFilesController AddFile | requestFrom : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestFrom), module);

                var result = await CoreAPI.postMultipartAPI(_baseUrl, requestFrom);
                ResponeModel resModel = new ResponeModel();
                resModel.result = result;
                resModel.pathUrl = "/" + requestFrom.document_lib + "/" + requestFrom.document_set + "/" + requestFrom.file_name;
                string[] subs = requestFrom.file_name.Split("_");
                string cps = "";
                var arrayList = new ArrayList();
                for (int i = 1; i < subs.Length; i++)
                {
                    cps += subs[i] + "_";
                }
                string ordw = cps.Substring(0, cps.Length - 1);
                resModel.fileName = ordw;
                if (result)
                {
                    return Ok(resModel);
                }
                else
                {
                    return Ok(false);
                }



            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UploadRequestfile : " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw ex;
            }
        }

    }
}
