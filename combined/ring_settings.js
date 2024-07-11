const shank = new Image();
const gem = new Image();

var gemWidth;

const userGemWeight = document.querySelector("#gemWeight");
const userSelectShape = document.querySelector("#selectShape");
const userHeightFormat = document.querySelector("#heightFormat");
const userGemHeight = document.querySelector("#userInputGemHeight");
let shapeList = document.getElementById("selectShape");

const imagesShankList = document.querySelector("#imageShankList");
const imageShankInput = document.querySelector("#imageShankInput");
let selectedShankImageId = "";
const imagesShank = [];

const imagesGemList = document.querySelector("#imageGemList");
const imageGemInput = document.querySelector("#imageGemInput");
let selectedGemImageId = "";
const imagesGem = [];


const ratio517 = 0.15;
const ratioMCPPIPZ = 0.15;

let fingerDiameter; //cm
let mcpLandmark;
let pipLandmark;

let fingerMCPX = [0];
let fingerPIPX = [0];
let fingerMCPY = [0];
let fingerPIPY = [0];
let fingerMCPZ = [0];
let fingerPIPZ = [0];

let ringFingerCenterCoef = 0.5;

let fingerWidthMCPPIPdistanceCoef = 0.3; // how many times finder width smaller than MCP PIP distance
let FINGER;

function changeValue(event){
    const asp = aspectRatioGem || 1;
    gemWidth = sizeOnForm(asp, userInput("gemWeight"), shapeList.options[shapeList.selectedIndex].text);
    if (document.getElementById("heightFormat").value == "mm"){
      document.getElementById('userInputGemHeight').value = Math.round(gemWidth * asp * 10 * 100) / 100;
    }
    if (document.getElementById("heightFormat").value == "inch"){
      document.getElementById('userInputGemHeight').value = Math.round(gemWidth * asp / 2.54 * 100) / 100;
    }
}
  
function changeHeightFormat(event){
    if (document.getElementById("heightFormat").value == "mm"){
      document.getElementById('userInputGemHeight').value = document.getElementById('userInputGemHeight').value * 25.4;
    }
    if (document.getElementById("heightFormat").value == "inch"){
      document.getElementById('userInputGemHeight').value = document.getElementById('userInputGemHeight').value / 25.4;
    }
}
  
function changeHeightValue(event){
    const aspr = aspectRatioGem || 1;
    
    if (userHeightFormat.value == "mm"){
      gemWidth = userGemHeight.value / aspr / 10;
      userGemWeight.value = Math.round(caratFromHeight(aspr, gemWidth, shapeList.options[shapeList.selectedIndex].text) * 1000 * 100) / 100;
    }
    if (userHeightFormat.value == "inch"){
      gemWidth = userGemHeight.value / aspr * 2.54;
      userGemWeight.value = Math.round(caratFromHeight(aspr, gemWidth, shapeList.options[shapeList.selectedIndex].text) * 1000 * 100) / 100;
    }
}
  
userGemWeight.addEventListener("change", changeValue);
userSelectShape.addEventListener("change", changeValue);
userHeightFormat.addEventListener("change", changeHeightFormat);
userGemHeight.addEventListener("change", changeHeightValue);
  
function caratFromHeight(aspectRatio, width, form){
    var carat;
  
    if (form == 'Round'){
      carat = width * width * width * aspectRatio * 0.0061;
    }
  
    if (form == 'Oval'){
      carat = width * width * width * aspectRatio * 0.0062;
    }
  
    if (form == "Heart"){
      carat = width * width * width * aspectRatio * 0.0059;
    }
  
    if (form == "Triangular"){
      carat = width * width * width * aspectRatio * 0.0057;
    }
  
    if (form == "Emerald" || form == "Princess" || form == "Radiant"){
      const roundRatio = Math.round(aspectRatio * 4) / 4;
  
      if (roundRatio <= 1.25){
        carat = width * width * width * aspectRatio * 0.008;
      }
      if (roundRatio == 1.5 || roundRatio == 1.75){
        carat = width * width * width * aspectRatio * 0.0092;
      }
      if (roundRatio == 2 || roundRatio == 2.25){
        carat = width * width * width * aspectRatio * 0.01;
      }
      if (roundRatio >= 2.5){
        carat = width * width * width * aspectRatio * 0.0106;
      }
    }
  
    if (form == "Marquise"){
      const roundRatio = Math.round(aspectRatio * 2) / 2;
      if (roundRatio <= 1.5){
        carat = width * width * width * aspectRatio * 0.00565;
      }
      if (roundRatio == 2){
        carat = width * width * width * aspectRatio * 0.0058;
      }
      if (roundRatio == 2.5){
        carat = width * width * width * aspectRatio * 0.00585;
      }
      if (roundRatio >= 3){
        carat = width * width * width * aspectRatio * 0.00595;
      }
    }
  
    if (form == "Pear"){
      const roundRatio = Math.round(aspectRatio * 4) / 4;
      if (roundRatio <= 1.25){
        carat = width * width * width * aspectRatio * 0.00615;
      }
      if (roundRatio == 1.5){
        carat = width * width * width * aspectRatio * 0.006;
      }
      if (roundRatio == 1.75){
        carat = width * width * width * aspectRatio * 0.0059;
      }
      if (roundRatio >= 2){
        carat = width * width * width * aspectRatio * 0.00575;
      }
    }
  
    return carat;
}

function sizeOnForm(aspectRatio, gemWeight, form){
    let width;
  
    if (form == 'Round'){
      width = Math.cbrt(gemWeight / (aspectRatio * 0.0061)) / 10;
    }
  
    if (form == 'Oval'){
      width = Math.cbrt(gemWeight / (aspectRatio * 0.0062)) / 10;
    }
  
    if (form == "Heart"){
      width = Math.cbrt(gemWeight / (aspectRatio * 0.0059)) / 10;
    }
  
    if (form == "Triangular"){
      width = Math.cbrt(gemWeight / (aspectRatio * 0.0057)) / 10;
    }
  
    if (form == "Emerald" || form == "Princess" || form == "Radiant"){
      const roundRatio = Math.round(aspectRatio * 4) / 4;
  
      if (roundRatio <= 1.25){
        width = Math.cbrt(gemWeight / (0.008 * aspectRatio)) / 10;
      }
      if (roundRatio == 1.5 || roundRatio == 1.75){
        width = Math.cbrt(gemWeight / (0.0092 * aspectRatio)) / 10;
      }
      if (roundRatio == 2 || roundRatio == 2.25){
        width = Math.cbrt(gemWeight / (0.01 * aspectRatio)) / 10;
      }
      if (roundRatio >= 2.5){
        width = Math.cbrt(gemWeight / (0.0106 * aspectRatio)) / 10;
      }
    }
  
    if (form == "Marquise"){
      const roundRatio = Math.round(aspectRatio * 2) / 2;
      if (roundRatio <= 1.5){
        width = Math.cbrt(gemWeight / (0.00565 * aspectRatio)) / 10;
      }
      if (roundRatio == 2){
        width = Math.cbrt(gemWeight / (0.0058 * aspectRatio)) / 10;
      }
      if (roundRatio == 2.5){
        width = Math.cbrt(gemWeight / (0.00585 * aspectRatio)) / 10;
      }
      if (roundRatio >= 3){
        width = Math.cbrt(gemWeight / (aspectRatio * 0.00595)) / 10;
      }
    }
  
    if (form == "Pear"){
      const roundRatio = Math.round(aspectRatio * 4) / 4;
      if (roundRatio <= 1.25){
        width = Math.cbrt(gemWeight / (aspectRatio * 0.00615)) / 10;
      }
      if (roundRatio == 1.5){
        width = Math.cbrt(gemWeight / (aspectRatio * 0.006)) / 10;
      }
      if (roundRatio == 1.75){
        width = Math.cbrt(gemWeight / (aspectRatio * 0.0059)) / 10;
      }
      if (roundRatio >= 2){
        width = Math.cbrt(gemWeight / (aspectRatio * 0.00575)) / 10;
      }
    }
  
    return width;
  }
  

let dropDownList = document.getElementById("selectFinger");