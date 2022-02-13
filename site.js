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

var chartData = [
  {
    z: [[1, 90, 30], [20, 1, 60], [30, 60, 1],[2,65,9]],
    type: 'heatmap'
  }
];

var inputs= [];

let atkMin = 2e6;
let atkMax = 7e6;
let atkScale = 1000;
let yMin = 0.0;
let yMax = 1.0;
let yScale= 0.05;
window.addEventListener('load', function oi() { Plotly.newPlot('chart', chartData) });

function updateGraph() {
  chartData[0].z = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  Plotly.react('chart', chartData);
}
function reDraw(){
  let atkRange = Math.range(atkMin,atkMax, (atkMax-atkMin)/atkScale)
  let yRange = Math.range(yMin,yMax, (yMax-yMin)/yScale)
  var z = [];
  yRange.forEach( (crit, _) =>{
    var line =[];
    atkRange.forEach((atk, _) =>{
      line.push(formula_crit_atk())
    });
    z.push(line);
  })
  return z;
}

function run(){
  checkInputs();
  
}
// Calculation
function formula_crit_atk(atk,datk,crit,dcrit,cdmg){
  return (1 + datk/atk)*(1+dcrit/(1/(cdmg-1) + crit ))
}

function formula_fd_atk(atk,datk,fd,dfd){
  return (1 + datk/atk)*(dfd/fd)
}

// Utils
function show(id){
  document.getElementById(id).show()
}

function hide(id){
  document.getElementById(id).hide()
}

function print(id){
  console.log(document.getElementById(id).value)
}

function addInput(key,input){
    this.inputs[key] = input.value != '' ? parseFloat(input.value):0
}

function checkInputs(mode = null){
  let checkArray= ["atk","datk","crit","dcrit","critdmg"]
  checkArray.forEach(str =>{
    if(!inputs.includes(str)){
      alert("The "+str+" input needs to be filled !");
      throw new Error("missing input")
    }
  })
}