using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WolfApprove.Model.ExternalConnection;
using WolfR2.DtoModels;
using WolfR2.Helper;
using WolfR2.Models;
using WolfR2.RequestModels;

namespace WolfR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreviewPdfController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "PreviewPdf";
        public PreviewPdfController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }
        /// <summary>
        /// Api เปิด Pdf
        /// </summary>
        [DisableRequestSizeLimit]
        [HttpPost("previewPdf")]
        public async Task<ActionResult> GetByDeteil(MemoPageRequestModel request)
        {

            
            try
            {
                var _memoDetail = new MemoDetailRequestModel
                {
                    actor = request.MemoPage.memoDetail.actor,
                    amount = request.MemoPage.memoDetail.amount,
                    approver_can_edit = request.MemoPage.memoDetail.approver_can_edit,
                    auto_approve = request.MemoPage.memoDetail.auto_approve,
                    auto_approve_when = request.MemoPage.memoDetail.auto_approve_when,
                    comment = request.MemoPage.memoDetail.comment,
                    company_id = request.MemoPage.memoDetail.company_id,
                    company_name = request.MemoPage.memoDetail.company_name,
                    costcenter = request.MemoPage.memoDetail.costcenter,
                    connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    created_by = request.MemoPage.memoDetail.created_by,
                    created_date = request.MemoPage.memoDetail.created_date,
                    creator = request.MemoPage.memoDetail.creator,
                    current_approval_level = request.MemoPage.memoDetail.current_approval_level,
                    department_id = request.MemoPage.memoDetail.department_id,
                    document_library = request.MemoPage.memoDetail.document_library,
                    document_no = request.MemoPage.memoDetail.document_no,
                    document_set = request.MemoPage.memoDetail.document_set,
                    GroupTemplateName = request.MemoPage.memoDetail.GroupTemplateName,
                    io = request.MemoPage.memoDetail.io,
                    is_editable = request.MemoPage.memoDetail.is_editable,
                    is_public = request.MemoPage.memoDetail.is_public,
                    is_text_form = request.MemoPage.memoDetail.is_text_form,
                    last_action_by = request.MemoPage.memoDetail.last_action_by,
                    last_status_id = request.MemoPage.memoDetail.last_status_id,
                    last_status_name = request.MemoPage.memoDetail.last_status_name,
                    location = request.MemoPage.memoDetail.location,
                    memoid = request.MemoPage.memoDetail.memoid,
                    modified_by = request.MemoPage.memoDetail.modified_by,
                    modified_date = request.MemoPage.memoDetail.modified_date,
                    pass = request.MemoPage.memoDetail.pass,
                    project = request.MemoPage.memoDetail.project,
                    project_id = request.MemoPage.memoDetail.project_id,
                    refrenece_doc = request.MemoPage.memoDetail.refrenece_doc,
                    report_lang = request.MemoPage.memoDetail.report_lang,
                    requestor = request.MemoPage.memoDetail.requestor,
                    request_date = request.MemoPage.memoDetail.request_date,
                    status = request.MemoPage.memoDetail.status,
                    status_id = request.MemoPage.memoDetail.status_id,
                    subject = request.MemoPage.memoDetail.subject,
                    TemplateApproveId = request.MemoPage.memoDetail.TemplateApproveId,
                    template_code = request.MemoPage.memoDetail.template_code,
                    template_desc = request.MemoPage.memoDetail.template_desc,
                    template_detail = request.MemoPage.memoDetail.template_detail,
                    template_id = request.MemoPage.memoDetail.template_id,
                    template_name = request.MemoPage.memoDetail.template_name,
                    to = request.MemoPage.memoDetail.to,
                    waiting_for = request.MemoPage.memoDetail.waiting_for,
                    waiting_for_id = request.MemoPage.memoDetail.waiting_for_id,
                    wbs = request.MemoPage.memoDetail.wbs

                };
                
                var memoPageModel = new MemoRequestModel
                {
                    memoDetail = _memoDetail,
                    listApprovalDetails = request.MemoPage.listApprovalDetails,
                    listFileAttachDetails = request.MemoPage.listFileAttachDetails,
                    listFormName = request.MemoPage.listFormName,
                    listHistoryDetails = request.MemoPage.listHistoryDetails,
                    UserPrincipalName = request.MemoPage.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = "",
                };
                var _memoPageModel = new MemoPageRequestModel
                {
                    MemoPage = memoPageModel,
                    IsPreview = true,
                    UserPrincipalName = request.MemoPage.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),

                };
                LogFile.WriteLogFile("PreviewPdfController previewPdf | api/services/preview?returnType=pdf | _memoPageModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(_memoPageModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/services/preview?returnType=pdf", null, _memoPageModel);
                return Ok(result);

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|previewPdf: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw ex;
            }

        }

    }
}
