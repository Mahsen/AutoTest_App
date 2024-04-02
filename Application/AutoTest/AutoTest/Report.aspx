<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Report.aspx.cs" Inherits="AutoTest.Report" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .certificate {
            width: 800px;
            margin: 50px auto;
            border: 2px solid #5e5e5e;
            border-radius: 20px;
            padding: 30px;
            background-color: #ffffff;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        .subtitle {
            font-size: 18px;
            margin-bottom: 20px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
            color: #333;
        }
        td {
            background-color: #ffffff;
        }
        .shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3));
            transform: rotate(45deg);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .certificate:hover .shine {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="title">Certificate of SAA AutoTest</div>
            <div class="subtitle">This is to certify that</div>
        </div>
        <table>
            <tr>
                <th colspan="2">Report</th>
            </tr>
            <%
                bool Passed = true;
                try
                {
                    GetParameters().ForEach(Parameter =>
                    {
                        if((Parameter.IndexOf("ERROR") != -1) || (Parameter.IndexOf("Error") != -1) || (Parameter.IndexOf("error") != -1))
                        {
                            Passed = false;
                        }
                        Response.Write("<tr><td>" + Parameter.Split('=')[0] + ":</td><td>" + Parameter.Split('=')[1] + "</td></tr>");
                    });
                }
                catch (Exception er)
                {
                    Passed = false;
                    Response.Write("<tr><td>Error:</td><td>" + er.Message + "</td></tr>");
                }
            %>         
        </table>
        <div class="header">
            <div class="subtitle">has <% if (Passed) { Response.Write("<span style='color:green;'>successfully</span> completed"); } else {Response.Write("<span style='color:red;'>failed</span>"); } %> the course on</div>
            <div class="title">TM100 with serial <% Response.Write(Request.Params["Serial"]); %></div>
        </div>
        <div class="shine"></div>
    </div>
</body>
</html>

