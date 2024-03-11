<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AutoTest.Default" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>SAA Cloud Software for Automated Testing</title>
    <link rel="stylesheet" type="text/css" href="Style/main.css?t=14"/>
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
    <ul id="serial-list">
        <%
            GetSerials().ForEach(serial =>
            {
                Response.Write("<li onClick='selectSerial(this.innerHTML);'>" + serial.ToString() + "</li>");
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
    <h1>Dashboard</h1>
    <p>Current hardware being tested :</p>
</div>

<!-- Settings page -->
<div class="container" id="page-settings" style="display: none;">
    <!-- Content for Settings page -->
    <h1>Settings</h1>
    <p>This is the Settings page content.</p>
</div>

<div id='printable_div_id' style="display: none;">
	<div id="printable_div_id_SN_Value">SN:0000000000</div>		
	<div id="printable_div_id_ERR_Value">Err:0</div>
</div>

<script type="text/javascript" src="Script/main.js?t=16"></script>

<script type="text/javascript">
    addNew("192.168.70.201");
    addNew("192.168.70.202");
</script>

</body>
</html>
