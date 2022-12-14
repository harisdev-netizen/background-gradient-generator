/*
 *  -------------------------------------  DOM variables  ----------------------------------------
 * */

let body = document.querySelector("body");
let colorPickers = document.querySelectorAll(".color-picker");
let colorPicker1 = document.querySelector(
  ".color-picker__container1"
).firstElementChild;
let colorPicker2 = document.querySelector(
  ".color-picker__container2"
).firstElementChild;
let anglePicker = document.querySelector(".js-angle");
let gradientCode = document.querySelectorAll(".js-gradient-code");
let rgbCode = document.querySelectorAll(".js-rgb-code");
let backgroundCopy = document.querySelector(".js-background-copy");
let buttonCopy = document.querySelector(".js-copy");
let codeEditorTabs = document.querySelectorAll(".code-editor__tab");
let rgbCodeContainer = document.querySelector(".rgb-code");
let gradientCodeContainer = document.querySelector(".gradient-code");
let randomButton = document.querySelector(".svg-random");
let anglePickerCircle = document.querySelector(".angle-picker__circle");
let anglePickerRect = document.querySelector(".angle-picker__rectangle");

/*
 *  -----------------------------------------  COLORS  ----------------------------------------------
 * */

// Add string "deg" to current angle
const addStringToDegree = () => {
  return anglePicker.value + "deg";
};

const getGradientCode = () => {
  let angle = addStringToDegree();
  return (
    "linear-gradient(" +
    angle +
    ", " +
    colorPicker1.value +
    ", " +
    colorPicker2.value +
    ")"
  );
};

const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// return rgb code of color picker from hexcode
const getRgbCode = () => {
  let rgbColor1 = hexToRgb(colorPicker1.value);
  let rgbColor2 = hexToRgb(colorPicker2.value);
  return [
    "rgb(" + rgbColor1.r + ", " + rgbColor1.g + ", " + rgbColor1.b + ");\n",
    "rgb(" + rgbColor2.r + ", " + rgbColor2.g + ", " + rgbColor2.b + ");\n",
  ];
};

const changeColorPickerBackground = () => {
  colorPickers.forEach(
    (picker) => (picker.parentElement.style.backgroundColor = picker.value)
  );
};

const changeBodyBackground = () => {
  body.style.background = getGradientCode();
};

const changeGradientCode = () => {
  gradientCode.forEach((code) => (code.innerHTML = getGradientCode() + ";"));
  backgroundCopy.style.background = getGradientCode();
};

const changeRgbCode = () => {
  let newRgbArray = getRgbCode();

  for (let i = 0; i < rgbCode.length; i++) {
    rgbCode[i].innerHTML = newRgbArray[i];
  }
};

const changeColor = () => {
  changeColorPickerBackground();
  changeBodyBackground();
  changeGradientCode();
  changeRgbCode();
};

colorPickers.forEach((colorPicker) =>
  colorPicker.addEventListener("input", changeColor)
);

/*
 *  -------------------------------------  GENERATE RANDOM  ------------------------------------------
 * */

const changePickerColor = (color1, color2) => {
  colorPicker1.value = color1;
  colorPicker2.value = color2;
};

const changeWithRandomAngle = (angle) => {
  anglePicker.value = angle;
};

const createRandomGradient = () => {
  let hexValues = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];

  let populate = (a) => {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hexValues[x];
      a += y;
    }
    return a;
  };

  let newColor1 = populate("#");
  let newColor2 = populate("#");
  let angle = Math.round(Math.random() * 360);
  let gradient =
    "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";

  return { newColor1, newColor2, gradient, angle };
};

const updateWithRandomGradient = () => {
  let randomGradient = createRandomGradient();
  body.style.background = randomGradient.gradient;
  changePickerColor(randomGradient.newColor1, randomGradient.newColor2);
  changeColorPickerBackground();
  changeWithRandomAngle(randomGradient.angle);
  let rotation = checkRotationDirection(randomGradient.angle);
  rotateCursor(rotation);
  changeGradientCode();
  changeRgbCode();
};

randomButton.addEventListener("click", updateWithRandomGradient);

/*
 *  ----------------------------------  CHANGE ANGLE IN INPUT  -------------------------------------
 * */

const checkNumbersOnly = (string) => {
  let numbers = /^[0-9]*$/;
  return !string.match(numbers);
};

const newTypedAngle = (event) => {
  if (checkNumbersOnly(event.target.value)) {
    anglePicker.value = NaN;
  } else {
    anglePicker.value = event.target.value;
    let rotation = checkRotationDirection(event.target.value);
    rotateCursor(rotation);
    changeBodyBackground();
    changeGradientCode();
  }
};

anglePicker.addEventListener("input", (e) => newTypedAngle(e));

/*
 *  ----------------------------------  CHANGE ANGLE WITH CIRCLE  -----------------------------------
 * */

// If some cord = 0 => we already know the angle
const checkCoordIsZero = (x, y) => {
  // Check if angle is zero / 90° / 180° or 270°
  if (x === 0 && (y === 0 || Math.sign(y) === 1)) {
    return 0;
  } else if (y === 0 && Math.sign(x) === 1) {
    return 90;
  } else if (x === 0 && Math.sign(y) === -1) {
    return 180;
  } else if (y === 0 && Math.sign(x) === -1) {
    return 270;
  } else return false;
};

// Get x and y coordinates of the click
const getCursorPosition = (e) => {
  // Get position related to viewport
  let circle = e.target.getBoundingClientRect();
  // Adding scroll top and left
  let scrollLeft = window.pageXOffset;
  let scrollTop = window.pageYOffset;
  // Get x & y coordinates of click
  let circleXaxis = e.pageX;
  let circleYaxis = e.pageY;
  // Get coordinates of click related to center of circle
  // We want a regular x & y axis so =>
  // x pos values = right | x neg values = left
  let x = circleXaxis - (circle.left + scrollLeft + circle.width / 2);
  // y pos values = top | y neg values = bottom
  let y = circle.top + scrollTop + circle.height / 2 - circleYaxis;

  let isZero = checkCoordIsZero(x, y);
  if (isZero !== false) {
    return isZero;
  } else return { x, y };
};
