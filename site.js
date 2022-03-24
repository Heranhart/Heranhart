var inputs= [];
var defaultValue =[];
defaultValue["atk"] = 0
defaultValue["datk"] = 0
defaultValue["dstat"] = 0
defaultValue["statMulti"] = 0
defaultValue["stat2Multi"] = 0
defaultValue["dstat2"] = 0
defaultValue["crit"] = 0
defaultValue["dcrit"] = 0
defaultValue["cdmg"] = 2

Object.keys(defaultValue).forEach(key => inputs[key] = defaultValue[key]);

function run(){
  Object.keys(defaultValue).forEach(key =>{ 
    if(!inputs[key])
      inputs[key] = defaultValue[key]
  });
  var result = formula(inputs)
  if(result){
    set("outputResultMessage", "Relative damage variation = "+result.toFixed(2))
    var message = "These changes will lead on average to a ";
    if(result > 1)
      message += "gain of "+ (result*100 - 100).toFixed(2) + "%";
    if(result < 1)
    message += "loss of "+ (1/result*100-100).toFixed(2)  + "%";
    set("outputResultExplained",message);
    show("outputResult")
  }
}
// Calculation
function formula(obj){
  var datk = formula_datk_from_stat(inputs)

  return (1 + datk/obj["atk"])*(1+obj["dcrit"]/
            (1/(obj["cdmg"]-1) + obj["crit"] ))
}

function formula_datk_from_stat(obj){
  return obj["datk"] + obj["dstat"]*obj["statMulti"] + obj["dstat2"]*obj["stat2Multi"];
}

//#region Utils
function show(id){
  document.getElementById(id).hidden = false;
}

function hide(id){
  document.getElementById(id).hidden = true;
}

function get(id){
  return document.getElementById(id).value;
}

function set(id,value){
  document.getElementById(id).value = value;
}
function print(id){
  console.log(document.getElementById(id).value)
}
function addInput(key,input){
    this.inputs[key] = input.value != '' ? parseFloat(input.id.match("(input)D?Crit")? input.value *0.01 : input.value):0
}

function switchMode(mode){
  switch(mode){
    case "patk":
      break;
    default: alert("what ?");
  }
}
//#endregion
//#region Cookie helper
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
//#endregion