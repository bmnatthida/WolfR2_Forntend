using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class PagingModel
    {
        const int maxPageSize = 100;
        int _pageSize = 10;
        public int PageNumber { get; set; } = 1;
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = (value > maxPageSize) || value < 0 ? maxPageSize : value; }
        }
        public int? PageCount { get; set; }
        public int? RecordCount { get; set; }
    }
}
