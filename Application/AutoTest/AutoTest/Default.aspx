<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AutoTest.Default" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAA Cloud Software for Automated Testing</title>
    <link rel="stylesheet" type="text/css" href="Style/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
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
    <input type="text" id="ipInput" placeholder="Enter IP Address...">
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

<script type="text/javascript" src="Script/main.js"></script>

<script type="text/javascript">

    /*
    Execute('192.168.70.220', 'Link', '').then(function (response) {
        alert("Message: " + response.Online);
    });
    */


	//alert(Execute('192.168.70.220', 'Link', '').Online);

    addNew("192.168.70.220");
    addNew("11.11.11.11");
    addNew("22.22.22.22");
    addNew("33.33.33.33");
    addNew("44.44.44.44");

</script>

</body>
</html>
