using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.RequestModels;

namespace WolfR2.WolfR2.Interface
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequestModel mailRequestModel);
    }
}
