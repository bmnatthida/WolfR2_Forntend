using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemoButtonController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        public MemoButtonController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
    }
}
