using System;

namespace WolfR2.DtoModels
{
    public class WorkListDto
    {
        public EmployeeDto Requestor { get; set; }

        public int? MemoID { get; set; }
        public int? WaitingFor { get; set; }
        public string Status { get; set; }
        public string DocumentNo { get; set; }
        public string TemplateName { get; set; }
        public string RequestDate { get; set; }
        public string CompanyName { get; set; }
        public string DepartmentName { get; set; }
        public string Subject { get; set; }
        public string Amount { get; set; }
        public string ModifiedDate { get; set; }


        public int CountMoreItem { get; set; }
        public String FilterText { get; set; }
        public String FilterDateFrom { get; set; }
        public String FilterDateTo { get; set; }
        public Decimal? FilterAmountFrom { get; set; }
        public Decimal? FilterAmountTo { get; set; }
        public bool IsReaded { get; set; }

        public int iItemPerMore { get; set; } = 10;
    }
}
