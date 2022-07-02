
var jpdbBaseURL= "http://api.login2explore.com:5577";
var jpdbIRL= "/api/irl";
var jpdbIML= "/api/iml";
var empDBName= "EMP-DB";
var empRelationName = "EmpDataNav";
var conntoken = "90939278|-31949286959835706|90939733";

setBaseUrl(jpdbBaseURL);


function disableCtrl(ctrl)
{
    $('#new').prop('disabled', ctrl);
    $('#save').prop('disabled', ctrl);
    $('#edit').prop('disabled', ctrl);
    $('#change').prop('disabled', ctrl);
    $('#reset').prop('disabled', ctrl);
}

function disableNav(ctrl)
{
    $('#first').prop('disabled', ctrl);
    $('#prev').prop('disabled', ctrl);
    $('#next').prop('disabled', ctrl);
    $('#last').prop('disabled', ctrl);
  
}
function disableForm(bValue)
{
    $('#empid').prop('disabled', bValue);
    $('#empname').prop('disabled', bValue);
    $('#empsal').prop('disabled', bValue);
    $('#hra').prop('disabled', bValue);
    $('#da').prop('disabled', bValue);
    $('#deduct').prop('disabled', bValue);
}

function initEmpForm()
{
    localStorage.removeItem('first_rec_no');
    localStorage.removeItem('last_rec_no');
    localStorage.removeItem('rec_no');
    console.log("initEmpForm() - done");
}
 /*

function saveRecNo2LS(jsonObj)
{
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getEmpIdAsJsonObj()
{
    var empid = $('#empid').val();
    var jsonStr = { id: empid};
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj)
{
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#empname').val(record.name);
    $('#empsal').val(record.salary);
    $('#hra').val(record.hra);
    $('#da').val(record.da);
    $('#deduct').val(record.deduction);
}

function resetForm()
{
    $('#empid').val("");
    $('#empname').val("");
    $('#empsal').val("");
    $('#hra').val("");
    $('#da').val("");
    $('#deduct').val("");
    $('#empid').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#empid').focus();
}
*/
function resetForm()
{
    disableCtrl(true);
    disableNav(false);

    var getCurrRequest = createGET_BY_RECORDRequest(conntoken, empDBName, empRelationName, getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurrRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});

    if(isOnlyOneRecordPresent() || isNoRecordPresentLS())
    {
        disableNav(true);
    }
    $('#new').prop('disabled', false);
    if(isNoRecordPresentLS())
    {
        makeDataFormEmpty();
        $('#edit').prop('disabled', true);
    }
    else{
        $('#edit').prop('disabled', false);
    }

    disableForm(true);
}

function setCurrRecNo2LS(jsonObj)
{
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", data.rec_no);
}
function getCurrRecNoFromLS()
{
    return localStorage.getItem("rec_no");
}


function setFirstRecNo2LS(jsonObj)
{
   var data = JSON.parse(jsonObj.data);
   if(data.rec_no === undefined)
   {
    localStorage.setItem("first_rec_no", "0");
   }
   else{
    localStorage.setItem("first_rec_no", data.rec_no);
   }
}

function getFirstRecNoFromLS()
{
    return localStorage.getItem("first_rec_no");
}

function setLastRecNo2LS(jsonObj)
{
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined)
    {
     localStorage.setItem("last_rec_no", "0");
    }
    else{
     localStorage.setItem("last_rec_no", data.rec_no);
    }
}

function getLastRecNoFromLS()
{
    return localStorage.getItem("last_rec_no");
}

function validateData()
{
    var empid,empname,empsal,hra,da,deduct;
    empid=$('#empid').val();
    empname=$('#empname').val();
    empsal =$('#empsal').val();
    hra =$('#hra').val();
    da =$('#da').val();
    deduct=$('#deduct').val();

    if(empid === ''){
        alert('Employee Id needed');
        $('#empid').focus();
        return "";
    }
    if(empname === ''){
        alert('Employee Name needed');
        $('#empname').focus();
        return "";
    }
    if(empsal === ''){
        alert('Employee Salary needed');
        $('#empsal').focus();
        return "";
    }
    if(hra === ''){
        alert('HRA missing');
        $('#hra').focus();
        return "";
    }
    if(da === ''){
        alert('DA missing');
        $('#da').focus();
        return "";
    }
    if(deduct === ''){
        alert('Deduction missing');
        $('#deduct').focus();
        return "";
    }

    var jsonStrObj = {
           id: empid,
           name: empname,
           salary: empsal,
           hra: hra,
           da: da,
           deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}

function getEmpFromEmpId()
{
    var empid = $('#empid').val();
    var jsonStr = { id: empid};
    var empIdJsonObj = JSON.stringify(jsonStr);

    var getRequest = createGET_BY_KEYRequest(conntoken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400)
    {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#empname').focus();
    }
    else if ( resJsonObj.status === 200)
    {
        $('#empid').prop('disabled', true);
        fillData(resJsonObj);
        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#empname').focus();
    }
}


function showData(jsonObj)
{
    if(jsonObj.status === 400){
        return "";
    }
    var data = (JSON.parse(jsonObj.data)).record;
    setCurrRecNo2LS(jsonObj);
    $('#empid').val(data.id);
    $('#empname').val(data.name);
    $('#empsal').val(data.salary);
    $('#hra').val(data.hra);
    $('#da').val(data.da);
    $('#deduct').val(data.deduction);

    disableNav(false);
    disableForm(true);

    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#new').prop('disabled', false);
    $('#edit').prop('disabled', false);

    if(getCurrRecNoFromLS() === getLastRecNoFromLS())
    {
        $('#next').prop('disabled', true);
        $('#last').prop('disabled', true);
    }
    if(getCurrRecNoFromLS() === getFirstRecNoFromLS())
    {
        $('#prev').prop('disabled', true);
        $('#first').prop('disabled', true);
        return ;
    }
}

function newForm()
{
    makeDataFormEmpty();
    disableForm(false);
    $('#empid').focus();
    disableNav(true);
    disableCtrl(true);

    $('#save').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function makeDataFormEmpty()
{
   $('#empid').val('');
   $('#empname').val('');
   $('#empsal').val('');
   $('#hra').val('');
   $('#da').val('');
   $('#deduct').val('');
}

function firstData()
{
    var getFirstRequest = createFIRST_RECORDRequest(conntoken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest, irlPartUrl);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async: true});
    $('#empid').prop('disabled', true);
    $('#first').prop('disabled', true);
    $('#prev').prop('disabled', true);
    $('#next').prop('disabled', false);
    $('#save').prop('disabled', true);
}

function prevData()
{
    var r = getCurrRecNoFromLS();
    if(r === 1)
    {
        $('#prev').prop('disabled', true);
        $('#first').prop('disabled', true);
    }
    var getPrevRequest = createPREV_RECORDRequest(conntoken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = getCurrRecNoFromLS();
    if(r === 1)
    {
        $('#first').prop('disabled', true);
        $('#prev').prop('disabled', true);
    }
    $('#save').prop('disabled', true);
}

function nextData()
{
    var r = getCurrRecNoFromLS();
   
    var getNextRequest = createNEXT_RECORDRequest(conntoken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getNextRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    
    $('#save').prop('disabled', true);
}

function lastData()
{
    var getLastRequest = createLAST_RECORDRequest(conntoken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest, irlPartUrl);
    setLastRecNo2LS(result);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $('#first').prop('disabled', false);
    $('#prev').prop('disabled', false);    
    $('#last').prop('disabled', true);    
    $('#next').prop('disabled', true);
    $('#save').prop('disabled', true);
}


function saveData()
{
   var jsonStrObj = validateData();
   if(jsonStrObj === ''){
       return '';
   }
   var putRequest =  createPUTRequest(conntoken, jsonStrObj, empDBName, empRelationName);
   jQuery.ajaxSetup({async:false});
   var jsonObj = executeCommand(putRequest, imlPartUrl);
   jQuery.ajaxSetup({async:true});
   if(isNoRecordPresentLS())
   {
      setFirstRecNo2LS(jsonObj);
   }
   setLastRecNo2LS(jsonObj);
   setCurrRecNo2LS(jsonObj);
   resetForm();
   
}

function editData()
{
    disableForm(false);

    $('#empid').prop('disabled', true);
    $('#empname').focus();
    disableNav(true);
    disableCtrl(true);
    $('#change').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function changeData()
{
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(conntoken, jsonChg, empDBName, empRelationName, getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(jsonObj);
    resetForm();
    $('#empid').focus();
    $('#edit').focus();
}



function isNoRecordPresentLS()
{
  if(getFirstRecNoFromLS() === '0' && getLastRecNoFromLS() === '0')
  {
    return true;
  }
  return false;
}

function isOnlyOneRecordPresent()
{
    if(isNoRecordPresentLS())
    {
        return false;
    }
    if(getFirstRecNoFromLS() === getLastRecNoFromLS())
    {
        return true;
    }
    return false;
}

function checkForNoOrOneRecord()
{
    if(isNoRecordPresentLS())
    {
        disableForm(true);
        disableNav(true);
        disabledCtrl(true);
        $('#new').prop('disabled', false);
        return;
    }
    if(isOnlyOneRecordPresent())
    {
        disableForm(true);
        disableNav(true);
        disabledCtrl(true);
        $('#new').prop('disabled', false);
        $('#edit').prop('disabled', false);
        return;
    }
}