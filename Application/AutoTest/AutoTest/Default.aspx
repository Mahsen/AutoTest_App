<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AutoTest.Default" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SAA Cloud Software for Automated Testing</title>
    <link rel="stylesheet" type="text/css" href="Style/main.css?t=27"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
<nav class="navbar">
    <div class="logo">SAA AutoTest</div>
    <ul class="menu">
        <!-- Setting icon -->
        <li class="settings-icon"><a href="#" onclick="toggleSettings()"><i class="fas fa-cog"></i></a></li>
    </ul>
</nav>

<!-- Panel on the right side of the page for displaying serials -->
<div id="serial-panel">
    <div id="toggle-panel-button" class="toggle-panel-button">
        <i id="toggle-icon" class="fas fa-chevron-left"></i>  
        <span class="serial-text">Select your  serial of list</span>
    </div> <!-- Icon to toggle panel visibility -->    
    <h2>Serials</h2>
    <div id="serial-sel">>>><input type="text" id="Serial_Focus" value="!Serial" onchange="SearchSerial(this.value)" /><<<</div>
    <ul id="serial-list">
        <%
            GetSerials().ForEach(serial =>
            {
                Response.Write("<li id='li_" + serial.ToString() + "' onClick='selectSerial(this.innerHTML);'>" + serial.ToString() + "</li>");
            });
        %>
    </ul>
</div>


<!-- New menu with multi-tabs -->
<nav class="bottom-menu">
    <ul class="multi-tabs">
        <li><a href="#" onclick="showPage('dashboard')">Dashboard</a></li>

    </ul>
    <div class="add-member"><a href="#" onclick="openModal()"> <i class="fas fa-plus"></i></a></div>
</nav>

<!-- Modal -->
<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeModal()">&times;</span>
    <h2>Enter IP Address</h2>
    <input type="text" id="ipInput" placeholder="Enter IP Address..."/>
    <span id="ipError" style="color: red; display: none;">Invalid IP Address</span>
    <button onclick="addNew()">Add</button>
  </div>
</div>

<!-- Dashboard page -->
<div class="container" id="page-dashboard">
    <!-- Content for Dashboard page -->
    <div><h1>Dashboard</h1><h4 style="position:absolute; margin-top:-20px">Current hardware being tested :</h4></div>
</div>

<!-- Settings page -->
<div class="container" id="page-settings" style="display: none;">
    <!-- Content for Settings page -->
    <h1>Settings</h1>
    <p>This is the Settings page content.</p>
    <br />
    <p>
        Check test by serial
        <div>Serial: <input type="text" id="checkserial" /><button class='lightblue' onclick="Control_OnClick_Check_Serial(document.getElementById('checkserial').value)">Check</button></div>
    </p>
    <br />
    <p>
        Upload text file of serials split by newline in there to gnerate list
        <form id="Form1" method="post" runat="server" EncType="multipart/form-data" action="Default.aspx">
         Upload to the server: <INPUT id="oFile" type="file" runat="server" accept=".txt"  NAME="oFile">
         <asp:button id="btnUpload" type="submit" text="Upload" accept=".txt" runat="server" class='lightblue'></asp:button>
         <asp:Panel ID="frmConfirmation" Visible="False" Runat="server">
            <asp:Label id="lblUploadResult" Runat="server"></asp:Label>
         </asp:Panel>
      </form>
    </p>
    <br />
    <p>
        List of devices
        <%
        GetTester().ForEach(ip =>
        {
            Response.Write("<div>IP : " + ip.ToString() + " <button class='lightred' onclick='Control_OnClick_Delete_Device(\"" + ip.ToString() + "\")'>Delete</button><!--<button class='lightblue' onclick='SendUpdateProgram(\"" + ip.ToString() + "\")'>Update</button>--></div>");
        });
        %>
    </p>


</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"></script>
<canvas id="barcode" style="display: none;"></canvas>
	
<div id='printable_div_id' style="display: none;">
	<img id="printable_div_id_SN_Img" style="margin-top:-25px" />
    <!--<div id="printable_div_id_ERR_Value" style="font-size: 8px; margin-top:-8px; text-align: center;">Err:0</div>-->
</div>

<script type="text/javascript" src="Script/main.js?t=45"></script>

<script type="text/javascript">
    <%
    GetTester().ForEach(ip =>
    {
        Response.Write("addNew('" + ip.ToString() + "');");
    });
    %>

    async function AJAXSubmit (oFormElement) {
        var resultElement = oFormElement.elements.namedItem("result");
        const formData = new FormData(oFormElement);

        try {
        const response = await fetch(oFormElement.action, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          window.location.href = '/';
        }

        resultElement.value = 'Result: ' + response.status + ' ' + 
          response.statusText;
        } catch (error) {
          console.error('Error:', error);
        }
    }

    function SearchSerial(SerialFocus) {
        var serial_find = "";
        var serial_list_html = document.getElementById('serial-list').innerHTML.split("<");
        for (var i = 0; i < serial_list_html.length; i++) {
            if (i % 2) {
                var ser = serial_list_html[i].split(">")[1];
                if (ser.indexOf(SerialFocus)!=-1) {
                    serial_find = ser;
                    break;
                }
            }            
        }
        if (serial_find!="") {
            document.getElementById('li_' + serial_find).focus();
            document.getElementById('Serial_Focus').value = serial_find;
            selectSerial(serial_find);
        }
    }
    function SendUpdateProgram(ipAddress) {
        alert("Do not turn off the system until the work is finished!");
        Execute(ipAddress, 'SendUpdateProgram', '').then(function (response) {
            alert(response.Value);
        });
    }
</script>
<div class="footer" style="background-color: #333; color: #fff;"> v1.14030305</div>
</body>
</html>
