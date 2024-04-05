document.addEventListener("DOMContentLoaded", function () {
  start();
});

let categorizedQuestions = {};

async function start() {
  registerButtons();
  await getQuestions();
}

function registerButtons() {
  document.querySelector(".card").addEventListener("click", flipCard);
  const buttons = document.querySelectorAll(".categories button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      zoomInCard();
      document.querySelector(".overlay").style.display = "none";
    });
  });
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

function flipCard() {
  const card = document.querySelector(".card");
  card.classList.toggle("flipped");
}

function zoomInCard() {
  const container = document.querySelector(".container");
  container.classList.add("zoom-in");
}
