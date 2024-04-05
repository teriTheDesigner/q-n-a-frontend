document.addEventListener("DOMContentLoaded", function () {
  start();
});

let categorizedQuestions = {};

async function start() {
  registerButtons();
  await getQuestions();
  categorizeQuestions();
}

function registerButtons() {
  document.querySelector(".card").addEventListener("click", flipCard);
}

async function getQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    categorizedQuestions = data.categories.reduce((acc, category) => {
      acc[category.name] = category.questions;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function categorizeQuestions() {
  const categoryCardsContainer = document.querySelector(".category-cards");

  const colors = ["#7bd1f5", "#ffb347", "#ff6961", "#77dd77", "#d4aaff"];

  let colorIndex = 0;
  for (const category in categorizedQuestions) {
    const categoryDeck = document.createElement("div");
    categoryDeck.classList.add("category-deck");

    categorizedQuestions[category].forEach((question) => {
      const card = document.createElement("div");
      card.classList.add("category-card");
      card.style.backgroundColor = colors[colorIndex];

      const front = document.createElement("div");
      front.classList.add("front");
      front.innerText = question.question;

      card.appendChild(front);

      categoryDeck.appendChild(card);
    });

    categoryCardsContainer.appendChild(categoryDeck);

    colorIndex = (colorIndex + 1) % colors.length;
  }
}

function flipCard() {
  const card = document.querySelector(".card");
  card.classList.toggle("flipped");
}
