// Default parameters
var Default_Refresh_Tasks = 500;
// IPs
const IPs = [];
// Object to store timers
var Timers = {};
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
    if (ipAddress !== null) {
        closeModal();
    }

    // Show current page
    showPage(ipAddress);
}

// Function On Click Stop
function Control_OnClick_Stop(ipAddress = null) {
    if (Commands[ipAddress] == 'Stop') {
        return;
    }
    Execute(ipAddress, 'Stop', '').then(function (response) {
        Commands[ipAddress] = 'Stop';
    });
}

// Function On Click Play
function Control_OnClick_Play(ipAddress = null) {
    if (Commands[ipAddress] == 'Play') {
        return;
    }
    Execute(ipAddress, 'Play', '').then(function (response) {
        Commands[ipAddress] = 'Play';
    });
}

// Function On Click Pause
function Control_OnClick_Pause(ipAddress = null) {
    if (Commands[ipAddress] == 'Pause') {
        return;
    }
    Execute(ipAddress, 'Pause', '').then(function (response) {
        Commands[ipAddress] = 'Pause';
    });
}

// Function On Click Next
function Control_OnClick_Next(ipAddress = null) {
    if (Commands[ipAddress] == 'Next') {
        return;
    }
    Execute(ipAddress, 'Next', '').then(function (response) {
        Commands[ipAddress] = 'Next';
    });
}

// Function On Click Repete
function Control_OnClick_Repete(ipAddress = null) {
    if (Commands[ipAddress] == 'Repete') {
        return;
    }
    Execute(ipAddress, 'Repete', '').then(function (response) {
        Commands[ipAddress] = 'Repete';
    });
}

// Function Add control Objects
function Add_Control_To(ipAddress, obj) {
    // Stop icon
    var stopIcon = document.createElement('a');
    stopIcon.href = '#';
    stopIcon.style.color = '#401040';
    stopIcon.style.padding = '10px';
    stopIcon.setAttribute('title', 'Stop');
    stopIcon.classList.add('fas', 'fa-stop');
    obj.appendChild(stopIcon);
    stopIcon.addEventListener('click', function () { Control_OnClick_Stop(ipAddress); });

    // Play icon
    var playIcon = document.createElement('a');
    playIcon.href = '#';
    playIcon.style.color = '#401040';
    playIcon.style.padding = '10px';
    playIcon.setAttribute('title', 'Play');
    playIcon.classList.add('fas', 'fa-play');
    obj.appendChild(playIcon);
    playIcon.addEventListener('click', function () { Control_OnClick_Play(ipAddress); });

    // Pause icon
    var PauseIcon = document.createElement('a');
    PauseIcon.href = '#';
    PauseIcon.style.color = '#401040';
    PauseIcon.style.padding = '10px';
    PauseIcon.setAttribute('title', 'Pause');
    PauseIcon.classList.add('fas', 'fa-pause');
    obj.appendChild(PauseIcon);
    PauseIcon.addEventListener('click', function () { Control_OnClick_Pause(ipAddress); });

    // Next icon
    var nextIcon = document.createElement('a');
    nextIcon.href = '#';
    nextIcon.style.color = '#401040';
    nextIcon.style.padding = '10px';
    nextIcon.setAttribute('title', 'Next');
    nextIcon.classList.add('fas', 'fa-forward');
    obj.appendChild(nextIcon);
    nextIcon.addEventListener('click', function () { Control_OnClick_Next(ipAddress); });

    // Repete icon
    var repeteIcon = document.createElement('a');
    repeteIcon.href = '#';
    repeteIcon.style.color = '#401040';
    repeteIcon.style.padding = '10px';
    repeteIcon.setAttribute('title', 'Repete');
    repeteIcon.classList.add('fas', 'fa-redo');
    obj.appendChild(repeteIcon);
    repeteIcon.addEventListener('click', function () { Control_OnClick_Repete(ipAddress); });
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

    // Create a new body element for the tab content
    TabsBody[ipAddress] = document.createElement('div');
    TabsBody[ipAddress].id = 'page';
    TabsBody[ipAddress].classList.add('container');
    TabsBody[ipAddress].style.display = 'none'; // Hide the new tab body initially

    // IP address wrapper with different color
    var ipWrapper = document.createElement('div');
    ipWrapper.classList.add('ip-wrapper');
    ipWrapper.textContent = 'Device IP : ' + ipAddress;
    TabsBody[ipAddress].appendChild(ipWrapper);

    // State div
    var stateElement = document.createElement('div');
    stateElement.id = 'state';
    stateElement.style.paddingTop = '10px';
    stateElement.textContent = 'State : Disconnected';
    TabsBody[ipAddress].appendChild(stateElement);

    // Task div
    var taskElement = document.createElement('div');
    taskElement.id = 'task';
    taskElement.style.paddingBottom = '10px';
    taskElement.textContent = 'Task : IDLE';
    TabsBody[ipAddress].appendChild(taskElement);

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
    ipWrapper.classList.add('ip-wrapper');
    ipWrapper.textContent = 'Device IP : ' + ipAddress;
    ProgressOfDashboard[ipAddress].appendChild(ipWrapper);
    ipWrapper.addEventListener('click', function (event) {
        showPage(ipAddress); // Show the page corresponding to the IP address
    });

    // State div
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

    // Append the progress container to the dashboard page
    var dashboardPage = document.getElementById('page-dashboard');
    dashboardPage.appendChild(ProgressOfDashboard[ipAddress]);

    console.log('Add_To_Dashboard(' + ipAddress + ')');
}

// Function to remove of Dashboard
function Remove_of_Dashboard(ipAddress = null) {
    // delete of ProgressOfDashboard
    delete ProgressOfDashboard[ipAddress];
    console.log('Remove_of_Dashboard(' + ipAddress + ')');
}

// Function to add a new to Timers
var t = 0;
function Add_To_Timers(ipAddress = null) {
    // Add timer
    Timers[ipAddress] = setTimeout(() => {
        var dashboard_state = ProgressOfDashboard[ipAddress].querySelector('#state');
        var dashboard_task = ProgressOfDashboard[ipAddress].querySelector('#task');
        var dashboard_progress = ProgressOfDashboard[ipAddress].querySelector('#progress');

        var tabs_status = Tabs[ipAddress].querySelector('#status');
        var tabs_state = TabsBody[ipAddress].querySelector('#state');
        var tabs_task = TabsBody[ipAddress].querySelector('#task');
        var tabs_list = TabsBody[ipAddress].querySelector('#list');

        Execute(ipAddress, 'Link', '').then(function (response) {
            if (response.Online) {document.getElementsByTagName("p")
                if (tabs_list.innerHTML == "") {
                    Execute(ipAddress, 'List', '').then(function (response) {
                        Add_Control_To(ipAddress, TabsBody[ipAddress]);
                        TestList[ipAddress] = response.Value.split(',');
                        for (var i = 0; i < TestList[ipAddress].length; i++) {
                            var listItem = document.createElement('div');
                            listItem.id = TestList[ipAddress][i];
                            listItem.classList.add('list-item');
                            listItem.classList.add('lightblue');

                            var checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            listItem.appendChild(checkbox);

                            var itemName = document.createElement('span');
                            itemName.textContent = " Item " + (i+1) + " : ";
                            listItem.appendChild(itemName);

                            var itemState = document.createElement('span');
                            itemState.textContent = TestList[ipAddress][i];
                            listItem.appendChild(itemState);

                            tabs_list.appendChild(listItem);
                        }
                    });
                }
                if (Commands[ipAddress] == 'Stop' || Commands[ipAddress] == 'Pause') {
                    if (!tabs_status.classList.contains('lightblue')) {
                        tabs_status.classList.add('lightblue');
                    }
                    dashboard_state.textContent = tabs_state.textContent = 'State : Online';
                    dashboard_state.style.color = tabs_state.style.color = "green";
                }
            }
            else {
                tabs_list.innerHTML = "";
                if (tabs_status.classList.contains('lightblue')) {
                    tabs_status.classList.remove('lightblue');
                }
                dashboard_state.textContent = tabs_state.textContent = 'State : Offline';
                dashboard_state.style.color = tabs_state.style.color = "red";
                Commands[ipAddress] = 'Stop';
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
                    TestCurrent[ipAddress] = 0;
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
                    dashboard_progress.style.width = ((TestCurrent[ipAddress] / TestList[ipAddress].length)*100) + '%';
                    dashboard_progress.innerHTML = ((TestCurrent[ipAddress] / TestList[ipAddress].length) * 100) + '%';
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Playing';
                    if (TestCurrent[ipAddress] >= TestList[ipAddress].length) {
                        dashboard_progress.style.width = '100%';
                        dashboard_progress.innerHTML = '100%';
                        dashboard_progress.classList.remove('lightblue');
                        dashboard_progress.classList.add('lightgreen');
                        tabs_task.textContent = dashboard_task.textContent = 'Task : End';
                        Commands[ipAddress] = 'Pause';
                    }
                    else {
                        Execute(ipAddress, TestList[ipAddress][TestCurrent[ipAddress]], '').then(function (response) {
                            if (true) {
                                tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].style.backgroundColor = 'green';
                            }
                            else {
                                tabs_list.getElementsByTagName("div")[TestCurrent[ipAddress]].style.backgroundColor = 'red';
                            }
                            //alert(response.Value);
                            //if (response.Value == "Passed") {
                                TestCurrent[ipAddress]++;                            
                            //}
                        });
                    }
                    tabs_status.classList.toggle('lightblue');
                    break;
                }
                case 'Repete': {
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Repete';
                    break;
                }
                case 'Next': {
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Next';
                    break;
                }
                case 'Pause': {
                    tabs_task.textContent = dashboard_task.textContent = 'Task : Pause';
                    break;
                }
            }        

            Add_To_Timers(ipAddress);
        }).catch(function (error) {
            tabs_list.innerHTML = "";
            Add_To_Timers(ipAddress);
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
    var ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
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
    var page = TabsBody[ipAddress];
    if (page) {
        page.style.display = 'block';
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
function Execute(ipAddress, Command, Value) {
    return new Promise(function (resolve, reject) {
        var StructData = {
            IP: ipAddress,
            Command: Command,
            Value: Value,
            Online: false
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

// Restore the state of the tabs when the page loads
window.addEventListener('load', function () {
    restoreTabsState();
});
