const watchJewelryImage = new Image();

const watchImagesList = document.querySelector("#watchImageList");
const watchImageInput = document.querySelector("#watchImageInput");
let watchSelectedImageId = "";
const watchImages = [];

const wristWidth = 4.7; //cm

const palmJewelryWidthCoef = 0.7;
const centerCoef = 0.5;

const tooCloseRatio = 0.4;
const tooFarRatio = 0.05;

let landmarks0X = [0, 0];
let landmarks5X = [0, 0];
let landmarks17X = [0, 0];
let landmarks0Y = [0, 0];
let landmarks5Y = [0, 0];
let landmarks17Y = [0, 0];
let landmarks0Z = [0, 0];
let landmarks5Z = [0, 0];
let landmarks17Z = [0, 0];

let HAND;