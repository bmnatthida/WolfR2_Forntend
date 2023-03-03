using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.RequestModels
{
    public class Authorization_viewRequestModel
    {
        public Authorization_view_PermissionRequestModel Permission { get; set; }

       public string? id { get; set; }



        public string? permissiontype { get; set; }

       public List<Authorization_view_idsRequestModel>? ids { get; set; }


     public List<Authorization_view_companRequestModel>? company { get; set; }    
     
 public Authorization_view_formcontrolRequestModel? formcontrol { get; set; }


    }
}
