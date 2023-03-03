using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using WolfR2.RequestModels;

namespace WolfApprove.Model.ExternalConnection
{
    public  class CoreAPI
    {
         private readonly IConfiguration _configuration;
        public CoreAPI(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public static async Task<string> Get(string baseUrl, List<dynamic> Headers = null)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(baseUrl);
                    client.DefaultRequestHeaders.Accept.Clear();

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    if (Headers != null)
                        if (Headers.Count > 0)
                        {
                            foreach (var getHeader in Headers)
                            {
                                client.DefaultRequestHeaders.Add(getHeader.Key, getHeader.Value);
                            }
                        }
                    var response = await client.GetAsync(baseUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        public static async Task<string> post(string subUri, List<dynamic> Headers, Object obj)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(subUri);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    client.Timeout = new TimeSpan(0, 20, 0);
                    if (Headers != null)
                        if (Headers.Count > 0)
                        {
                            foreach (var getHeader in Headers)
                            {
                                client.DefaultRequestHeaders.Add(getHeader.Key, getHeader.Value);
                            }
                        }

                    var json =  Newtonsoft.Json.JsonConvert.SerializeObject(obj);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(subUri, content);

                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public static async Task<string> postJson(string subUri, List<dynamic> Headers, string obj)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(subUri);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.Timeout = new TimeSpan(0, 20, 0);

                    if (Headers != null)
                        if (Headers.Count > 0)
                        {
                            foreach (var getHeader in Headers)
                            {
                                client.DefaultRequestHeaders.Add(getHeader.Key, getHeader.Value);
                            }
                        }

                    //var json = new JavaScriptSerializer().Serialize(obj);
                    //obj.ToString()
                    //var content = new StringContent(json, Encoding.UTF8, "application/json");
                    //var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);

                    var content = new StringContent(obj, Encoding.UTF8, "application/json");


                    var response = await client.PostAsync(subUri, content);

                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        return response.ReasonPhrase;
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static async Task<bool> postMultipartAPI(string _baseUrl, AttachRequestModel attach)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.BaseAddress = new Uri(_baseUrl);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("multipart/form-data"));

                    HttpContent content;
                    MultipartFormDataContent form = new MultipartFormDataContent();
                    MemoryStream _ms = new MemoryStream(attach.file);

                    content = new StringContent(attach.UserPrincipalName);
                    form.Add(content, "userPrincipalName");

                    content = new StringContent(attach.document_lib);
                    form.Add(content, "docLib");

                    content = new StringContent(attach.document_set);
                    form.Add(content, "docSet");

                    content = new StringContent(attach.file_desc);
                    form.Add(content, "fileDesc");

                    content = new StringContent(attach.actorId);
                    form.Add(content, "actorID");

                    content = new StringContent(attach.ConnectionString);
                    form.Add(content, "connectionString");

                    content = new StreamContent(_ms);
                    content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                    {
                        Name = "file",
                        FileName = attach.file_name
                    };
                    form.Add(content);
                    string s = JsonConvert.SerializeObject(form);
                    var response = await client.PostAsync("api/services/attach", form);
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