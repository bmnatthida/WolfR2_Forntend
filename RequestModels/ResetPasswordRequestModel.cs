using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.RequestModels
{
    public class ResetPasswordRequestModel
    {
        [Required]
        [MaxLength(50)]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 8,
    ErrorMessage = "Password should be minimum 8 characters and a maximum of 20 characters")]
        public string Password { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 8,
    ErrorMessage = "ConfirmPassword should be minimum 8 characters and a maximum of 20 characters")]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}
