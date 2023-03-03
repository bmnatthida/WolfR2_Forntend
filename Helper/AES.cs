using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace WolfR2.Helper
{
    public class  AESCipher
    {
        private string Key { get; set; }
        private string KeyIV { get; set; }
        public AESCipher()
        {
            try
            {
             
                this.Key = "rPTiDEWolforthmU";
                this.KeyIV = "rWTechWolfcomhmU";
                this.function = new Cipher(CipherMode.CBC, PaddingMode.PKCS7, Key, 128, KeyIV);
            }
            catch
            {

            }
        }

        public Cipher function { get; set; }
    }
    public class Cipher
    {
        private RijndaelManaged _rijndael;
        private MemoryStream _stream;
        private CryptoStream _cryptoStream;
        private StreamWriter _writer;
        private StreamReader _reader;

        public byte[] Key { get { return _rijndael.Key; } }
        public byte[] IV { get { return _rijndael.IV; } }
        public Cipher(CipherMode mode, PaddingMode padding, string key, int blockSize, string IV = "")
        {
            _rijndael = new RijndaelManaged()
            {
                Mode = mode,
                Padding = padding,
                Key = Encoding.UTF8.GetBytes(key),
                BlockSize = blockSize
            };
            _rijndael.Mode = mode;
            _rijndael.Padding = padding;
            _rijndael.Key = Encoding.UTF8.GetBytes(key);
            _rijndael.BlockSize = blockSize;
            //.FeedbackSize = blockSize;
            if (!IV.Equals(""))
                _rijndael.IV = Encoding.UTF8.GetBytes(IV);
        }
        public byte[] Encrypt(string plainText)
        {
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");

            ICryptoTransform encryptor = _rijndael.CreateEncryptor(_rijndael.Key, _rijndael.IV);
            _stream = new MemoryStream();
            _cryptoStream = new CryptoStream(_stream, encryptor, CryptoStreamMode.Write);
            _writer = new StreamWriter(_cryptoStream);
            _writer.Write(plainText);
            _writer.Dispose();
            _cryptoStream.Dispose();
            _stream.Dispose();


            return _stream.ToArray();
        }
        public string Encryptstring(string plainText)
        {
            byte[] stremaArray = this.Encrypt(plainText);
            return this.ByteArrayToString(stremaArray);
            //return Encoding.UTF8.GetString(_stream.ToArray()); //(_stream.ToArray());
        }

        public string Encryptstring(string plainText, bool EncryptBase64 = false)
        {
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");

            ICryptoTransform encryptor = _rijndael.CreateEncryptor(_rijndael.Key, _rijndael.IV);
            _stream = new MemoryStream();
            _cryptoStream = new CryptoStream(_stream, encryptor, CryptoStreamMode.Write);
            _writer = new StreamWriter(_cryptoStream);
            _writer.Write(plainText);
            _writer.Dispose();
            _cryptoStream.Dispose();
            _stream.Dispose();

            string val = ByteArrayToString(_stream.ToArray());
            if (EncryptBase64) val = Base64.EncodeBase64(Encoding.UTF8, val);
            return val;
        }

        public string Decrypt(byte[] cipherText)
        {
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            string decrypted;
            ICryptoTransform decryptor = _rijndael.CreateDecryptor(_rijndael.Key, _rijndael.IV);
            _stream = new MemoryStream(cipherText);
            _cryptoStream = new CryptoStream(_stream, decryptor, CryptoStreamMode.Read);
            _reader = new StreamReader(_cryptoStream);
            decrypted = _reader.ReadToEnd();
            _reader.Dispose();
            _cryptoStream.Dispose();
            _stream.Dispose();

            return decrypted;
        }
        public string Decrypt(string cText)
        {
            if (string.IsNullOrWhiteSpace(cText))
                throw new ArgumentNullException("cipherText");
            string decrypted;
            //byte[] cipherText = Encoding.UTF8.GetBytes(cText);
            byte[] cipherText = this.StringToByteArray(cText);
            ICryptoTransform decryptor = _rijndael.CreateDecryptor(_rijndael.Key, _rijndael.IV);
            _stream = new MemoryStream(cipherText);
            _cryptoStream = new CryptoStream(_stream, decryptor, CryptoStreamMode.Read);
            _reader = new StreamReader(_cryptoStream);
            decrypted = _reader.ReadToEnd();
            _reader.Dispose();
            _cryptoStream.Dispose();
            _stream.Dispose();

            return decrypted;
        }
        public string Decrypt(string ctext, bool DecryptBase64 = false)
        {

            if (DecryptBase64) ctext = Base64.DecodeBase64(Encoding.UTF8, ctext);
            if (ctext == string.Empty || ctext == null)
                return ctext;
            byte[] cipherText = this.StringToByteArray(ctext);
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            string decrypted;
            ICryptoTransform decryptor = _rijndael.CreateDecryptor(_rijndael.Key, _rijndael.IV);
            _stream = new MemoryStream(cipherText);
            _cryptoStream = new CryptoStream(_stream, decryptor, CryptoStreamMode.Read);
            _reader = new StreamReader(_cryptoStream);
            decrypted = _reader.ReadToEnd();
            _reader.Dispose();
            _cryptoStream.Dispose();
            _stream.Dispose();

            return decrypted;
        }

        public string ByteArrayToString(byte[] ba)
        {
            StringBuilder hex = new StringBuilder(ba.Length * 2);
            foreach (byte b in ba)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }

        public byte[] StringToByteArray(string hex)
        {
            return Enumerable.Range(0, hex.Length)
                             .Where(x => x % 2 == 0)
                             .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
                             .ToArray();
        }



    }
     public static class Base64
    {
        public static string EncodeBase64(Encoding encoding, string text)
        {
            if (text == null)
            {
                return null;
            }

            byte[] textAsBytes = encoding.GetBytes(text);
            return System.Convert.ToBase64String(textAsBytes);
        }

        public static string DecodeBase64(Encoding encoding, string encodedText)
        {
            if (encodedText == null)
            {
                return null;
            }

            byte[] textAsBytes = System.Convert.FromBase64String(encodedText);
            return encoding.GetString(textAsBytes);
        }
    }
}