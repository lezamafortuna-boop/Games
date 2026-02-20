//Memory Game Implementation

console.log("GAME JS LOADED");

const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const iconsBtn = document.getElementById("iconsMode");
const zodiacBtn = document.getElementById("zodiacMode");

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let score = 0;
let timer = 0;
let timerInterval = null;
let currentMode = null;

// Data sets
const icons = [
  "🍎","🍌","🍇","🍒","🍉","🍍",
  "⭐","🔥","⚡","🌙","❄️","🌈"
];

const images = Array.from({ length: 12 }, (_, i) => `images/img${i + 1}.png`);

// ---------- Helpers ----------

function lockModeButtons() {
  iconsBtn.disabled = true;
  zodiacBtn.disabled = true;
  iconsBtn.style.opacity = 0.5;
  zodiacBtn.style.opacity = 0.5;
}

function unlockModeButtons() {
  iconsBtn.disabled = false;
  zodiacBtn.disabled = false;
  iconsBtn.style.opacity = 1;
  zodiacBtn.style.opacity = 1;
}

function resetState() {
  clearInterval(timerInterval);
  timer = 0;
  score = 0;
  matchedCount = 0;
  flippedCards = [];
  timerDisplay.textContent = "0";
  scoreDisplay.textContent = "0";
  gameBoard.innerHTML = "";
}

// ---------- Game core ----------
//entry point to start the game
function startGame(mode) {
  currentMode = mode; // Set the current mode wheter icons or zodiac
  resetState(); // Reset the game state for a new game
  lockModeButtons(); // prevent mode switching during an active game

  const sourceArray = mode === "icons" ? icons : images; //if mode is icons use icons array otherwise use images array

  cards = [...sourceArray, ...sourceArray]; // Create pairs by duplicating the source array
  cards.sort(() => Math.random() - 0.5); // Shuffle the cards randomly

  cards.forEach((value, index) => { // Create card elements according to the shuffled cards
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value; // Store the card's value in a data attribute for easy access during matching
    card.dataset.index = index; // position of the card in the shuffled array (not strictly necessary but can be useful for debugging)
    card.addEventListener("click", () => flipCard(card, mode)); // Add click event listener to handle card flipping
    gameBoard.appendChild(card); // Add the card to the game board
  });

  startTimer(); // Start the game timer
}

function flipCard(card, mode) { // Handle card flipping logic
  if (flippedCards.length === 2) return; // Prevent flipping more than 2 cards at a time
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return; // Prevent flipping already flipped or matched cards

  card.classList.add("flipped"); // Add flipped class to show the card's content

  if (mode === "icons") { // If the mode is icons, display the emoji directly as text content
    card.textContent = card.dataset.value; // The dataset value contains the emoji character for icons mode
  } else {
    const img = document.createElement("img"); // For zodiac mode, create an img element and set its source to the corresponding image path
    img.src = card.dataset.value; // The dataset value contains the image path for zodiac mode
    card.appendChild(img); // Add the image to the card element to display it
  }

  flippedCards.push(card); // Add the flipped card to the array of currently flipped cards

  if (flippedCards.length === 2) { // If two cards are flipped, check for a match
    checkMatch(mode); // Pass the current mode to the checkMatch function to handle matching logic accordingly
  }
}
// Check if the two flipped cards match and update the game state accordingly
function checkMatch(mode) { 
  const [card1, card2] = flippedCards; // Destructure the flippedCards array to get the two flipped card elements

  if (card1.dataset.value === card2.dataset.value) { // Check if the data values of the two cards match (same emoji or same image path)
    card1.classList.add("matched"); // If they match, add the matched class to both cards to visually indicate they are matched
    card2.classList.add("matched"); // This will typically change their appearance (e.g., keep them face up and maybe change their background color)
    score += 10; // Increase the score by 10 points for a correct match
    matchedCount++; // Increment the count of matched pairs

    const totalPairs = mode === "icons" ? icons.length : images.length; // Determine the total number of pairs based on the current mode (12 pairs for both icons and zodiac)
    if (matchedCount === totalPairs) { // If the number of matched pairs equals the total pairs, it means the game is completed
      alert(`Congratulations! You've completed the game in ${timer} seconds with a score of ${score}!`); // Show a congratulatory message with the final time and score
      clearInterval(timerInterval); // Stop the timer since the game is completed
      unlockModeButtons(); // Unlock the mode buttons to allow starting a new game  
    }
  } else { // If the cards do not match, deduct points and flip them back after a short delay
    score -= 2; // Deduct 2 points for an incorrect match
    setTimeout(() => { // Use a timeout to allow the player to see the second card before flipping both back over
      card1.classList.remove("flipped"); // Remove the flipped class to hide the card's content again
      card2.classList.remove("flipped"); // This will typically flip the cards back to their face-down state
      card1.innerHTML = ""; // Clear the card's content (remove the emoji or image) to reset it for the next attempt
      card2.innerHTML = ""; // Clear the card's content (remove the emoji or image) to reset it for the next attempt
    }, 800); // Flip back after 800 milliseconds to give the player a moment to see the second card       
  }

  scoreDisplay.textContent = score; // Update the score display with the current score after checking for a match
  flippedCards = []; // Reset the flippedCards array to allow for the next pair of cards to be flipped and checked for a match
}

function startTimer() { // Start the game timer and update the display every second
  timerInterval = setInterval(() => { // Use setInterval to increment the timer every second
    timer++;
    timerDisplay.textContent = timer; // Update the timer display with the current time in seconds
  }, 1000); // Increment the timer every 1000 milliseconds (1 second)
}

// ---------- Events ----------

iconsBtn.addEventListener("click", () => { // Start the game in icons mode when the icons button is clicked
  if (!currentMode) startGame("icons"); // Check if there is no current mode active before starting a new game to prevent restarting the game while it's already in progress
});

zodiacBtn.addEventListener("click", () => { // Start the game in zodiac mode when the zodiac button is clicked
  if (!currentMode) startGame("zodiac"); // Check if there is no current mode active before starting a new game to prevent restarting the game while it's already in progress
});

restartBtn.addEventListener("click", () => { // Restart the game when the restart button is clicked
  currentMode = null; // Reset the current mode to allow starting a new game in either mode
  resetState(); // Reset the game state to start fresh
  unlockModeButtons(); // Unlock the mode buttons to allow the player to choose a mode for the new game
});

