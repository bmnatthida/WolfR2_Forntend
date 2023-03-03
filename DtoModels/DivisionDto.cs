using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class DivisionDto
    {
        public int? DivisionId { get; set; }

        public string NameTh { get; set; }

        public string NameEn { get; set; }

        public string CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public string ModifiedDate { get; set; }
        public string CreatedByName { get; set; }

        public string ModifiedBy { get; set; }

        public bool IsActive { get; set; }

        public string DivisionCode { get; set; }

        public int? AccountId { get; set; }

    }
}
