using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class EmployeeIdRequestModel : BaseBodyRequestModel
    {
        public string EmployeeId { get; set; }

    }
}