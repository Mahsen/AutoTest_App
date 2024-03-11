using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Linq;
using System.Net.Sockets;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Threading;
using System.Runtime.Remoting.Contexts;
using System.Data;
using System.Web.DynamicData.ModelProviders;

namespace AutoTest
{
    public partial class Default : System.Web.UI.Page
    {
        //static AutoTestDataContext DataContext;
        static AutoTestEntities3 DataContext;

        public class StructData
        {
            public string IP { get; set; }
            public string Serial { get; set; }
            public string Command { get; set; }
            public string Value { get; set; }
            public bool Online { get; set; }
        }

        [WebMethod]
        public static StructData Execute(StructData inputdata)
        {
            StructData outputdata = new StructData();

            if(inputdata.Command == "SaveReport") {
                outputdata.Value = SaveReport(inputdata.Serial, inputdata.Value);
                return outputdata;
            }

            // Create a new TcpClient
            System.Net.Sockets.TcpClient client = new System.Net.Sockets.TcpClient();

            outputdata.Online = false;
            try
            {
                // Set a timeout for connecting
                int timeoutMilliseconds = 5000; 
                IAsyncResult result = client.BeginConnect(inputdata.IP, 123, null, null);
                // Wait for the connection to complete or timeout
                bool success = result.AsyncWaitHandle.WaitOne(timeoutMilliseconds, true);

                if (success)
                {
                    // Connection was successful
                    client.EndConnect(result);

                    // Perform operations with the TcpClient
                    NetworkStream stream = client.GetStream();

                    byte[] messageBytes = Encoding.ASCII.GetBytes("<AUTOTEST:" + inputdata.Command + ">" + inputdata.Value+ "</AUTOTEST>\r\n");
                    stream.Write(messageBytes, 0, messageBytes.Length); // Write the bytes  

                    for(int TimeOut=0; ((TimeOut<5) && (!stream.DataAvailable)); TimeOut++)
                    {
                        Thread.Sleep(1000);
                    }
                    messageBytes = new byte[1024];
                    // Receive the stream of bytes  
                    stream.Read(messageBytes, 0, messageBytes.Length);
                    string message = Encoding.UTF8.GetString(messageBytes);
                    outputdata.Value = "";
                    if ((message.IndexOf(">") != -1) && (message.IndexOf("</")!=-1))
                    {
                        outputdata.Value = message.Substring((message.IndexOf(">")+1), (message.IndexOf("</")-(message.IndexOf(">") + 1)));
                        outputdata.Online = true;
                    }

                    stream.Dispose();

                    // Close the connection
                    client.Close();
                }
                else
                {
                    // Connection timed out
                    client.Close(); // Close the client
                    throw new TimeoutException("Connection timed out.");
                }
            }
            catch (Exception ex)
            {
                // Handle socket errors
                client.Close(); // Close the client
                Console.WriteLine($"SocketException: {ex.Message}");
            }

            return outputdata;
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            DataContext = new AutoTestEntities3();
        }

        public List<String> GetSerials()
        {
            
            List<String> Serials = new List<String>();

            DataContext.Device.ToList().ForEach(device =>
            {
                Serials.Add(device.Serial.ToString());
            });
            return Serials;
        }

        static String SaveReport(String Serial, String Report)
        {
            try
            {
                DataContext.Device.Where(x => x.Serial == Serial).ToList().ForEach(w => w.Report = Report);
                DataContext.SaveChanges();
                return "OK";
            }
            catch (Exception er)
            {
                return ("ERROR: " + er.Message);
            }
        }

    }
}