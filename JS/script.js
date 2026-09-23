const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const restartBtn = document.getElementById("restart-btn");

let dimension = 150;
let imgStart = Math.floor(Math.random() * 100 + 1);


let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedCount = 0;
let seconds = 0;
let timerInterval = null;

const images = [];
for (let i = imgStart; i <= imgStart + 7; i++) {
  images.push(`https://picsum.photos/seed/${i}/${dimension}/${dimension}`);
}

cards = [...images, ...images];

console.log(cards);

/*
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // On échange les deux places
  
  }
}*/

function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function initGame() {
  board.innerHTML = "";
  moves = 0;
  matchedCount = 0;
  seconds = 0;
  stopTimer();
  resetTurn();

  if (movesDisplay) movesDisplay.textContent = `Coups : 0`;
  if (timerDisplay) timerDisplay.textContent = `Temps : 00:00`;
  if (resultDisplay) resultDisplay.textContent = "";
  restartBtn.style.display = "none"; // Cacher le bouton au début

  shuffle(cards);
  cards.forEach(imgUrl => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.dataset.value = imgUrl;

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    board.appendChild(card);
    card.addEventListener('click', () => handleCardClick(card));

  });


}

function handleCardClick(card) {
  if (lockBoard
    || card.classList.contains("matched") // deja decouverte
    || card === firstCard  // double click
    || card.firstChild) /* carte est deja découverte car son enfant = image */ {
    return;
  }

  if (moves === 0 && !firstCard) {
    restartBtn.style.display = "block"; // Afficher le bouton au premier clic
    startTimer(); // Lancer le timer
  }

  revealCard(card); // Tout est bon, on affiche l'image de la carte
  if (!firstCard) {
    firstCard = card; // C'est la première carte du tour
    return;
  }
  secondCard = card;
  lockBoard = true; // On bloque le plateau le temps de vérifier
  moves++;
  if (movesDisplay) movesDisplay.textContent = `Coups : ${moves}`;
  checkMatch();
}
function revealCard(card) {
  const img = document.createElement("img");
  img.src = card.dataset.value;
  img.alt = "Image de mémoire";
  card.appendChild(img);
}

function checkMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;
  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCount += 2;
    resetTurn();
    checkVictory();
  } else {
    // On attend 0.8 seconde avant de cacher les images
    setTimeout(() => {
      firstCard.innerHTML = "";
      secondCard.innerHTML = "";
      resetTurn(); // On débloque le plateau pour le coup suivant
    }, 800);
  }
}
function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkVictory() {
  if (matchedCount === cards.length) {
    stopTimer();
    if (resultDisplay) resultDisplay.textContent = `Victoire ! Coups : ${moves} | Temps : ${formatTime(seconds)}`;
  }
}
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    if (timerDisplay) timerDisplay.textContent = `Temps : ${formatTime(seconds)}`;
  }, 1000);
}
function stopTimer() {
  clearInterval(timerInterval);
}
function formatTime(sec) {
  const min = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}
// Liaisons finales
initGame();
restartBtn.addEventListener("click", initGame);


