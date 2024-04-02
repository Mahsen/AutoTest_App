using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AutoTest
{
    public partial class Report : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public List<String> GetParameters()
        {
            String Serial = Request.Params["Serial"];
            List<string> Parameters = Default.CheckSerial(Serial).Split(';').ToList();

            return Parameters;
        }
    }
}