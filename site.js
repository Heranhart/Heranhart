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

var showCrit = true;
// DEBUG
inputs["atk"] = 0
inputs["datk"] = 0
inputs["stat"] = 0
inputs["dstat"] = 0
inputs["stat2"] = 0
inputs["dstat2"] = 0
inputs["crit"] = 0
inputs["dcrit"] = 0
inputs["critdmg"] = 2
// let atkMin = 2e6;
// let atkMax = 7e6;
// let atkScale = 1000;
// const deltaAtk = (atkMax-atkMin)/atkScale
// let yMin = 0.0;
// let yMax = 1.0;
// let yScale= 100;
const deltaY =(yMax-yMin)/yScale
window.addEventListener('load', function d() { Plotly.newPlot('chart', chartData) });

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
  checkInputs();
  //updateGraph(reDraw())
}
function checkInputs(mode = null){
  let checkArray= ["atk","datk","crit","dcrit","critdmg"]
  checkArray.forEach(str =>{
    if(inputs[str] == undefined){
      alert("The "+str+" input needs to be filled !");
      throw new Error("missing input")
    }
  })
}// Calculation
function formula_crit_atk(atk,datk,crit,dcrit,cdmg){
  return (1 + datk/atk)*(1+dcrit/(1/(cdmg-1) + crit ))
}

function formula_fd_atk(atk,datk,fd,dfd){
  return (1 + datk/atk)*(dfd/fd)
}
function formula_atk_from_stat(atk,datk,stat,dstat,statMulti,stat2=0,dstat2=0,stat2Multi=1){
  return atk + stat*statMulti + stat2*stat2Multi,
    datk + dstat*statMulti + dstat2*stat2Multi;
}

//#region Utils
function show(id){
  document.getElementById(id).show()
}

function hide(id){
  document.getElementById(id).hide()
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
