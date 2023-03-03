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
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.IO;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeStampController: ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "TimeStamp";
        public TimeStampController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }

        /// <summary>
        /// ดึงข้อูลของ TimeStamp
        /// </summary>
        [HttpPost("GetTimeStamp")]
        public async Task<ActionResult> GetTimeStamp(TimeStampRequestModel timeStampRequest)
        {
            try
            {

                timeStampRequest.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");

                //LogFile.WriteLogFile("WorklistController GetWorkListByTaskgroup | api/Worklist/GetWorkList/" + taskgroup.empId + "/" + taskgroup.task + " | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel));

                var result = await CoreAPI.post(_baseUrl + "api/ImportFile/GetTextfile", null, timeStampRequest);
                var TimeStampDto = JsonConvert.DeserializeObject<TimeStampDto>(result);
                var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(TimeStampDto);
                return Ok(resultJson);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetTimeStamp: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        /// <summary>
        /// อัพโหลดข้อมูล TimeStamp
        /// </summary>
        [HttpPost("UploadTimeStamp")]
        public async Task<ActionResult> UploadTimeStamp()
        {
            try
            {
                ImportTextFileRequestModel requestModel = new ImportTextFileRequestModel
                {
                    formFile = await ConvertFormFile.GetBytes(Request.Form.Files[0]),
                    fileName = Request.Form.Files[0].FileName,
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString")

                };

                var result = await postMultipartAPI(_baseUrl + "api/ImportFile/Textfile", requestModel);

                return Ok(result);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|UploadTimeStamp: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
            
        }

        /// <summary>
        /// Export ข้อมูล TimeStamp
        /// </summary>
        [HttpPost("ExportTimeStamp")]
        public async Task<ActionResult> ExportTimeStamp(TimeStampRequestModel timeStampRequest)
        {
            timeStampRequest.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");

            //LogFile.WriteLogFile("WorklistController GetWorkListByTaskgroup | api/Worklist/GetWorkList/" + taskgroup.empId + "/" + taskgroup.task + " | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel));

            var result = await CoreAPI.post(_baseUrl + "api/ImportFile/GetTextfile/Export", null, timeStampRequest);
            var TimeStampDto = JsonConvert.DeserializeObject<TimeStampDto>(result);
            var resultJson = Newtonsoft.Json.JsonConvert.SerializeObject(TimeStampDto);
            return Ok(resultJson);
        }

        private static async Task<bool> postMultipartAPI(string _baseUrl, ImportTextFileRequestModel attach)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Accept.Clear();
                    //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("multipart/form-data"));

                    HttpContent content;
                    MultipartFormDataContent form = new MultipartFormDataContent();
                    MemoryStream _ms = new MemoryStream(attach.formFile);

                    content = new StringContent(attach.UserPrincipalName);
                    form.Add(content, "UserPrincipalName");

                    content = new StringContent(attach.ConnectionString);
                    form.Add(content, "ConnectionString");

                    content = new StreamContent(_ms);
                    content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                    {
                        Name = "file",
                        FileName = attach.fileName
                    };
                    form.Add(content);
                    string s = JsonConvert.SerializeObject(form);
                    var response = await client.PostAsync(_baseUrl, form);
                    //var response = client.PostAsync($"/api/services/attach", form);
                    //var response = client.PostAsync("/services/attach", form);

                    if (response.IsSuccessStatusCode)
                    {
                        _ms.Close();
                        return response.IsSuccessStatusCode;
                    }
                    else
                    {
                        _ms.Close();
                        return response.IsSuccessStatusCode;
                    }


                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }

}
