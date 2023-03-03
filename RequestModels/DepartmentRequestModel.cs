﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.RequestModels
{
    public class DepartmentRequestModel : BaseBodyRequestModel
    {
        public int DepartmentId { get; set; }
        public string DepartmentCode { get; set; }
        public string NameTh { get; set; }
        public string NameEn { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? IsActive { get; set; }
        public int? SecretId { get; set; }
    }
}
