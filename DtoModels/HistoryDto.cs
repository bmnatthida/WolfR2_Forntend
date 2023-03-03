using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.DtoModels
{
    public class HistoryDto
    {
        public int action_id { get; set; }
        public int memo_id { get; set; }
        public string action { get; set; }
        public string status { get; set; }
        public string comment { get; set; }

        public string action_date { get; set; }
        public int signature_id { get; set; }
        public string platform { get; set; }

        public string ip_address { get; set; }
        public string list_file_path { get; set; }

        public int? actor_id { get; set; }
        public string actor_name_th { get; set; }
        public string actor_name_en { get; set; }
        public int? actor_position_id { get; set; }
        public string actor_position_name_th { get; set; }
        public string actor_position_name_en { get; set; }
        public int? actor_department_id { get; set; }
        public string actor_department_name_th { get; set; }
        public string actor_department_name_en { get; set; }

        public int? delegate_actor_id { get; set; }
        public string delegate_actor_name_th { get; set; }
        public string delegate_actor_name_en { get; set; }
        public int? delegate_actor_position_id { get; set; }
        public string delegate_actor_position_name_th { get; set; }
        public string delegate_actor_position_name_en { get; set; }
        public int? delegate_actor_department_id { get; set; }
        public string delegate_actor_department_name_th { get; set; }
        public string delegate_actor_department_name_en { get; set; }
        public string HAdvancveForm { get; set; }

        public EmployeeDto actor { get; set; }
    }
}
