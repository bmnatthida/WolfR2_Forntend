using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WolfR2.Models
{
    public class DataTableFilterModel
    {
        public ItemModel?[] items { get; set; }
        public string FavoritesItem { get; set; }
    }
    public class ItemModel
    {
        public DropdownModel dropdown { get; set; }
        public string[] value { get; set; }
    }
    public class DropdownModel
    {
        public string name { get; set; }
        public string type { get; set; }
        public string? format { get; set; }
    }
}
