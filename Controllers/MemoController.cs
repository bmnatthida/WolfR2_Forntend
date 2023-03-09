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
    public class MemoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private string _baseUrl;
        private string module = "Memo";
        public MemoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _baseUrl = _configuration.GetValue<string>("AppSettings:BaseUrl");
        }

        /// <summary>
        /// ดึงข้อมูลของ Memo Permission 
        /// </summary>
        [HttpPost("GetMemoPermission")]
        public async Task<ActionResult> GetMemoPermission(MemoPermissionModel memoModel)
        {
            var requestModel = new MemoPermissionModel
            {
                connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                MemoId = memoModel.MemoId,
                RequesterId = memoModel.RequesterId,
                RNameEn = memoModel.RNameEn
            };
            LogFile.WriteLogFile("MemoController GetMemoPermission | api/Memo/MemoAuthentication | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Memo/MemoAuthentication", null, requestModel);
            return Ok(result);
        }
        // <summary>
        /// ดึงข้อมูลของ Memo Permission 
        /// </summary>
        [HttpPost("GetMemoPermissionViewAndPrint")]
        public async Task<ActionResult> GetMemoPermissionViewAndPrint(MemoPermissionViewAndPrintModel memoModel)
        {
            var requestModel = new MemoPermissionViewAndPrintModel
            {
                connectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                memoid = memoModel.memoid,
                EmployeeId = memoModel.EmployeeId
                //RequesterId = memoModel.RequesterId,
                //RNameEn = memoModel.RNameEn
            };
            LogFile.WriteLogFile("MemoController GetMemoPermission | api/Memo/MemoPermission | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Memo/MemoPermission", null, requestModel);
            return Ok(result);
        }
        /// <summary>
        /// ดึงข้อมูลของ MemoDetail ด้วย ID
        /// </summary>
        [HttpPost("GetMemoById")]
        public async Task<ActionResult> GetMemoById(MemoModel memoModel)
        {
            var requestModel = new MemoModel
            {
                UserPrincipalName = memoModel.UserPrincipalName,
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                memoid = memoModel.memoid,
                EmployeeId = memoModel.EmployeeId,
                SecretId = memoModel.SecretId,
                actor = memoModel.actor
            };
            LogFile.WriteLogFile("MemoController GetMemoById | api/Memo/MemoDetail | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

            var result = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail", null, requestModel);
            return Ok(result);
        }
        /// <summary>
        /// ดึงข้อมูลของ MemoDetail จากMemoid
        /// </summary>
        [DisableRequestSizeLimit]
        [HttpPost("GetMemoDetail")]
        public async Task<ActionResult> GetMemoDetail(RequsePageModel memoModel)
        {
            try
            {
                var memoDetailDto = new MemoDetailDto();
                var listApprovalDetailDto = new List<ListApprovalDetailDto>();
                var listFormName = new List<ListFormNameDto>();
                var historyDto = new List<HistoryDto>();
                var listRefDocsTemp = new List<RefDocDetails>();
                var attachFilesDto = new List<AttachFilesDto>();
                var listRefDoc = new List<RefDocDto>();


                if (memoModel.memoid != 0)
                {
                    var requestMemoDetailModel = new MemoModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        memoid = memoModel.memoid,
                        EmployeeId = memoModel.EmployeeId,
                        SecretId = memoModel.SecretId,
                        actor = memoModel.actor
                    };

                    var requestMasterDataModel = new BaseBodyModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    };

                    var requestModel = new MemoModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        SecretId = "",
                        memoid = memoModel.memoid,
                    };
                    var actorRequest = new ActorModel();
                    actorRequest.EmployeeId = Int32.Parse(memoModel.EmployeeId);
                    var historyModel = new HistoryModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        memoid = memoModel.memoid,
                        SecretId = "",
                        actor = actorRequest
                    };
                    LogFile.WriteLogFile("MemoController GetMemoById | api/Memo/MemoDetail/Approvals , api/Memo/MemoDetail/AttachFiles , api/Memo/GetReferenceDocByMemoID | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                    LogFile.WriteLogFile("MemoController GetMemoById | api/Memo/MemoDetail/Histories | historyModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(historyModel), module);
                    LogFile.WriteLogFile("MemoController GetMemoById | api/MasterData/MasterDataList | requestMasterDataModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestMasterDataModel), module);
                    LogFile.WriteLogFile("MemoController GetMemoById | api/Memo/MemoDetail | requestMemoDetailModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestMemoDetailModel), module);

                    var memoDetail = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail", null, requestMemoDetailModel);
                    var memo = JsonConvert.DeserializeObject<List<MemoDetailDto>>(memoDetail, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                    memoDetailDto = memo[0];
                    var approvals = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Approvals", null, requestModel);

                    var attachFiles = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/AttachFiles", null, requestModel);

                    var history = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Histories", null, historyModel);

                    //var masterDatas = await CoreAPI.post(_baseUrl + "/api/MasterData/MasterDataList", null, requestMasterDataModel);

                    var listReftemp = await CoreAPI.post(_baseUrl + "api/Memo/GetReferenceDocByMemoID", null, requestModel);

                    listApprovalDetailDto = JsonConvert.DeserializeObject<List<ListApprovalDetailDto>>(approvals, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                    historyDto = JsonConvert.DeserializeObject<List<HistoryDto>>(history, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                    historyDto = historyDto.OrderByDescending(x => x.action_date).ToList();

                    listRefDocsTemp = JsonConvert.DeserializeObject<List<RefDocDetails>>(listReftemp, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                    attachFilesDto = JsonConvert.DeserializeObject<List<AttachFilesDto>>(attachFiles, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                }
                if (memoModel.DocumentNo != null && memoModel.DocumentNo != "")
                {
                    var DocNoRequestModel = new MemoByDocumentNoRequestModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        DocumentNo = memoModel.DocumentNo
                    };
                    var memoResult = await CoreAPI.post(_baseUrl + "api/Memo/MemoByDocumentNo", null, DocNoRequestModel);

                }
                if (memoModel.DocumentCode != null && memoModel.DocumentCode != "")
                {
                    var tempRequestModel = new TemplateByDocTypeCodeRequestModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        DocumentCode = memoModel.DocumentCode
                    };
                    LogFile.WriteLogFile("RolesController GetTemplateByDocTypeCod | api/Template/TemplateByDocTypeCode | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(tempRequestModel), module);

                    var tempResult = await CoreAPI.post(_baseUrl + "api/Template/TemplateByDocTypeCode", null, tempRequestModel);
                    listFormName.Add(JsonConvert.DeserializeObject<ListFormNameDto>(tempResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));

                }


                else if (memoModel.TemplateId != null && memoModel.TemplateId != 0)
                {
                    var tempRequestModel = new TemplateOBJRequestModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        TemplateId = memoModel.TemplateId
                    };
                    LogFile.WriteLogFile("RolesController GetById | api/Template/TemplateByid | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(tempRequestModel), module);

                    var tempResult = await CoreAPI.post(_baseUrl + "api/Template/TemplateByid", null, tempRequestModel);

                    listFormName.Add(JsonConvert.DeserializeObject<ListFormNameDto>(tempResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
                }
                else
                {
                    var tempRequestModel = new TemplateOBJRequestModel
                    {
                        UserPrincipalName = memoModel.actor.Email,
                        ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                        TemplateId = memoDetailDto.template_id
                    };
                    LogFile.WriteLogFile("RolesController GetById | api/Template/TemplateByid | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(tempRequestModel), module);

                    var tempResult = await CoreAPI.post(_baseUrl + "api/Template/TemplateByid", null, tempRequestModel);


                    listFormName.Add(JsonConvert.DeserializeObject<ListFormNameDto>(tempResult, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
                }


                MemoPageDto requestDetail = new MemoPageDto
                {
                    memoDetail = memoDetailDto,
                    listApprovalDetails = listApprovalDetailDto,
                    listHistoryDetails = historyDto,
                    listFormNames = listFormName,
                    listFileAttachDetails = attachFilesDto,
                    listRefDocDetails = listRefDocsTemp
                };


                var responeDto = new ResponeRequestDetailDto
                {
                    requestDetails = requestDetail,
                    refDocs = listRefDoc,
                };
                var result = Newtonsoft.Json.JsonConvert.SerializeObject(responeDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw (ex);
            }
        }

        [HttpPost("GetMemoDetailOnlyById")]
        public async Task<ActionResult> GetMemoDetailOnlyById(List<MemoModel> memoModel)
        {
            List<MemoDetailForRefDto> listMemoDetail = new List<MemoDetailForRefDto>();
            foreach (var memo in memoModel)
            {
                try
                {
                    memo.UserPrincipalName = memo.UserPrincipalName;
                    memo.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                    LogFile.WriteLogFile("MemoController GetMemoDetailOnlyById | api/Memo/MemoDetail | memo : " + Newtonsoft.Json.JsonConvert.SerializeObject(memo), module);

                    var memoDetail = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail", null, memo);
                    var memoDetailDto = JsonConvert.DeserializeObject<List<MemoDetailForRefDto>>(memoDetail);
                    listMemoDetail.Add(memoDetailDto[0]);
                }
                catch (Exception e)
                {
                    LogFile.WriteLogFile("MemoController GetMemoDetailOnlyById | api/Memo/MemoDetail | memo : " + e, module);

                }

            }

            var result = Newtonsoft.Json.JsonConvert.SerializeObject(listMemoDetail);
            return Ok(result);
        }

        /// <summary>
        /// เพิ่มข้อมูลตามActionของ MemoDetail
        /// </summary>
        [DisableRequestSizeLimit]
        [HttpPost("ActionMemoPage")]
        public async Task<ActionResult> Add(MemoPageRequestModel request)
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
                    wbs = request.MemoPage.memoDetail.wbs,

                };

                var memoPageModel = new MemoRequestModel();
                memoPageModel.listControlRunning = request.MemoPage.listControlRunning;
                memoPageModel.listRefDocDetails = request.MemoPage.listRefDocDetails;
                memoPageModel.memoDetail = _memoDetail;
                memoPageModel.listApprovalDetails = request.MemoPage.listApprovalDetails;
                memoPageModel.listFileAttachDetails = request.MemoPage.listFileAttachDetails;
                memoPageModel.listFormName = request.MemoPage.listFormName;
                memoPageModel.UserPrincipalName = request.MemoPage.UserPrincipalName;
                memoPageModel.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                memoPageModel.SecretId = "";
                memoPageModel.listHistoryDetails = request.MemoPage.listHistoryDetails;


                foreach (var running in memoPageModel.listControlRunning)
                {
                    running.CreateBy = request.MemoPage.memoDetail.actor.EmployeeId;
                }


                foreach (var refDocDetail in memoPageModel.listRefDocDetails)
                {
                    refDocDetail.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                    refDocDetail.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                    refDocDetail.createdby = request.MemoPage.memoDetail.created_by;
                    refDocDetail.createddate = request.MemoPage.memoDetail.created_date;
                }

                foreach (var fileAttach in memoPageModel.listFileAttachDetails)
                {
                    fileAttach.UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName");
                    fileAttach.ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString");
                    fileAttach.SecretId = "";
                }

                var _memoPageModel = new MemoPageRequestModel
                {
                    MemoPage = memoPageModel,
                    UserPrincipalName = _configuration.GetValue<string>("AppSettings:UserPrincipalName"),
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),

                };
                LogFile.WriteLogFile("MemoController ActionMemoPage |api/services/submitform?action=" + request.Type + " | _memoPageModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(_memoPageModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/services/submitform?action=" + request.Type + "&platform=web", null, _memoPageModel);
                LogFile.WriteLogFile("ActionMemoPage Result" + Newtonsoft.Json.JsonConvert.SerializeObject(result), module);
                return Ok(result);

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("ErrorMemoController" + ex, module);
                throw ex;
            }

        }
        /// <summary>
        /// ดึงข้อมูลButtonของ MemoDetail จากMemoId
        /// </summary>
        [HttpPost("GetButtonMemoByMemoId")]
        public async Task<ActionResult> Post(MemoButtonModel memo)
        {
            var myActor = new ActorModel();
            myActor.EmployeeId = memo.actor.EmployeeId;
            var request = new MemoButtonModel
            {
                UserPrincipalName = memo.UserPrincipalName,
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                SecretId = "",
                memoid = memo.memoid,
                actor = myActor

            };
            LogFile.WriteLogFile("MemoController GetButtonMemoByMemoId | api/Memo/MemoDetail/Buttons | request : " + Newtonsoft.Json.JsonConvert.SerializeObject(request), module);

            var result = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Buttons", null, request);
            return Ok(result);
        }

        /// <summary>
        /// ดึงข้อมูลHistory
        /// </summary>
        [HttpPost("GetMemoHistoryDetail")]
        public async Task<ActionResult> GetMemoHistory(GetMemoHistoryDetailModel request)
        {
            var historyDto = new List<HistoryDto>();
            var myActor = new ActorModel();
            myActor.EmployeeId = request.actor.EmployeeId ?? default(int);
            var historyModel = new HistoryModel
            {
                UserPrincipalName = request.actor.Email,
                ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                memoid = request.memoid,
                SecretId = "",
                actor = myActor
            };
            var history = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/Histories", null, historyModel);
            historyDto = JsonConvert.DeserializeObject<List<HistoryDto>>(history, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            historyDto = historyDto.OrderByDescending(x => x.action_date).ToList();
            return Ok(historyDto);
        }

        /// <summary>
        /// ดึงข้อมูReferenceDoc ทั้งหมด
        /// </summary>
        [HttpPost("GetRefDocTemp")]
        public async Task<ActionResult> GetRefDocTemp(RefDocRequestModel template)
        {
            try
            {
                var requestModel = new RefDocRequestModel
                {
                    UserPrincipalName = template.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    template_ID = template.template_ID
                };
                LogFile.WriteLogFile("MemoController GetRefDocTemp |api/Memo/GetAllReferenceDoc | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var result = await CoreAPI.post(_baseUrl + "api/Memo/GetAllReferenceDoc", null, requestModel);

                return Ok(result);


            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetRefDocTemp: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }

        [HttpPost("GetRefDocFormTable")]
        public async Task<ActionResult> GetRefDocFormTable(RefDocFormTableRequestModel refTable)
        {
            try
            {
                var requestModel = new RefDocFormTableRequestModel
                {
                    UserPrincipalName = refTable.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    PageIndex = 0,
                    PageSize = 1000000,
                    CUserID = refTable.CUserID,
                    RUserID = refTable.RUserID,
                    ConditionRefdoc = refTable.ConditionRefdoc,
                    Search = refTable.Search,
                    docCancelDoc = refTable.docCancelDoc,
                    docDataSource = refTable.docDataSource,
                    docEditDoc = refTable.docEditDoc,
                    docNewDoc = refTable.docNewDoc,
                    docReport = refTable.docReport,
                    doccontrol = refTable.doccontrol,
                    docRef = refTable.docRef,

                };
                LogFile.WriteLogFile("MemoController GetRefDocFormTable | api/Memo/GetRefDocFormTable | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);

                var x = JsonConvert.SerializeObject(requestModel);
                var result = await CoreAPI.post(_baseUrl + "api/Memo/GetRefDocFormTable", null, requestModel);

                return Ok(result);


            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetRefDocFormTable: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }

        [HttpPost("GetAttachmentFilesByMemoId")]
        public async Task<ActionResult> GetAttachmentFilesByMemoId(MemoModel memoModel)
        {
            try
            {
                var requestModel = new MemoModel
                {
                    UserPrincipalName = memoModel.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    SecretId = "",
                    memoid = memoModel.memoid,
                };
                LogFile.WriteLogFile("MemoController GetAttachmentFilesByMemoId | api/Memo/MemoDetail/Approvals , api/Memo/MemoDetail/AttachFiles , api/Memo/GetReferenceDocByMemoID | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(requestModel), module);
                var attachFiles = await CoreAPI.post(_baseUrl + "api/Memo/MemoDetail/AttachFiles", null, requestModel);

                var attachFilesDto = JsonConvert.DeserializeObject<List<AttachFilesDto>>(attachFiles, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                return Ok(JsonConvert.SerializeObject(attachFilesDto));

            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|GetAttachmentFilesByMemoId: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }
        }

        [HttpPost("SetCheckAccess")]
        public async Task<ActionResult> SetCheckAccess(CheckAccessRequestModel checkAccessRequest)
        {
            try
            {
                var requestModel = new CheckAccessRequestModel
                {
                    UserPrincipalName = checkAccessRequest.UserPrincipalName,
                    ConnectionString = _configuration.GetValue<string>("AppSettings:ConnectionString"),
                    memoid = checkAccessRequest.memoid,
                    RequesterId = checkAccessRequest.RequesterId,
                };
                LogFile.WriteLogFile("MemoController SetAccess |api/Memo/SetAccess | requestModel : " + Newtonsoft.Json.JsonConvert.SerializeObject(checkAccessRequest), module);

                var result = await CoreAPI.post(_baseUrl + "api/Memo/SetAccess", null, requestModel);

                ResponseModel responseRequest = JsonConvert.DeserializeObject<ResponseModel>(result);
                return Ok(responseRequest);
            }
            catch (Exception ex)
            {
                LogFile.WriteLogFile("Exception|SetCheckAccess: " + Newtonsoft.Json.JsonConvert.SerializeObject(ex), module);
                throw;
            }

        }
    }
}
