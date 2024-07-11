let jewelryImage = new Image();

let JewelryWidth;
let JewelryHeight;

let imagesList = document.getElementById("imagesList");
const imageInput = document.querySelector("#imageInput");

let selectedImageId = "";

const images = [];

const faceHeight = 190; //mm

// let xAccelerationThreshold = 0.5;
let xVelocityThreshold = 0.05;

let startShaking = false;
let startDumping = false;

let shakingAngle = 0;
let shakingPeriod = 750; //ms
let angleAmplitude = 0.2; //rad

const gamma = 0.0004;
let dumpingCoef = 1;

const numShakingPeriods = 5;

let poseLandmarks93SmoothedX = [];
let poseLandmarks137SmoothedX = [];
let poseLandmarks123SmoothedX = [];
let poseLandmarks352SmoothedX = [];
let poseLandmarks366SmoothedX = [];
let poseLandmarks323SmoothedX = [];

let poseLandmarks234SmoothedY = [];
let poseLandmarks93SmoothedY = [];
let poseLandmarks132SmoothedY = [];
let poseLandmarks58SmoothedY = [];

let poseLandmarks454SmoothedY = [];
let poseLandmarks323SmoothedY = [];
let poseLandmarks361SmoothedY = [];
let poseLandmarks288SmoothedY = [];

let poseLandmarks4SmoothedY = [];

let xVelocity;
let xVelocityArray = [];

const jewelryWidthRatio = 0.1;
const finalVideoRatio = 1;

const elongationX = 0.2;
const elongationY = 2.55;

let userInputEarringHeight; // mm
