// ////const { parseJSON } = require("jquery");

// var ctx = document.getElementById('myChart').getContext("2d");
// var datasets = []

// var dataset1 ={
//     fill: false,
//     label: "Curve0",
//     borderColor:"#ff6384",
//     data: [{
//         x: 7,
//         y: 5
//     }, {
//         x: 19,
//         y: -1
//     }]
// }

// datasets.push(dataset1)

// const data = {
//   datasets: [{
//     label: 'First Dataset',
//     data: [{
//       x: 20,
//       y: 30,
//       r: 15
//     }, {
//       x: 40,
//       y: 10,
//       r: 10
//     }],
//     backgroundColor: 'rgb(255, 99, 132)'
//   }]
// };

// var oi = new Chart(ctx, {
//     type: 'line',
//     data: {
//         datasets:datasets
//     },
//     options: {
//         elements: {
//             point: {
//                 radius: 1
//             }
//         },
//         stacked: true,
//         animation: {
//             duration: 0
//         },
//         scales: {
//             xAxes: [{
//                 position: 'bottom',
//                 type: "linear",

//             }],

//         }
//     }
// });
// function addCurve(input) {
//     let index = input.parentNode.id.slice(-1)
//     let listT = []
//     for (i = 0; i < 100; i++) {
//         listT.push(i*0.1)
//     }
//     regex = /([,.()/+\-*])/g
//     xt = document.getElementById("X" + index).value.split(regex)
//     for (i = 0; i < xt.length; i++) {
//         if (Math[xt[i]] != undefined) { xt[i] = "Math." + xt[i] }
//     }
//     xt = xt.join('')

//     yt = document.getElementById("Y" + index).value.split(regex)
//     for (i = 0; i < yt.length; i++) {
//         if (Math[yt[i]] != undefined) { yt[i] = "Math." + yt[i] }
//     }
//     yt = yt.join('')

//     data=[]
//     listT.forEach(t => {
//         data.push({ x: eval(xt), y: eval(yt)})
//     })

//     var set = {
//         fill: false,
//         label: "Curve"+index,
//         data: data
//     }
//     if (datasets.map(i=>i['label']).includes(set.label) )
//     {
//         datasets.forEach(curve => {
//             if (curve["label"] == set["label"]) {
//                 curve.data = data
//             }
//         })
//     } else {
//         datasets.push(set)
//     }
//     oi.update()
// }



// var total=0
// function duplicate() {
//     var original = document.getElementById('curve' + total);
//     total++;
//     var clone = original.cloneNode(true); 
//     clone.children[0].children[0].id = "X" + total
//     clone.children[1].children[0].id = "Y" + total
//     clone.id = "curve" + total; 
//     original.parentNode.appendChild(clone);
// }

// Charting
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

var layout = {}
var chartData = [
  {
    z: [[1, 90, 30], [20, 1, 60], [30, 60, 1],[2,65,9]],
    type: 'heatmap',
    colorscale: 'Jet'
  },
  {
    x: [null],
    y: [null],
    type: 'scatter',
    color: 'white'
  }
];

var inputs= [];
var defaultValue =[];
// DEBUG
defaultValue["atk"] = 0
defaultValue["datk"] = 0
defaultValue["stat"] = 0
defaultValue["dstat"] = 0
defaultValue["statMulti"] = 0

defaultValue["stat2Multi"] = 0

defaultValue["stat2"] = 0
defaultValue["dstat2"] = 0
defaultValue["crit"] = 0
defaultValue["dcrit"] = 0
defaultValue["cdmg"] = 2

Object.keys(defaultValue).forEach(key => inputs[key] = defaultValue[key]);


// const deltaY =(yMax-yMin)/yScale
// window.addEventListener('load', function d() { Plotly.newPlot('chart', chartData) });

function updateGraph(newArray) {
  chartData[0].z = newArray;
  chartData[0].x = range(atkMin, atkMax, deltaAtk)
  layout = {
    xaxis:{
      label:"Oi"
    }
  }
  Plotly.react('chart', chartData,layout);
}
function reDraw(){
  let atkRange = range(atkMin,atkMax, deltaAtk)
  let yRange = range(yMin,yMax, deltaY)
  let datk= inputs["datk"]
  let dcrit = inputs["dcrit"]
  let cdmg = inputs["critdmg"]
  var z = [];
  yRange.forEach( (crit, _) =>{
    var line =[];
    atkRange.forEach((atk, _) =>{
      line.push(formula_crit_atk(atk,datk,crit, dcrit,cdmg))
    });
    z.push(line);
  })
  return z;
}

function run(){
  //check inputs vides
  var [tempAtk, tempDAtk] = formula_datk_from_stat(inputs)
  var result = formula(inputs)
  if(result){
    set("outputResult", result);
    show("outputResult")
  }
}
function checkInputs(){
document.cookie
}
// Calculation
function formula(obj){//atk,datk,crit,dcrit,cdmg){
  var [atk,datk] = formula_datk_from_stat(inputs)

  return (1 + datk/atk)*(1+obj["dcrit"]/
            (1/(obj["cdmg"]-1) + obj["crit"] ))
}

function formula_datk_from_stat(obj){//atk,datk,stat,dstat,statMulti,stat2=0,dstat2=0,stat2Multi=1){
  
  return [obj["atk"] + obj["stat"]*obj["statMulti"] + obj["stat2"]*obj["stat2Multi"],
    obj["datk"] + obj["dstat"]*obj["statMulti"] + obj["dstat2"]*obj["stat2Multi"]];
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
    this.inputs[key] = input.value != '' ? parseFloat(input.value):0
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