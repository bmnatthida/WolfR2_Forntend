using WolfR2.RequestModels;

namespace WolfR2.Models
{
    public class GetMemoHistoryDetailModel : BaseBodyModel
    {
        public int memoid { get; set; }
        public EmployeeRequestModel actor { get; set; }

    }
}
