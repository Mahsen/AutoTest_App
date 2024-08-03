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
using System.Security.Cryptography;
using System.IO;
using System.Threading.Tasks;
using System.Web.Services.Description;
using Newtonsoft.Json;
using System.Net;
using Newtonsoft.Json.Linq;

namespace AutoTest
{
    public partial class Default : System.Web.UI.Page
    {

        static AutoTestEntities3 DataContext;

        public class PacketTester
        {
            public string Command { get; set; }
            public string Data { get; set; }
        }

        public class StructData
        {
            public string IP { get; set; }
            public string Serial { get; set; }
            public string Command { get; set; }
            public string Value { get; set; }
            public bool Online { get; set; }
            public int TimeOut { get; set; }
        }

        [WebMethod]
        public static StructData Execute(StructData inputdata)
        {
            StructData outputdata = new StructData();

            if (inputdata.Command == "CheckSerial")
            {
                outputdata.Value = CheckSerial(inputdata.Value);
                return outputdata;
            }
            else if (inputdata.Command == "SaveReport") {
                outputdata.Value = SaveReport(inputdata.Serial, inputdata.Value);
                return outputdata;
            } 
            else if (inputdata.Command == "AddTester") {
                outputdata.Value = AddTester(inputdata.Value);
                return outputdata;
            }
            else if (inputdata.Command == "RemoveTester")
            {
                outputdata.Value = RemoveTester(inputdata.Value);
                return outputdata;
            }
            else if (inputdata.Command == "SendUpdateProgram")
            {
                outputdata.Value = SendUpdateProgram(inputdata);
                return outputdata;
            }

            // Create a new TcpClient
            System.Net.Sockets.TcpClient client = new System.Net.Sockets.TcpClient();

            outputdata.Online = false;
            try
            {
                // Set a timeout for connecting
                int timeoutMilliseconds = inputdata.TimeOut; 
                IAsyncResult result = client.BeginConnect(inputdata.IP.Split(':')[0], int.Parse(inputdata.IP.Split(':')[1]), null, null);
                // Wait for the connection to complete or timeout
                bool success = result.AsyncWaitHandle.WaitOne(timeoutMilliseconds, true);

                if (success)
                {
                    // Connection was successful
                    client.EndConnect(result);

                    // Perform operations with the TcpClient
                    NetworkStream stream = client.GetStream();

                    PacketTester Tester_Packet = new PacketTester()
                    {
                        Command = inputdata.Command,
                        Data = inputdata.Value
                    };
                    var customerJson = JsonConvert.SerializeObject(Tester_Packet);

                    byte[] messageBytes = Encoding.ASCII.GetBytes(customerJson);
                    stream.Write(messageBytes, 0, messageBytes.Length); // Write the bytes  

                    for (int TimeOut = 0; ((TimeOut < (inputdata.TimeOut / 1000)) && (!stream.DataAvailable)); TimeOut++)
                    {
                        Thread.Sleep(1000);
                    }
                    messageBytes = new byte[1024];
                    // Receive the stream of bytes  
                    stream.Read(messageBytes, 0, messageBytes.Length);
                    string message = Encoding.UTF8.GetString(messageBytes);
                    outputdata.Value = "";
                    if (message.Length!=0) {
                        //PacketTester deptObj = JsonSerializer.Deserialize<PacketTester>(message);
                        JObject Tester_Packet_Respond = JObject.Parse(message);
                        outputdata.Online = true;
                        outputdata.Value = (string)Tester_Packet_Respond["Data"];
                        outputdata.Command = (string)Tester_Packet_Respond["Command"];
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

            this.btnUpload.Click += new System.EventHandler(this.btnUpload_Click);
            this.Load += new System.EventHandler(this.Page_Load);
        }

        static public String CheckSerial(String Serial)
        {
            try
            {
                AutoTestEntities3 DataContext_l = new AutoTestEntities3();
                Device Tester_l = DataContext_l.Device.Where(d => d.Serial == Serial).First();
                return Tester_l.Report;
            }
            catch (Exception er)
            {
                return ("ERROR: " + er.Message);
            }
        }

        public List<String> GetSerials()
        {
            
            List<String> Serials = new List<String>();
            try
            {
                DataContext.Device.ToList().ForEach(device =>
                {
                    Serials.Add(device.Serial.ToString());
                });
            } 
            catch (Exception ex)
            {

            }
            return Serials;
        }

        static String RemoveTester(String ip)
        {
            try
            {
                String IP = ip.Split(':')[0];
                int Port = int.Parse(ip.Split(':')[1]);
                
                Tester Tester_l = DataContext.Tester.Where(tester => tester.IP == IP && tester.Port == Port).First();
                DataContext.Tester.Remove(Tester_l);
                DataContext.SaveChanges();
                return "OK";
            }
            catch (Exception er)
            {
                return ("ERROR: " + er.Message);
            }
        }

        static String AddTester(String ip) {
            if(ip=="")
            {
                return ("ERROR");
            }
            try {
                bool Repeated = false;
                int NumberOfTester = 0;
                Tester Tester_l = new Tester();

                DataContext.Tester.ToList().ForEach(tester => {
                    NumberOfTester++;
                    if (tester.IP == ip) {
                        Repeated = true;
                    }                    
                });
                if(Repeated) {
                    return "ERROR";
                }
                NumberOfTester++;
                
                Tester_l.ID = NumberOfTester;
                Tester_l.IP = ip.Split(':')[0];
                Tester_l.Port = int.Parse(ip.Split(':')[1]);
                Tester_l.Name = "Tester-"+(NumberOfTester).ToString();
                DataContext.Tester.Add(Tester_l);
                DataContext.SaveChanges();
                return "OK";
            }
            catch (Exception er) {
                return ("ERROR: " + er.Message);
            }
        }

        public List<String> GetTester()
        {
            List<String> IPs = new List<String>();

            try
            {                

                DataContext.Tester.ToList().ForEach(device =>
                {
                    IPs.Add(device.IP.ToString()+":"+device.Port.ToString());
                });
            }
            catch(Exception er)
            {

            }
            return IPs;
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

        static String SendUpdateProgram(StructData Data)
        {
            String filename = Data.Value;
            byte[] bytes = new byte[512];
            int Offset = 0;       
            filename = AppDomain.CurrentDomain.BaseDirectory + "DirectProgram.bin";
            try
            {
                Data.Command = "UpdateProgram";
                using (FileStream read = new FileStream(filename, FileMode.Open, FileAccess.Read))
                {
                    while (read.Read(bytes, 0, 256) != 0)
                    {
                        StringBuilder line = new StringBuilder();
                        line.Append(Offset + "-");
                        line.Append(256 + ":");
                        line.Append(string.Join("", bytes.Select(b => b.ToString("x2"))));
                        Offset += 256;
                        Data.Value = line.ToString();

                        if (Execute(Data).Value != "OK")
                        {
                            return "Fail";
                        }
                    }
                }

                return "OK";
            }
            catch (Exception er)
            {
                return ("ERROR: " + er.Message);
            }
        }

        private void btnUpload_Click(object sender, System.EventArgs e)
        {
            string strFileName;
            string strFilePath;
            string strFolder;
            strFolder = Server.MapPath("./");
            // Get the name of the file that is posted.
            strFileName = oFile.PostedFile.FileName;
            strFileName = Path.GetFileName(strFileName);
            if (oFile.Value != "")
            {
                // Create the directory if it does not exist.
                if (!Directory.Exists(strFolder))
                {
                    Directory.CreateDirectory(strFolder);
                }
                // Save the uploaded file to the server.
                strFilePath = strFolder + strFileName;
                    oFile.PostedFile.SaveAs(strFilePath);

                    using (StreamReader read = new StreamReader(strFilePath))
                    {
                        string line;
                        int count = 1;

                        DataContext.Device.Where(device => device.ID != 0).ToList().ForEach(device_s => {
                            DataContext.Device.Remove(device_s);
                        }); 
                        DataContext.SaveChanges();

                        while ((line = read.ReadLine()) != null)
                        {
                            Device Device_l = new Device();
                            Device_l.ID = count++;
                            Device_l.Serial = line;
                            Device_l.Report = "";
                            DataContext.Device.Add(Device_l);                            
                        }
                        DataContext.SaveChanges();
                    }

                    lblUploadResult.Text = strFileName + " has been successfully uploaded.";
            }
            else
            {
                lblUploadResult.Text = "Click 'Browse' to select the file to upload.";
            }
            // Display the result of the upload.
            frmConfirmation.Visible = true;
        }

    }
}