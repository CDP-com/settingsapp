// Use this file to include any custom functions for your app.
// 
var appname = "Settings";           // This apps name / folder name _ must be unique
var btncount = 1;                   // this is the number of buttons on the home page of the app

var currentUserDefaultCaution = "0";    // this is the global Throw caution to the wind flag for the current user
var btn0_Title = "Run This App";     // this is what is displayed on the button
var btn0_Command = "displaymessage.js";  
var btn0_CommandParms = "";
var btn0_id="btn0";
var btn0_ElevateNeeded=0;   // needed by service _ in xml file for button
var btn0_ScriptHasUI=0;     // needed by service _ in xml file for button
// Permissions for button0 
var btn0_DefaultAllowAdmin=1;
var btn0_CurrentAllowAdmin=0;        // display on how it works _ Admin only can modify Current values 
var btn0_LastModifiedAllowAdmin="";  // update timestamp if admin modifies current value
var btn0_DefaultAllowUser=1;
var btn0_CurrentAllowUser=0;         // display on how it works _ Admin only can modify Current values 
var btn0_LastModifiedAllowUser="";   // update timestamp if admin modifies current value
var btn0_DefaultCaution=1;
var btn0_CurrentCaution=0;           // display on how it works _ Admin only can modify Current values 
var btn0_LastModifiedCaution="";     // update timestamp if admin modifies current value
var buttonname ="";

	
function ChangeSetGlobal()
{
	window.confirm("You are trying to change a global setting\nButton Not Enabled _ talk to administrator");		
	var today = new Date();
	//SetCurrentUserLastLModifiedDate(today)
	
}
function ChangeGlobalInDefault()
{
	window.confirm("Global set to Default\nButton Not Enabled _ talk to administrator");
	//GetCurrentUserLastLModifiedDate()
	
}
		
function  ChangeAllowBeta()
{
	window.confirm("Allow Beta Testing"); 
}
function  ChangeBetaDefault()
{
	window.confirm("Set Beta to Off (Default)");
		
}
	// Common Registry functions

function WriteInRegistryDW(sRegEntry, sRegValue)
{
  var regpath = sRegEntry;
  var oWSS = new ActiveXObject("WScript.Shell");
  oWSS.RegWrite(regpath, sRegValue, "REG_DWORD");
}

function WriteInRegistrySZ(sRegEntry, sRegValue)
{
  var regpath = sRegEntry;
  var oWSS = new ActiveXObject("WScript.Shell");
  oWSS.RegWrite(regpath, sRegValue, "REG_SZ");
  
}

function ReadFromRegistry(sRegEntry)
{
  var regpath = sRegEntry;
  var oWSS = new ActiveXObject("WScript.Shell");
  return oWSS.RegRead(regpath);
}

///////////////////////////////////////////////////////////////////////////////
// Function Name : IsAdmin
// Purpose : Check a user is in Administrator Group or Not
// Parameters : DName (Domain name or Local computer name)
//              UName (Current User Name)
// Return : Function return 1 if user is in Administrator Group and 0 if not
///////////////////////////////////////////////////////////////////////////////
function IsAdmin(DName, UName)
{
    var objWMIService = GetObject("winmgmts:\\\\" + DName + "\\root\\CIMV2");
   
    var colItems = objWMIService.ExecQuery("SELECT * FROM Win32_GroupUser");

    var enumItems = new Enumerator(colItems);
    for (; !enumItems.atEnd(); enumItems.moveNext()) {
        var objItem = enumItems.item();
        var gc = objItem.GroupComponent;
        var pc = objItem.PartComponent;  
        var pos = pc.search("Name=");
		var res = pc.slice(pos);
        if (res.indexOf(UName) != -1) {	  
            if (gc.indexOf("Administrators") != -1) {	  
                ////WScript.Echo("Is Admin");
                return 1;
        
	    }
        }
    }
    return 0; 

}

///////////////////////////////////////////////////////////////////////////////
// Function Name : RunApp
// Purpose : Check Permission before an app to run
// Parameters : AppName (Application Name)
//              ButtonNum (Button Id in this App)           
//              Computername (Domain name or Local computer name)
//              CurrentUser (Current User Name)
//              sCmd (Script/exe name to excute)
// 
///////////////////////////////////////////////////////////////////////////////
 
function RunApps( AppName, ButtonNum, Computername, CurrentUser, sCmd )
{
    var GlobalCurrentCautionPath = "HKCU\\SOFTWARE\\CDP\\SnapBack\\Apps\\CurrentCaution";  
    var AppRoot = "HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\"; 
    var AppCurrentCautionPath = AppRoot + AppName + "\\button0\\CurrentCaution";
    var AppCurrentAllowAdminPath = AppRoot + AppName + "\\button0\\CurrentAllowAdmin";
    var AppCurrentAllowUserPath = AppRoot + AppName + "\\button0\\CurrentAllowUser";    
    var sFullpath = "";
	var stats = IsAdmin(Computername, CurrentUser)
	
    if (sCmd.indexOf("file:") < 0) sFullpath = fnGetDocPath();
    sFullpath += sCmd;
    sCmd = sFullpath;
    var shell = new ActiveXObject ( "WScript.Shell" );
    var sPathFoldername = shell.ExpandEnvironmentStrings( unescape( sCmd ) );
    sPathFoldername = ('"' + sPathFoldername + '"');	
   	
    if (ReadFromRegistry(GlobalCurrentCautionPath)) { 
	        if (IsAdmin(Computername, CurrentUser)) {  
            if (ReadFromRegistry(AppCurrentAllowAdminPath)) {
	            shell.run("explorer.exe " + sPathFoldername, 1, false);
	            shell = null;
            } else {
                alert("You can not run this app 1");
            } 
        } else {
            if (ReadFromRegistry(AppCurrentAllowUserPath)) {
	            shell.run("explorer.exe " + sPathFoldername, 1, false);
	            shell = null;
            } else {
                alert("You can not run this app 2");
            } 
        }
    } else if (!ReadFromRegistry(AppCurrentCautionPath)){
        alert("You can not run this app 3");
    } else {
        if (IsAdmin(Computername, CurrentUser)) {  
            if (ReadFromRegistry(AppCurrentAllowAdminPath)) {
	           shell.run("explorer.exe " + sPathFoldername, 1, false);
	           shell = null;
            } else {
                alert("You can not run this app 4");
            } 
        } else {
            if (ReadFromRegistry(AppCurrentAllowUserPath)) {
	            shell.run("explorer.exe " + sPathFoldername, 1, false);
	            shell = null;
            } else {
                alert("You can not run this app 5");
            } 
        }
    }

}



function ChangeGlobalCautionChecked()
{    
	var chkBox = document.getElementById('GlobalCaution');
	if (chkBox.checked) {
 	    today = Date();
		SetGlobalIniValue(GlobalPathDefaultValName, 1, "REG_DWORD");
	    SetGlobalIniValue(GlobalCurrentCautionValName, 1, "REG_DWORD");
		SetGlobalIniValue(GlobalLastModifiedCautionValName, today, "REG_SZ");
	} else {
		SetGlobalIniValue(GlobalPathDefaultValName, 0, "REG_DWORD");
		SetGlobalIniValue(GlobalCurrentCautionValName, 0, "REG_DWORD");
		SetGlobalIniValue(GlobalLastModifiedCautionValName, today, "REG_SZ");
	
	}
}


function AllowAdminChecked(ButtonNum) 
{   
    today = Date();
	var AppRoot = "HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\"; 
    var chkBox = document.getElementById('ButtonAllowAdmin');
	var wsh = new ActiveXObject("WScript.Shell");
	if (chkBox.checked)
    {
		SetButtonIniValue(appname, ButtonNum, "CurrentAllowAdmin", 1, "REG_DWORD"); 
	    SetButtonIniValue(appname, ButtonNum, "AllowAdminLastModifiedDate", today, "REG_SZ");		
	} else {
		SetButtonIniValue(appname, ButtonNum, "CurrentAllowAdmin", 0, "REG_DWORD"); 
	    SetButtonIniValue(appname, ButtonNum, "AllowAdminLastModifiedDate", today, "REG_SZ");		
	}
	wsh = null;
} 


function CurrentAllowUserChecked(ButtonNum) 
{   
    today = Date();
	var AppRoot = "HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\"; 
	var chkBox = document.getElementById('CurrentAllowUser');
	var wsh = new ActiveXObject("WScript.Shell");
	if (chkBox.checked)
    {
		SetButtonIniValue(appname, ButtonNum, "CurrentAllowUser", 1, "REG_DWORD"); 
	    SetButtonIniValue(appname, ButtonNum, "AllowUserLastModifiedDate", today, "REG_SZ");
	} else {
		SetButtonIniValue(appname, ButtonNum, "CurrentAllowUser", 0, "REG_DWORD"); 
	    SetButtonIniValue(appname, ButtonNum, "AllowUserLastModifiedDate", today, "REG_SZ");
	}

} 

function CurrentCautionChecked(ButtonNum) 
{   
    today = Date();
	var AppRoot = "HKLM\\SOFTWARE\\CDP\\SnapBack\\Apps\\"; 
    var AppCurrentAllowAdminPath = AppRoot + appname + "\\button" + ButtonNum + "\\CurrentCaution";
	var chkBox = document.getElementById('CurrentCaution');
	var wsh = new ActiveXObject("WScript.Shell");
	if (chkBox.checked)
    {
		SetButtonIniValue(appname, ButtonNum, "CurrentCaution", 1, "REG_DWORD"); 
	    SetButtonIniValue(appname, ButtonNum, "CautionLastModifiedDate", today, "REG_SZ");
	} else {
		SetButtonIniValue(appname, ButtonNum, "CurrentCaution", 0, "REG_DWORD"); 
	    SetButtonIniValue(appname, ButtonNum, "CautionLastModifiedDate", today, "REG_SZ");
	}

} 
