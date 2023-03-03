using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class MemoDetailDto
    {
        public EmployeeDto creator { get; set; }
        public EmployeeDto requestor { get; set; }
        public EmployeeDto? actorCheckAccess { get; set; }
        public EmployeeDto actor { get; set; }
        public MemoPermissionDto Permission { get; set; }

        public int memoid { get; set; }
        public int current_approval_level { get; set; }
        public string waiting_for { get; set; }
        public string status { get; set; }
        public string document_no { get; set; }
        public int template_id { get; set; }
        public string template_name { get; set; }
        public string request_date { get; set; }
        public int company_id { get; set; }
        public string company_name { get; set; }
        public string location { get; set; }
        public string to { get; set; }
        public string pass { get; set; }
        public string subject { get; set; }
        public int project_id { get; set; }
        public string project { get; set; }
        public string template_desc { get; set; }
        public string costcenter { get; set; }
        public string amount { get; set; }
        public string wbs { get; set; }
        public string io { get; set; }
        public string comment { get; set; }
        public string document_set { get; set; }
        public string document_library { get; set; }
        public bool is_editable { get; set; }
        public int department_id { get; set; }
        public bool is_public { get; set; }
        public string report_lang { get; set; }
        public string template_detail { get; set; }
        public bool auto_approve { get; set; }
        public string auto_approve_when { get; set; }
        public bool approver_can_edit { get; set; }
        public int status_id { get; set; }
        public string created_date { get; set; }
        public string created_by { get; set; }
        public string modified_date { get; set; }
        public string modified_by { get; set; }
        public string last_action_by { get; set; }
        public int last_status_id { get; set; }
        public string last_status_name { get; set; }
        public int waiting_for_id { get; set; }
        public bool is_text_form { get; set; }
        public string template_code { get; set; }
        public string GroupTemplateName { get; set; }
        public string refrenece_doc { get; set; }
        public string TemplateApproveId { get; set; }
    }
}
