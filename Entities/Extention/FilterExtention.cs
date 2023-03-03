using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WolfR2.Models;

namespace WolfR2.Entities.Extention
{
    static class FilterExtention
    {
        public static DataTable FilterDatatable(DataTableFilterModel FilterItem, DataTable Dt)
        {
            List<string> searchText = new List<string>();
            for (int i = 0; i < FilterItem.items.Length; i++)
            {
                switch (FilterItem.items[i].dropdown.type)
                {
                    case "string":
                        searchText.Add("" + FilterItem.items[i].dropdown.name + " like '%" + FilterItem.items[i].value[0].ToString().ToLower() + "%'");
                        break;
                    case "date":
                        if (FilterItem.items[i].dropdown.name.Contains(" ") == true)
                            FilterItem.items[i].dropdown.name = FilterItem.items[i].dropdown.name.Replace(" ", "");

                        Dt.ConvertColumnType(FilterItem.items[i].dropdown.name, typeof(DateTime));

                        DateTime dateFrom, dateTo;

                        dateFrom = DateTimeOffset.Parse(FilterItem.items[i].value[0]).DateTime;
                        dateTo = DateTimeOffset.Parse(FilterItem.items[i].value[1]).DateTime;
                        searchText.Add(FilterItem.items[i].dropdown.name + " >= '" + dateFrom + "' and " + FilterItem.items[i].dropdown.name + " <= '" + dateTo + "'");
                        break;
                }
            }
            Dt.CaseSensitive = false;
            DataRow[] filteredRows = Dt.Select(String.Join(" and ", searchText));
            DataTable dt2 = filteredRows.CopyToDataTable();
            return dt2;
        }
        static DataTable ToDataTable(JArray jArray)
        {
            var result = new DataTable();
            //Initialize the columns, If you know the row type, replace this   
            foreach (var row in jArray)
            {
                foreach (var jToken in row)
                {
                    var jproperty = jToken as JProperty;
                    if (jproperty == null) continue;
                    if (result.Columns[jproperty.Name] == null)
                        result.Columns.Add(jproperty.Name, typeof(string));
                }
            }
            foreach (var row in jArray)
            {
                var datarow = result.NewRow();
                foreach (var jToken in row)
                {
                    var jProperty = jToken as JProperty;
                    if (jProperty == null) continue;
                    datarow[jProperty.Name] = jProperty.Value.ToString();
                }
                result.Rows.Add(datarow);
            }
            foreach (DataColumn dcl in result.Columns)
            {
                if (dcl.ColumnName.Contains(" "))
                {
                    dcl.ColumnName = dcl.ColumnName.Replace(" ", "");
                }
            }
            return result;
        }
        public static void ConvertColumnType(this DataTable dt, string columnName, Type newType)
        {
            using (DataColumn dc = new DataColumn(columnName + "_new", newType))
            {
                // Add the new column which has the new type, and move it to the ordinal of the old column
                int ordinal = dt.Columns[columnName].Ordinal;
                dt.Columns.Add(dc);
                dc.SetOrdinal(ordinal);

                // Get and convert the values of the old column, and insert them into the new
                foreach (DataRow dr in dt.Rows)
                {
                    object value = dr[columnName];
                    if (value.ToString() != "")
                        dr[dc.ColumnName] = Convert.ChangeType(dr[columnName], newType);
                }

                // Remove the old column
                dt.Columns.Remove(columnName);

                // Give the new column the old column's name
                dc.ColumnName = columnName;
            }
        }
        public static void ConvertColumnTypeToDateTime(this DataTable dt, string columnName)
        {
            Type newType = typeof(DateTime);
            using (DataColumn dc = new DataColumn(columnName + "_new", newType))
            {
                // Add the new column which has the new type, and move it to the ordinal of the old column
                int ordinal = dt.Columns[columnName].Ordinal;
                dt.Columns.Add(dc);
                dc.SetOrdinal(ordinal);

                // Get and convert the values of the old column, and insert them into the new
                foreach (DataRow dr in dt.Rows)
                {
                    object value = dr[columnName];
                    if (value.ToString() != "")
                        dr[dc.ColumnName] = Convert.ChangeType(dr[columnName], newType);
                }

                // Remove the old column
                dt.Columns.Remove(columnName);

                // Give the new column the old column's name
                dc.ColumnName = columnName;
            }
        }
    }
}
