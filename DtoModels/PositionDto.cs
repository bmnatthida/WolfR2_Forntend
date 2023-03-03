using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class PositionDto
    {
        public int? PositionId { get; set; }
        public string NameTh { get; set; }
        public string NameEn { get; set; }
        public bool? IsActive { get; set; }
        public int PositionLevelId { get; set; }
        public int PosotionLevel { get; set; }
        public string CompanyCode { get; set; }
        public string PositionLevelNameTh { get; set; }
        public string PositionLevelNameEn { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
    public class PositionFormatDto
    {
        public int? PositionId { get; set; }
        public string NameTh { get; set; }
        public string NameEn { get; set; }
        public bool? IsActive { get; set; }
        public int PositionLevelId { get; set; }
        public int PositionLevel { get; set; }
        public string CompanyCode { get; set; }
        public string PositionLevelNameTh { get; set; }
        public string PositionLevelNameEn { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
