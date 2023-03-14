using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class MemoDetailForRefDto
    {
        public EmployeeDto Creator { get; set; }
        public EmployeeDto Requestor { get; set; }
        public EmployeeDto? ActorCheckAccess { get; set; }
        public EmployeeDto Actor { get; set; }
        public MemoPermissionDto Permission { get; set; }

        public int Memoid { get; set; }
        public int Current_approval_level { get; set; }
        public string Waiting_for { get; set; }
        public string Status { get; set; }
        public string Document_no { get; set; }
        public int Template_id { get; set; }
        public string Template_name { get; set; }
        public string Request_date { get; set; }
        public int Company_id { get; set; }
        public string Company_name { get; set; }
        public string Location { get; set; }
        public string To { get; set; }
        public string Pass { get; set; }
        public string Subject { get; set; }
        public int Project_id { get; set; }
        public string Project { get; set; }
        public string Template_desc { get; set; }
        public string Costcenter { get; set; }
        public string Amount { get; set; }
        public string Wbs { get; set; }
        public string Io { get; set; }
        public string Comment { get; set; }
        public string Document_set { get; set; }
        public string Document_library { get; set; }
        public bool Is_editable { get; set; }
        public int Department_id { get; set; }
        public bool Is_public { get; set; }
        public string Report_lang { get; set; }
        public string Template_detail { get; set; }
        public bool Auto_approve { get; set; }
        public string Auto_approve_when { get; set; }
        public bool Approver_can_edit { get; set; }
        public int Status_id { get; set; }
        public string Created_date { get; set; }
        public string Created_by { get; set; }
        public string Modified_date { get; set; }
        public string Modified_by { get; set; }
        public string Last_action_by { get; set; }
        public int Last_status_id { get; set; }
        public string Last_status_name { get; set; }
        public int Waiting_for_id { get; set; }
        public bool Is_text_form { get; set; }
        public string Template_code { get; set; }
        public string GroupTemplateName { get; set; }
        public string Refrenece_doc { get; set; }
        public string TemplateApproveId { get; set; }
    }
}
