using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class AttachFilesDto
    {
        public int sequence { get; set; }
        public int attach_id { get; set; }
        public int memo_id { get; set; }
        public string attach_file { get; set; }
        public string description { get; set; }
        public string attach_path { get; set; }
        public string attach_date { get; set; }

        public int? delegate_id { get; set; }
        public string modified_date { get; set; }
        public string modified_by { get; set; }
        public bool is_merge_pdf { get; set; }
        public EmployeeDto approver { get; set; }

        public int? actor_id { get; set; }
        public string actor_name_th { get; set; }
        public string actor_name_en { get; set; }
        public int? actor_position_id { get; set; }
        public string actor_position_name_th { get; set; }
        public string actor_position_name_en { get; set; }
        public int? actor_department_id { get; set; }
        public string actor_department_name_th { get; set; }
        public string actor_department_name_en { get; set; }
        public EmployeeDto actor { get; set; }
    }
}
