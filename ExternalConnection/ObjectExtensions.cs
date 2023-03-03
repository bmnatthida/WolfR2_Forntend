using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace WolfR2.ExternalConnection
{
    public static class ObjectExtensions
    {
        public static string ToJson(this object obj)
        {
            //JsonSerializer serializer = new JsonSerializer();
            //serializer.Converters.Add(new JavaScriptDateTimeConverter());
            //serializer.NullValueHandling = NullValueHandling.Ignore;

            return JsonConvert.SerializeObject(obj);
        }
        public static string ToJson(this DataTable dt)
        {

            var st = JsonConvert.SerializeObject(dt, Formatting.Indented);
            return st;

        }

        public static List<T> ToListData<T>(this DataTable dt)
        {
            var dtJson = dt.ToJson();
            return dtJson.ToArrayObject<T>();

        }

        public static T ToObject<T>(this string strJson)
        {
            var jsonSerializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
            var objJson = JsonConvert.DeserializeObject<T>(strJson, jsonSerializerSettings);

            return objJson;
        }
        public static List<T> ToArrayObject<T>(this string strJson)
        {
            var jsonSerializerSettings = new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() };
            var objJson = JsonConvert.DeserializeObject<List<T>>(strJson, jsonSerializerSettings);

            return objJson;
        }

        public static string ToReplaceNullOrWhiteSpace(this string str)
        {
            string rtString = "";

            if (!string.IsNullOrWhiteSpace(str))
            {
                rtString = str;
            }

            return rtString;
        }

        public static string ToDecodeBase64(this string str)
        {
            string rtString = "";

            if (!string.IsNullOrWhiteSpace(str))
            {
                byte[] data = Convert.FromBase64String(str);
                string decodedString = Encoding.UTF8.GetString(data);
                rtString = decodedString;
            }

            return rtString;
        }

        public static string ToEncodeBase64(this string str)
        {
            string rtString = "";

            if (!string.IsNullOrWhiteSpace(str))
            {
                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(str);
                string encodedString = System.Convert.ToBase64String(plainTextBytes);
                rtString = encodedString;
            }

            return rtString;
        }

        public static bool IsJArray(this JToken item)
        {
            bool tf = false;
            try
            {
                var getItem = JArray.Parse(item.ToString());
                tf = true;
            }
            catch { }
            return tf;
        }
        public static bool IsJArray(this string item)
        {
            bool tf = false;
            try
            {
                var getItem = JArray.Parse(item);
                tf = true;
            }
            catch { }
            return tf;
        }
        public static JArray ToJArray(this JToken item)
        {
            JArray getItem = null;
            try
            {
                getItem = JArray.Parse(item.ToString());

            }
            catch { }

            return getItem;
        }
        public static JArray ToJArray(this string item)
        {
            JArray getItem = null;
            try
            {
                getItem = JArray.Parse(item);

            }
            catch { }

            return getItem;
        }

        public static bool IsValueInJArray(this JArray items, string key, string valueCondition)
        {
            bool tf = false;
            try
            {
                foreach (JObject item in items)
                {
                    if (item[key].ToString() == valueCondition)
                        tf = true;
                }


            }
            catch { }
            return tf;
        }

        public static bool IsJObject(this JToken item)
        {
            bool tf = false;
            try
            {
                var getItem = JObject.Parse(item.ToString());
                tf = true;
            }
            catch { }
            return tf;
        }
        public static bool IsJObject(this string item)
        {
            bool tf = false;
            try
            {
                var getItem = JObject.Parse(item);
                tf = true;
            }
            catch { }
            return tf;
        }
        public static JObject ToJObject(this JToken item)
        {
            JObject getItem = null;
            try
            {
                getItem = JObject.Parse(item.ToString());

            }
            catch { }

            return getItem;
        }
        public static JObject ToJObject(this string item)
        {
            JObject getItem = null;
            try
            {
                getItem = JObject.Parse(item);

            }
            catch { }

            return getItem;
        }
        public static string GetJObject(this JObject item, string key)
        {
            string getItem = "";
            try
            {
                foreach (KeyValuePair<string, JToken> sub_obj in item)
                {
                    if (sub_obj.Key.ToLower() == key.ToLower())
                    {
                        getItem = sub_obj.Value.ToString();
                        break;
                    }
                }

            }
            catch { }

            return getItem;
        }

        public static bool IsJObjectKey(this JObject item, string key)
        {
            bool getItem = false;
            try
            {

                foreach (KeyValuePair<string, JToken> sub_obj in item)
                {
                    if (sub_obj.Key.ToLower() == key.ToLower())
                    {
                        getItem = true;
                        break;
                    }
                }
            }
            catch { }

            return getItem;
        }




        public static string ToNullString(this string str)
        {
            string rtString = "";

            if (!string.IsNullOrWhiteSpace(str))
            {
                rtString = str;
            }

            return rtString;
        }
        public static bool IsNull(this string str)
        {
            return string.IsNullOrWhiteSpace(str);
        }
        public static bool IsNotNull(this string str)
        {
            return !string.IsNullOrWhiteSpace(str);
        }
    }
}
