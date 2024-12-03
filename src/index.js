/**
 * DOM SELECTORS
 */
const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = [];
let playerSequence = [];
let maxRoundCount = 0;
let roundCount = 0;

/**
 * The `pads` array contains objects for each pad.
 * Each object contains the pad's color, selector, and sound.
 */
const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */
startButton.addEventListener("click", startButtonHandler);
padContainer.addEventListener("click", padHandler);

/**
 * EVENT HANDLERS
 */
function startButtonHandler() {
  maxRoundCount = setLevel(1); // Default level
  roundCount = 1;
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  setText(statusSpan, "Game Started!");
  playComputerTurn();
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find((p) => p.color === color);
  pad.sound.play();
  checkPress(color);
  return color;
}

/**
 * HELPER FUNCTIONS
 */
function setLevel(level = 1) {
  const levels = { 1: 8, 2: 14, 3: 20, 4: 31 };
  return levels[level] || "Please enter level 1, 2, 3, or 4";
}

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function setText(element, text) {
  element.textContent = text;
}

function activatePad(color) {
  const pad = pads.find((p) => p.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();
  setTimeout(() => pad.selector.classList.remove("activated"), 500);
}

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => activatePad(color), index * 600);
  });
}

function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  const randomColor = getRandomItem(pads).color;
  computerSequence.push(randomColor);
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(), computerSequence.length * 600 + 1000);
}

function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(statusSpan, "Your turn! Repeat the sequence.");
  playerSequence = [];
}

function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;

  if (playerSequence[index] !== computerSequence[index]) {
    resetGame("Incorrect sequence! Game over.");
    return;
  }

  const remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Presses left: ${remainingPresses}`);

  if (remainingPresses === 0) {
    checkRound();
  }
}

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You won the game!");
    return;
  }

  roundCount++;
  setText(statusSpan, "Nice! Get ready for the next round...");
  setTimeout(() => playComputerTurn(), 1000);
}

function resetGame(text) {
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
}

/**
 * Expose variables for testing purposes.
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;