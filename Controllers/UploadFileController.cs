using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.Versioning;
using System.Threading.Tasks;
using WolfR2.Models;
using WolfR2.Helper;
using WolfR2.RequestModels;
using WolfApprove.Model.ExternalConnection;
using System.Collections;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string _ImagePathFile;
        private readonly IHostingEnvironment _hostingEnvironment;
        private string module = "UploadFile";
        public UploadFileController(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
            _ImagePathFile = _configuration.GetValue<string>("AppSettings:ImagePathFile");
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// อัพโหลดไฟล์ ของ TinyMce
        /// </summary>
        [HttpPost("AddTinyMce")]
        [SupportedOSPlatform("windows")]
        public async Task<ActionResult> UploadImage()
        {
            try
            {
                var requestFrom = new AttachRequestModel();
                requestFrom.document_lib = HttpContext.Request.Form["docLib"].ToString();
                requestFrom.file = await ConvertFormFile.GetBytes(Request.Form.Files[0]);
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
                LogFile.WriteLogFile("Exception|UploadImage: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// อัพโหลดไฟล์
        /// </summary>
        [HttpPost("AddFile")]
        [SupportedOSPlatform("windows")]
        public async Task<ActionResult> UploadFile([FromBody] FileUploadModel FileData)
        {

            try
            {
                LogFile.WriteLogFile(FileData.ToString(), module);
                string FileType = FileData.FileName.Substring(FileData.FileName.LastIndexOf("."), FileData.FileName.Length - FileData.FileName.LastIndexOf("."));
                LogFile.WriteLogFile(FileType, module);
                string NewFileName = DateTime.Now.Millisecond.ToString() + Guid.NewGuid().ToString().Replace("-", "") + DateTime.Now.Millisecond.ToString() + FileType;
                LogFile.WriteLogFile(FileType + NewFileName, module);
                string webRootPath = _hostingEnvironment.WebRootPath;
                LogFile.WriteLogFile(FileType + NewFileName + webRootPath, module);
                string contentRootPath = _hostingEnvironment.ContentRootPath;
                LogFile.WriteLogFile(FileType + NewFileName + webRootPath + contentRootPath, module);

                using (var ms = new MemoryStream(FileData.FileBytes, 0, FileData.FileBytes.Length))
                {
                    Image image = Image.FromStream(ms, true);


                    string filePath = contentRootPath + _ImagePathFile + Path.GetFileName(NewFileName);
                    LogFile.WriteLogFile(filePath, module);
                    System.IO.File.WriteAllBytes(filePath, FileData.FileBytes);
                }

                return Ok(new FileUploadModel() { imageUrl = webRootPath + "Images/RenderAttachFiles/" + NewFileName });
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UploadFile: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
        private class ResponeModel
        {
            public bool result { get; set; }
            public string pathUrl { get; set; }
            public string fileName { get; set; }

        }

        /// <summary>
        /// อัพโหลดไฟล์ของ RenderImageControl
        /// </summary>
        [HttpPost("UpLoadFileRenderControl")]
        public async Task<ActionResult> Uploadfile()
        {
            try
            {
                var requestFrom = new AttachRequestModel();
                requestFrom.file = await ConvertFormFile.GetBytes(Request.Form.Files[0]);
                requestFrom.document_lib = "TempAttachment";
                requestFrom.document_set = HttpContext.Request.Form["docSet"].ToString();
                requestFrom.file_desc = "";
                requestFrom.file_name = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + ReplaceStringChar.ReplaceSpecialChar(Request.Form.Files[0].FileName);
                requestFrom.actorId = HttpContext.Request.Form["actorID"];
                requestFrom.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                requestFrom.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                LogFile.WriteLogFile("UploadFileController UpLoadFileRenderControl | " + _baseUrl + " | requestFrom : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestFrom), module);

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
                LogFile.WriteLogFile("Exception|Uploadfile: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }

    }
}
