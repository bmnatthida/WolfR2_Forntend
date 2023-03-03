﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class PositionModel
    {
        public int? PositionId { get; set; }
        public string NameTh { get; set; }
        public string NameEn { get; set; }
        public int PositionLevelId { get; set; }
        public bool? IsActive { get; set; }
        public string PositionLevelNameTh { get; set; }
        public string PositionLevelNameEn { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public int PosotionLevel { get; set; }
        public string? userPrincipalName { get; set; }
        public string? connectionString { get; set; }
        public string? SecretId { get; set; }

    }
}
