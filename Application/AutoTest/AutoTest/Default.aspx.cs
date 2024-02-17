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
                // Create a new TcpClient
                System.Net.Sockets.TcpClient client = new System.Net.Sockets.TcpClient();

                // Set a timeout for connecting
                int timeoutMilliseconds = 2000; 
                IAsyncResult result = client.BeginConnect(inputdata.IP, 123, null, null);
                // Wait for the connection to complete or timeout
                bool success = result.AsyncWaitHandle.WaitOne(timeoutMilliseconds, true);

                if (success)
                {
                    // Connection was successful
                    client.EndConnect(result);

                    outputdata.Online = true;

                    // Perform operations with the TcpClient
                    NetworkStream stream = client.GetStream();

                    byte[] messageBytes = Encoding.ASCII.GetBytes("<" + inputdata.Command + ">" + inputdata.Value+ "</" + inputdata.Command + ">\r\n");
                    stream.Write(messageBytes, 0, messageBytes.Length); // Write the bytes  

                    messageBytes = new byte[512];
                    // Receive the stream of bytes  
                    stream.Read(messageBytes, 0, messageBytes.Length);
                    string message = Encoding.UTF8.GetString(messageBytes);
                    outputdata.Value = "";
                    if ((message.IndexOf(">") != -1) && (message.IndexOf("</")!=-1))
                    {
                        outputdata.Value = message.Substring((message.IndexOf(">")+1), (message.IndexOf("</")-(message.IndexOf(">") + 1)));
                    }

                    stream.Dispose();
                    client.Close();

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
            catch (SocketException ex)
            {
                // Handle socket errors
                Console.WriteLine($"SocketException: {ex.SocketErrorCode}");
            }
            catch (TimeoutException ex)
            {
                // Handle timeout errors
                Console.WriteLine($"TimeoutException: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                Console.WriteLine($"Exception: {ex.Message}");
            }


            /*
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
            */
            return outputdata; // Example response
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            //Service1Client client = new Service1Client();
            //string name = client.Execute("Aloo");
        }
    }
}