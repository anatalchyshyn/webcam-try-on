const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

videoElement.style.cssText =
  "-moz-transform: scale(-1, 1); \
-webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
transform: scale(-1, 1); filter: FlipH;";

let currentTimeEnd;
let FPS;
let startShakingTime;

const canvasWidth = canvasElement.width;
const canvasHeight = canvasElement.height;

function updateSelectOptions(data, list, selectedImageId) {
  list.textContent = "";

  data.forEach((image) => {
    const option = document.createElement("option");
    option.setAttribute("data-id", image.id);
    option.textContent = image.name;

    if (image.id === selectedImageId) option.selected = true;

    list.append(option);
  });
  updateSelectOptions;
}

function onFileSelected(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  let image = this.image;
  let imageList = this.imageList;
  let selectedId = this.selectedId;

  reader.onloadend = function (e) {
    const {
      target: { result },
    } = e;
    const { name } = file;

    image.unshift({ id: `${image.length}-${name}`, name, src: result });

    updateSelectOptions(image,
      imageList,
      selectedId);
  };
  reader.readAsDataURL(file);
}

imageInput.addEventListener("change", {handleEvent: onFileSelected, image: images, imageList: imagesList, selectedId: selectedImageId});
imageNecklaceInput.addEventListener("change", {handleEvent: onFileSelected, image: imagesNecklace, imageList: imagesNecklaceList, selectedId: selectedNecklaceImageId});
imageChainInput.addEventListener("change", {handleEvent: onFileSelected, image: imagesChain, imageList: imagesChainList, selectedId: selectedChainImageId});
watchImageInput.addEventListener("change", {handleEvent: onFileSelected, image: watchImages, imageList: watchImagesList, selectedId: watchSelectedImageId});
imageShankInput.addEventListener("change", {handleEvent: onFileSelected, image: imagesShank, imageList: imagesShankList, selectedId: selectedShankImageId});
imageGemInput.addEventListener("change", {handleEvent: onFileSelected, image: imagesGem, imageList: imagesGemList, selectedId: selectedGemImageId});


let exponentialSmoothing = 0.5;
let i = 0;
let totalCounts = 0;

function onFileSelectedNecklace(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend = function (e) {
    const {
      target: { result },
    } = e;
    const { name } = file;

    imagesNecklace.unshift({
      id: `${imagesNecklace.length}-${name}`,
      name,
      src: result,
    });

    updateSelectOptions(
      imagesNecklace,
      imagesNecklaceList,
      selectedNecklaceImageId
    );
  };
  reader.readAsDataURL(file);
}

//imageNecklaceInput.addEventListener("change", onFileSelectedNecklace);

function onFileSelectedChain(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend = function (e) {
    const {
      target: { result },
    } = e;
    const { name } = file;

    imagesChain.unshift({
      id: `${imagesChain.length}-${name}`,
      name,
      src: result,
    });

    updateSelectOptions(imagesChain, imagesChainList, selectedChainImageId);
  };
  reader.readAsDataURL(file);
}

//imageChainInput.addEventListener("change", onFileSelectedChain);

function userInput(elemntId) {
  let variable = document.getElementById(elemntId).value;
  return variable;
}

//Aspect ratio
let aspectRatio;
jewelryImage.addEventListener("load", () => {
  aspectRatio = jewelryImage.naturalHeight / jewelryImage.naturalWidth;
});

let aspectRatioNecklace;
necklace.addEventListener("load", () => {
  aspectRatioNecklace = necklace.naturalHeight / necklace.naturalWidth;
});

let aspectRatioChain;
chain.addEventListener("load", () => {
  aspectRatioChain = chain.naturalHeight / chain.naturalWidth;
});

let aspectRatioWatch;
watchJewelryImage.addEventListener("load", () => {
  aspectRatioWatch = watchJewelryImage.naturalHeight / watchJewelryImage.naturalWidth;
});

let aspectRatioShank;
shank.addEventListener("load", () => {
  aspectRatioShank = shank.naturalHeight / shank.naturalWidth;
});

let aspectRatioGem;
gem.addEventListener("load", () => {
  aspectRatioGem = gem.naturalHeight / gem.naturalWidth;
});

function pointsDistance2D(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function pointsDistance3D(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}

//Draw keypoints
function drawKeyPoint(landmarks, num, color = "orange", radius = 5) {
  drawPoint(
    landmarks[num].x * videoElement.videoWidth * finalVideoRatio,
    landmarks[num].y * videoElement.videoHeight * finalVideoRatio,
    String(num),
    color,
    radius
  );
}

function drawPoint(x, y, label = true, color = "orange", size = 5) {
  // if (color == null) {
  //   color = "#000";
  // }

  // if (size == null) {
  //   size = 5;
  // }

  let radius = 0.5 * size;

  // to increase smoothing for numbers with decimal part
  let pointX = Math.round(x - radius);
  let pointY = Math.round(y - radius);

  canvasCtx.beginPath();
  canvasCtx.fillStyle = color;
  canvasCtx.fillRect(pointX, pointY, size, size);
  canvasCtx.fill();

  if (label) {
    let textX = Math.round(x);
    let textY = Math.round(pointY - 5);

    canvasCtx.font = "Italic 14px Arial";
    canvasCtx.fillStyle = color;
    canvasCtx.textAlign = "center";
    canvasCtx.fillText(label, textX, textY);
  }
}

function drawEarring(
  outterLandMarkX,
  middleLandmarkX,
  innerLandMarkX,
  secondY,
  thirdY,
  noseY,
  anotherEarY,
  jewelryImage,
  side,
  angle
) {
  let drawCondition;
  if (side === "left") {
    drawCondition = innerLandMarkX > outterLandMarkX;
  } else if (side === "right") {
    drawCondition = outterLandMarkX > innerLandMarkX;
  }

  if (drawCondition) {
    let CenterX;

    if (middleLandmarkX - outterLandMarkX > 0) {
      CenterX =
        outterLandMarkX - (middleLandmarkX - outterLandMarkX) * elongationX;
    } else {
      CenterX =
        outterLandMarkX + (outterLandMarkX - middleLandmarkX) * elongationX;
    }

    let dy;
    let balanced_ear;

    if (anotherEarY){
      balanced_ear = (thirdY + anotherEarY) / 2;
    }
    else{
      balanced_ear = thirdY;
    }

    if (noseY > balanced_ear){
      dy = secondY - (balanced_ear - noseY) * 0.3;
    }
    else{
      dy = secondY + (balanced_ear - noseY) * 0.35;
    }

    canvasCtx.translate(
      CenterX * canvasElement.width,
      dy * canvasElement.height
    );

    canvasCtx.rotate(angle);

    canvasCtx.drawImage(
      jewelryImage,
      (-JewelryWidth / 2) * canvasElement.width,
      0,
      JewelryWidth * canvasElement.width,
      JewelryHeight * canvasElement.width
    );

    canvasCtx.rotate(-angle);

    canvasCtx.translate(
      -CenterX * canvasElement.width,
      -dy * canvasElement.height
    );
  }
}

function smoothArray(smoothedArray, previousValue, currentValue) {
  return smoothedArray.push(
    previousValue * exponentialSmoothing +
      currentValue * (1 - exponentialSmoothing)
  );
}

function drawEarrings(landmarks, i){
  userInputEarringHeight = userInput("earringHeight") * 10 || 30; 

  const option = imagesList.options[imagesList.selectedIndex];
  const imageId = option && option.dataset.id;
  selectedImageId = imageId;
  const image = images.find((elem) => elem.id === imageId) || {};

  jewelryImage.src = image.src || "";

  const canvasAspectRatio = canvasElement.height / canvasElement.width;

  if (i === 0) {
    poseLandmarks93SmoothedX.push(landmarks[93].x);
    poseLandmarks137SmoothedX.push(landmarks[137].x);
    poseLandmarks123SmoothedX.push(landmarks[123].x);
    poseLandmarks352SmoothedX.push(landmarks[352].x);
    poseLandmarks366SmoothedX.push(landmarks[366].x);
    poseLandmarks323SmoothedX.push(landmarks[323].x);

    poseLandmarks234SmoothedY.push(landmarks[234].y);
    poseLandmarks93SmoothedY.push(landmarks[93].y);
    poseLandmarks132SmoothedY.push(landmarks[132].y);
    poseLandmarks58SmoothedY.push(landmarks[58].y);

    poseLandmarks454SmoothedY.push(landmarks[454].y);
    poseLandmarks323SmoothedY.push(landmarks[323].y);
    poseLandmarks361SmoothedY.push(landmarks[361].y);
    poseLandmarks288SmoothedY.push(landmarks[288].y);

    poseLandmarks4SmoothedY.push(landmarks[4].y);

    xVelocityArray.push(0);
    // xAccelerationArray.push(0);
  } else {
    smoothArray(
      poseLandmarks93SmoothedX,
      poseLandmarks93SmoothedX[poseLandmarks93SmoothedX.length - 1],
      landmarks[93].x
    );
    smoothArray(
      poseLandmarks137SmoothedX,
      poseLandmarks137SmoothedX[poseLandmarks137SmoothedX.length - 1],
      landmarks[137].x
    );
    smoothArray(
      poseLandmarks123SmoothedX,
      poseLandmarks123SmoothedX[poseLandmarks123SmoothedX.length - 1],
      landmarks[123].x
    );
    smoothArray(
      poseLandmarks352SmoothedX,
      poseLandmarks352SmoothedX[poseLandmarks352SmoothedX.length - 1],
      landmarks[352].x
    );
    smoothArray(
      poseLandmarks366SmoothedX,
      poseLandmarks366SmoothedX[poseLandmarks366SmoothedX.length - 1],
      landmarks[366].x
    );
    smoothArray(
      poseLandmarks323SmoothedX,
      poseLandmarks323SmoothedX[poseLandmarks323SmoothedX.length - 1],
      landmarks[323].x
    );


    smoothArray(
      poseLandmarks234SmoothedY,
      poseLandmarks234SmoothedY[poseLandmarks234SmoothedY.length - 1],
      landmarks[234].y
    );
    smoothArray(
      poseLandmarks93SmoothedY,
      poseLandmarks93SmoothedY[poseLandmarks93SmoothedY.length - 1],
      landmarks[93].y
    );
    smoothArray(
      poseLandmarks132SmoothedY,
      poseLandmarks132SmoothedY[poseLandmarks132SmoothedY.length - 1],
      landmarks[132].y
    );
    smoothArray(
      poseLandmarks58SmoothedY,
      poseLandmarks58SmoothedY[poseLandmarks58SmoothedY.length - 1],
      landmarks[58].y
    );


    smoothArray(
      poseLandmarks454SmoothedY,
      poseLandmarks454SmoothedY[poseLandmarks454SmoothedY.length - 1],
      landmarks[454].y
    );
    smoothArray(
      poseLandmarks323SmoothedY,
      poseLandmarks323SmoothedY[poseLandmarks323SmoothedY.length - 1],
      landmarks[323].y
    );
    smoothArray(
      poseLandmarks361SmoothedY,
      poseLandmarks361SmoothedY[poseLandmarks361SmoothedY.length - 1],
      landmarks[361].y
    );
    smoothArray(
      poseLandmarks288SmoothedY,
      poseLandmarks288SmoothedY[poseLandmarks288SmoothedY.length - 1],
      landmarks[288].y
    );


    smoothArray(
      poseLandmarks4SmoothedY,
      poseLandmarks4SmoothedY[poseLandmarks4SmoothedY.length - 1],
      landmarks[4].y
    );


    // xDrift =
    //   (poseLandmarks123SmoothedX[i] -
    //     poseLandmarks123SmoothedX[i - 1] +
    //     poseLandmarks352SmoothedX[i] -
    //     poseLandmarks352SmoothedX[i - 1]) /
    //   2;

    // console.log("xDrift", xDrift);

    xVelocity =
      (Math.abs(
        poseLandmarks123SmoothedX[poseLandmarks123SmoothedX.length - 1] -
          poseLandmarks123SmoothedX[poseLandmarks123SmoothedX.length - 2]
      ) +
        Math.abs(
          poseLandmarks352SmoothedX[poseLandmarks352SmoothedX.length - 1] -
            poseLandmarks352SmoothedX[poseLandmarks352SmoothedX.length - 2]
        )) *
      FPS;

    //console.log("xVelocity", xVelocity);

    smoothArray(
      xVelocityArray,
      xVelocityArray[xVelocityArray.length - 1],
      xVelocity
    );
  }

  JewelryHeight =
    (userInputEarringHeight / faceHeight) *
    (landmarks[152].y - landmarks[168].y);

  JewelryWidth = JewelryHeight / aspectRatio;

  if (
    xVelocityArray[xVelocityArray.length - 1] > xVelocityThreshold &&
    startShaking === false
  ) {
    startShakingTime = Date.now();
    startDumpingTime = Date.now();
    startShaking = true;
  }

  if (
    startShaking === true &&
    Date.now() - startShakingTime < numShakingPeriods * shakingPeriod
  ) {

    if (xVelocityArray[xVelocityArray.length - 1] > xVelocityThreshold) {
      startDumpingTime = Date.now();
    }

    dumpingCoef = Math.exp(-gamma * (Date.now() - startDumpingTime));

    //console.log("dumpingCoef", dumpingCoef);

    shakingAngle =
      angleAmplitude *
      dumpingCoef *
      Math.cos(
        ((2 * Math.PI) / shakingPeriod) * (Date.now() - startShakingTime) +
          Math.PI / 2
      );
  }

  if (
    startShaking === true &&
    Date.now() - startShakingTime > numShakingPeriods * shakingPeriod
  ) {
    startShaking = false;
    shakingAngle = 0;
  }

  drawEarring(
    poseLandmarks93SmoothedX[poseLandmarks93SmoothedX.length - 1],
    poseLandmarks137SmoothedX[poseLandmarks137SmoothedX.length - 1],
    poseLandmarks123SmoothedX[poseLandmarks123SmoothedX.length - 1],
    poseLandmarks93SmoothedY[poseLandmarks93SmoothedY.length - 1],
    poseLandmarks132SmoothedY[poseLandmarks132SmoothedY.length - 1],
    poseLandmarks4SmoothedY[poseLandmarks4SmoothedY.length - 1],
    poseLandmarks361SmoothedY[poseLandmarks361SmoothedY.length - 1],
    jewelryImage,
    "left",
    shakingAngle
  );

  drawEarring(
    poseLandmarks323SmoothedX[poseLandmarks323SmoothedX.length - 1],
    poseLandmarks366SmoothedX[poseLandmarks366SmoothedX.length - 1],
    poseLandmarks352SmoothedX[poseLandmarks352SmoothedX.length - 1],
    poseLandmarks323SmoothedY[poseLandmarks323SmoothedY.length - 1],
    poseLandmarks361SmoothedY[poseLandmarks361SmoothedY.length - 1],
    poseLandmarks4SmoothedY[poseLandmarks4SmoothedY.length - 1],
    poseLandmarks132SmoothedY[poseLandmarks132SmoothedY.length - 1],
    jewelryImage,
    "right",
    shakingAngle
  );

  if (i > 1) {
    poseLandmarks93SmoothedX.shift();
    poseLandmarks137SmoothedX.shift();
    poseLandmarks123SmoothedX.shift();
    poseLandmarks352SmoothedX.shift();
    poseLandmarks366SmoothedX.shift();
    poseLandmarks323SmoothedX.shift();

    poseLandmarks234SmoothedY.shift();
    poseLandmarks93SmoothedY.shift();
    poseLandmarks132SmoothedY.shift();
    poseLandmarks58SmoothedY.shift();

    poseLandmarks454SmoothedY.shift();
    poseLandmarks323SmoothedY.shift();
    poseLandmarks361SmoothedY.shift();
    poseLandmarks288SmoothedY.shift();

    poseLandmarks4SmoothedY.shift();

    xVelocityArray.shift();
  }
}

function drawPendant(landmarks, i){
  //console.log(landmarks);
  let userInputNecklaceHeight = necklaceHeightSlider.value * 10 || 30; // mm
  let userInputChainHeight = chainHeightSlider.value * 10 || 150; // mm
  const optionNecklace = imagesNecklaceList.options[imagesNecklaceList.selectedIndex];
  const selectedNecklaceImageId = optionNecklace && optionNecklace.dataset.id;
  const imageNecklace = imagesNecklace.find((elem) => elem.id === selectedNecklaceImageId) || {};

  necklace.src = imageNecklace.src || "";

  const optionChain = imagesChainList.options[imagesChainList.selectedIndex];
  const selectedChainImageId = optionChain && optionChain.dataset.id;
  const imageChain = imagesChain.find((elem) => elem.id === selectedChainImageId) || {};

  chain.src = imageChain.src || "";

  //SMOOTHED COORDINATES
  let smoothed11X =
    poseLandmarks11SmoothedX[poseLandmarks11SmoothedX.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[11].x;

  let smoothed12X =
    poseLandmarks12SmoothedX[poseLandmarks12SmoothedX.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[12].x;

  let smoothed11Y =
    poseLandmarks11SmoothedY[poseLandmarks11SmoothedY.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[11].y;

  let smoothed12Y =
    poseLandmarks12SmoothedY[poseLandmarks12SmoothedY.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[12].y;

  let smoothed11Z =
    poseLandmarks11SmoothedZ[poseLandmarks11SmoothedZ.length - 1] *
      exponentialSmoothingZ +
    (1 - exponentialSmoothingZ) * landmarks[11].z;

  let smoothed12Z =
    poseLandmarks12SmoothedZ[poseLandmarks12SmoothedZ.length - 1] *
      exponentialSmoothingZ +
    (1 - exponentialSmoothingZ) * landmarks[12].z;

  //SMOOTHED COORDINATES
  let smoothed3X =
    poseLandmarks3SmoothedX[poseLandmarks3SmoothedX.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[3].x;

  let smoothed6X =
    poseLandmarks6SmoothedX[poseLandmarks6SmoothedX.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[6].x;

  let smoothed3Y =
    poseLandmarks3SmoothedY[poseLandmarks3SmoothedY.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[3].y;

  let smoothed6Y =
    poseLandmarks6SmoothedY[poseLandmarks6SmoothedY.length - 1] *
      exponentialSmoothing +
    (1 - exponentialSmoothing) * landmarks[6].y;

  let smoothed3Z =
    poseLandmarks3SmoothedZ[poseLandmarks3SmoothedZ.length - 1] *
      exponentialSmoothingZ +
    (1 - exponentialSmoothingZ) * landmarks[3].z;

  let smoothed6Z =
    poseLandmarks6SmoothedZ[poseLandmarks6SmoothedZ.length - 1] *
      exponentialSmoothingZ +
    (1 - exponentialSmoothingZ) * landmarks[6].z;

  let xCenter = (smoothed11X + smoothed12X) / 2;
  let yCenter = (smoothed11Y + smoothed12Y) / 2;

  let xDistanceShoulders = smoothed11X - smoothed12X;

  let yDistanceShoulders = smoothed11Y - smoothed12Y;

  let zDistanceShoulders = smoothed11Z - smoothed12Z;

  let angleZX = Math.atan((zDistanceShoulders * 0.4) / xDistanceShoulders);

  //DRAWING CONDITIONS
  if (smoothed12X > smoothed11X) {
    console.log("Please, turn around, your back is facing the camera");
    return;
  }
  if (
    (smoothed12X < landmarks[16].x &&
      landmarks[16].y < landmarks[14].y) ||
    (smoothed11X > landmarks[15].x &&
      landmarks[15].y < landmarks[13].y)
  ) {
    console.log("Necklace is occluded by hand");
    return;
  }
  if (angleZX > Math.PI / 4 || angleZX < -Math.PI / 4) {
    console.log(
      "please rotate your body, torso should be perpendicular to the camera"
    );
    return;
  }

  //PUSHING SMOOTHED COORDINATES
  if (i === 0) {
    poseLandmarks11SmoothedX.push(landmarks[11].x);
    poseLandmarks12SmoothedX.push(landmarks[12].x);
    poseLandmarks11SmoothedY.push(landmarks[11].y);
    poseLandmarks12SmoothedY.push(landmarks[12].y);
    poseLandmarks11SmoothedZ.push(landmarks[11].z);
    poseLandmarks12SmoothedZ.push(landmarks[12].z);

    poseLandmarks3SmoothedX.push(landmarks[3].x);
    poseLandmarks6SmoothedX.push(landmarks[6].x);
    poseLandmarks3SmoothedY.push(landmarks[3].y);
    poseLandmarks6SmoothedY.push(landmarks[6].y);
    poseLandmarks3SmoothedZ.push(landmarks[3].z);
    poseLandmarks6SmoothedZ.push(landmarks[6].z);
  } else {
    poseLandmarks11SmoothedX.push(smoothed11X);
    poseLandmarks12SmoothedX.push(smoothed12X);
    poseLandmarks11SmoothedY.push(smoothed11Y);
    poseLandmarks12SmoothedY.push(smoothed12Y);
    poseLandmarks11SmoothedZ.push(smoothed11Z);
    poseLandmarks12SmoothedZ.push(smoothed12Z);

    poseLandmarks3SmoothedX.push(smoothed3X);
    poseLandmarks6SmoothedX.push(smoothed6X);
    poseLandmarks3SmoothedY.push(smoothed3Y);
    poseLandmarks6SmoothedY.push(smoothed6Y);
    poseLandmarks3SmoothedZ.push(smoothed3Z);
    poseLandmarks6SmoothedZ.push(smoothed6Z);
  }

  let xDistanceEyes = smoothed3X - smoothed6X;

  let yDistanceEyes = smoothed3Y - smoothed6Y;

  let zDistanceEyes = smoothed3Z - smoothed6Z;

  let dWidthShoulders = Math.sqrt(
    (xDistanceShoulders * canvasElement.width) ** 2 +
      (yDistanceShoulders * canvasElement.height) ** 2 +
      (zDistanceShoulders * canvasElement.width * 0.25) ** 2
  );

  let dWidthEyes = Math.sqrt(
    (xDistanceEyes * canvasElement.width) ** 2 +
      (yDistanceEyes * canvasElement.height) ** 2 +
      (zDistanceEyes * canvasElement.width * 0.25) ** 2
  );

  let ShouldersDistanceMM = (dWidthShoulders * eyesDistanceMM) / dWidthEyes;

  //console.log("ShouldersDistanceMM", ShouldersDistanceMM);

  let dWidthMM = userInputNecklaceHeight / aspectRatioNecklace;

  let relativeJewelryWidth = dWidthMM / ShouldersDistanceMM;

  let dWidth = (dWidthShoulders * relativeJewelryWidth) / canvasElement.width;

  let dWidthChain =
    (dWidthShoulders * relativeChainWidth) / canvasElement.width;

  let dHeight = dWidth * aspectRatioNecklace;

  let dHeightChain =
    ((userInputChainHeight / ShouldersDistanceMM) * dWidthShoulders) /
    canvasElement.width;

  let angleYX = Math.atan(
    (yDistanceShoulders * canvasElement.height) /
      (xDistanceShoulders * canvasElement.width)
  );

  // // Working
  canvasCtx.translate(
    xCenter * canvasElement.width,
    //yCenter * canvasElement.height
    (yCenter + dHeightChain * 0.7) * canvasElement.height - 75 / (eyesDistanceMM / dWidthEyes)
  );

  canvasCtx.transform(
    1,
    angleYX,
    angleZX * 0.5,
    1,
    (Math.sin(angleZX) * dWidthShoulders) / 2,
    0
  );

  canvasCtx.drawImage(
    chain,
    -dWidthChain * 0.5 * canvasElement.width,
    -dHeightChain * 0.5 * canvasElement.width,
    dWidthChain * canvasElement.width,
    dHeightChain * canvasElement.width
  );

  canvasCtx.drawImage(
    necklace,
    -dWidth * 0.5 * canvasElement.width,
    dHeightChain * 0.5 * canvasElement.width,
    dWidth * canvasElement.width,
    dHeight * canvasElement.width
  );

  // drawPoint(
  //   xCenter * canvasElement.width,
  //   yCenter * canvasElement.height,
  //   (label = false)
  // );

  if (i > 0) {
    poseLandmarks11SmoothedX.shift();
    poseLandmarks12SmoothedX.shift();
    poseLandmarks11SmoothedY.shift();
    poseLandmarks12SmoothedY.shift();
    poseLandmarks11SmoothedZ.shift();
    poseLandmarks12SmoothedZ.shift();

    poseLandmarks3SmoothedX.shift();
    poseLandmarks6SmoothedX.shift();
    poseLandmarks3SmoothedY.shift();
    poseLandmarks6SmoothedY.shift();
    poseLandmarks3SmoothedZ.shift();
    poseLandmarks6SmoothedZ.shift();
  }
}

function drawWatch(landmarks, i, label){

    let wristWatchWidthCoef = userInput("watchWidth") / wristWidth;
    const optionWatch = watchImagesList.options[watchImagesList.selectedIndex];
    const imageWatchId = optionWatch && optionWatch.dataset.id;
    const selectedWatchImageId = imageWatchId;
    const imageWatch = watchImages.find((elem) => elem.id === selectedWatchImageId) || {};

    watchJewelryImage.src = imageWatch.src || "";

    let watchExponentialSmoothing = 0.6;

    let smoothed0X = landmarks0X[landmarks0X.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[0].x;
    let smoothed5X = landmarks5X[landmarks5X.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[5].x;
    let smoothed17X = landmarks17X[landmarks17X.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[17].x;
    let smoothed0Y = landmarks0Y[landmarks0Y.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[0].y;
    let smoothed5Y = landmarks5Y[landmarks5Y.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[5].y;
    let smoothed17Y = landmarks17Y[landmarks17Y.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[17].y;
    let smoothed0Z = landmarks0Z[landmarks0Z.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[0].z;
    let smoothed5Z = landmarks5Z[landmarks5Z.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[5].z;
    let smoothed17Z = landmarks17Z[landmarks17Z.length - 1] * watchExponentialSmoothing + (1 - watchExponentialSmoothing) * landmarks[17].z;

    //DRAWING CONDITIONS
    let distance517 = pointsDistance2D(
      smoothed5X,
      smoothed5Y,
      smoothed17X,
      smoothed17Y
    );

    if (Math.abs(smoothed5Z - smoothed17Z) > distance517) {
      console.log("Palm should be perpendicular to the camera");
      return;
    }

    if (
      Math.abs((smoothed5Z + smoothed17Z) / 2 - smoothed0Z) >
      distance517 * 1.5
    ) {
      console.log("Palm should be at the same distance from camera as wrist");
      return;
    }

    if (label === "Right") {
      if (landmarks[17].x < landmarks[5].x * 0.9) {
        console.log("The outside of the palm shoud be facing the camera");
        return;
      }
    }

    if (label === "Left") {
      if (landmarks[5].x < landmarks[17].x * 0.9) {
        console.log("The outside of the palm shoud be facing the camera");
        return;
      }
    }

    //if (label === "Left") {
    // if (smoothed17X - smoothed5X < -distance517 * 0.5) {
    //    console.log("Outside of the palm should be facing the camera");
    //    return;
    //  }
    //}

    //if (label === "Right") {
    //  if (smoothed5X - smoothed17X < -distance517 * 0.5) {
    //    console.log("Outside of the palm should be facing the camera");
    //    return;
    //  }
    //}

    //PUSHING TO ARRAYS
    if (i == 0) {
      landmarks0X.push(landmarks[0].x);
      landmarks5X.push(landmarks[5].x);
      landmarks17X.push(landmarks[17].x);
      landmarks0Y.push(landmarks[0].y);
      landmarks5Y.push(landmarks[5].y);
      landmarks17Y.push(landmarks[17].y);
      landmarks0Z.push(landmarks[0].z);
      landmarks5Z.push(landmarks[5].z);
      landmarks17Z.push(landmarks[17].z);
    } else {
      landmarks0X.push(smoothed0X);
      landmarks5X.push(smoothed5X);
      landmarks17X.push(smoothed17X);
      landmarks0Y.push(smoothed0Y);
      landmarks5Y.push(smoothed5Y);
      landmarks17Y.push(smoothed17Y);
      landmarks0Z.push(smoothed0Z);
      landmarks5Z.push(smoothed5Z);
      landmarks17Z.push(smoothed17Z);
    }

    let centerX517 = (smoothed5X + smoothed17X) / 2;
    let centerY517 = (smoothed5Y + smoothed17Y) / 2;

    let angle =
      Math.atan2(centerY517 - smoothed0Y, centerX517 - smoothed0X) -
      Math.PI / 2;

    let distance5173D = pointsDistance3D(
      smoothed5X,
      smoothed5Y,
      smoothed5Z,
      smoothed17X,
      smoothed17Y,
      smoothed17Z
    );

    let distance503D = pointsDistance3D(
      smoothed5X,
      smoothed5Y,
      smoothed5Z,
      smoothed0X,
      smoothed0Y,
      smoothed0Z
    );

    let distance1703D = pointsDistance3D(
      smoothed17X,
      smoothed17Y,
      smoothed17Z,
      smoothed0X,
      smoothed0Y,
      smoothed0Z
    );

    let triangularDistance = (distance5173D + distance503D + distance1703D) / 3; //mean distgance between Pinky_MCP, Index_finger_MCP and Wrist

    let width =
      triangularDistance *
      canvasElement.width *
      palmJewelryWidthCoef * // projection of the wrist on XY plane
      wristWatchWidthCoef;

    let height = aspectRatioWatch * width;

    let centerXWatch =
      (smoothed0X - (centerX517 - smoothed0X) * centerCoef) *
      canvasElement.width;

    let centerYWatch =
      (smoothed0Y - (centerY517 - smoothed0Y) * centerCoef) *
      canvasElement.height;

    canvasCtx.translate(centerXWatch, centerYWatch);

    canvasCtx.rotate(angle);

    canvasCtx.translate(-centerXWatch, -centerYWatch);

    canvasCtx.drawImage(
      watchJewelryImage,
      centerXWatch - width / 2,
      centerYWatch - height / 2,
      width,
      height
    );

    if (i > 0) {
      landmarks0X.shift();
      landmarks5X.shift();
      landmarks17X.shift();
      landmarks0Y.shift();
      landmarks5Y.shift();
      landmarks17Y.shift();
      landmarks0Z.shift();
      landmarks5Z.shift();
      landmarks17Z.shift();
    }
}

function drawRing(landmarks, i, label){

    FINGER = dropDownList.options[dropDownList.selectedIndex].text;

    switch (FINGER) {
      case "pinky":
        mcpLandmark = 17;
        pipLandmark = 18;
        fingerDiameter = 1.2; //cm
        break;
      case "ring finger":
        mcpLandmark = 13;
        pipLandmark = 14;
        fingerDiameter = 1.5; //cm
        break;
      case "middle finger":
        mcpLandmark = 9;
        pipLandmark = 10;
        fingerDiameter = 1.6; //cm
        break;
      case "index finger":
        mcpLandmark = 5;
        pipLandmark = 6;
        fingerDiameter = 1.5; //cm
        break;
    }

    let gemStoneFingerWidthCoef = gemWidth / fingerDiameter;
    let ringFingerDiameterCoef = userInput("ringDiameter") / fingerDiameter; // how many times shank diameter is larger than hardcoded finger diameter

    const optionShank = imagesShankList.options[imagesShankList.selectedIndex];
    const selectedShankImageId = optionShank && optionShank.dataset.id;
    const imageShank = imagesShank.find((elem) => elem.id === selectedShankImageId) || {};

    shank.src = imageShank.src || "";

    const optionGem = imagesGemList.options[imagesGemList.selectedIndex];
    const selectedGemImageId = optionGem && optionGem.dataset.id;
    const imageGem =
      imagesGem.find((elem) => elem.id === selectedGemImageId) || {};

    gem.src = imageGem.src || "";
  
    //SMOOTHED COORDINATES
    let smoothedMCPX = fingerMCPX[fingerMCPX.length - 1] * exponentialSmoothing + (1 - exponentialSmoothing) * landmarks[mcpLandmark].x;
    let smoothedPIPX = fingerPIPX[fingerPIPX.length - 1] * exponentialSmoothing + (1 - exponentialSmoothing) * landmarks[pipLandmark].x;
    let smoothedMCPY = fingerMCPY[fingerMCPY.length - 1] * exponentialSmoothing + (1 - exponentialSmoothing) * landmarks[mcpLandmark].y;
    let smoothedPIPY = fingerPIPY[fingerPIPY.length - 1] * exponentialSmoothing + (1 - exponentialSmoothing) * landmarks[pipLandmark].y;
    let smoothedMCPZ = fingerMCPZ[fingerMCPZ.length - 1] * exponentialSmoothing + (1 - exponentialSmoothing) * landmarks[mcpLandmark].z;
    let smoothedPIPZ = fingerPIPZ[fingerPIPZ.length - 1] * exponentialSmoothing + (1 - exponentialSmoothing) * landmarks[pipLandmark].z;

    let smoothed5Z;
    let smoothed17Z;

    if (FINGER === "indexFinger") {
      smoothed5Z = smoothedMCPZ;
    } else {
      smoothed5Z = landmarks[5].z;
    }

    if (FINGER === "pinky") {
      smoothed17Z = smoothedMCPZ;
    } else {
      smoothed17Z = landmarks[17].z;
    }


    if (Math.abs(smoothed5Z - smoothed17Z) > ratio517) {
      console.log("Palm should be perpendicular to the camera");
      return;
    }

    if (label === "Right") {
      if (landmarks[17].x < landmarks[5].x * 0.9) {
        console.log("The outside of the palm shoud be facing the camera");
        return;
      }
    }

    if (label === "Left") {
      if (landmarks[5].x < landmarks[17].x * 0.9) {
        console.log("The outside of the palm shoud be facing the camera");
        return;
      }
    }

    let distance517 = pointsDistance2D(
      landmarks[5].x,
      landmarks[5].y,
      landmarks[17].x,
      landmarks[17].y
    );

    if (distance517 > tooCloseRatio) {
      console.log("Palm is too close to  the camera");
      return;
    }

    if (distance517 < tooFarRatio) {
      console.log("Palm is too far from the camera");
      return;
    }

    if (Math.abs(smoothedMCPZ - smoothedPIPZ) > ratioMCPPIPZ) {
      console.log("please straighten your fingers");
      return;
    }
    //PUSHING TO ARRAYS
    if (i === 0) {
      fingerMCPX.push(landmarks[mcpLandmark].x);
      fingerPIPX.push(landmarks[pipLandmark].x);
      fingerMCPY.push(landmarks[mcpLandmark].y);
      fingerPIPY.push(landmarks[pipLandmark].y);
      fingerMCPZ.push(landmarks[mcpLandmark].z);
      fingerPIPZ.push(landmarks[pipLandmark].z);
    } else {
      fingerMCPX.push(smoothedMCPX);
      fingerPIPX.push(smoothedPIPX);
      fingerMCPY.push(smoothedMCPY);
      fingerPIPY.push(smoothedPIPY);
      fingerMCPZ.push(smoothedMCPZ);
      fingerPIPZ.push(smoothedPIPZ);
    }

    let angle = -Math.atan(
      ((smoothedPIPX - smoothedMCPX) * canvasElement.width) /
        ((smoothedPIPY - smoothedMCPY) * canvasElement.height)
    );

    let mcpipDistance = pointsDistance2D(
      smoothedMCPX * canvasElement.width,
      smoothedMCPY * canvasElement.height,
      smoothedPIPX * canvasElement.width,
      smoothedPIPY * canvasElement.height
    );

    let fingerDiameterPX = mcpipDistance * fingerWidthMCPPIPdistanceCoef; // finger diameter distance in px

    let widthShank = fingerDiameterPX * ringFingerDiameterCoef;
    let heightShank = aspectRatioShank * widthShank;

    let widthGem = fingerDiameterPX * gemStoneFingerWidthCoef;
    let heightGem = aspectRatioGem * widthGem;

    let centerXRing =
      (smoothedMCPX + (smoothedPIPX - smoothedMCPX) * ringFingerCenterCoef) *
      canvasElement.width;

    let centerYRing =
      (smoothedMCPY + (smoothedPIPY - smoothedMCPY) * ringFingerCenterCoef) *
      canvasElement.height;
    
    canvasCtx.translate(centerXRing, centerYRing);

    canvasCtx.rotate(angle);

    canvasCtx.translate(-centerXRing, -centerYRing);

    canvasCtx.drawImage(
      shank,
      centerXRing - widthShank / 2,
      centerYRing - heightShank / 2,
      widthShank,
      heightShank
    );

    canvasCtx.drawImage(
      gem,
      centerXRing - widthGem / 2,
      centerYRing - heightGem / 2,
      widthGem,
      heightGem
    );
}

function onResults(results) {
  document.body.classList.add("loaded");  

  canvasElement.width = videoElement.videoWidth * finalVideoRatio;
  canvasElement.height = videoElement.videoHeight * finalVideoRatio;

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  canvasCtx.save();


  if (results.faceLandmarks) {
    const landmarks = results.faceLandmarks;
    drawEarrings(landmarks, i);  
    //canvasCtx.restore();
  }

  if ((results.rightHandLandmarks && !results.leftHandLandmarks) || (results.rightHandLandmarks && results.rightHandLandmarks[0].z < results.leftHandLandmarks[0].z)){
    console.log(results.rightHandLandmarks[0].z);
    const rightHandLandmarks = results.rightHandLandmarks;
    drawRing(rightHandLandmarks, i, "Right");
    canvasCtx.restore();
    canvasCtx.save();
    drawWatch(rightHandLandmarks, i, "Right");
    //canvasCtx.restore();
    
  }

  if ((results.leftHandLandmarks && !results.rightHandLandmarks) || (results.leftHandLandmarks && results.leftHandLandmarks[0].z < results.rightHandLandmarks[0].z)){
    console.log(results.leftHandLandmarks[0].z);
    const leftHandLandmarks = results.leftHandLandmarks;
    drawRing(leftHandLandmarks, i, "Left"); 
    canvasCtx.restore();
    canvasCtx.save();
    drawWatch(leftHandLandmarks, i, "Left");
    //canvasCtx.restore();
    
  }

  canvasCtx.restore();

  if (results.poseLandmarks){
    const poseLandmarks = results.poseLandmarks;
    drawPendant(poseLandmarks, i);
  }

  canvasCtx.restore();
  i++;
  

  totalCounts++;
  //console.log(totalCounts);

  currentTimeEnd = Date.now();

  FPS = (totalCounts / (currentTimeEnd - startTime)) * 1000; //time in miliseconds
  //console.log("FPS", FPS);

  exponentialSmoothing = Math.min(0.01 * FPS + 0.26, 0.9);
}

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  },
});
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.95,
});
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
});

startTime = Date.now();
camera.start();
