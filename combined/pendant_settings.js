const chainHeightSlider = document.querySelector("#chainHeightSlider");
const outputChain = document.querySelector(".chainHeightSlider-output");

chainHeightSlider.addEventListener("input", function () {
  outputChain.textContent = chainHeightSlider.value;
});

const necklaceHeightSlider = document.querySelector("#necklaceHeightSlider");
const outputNecklace = document.querySelector(".necklaceHeightSlider-output");

necklaceHeightSlider.addEventListener("input", function () {
  outputNecklace.textContent = necklaceHeightSlider.value;
});

let necklace = new Image();
let chain = new Image();

let imagesNecklaceList = document.getElementById("necklaceList");
const imageNecklaceInput = document.querySelector("#imageNecklaceInput");
let selectedNecklaceImageId = "";
const imagesNecklace = [];

let imagesChainList = document.getElementById("chainList");
const imageChainInput = document.querySelector("#imageChainInput");
let selectedChainImageId = "";
const imagesChain = [];

let exponentialSmoothingZ = 0.6;
const eyesDistanceMM = 100;
const relativeChainWidth = 0.35;

let poseLandmarks11SmoothedX = [];
let poseLandmarks12SmoothedX = [];
let poseLandmarks11SmoothedY = [];
let poseLandmarks12SmoothedY = [];
let poseLandmarks11SmoothedZ = [];
let poseLandmarks12SmoothedZ = [];

let poseLandmarks3SmoothedX = [];
let poseLandmarks6SmoothedX = [];
let poseLandmarks3SmoothedY = [];
let poseLandmarks6SmoothedY = [];
let poseLandmarks3SmoothedZ = [];
let poseLandmarks6SmoothedZ = [];