// Default parameters
var Default_Refresh_Tasks = 1200;
// IPs
const IPs = [];
// Same IPs
const SameIPs = [];
// Object to store timers
var Timers = {};
// Object to store timers Blink
var Timers_Blink = {};
// Object to store progress dashboard
var ProgressOfDashboard = {};
// Object to store tab
var Tabs = {};
// Object to store tab body
var TabsBody = {};
// Object to commands
var Commands = {};
// Object to test List
var TestList = {};
// Object to test Current
var TestCurrent = {};
// Object to Serials
var Serials = {};
// Object to Onlines
var Onlines = {};
// Object to Reports
var Reports = {};
// Object to TimeOuts
var TimeOuts = {};
// IP Focus
var FocusIP = "";
// TryError
var TryError = 0;


// Function to open the modal
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
    // Reset input field and error message when closing the modal
    document.getElementById('ipInput').value = '';
    document.getElementById('ipError').style.display = 'none';
    document.getElementById('ipInput').classList.remove('invalid');
}

// Function to add a new
function addNew(ipAddress = null) {
    if (!ipAddress) {
        ipAddress = document.getElementById('ipInput').value;
    }
    if (!validateIP(ipAddress)) {
        // Show error message and add invalid class to input field
        document.getElementById('ipError').style.display = 'block';
        document.getElementById('ipInput').classList.add('invalid');
        return;
    }

    IPs.push(ipAddress);

    // Add a new to Tab
    Add_To_Tab(ipAddress);

    // Add a new to dashboard
    Add_To_Dashboard(ipAddress);

    // Add a new to timer
    Add_To_Timers(ipAddress);

    // Save the state of the tabs in a cookie
    saveTabsState();

    // Close the modal if an IP address was provided
    if (ipAddress !== null && document.getElementById('ipInput').value) {
        Execute(ipAddress, 'AddTester', ipAddress, 10000).catch(function (response) {
            alert("Add Tester Failed");
        });
        closeModal();
    }

    // Show current page
    showPage(ipAddress);
}

// Function On Click Stop
function Control_OnClick_Stop(ipAddress = null) {  
    if (ipAddress.indexOf(":") == -1) {
        for (var Index = 1001; Index <= 1004; Index++) {
            if (Onlines[ipAddress + ":" + Index]) {
                Control_OnClick_Stop(ipAddress + ":" + Index);
            }
        }
        return;
    }
    /*if (Commands[ipAddress] == 'Stop') {
        return;
    }*/
    else if (!Onlines[ipAddress]) {
        alert('The device is offline !');
        return;
    }
    else if (Serials[ipAddress].indexOf('Not.Select') != -1) {
        alert('Please select serial of list serials on right side !');
        return;
    }
    if (Timers_Blink[ipAddress]) {
        clearInterval(Timers_Blink[ipAddress]);
    }
    Execute(ipAddress, 'Stop', '', 10000).then(function (response) {
        var tabs_list = TabsBody[ipAddress].querySelector('#list');
        tabs_list.innerHTML = "";
        Commands[ipAddress] = 'Stop';
        Reports[ipAddress] = '';
        Failds[ipAddress] = false;
    });
}

// Function On Click Play
function Control_OnClick_Play(ipAddress = null) {
    if (ipAddress.indexOf(":") == -1) {
        for (var Index = 1001; Index <= 1004; Index++) {
            if (Onlines[ipAddress + ":" + Index]) {
                Control_OnClick_Play(ipAddress + ":" + Index);
            }
        }
        return;
    }
    if (Commands[ipAddress] == 'Play') {
        return;
    }
    else if (!Onlines[ipAddress]) {
        alert('The device is offline !');
        return;
    }
    else if (Serials[ipAddress].indexOf('Not.Select') != -1) {
        alert('Please select serial of list serials on right side !');
        return;
    }
    Execute(ipAddress, 'Play', '', 10000).then(function (response) {
        Commands[ipAddress] = 'Play';
    });
}

// Function On Click Next
function Control_OnClick_Next(ipAddress = null) {
    if (Commands[ipAddress] == 'Play') {
        return;
    }
    else if (!Onlines[ipAddress]) {
        alert('The device is offline !');
        return;
    }
    else if (Serials[ipAddress].indexOf('Not.Select') != -1) {
        alert('Please select serial of list serials on right side !');
        return;
    } 
    Execute(ipAddress, 'Play', '', 10000).then(function (response) {
        TestCurrent[ipAddress]++;
        Commands[ipAddress] = 'Play';
    });
}

// Function On Click Print
function Control_OnClick_Print(ipAddress = null) {    
    if (ipAddress.indexOf(":") == -1) {
        for (var Index = 1001; Index <= 1004; Index++) {
            Control_OnClick_Print(ipAddress + ":" + Index);
        }
        return;
    }
    if (Commands[ipAddress] != 'Pause') {
        alert('The device is not ready to print !');
        return;
    }
    else if (!Onlines[ipAddress]) {
        alert('The device is offline !');
        return;
    }
    else if (Serials[ipAddress].indexOf('Not.Select') != -1) {
        alert('Please select serial of list serials on right side !');
        return;
    }
    else if ((Reports[ipAddress].indexOf("error") != -1) || (Reports[ipAddress].indexOf("Error") != -1) || (Reports[ipAddress].indexOf("ERROR") != -1)) {
        alert('The device has error !');
        return;
    }

    var printWindow = window.open('', '_blank');    
    JsBarcode("#barcode", Serials[ipAddress]);
    document.getElementById('printable_div_id_SN_Img').src = document.getElementById("barcode").toDataURL();    
    /*
    document.getElementById('printable_div_id_SN_Img').src = "https://api.qrserver.com/v1/create-qr-code/?size=300X300&data=http://" + location.href.split("/")[2] + "/Report.aspx?Serial=" + Serials[ipAddress];
    */
    var printContents = document.getElementById('printable_div_id').innerHTML;

    printWindow.document.write(printContents);
    printWindow.document.close();

    printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
    };
}

// Function On Click Save
function Control_OnClick_Save(ipAddress = null) {
    if (ipAddress.indexOf(":") == -1) {
        for (var Index = 1001; Index <= 1004; Index++) {
            Control_OnClick_Save(ipAddress + ":" + Index);
        }
        return;
    }
    if (Commands[ipAddress] != 'Pause') {
        alert('The device is not ready to save !');
        return;
    }
    else if (!Onlines[ipAddress]) {
        alert('The device is offline !');
        return;
    }
    else if (Serials[ipAddress].indexOf('Not.Select') != -1) {
        alert('Please select serial of list serials on right side !');
        return;
    }
    Execute(ipAddress, 'SaveReport', Reports[ipAddress], 10000).catch(function (response) {
        alert("Save report Failed : " + response);
    });   
}

// Function On Click Delete device
function Control_OnClick_Delete_Device(ipAddress = null) {
    Execute(ipAddress, 'RemoveTester', ipAddress, 10000).then(function (response) {
        if (response.Value.indexOf("ERROR") != -1) {
            alert("Remove Tester Failed : " + response.Value);
        }
        else {
            location.reload();
        }        
    }).catch(function (response) {
        alert("Remove Tester Failed : " + response);
    });
}

// Function Add control Objects
function Add_Control_To(ipAddress, obj) {
    
    // Play icon
    var playIcon = document.createElement('a');
    //playIcon.href = '#';
    playIcon.style.color = '#401040';
    playIcon.style.padding = '10px';
    playIcon.setAttribute('title', 'Play');
    playIcon.setAttribute('cursor', 'pointer');
    playIcon.classList.add('fas', 'fa-play');
    obj.appendChild(playIcon);
    playIcon.addEventListener('click', function () {
        this.style.color = 'red';
        this.classList.add('disabled-link');
        setTimeout(() => { this.style.color = '#401040'; this.classList.remove('disabled-link'); }, 5000);
        Control_OnClick_Play(ipAddress);
    });

    // Stop icon
    var stopIcon = document.createElement('a');
    //stopIcon.href = '#';
    stopIcon.style.color = '#401040';
    stopIcon.style.padding = '10px';
    stopIcon.setAttribute('title', 'Stop');
    stopIcon.classList.add('fas', 'fa-stop');
    obj.appendChild(stopIcon);
    stopIcon.addEventListener('click', function () {
        this.style.color = 'red';
        this.classList.add('disabled-link');
        setTimeout(() => { this.style.color = '#401040'; this.classList.remove('disabled-link'); }, 5000);
        Control_OnClick_Stop(ipAddress);
    });

    if (ipAddress.indexOf(":") != -1) {
        // Next icon
        var nextIcon = document.createElement('a');
        //nextIcon.href = '#';
        nextIcon.style.color = '#401040';
        nextIcon.style.padding = '10px';
        nextIcon.setAttribute('title', 'Next');
        nextIcon.classList.add('fas', 'fa-forward');
        obj.appendChild(nextIcon);
        nextIcon.addEventListener('click', function () {
            this.style.color = 'red';
            this.classList.add('disabled-link');
            setTimeout(() => { this.style.color = '#401040'; this.classList.remove('disabled-link'); }, 5000);
            Control_OnClick_Next(ipAddress);
        });
    }

    // Print icon
    var printIcon = document.createElement('a');
    //printIcon.href = '#';
    printIcon.style.color = '#401040';
    printIcon.style.padding = '10px';
    printIcon.setAttribute('title', 'Print');
    printIcon.classList.add('fas', 'fa-print');
    obj.appendChild(printIcon);
    printIcon.addEventListener('click', function () {
        this.style.color = 'red';
        this.classList.add('disabled-link');
        setTimeout(() => { this.style.color = '#401040'; this.classList.remove('disabled-link'); }, 5000);
        Control_OnClick_Print(ipAddress);
    });

    // Save icon
    var saveIcon = document.createElement('a');
    //saveIcon.href = '#';
    saveIcon.style.color = '#401040';
    saveIcon.style.padding = '10px';
    saveIcon.setAttribute('title', 'Save');
    saveIcon.classList.add('fas', 'fa-save');
    obj.appendChild(saveIcon);
    saveIcon.addEventListener('click', function () {
        this.style.color = 'red';
        this.classList.add('disabled-link');
        setTimeout(() => { this.style.color = '#401040'; this.classList.remove('disabled-link'); }, 5000);
        Control_OnClick_Save(ipAddress);
    });

}

// Function to add a new to Tab
function Add_To_Tab(ipAddress = null) {



    // Create a new list item for the tab
    Tabs[ipAddress] = document.createElement('li');
    var newTabLink = document.createElement('a');
    newTabLink.textContent = ipAddress;
    newTabLink.href = '#';
    newTabLink.dir = 'rtl';
    // Create a circle element for status indicator
    var statusCircle = document.createElement('div');
    statusCircle.id = 'status';
    statusCircle.classList.add('status-circle');
    newTabLink.appendChild(statusCircle);
    Tabs[ipAddress].appendChild(newTabLink);



    /*
    var removeCircle = document.createElement('a');
    removeCircle.classList.add('remove-circle');
    removeCircle.href = '#';
    removeCircle.dir = 'ltr';
    removeCircle.innerHTML = "X";
    removeCircle.id = 'remove';
    removeCircle.addEventListener('click', function (event) {
        Execute(ipAddress, 'RemoveTester', ipAddress).then(function (response) {
            location.reload();
        }).catch(function (response) {
            alert("Remove Tester Failed");
        });
    }); 
    Tabs[ipAddress].appendChild(removeCircle);
    */

    // Create a new body element for the tab content
    TabsBody[ipAddress] = document.createElement('div');
    TabsBody[ipAddress].id = 'page';
    TabsBody[ipAddress].classList.add('container');
    TabsBody[ipAddress].style.display = 'none'; // Hide the new tab body initially

    // IP address wrapper with different color
    var ipWrapper = document.createElement('div');
    ipWrapper.id = 'ip';    
    ipWrapper.classList.add('ip-wrapper');
    ipWrapper.textContent = 'Device IP : ' + ipAddress;
    TabsBody[ipAddress].appendChild(ipWrapper);

    // State div
    var stateElement = document.createElement('div');
    stateElement.id = 'state';
    stateElement.style.paddingTop = '10px';
    stateElement.textContent = 'State : Offline';
    TabsBody[ipAddress].appendChild(stateElement);

    // Task div
    var taskElement = document.createElement('div');
    taskElement.id = 'task';
    taskElement.style.paddingBottom = '10px';
    taskElement.textContent = 'Task : Stop';
    TabsBody[ipAddress].appendChild(taskElement);

    // Serial div
    var SerialElement = document.createElement('div');
    SerialElement.id = 'serial';
    SerialElement.style.paddingBottom = '10px';
    SerialElement.textContent = 'Serial : Not.Select';
    TabsBody[ipAddress].appendChild(SerialElement);
    Serials[ipAddress] = 'Not.Select';

    Add_Control_To(ipAddress, TabsBody[ipAddress]);

    // List of divs below the IP address
    var listContainer = document.createElement('div');
    listContainer.id = 'list';
    listContainer.classList.add('list-container');

    // Append the list container to the progress container
    TabsBody[ipAddress].appendChild(listContainer);

    // Append the new tab and body to their respective containers
    var multiTabsList = document.querySelector('.multi-tabs');
    multiTabsList.appendChild(Tabs[ipAddress]);
    document.body.appendChild(TabsBody[ipAddress]);

    // Add click event listener to the new tab to show corresponding page
    newTabLink.addEventListener('click', function (event) {
        event.preventDefault();
        showPage(ipAddress); // Show the page corresponding to the IP address
    });

    TimeOuts[ipAddress] = 0;

    console.log('Add_To_Tab(' + ipAddress + ')');
}

// Function to remove of tab
function Remove_of_Tab(ipAddress = null) {
    // delete of tabs and tabsbody
    delete Tabs[ipAddress];
    delete TabsBody[ipAddress];
    console.log('Remove_of_Tab(' + ipAddress + ')');
}

// Function to add a new to Dashboard
function Add_To_Dashboard(ipAddress = null) {
    // Create a progress bar for the new tab
    ProgressOfDashboard[ipAddress] = document.createElement('div');
    ProgressOfDashboard[ipAddress].classList.add('progress-container');
    ProgressOfDashboard[ipAddress].classList.add('box');

    // IP address (set as the title of the progress container)
    ProgressOfDashboard[ipAddress].setAttribute('title', 'IP: ' + ipAddress);

    // IP address wrapper with different color
    var ipWrapper = document.createElement('div');
    ipWrapper.id = 'ip';
    ipWrapper.classList.add('ip-wrapper');
    ipWrapper.textContent = 'Device IP : ' + ipAddress;
    ProgressOfDashboard[ipAddress].appendChild(ipWrapper);
    ipWrapper.addEventListener('click', function (event) {
        showPage(ipAddress); // Show the page corresponding to the IP address
    });

    // State div
    Onlines[ipAddress] = false;
    var stateElement = document.createElement('div');
    stateElement.id = 'state';
    stateElement.style.paddingTop = '10px';
    stateElement.textContent = 'State : Offline';
    ProgressOfDashboard[ipAddress].appendChild(stateElement);

    // Task div
    var taskElement = document.createElement('div');
    taskElement.id = 'task';
    taskElement.style.paddingBottom = '10px';
    taskElement.textContent = 'Task : Stop';
    ProgressOfDashboard[ipAddress].appendChild(taskElement);

    // Serial div
    var SerialElement = document.createElement('div');
    SerialElement.id = 'serial';
    SerialElement.style.paddingBottom = '10px';
    SerialElement.textContent = 'Serial : Not.Select';
    ProgressOfDashboard[ipAddress].appendChild(SerialElement);

    Commands[ipAddress] = 'Stop';

    Add_Control_To(ipAddress, ProgressOfDashboard[ipAddress]);

    // Progress bar
    var progressBarRound = document.createElement('div');
    progressBarRound.classList.add('progress-round');
    var progressBar = document.createElement('div');
    progressBar.id = 'progress';
    progressBar.classList.add('progress');
    progressBarRound.appendChild(progressBar);
    ProgressOfDashboard[ipAddress].appendChild(progressBarRound);
    progressBar.style.width = 0 + '%';
    progressBar.innerHTML = '';


    Add_Table_Of_Dashboard(ipAddress);

    /*
    // Append the progress container to the dashboard page
    var dashboardPage = document.getElementById('page-dashboard');
    dashboardPage.appendChild(ProgressOfDashboard[ipAddress]);
    */

    console.log('Add_To_Dashboard(' + ipAddress + ')');
}

/*
 function Add_Table_Of_Dashboard(ipAddress = null) {

    if (SameIPs[ipAddress.split(":")[0]]) {
        SameIPs[ipAddress.split(":")[0]]++;
    }
    else {
        SameIPs[ipAddress.split(":")[0]] = 1;

        //body reference 
        var dashboardPage = document.getElementById('page-dashboard');

        // create elements <table> and a <tbody>
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");

        // cells creation
        for (var j = 0; j < 3; j++) {
            // table row creation
            var row = document.createElement("tr");
           
            for (var i = 0; i < 2; i++) {
                // create element <td> and text node 
                //Make text node the contents of <td> element
                // put <td> at end of the table row
                var cell = document.createElement("td");   
                //cell.setAttribute("width", "800px");
                if (j == 0) {
                    cell.id = "table_" + ipAddress.split(":")[0];
                }
                else {
                    cell.id = "table_" + ipAddress.split(":")[0] + ":" + (1000 + (((j * 2) + i) - 1));
                }

                row.appendChild(cell);

                if (j == 0) {
                    //var cellText = document.createTextNode(ipAddress.split(":")[0]);
                    //cell.appendChild(cellText);
                    Add_Control_To(ipAddress.split(":")[0], cell);
                    cell.setAttribute("colspan", "2");
                    cell.setAttribute('align', 'center');
                    cell.classList.add('lightgray');
                    cell.style.borderRadius = "10px";
                    break;
                }
            }
            
            //row added to end of table body
            tblBody.appendChild(row);
        }

        // append the <tbody> inside the <table>
        tbl.appendChild(tblBody);
        // put <table> in the <body>
        dashboardPage.appendChild(tbl);
        // tbl border attribute to 
        //tbl.setAttribute("border", "1");
    }

    var Table = document.getElementById("table_" + ipAddress);
    Table.appendChild(ProgressOfDashboard[ipAddress]);

    //alert(document.getElementById("table_" + ipAddress).innerHTML);
    //Table.appendChild(ProgressOfDashboard[ipAddress]);

    //alert(SameIPs[ipAddress.split(":")[0]]);
}
*/

function Add_Table_Of_Dashboard(ipAddress = null) {

    if (SameIPs[ipAddress.split(":")[0]]) {
        SameIPs[ipAddress.split(":")[0]]++;
    }
    else {
        SameIPs[ipAddress.split(":")[0]] = 1;

        //body reference 
        var dashboardPage = document.getElementById('page-dashboard');

        // create elements <table> and a <tbody>
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");

        // cells creation
        for (var j = 0; j < 2; j++) {
            // table row creation
            var row = document.createElement("tr");
           
            for (var i = 0; i < 4; i++) {
                // create element <td> and text node 
                //Make text node the contents of <td> element
                // put <td> at end of the table row
                var cell = document.createElement("td");   
                //cell.setAttribute("width", "800px");
                if (j == 0) {
                    cell.id = "table_" + ipAddress.split(":")[0];
                }
                else {
                    cell.id = "table_" + ipAddress.split(":")[0] + ":" + (1000 + (((j * 2) + i) - 1));
                }

                row.appendChild(cell);

                if (j == 0) {
                    //var cellText = document.createTextNode(ipAddress.split(":")[0]);
                    //cell.appendChild(cellText);
                    Add_Control_To(ipAddress.split(":")[0], cell);
                    cell.setAttribute("colspan", "4");
                    cell.setAttribute('align', 'center');
                    cell.classList.add('lightgray');
                    cell.style.borderRadius = "10px";
                    break;
                }
            }
            
            //row added to end of table body
            tblBody.appendChild(row);
        }

        // append the <tbody> inside the <table>
        tbl.appendChild(tblBody);
        // put <table> in the <body>
        dashboardPage.appendChild(tbl);
        // tbl border attribute to 
        //tbl.setAttribute("border", "1");
    }

    var Table = document.getElementById("table_" + ipAddress);
    Table.appendChild(ProgressOfDashboard[ipAddress]);

    //alert(document.getElementById("table_" + ipAddress).innerHTML);
    //Table.appendChild(ProgressOfDashboard[ipAddress]);

    //alert(SameIPs[ipAddress.split(":")[0]]);
}

// Function to remove of Dashboard
function Remove_of_Dashboard(ipAddress = null) {
    // delete of ProgressOfDashboard
    delete ProgressOfDashboard[ipAddress];
    console.log('Remove_of_Dashboard(' + ipAddress + ')');
}

// Function to add a new to Timers
var t = 0;
function Handle_Timers_Fault(ipAddress = null) {

    //alert(ipAddress);
    /*
    var tabs_status = Tabs[ipAddress].querySelector('#status');
    var tabs_list = TabsBody[ipAddress].querySelector('#list');
    var dashboard_state = ProgressOfDashboard[ipAddress].querySelector('#state');
    var tabs_state = TabsBody[ipAddress].querySelector('#state');
    var tabs_task = TabsBody[ipAddress].querySelector('#task');

    Commands[ipAddress] = 'Stop';
    tabs_list.innerHTML = "";
    Onlines[ipAddress] = false;
    tabs_task.textContent = dashboard_task.textContent = 'Task : Stoped';
    dashboard_state.textContent = tabs_state.textContent = 'State : Offline';
    dashboard_state.style.color = tabs_state.style.color = "red";
    setTimeout(() => { Add_To_Timers(ipAddress); }, 2000);
    */

    if (TimeOuts[ipAddress] > 0) {
        TimeOuts[ipAddress]--;
        return false;
    }
    else {
        var dashboard_state = ProgressOfDashboard[ipAddress].querySelector('#state');
        var tabs_state = TabsBody[ipAddress].querySelector('#state');
        dashboard_state.textContent = tabs_state.textContent = 'State : Offline';
        dashboard_state.style.color = tabs_state.style.color = "red";
        Commands[ipAddress] = 'Pause'
        var tabs_task = TabsBody[ipAddress].querySelector('#task');
        var dashboard_task = ProgressOfDashboard[ipAddress].querySelector('#task');
        tabs_task.textContent = dashboard_task.textContent = 'Task : Pause';
        var tabs_list = TabsBody[ipAddress].querySelector('#list');
        tabs_list.innerHTML = "";
        var tabs_status = Tabs[ipAddress].querySelector('#status');
        if (tabs_status.classList.contains('lightblue')) {
            tabs_status.classList.remove('lightblue');
        }
        setTimeout(() => { Add_To_Timers(ipAddress); }, 10000);
        return true;
    }

    /*
    TryError++;
    if (Commands[ipAddress] != 'Play' || TryError >= 40) {
        tabs_list.innerHTML = "";
        if (tabs_status.classList.contains('lightblue')) {
            tabs_status.classList.remove('lightblue');
        }
        Onlines[ipAddress] = false;
        dashboard_state.textContent = tabs_state.textContent = 'State : Offline';
        dashboard_state.style.color = tabs_state.style.color = "red";
        Commands[ipAddress] = 'Stop';
        Add_To_Timers(ipAddress);
        TryError = 0;
        return false;
    }
    else {
        setTimeout(() => { Add_To_Timers(ipAddress); }, 2000);
        return true;
    }
    */
}
// Function to add a new to Timers
var t = 0;
function Add_To_Timers(ipAddress = null) {
    // Add timer
    Timers[ipAddress] = setTimeout(() => {
        var dashboard_state = ProgressOfDashboard[ipAddress].querySelector('#state');
        var dashboard_task = ProgressOfDashboard[ipAddress].querySelector('#task');
        var dashboard_progress = ProgressOfDashboard[ipAddress].querySelector('#progress');
        var dashboard_serial = ProgressOfDashboard[ipAddress].querySelector('#serial');
        var dashboard_ip = ProgressOfDashboard[ipAddress].querySelector('#ip');

        var tabs_status = Tabs[ipAddress].querySelector('#status');
        var tabs_state = TabsBody[ipAddress].querySelector('#state');
        var tabs_task = TabsBody[ipAddress].querySelector('#task');
        var tabs_serial = TabsBody[ipAddress].querySelector('#serial');
        var tabs_list = TabsBody[ipAddress].querySelector('#list');

        if (Serials[ipAddress].indexOf('Not.Select') == -1) {
            dashboard_serial.style.color = tabs_serial.style.color = "green";
        }
        else {
            dashboard_serial.style.color = tabs_serial.style.color = "red";
        }

        Execute(ipAddress, 'Link', '', 10000).then(function (response) {
            if (response.Online) {
                document.getElementsByTagName("p")
                if (tabs_list.innerHTML == "") {
                    Execute(ipAddress, 'List', '', 10000).then(function (response) {
                        if (tabs_list.innerHTML == "") {
                            TestList[ipAddress] = response.Value.split(',');
                            TestList[ipAddress].length--;
                            TestCurrent[ipAddress] = 0;
                            for (var i = 0; i < TestList[ipAddress].length; i++) {
                                if (TestList[ipAddress][i] != "") {
                                    var Report = (TestList[ipAddress][i]).split('=');

                                    var listItem = document.createElement('div');
                                    listItem.id = Report[0];
                                    listItem.classList.add('list-item');
                                    if (Report[1] != "") {
                                        TestCurrent[ipAddress] = (i + 1);
                                        if ((Report[1].indexOf("Error") == -1) && (Report[1].indexOf("ERROR") == -1)) {
                                            listItem.classList.add('lightgreen');
                                            dashboard_ip.classList.add('lightgreen');
                                        }
                                        else {
                                            listItem.classList.add('lightred');
                                            dashboard_ip.classList.add('lightred');
                                        }
                                    }
                                    else {
                                        listItem.classList.add('lightblue');
                                        dashboard_ip.classList.add('lightblue');
                                    }

                                    var checkbox = document.createElement('input');
                                    checkbox.checked = true;
                                    checkbox.type = 'checkbox';
                                    listItem.appendChild(checkbox);

                                    var itemName = document.createElement('span');
                                    itemName.textContent = " Item " + (i + 1) + " : ";
                                    listItem.appendChild(itemName);

                                    var itemState = document.createElement('span');
                                    itemState.textContent = Report[0];
                                    listItem.appendChild(itemState);

                                    var itemResponse = document.createElement('li');
                                    itemResponse.innerHTML = Report[1];
                                    listItem.appendChild(itemResponse);

                                    TestList[ipAddress][i] = Report[0];
                                    tabs_list.appendChild(listItem);
                                }
                            }
                        }
                    });
                }
                if (Commands[ipAddress] == 'Stop' || Commands[ipAddress] == 'Pause') {
                    if (!tabs_status.classList.contains('lightblue')) {
                        tabs_status.classList.add('lightblue');
                    }
                    Onlines[ipAddress] = true;
                    dashboard_state.textContent = tabs_state.textContent = 'State : Online';
                    dashboard_state.style.color = tabs_state.style.color = "green";
                }
            }
            else {
                if (Handle_Timers_Fault(ipAddress)) {
                    return;
                }                
            }

            switch (Commands[ipAddress]) {
                case 'Stop': {
                    if (dashboard_progress.classList.contains('lightgreen')) {
                        dashboard_progress.classList.remove('lightgreen');
                    }
                    if (dashboard_progress.classList.contains('lightblue')) {
                        dashboard_progress.classList.remove('lightblue');
                    }
                    if (dashboard_progress.classList.contains('lightred')) {
                        dashboard_progress.classList.remove('lightred');
                    }
                    if (!dashboard_progress.classList.contains('lightgray')) {
                        dashboard_progress.classList.add('lightgray');
                    }
                    dashboard_progress.style.width = '0%';
                    dashboard_progress.innerHTML = '';
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Stoped';
                    break;
                }
                case 'Play': {
                    if (dashboard_progress.classList.contains('lightgray')) {
                        dashboard_progress.classList.remove('lightgray');
                    }
                    if (dashboard_progress.classList.contains('lightgreen')) {
                        dashboard_progress.classList.remove('lightgreen');
                    }
                    if (dashboard_progress.classList.contains('lightred')) {
                        dashboard_progress.classList.remove('lightred');
                    }
                    if (!dashboard_progress.classList.contains('lightblue')) {
                        dashboard_progress.classList.add('lightblue');
                    }
                    dashboard_progress.style.width = ((TestCurrent[ipAddress] / TestList[ipAddress].length) * 100) + '%';
                    dashboard_progress.innerHTML = Math.round((TestCurrent[ipAddress] / TestList[ipAddress].length) * 100) + '%';
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Playing';
                    if (TestCurrent[ipAddress] >= TestList[ipAddress].length) {
                        dashboard_progress.style.width = '100%';
                        dashboard_progress.innerHTML = '100%';
                        dashboard_progress.classList.remove('lightblue');
                        dashboard_progress.classList.add('lightgreen');
                        tabs_task.textContent = dashboard_task.textContent = 'Task : End';
                        Commands[ipAddress] = 'Pause';
                        Reports[ipAddress] = "";
                        for (var i = 0; i < TestList[ipAddress].length; i++) {
                            Reports[ipAddress] += TestList[ipAddress][i] + "=";
                            Reports[ipAddress] += tabs_list.getElementsByTagName("li")[i].innerHTML + ";";
                        }
                        Control_OnClick_Save(ipAddress);
                        //Control_OnClick_Print(ipAddress);
                    }
                    else {
                        if (tabs_list.getElementsByTagName("input")[TestCurrent[ipAddress]].checked) {
                            if (TestList[ipAddress][TestCurrent[ipAddress]].indexOf('(') != -1) {
                                var Command = TestList[ipAddress][TestCurrent[ipAddress]].split('(')[0];
                                var Value = TestList[ipAddress][TestCurrent[ipAddress]].split('(')[1].split(')')[0];
                                Value = Value.replace('#FileName', 'ProgramFile');
                                Value = Value.replace('#Domain', '94.139.169.122:8000');
                                Value = Value.replace('#Serial', Serials[ipAddress]);
                                let today = new Date().toLocaleDateString('fa-IR').replaceAll('/', '-').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
                                Value = Value.replace('#Date', today);
                            }
                            else {
                                var Command = TestList[ipAddress][TestCurrent[ipAddress]];
                                var Value = "";
                            }
                            //alert("Command=" + Command + " Value=" + Value);
                            if (!Timers_Blink[ipAddress]) {
                                Timers_Blink[ipAddress] = setInterval(() => {
                                    tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.toggle('lightblue');
                                    tabs_status.classList.toggle('lightblue');
                                    //dashboard_ip.classList.toggle('lightblue');
                                }, 200);
                            }
                            //if (Command.indexOf("ProgramSWD") != -1) {
                                TimeOuts[ipAddress] = 60;
                            //}
                            //else {
                            //    TimeOuts[ipAddress] = 0;
                            //}
                            Execute(ipAddress, Command, Value, 120000).then(function (response) {
                                if ((response.Value == "[ERR:0]") || (response.Value == null) || (response.Online==false)) {

                                }
                                else {
                                    if (Timers_Blink[ipAddress]) {
                                        clearInterval(Timers_Blink[ipAddress]);
                                        delete Timers_Blink[ipAddress];
                                    }
                                    setTimeout(() => {
                                        
                                        dashboard_ip.classList.remove('lightblue');
                                        dashboard_ip.classList.remove('lightgreen');
                                        dashboard_ip.classList.remove('lightred');

                                        tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.remove('lightblue');
                                        tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.remove('lightgreen');
                                        tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.remove('lightred');

                                        tabs_list.getElementsByTagName("li")[TestCurrent[ipAddress]].innerHTML = response.Value;

                                        if ((response.Value.indexOf("error") == -1) && (response.Value.indexOf("Error") == -1) && (response.Value.indexOf("ERROR") == -1)) {
                                            tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.add('lightgreen');
                                            dashboard_ip.classList.add('lightgreen');
                                            TestCurrent[ipAddress]++;
                                        }
                                        else {
                                            tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.add('lightred');
                                            dashboard_ip.classList.add('lightred');
                                            Commands[ipAddress] = 'Pause';
                                        }
                                        
                                    }, 300);

                                    /*
                                    tabs_list.getElementsByTagName("li")[TestCurrent[ipAddress]].innerHTML = response.Value;
                                    if (tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.contains('lightblue')) {
                                        tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.remove('lightblue');
                                        dashboard_ip.classList.remove('lightblue');
                                    }
                                    if ((response.Value.indexOf("error") == -1) && (response.Value.indexOf("Error") == -1) && (response.Value.indexOf("ERROR") == -1)) {
                                        if (tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.contains('lightred')) {
                                            tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.remove('lightred');
                                            dashboard_ip.classList.remove('lightred');
                                        }
                                        tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.add('lightgreen');
                                        dashboard_ip.classList.add('lightgreen');
                                        TestCurrent[ipAddress]++;
                                    }
                                    else {
                                        tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].classList.add('lightred');
                                        dashboard_ip.classList.add('lightred');
                                        Commands[ipAddress] = 'Pause';
                                    }
                                    */
                                }
                            });
                        }
                        else {
                            TestCurrent[ipAddress]++;
                        }
                    }                    
                    break;
                }
                case 'Pause': {
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Pause';
                    break;
                }
            }
            Add_To_Timers(ipAddress);
            TryError = 0;
        }).catch(function (error) {
            if (Handle_Timers_Fault(ipAddress)) {
                return;
            } 
        });
    }, Default_Refresh_Tasks);
    //console.log('Add_To_Timers(' + ipAddress + ')');
}

// Function to remove of Timers
function Remove_of_Timers(ipAddress = null) {
    // delete timer
    clearInterval(Timers[ipAddress]);
    delete Timers[ipAddress];
    console.log('Remove_of_Timers(' + ipAddress + ')');
}

// Function to validate an IP address
function validateIP(ipAddress) {
    var ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;
    return ipRegex.test(ipAddress);
}

// Function to show a page corresponding to the IP address
function showPage(ipAddress) {
    // Hide all tab bodies
    var tabBodies = document.querySelectorAll('.container');
    tabBodies.forEach(function (body) {
        body.style.display = 'none';
    });

    // Show the tab body corresponding to the IP address
    FocusIP = ipAddress;
    var page = TabsBody[ipAddress];
    if (page) {        
        page.style.display = 'block';
        if (Serials[ipAddress].indexOf('Not.Select') != -1) {
            togglePanel();
        }
    }
    else {
        try {
            document.getElementById('page-' + ipAddress).style.display = 'block';            
        } catch (er) { }
    }
}

// Function to toggle between dashboard and settings page
function toggleSettings() {
    var dashboardPage = document.getElementById('page-dashboard');
    var settingsPage = document.getElementById('page-settings');

    if (dashboardPage.style.display === 'none') {
        // Show dashboard page
        showPage('dashboard');
    } else {
        // Show settings page
        showPage('settings');
    }
}

// Function to clear all cookie
function clearAllCookies() {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

// Function check serial
function Control_OnClick_Check_Serial(Serial = null) {
    Execute("", 'CheckSerial', Serial, 10000).then(function (response) {
        var report = response.Value.replaceAll(";", "\r\n");
        alert("Report:\r\n" + report);
    }).catch(function (response) {
        alert("Check Failed");
    });
}

// Function to save the state of the tabs in a cookie
function saveTabsState() {
    //const d = new Date();
    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
    //let expires = "expires="+ d.toUTCString();
    /*
    var Data = "";
    for (let i = 0; i < IPs.length; i++) {
        Data += "," + IPs[i];
    }
    document.cookie = Data;
    */
}

// Function to restore the state of the tabs from a cookie
function restoreTabsState() {
    /*
    const cookies = document.cookie.split(",");
    for (let i = 1; i < cookies.length; i++) {
        setTimeout(function () {
            addNew(cookies[i]);
            showPage('dashboard');
        }, ((i + 1) * 100));
    }
    */
}

// Function to get and set data of device by the IP address
function Execute(ipAddress, Command, Value, TimeOut) {
    return new Promise(async function (resolve, reject) {
        var StructData = {
            IP: ipAddress,
            Serial: Serials[ipAddress],
            Command: Command,
            Value: Value,
            Online: false,
            TimeOut: TimeOut
        };

        $.ajax({
            type: "POST",
            url: "Default.aspx/Execute",
            data: JSON.stringify({ inputdata: StructData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                resolve(response.d);
            },
            error: function (xhr, textStatus, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

function togglePanel() {
    var panel = document.getElementById('serial-panel');
    var icon = document.getElementById('toggle-icon');
    if (panel.classList.contains('visible')) {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
    } else {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
    }
    panel.classList.toggle('visible');
}

function selectSerial(Serial) {
    var page = TabsBody[FocusIP];
    if (page) {

        Serials[FocusIP] = Serial; 

        var dashboard_serial = ProgressOfDashboard[FocusIP].querySelector('#serial');
        var tabs_serial = TabsBody[FocusIP].querySelector('#serial');

        dashboard_serial.innerHTML = tabs_serial.innerHTML = "Serial : " + Serials[FocusIP];
        togglePanel();
    }
    else {            
        alert("Please focus on one device Selected");
    }    
}

// Restore the state of the tabs when the page loads
window.addEventListener('load', function () {
    restoreTabsState();

    // Add event listener to any element (button, icon, etc.) to toggle the panel visibility
    document.getElementById('toggle-panel-button').addEventListener('click', togglePanel);
});

window.onkeydown = evt => {
    switch (evt.keyCode) {
        case 113:
            for (var Index = 0; Index <= IPs.length; Index++) {
                if (Onlines[IPs[Index]]) {
                    Control_OnClick_Play(IPs[Index]);
                }
            }
            break;
        //Fallback to default browser behaviour
        default:
            return true;
    }
    //Returning false overrides default browser event
    return false;
};