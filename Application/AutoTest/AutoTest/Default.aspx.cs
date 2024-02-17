using AutoTest.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AutoTest
{
    public partial class Default : System.Web.UI.Page
    {
        public class StructData
        {
            public string IP { get; set; }
            public string Command { get; set; }
            public string Value { get; set; }
            public bool Online { get; set; }
        }

        [WebMethod]
        public static StructData Execute(StructData inputdata)
        {
            StructData outputdata = new StructData();

            outputdata.Online = false;
            try
            {
                System.Net.Sockets.TcpClient client = new System.Net.Sockets.TcpClient(inputdata.IP, 123);
                if (client.Connected) {
                    outputdata.Online = true;
                    NetworkStream stream = client.GetStream();

                    byte[] messageBytes = Encoding.ASCII.GetBytes("123");
                    stream.Write(messageBytes, 0, messageBytes.Length); // Write the bytes  

                    messageBytes = new byte[32];
                    // Receive the stream of bytes  
                    stream.Read(messageBytes, 0, messageBytes.Length);

                    stream.Dispose();
                    client.Close();
                }                
            }
            catch (Exception er) // Catch exceptions  
            {
                Console.WriteLine(er.Message);
            }

            return outputdata; // Example response
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            //Service1Client client = new Service1Client();
            //string name = client.Execute("Aloo");
        }
    }
}