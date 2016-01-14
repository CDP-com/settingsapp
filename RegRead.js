var HKLM = 0x80000002;
var str1 = "SOFTWARE\\CDP\\Snapback\\APPS\\";
var str3 = "\\";

var rtn = regGetSubKeys(".", "SOFTWARE\\CDP\\Snapback\\APPS")
if (rtn.Results == 0 )
{
  for (var idx=0;idx<rtn.SubKeys.length;idx++)
  {
    var appname = rtn.SubKeys[idx];
	WScript.Echo("Appname : ", appname);
	
	var ButtonPath = str1 + appname;
	var rtn1 = regGetSubKeys(".", ButtonPath)
	for (var i=0;i<rtn1.SubKeys.length;i++) {
	   //var applevel = str1.concat(appname, str3);
	   WScript.Echo("AppName Path ", ButtonPath) ;
	   //var rtn = regGetSubKeys(".", applevel ) ;
	
	    //var str4 = applevel
	    var buttoname  = (rtn1.SubKeys[i]);
	    WScript.Echo("Button Name ", buttoname) ;
	
	    //var buttonlevel = str4.concat(buttoname);
	    WScript.Echo("button path ", ButtonPath+buttoname) ;
	}
	
  }
}

 
//------------------------------------------------------------- 
// function : regGetSubKeyNames(strComputer, strRegPath) 
// 
//  purpose : return an array with names of any subKeys 
//------------------------------------------------------------- 
function regGetSubKeys(strComputer, strRegPath) 
{ 
  try 
  { 
    var aNames = null; 
    var objLocator     = new ActiveXObject("WbemScripting.SWbemLocator"); 
    var objService     = objLocator.ConnectServer(strComputer, "root\\default"); 
    var objReg         = objService.Get("StdRegProv"); 
    var objMethod      = objReg.Methods_.Item("EnumKey"); 
    var objInParam     = objMethod.InParameters.SpawnInstance_(); 
    objInParam.hDefKey = HKLM; 
    objInParam.sSubKeyName = strRegPath; 
    var objOutParam = objReg.ExecMethod_(objMethod.Name, objInParam); 
    switch(objOutParam.ReturnValue) 
    { 
      case 0:          // Success 
        aNames = (objOutParam.sNames != null) ? objOutParam.sNames.toArray(): null; 
        break; 
 
      case 2:        // Not Found 
        aNames = null; 
        break; 
    } 
    return { Results : 0, SubKeys : aNames }; 
  } 
  catch(e)   
  {  
    return { Results: e.number, SubKeys : e.description }  
 } 
}
