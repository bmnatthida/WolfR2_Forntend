using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using WolfApprove.Model.ExternalConnection;
using WolfR2.Models;

namespace WolfR2.Controllers

{ 
    [Route("api/[controller]")]
    [ApiController]
   public class LogController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _ContactUrl;
         public LogController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ContactUrl = _configuration.GetValue<string>("AppSettings:ContactUrl");
        }
        
    
    /// ดึงข้อมูล ContactUrl
    [HttpPost("getlogtextfile")]
    public async Task<string> getlogtextfile(LogFilterModel filter)
        {
            var result = await CoreAPI.post(_ContactUrl + "api/Log/getlogtextfile",null,filter);
            return result;
        }
    }
    
    }